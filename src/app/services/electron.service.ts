import { InjectionToken } from '@angular/core';

export interface IpcRenderer {
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  on: (channel: string, listener: (event: any, ...args: any[]) => void) => () => void;
  send:(channel: string, ...args: any[]) => void;
}

export const IPC = new InjectionToken<IpcRenderer>(
  'An abstraction over IPCRenderer on Electron',
  {
    factory: () => {
      return (window as any).ipcRenderer ?? {
        invoke(channel: string, ...args: any[]) { },
        on(channel: string, listener: (event: any, ...args: any[]) => void) { },
        send(channel: string, ...args: any[]) { },
      };
    },
  },
);
