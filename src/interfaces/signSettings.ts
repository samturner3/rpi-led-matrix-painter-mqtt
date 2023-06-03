import * as Board from 'rpi-led-matrix-painter';
import { IClientOptions } from 'mqtt';
import { CanvasSectionSettings } from 'rpi-led-matrix-painter/dist/canvassectionsettings';

// If not defined, default MatrixOptions and runtimeOptions will be used.
export interface SignSettings {
  name: string;
  matrixOptions?: Partial<Board.RpiLedMatrix.MatrixOptions>;
  runtimeOptions?: Partial<Board.RpiLedMatrix.RuntimeOptions>;
  mqttOptions: SignMqttOptions;
  defaultState: DefaultState;
  canvasSections: CanvasSectionSettings[];
}

/**
 * MQTT settings to connect to the broker for this individual sign
 */
interface SignMqttOptions {
  signId?: string; // If different to SignSettings.name
  brokerUrl: string;
  connectionOptions?: IClientOptions;
}

export enum DefaultState {
  OFF,
  TIME,
  STATIC_TEXT,
}
