import * as Board from 'rpi-led-matrix-painter';
// import { connect } from 'mqtt';
import { SignSettingsInstance } from './sign_configs/generic';
import { canvasSectionsWithReplacedValues, preValidateDateTime } from './utils/replaceValues';
import { SignSettings } from './interfaces/signSettings';
import { CanvasSectionSettings } from 'rpi-led-matrix-painter/dist/canvassectionsettings';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testCanvasSection: CanvasSectionSettings[] = [
  {
    name: 'scrollTest',
    x: 0,
    y: 16,
    z: 4,
    width: 64,
    height: 16,
    representation: [
      {
        id: 'scrolltest',
        drawMode: Board.DrawMode.TEXT,
        color: 0x800000,
        drawModeOptions: {
          fill: false,
          font: '6x12',
          fontPath: '/home/pi/rpi-led-matrix-painter-mqtt/fonts/6x12.bdf',
          effects: [{ effectType: Board.EffectType.SCROLLLEFT, effectOptions: { rate: 50 } }],
        },
        points: { x: 0, y: 0, z: 1 },
        text: 'timeString',
        layer: 6,
      },
    ],
  },
];

const testSetCanvasSection: Board.PaintingInstruction[] = [
  {
    id: 'scrolltest',
    drawMode: Board.DrawMode.TEXT,
    color: 0x800000,
    drawModeOptions: {
      fill: false,
      font: '6x12',
      fontPath: '/home/pi/rpi-led-matrix-painter-mqtt/fonts/6x12.bdf',
      effects: [{ effectType: Board.EffectType.SCROLLLEFT, effectOptions: { rate: 50 } }],
    },
    points: { x: 0, y: 0, z: 1 },
    text: 'timeString',
    layer: 6,
  },
];
export class MyClass {
  signSettingsInstance: SignSettings;
  myPainter: Board.Painter;

  constructor(signSettingsInstance: SignSettings) {
    this.signSettingsInstance = signSettingsInstance;
    this.myPainter = this.myNewPainter(signSettingsInstance);
  }

  private myNewPainter(sign: SignSettings): Board.Painter {
    return new Board.Painter(
      {
        ...Board.RpiLedMatrix.LedMatrix.defaultMatrixOptions(),
        ...sign.matrixOptions,
      },
      {
        ...Board.RpiLedMatrix.LedMatrix.defaultRuntimeOptions(),
        ...sign.runtimeOptions,
      },
    );
  }

  public async start(): Promise<void> {
    this.signSettingsInstance.canvasSections.forEach((canvasSection) => {
      this.myPainter
        .getCanvas()
        .addCanvasSection(
          new Board.CanvasSection(
            canvasSection.name,
            canvasSection.x,
            canvasSection.y,
            canvasSection.z,
            canvasSection.width,
            canvasSection.height,
            [],
            canvasSection.overflow || true,
          ),
        );
    });

    this.myPainter.getCanvas().addCanvasSection(new Board.CanvasSection('scrollTest', 0, 16, 4, 64, 16, [], true));

    if (await preValidateDateTime(this.signSettingsInstance)) this.demo();
    console.log(JSON.stringify(canvasSectionsWithReplacedValues(this.signSettingsInstance.canvasSections), null, 2));
  }

  public startTime: number = new Date().getTime();
  private endTime: number = new Date().getTime() + 86400000;
  public currentTime: number = new Date().getTime();

  public demo(): void {
    this.myPainter.getCanvas().setCanvas(canvasSectionsWithReplacedValues(this.signSettingsInstance.canvasSections));
    // this.myPainter.getCanvas().setCanvas(testCanvasSection);
    // this.myPainter.getCanvas().setCanvasSection('scrollTest', testSetCanvasSection);
    this.myPainter.getCanvas().setCanvasSection('scrollTest', [
      {
        id: 'scrolltest',
        drawMode: Board.DrawMode.TEXT,
        color: 0x800000,
        drawModeOptions: {
          fill: false,
          font: '6x12',
          fontPath: '/home/pi/rpi-led-matrix-painter-mqtt/fonts/6x12.bdf',
          effects: [{ effectType: Board.EffectType.SCROLLLEFT, effectOptions: { rate: 50 } }],
        },
        points: { x: 0, y: 0, z: 1 },
        text: 'timeString',
        layer: 6,
      },
    ]);

    this.myPainter.paint();

    if (new Date().getTime() <= this.endTime) {
      setTimeout(() => {
        this.demo();
      }, 50);
    } else {
      console.log('Quitting');
    }
  }
}

const myClassInstance = new MyClass(SignSettingsInstance);
myClassInstance.start();
