export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface Device {
  id: string;
  name: string;
  address: string;
  type: string;
  state?: any;
  config?: any;
}
