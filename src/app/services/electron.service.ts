import { InjectionToken } from '@angular/core';

export interface IpcInterface {
  invoke<T>(channel: string, ...args: any[]): Promise<T>;
  on<T>(channel: string, listener: (event: T, ...args: any[]) => void): () => void;
  send(channel: string, ...args: any[]): void;
}

export const IPC = new InjectionToken<IpcInterface>(
  'An abstraction over IPCRenderer on Electron',
  {
    factory: () => (window as any).ipc
  }
);
