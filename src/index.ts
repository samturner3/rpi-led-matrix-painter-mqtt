import * as Board  from "rpi-led-matrix-painter";

export class MyClass {

    private mypainter = new Board.Painter({
            ...Board.Matrix.defaultMatrixOptions(),
            rows: 32,
            cols: 64,
            chainLength: 1
        }, {
            ...Board.Matrix.defaultRuntimeOptions(),
            gpioSlowdown: 4
        });

    public test(): void {
        this.mypainter.getCanvas().addCanvasSection(new Board.CanvasSection(0, 0, 1, 64, 32, [
            {
                drawMode: Board.DrawMode.TEXT,
                drawModeOptions: {
                    color: 0xFF0000,
                    font: "4x6",
                    fontPath: "/home/pi/code/rpi-led-matrix-painter/rpi-led-matrix-painter/dist/fonts/4x6.bdf"
                },
                points: [{x: 0, y: 0, z: 0}],
                text: "Hello!"
            }
        ], false, 1, "entireboard"));
    }

    public testCanvasSectionUpdate(): void {
        this.mypainter.getCanvas().getCanvasSection("entireboard")?.setRepresentation([
            {
                drawMode: Board.DrawMode.RECTANGLE,
                drawModeOptions: {
                    color: 0x00FF00,
                    fill: true
                },
                points: [{x: 0, y: 0, z: 0}]
            }
        ]);
    }

}

const myclassinstance = new MyClass();
myclassinstance.test();
setTimeout(() => {myclassinstance.testCanvasSectionUpdate()}, 10000);
setTimeout(() => {}, 40000);
