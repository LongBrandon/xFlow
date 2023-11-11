export class TextBlock{

    private _text : string;
    public get text() : string {
        return this._text;
    }
    public set text(v : string) {
        this._text = v;
    }
    
    // the height of all the lines of text
    // including line spacing
    private _textBlockHeight : number = 75;
    public get textBlockHeight() : number {
        return this._textBlockHeight;
    }
    public set textBlockHeight(v : number) {
        this._textBlockHeight = v;
    }

    private _textHeight : number;
    public get textHeight() : number {
        return this._textHeight;
    }
    public set textHeight(h : number) {
        this._textHeight = h;
    }

    private _lineSpacing : number = 5;
    public get lineSpacing() : number {
        return this._lineSpacing;
    }
    public set lineSpacing(lineSpacing : number) {
        this._lineSpacing = lineSpacing;
    }

    private _location : DOMPoint = new DOMPoint(0,0);
    public get location() : DOMPoint {
        return this._location;
    }
    public set location(loc : DOMPoint) {
        this._location = loc;
    }

    private _maxWidth : number;
    public get maxWidth() : number {
        return this._maxWidth;
    }
    public set maxWidth(maxWidth : number) {
        this._maxWidth = maxWidth;
    }

    public _centerAlignText: boolean = true;

    public get centerAlignText() : boolean {
        return this._centerAlignText;
    }
    public set centerAlignText(centerAlignText : boolean) {
        this._centerAlignText = centerAlignText;
    }


    private _textLines = new Array<string>

    constructor(text : string, maxWidth : number, textHeight: number) 
    {
        this._text = text;
        this._maxWidth = maxWidth;
        this._textHeight = textHeight;      
    }

    // calculate the text block size based on the text and max width
    public calculateTextBlock(ctx : CanvasRenderingContext2D)
    {
        // set the text size BEFORE measuring text
        ctx.font = (this._textHeight) + 'pt Calibri';

        var words = this._text.split(" ");

        var textParts = new Array<string>;
        //var currentLine = words[0];
        var currentLine = "";

        for (var i = 0; i < words.length; i++) {
            var word = words[i];

            // check if the word itself is too long
            var wordWidth = ctx.measureText(word).width;
            if(wordWidth > this._maxWidth)
            {
                if(currentLine != ""){
                    textParts.push(currentLine); // begin by pushing the current line
                }

                var wordParts = this.breakWord(ctx, word, this._maxWidth);
                textParts = textParts.concat(wordParts)
                currentLine = "";
                continue;
            }

            if(currentLine == "")
            {
                currentLine = word;
                continue;
            }

            var width = ctx.measureText(currentLine + " " + word).width;
            if (width < this._maxWidth) {
                currentLine += " " + word;
            } else {
                textParts.push(currentLine);
                currentLine = word;
            }
        }
        if(currentLine != "")
            textParts.push(currentLine); // pushe anything left over

        this._textLines = textParts;
        let numOfLines = this._textLines.length
        this._textBlockHeight = (numOfLines * this.textHeight) + ((numOfLines - 1) * this._lineSpacing);       
    }

    public draw(ctx : CanvasRenderingContext2D)
    {
        // set the text size BEFORE measuring text
        ctx.fillStyle = "black";
        ctx.font = (this._textHeight) + 'pt Calibri';

        let lineNum = 0;
        this._textLines.forEach(line => {
            lineNum ++;

            let textLocationY = this._location.y + (lineNum * this._textHeight);
            if(lineNum > 1)
            {
                textLocationY += this._lineSpacing * (lineNum - 1);
            }

            let textLocationX = this.location.x;
            // center align text
            if(this._centerAlignText)
            {
                var textWidth = ctx.measureText(line).width;
                textLocationX = (this.maxWidth - textWidth) / 2 + this._location.x;
            }

            ctx.fillText(line, textLocationX, textLocationY);
        });
    }

    // This function will be used on individual words that are longer than a max width,
    // for this case we will break the word as needed
    private breakWord(ctx : CanvasRenderingContext2D, text: string, maxWidth : number) : Array<string>{
        
        let wordParts = new Array<string>;
        let lastStartIndex = 0;
        for(var i=0; i < text.length; i++)
        {
            let substring = text.substring(lastStartIndex, i);

            if(ctx.measureText(substring).width > maxWidth)
            {
                let newWordPart = text.substring(lastStartIndex, i-1); // go one character back
                wordParts.push(newWordPart);
                lastStartIndex = i - 1;
            }
        }

        // add any remaning characters
        wordParts.push(text.substring(lastStartIndex, text.length));
        return wordParts;
    }
}7