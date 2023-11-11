export class NodeDefinition
{
    public layoutRow : number | undefined;

    private _title : string = "";
    public get title() : string {
        return this._title;
    }
    public set title(v : string) {
        this._title = v;
    }

    private _subtext : string | undefined;
    public get subtext() : string | undefined {
        return this._subtext;
    }
    public set subtext(v : string | undefined) {
        this._subtext = v;
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
    
    private _enableActionButton: boolean = false;
    public get enableActionButton() : boolean {
        return this._enableActionButton;
    }
    public set enableActionButton(en : boolean) {
        this._enableActionButton = en;
    }
    
    private _category : string | undefined;
    public get category() : string | undefined {
        return this._category;
    }
    public set category(v : string | undefined) {
        this._category = v;
    }

    constructor(parentIds: Array<string>) {
        this._parentIds = parentIds;
    }
}