import { Camera } from "./Camera";
export class RectNode{

    private _camera: Camera;
    private _locationX = 200;
    private _locationY = 200;
    public _height = 75;
    public _width = 125;

    
    public get locationX() : number {
        //return this._locationX + this._camera.PanOffsetX;
        return this._locationX; // camera offset already handled in mosue move below?
    }

    public get locationY() : number {
        //return this._locationY + this._camera.PanOffsetY;
        return this._locationY; // camera offset already handled in mosue move below?
    }

    private _clickOffsetX = 0;
    private _clickOffestY = 0;

    public _title: string = "";
    private _fillcolor = "black";
    private _radii: number = 10;

    private _isMoving = false;
    private _debugString = "...";

    
    private _id : string;
    public get id() : string {
        return this._id;
    }
    public set id(v : string) {
        this._id = v;
    }
    
    private _parentIds : Array<string>;
    public get parentIds() : Array<string> {
        return this._parentIds;
    }
    public set parentIds(v : Array<string>) {
        this._parentIds = v;
    }

    
    public get centerX() : number {
        return this._locationX + this._width / 2;
    }

    public get centerY() : number {
        return this._locationY + this._height / 2;
    }
    
    constructor(id: string, parentIds: Array<string>, locationX: number, locationY: number, title: string, color: string, radii: number, camera: Camera) {
        this._id = id;
        this._parentIds = parentIds
        this._locationX = locationX;
        this._locationY = locationY;
        this._fillcolor = color;
        this._title = title;
        this._radii = radii;
        this._camera = camera;
    }

    handleMouseDown(relMouseX : number, relMouseY: number) : void
    {
        // check if click is inside this shape
        if(relMouseX > this._locationX 
            && relMouseX  < this._locationX + this._width
            && relMouseY > this._locationY 
            && relMouseY < this._locationY + this._height)
            {
                this._isMoving = true;

                // save the offset location for the mouse pointer in the shape
                this._clickOffsetX = relMouseX - this._locationX;
                this._clickOffestY = relMouseY - this._locationY;
            }
    }

    handleMouseUp(relMouseX : number, relMouseY: number)
    {
        if(this._isMoving)
        {
            this._isMoving = false;
        }
    }

    handleMouseMove(relMouseX : number, relMouseY: number) : void
    {
        if(this._isMoving == false)
            return;

        this._locationX = relMouseX - this._clickOffsetX;
        this._locationY = relMouseY - this._clickOffestY;
    }

    drawFlowchartElement(canvasCtx: CanvasRenderingContext2D) : void
    {

        canvasCtx.beginPath();
        canvasCtx.fillStyle = this._fillcolor;
        canvasCtx.strokeStyle = "black";
        canvasCtx.lineWidth = 1;
        canvasCtx.roundRect(this._locationX, this._locationY, this._width, this._height, this._radii)
        canvasCtx.fill();
        canvasCtx.stroke();

        canvasCtx.strokeStyle = "black";
        canvasCtx.fillStyle = "black";
        canvasCtx.font = "12pt Calibri"

        let titleLocY = this._locationY + (this._height/2) + 4;

        var textwidth = canvasCtx.measureText(this._title);

        let tileLocX = 0;
        if(textwidth.width < this._width)
        {
            tileLocX = this._locationX + ((this._width - textwidth.width) / 2);
        }

        canvasCtx.fillText(this._title, tileLocX, titleLocY); // for testing only
    }

   
}

