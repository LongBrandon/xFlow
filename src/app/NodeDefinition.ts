export class NodeDefinition
{
    
    private _title : string = "";
    public get title() : string {
        return this._title;
    }
    public set title(v : string) {
        this._title = v;
    }
    
    private _id : string = "";
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
    
    private _color : string = "";
    public get color() : string {
        return this._color;
    }
    public set color(v : string) {
        this._color = v;
    }
    
    private _radii : number = 10 
    public get radii() : number {
        return this._radii;
    }
    public set radii(v : number) {
        this._radii = v;
    }
    
    constructor(parentIds: Array<string>) {
        this._parentIds = parentIds;
    }
}