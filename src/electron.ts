import { IpcRenderer } from 'electron' // this is just an interface

let ipcRenderer;
if ((window as any).ipcRenderer) {
   ipcRenderer = (window as any).ipcRenderer;
} else {
  ipcRenderer = {
    events: {},
    on(event: any, handler: any) {},
    send(event: any, data: any) {},
    removeAllListeners(event: any) {}
  };
}

export default ipcRenderer as IpcRenderer;
