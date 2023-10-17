import { RectNode } from "./RectNode";
import { Camera } from "./Camera";
import { NodeDefinition } from "./NodeDefinition";


export class xFlowCanvas{

    public nodeActionButtonClicked?: (nodeId: string) => void

    private canvasRect: DOMRect;
    private _flowNodes: Array<RectNode> = [];
    private _camera : Camera
    private _debugString = "";
    private _debugString2 = "";
    private _wheelValue = 0;

    private _canvas : HTMLCanvasElement;

    private _layoutColumnWidth = 200;
    private _layoutRowHeight = 150;

    private _currentLayoutRow = 0;

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
        this.performLayout(nodeDefinitions);

        // attach click event for each node action button
        this._flowNodes.forEach(fn => {
            fn.actionButtonClicked = (id) => this.HandleNodeActionButtonClick(id);
        });
        this.loop();
    }

    private HandleNodeActionButtonClick(nodeID: string) {

        if (!this.nodeActionButtonClicked)
        {
            return;
        }
        this.nodeActionButtonClicked(nodeID)
    }

    private performLayout(nodeDefinitions: Array<NodeDefinition>)
    {
        var topLevelNodes = nodeDefinitions.filter(function(fn){ return fn.parentIds == null || fn.parentIds.length == 0 || fn.parentIds[0] == fn.id })

        if(topLevelNodes != undefined && topLevelNodes.length > 0)
        {
            topLevelNodes.forEach(topNode => {
                topNode.layoutRow = 0;
            });
        }
        else
        {
            // if we cant find any without parents, then we sort to find the ones with the least amount of parents
            let length = nodeDefinitions.sort((a,b) => a.parentIds.length - b.parentIds.length)[1].parentIds.length;
            topLevelNodes = nodeDefinitions.filter(function(fn){ return fn.parentIds.length ==  length})

            topLevelNodes.forEach(topNode => {
                topNode.layoutRow = 0;
            });
        }

        // if there are any items where all of their parent IDs do not exist, we will add them
        // to the top row as "topLevelNodes"
        var remainingItems = nodeDefinitions.filter(function(nd){ return nd.layoutRow == undefined })
        for(let itemKey in remainingItems)
        {
            let item = remainingItems[itemKey];
            if(!item.parentIds.some(p => nodeDefinitions.some(nd => nd.id == p)))
            {
                item.layoutRow = 0;
            }
        }

        let lastRow = 0;
        // loop until we put a row number on all elements
        while(nodeDefinitions.some(nd => nd.layoutRow === undefined))
        {
            var foundItems = nodeDefinitions.filter(function(nd){ return nd.layoutRow != undefined })

            // first check if there are any items with only a single parent
            for(let k in foundItems)
            {
                var parentItem = foundItems[k];
                var remainingNodeDefs = nodeDefinitions.filter(function(fn){ return fn.layoutRow === undefined && fn.parentIds.includes(parentItem.id) })

                if(remainingNodeDefs.some(rn => rn.parentIds.length === 1))
                {
                    var singleLevelNodeDefs = remainingNodeDefs.filter(function(fn){ return fn.parentIds.length == 1 })
                    singleLevelNodeDefs.forEach(slNode => {
                        slNode.layoutRow = lastRow + 1;
                    });
                    lastRow ++;
                    break;
                }
            }

            // now process the remaining items
            for(let k in foundItems)
            {
                var parentItem = foundItems[k];
                var remainingNodeDefs = nodeDefinitions.filter(function(fn){ return fn.layoutRow === undefined && fn.parentIds.includes(parentItem.id) })

                remainingNodeDefs.forEach(rn => { 
                    rn.layoutRow = lastRow + 1;
                })
            }

            lastRow ++;
        }

        let marginLeft = 50;
        let marginTop = 50;

        for(let i = 0; i <= lastRow; i++)
        {
            if(i % 2 === 0)
            {
                marginLeft = 50;
            }
            else
            {
                marginLeft = 100;
            }

            var rowNodes = nodeDefinitions.filter(function(nd){ return nd.layoutRow === i })
            let column = 0;
            rowNodes.forEach(rn => {
                this._flowNodes.push(new RectNode(rn.id, rn.parentIds, column * this._layoutColumnWidth + marginLeft, i * this._layoutRowHeight + marginTop,  rn.title, rn.color, rn.radii, this._camera, rn.enableActionButton));
                column++;
            });
        }
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

        ctx.clearRect(0,0, this._canvas.width, canvas.height);
        
        // ctx.fillText(this._camera.DebugString, 10,10);
        // ctx.fillText(this._debugString, 10,10);
        // ctx.fillText(this._debugString2, 10,30);

        this._camera.transformCanvasContext(ctx);
        
        // before drawing the nodes we will draw all of the lines between the nodes
        // this way we can draw the lines to the centers and the nodes will draw over
        // the top
        this._flowNodes.forEach(node => {
            if(node.parentIds.length > 0)
            {
                node.parentIds.forEach(parentId => {
                    var parentNode = this._flowNodes.find(function(fn){ return fn.id == parentId }) as RectNode | undefined

                    if(ctx == null)
                        return;

                    // draw arrows only if parent is found
                    if(parentNode != undefined)
                    {
                        var intersectPoint = this.GetNodeIntersectionPoint(parentNode?.centerX, parentNode?.centerY, new DOMRect(node.locationX, node.locationY, node.width, node.height));
                        ctx?.beginPath();
                        ctx?.moveTo(parentNode?.centerX, parentNode?.centerY);
                        ctx?.lineTo(intersectPoint.x, intersectPoint.y);
                        ctx?.stroke();

                        let rotation = Math.atan2(intersectPoint.y - parentNode?.centerY, intersectPoint.x - parentNode?.centerX);

                        // draw an error at the end of the lines pointing to the child nodes
                        ctx.translate(intersectPoint.x, intersectPoint.y)
                        ctx.rotate(rotation);

                        var path = new Path2D();
                        path.moveTo(0, 0);
                        path.lineTo(-10, -5);
                        path.lineTo(-10, 5);
                        path.lineTo(0, 0);
                        ctx.fill(path);
                        
                        ctx.rotate(-rotation);
                        ctx.translate(-intersectPoint.x, -intersectPoint.y)
                    } // end if parentNode != undefined
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
        // TODO: vertical lines are not drawn without this
        if(parentPoint.x == rectCenter.x)
            return new DOMPoint(rectCenter.x, lineOffsetY);

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