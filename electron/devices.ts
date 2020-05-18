import { Lookup } from "node-yeelight-wifi";
import { EventEmitter } from 'events';

class Devices  extends EventEmitter {

  discover() {
    const yeelight = new Lookup();
    yeelight.on("detected", (device) => {
      console.log(device);
      this.emit('new-device', device);
    });
  }

  connectTo(id: string) {
    return new Promise((resolve) => {
      const yeelight = new Lookup();
      yeelight.on("detected", (device) => {
        if (id === device.id) return resolve(device);
      });
    })
  }

}

export default Devices;
