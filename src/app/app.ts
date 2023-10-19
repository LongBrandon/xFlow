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

function HandleNodeAction  (nodeId : string) : void {
    console.log(nodeId);
    alert("Node Action for ID: " + nodeId);
}

function start()
{
    var messagesElement = document.getElementById('messages');
    messagesElement!.innerText = "Welcome somethings working!";
    $('#startBtn').click(function(){

        messagesElement!.innerText = "button clicked"
    
        // var canvas = <HTMLCanvasElement>($('#xdocCanvas')); // why does this not work?
        var canvas = <HTMLCanvasElement>document.getElementById("xdocCanvas");


        const nodeDefs = (exampleData as Array<NodeDefinition>)

        xFlowCan = new xFlowCanvas(canvas);
        xFlowCan.canvasWidth = window.innerWidth - 20;
        xFlowCan.canvasHeight = window.innerHeight - 100;

        window.addEventListener('resize', function(event) {
            xFlowCan.canvasWidth = window.innerWidth - 20;
            xFlowCan.canvasHeight = window.innerHeight - 100;
        }, true);

        xFlowCan.nodeActionButtonClicked = HandleNodeAction;

        xFlowCan.start(nodeDefs, "clusterTree");
    });
}
