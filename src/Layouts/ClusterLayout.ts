import { RectNode } from "../RectNode";
import { ClusterTree } from "./ClusterTree";

export class ClusterLayout
{
    private _nodes: Array<RectNode> = [];

    private _clusterTrees: Array<ClusterTree> = [];
    private _completedNodeIds : Array<string> = [];

    private _lastTreeId = 0;

    private _nodeColumnWidth : number;
    private _nodeRowHeight: number

    constructor(nodeDefinitions : Array<RectNode>, nodeColumnWidth: number, nodeRowHeight: number) 
    {
        this._nodes = nodeDefinitions;
        this._nodeColumnWidth = nodeColumnWidth;
        this._nodeRowHeight = nodeRowHeight;
    }

    public performLayout() : void
    {
        // for a tree type layout we will start by finding the top level nodes
        var topLevelNodes = this._nodes.filter(function(fn){ return fn.parentIds == null || fn.parentIds.length == 0 || fn.parentIds[0] == fn.id })

        if(topLevelNodes != undefined && topLevelNodes.length > 0)
        {
            topLevelNodes.forEach(topNode => {
                topNode.layoutRow = 0;
            });
        }
        else
        {
            // if we cant find any without parents, then we sort to find the ones with the least amount of parents
            let length = this._nodes.sort((a,b) => a.parentIds.length - b.parentIds.length)[1].parentIds.length;
            topLevelNodes = this._nodes.filter(function(fn){ return fn.parentIds.length ==  length})

            topLevelNodes.forEach(topNode => {
                topNode.layoutRow = 0;
            });
        }

        topLevelNodes.forEach(topNode => {
            this._completedNodeIds.push(topNode.id);
        });

        this._lastTreeId++
        topLevelNodes.forEach(topNode => {
            let treeId = 0; // top level nodes will have a tree ID of 0
            this.createTree(topNode, treeId, true);
        });

        // at the end we will process whatever is left
        let remainingNodeDefs = this._nodes.filter((fn) => { return !this._completedNodeIds.some(cc => cc == fn.id)});
        if(remainingNodeDefs.length > 0)
        {
            console.error("THERE ARE NODES LEFTOVER AFTER TREE LAYOUT");
        }

        // perform the layout on all the individual trees
        this._clusterTrees.forEach(ct => {
            ct.performTreeLayout(5, this._nodeColumnWidth, this._nodeRowHeight);
        });

        // now we need to layout the trees
        // start with trees that do not have any parent trees
        // for now this is all trees with a parent id of 0
        let parentTrees = this._clusterTrees.filter(function(t){ return t.parentID == 0});
        let lastParentWidth = 0;
        for(let pkey in parentTrees)
        {
            let parentTree = parentTrees[pkey];

            // we need to set the x offset here for the top level parent
            parentTree.offsetTree(lastParentWidth, 0);
            
            lastParentWidth += this.layoutTreeLevel(parentTree, lastParentWidth, parentTree.clusterHeight);
        }
    }

    private layoutTreeLevel(currentTree: ClusterTree, xoffset: number, height: number ) : number
    {
        let childTrees = this._clusterTrees.filter(t => t.parentID == currentTree.id)

        let thisLevelWidth = 0;
        let thisLevelHeight = 0;

        for(let ckey in childTrees)
        {
            let childTree = childTrees[ckey];
            // childTree.offsetTree(thisLevelWidth + width, thisLevelHeight + height);
            childTree.offsetTree(thisLevelWidth + xoffset, 0 + height);
            
            if(childTree.clusterHeight > thisLevelHeight)
                thisLevelHeight = childTree.clusterHeight;
            thisLevelWidth += childTree.clusterWidth;
        }

        // now proccess all of the child items
        for(let ckey in childTrees)
        {
            let childTree = childTrees[ckey];
            //thisLevelWidth += this.layoutTreeLevel(childTree, thisLevelWidth + width, thisLevelHeight + height);
            let childWidth = this.layoutTreeLevel(childTree, xoffset, thisLevelHeight + height);
            if(childWidth > thisLevelWidth)
                thisLevelWidth = childWidth;
        }
        // return thisLevelWidth + xoffset;
        return thisLevelWidth;
    }

    private createTree(parentNode: RectNode, parentTreeId : number, addParentNode: boolean = false)
    {
        this._lastTreeId++;
        let treeID = this._lastTreeId;

        let clusterTree = new ClusterTree(treeID, parentTreeId)
        if(addParentNode)
        {
            clusterTree.treeNodeDefs.push(parentNode);
        }

        this._clusterTrees.push(clusterTree);
        // get all remainging nodes
        let remainingNodeDefs = this._nodes.filter((fn) => { return !this._completedNodeIds.some(cc => cc == fn.id)});

        let directChildren = remainingNodeDefs.filter(function(n){ return n.parentIds.some(p => parentNode.id == p) })

        this.walkTree(clusterTree, directChildren, 1);
    }

    private walkTree(tree: ClusterTree, currentNodes: Array<RectNode>, lastNodeRow : number)
    {
        if(currentNodes.length == 0)
            return;

        let currentNodeRow = lastNodeRow + 1;
        
        for(let ckey in currentNodes)
        {
            let currentNode = currentNodes[ckey];
            currentNode.layoutRow = currentNodeRow;
            tree.treeNodeDefs.push(currentNode);
            this._completedNodeIds.push(currentNode.id);

            let childNodes = this._nodes.filter((fn) => { return !this._completedNodeIds.some(cc => cc == fn.id) && fn.parentIds.some(p => p == currentNode.id)});

            if(childNodes.length > 1)
            {
                // create a new tree
                this.createTree(currentNode, tree.id);
            }
            else
            {
                // keep walking the tree
                if(childNodes.length > 0)
                {
                    this.walkTree(tree, childNodes, lastNodeRow++);
                }
            }
        }
    }
}