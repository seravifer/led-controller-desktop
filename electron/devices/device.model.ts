export interface DeviceInfo {
  id: string;
  name: string;
  address: string;
  type: string;
  config?: any;
}

export interface State {
  power: boolean;
  color: {
    r: number;
    g: number;
    b: number;
  };
}

export abstract class Device {
  id: string;
  name: string;
  address: string;
  config?: any;
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/34516
  static abstract discovery(): Promise<DeviceInfo>;
  // @ts-ignore
  static abstract connect(): Promise<State>;
  // @ts-ignore
  abstract getState(): Promise<State>;
  // abstract getState(): Promise<State>;
  abstract setColor(color: { r: number; g: number; b: number }): void;
  abstract setPower(power: boolean): void;
}
