export class RectNode{

    private _locationX = 200;
    private _locationY = 200;
    private _height = 150;
    private _width = 200;

    private _clickOffsetX = 0;
    private _clickOffestY = 0;

    private _fillcolor = "black";

    private _isMoving = false;

    private _debugString = "...";

    private _title: string = "";
    get Title(): string{ return this._title; }
    set Title(newTitle: string)
    { 
        this._title = newTitle; 
    } 

    constructor(locationX: number, locationY: number , color: string) {
        this._locationX = locationX;
        this._locationY = locationY;
        this._fillcolor = color;
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
            this._debugString = "shape is not moving";
        }
    }

    handleMouseMove(relMouseX : number, relMouseY: number) : void
    {
        if(this._isMoving == false)
            return;

        this._locationX = relMouseX-  this._clickOffsetX;
        this._locationY = relMouseY - this._clickOffestY;

        this._debugString = "mouse move while moving";
    }

    drawFlowchardElement(canvasCtx: CanvasRenderingContext2D) : void
    {

        canvasCtx.beginPath();
        canvasCtx.fillStyle = this._fillcolor;
        canvasCtx.strokeStyle = "black";
        canvasCtx.lineWidth = 1;
        canvasCtx.roundRect(this._locationX, this._locationY, this._width, this._height, 10)
        canvasCtx.fill();
        canvasCtx.stroke();
        // canvasCtx.arc(this._locationX, this._locationY, 40, 0, 2 * Math.PI);
        // canvasCtx.fillStyle = "blue";
        // canvasCtx.fill();
        // canvasCtx.lineWidth = 5;
        // canvasCtx.strokeStyle = "black";
        // canvasCtx.stroke();

        canvasCtx.strokeStyle = "black";
        canvasCtx.fillStyle = "black";
        canvasCtx.fillText(this._debugString, this._locationX + 15, this._locationY + 15); // for testing only
    }

   
}

