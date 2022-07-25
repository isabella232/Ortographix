class GlobalEllement{
    constructor(ellement) {
        this.text= ellement.value
        this.lastUpdate=Date.now()
        this.previousUpdate=Date.now()
        this.htmlElement = ellement
        this.cursorStart = 0
        this.cursortEnd  = 0
        this.isEdited =  false
        this.editedWord= [] //Array of object { word:string,start:int,oldword:string}
    }

    isAtTheEnd(){
        return this.htmlElement.isAtEnd
    }
}