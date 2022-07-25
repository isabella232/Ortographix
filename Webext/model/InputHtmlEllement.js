


class InputHtmlEllement extends GeneriqueHTMLEllement{
    constructor(htmlEllement) {
        super(htmlEllement);
    }
    get value(){
        return this.htmlEllement.value
    }

    set value(text){
        //if text is a string
        if(typeof text === "string") {
            this.htmlEllement.value = text
        }else{
            /*
            wolrdWhithOffset : { word : string , start : int , oldword : int }
             */
            let wordWithOffet = text;
            //We recopose the text
            let newText = "";
            for (let i = 0; i < wordWithOffet.length; i++) {
                let word = wordWithOffet[i];
                newText += word.word;
                if(word.word!=="\n"){
                    newText += " ";
                }
            }
            let lastCharIsNewLine = this.htmlEllement.value.slice(-1).match(/\n/);
            //we trim to remove multple space at end
            this.htmlEllement.value = newText.trim()+" ";
            if(lastCharIsNewLine){
                this.htmlEllement.value += "\n";
            }
        }

    }

    get text(){
        return this.htmlEllement.value
    }

    get isAtEnd(){
        return this.selectionStart>=this.value.trim().length;
    }
    addCompletion(completion){
        console.log("addCompletion",completion);
        this.htmlEllement.value = completion
    }
    get selectionStart(){
        return this.htmlEllement.selectionStart
    }

    get selectionEnd(){
        return this.htmlEllement.selectionEnd
    }

}