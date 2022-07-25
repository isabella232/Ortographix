let test =42;

/*
@param {event]
This metode is active evry time the user wrinte in a field
 */
function atInput(e) {
    e = e || window.event;

    var target = e.target || e.srcElement

    if(RequestIsEnd ){
        ellementEdited(target,e)
    }else{
        console.log("request is not end")
    }


}
/*
This functon run evry second and check if the user is the user has stop to wrinte for more than 5 seconds
If he has stop we can run the correction
 */
function checkIfWeRunTextCorrection(){

    //we conpare the curent time with the last time we run the text correction
    let deltaTime =  Date.now() - lastUpdate;

    if(deltaTime > minDelayInSeconds*1000 && previousUpdate !== lastUpdate){
        previousUpdate = lastUpdate;

        //we need to check in the case of many field is edited at the same time
        //for all k,v in ellementDict
        for(var key in ellementDict){
            let   ellement = ellementDict[key].htmlElement;
            console.log("key",key,"ellement",ellement,ellementDict)
            if(ellementDict[key].previousUpdate !== ellementDict[key].lastUpdate){
                // ellementDict[ellement].text = ellement.value;

                try{
                    console.log("we run the correction")
                    console.log(ellementDict)
                    if(activate){
                        getCorectionHTTPRequest(ellement,ellement.value)
                    }else{
                        console.log("Correction est desactive",activate)
                    }
                    if(needAutoCompletion(ellement) && prediction){
                        console.log("we run the auto completion",prediction)
                     //   getCompletionHTTPRequest(ellement,ellement.value)
                    }

                }catch (e){
                    console.log("is dead object",e,ellement)
                }

                console.log("after get corection")

                console.log("finish the correction")
            }else{
                console.log("no change",ellementDict[key].previousUpdate,ellementDict[key].lastUpdate)
            }

        }

    }

}
//This function is call when we type in a field
function ellementEdited(rawellement,e=null){
    let key = e ? e.key :"";
    console.log("event e is",e)
    wordStarSift =[];
    console.log("rawellement",rawellement)
    //We creae a meta ellement to make the code generic
    let ellement = GeneriqueHTMLEllement.CREATE_CUSTOM_HTML_ELLEMENT(rawellement)
    let css =cssPath(rawellement)
    //If ellemntDict not contain the ellement
    //if(!ellementDict.hasOwnProperty(css)&& typeof ellementDict[css].htmlEllement !== "undefined"){
    if(!ellementDict.hasOwnProperty(css)){
        ellementDict[css]=new GlobalEllement(ellement)
        console.log("we add to ellement",ellementDict)
    }else{
        console.log("ellm dict ",ellementDict)
    }



    if(checkIfTabIsPress(key,ellement)){
        console.log("we are in the tab")
        e.preventDefault();
        applycompletion(ellement)
        return;
    }

    try{
        //this event is trigger in pressDown , so the letter is not addeed to the text , we add them manually
        let missingLetter =" "
        if(key.length<=1){
            missingLetter = key
        }
       let isRemove = removeStartText(ellement,missingLetter)
        //if we have replamce we not set a correction
        if(isRemove){
            console.log("we have remove")
            return;
        }
    }catch (e) {
        console.log(e)
    }

    //we check if the word tapped is a edition
    findEditedEllement(ellement,key)
    updateEditedWordStart(ellementDict[cssPath(ellement)].editedWord)




    let isAtTheEnd_ = ellement.selectionStart>=ellement.value.trim().length;

    let lastChar = ellement.value.slice(-1);

    //check if the key is a space , a tab or a enter
    let isSpace = key === " " || key === "Tab" || key === "Enter";

    //&&isAtTheEnd_
    //if last char is a space , tab , new line , ....
    if((lastChar.match(/\s/)||lastChar.match(/\n/) || lastChar.match(/\./) || lastChar.match(/,/)|| lastChar.match(/>/)) && isSpace){
        console.log("last char is a space")
        console.log(ellement.value)


        let prevText = ellementDict[cssPath(ellement)].text;

        //count the number of space in the text
        let numberOfSpaceInPrevText = prevText.split(" ").length -1;
        let numberOfSpaceInText = ellement.value.split(" ").length -1;

        //to prevent to send a requeste when pepole just edit a value we check if the lenght have inciese , if the lenght have not insie maybe he have rewrite a prts of the text , so we check if the a the big diffrent of word
        if((prevText.length < ellement.value.length) || (numberOfSpaceInPrevText > numberOfSpaceInText-2)){

            ellementDict[cssPath(ellement)].lastUpdate = Date.now();
            lastUpdate = Date.now();
            //the function call to run the correction is in : checkIfWeRunTextCorrection()

        }

    }else{
        let prevText = ellementDict[cssPath(ellement)].text;
        console.log("on ne lance pas la correction ",lastChar," isAtTheEnd_ ",isAtTheEnd_," prev text ",prevText," text ",ellement.value)
    }
}



/*
When we add or edit word the start of the word change ,
 and we need to update the start of the word for the next time we edit or correct the word
This function update the start of the word

@Input  editedWordList:[{
            word:string,
            start:int,
        }]

wordStarSift : [{

                start:int,
                delta: int
            }]



*/
function updateEditedWordStart(editedWordList){
    console.log("updateEditedWordStart",editedWordList)
    console.log("wordStarSift",wordStarSift.length)
    //for all object in wordStarSift  we get the start and we look if we find in the editedWordList
    for(let i = 0; i<wordStarSift.length;i++){
        let wordStarSiftObject = wordStarSift[i];
        let start = wordStarSiftObject.start;
        let delta = wordStarSiftObject.delta;
        let isFound = false;
        //for all the edited word in ellelment.editedWord we check if the word is at the same offest
        for(let j = 0; j<editedWordList.length;j++){
            let editedWord = editedWordList[j];
            if(editedWord.start < start){
                //if it is we replace it
                editedWord.start += delta;
            }
        }

    }

}

/*
A recursive function to add the event key up for all ellement adn theyr child in the dom
The invent keydown is used to dected when persone write

 */
function recuriveAddEventToChildren(added_node){
    if(added_node.getAttribute("contenteditable")==="true"){
        console.log("content editable and add event",added_node)
        added_node.addEventListener('keydown',atInput , false);
        observer.observe(added_node, { subtree: true, childList: true });
    }
    //If added Node is a iframe
    if(added_node.tagName.toLowerCase()==="IFRAME".toLowerCase()){
        console.log("iframe add event",added_node)
        added_node.addEventListener('keydown',atInput , false);
        observer.observe(added_node, { subtree: true, childList: true });
        recuriveAddEventToChildren(added_node.contentWindow.document.body)
    }
    //for all children
    for(let i = 0; i<added_node.children.length;i++){
        recuriveAddEventToChildren(added_node.children[i]);
    }
}


/*
We add event to obsver when we write
 */
//Run the code at start
function addEventToAllNode(areas) {
    console.log("addEventToAllNode",areas.length,areas)
//for each textarea create add a event litenet for typing
    for (var i = 0; i < areas.length; i++) {
        //clear event listener for the input
        areas[i].removeEventListener('keydown', atInput)

        //get all parent and remove event
        let parent = areas[i].parentElement
        while (parent) {
            //if parent have contenteditable=true
            if (parent.getAttribute("contenteditable") !== "true") {

                parent.removeEventListener('keydown', atInput)
            } else {
                console.log("contenteditable", parent)
                console.log("added vent to parent ")
                parent.addEventListener('keydown', atInput, false);
                observer.observe(parent, {subtree: true, childList: true});
            }
            //if area is iframe
            if (areas[i].tagName === "IFRAME") {
                console.log("iframe", areas[i])
                //recuriveAddEventToChildren(areas[i])
                //add function when iframe is loaded
                areas[i].addEventListener('load', function (e) {
                    console.log("iframe loaded", e.target,e.target.contentWindow.document.body)
                    addEventToAllNode(e.target.contentWindow.document.body.getElementsByTagName("*"))
                });
            }

            parent = parent.parentElement
        }
//A complete avec les event suivant : https://stackoverflow.com/questions/1948332/detect-all-changes-to-a-input-type-text-immediately-using-jquery
        areas[i].addEventListener('keydown', atInput, false);
        observer.observe(areas[i], {subtree: true, childList: true});
        // console.log("add event listener", areas[i])


    }
}

//////////////////////////////////////////////////////////////////////
// CHECK EDIT
//////////////////////////////////////////////////////////////////////
//this function find and add the edited ellement
//A editerd ellement is a ellement who the writer change and he not need to be corrected
function findEditedEllement(ellement,key){

    let prevEllmentStat = ellementDict[cssPath(ellement)]
    console.log("findEditedEllement cssPath",cssPath(ellement)," ----- ",ellementDict," --",ellement)
    console.log("findEditedEllement prevEllmentStat",prevEllmentStat)
    console.log("findEditedEllement selection start",ellement.selectionStart,EditableHtmlEllement.getCaretPosition(),prevEllmentStat.isAtTheEnd())
    return ;

    //let prevEllmentStat = ellementDict[cssPath(ellement)]
    console.log("cssPath",cssPath(ellement)," ----- ",ellementDict," --",ellement)
    console.log("prevEllmentStat",prevEllmentStat)

    let isAtTheEnd_ = ellement.selectionStart>=ellement.value.trim().length;

    //if key is arrow
    let isArrow = key.length>1 && key.indexOf("Arrow")>-1;

    if(!isAtTheEnd_&&!isArrow){
        console.log("edit")
        prevEllmentStat.isEdited = true;

    }
//get char at cursor
    let charIsSpace = ellement.value.charAt(ellement.selectionStart-1) === " ";
    let isArrowRight = key === "ArrowRight";

    //If the cursor back at the end after a edit
    if( (prevEllmentStat.isEdited&&isAtTheEnd_) || (prevEllmentStat.isEdited && isArrowRight && isArrowRight && charIsSpace)){
        console.log("fin de l'edit")
        let size = Math.min(Math.abs(ellement.value.length - prevEllmentStat.text.length),2);
        let arrayOfDif = firstDiffIndex(ellement.value,prevEllmentStat.text,size);
        console.log("modfication extaint ",size,arrayOfDif,ellement.value,prevEllmentStat.text)
        let indexFirstModifcation = arrayOfDif[0]
        let indexLastModifcation = arrayOfDif[1]
        let startOfTheWord = findFirstIndexOfWord(ellement.value,indexFirstModifcation)+1

        let allWordEdited = ellement.value.slice(startOfTheWord,indexLastModifcation)
        console.log("allWordEdited",allWordEdited.trim(),startOfTheWord,ellement.value.charAt(startOfTheWord))

        if(allWordEdited.charAt(0) === " "){
            startOfTheWord++;
        }
        //we add the word edided with the index of the start of the word
        prevEllmentStat.editedWord.push({
            word:allWordEdited.trim(),
            start:startOfTheWord,
            oldWord:allWordEdited.trim()
        })
        //We add to the modifcation the difference of length bettwen the string to addapte for the correction
        wordStarSift.push(
            {
                start:startOfTheWord,
                delta: ellement.value.length-prevEllmentStat.text.length
            }
        )
        console.log("wordStarSift",wordStarSift);

        prevEllmentStat.text = ellement.value
    }

    prevEllmentStat.isEdited = !isAtTheEnd_;
    prevEllmentStat.cursorStart =ellement.selectionStart;
    prevEllmentStat.cursorEnd = ellement.selectionEnd;
}

function checkIfWeClickOutSide(clickedEllement){
    removeAllCompletion();
}


function checkIfTabIsPress(key,htmlEllement){
    console.log("htmlEllement for tab ",htmlEllement,key,typeof key)
    let tmp = htmlEllement.htmlEllement.getElementsByClassName("textPropostion")
    console.log("htmlEllement for tab tmp",tmp)
    let haveTextProposition = tmp.length>0;
    console.log("htmlEllement for tab haveTextProposition",haveTextProposition)
//if key is tab
    console.log("htmlEllement for tab res = ",key === "Tab" && haveTextProposition)
    return key === "Tab" && haveTextProposition;
}



document.addEventListener('click', function(event) {
    console.log("click",event.target)
    checkIfWeClickOutSide(event.target)
});