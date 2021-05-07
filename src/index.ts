import * as Board from "rpi-led-matrix-painter";

export class MyClass {

    private pixelMapperConfig = Board.RpiLedMatrix.LedMatrixUtils.encodeMappers({"type": Board.RpiLedMatrix.PixelMapperType.U}, {"type": Board.RpiLedMatrix.PixelMapperType.Rotate, "angle": 180});
    private endTime: number = new Date().getTime() + 30000;
    private mypainter = new Board.Painter({
            ...Board.RpiLedMatrix.LedMatrix.defaultMatrixOptions(),
            rows: 32,
            cols: 64,
        chainLength: 2,
        pixelMapperConfig: this.pixelMapperConfig
        
        },
        {
            ...Board.RpiLedMatrix.LedMatrix.defaultRuntimeOptions(),
            gpioSlowdown: 3
        });

    public start(): void {

        this.mypainter.getCanvas().addCanvasSection(new Board.CanvasSection(0, 0, 1, 73, 13, [], true, 1, "clock"));

        this.mypainter.getCanvas().addCanvasSection(new Board.CanvasSection(0, 16, 2, 27, 7, [], true, 2, "icons"));

        this.mypainter.getCanvas().addCanvasSection(new Board.CanvasSection(45, 0, 0, 32, 32, [], true, 3, "bottomlayer"));

        this.mypainter.getCanvas().addCanvasSection(new Board.CanvasSection(0, 32, 3, 32, 32, [], true, 4, "image"));

        this.mypainter.getCanvas().addCanvasSection(new Board.CanvasSection(32, 32, 4, 32, 16, [], true, 5, "scrollTest"));

        this.demo();

    }

    private leadingZeroes(num: number, digits: number): string {
        return ("0".repeat(digits) + num.toString()).substr(num.toString().length, digits + 1);
    }

    public demo(): void {
        const date: Date = new Date();
        const timeString: string = this.leadingZeroes(date.getHours(), 2) + ":" + this.leadingZeroes(date.getMinutes(), 2) + ":" + this.leadingZeroes(date.getSeconds(), 2) + "." + this.leadingZeroes(date.getMilliseconds(), 3);
        const dateString: string = date.getFullYear() + '-' + this.leadingZeroes(date.getMonth() + 1, 2) + '-' + this.leadingZeroes(date.getDate(), 2);
        this.mypainter.getCanvas().getCanvasSection("clock")?.setRepresentation([
            {
                id: "time",
                drawMode: Board.DrawMode.TEXT,
                color: 0x800000,
                drawModeOptions: {fill: true, font: "5x7", "fontPath": "/home/pi/code/rpi-led-matrix-painter-test/fonts/5x7.bdf"},
                points: {x: 0, y:0, z: 1},
                text: timeString,
                layer: 5
            }, {
                id: "date",
                drawMode: Board.DrawMode.TEXT,
                color: 0x800000,
                drawModeOptions: {fill: false, font: "4x6", "fontPath": "/home/pi/code/rpi-led-matrix-painter-test/fonts/4x6.bdf"},
                points: {x: 0, y: 8, z: 1},
                text: dateString,
                layer: 6
            }]);
        this.mypainter.getCanvas().getCanvasSection("icons")?.setRepresentation([
            // Red "X"
            {
                id: "x",
                drawMode: Board.DrawMode.POLYGON,
                color: 0x800000,
                drawModeOptions: {fill: true},
                points: [
                    {x: 1, y: 0, z: 1}, // 
                    {x: 3, y: 2, z: 1}, //
                    {x: 5, y: 0, z: 1}, //
                    {x: 6, y: 1, z: 1},
                    {x: 4, y: 3, z: 1},
                    {x: 6, y: 5, z: 1},
                    {x: 5, y: 6, z: 1},
                    {x: 3, y: 4, z: 1},
                    {x: 1, y: 6, z: 1},
                    {x: 0, y: 5, z: 1},
                    {x: 2, y: 3, z: 1},
                    {x: 0, y: 1, z: 1}
                ],
                layer: 5
            },
            // Smaller check mark
            {
                id: "checkmark",
                drawMode: Board.DrawMode.POLYGON,
                color: 0x008000,
                drawModeOptions: {fill: true, },
                points: [
                    {x: 9, y: 3, z: 1},
                    {x: 10, y: 4, z: 1},
                    {x: 14, y: 0, z: 1},
                    {x: 15, y: 1, z: 1},
                    {x: 10, y: 6, z: 1},
                    {x: 8, y: 4, z: 1}
                ],
                layer: 5
            },
            // Warning triangle
            {
                id: "triangle",
                drawMode: Board.DrawMode.POLYGON,
                color: 0x805000,
                drawModeOptions: {fill: true, },
                points: [
                    {x: 22, y: 0, z: 1},
                    {x: 26, y: 6, z: 1},
                    {x: 18, y: 6, z: 1}
                ],
                layer: 5
            },
            // Exclamation mark for warning triangle
            {
                id: "exclamation",
                drawMode: Board.DrawMode.PIXEL,
                color: 0x000000,
                points: [
                    {x: 22, y: 2, z: 1},
                    {x: 22, y: 3, z: 1},
                    {x: 22, y: 5, z: 1}
                ],
                layer: 5
            }
        ]);

        this.mypainter.getCanvas().getCanvasSection("bottomlayer")?.setRepresentation([
            {
                id: "rectangle",
                drawMode: Board.DrawMode.RECTANGLE,
                color: 0x000080,
                drawModeOptions: {fill: true},
                points: {x: 0, y: 0, z: 1},
                width: 32,
                height: 32,
                layer: 5
            }
        ]);

        this.mypainter.getCanvas().getCanvasSection("image")?.setRepresentation([
            {
                id: "wesley",
                drawMode: Board.DrawMode.IMAGE,
                color: 0x000000,
                drawModeOptions: {fill: false},
                imagePath: "/home/pi/code/rpi-led-matrix-painter-test/images/17529334.png",
                points: {x: 0, y: 0, z: 0},
                width: 32,
                height: 32,
                layer: 7
            }
        ]);

        this.mypainter.getCanvas().getCanvasSection("scrollTest")?.setRepresentation([
            {
                id: "scrolltest",
                drawMode: Board.DrawMode.TEXT,
                color: 0xFFFFFF,
                drawModeOptions: {
                    fill: false, 
                    font: "4x6", 
                    "fontPath": "/home/pi/code/rpi-led-matrix-painter-test/fonts/4x6.bdf",
                    effects: [new Board.Effect(Board.EffectType.SCROLLLEFT, {rate: 200})]
                },
                points: {x: 0, y: 0, z: 1},
                text: timeString,
                layer: 6
            }
        ]);

        this.mypainter.paint();
        if(new Date().getTime() <= this.endTime){
            setTimeout(() => {this.demo();}, 5);
        }
        else {
            console.log("Quitting");
        }
    }
}

const myclassinstance = new MyClass();
myclassinstance.start();
