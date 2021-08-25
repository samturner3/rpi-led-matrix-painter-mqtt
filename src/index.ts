import * as Board from "rpi-led-matrix-painter";
import { PaintingInstruction } from "rpi-led-matrix-painter";

export class MyClass {

    private pixelMapperConfig = Board.RpiLedMatrix.LedMatrixUtils.encodeMappers({"type": Board.RpiLedMatrix.PixelMapperType.U}, {"type": Board.RpiLedMatrix.PixelMapperType.Rotate, "angle": 180});
    private endTime: number = new Date().getTime() + 86400000;
    private mypainter = new Board.Painter({
            ...Board.RpiLedMatrix.LedMatrix.defaultMatrixOptions(),
            rows: 32,
            cols: 64,
            chainLength: 2,
            pixelMapperConfig: this.pixelMapperConfig
        },
        {
            ...Board.RpiLedMatrix.LedMatrix.defaultRuntimeOptions(),
            gpioSlowdown: 3,
            dropPrivileges: 0
        });

    public start(): void {

        this.mypainter.getCanvas().addCanvasSection(new Board.CanvasSection("clock", 0, 0, 1, 73, 13, [], true));

        this.mypainter.getCanvas().addCanvasSection(new Board.CanvasSection("icons", 0, 16, 2, 27, 7, [], true));

        this.mypainter.getCanvas().addCanvasSection(new Board.CanvasSection("theworks", 0, 23, 3, 64, 7, [], true));

        // this.mypainter.getCanvas().addCanvasSection(new Board.CanvasSection("bottomlayer", 45, 0, 0, 32, 32, [], true));

        this.mypainter.getCanvas().addCanvasSection(new Board.CanvasSection("image", 0, 32, 3, 32, 32, [], true));

        this.mypainter.getCanvas().addCanvasSection(new Board.CanvasSection("scrollTest", 32, 32, 4, 32, 16, [], true));

        this.demo();

    }

    private leadingZeroes(num: number, digits: number): string {
        return ("0".repeat(digits) + num.toString()).substr(num.toString().length, digits + 1);
    }

    public startTime: number = new Date().getTime();
    public currentTime: number = new Date().getTime();

    public cycleTheWorks(): PaintingInstruction[] {
        this.currentTime = new Date().getTime();
        let outputInstructionNumber: number = Math.floor((this.currentTime - this.startTime) / 5000) % 4;
        switch(outputInstructionNumber){
            case 0: {
                return [{
                    id: "x",
                    drawMode: Board.DrawMode.POLYGON,
                    color: 0x800000,
                    drawModeOptions: {fill: true, effects: [
                        {effectType: Board.EffectType.PULSE, effectOptions: {rate: 1000}}
                    ]},
                    points: [
                        {x: 1, y: 0, z: 1},
                        {x: 3, y: 2, z: 1},
                        {x: 5, y: 0, z: 1},
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
                },{
                    id: "theworks_error_text",
                    drawMode: Board.DrawMode.TEXT,
                    drawModeOptions: {
                        font: "4x6",
                        fontPath: "/home/pi/code/rpi-led-matrix-painter-test/fonts/4x6.bdf",
                        effects: [
                            {effectType: Board.EffectType.PULSE, effectOptions: {rate: 1000}}
                        ]
                    },
                    color: 0x800000,
                    text: "Error",
                    points: {x: 10, y: 1, z: 3},
                    layer: 7
                }];
                break;
            }
            case 1: {
                return [
                    {
                        id: "theworks_warning_triangle",
                        drawMode: Board.DrawMode.POLYGON,
                        color: 0x805000,
                        drawModeOptions: {fill: true, effects: [
                            {effectType: Board.EffectType.BLINK, effectOptions: {rate: 500}}
                        ]},
                        points: [
                            {x: 4, y: 0, z: 1},
                            {x: 8, y: 6, z: 1},
                            {x: 0, y: 6, z: 1}
                        ],
                        layer: 5
                    },
                    // Exclamation mark for warning triangle
                    {
                        id: "theworks_warning_exclamation",
                        drawMode: Board.DrawMode.PIXEL,
                        drawModeOptions: {
                            effects: [
                                {effectType: Board.EffectType.BLINK, effectOptions: {rate: 500}}
                            ]
                        },
                        color: 0x000000,
                        points: [
                            {x: 4, y: 2, z: 2},
                            {x: 4, y: 3, z: 2},
                            {x: 4, y: 5, z: 2}
                        ],
                        layer: 6
                    },
                    {
                        id: "theworks_warning_text",
                        drawMode: Board.DrawMode.TEXT,
                        drawModeOptions: {
                            font: "4x6",
                            fontPath: "/home/pi/code/rpi-led-matrix-painter-test/fonts/4x6.bdf",
                            effects: [
                                {effectType: Board.EffectType.BLINK, effectOptions: {rate: 500}}
                            ]
                        },
                        color: 0x805000,
                        text: "Warning",
                        points: {x: 10, y: 1, z: 3},
                        layer: 7
                    }
                ];
                break;
            }
            case 2: {
                return [{
                    id: "checkmark",
                    drawMode: Board.DrawMode.POLYGON,
                    color: 0x008000,
                    drawModeOptions: {fill: true, },
                    points: [
                        {x: 1, y: 3, z: 1},
                        {x: 2, y: 4, z: 1},
                        {x: 6, y: 0, z: 1},
                        {x: 7, y: 1, z: 1},
                        {x: 2, y: 6, z: 1},
                        {x: 0, y: 4, z: 1}
                    ],
                    layer: 5
                },{
                    id: "theworks_ok_text",
                    drawMode: Board.DrawMode.TEXT,
                    drawModeOptions: {
                        font: "4x6",
                        fontPath: "/home/pi/code/rpi-led-matrix-painter-test/fonts/4x6.bdf",
                        effects: [
                        ]
                    },
                    color: 0x008000,
                    text: "OK",
                    points: {x: 10, y: 1, z: 3},
                    layer: 7
                }];
                break;
            }
            case 3: {
                return [
                    {
                        id: "theworks_info_glyph_1",
                        drawMode: Board.DrawMode.LINE,
                        color: 0x000080,
                        points: [{x: 0, y: 6, z: 1}, {x: 4, y: 6, z: 1}],
                        layer: 6
                    },
                    {
                        id: "theworks_info_glyph_2",
                        drawMode: Board.DrawMode.LINE,
                        color: 0x000080,
                        points: [{x: 2, y: 6, z: 1}, {x: 2, y: 2, z: 1}],
                        layer: 6
                    },
                    {
                        id: "theworks_info_glyph_3",
                        drawMode: Board.DrawMode.PIXEL,
                        color: 0x000080,
                        points: [{x: 2, y: 0, z: 1}, {x: 1, y: 2, z: 1}],
                        layer: 6
                    },
                    {
                        id: "theworks_info_text",
                        drawMode: Board.DrawMode.TEXT,
                        drawModeOptions: {
                            font: "4x6",
                            fontPath: "/home/pi/code/rpi-led-matrix-painter-test/fonts/4x6.bdf",
                            effects: [
                            ]
                        },
                        color: 0x000080,
                        text: "Info",
                        points: {x: 10, y: 1, z: 3},
                        layer: 7
                    }
                ];
                break;
            }
            default: {
                return [];
            }
        }
        
    }

    public demo(): void {
        const date: Date = new Date();
        const timeString: string = this.leadingZeroes(date.getHours(), 2) + ":" + this.leadingZeroes(date.getMinutes(), 2) + ":" + this.leadingZeroes(date.getSeconds(), 2) + "." + this.leadingZeroes(date.getMilliseconds(), 3);
        const dateString: string = date.getFullYear() + '-' + this.leadingZeroes(date.getMonth() + 1, 2) + '-' + this.leadingZeroes(date.getDate(), 2);

        this.mypainter.getCanvas().setCanvas([
            {
                name: "clock",
                x: 0,
                y: 0,
                z: 1,
                width: 73,
                height: 13,
                representation: [
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
                    }
                ]
            },
           
            // Cycle through effects with each icon.
            {
                name: "theworks",
                x: 0,
                y: 23,
                z: 3,
                width: 64,
                height: 7,
                representation: this.cycleTheWorks()
            },
            {
                name: "image",
                x: 0,
                y: 32,
                z: 3,
                width: 32,
                height: 32,
                representation: [
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
                ]
            },
            {
                name: "scrollTest",
                x: 32,
                y: 32,
                z: 4,
                width: 32,
                height: 16,
                representation: [
                    {
                        id: "scrolltest",
                        drawMode: Board.DrawMode.TEXT,
                        color: 0xFFFFFF,
                        drawModeOptions: {
                            fill: false, 
                            font: "4x6", 
                            "fontPath": "/home/pi/code/rpi-led-matrix-painter-test/fonts/4x6.bdf",
                            effects: [{effectType: Board.EffectType.SCROLLLEFT, effectOptions: {rate: 200}}, {effectType: Board.EffectType.BLINK, effectOptions: {rate: 500}}]
                        },
                        points: {x: 0, y: 0, z: 1},
                        text: timeString,
                        layer: 6
                    }
                ]
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
