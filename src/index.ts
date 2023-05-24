import * as Board from "rpi-led-matrix-painter";
import { connect } from "mqtt";
import { SignSettingsInstance } from "./sign_configs/generic";
import { canvasSectionsWithReplacedValues } from "./utils/replaceValues";
export class MyClass {
  private myPainter = new Board.Painter(
    {
      ...Board.RpiLedMatrix.LedMatrix.defaultMatrixOptions(),
      ...SignSettingsInstance.matrixOptions,
    },
    {
      ...Board.RpiLedMatrix.LedMatrix.defaultRuntimeOptions(),
      ...SignSettingsInstance.runtimeOptions,
    }
  );

  public start(): void {
    // SignSettingsInstance.canvasSections.forEach((canvasSection) => {
    this.myPainter
      .getCanvas()
      .addCanvasSection(
        new Board.CanvasSection(
          SignSettingsInstance.canvasSections[0].name,
          SignSettingsInstance.canvasSections[0].x,
          SignSettingsInstance.canvasSections[0].y,
          SignSettingsInstance.canvasSections[0].z,
          SignSettingsInstance.canvasSections[0].width,
          SignSettingsInstance.canvasSections[0].height,
          [],
          SignSettingsInstance.canvasSections[0].overflow || true
        )
      );
    // });

    this.demo();
  }

  public startTime: number = new Date().getTime();
  private endTime: number = new Date().getTime() + 86400000;
  public currentTime: number = new Date().getTime();

  public demo(): void {
    this.myPainter
      .getCanvas()
      .setCanvas(
        canvasSectionsWithReplacedValues(SignSettingsInstance.canvasSections)
      );

    // Update time and date
    // this.myPainter.getCanvas().setCanvas([
    //   {
    //       name: "time and date",
    //       x: 0,
    //       y: 0,
    //       z: 1,
    //       width: 73,
    //       height: 13,
    //       representation: [
    //           {
    //               id: "time",
    //               drawMode: Board.DrawMode.TEXT,
    //               color: 0x800000,
    //               drawModeOptions: {fill: true, font: "5x7", "fontPath": "/home/pi/rpi-led-matrix-painter-mqtt/fonts/5x7.bdf"},
    //               points: {x: 0, y:0, z: 1},
    //               text: timeString,
    //               layer: 5
    //           }, {
    //               id: "date",
    //               drawMode: Board.DrawMode.TEXT,
    //               color: 0x800000,
    //               drawModeOptions: {fill: false, font: "4x6", "fontPath": "/home/pi/rpi-led-matrix-painter-mqtt/fonts/4x6.bdf"},
    //               points: {x: 0, y: 8, z: 1},
    //               text: dateString,
    //               layer: 6
    //           }
    //       ]
    //   },
    // ]);
    // this.myPainter
    //   .getCanvas()
    //   .setCanvas(
    //     SignSettingsInstance.canvasSections
    //   );

    this.myPainter.paint();

    if (new Date().getTime() <= this.endTime) {
      setTimeout(() => {
        this.demo();
      }, 5);
    } else {
      console.log("Quitting");
    }

    // if(new Date().getTime() <= this.endTime){
    //     setTimeout(() => {this.demo();}, 5);
    // }
    // else {
    //     console.log("Quitting");
    // }
  }
}

const myclassinstance = new MyClass();
myclassinstance.start();
