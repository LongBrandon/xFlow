export class Camera {

    //https://gist.github.com/KennyRedman/50d636b7eb43a01bb61c

    public Zoom : number = 1;
    private _mouseWheelValue: number = 0;

    public PanOffsetX: number = 0;
    public PanOffsetY: number = 0;
    private _isPanning = false;
    private _panStartX: number = 0;
    private _currentPanOffsetX: number = 0
    private _panStartY: number = 0;
    private _currentPanOffsetY: number = 0

    public MouseCamLocationX = 0;
    public MouseCamLocationY = 0;


    public DebugString : string = "camera debug...";

    private canvasRect: DOMRect;
    private canvas: HTMLCanvasElement;
    
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvasRect = this.canvas.getBoundingClientRect();
    }

    loopUpdate() : void
    {
        this.canvasRect = this.canvas.getBoundingClientRect();
    }

    handleMouseDown(evt: MouseEvent)
    {
        if(evt.button == 1) // middle mouse button
        {
            this._isPanning = true;
            this._panStartX = this.MouseCamLocationX;
            this._panStartY = this.MouseCamLocationY;
        }
    }

    handleMouseUp(evt: MouseEvent)
    {
        if(evt.button == 1)
        {
            this._isPanning = false;

            this.PanOffsetX += this._currentPanOffsetX
            this.PanOffsetY += this._currentPanOffsetY
            this._currentPanOffsetX = 0;
            this._currentPanOffsetY = 0;
        }
    }


    handleMouseMove(evt: MouseEvent)
    {       
        this.MouseCamLocationX = ((evt.clientX - this.canvasRect.left) / this.Zoom) - this.PanOffsetX;
        this.MouseCamLocationY = ((evt.clientY - this.canvasRect.top) / this.Zoom) - this.PanOffsetY;

        if(this._isPanning)
        {
            // adjust the pan location with the mouse location
            this._currentPanOffsetX = this.MouseCamLocationX  - this._panStartX;
            this._currentPanOffsetY = this.MouseCamLocationY - this._panStartY
        }
    }

    handleMouseWheel(evt: WheelEvent)
    {
        // get the current location of the mouse,
        // we want to move to this location after zooming
        let mouseLocationX = this.MouseCamLocationX;
        let mouseLocationY = this.MouseCamLocationY;

        var wheel = evt.deltaY / 120; //n or -n
        wheel = wheel * -1;
        this.Zoom *= Math.pow(1 + Math.abs(wheel)/2 , wheel > 0 ? 1 : -1);

        // correct mouse locations after zoom
        this.MouseCamLocationX = ((evt.clientX - this.canvasRect.left) / this.Zoom) - this.PanOffsetX;
        this.MouseCamLocationY = ((evt.clientY - this.canvasRect.top) / this.Zoom) - this.PanOffsetY;

        this.PanOffsetX -= mouseLocationX - this.MouseCamLocationX;
        this.PanOffsetY -= mouseLocationY - this.MouseCamLocationY;

        // update mouse location after offset
        this.MouseCamLocationX = ((evt.clientX - this.canvasRect.left) / this.Zoom) - this.PanOffsetX;
        this.MouseCamLocationY = ((evt.clientY - this.canvasRect.top) / this.Zoom) - this.PanOffsetY;
    }

    increaseZoom(): void
    {
        this.Zoom = this.Zoom * 1.142857142857143;
        this.Zoom = Math.round(this.Zoom * 1000) / 1000; // round to three decimal places
    }
    decreaseZoom(): void 
    {
        this.Zoom = this.Zoom * .875;
        this.Zoom = Math.round(this.Zoom * 1000) / 1000; // round to three decimal places
    }

    transformCanvasContext(ctx: CanvasRenderingContext2D)
    {
        ctx.scale(this.Zoom, this.Zoom);
        ctx.translate(this.PanOffsetX + this._currentPanOffsetX, this.PanOffsetY + this._currentPanOffsetY);
    }

}