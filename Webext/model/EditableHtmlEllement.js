


class EditableHtmlEllement extends GeneriqueHTMLEllement{
    savedRange;
    singleton_ellment;
    constructor(htmlEllement) {
        super(htmlEllement);
    }

    get text(){
        return this.htmlEllement.innerText
    }

    get value(){
        //return this.htmlEllement.textContent
        return this.htmlEllement.innerHTML
    }
//@TODO : Fixe le bug lorsque quil y a des ellment dans les ellement editable
    set value(text){
        let ellementInfo,start;
        console.log("original ellment ",this.htmlEllement)
        console.log(" Carret postion ",EditableHtmlEllement.getCaretPosition())
        this.htmlEllement.focus();

        let errorWindos = false

        let element = this.htmlEllement
        var doc = element.ownerDocument || element.document;
        var win = window

        if(win.getSelection)//non IE Browsers
        {
            start = EditableHtmlEllement.getCaretPosition()
            let temp = undefined
            try {

                temp = win.getSelection().getRangeAt(0)
            }catch(e){
                win = doc.defaultView || doc.parentWindow;
                temp = win.getSelection().getRangeAt(0)
                errorWindos = true
            }

            //this.savedRange = {commonAncestorContainer:temp.commonAncestorContainer, startContainer: temp.startContainer, startOffset: temp.startOffset, endContainer: temp.endContainer, endOffset: temp.endOffset, collapsed: temp.collapsed }
            //this.savedRange = temp.cloneRange()
            ellementInfo = this.getPathOfEllement(win.getSelection().anchorNode)
            console.log("save range",temp,ellementInfo,win.getSelection(),start);
        }
        //this.htmlEllement.textContent = text
        //console.log("before",cursorPosition)

        //////////////////////////////////////
        //We apply the correction to the html ellment
        this.updateWord(text)
        //////////////////////////////////////////


        console.log("after updae word")

        var range = document.createRange()
        var sel = window.getSelection()
        let allSelector = document.querySelectorAll(ellementInfo.path);
        console.log("range all selector",allSelector)
        let el;
        if(allSelector.length===ellementInfo.digit){
            el = allSelector[ellementInfo.digit-1]
            range.collapse(true)
        }else {
            el =allSelector[0]
        }
        if(el ===undefined){
            el = this.htmlEllement
        }
        let child = el.childNodes[ellementInfo.digit]
        if(child===undefined){
            child = el;
        }

        if(child.firstChild!==undefined && child.firstChild!==null && child.nodeType !==3){
            child = child.firstChild
        }
        console.log("range el", el, child,start,range)
        try {
            let rangeUse = Math.min( Math.max(0, start ),child.textContent.length-1)
            console.log("range use",rangeUse)
            range.setStart(child,rangeUse)
            range.collapse(true)
            sel.removeAllRanges()
            sel.addRange(range)
            console.log("range done")
        }catch(e){
            console.log("range error",e)
            console.log("range set at end",range)
            this.placeCaretAtEnd(this.htmlEllement)
        }
        if(errorWindos){
            this.placeCaretAtEnd(this.htmlEllement)
        }

        // this.placeCaretAtEnd(this.htmlEllement.lastChild)

        //set the cursor at the correct postion
        /*
        try{
            var range = document.createRange()
            var sel = window.getSelection()
            console.log("range count",sel.rangeCount,range.endOffset)
            console.log(this.htmlEllement.children)

            this.updateWord(text)
            range.setStart(this.htmlEllement.lastChild,cursorPosition)
            range.collapse(true)
            sel.removeAllRanges()
            sel.addRange(range)
        }catch(e){
            console.log("error : "+e)
            this.updateWord(text)
        }

         */

    }

    placeCaretAtEnd(el,curentDoc = document) {
        try {
            console.log("Place carret",el)
            // el.focus();
            if (typeof curentDoc.defaultView.getSelection != "undefined"
                && typeof curentDoc.createRange != "undefined") {
                var range = curentDoc.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = curentDoc.defaultView.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                if (sel.type == "None" && curentDoc === document) {
                    //if we are here he can be we are in the iframe
                    //so we need to find the iframe parenet to fixe that
                    console.log("seltype == none")
                    this.placeCaretAtEnd(el, el.ownerDocument)

                    console.log("sel", sel)
                } else if (typeof curentDoc.body.createTextRange != "undefined") {
                    console.log("we can update the carry")
                    var textRange = curentDoc.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.collapse(false);
                    textRange.select();
                    console.log("text range", textRange)
                } else {
                    console.log("not of this type ",curentDoc.body,curentDoc.body.createTextRange)
                }
            } else {
                console.log("windos or doc undefined", curentDoc.defaultView.getSelection, typeof curentDoc.createRange)
            }
        }catch (e){
            console.log("error in the carret",e,el)
        }
    }


//Metode to find postion
    bruteForce2(){
        let element = this.htmlEllement
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel, range, preCaretRange, caretOffset = 0;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ( (sel = doc.selection) && sel.type != "Control") {
            range = doc.selection.createRange();
            preCaretRange = doc.body.createTextRange();
            preCaretRange.moveToElementText(element);
            preCaretRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        console.log("Bruteforc 2 ",caretOffset)
        return caretOffset;
    }


    get selectionStart(){
        this.fucus()
        EditableHtmlEllement.singleton_ellment = this.htmlEllement
        let pos = EditableHtmlEllement.getCaretPosition()
        if(pos ===-1){

            pos = this.bruteForce2();
            console.log(document.getSelection())

        }
        return pos
    }

    get selectionEnd(){
        return document.getSelection().focusOffset
    }

    get isAtEnd(){
        try {
            var selectedObj = window.getSelection();
            let curentText = selectedObj.anchorNode.textContent
            let allText = this.text
            //Index
            let index = (allText.indexOf(curentText) + 1) - (allText.length - curentText.length)
            console.log("findEditedEllement index", index, curentText, "|", allText, allText.indexOf(curentText), allText.length, curentText.length, EditableHtmlEllement.getCaretPosition())

            //if the index is up to 0 we are in the last section (in the case of mulplte htlm ellment in the dom)
            if ((allText.indexOf(curentText) + 1) >= (allText.length - curentText.length)) {

                return EditableHtmlEllement.getCaretPosition() >= curentText.length
            }
        }catch(e){
            console.log(e)
        }
        return false

    }
    /*
             wolrdWhithOffset : { word : string , offset : int , oldword : int }
              */
    updateWord2(wordWithOffet){
        console.log("repalce text 2","original : ",this.htmlEllement.innerHTML," new : ",wordWithOffet)

        let text = this.htmlEllement.innerHTML;
        for (let i = 0; i < wordWithOffet.length; i++) {
            //We replace the first old word by the new word
            let word = wordWithOffet[i];
            let start = word.offset;
            let oldWord = word.oldWord;
            let newWord = word.word;

            //replace the first tim the old word by the new word
            //console.log("replace",oldWord,"by",newWord)
            //Split text at offet
            text  = text.replace(oldWord,newWord);
            //let newText = this.replaceAt(start+1,text,newWord);


        }
        console.log(this.htmlEllement)
        console.log(text)
        this.htmlEllement.innerHTML = text;
    }
    updateWord(wordWithOffet){
        console.log("too")
        console.log("repalce text ","original : ",this.htmlEllement.innerHTML," new : ",wordWithOffet,"type",typeof wordWithOffet)
        let regex = /<.*>/gm;
        if(wordWithOffet instanceof String || typeof wordWithOffet === 'string') {

            this.recursiveReplace(wordWithOffet)
            return;
        }
        let text ="";
        for (let i = 0; i < wordWithOffet.length; i++) {
            let word = wordWithOffet[i];
            console.log(word)
            text+=word.word;
            //if we have a space in the text
            if(!word.word.match(regex)){
                //text+=" "
            }
        }
        console.log("before replacement",text)


        this.recursiveReplace(text)

        //We use replace instead = to fixe a bug about the carry
        //this.htmlEllement.innerHTML.replace(this.htmlEllement.innerHTML,text) ;

        console.log("new text ",text)
    }
    /*
    Recursive function to set the text . We use this metode to avoid the lost of the event bind to the dom ellement
     */
    recursiveReplace(text){
        var doc= document.createElement('div');
        doc.innerHTML= text;
        this.recursiveReplace_worker(this.htmlEllement,doc)
    }

    recursiveReplace_worker(original, newObject){
        if(original === undefined ||   newObject===undefined){
            console.log("recusive worker ERROR",original, newObject)
            return;
        }
        if(original.nodeType  === 3){
            //   original.nodeValue = newObject.nodeValue



                if(original.parentNode!==undefined && newObject.parentNode!==undefined){
                    //   original.parentNode.textContent = newObject.parentNode.textContent
                    original.textContent = newObject.textContent
                }else{
                    original.nodeValue = newObject.nodeValue
                }





            /*
            WIP : need for website like discord to simulate a user input

            if(chrome !=null) {

               let deleteEvent = new InputEvent("beforeinput",{
                    bubbles: true,
                    cancelable: true,
                    inputType: "deleteContent"
                });
                original.dispatchEvent(deleteEvent);
                console.log(deleteEvent)
                document.execCommand("delete", false)


            //We Use the clibord envent to paste this metode is to ensure that event can be trigger (this is usfull in somme app like discord)
                let clibordEvt
                (clibordEvt = new ClipboardEvent("paste",{
                    clipboardData: new DataTransfer,
                    cancelable: !0,
                    bubbles: !0
                }),
                    clibordEvt.clipboardData.setData("text/plain", newObject.nodeValue),
                undefined && clibordEvt.clipboardData.setData("text/html", undefined));
                let a = original.dispatchEvent(clibordEvt);
                console.log("a is ",a)
                //if the action is not execute a is true , so we use the old metode to apply the chagne
                if(!a){
                    if(original.parentNode!==undefined && newObject.parentNode!==undefined){
                        console.log("Set the html",newObject.parentNode.innerHTML,[newObject.parentNode])
                        console.log(newObject.parentNode.execCommand)
                        //   original.parentNode.textContent = newObject.parentNode.textContent
                        original.textContent = newObject.textContent
                    }else{
                        original.nodeValue = newObject.nodeValue
                    }

                }



            }else {

                let deleteEvent = new InputEvent("beforeinput",{
                    bubbles: true,
                    cancelable: true,
                    inputType: "deleteContent"
                });
                original.dispatchEvent(deleteEvent);

                let clipEvent   =  new ClipboardEvent("paste",{
                    bubbles: !0,
                    cancelable: !0,
                    data: newObject.nodeValue,
                    dataType: "text/plain"
                })

                let isDispatch = original.dispatchEvent(clipEvent)
                console.log("is dispatch firefox", isDispatch)

                let r = new InputEvent("beforeinput", {
                    data: newObject.nodeValue,
                    inputType: "insertFromPaste",
                    cancelable: !0,
                    bubbles: !0,
                });
                console.log(r)
                r.dataTransfer.setData("text/plain", newObject.nodeValue)
                isDispatch = original.dispatchEvent(r)
                console.log("is dispatch", isDispatch)
            }

             */
        }


        for(let i=0;i<original.childNodes.length;i++){
            this.recursiveReplace_worker(original.childNodes[i],newObject.childNodes[i])
        }
    }

    replaceAt (start,text, replacement) {
        if (start >= this.length || replacement === undefined || replacement.length <=0) {
            return text.valueOf();
        }
        console.log("before",text)
        var chars = text.split('');
        let length =chars.length;
        console.log("chars legth",length)
        for(var i = 0; i < length; i++) {
            chars[start+i] = replacement.charAt(i);
            console.log(i)
            if(start+i>100){
                break;
            }
        }
        console.log("after",chars.join(''),"start",start,"replacement",replacement)
        return chars.join('');
    }
    addCompletion(completion){
        let cursorPosition = document.getSelection()
        // this.htmlEllement.innerHTML = completion
        let ellemtAtCretPos = this.getDOMEllmentAtCarretPos();
        console.log("ellemtAtCretPos",ellemtAtCretPos)
        console.log("In autocomption set ",completion)
        let bcp = this.value;
        this.htmlEllement.innerHTML = completion
        console.log("before",cursorPosition)
        console.log("ellement",this.htmlEllement)
        //get the previous child of the first elle who have the class  textPropostion
        let allPossibleEllement = this.htmlEllement.getElementsByClassName("textPropostion")
        if(allPossibleEllement.length>0){
            let ellemt = allPossibleEllement[0].previousSibling;
            console.log("ellemt",ellemt)
            this.placeCaretAtEnd(ellemt);
        }else{
            this.placeCaretAtEnd( this.htmlEllement.childNodes[0]);
        }
        console.log("At the end of completion ",this.htmlEllement.innerHTML)


    }

    restoreSelection()
    {
        let isInFocus = true;
        this.htmlEllement.focus();
        if (this.savedRange != null) {
            if (window.getSelection)//non IE and there is already a selection
            {
                var s = window.getSelection();
                if (s.rangeCount > 0)
                    s.removeAllRanges();
                console.log("add range",this.savedRange)
                s.addRange(this.savedRange);
            }
            else if (document.createRange)//non IE and no selection
            {
                window.getSelection().addRange(this.savedRange);
            }
            else if (document.selection)//IE
            {
                this.savedRange.select();
            }
        }
    }

    getDOMEllmentAtCarretPos(){
        var node = document.getSelection().anchorNode;

        if (node==null){
            let element = this.htmlEllement
            var doc = element.ownerDocument || element.document;
            var win = doc.defaultView || doc.parentWindow;
            node = win.getSelection().anchorNode;
            if(node == null){
                node = this.htmlEllement
            }
        }

        return (node.nodeType == 3 ? node.parentNode : node);
    }

    getPathOfEllement(el){
        let digit = 0;
        const regex = /:nth-child\(\d\)/gm;
        const regexDigit = /:nth-child\((\d)\)/gm;
        //We use the previous function
        let path = cssPath(el,false)
        console.log("range path ",path)
        let AllEllment = path.split(">");
        let other = Array.from(AllEllment[AllEllment.length-1].matchAll(regexDigit), m => m[1]);
        if(other.length>0){
            digit = parseInt(other[0])
        }
        let str =""
        for(let ellementToClean of AllEllment){
            str += ellementToClean.replace(regex,"")
        }
        //console.log("done path ",document.querySelector(str),digit)
        return {"path":str,"digit":digit};
    }


    static getCaretPosition(selection=window.getSelection()) {
        try {
            if (selection && selection.getRangeAt) {
                var range = selection.getRangeAt(0);
                var selectedObj = selection;
                var rangeCount = 0;
                var childNodes = selectedObj.anchorNode.parentNode.childNodes;
                for (var i = 0; i < childNodes.length; i++) {
                    if (childNodes[i] == selectedObj.anchorNode) {
                        break;
                    }
                    if (childNodes[i].outerHTML)
                        rangeCount += childNodes[i].outerHTML.length;
                    else if (childNodes[i].nodeType == 3) {
                        rangeCount += childNodes[i].textContent.length;
                    }
                }
                return range.startOffset + rangeCount;
                //return range.startOffset;
            }
        }catch (e){
            console.log(e)
            console.log("Selection for the error ",window.getSelection())
        }
        return -1;
    }

}