import { InjectionToken } from '@angular/core';
import { IpcRenderer, IpcRendererEvent } from 'electron';

export const IPC = new InjectionToken<IpcRenderer>(
  'An abstraction over IPCRenderer on Electron',
  {
    factory: () => {
      return (window as any).ipcRenderer ?? {
        invoke(channel: string, ...args: any[]) { },
        on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) { },
        once(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) { },
        postMessage(channel: string, message: any, transfer?: MessagePort[]) { },
        removeAllListeners(channel: string) { },
        removeListener(channel: string, listener: (...args: any[]) => void) { },
        send(channel: string, ...args: any[]) { },
        sendSync(channel: string, ...args: any[]) { },
        sendTo(webContentsId: number, channel: string, ...args: any[]) { },
        sendToHost(channel: string, ...args: any[]) { }
      };
    },
  },
);
