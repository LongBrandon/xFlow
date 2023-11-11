import { Camera } from "../src/Camera";

describe("Camera", () => {
    let camera: Camera;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 50;
        camera = new Camera(canvas);
    });

    it("handleMouseUp sets the PanOffset*", () => {
        const evt: MouseEvent = {
            button: 1
        } as any;
        camera.handleMouseUp(evt);
        expect(camera.PanOffsetX).toBe(0);
        expect(camera.PanOffsetY).toBe(0);
    });
});