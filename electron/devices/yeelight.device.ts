import { DeviceInfo, State, Device } from './device.model';
import { Discovery, Device as Control } from 'yeelight-platform';

class Yeelight extends Device {

  id: string;
  name: string;
  address: string;
  type = 'yeelight';

  private controller: any;

  static async discover() {
    const discovery = new Discovery();
    const lights: any[] = [];
    discovery.on('didDiscoverDevice', l => lights.push(l));
    discovery.listen();

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(lights);
        const devices = lights.map(e => {
          return {
            id: e.id,
            name: `Yeelight ${e.model}`,
            address: e.host,
            type: 'yeelight'
          };
        });
        resolve(devices as DeviceInfo[]);
      }, 5000);
    });
  }

  async connect(device: DeviceInfo) {
    this.id = device.id;
    this.name = device.name;
    this.address = device.address;
    this.config = device.config;
    this.controller = new Control({ host: this.address, port: 55443 });
    return new Promise((resolve) => {
      this.controller.connect()
      this.controller.on('connected', () => {
        return resolve({
          power: this.controller.power === 'on' ? true : false,
          color: {
            r: ((this.controller.rgb >> 16) & 0xff),
            g: ((this.controller.rgb >> 8) & 0xff),
            b: (this.controller.rgb & 0xff),
          }
        } as State);
      });
    });
  }

  async getState(): Promise<State> {
    // TODO
    return Promise.resolve({} as State)
  }

  setColor(color: { r: number, g: number, b: number }) {
    this.controller.sendCommand({
      id: -1,
      method: 'set_rgb',
      params: [(color.r * 65536) + (color.g * 256) + color.b, 'smooth', 300]
    });
  }

  setPower(power: boolean) {
    this.controller.sendCommand({
      id: -1,
      method: 'set_power',
      params: [`${power ? 'on' : 'off'}`, 'smooth', 300]
    });
  }

}

export default Yeelight;
