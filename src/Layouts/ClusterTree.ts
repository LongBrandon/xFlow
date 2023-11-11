import { RectNode } from "../RectNode";


export class ClusterTree
{
    public id : number
    public parentID : number;

    public clusterWidth : number = 100;
    public clusterHeight: number = 100;

    public treeNodeDefs : Array<RectNode> = [];

    constructor(id : number, parentID: number) 
    {
        this.id = id;
        this.parentID = parentID;
    }

    public performTreeLayout(nodeMargin: number, nodeColWidth: number, nodeRowHeight: number)
    {
        // begin by ordering the node definitions by their row property
        let orderedNodes = this.getOrderedNodes();

        if(orderedNodes == undefined)
        {
            console.error("ordered nodes are undefined");
            return;
        }

        if(orderedNodes[0] == undefined)
        {
            console.error("layout row is undefined");
            return;
        }
        let currentLayoutRow = orderedNodes[0].layoutRow;

        let largestCol = 0;

        let currentCol = 0;
        let currentRow = 0;
        for(let i = 0; i < orderedNodes.length; i++ )
        {
            if(orderedNodes[i].layoutRow != currentLayoutRow)
            {
                currentRow ++;
                currentLayoutRow = orderedNodes[i].layoutRow;
                currentCol = 0;
            }
            
            let nodeColOffset = 0;
            if(currentRow %2 ===0)
            {
                nodeColOffset = 50
            }

            orderedNodes[i].locationX = currentCol * nodeColWidth + nodeMargin + nodeColOffset;
            orderedNodes[i].locationY = currentRow * nodeRowHeight + nodeMargin;

            currentCol ++;

            // wrap into rows if we get too wide
            if(currentCol > largestCol){
                largestCol = currentCol;
            }

            if(currentRow < 2 && currentCol > 3)
            {
                currentRow ++;
                currentCol = 0;
            }
            else if(currentRow < 5 && currentCol > 5){
                currentRow ++;
                currentCol = 0;
            }
            else if(currentCol > 7 && currentCol > 9){
                currentRow ++;
                currentCol = 0;
            }
            else if(currentCol > 13)
            {
                currentRow ++;
                currentCol = 0;
            }
        }

        // set the total size of this tree
        let nodeColWidthEach = nodeColWidth + nodeMargin;
        this.clusterWidth = nodeColWidthEach + (largestCol * nodeColWidthEach) + 25;
        let rowHeightEach =  nodeRowHeight + nodeMargin;
        this.clusterHeight =  rowHeightEach +  (currentRow * rowHeightEach) + 75;
    }

    public offsetTree(xOffset: number, yOffset: number)
    {
        this.treeNodeDefs.forEach(node => {
            node.locationX += xOffset;
            node.locationY += yOffset;
        });
    }

    private getOrderedNodes(): Array<RectNode>
    {
        let orderedNodes = this.treeNodeDefs.sort((a,b) =>
        {
            if(a.layoutRow != undefined && b.layoutRow == undefined)
            {
                return 1;
            }
            else if((a.layoutRow == undefined && b.layoutRow != undefined) || (a.layoutRow == undefined && b.layoutRow == undefined))
            {
                return -1;
            }
            else
            {
                return a.layoutRow! - b.layoutRow!;
            }
        });

        return orderedNodes;
    }
}