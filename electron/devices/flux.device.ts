import { Discovery, Control } from 'magic-home';
import { DeviceInfo, State, Device } from './device.model';

class Flux extends Device {

  id: string;
  name: string;
  address: string;
  type = 'flux';

  private controller: any;

  static async discover() {
    const discovery = new Discovery();
    let devices = await discovery.scan(1000);
    devices = devices.map(device => {
      return {
        id: device.id,
        name: device.model,
        address: device.address,
        type: 'flux'
      };
    });
    return Promise.resolve(devices as DeviceInfo[]);
  }

  async connect(device: DeviceInfo) {
    this.id = device.id;
    this.name = device.name;
    this.address = device.address;
    this.config = device.config;
    this.controller = new Control(device.address, { wait_for_reply: false });
    return this.getState();
  }

  async getState() {
    const state = await this.controller.queryState();
    console.log(state);
    return {
      power: state.on,
      color: {
        r: state.color.red,
        g: state.color.green,
        b: state.color.blue,
      }
    } as State;
  }

  setColor(color: { r: number, g: number, b: number }) {
    // TODO: check power
    this.controller.setColor(color.r, color.g, color.b);
  }

  setPower(power: boolean) {
    this.controller.setPower(power);
  }

}

export default Flux;
