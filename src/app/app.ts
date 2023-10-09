import { NodeDefinition } from "./NodeDefinition";
import {xFlowCanvas} from "./xFlowCanvas"
import exampleData from "./example.json";

var $ = require( "jquery" );

// var canvasRect: DOMRect;

// let _flowNodes: Array<RectNode> = [];
// let _camera : Camera
// let _debugString = "";
// let _wheelValue = 0;

let xFlowCan: xFlowCanvas;

window.onload = function(e){
    start();
}

function start()
{
    var messagesElement = document.getElementById('messages');
    messagesElement!.innerText = "Welcome somethings working!";
    $('#startBtn').click(function(){

        messagesElement!.innerText = "button clicked"
    
        // var canvas = <HTMLCanvasElement>($('#xdocCanvas')); // why does this not work?
        var canvas = <HTMLCanvasElement>document.getElementById("xdocCanvas");
        //canvas.onmousemove = mouseMove;
        // canvas.onmousedown = mouseDown;
        // canvas.onmouseup = mouseUp;
        // canvas.onwheel = mouseWheel;

        const nodeDefs = (exampleData as Array<NodeDefinition>)

        // nodeDefs.forEach(element => {
        //     console.log(element.title);
        // });

        xFlowCan = new xFlowCanvas(canvas);
        xFlowCan.start(nodeDefs);

        // let row = 0;
        // let column = 0;
        // for(let i = 0; i<100; i ++)
        // {
        //     column ++;
        //     if(i % 15 == 0)
        //     {
        //         row++
        //         column = 0;
        //     }
        //     _flowNodes.push(new RectNode(column * 100, row * 100, "lightgreen"));
        // }

        // _camera = new Camera(canvas);
    
        // $('#zoomInBtn').click(function(){
        //     _camera.increaseZoom();
        // });
    
        // $('#zoomOutBtn').click(function(){
        //     _camera.decreaseZoom();
        // });

        // loop();
    });

}

// function loop(){
//     var canvas = <HTMLCanvasElement>document.getElementById("xdocCanvas");
//     canvasRect = canvas.getBoundingClientRect();
//     RunMainLoop(canvas);
//     _camera.LoopUpdate()
//     requestAnimationFrame(loop);
// }

// function mouseUp( evt: MouseEvent)
// {
//     xFlowCan.mouseUp(evt);
//     // _camera.HandleMouseUp(evt);

//     // if(evt.button == 0)
//     // {
//     //     _flowNodes.forEach(function (value){
//     //         value.handleMouseUp(_camera.MouseCamLocationX, _camera.MouseCamLocationY);
//     //     });
//     // }
// }

// function mouseDown(evt: MouseEvent)
// {
//     xFlowCan.mouseDown(evt);
//     // _camera.HandleMouseDown(evt);

//     // if(evt.button == 0)
//     // {
//     //     _flowNodes.forEach(function (value){
//     //         value.handleMouseDown(_camera.MouseCamLocationX, _camera.MouseCamLocationY);
//     //     });
//     // }
// }

// function mouseMove(evt: MouseEvent)
// {
//     //xFlowCan.mouseMove(evt);
//     // _camera.HandleMouseMove(evt);
//     // _flowNodes.forEach(function (value){
//     //     value.handleMouseMove(_camera.MouseCamLocationX, _camera.MouseCamLocationY);
//     // });
// }

// function mouseWheel(evt: WheelEvent)
// {
//     xFlowCan.mouseWheel(evt);
//     // _wheelValue += evt.deltaY
//     // _debugString = _wheelValue.toString();
//     // _camera.HandleMouseWheel(evt);
// }

// function RunMainLoop(canvas: HTMLCanvasElement)
// {
//     canvas.width = window.innerWidth - 20;
//     canvas.height = window.innerHeight - 100;

//     if(canvas == null)
//         return;

//     var ctx = canvas.getContext("2d");
//     if(ctx == null)
//         return;

//     ctx.clearRect(0,0, canvas.width,canvas.height);
    
    
//     ctx.fillText(_camera.DebugString, 10,10);

//     _camera.transformCanvasContext(ctx);
    
//     _flowNodes.forEach(function (value){
//         value.drawFlowchardElement(ctx!);
//     });
// }