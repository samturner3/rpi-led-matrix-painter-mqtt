import * as Board from "rpi-led-matrix-painter";
import { connect } from "mqtt";
import { SignSettingsInstance } from "../sign_configs/generic";
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
    SignSettingsInstance.canvasSections.forEach((canvasSection) => {
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
            canvasSection.representation,
            canvasSection.overflow
          )
        );
    });

    this.demo();
  }

  private leadingZeroes(num: number, digits: number): string {
    return ("0".repeat(digits) + num.toString()).substr(
      num.toString().length,
      digits + 1
    );
  }

  public startTime: number = new Date().getTime();
  private endTime: number = new Date().getTime() + 86400000;
  public currentTime: number = new Date().getTime();

  public demo(): void {
    const date: Date = new Date();
    const timeString: string =
      this.leadingZeroes(date.getHours(), 2) +
      ":" +
      this.leadingZeroes(date.getMinutes(), 2) +
      ":" +
      this.leadingZeroes(date.getSeconds(), 2) +
      "." +
      this.leadingZeroes(date.getMilliseconds(), 3);
    const dateString: string =
      date.getFullYear() +
      "-" +
      this.leadingZeroes(date.getMonth() + 1, 2) +
      "-" +
      this.leadingZeroes(date.getDate(), 2);

    // this.myPainter.getCanvas().setCanvas(SignSettingsInstance.canvasSections);

    // Update time and date
    this.myPainter
      .getCanvas()
      .setCanvasSection(
        "time and date",
        SignSettingsInstance.canvasSections[0].representation
      );

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
