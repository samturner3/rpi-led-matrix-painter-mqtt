import { SignSettings, DefaultState } from '../interfaces/signSettings';
import * as Board from 'rpi-led-matrix-painter';
import * as dotenv from 'dotenv';

dotenv.config();

export const SignSettingsInstance: SignSettings = {
  name: process.env.SIGN_NAME as string,
  matrixOptions: {
    rows: 32,
    cols: 64,
    chainLength: 1,
    hardwareMapping: Board.RpiLedMatrix.GpioMapping.AdafruitHatPwm,
    // pixelMapperConfig: Board.RpiLedMatrix.LedMatrixUtils.encodeMappers(
    //   { type: Board.RpiLedMatrix.PixelMapperType.U },
    //   { type: Board.RpiLedMatrix.PixelMapperType.Rotate, angle: 180 }
    // ),
  },
  runtimeOptions: {
    gpioSlowdown: 3,
    dropPrivileges: 0,
  },
  mqttOptions: {
    brokerUrl: process.env.MQTT_BROKER_IP as string,
    connectionOptions: {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    },
  },
  defaultState: DefaultState.TIME,
  canvasSections: [
    {
      name: 'time and date',
      x: 0,
      y: 0,
      z: 1,
      width: 64,
      height: 16,
      overflow: true,
      representation: [
        {
          id: 'time',
          drawMode: Board.DrawMode.TEXT,
          color: 0x800000,
          drawModeOptions: {
            fill: false,
            font: '5x7',
            fontPath: '/home/pi/rpi-led-matrix-painter-mqtt/fonts/5x7.bdf',
            // effects: [{ effectType: Board.EffectType.SCROLLLEFT, effectOptions: { rate: 50 } }],
          },
          points: { x: 0, y: 0, z: 1 },
          // text: 'Hi',
          text: '@@HH:mm:ss:SSS@@',
          layer: 5,
        },
        {
          id: 'date',
          drawMode: Board.DrawMode.TEXT,
          color: 0x800000,
          drawModeOptions: {
            fill: false,
            font: '4x6',
            fontPath: '/home/pi/rpi-led-matrix-painter-mqtt/fonts/4x6.bdf',
          },
          points: { x: 0, y: 8, z: 1 },
          text: '@@yyyy-MM-dd@@',
          layer: 6,
        },
      ],
    },
    // {
    //   name: 'scrollTest',
    //   x: 0,
    //   y: 0,
    //   z: 4,
    //   width: 64,
    //   height: 32,
    //   representation: [
    //     {
    //       id: 'scrolltest',
    //       drawMode: Board.DrawMode.TEXT,
    //       color: 0x800000,
    //       drawModeOptions: {
    //         fill: false,
    //         font: '6x12',
    //         fontPath: '/home/pi/rpi-led-matrix-painter-mqtt/fonts/6x12.bdf',
    //         effects: [
    //           // { effectType: Board.EffectType.SCROLLLEFT, effectOptions: { rate: 50 } },
    //           // { effectType: Board.EffectType.BLINK, effectOptions: { rate: 500 } },
    //         ],
    //       },
    //       points: { x: 0, y: 0, z: 1 },
    //       text: '@@HH:mm:ss:SSS@@',
    //       layer: 6,
    //     },
    //   ],
    // },
  ],
};
