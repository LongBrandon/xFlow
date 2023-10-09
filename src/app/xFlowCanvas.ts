import { RectNode } from "./RectNode";
import { Camera } from "./Camera";
import { NodeDefinition } from "./NodeDefinition";


export class xFlowCanvas{

    private canvasRect: DOMRect;
    private _flowNodes: Array<RectNode> = [];
    private _camera : Camera
    private _debugString = "";
    private _debugString2 = "";
    private _wheelValue = 0;

    private _canvas : HTMLCanvasElement;


    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this.canvasRect = canvas.getBoundingClientRect();
        this._camera = new Camera(canvas);

        canvas.onmousemove = (evt) => this.mouseMove(evt);
        canvas.onmousedown = (evt) => this.mouseDown(evt);
        canvas.onmouseup = (evt) => this.mouseUp(evt);
        canvas.onwheel = (evt) => this.mouseWheel(evt);
    }

    start(nodeDefinitions: Array<NodeDefinition>) : void
    {
        // just for testing
        let row = 0;
        let column = 0;
        for(let i = 0; i<nodeDefinitions.length; i ++)
        {
            column ++;
            if(i % 15 == 0)
            {
                row++
                column = 0;
            }

            this._flowNodes.push(new RectNode(nodeDefinitions[i].id, nodeDefinitions[i].parentIds, column * 100, row * 100,  nodeDefinitions[i].title, nodeDefinitions[i].color, nodeDefinitions[i].radii, this._camera));
        }

        this.loop();
    }

    private loop = () => {
        this.canvasRect = this._canvas.getBoundingClientRect();
        this.RunMainLoop(this._canvas);
        this._camera.LoopUpdate()
        requestAnimationFrame(this.loop);
    }

    mouseUp(evt: MouseEvent) : void
    {
        this._camera.HandleMouseUp(evt);

        if(evt.button == 0)
        {
            this._flowNodes.forEach((value : RectNode) => {
                value.handleMouseUp(this._camera.MouseCamLocationX, this._camera.MouseCamLocationY);
            });
        }
    }

    mouseDown(evt: MouseEvent)
    {
        this._camera.HandleMouseDown(evt);

        if(evt.button == 0)
        {
            this._flowNodes.forEach((value) => {
                value.handleMouseDown(this._camera.MouseCamLocationX, this._camera.MouseCamLocationY);
            });
        }
    }

    private mouseMove(evt: MouseEvent)
    {
        this._camera.HandleMouseMove(evt);
        this._flowNodes.forEach((value) => {
            value.handleMouseMove(this._camera.MouseCamLocationX, this._camera.MouseCamLocationY);
        });
    }

    mouseWheel(evt: WheelEvent)
    {
        this._wheelValue += evt.deltaY
        this._debugString = this._wheelValue.toString();
        this._camera.HandleMouseWheel(evt);
    }

    private RunMainLoop(canvas: HTMLCanvasElement)
    {
        this._canvas.width = window.innerWidth - 20;
        this._canvas.height = window.innerHeight - 100;

        if(this._canvas == null)
            return;

        var ctx = this._canvas.getContext("2d");
        if(ctx == null)
            return;

        ctx.clearRect(0,0, this._canvas.width,canvas.height);
        
        
        ctx.fillText(this._camera.DebugString, 10,10);
        ctx.fillText(this._debugString2, 10,30);

        this._camera.transformCanvasContext(ctx);
        
        // before drawing the nodes we will draw all of the lines between the nodes
        // this way we can draw the lines to the centers and the nodes will draw over
        // the top
        this._flowNodes.forEach(node => {
            if(node.parentIds.length > 0)
            {
                node.parentIds.forEach(parentId => {
                    var parentNode = this._flowNodes.find(function(fn){ return fn.id == parentId }) as RectNode
                    
                    if(ctx == null)
                        return;

                    var intersectPoint = this.GetNodeIntersectionPoint(parentNode?.centerX, parentNode?.centerY, new DOMRect(node.locationX, node.locationY, node._width, node._height));
                    ctx?.beginPath();
                    ctx?.moveTo(parentNode?.centerX, parentNode?.centerY);
                    ctx?.lineTo(intersectPoint.x, intersectPoint.y);
                    ctx?.stroke();

                    // as a pointer, draw a circle at the end of the line
                    ctx.beginPath();
                    ctx.arc(intersectPoint.x, intersectPoint.y, 10, 0, 2 * Math.PI, false);
                    ctx.fillStyle = 'green';
                    ctx.fill();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#003300';
                    ctx.stroke();
                });
            }
        });

        // draw all the nodes
        this._flowNodes.forEach(function (value){
            value.drawFlowchartElement(ctx!);
        });
    }

    private GetNodeIntersectionPoint(parentPointX: number, parentPointY: number, rect: DOMRect) : DOMPoint
    {
        // determine corner to corner slopes
        let rectPoint1 = new DOMPoint(rect.x, rect.y);
        let rectPoint2 = new DOMPoint(rect.x + rect.width, rect.y);
        let rectPoint3 = new DOMPoint(rect.x + rect.width, rect.y + rect.height);
        let rectPoint4 = new DOMPoint(rect.x, rect.y + rect.height)

        // now determine what quandrant the mouse is in relative to the node
        // if y > mx + b
        let greaterThanSlope1 = false;
        let greaterThanSlope2 = false;
        
        //greaterThanSlope1 = mouseY > slope1 * mouseX + yintercept1;
        greaterThanSlope1 = (rectPoint3.x - rectPoint1.x)*(parentPointY - rectPoint1.y) > (rectPoint3.y - rectPoint1.y)*(parentPointX - rectPoint1.x);
        greaterThanSlope2 = (rectPoint4.x - rectPoint2.x)*(parentPointY - rectPoint2.y) > (rectPoint4.y - rectPoint2.y)*(parentPointX - rectPoint2.x);

        // get the slope of the connecting line between each shape,
        // The line points are at the center of each rectangle
        let centerRectPoint = new DOMPoint(rect.x + (rect.width / 2), rect.y + (rect.height / 2));

        // combinations of the two greater than slope values determine which side of the square intercepts the line
        if(greaterThanSlope1 && greaterThanSlope2)
        {
            // Left side of rectangle
            return this.GetLeftRightIntersection(new DOMPoint(parentPointX, parentPointY), centerRectPoint, rect.x, rect.y);
        }
        else if(!greaterThanSlope1 && greaterThanSlope2)
        {
            // Top side of rectangle
            return this.GetTopBottomIntersection(new DOMPoint(parentPointX, parentPointY), centerRectPoint, rect.x, rect.y)
        }
        else if(!greaterThanSlope1 && !greaterThanSlope2)
        {
            // Right side of rectangle
             return this.GetLeftRightIntersection(new DOMPoint(parentPointX, parentPointY), centerRectPoint, rect.x + rect.width, rect.y + rect.height);
        }
        else(greaterThanSlope1 && !greaterThanSlope2)
        {
            // Bottom side of rectangle
            return this.GetTopBottomIntersection(new DOMPoint(parentPointX, parentPointY), centerRectPoint, rect.x + rect.width, rect.y + rect.height)
        }
    }

    private GetLeftRightIntersection(parentPoint: DOMPoint, rectCenter: DOMPoint, vertLineOffsetX: number, vertLineOffsetY: number) : DOMPoint
    {
        // begin by offseting both points by the distance of the line
        let parentPointOffset = new DOMPoint(parentPoint.x - vertLineOffsetX, parentPoint.y - (vertLineOffsetY));
        let centerPointOffset = new DOMPoint(rectCenter.x - vertLineOffsetX, rectCenter.y - (vertLineOffsetY));

        let offsetSlope = (parentPointOffset.y - centerPointOffset.y) / (parentPointOffset.x - centerPointOffset.x);
        // use one of the points to find b
        var offset_b_val = -1*((offsetSlope * parentPointOffset.x) - parentPointOffset.y)
        
        // now to find the Y intercept, we sub x = 0
        // y = m(0) + b
        // y = b
        var lineYIntercept = offset_b_val + vertLineOffsetY;

        return new DOMPoint(vertLineOffsetX, lineYIntercept);
    }

    private GetTopBottomIntersection(parentPoint: DOMPoint, rectCenter: DOMPoint, lineOffsetX: number, lineOffsetY: number) : DOMPoint
    {
        // begin by offseting both points by the distance of the line
        let parentPointOffset = new DOMPoint(parentPoint.x - lineOffsetX, parentPoint.y - (lineOffsetY));
        let centerPointOffset = new DOMPoint(rectCenter.x - lineOffsetX, rectCenter.y - (lineOffsetY));

        let offsetSlope = (parentPointOffset.y - centerPointOffset.y) / (parentPointOffset.x - centerPointOffset.x);
        // Top side of rectangle
        // determine the Y intercept
        // slope form is y = mx + b
        // y-b = mx
        // -b = mx+y
        // b = -(mx+y)
        // use one of the points to find b
        var offset_b_val = -1*((offsetSlope * parentPointOffset.x) - parentPointOffset.y)

        // now to find the x intercept, we sub y = 0
        // 0 = mx + b
        // 0 - b = mx
        // (0-b)/m = x
        var lineXIntercept = ((0 - offset_b_val) / offsetSlope) + lineOffsetX;

        return new DOMPoint(lineXIntercept, lineOffsetY);
    }
    
}