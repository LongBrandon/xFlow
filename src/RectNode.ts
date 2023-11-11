import { TextBlock } from "./TextBlock"
export class RectNode {

    private _locationX = 200;
    private _locationY = 200;
    public height = 75;
    public width = 125;

    private _firstRender : boolean = true;
    private _textBlock: TextBlock;
    private _textBlockTopOffset: number = 30;

    public actionButtonClicked?: (nodeId: string, category: string | undefined) => void
    
    public get locationX() : number {
        return this._locationX; // camera offset already handled in mosue move below?
    }
    public set locationX(v : number) {
        this._locationX = v;
    }

    public get locationY() : number {
        return this._locationY; // camera offset already handled in mosue move below?
    }
    public set locationY(v : number) {
        this._locationY = v;
    }

    private _clickOffsetX = 0;
    private _clickOffestY = 0;

    public _title: string = "";
    private _fillcolor = "black";
    public get fillColor() : string {
        return this._fillcolor;
    }

    // short text in smaller font near the bottom of the node
    private _subtext : string | undefined;

    // a string returned in the action button click event
    private _category: string | undefined;

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
        return this._locationX + this.width / 2;
    }

    public get centerY() : number {
        return this._locationY + this.height / 2;
    }

    
    private _layoutRow : number = 0
    public get layoutRow() : number {
        return this._layoutRow;
    }
    public set layoutRow(v : number ) {
        this._layoutRow = v;
    }
    

    // action button
    private _enableActionButton: boolean;
    private _actionButtonWidth: number = 15;
    private _actionButtonHeight: number = 15;
    private _actionButtonRightMargin: number = 5;
    private _actionButtonTopMargin: number = 5;
    private _actionButtonIsDown: boolean = false;

    constructor(id: string, parentIds: Array<string>, locationX: number, locationY: number, title: string, color: string, radii: number, enableActionButton: boolean,
        subtext: string | undefined, category: string | undefined) {

        this._id = id;
        this._parentIds = parentIds
        this._locationX = locationX;
        this._locationY = locationY;
        this._fillcolor = color;
        this._title = title;
        this._radii = radii;
        this._enableActionButton = enableActionButton

        this._textBlock = new TextBlock(this._title, this.width - 10, 12);

        this._subtext = subtext;
        this._category = category;
    }

    handleMouseDown(relMouseX : number, relMouseY: number) : void
    {
        // check if the click inside the action button
        if(this._enableActionButton)
        {
            let actionButtonLoc = this.GetActionButtonLocation();
            if(relMouseX > actionButtonLoc.x
                && relMouseX < actionButtonLoc.x + this._actionButtonWidth
                && relMouseY > actionButtonLoc.y
                && relMouseY < actionButtonLoc.y + this._actionButtonHeight)
                {
                    this._actionButtonIsDown = true;
                    return; // do not process move
                }
        }

        // check if click is inside this shape
        if(relMouseX > this._locationX 
            && relMouseX  < this._locationX + this.width
            && relMouseY > this._locationY 
            && relMouseY < this._locationY + this.height)
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

        if(this._actionButtonIsDown)
        {
            // this is a action button click event
            if (!this.actionButtonClicked) return
                this.actionButtonClicked(this.id, this._category)
        }

        this._actionButtonIsDown = false;
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
        if(this._firstRender)
        {
            this._firstRender = false;
            // we only need to calculate the textblock once
            this._textBlock.calculateTextBlock(canvasCtx); 
        }

        // increase the height of the shape to contain the text
        if(this._textBlock.textBlockHeight > this.height - this._textBlockTopOffset - 20)
        {
            this.height = this._textBlockTopOffset + this._textBlock.textBlockHeight + this._textBlockTopOffset;
        }

        canvasCtx.beginPath();
        canvasCtx.fillStyle = this._fillcolor;
        canvasCtx.strokeStyle = "black";
        canvasCtx.lineWidth = 1;
        canvasCtx.roundRect(this._locationX, this._locationY, this.width, this.height, this._radii)
        canvasCtx.fill();
        canvasCtx.stroke();

        // draw the main text
        this._textBlock.location.x = this.locationX + 5;
        this._textBlock.location.y = this.locationY + this._textBlockTopOffset;
        this._textBlock.draw(canvasCtx);

        // draw the subtext
        if(this._subtext != undefined)
        {
            canvasCtx.fillStyle = "black";
            canvasCtx.font = '10pt Calibri';
            let subtextLeftRadiiPad = this._radii / 3;
            canvasCtx.fillText(this._subtext, this.locationX + 5 + subtextLeftRadiiPad, this._locationY + this.height - 5);
        }

        // draw action "button"
        if(this._enableActionButton)
        {
            // let buttLocX = this.locationX + this.width - (this._actionButtonWidth + this._actionButtonRightMargin);
            // let buttLocY = this.locationY + this._actionButtonTopMargin;
            let buttLoc = this.GetActionButtonLocation();
            canvasCtx.beginPath();
            canvasCtx.fillStyle = this._fillcolor;
            canvasCtx.strokeStyle = "#414347";
            canvasCtx.lineWidth = 1;
            canvasCtx.roundRect(buttLoc.x, buttLoc.y, this._actionButtonWidth, this._actionButtonHeight, 3)
            canvasCtx.fill();
            canvasCtx.stroke();

            // draw circle inside button for more flare
           // let buttLoc = this.GetActionButtonLocation();
            let actButtCenterX = buttLoc.x + (this._actionButtonWidth / 2)
            let actButtCenterY = buttLoc.y + (this._actionButtonHeight / 2)
            canvasCtx.beginPath();
            canvasCtx.arc(actButtCenterX, actButtCenterY, 3, 0, 2 * Math.PI, false);
            canvasCtx.lineWidth = 1;
            canvasCtx.strokeStyle = '#414347';
            canvasCtx.stroke();
        }
    }

    private GetActionButtonLocation() : DOMPoint
    {
        let buttLocX = this.locationX + this.width - (this._actionButtonWidth + this._actionButtonRightMargin);
        let buttLocY = this.locationY + this._actionButtonTopMargin;

        return new DOMPoint(buttLocX, buttLocY);
    }
}

