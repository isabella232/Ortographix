

//We create 3 class to make the code generic , the metode used to modify the html ellement are not the same , to simplfye i use a meta object who emulate the original object
class GeneriqueHTMLEllement{
    constructor(htmlEllement) {
        this.htmlEllement = htmlEllement
    }
    static CREATE_CUSTOM_HTML_ELLEMENT(htmlEllement){

        if(htmlEllement.getAttribute("contenteditable")==="true"){
            return new EditableHtmlEllement(htmlEllement)
        }else{
            return new InputHtmlEllement(htmlEllement)
        }

    }

    get text(){
        return this.htmlEllement.value
    }

    get isAtEnd(){
        return true
    }

    addCompletion(completion){
        console.log("addCompletion Generic")
        this.htmlEllement.value = completion
    }

    fucus(){
        this.htmlEllement.focus();
    }
}