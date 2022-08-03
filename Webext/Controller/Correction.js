//Find the first index of the the diffeence and the last index of the diffeence

/*
@Input :
    editedString    : the text after the edit
    originalString  : the text before the edit
    minCommonPart   : number of char to be common between the two string te be considerate as the same part
@Output :
    indexFirstModifcation : first diffrence between the two string
    indexLastModifcation  : last diffrence between the two string
 */
function firstDiffIndex(editedString,originalString,minCommonPart =2){
    let i = 0;
    while(editedString.charAt(i) === originalString.charAt(i)&&i<editedString.length&&i<originalString.length){
        i++;
    }
    let firstDif = i-1;

    //we whait to find a space after the first dif (and incrment the index i)
    while(!originalString.charAt(i).match(/\s/)&&i<originalString.length){
        i++;
    }
//first char after space
    i++;

//we wait to found the common part
    let found = false;
    let j = firstDif+1;
    let ii =0;
    while(!found&&j<editedString.length&&ii<editedString.length) {
        while (editedString.charAt(j) !== originalString.charAt(i) && j < editedString.length) {
            j++;
        }
        let cnt =0;
        while (originalString.charAt(i+cnt) === editedString.charAt(j+cnt) && j+cnt < editedString.length&&i+cnt<originalString.length && cnt<minCommonPart) {
            cnt++;
        }
        found = cnt>=minCommonPart;
        ii++;
    }

    let firstDifEnd = found ? j : firstDif;
    return [firstDif,firstDifEnd];
}

//this function find the first index of the word
function findFirstIndexOfWord(allText,start){
    //we find the first chart who is not a space
    while(start>0&&allText.charAt(start)===" "){
        start--;
    }
    //we find the first space
    while(start>0&&allText.charAt(start)!==" "){
        start--;
    }
    return start;
}
//////////////////////////////////////////////////////////////////////


/*
We get a html text in input
and we whant a json of the
ex :
Input : A <b>test</b>
Output :{"annotation":[
 {"text": "A "},
 {"markup": "<b>"},
 {"text": "test"},
 {"markup": "</b>"}
]}
 */




/*
This function correct the text , the goald is to match the current text with the corretion give by the server
 */
function correctText(data,element) {
    wordStarSift =[]
    let wordWithOffet = []
    let phraseLength = 0;

    //if we have no match we not procede to the correction
    if(data.matches.length<=0){
        return;
    }

    let oldText = element.value;

    //claen ellement vallue by replace mutliple space by one space
    //element.value = element.value.replace(/  +/gm, ' ');

    //Split the ellemnt.value by the spaces
    wordWithOffet = splitTheEllement(element,phraseLength)
    console.log("Ellement split : "+wordWithOffet)
    //print word with offset
    for(let i = 0; i<wordWithOffet.length;i++){
        console.log("-",wordWithOffet[i].word, ":",wordWithOffet[i].offset)
    }


    //When we have all the matches we can correct
    let matches = data.matches;
    //for all matches get the offset , the length and the remplacement array
    let delta = 0;
    for (let i = 0; i < matches.length; i++) {
        let match = matches[i];
        //We use the delta in the case if we find the first match in the text , generaly the other space are the same betwwen the word
        delta = applyReplacement3(match,wordWithOffet,element,delta)
        console.log("delta",delta)
    }

    console.log("wordWithOffet", wordWithOffet)
    setCorrection(element,wordWithOffet)
    /*
    //We recopose the text
    let newText = "";
    for (let i = 0; i < wordWithOffet.length; i++) {
        let word = wordWithOffet[i];
        newText += word.word;
        if(word.word!=="\n"){
            newText += " ";
        }
    }
    let lastCharIsNewLine = element.value.slice(-1).match(/\n/);
    //we trim to remove multple space at end
    element.value = newText.trim()+" ";
    if(lastCharIsNewLine){
        element.value += "\n";
    }


     */
    console.log("new text", oldText,"\n \n \n ===== \n \n ",element.value)
    RequestIsEnd = true;

    updateEditedWordStart(ellementDict[cssPath(element)].editedWord)
    //We set to not rerun the function before a other modifcation
    ellementDict[cssPath(element)].previousUpdate = Date.now();
    ellementDict[cssPath(element)].lastUpdate= ellementDict[cssPath(element)].previousUpdate;
    //We try to get a completion for the text
    //getCompletionHTTPRequest(element,element.value)
}


function splitTheEllement(element,phraseLength){
    let wordWithOffet =[]
    let textArray = splitText(element.value);
    console.log("textArray",textArray)
    for (let i = 0; i < textArray.length; i++) {
        let word = textArray[i];
        //if we have new line in word , we split the word by the new line
        if(word.match(/\n/)&&word.length>0&&word!=="\n"){

            //get the first chart of the word and check if is a new line
            let wordStartByNewLine = word.charAt(0)==="\n";
            let wordEndByNewLine = word.charAt(word.length-1)==="\n";

            if(wordStartByNewLine){
                //we add the new line
                wordWithOffet.push({
                    word: "\n",
                    oldword: "\n",
                    offset: phraseLength
                })
                //phraseLength +=1;
            }

            let wordArray = word.split("\n");
            for (let j = 0; j < wordArray.length; j++) {

                let word = wordArray[j];
                //if the word is not empty we add them
                if(word.length>0) {
                    wordWithOffet.push({
                        word: word,
                        oldword: word,
                        offset: phraseLength
                    })
                    phraseLength += word.length;
                }
//if we are not the last word we set the split , if we are the last be he need to finish with line we add it
                if(j!==wordArray.length-1 || wordEndByNewLine){
                    //we add the new line
                    wordWithOffet.push({
                        word: "\n",
                        offset: phraseLength,
                        oldword: "\n"
                    })
                    //phraseLength +=1;
                }

            }
            console.log("Ajout espace apres retoure ligne ",phraseLength)
        }else {
            let wordandOffet = {
                word: word,
                offset: phraseLength,
                oldWord: word
            }
            wordWithOffet.push(wordandOffet)
            console.log("Ajout du mot ",word," taille  ",word.length," phraseLength ",phraseLength)
            //word plus space
            let regex = /<.*>/gm;
            //if we have a html balise we not add extra space
            phraseLength += word.length;
            if(!word.match(regex)){
                //phraseLength +=  1;
            }

        }
    }
    return wordWithOffet
}

function setCorrection(element,wordWithOffet){
    element.value = wordWithOffet
}

/*
@Input match : Object {
            length : int
            , offset : int
            replacements : Array [{value :string , curative ? : boolean }]
            }
            wordWithOffeset : Array[Object { word: string, offset: int }]
            element : GeneriqueHTMLEllement
            delta : int => use if they are a difference betwwen all the text
 */
function applyReplacement3(match,wordWithOffet,element,delta=0){
    console.log("Replacemnt 3")
    let offset = match.offset;


    //find the first index who match word
    let start = offset;
    let i =0;
    let word =""
    while(i<wordWithOffet.length){
        word = wordWithOffet[i]
        //If we have found the word
        if(word.offset>=start){
            break;
        }
        i++;
    }
    let j =i+1

    if((wordWithOffet[i].word in nonEditableWord)){
        console.log("nonEditableWord cancelle",wordWithOffet[i].word,nonEditableWord,(wordWithOffet[i].word in nonEditableWord))
        return 0;
    }
    //We chack if we need to merge the next item
    while(j<wordWithOffet.length){
        //If the next word have a offset who match with the selection whe merge it
        if(wordWithOffet[j].offset <= start+match.length-1){
            //console.log("merge ",wordWithOffet[i].word,"+",wordWithOffet[j].word," || ",wordWithOffet[j].offset," ? ",start+match.length, " == ",( wordWithOffet[j].word !== " "))

            //if the word is in the non eidtable word list we stop the process for the match : we not whant to correct a word of the list

            if((wordWithOffet[j].word in nonEditableWord)){
                console.log("cancelle nonEditableWord",wordWithOffet[j].word,nonEditableWord,(wordWithOffet[j].word in nonEditableWord))
                return 0;
            }

            //We only merge if the word is not a space
            if( wordWithOffet[j].word !== " "){
                //Merge
                wordWithOffet[i].word +=" "+wordWithOffet[j].word
                console.log("Slice ",wordWithOffet[j]," at ",j)
                wordWithOffet.splice(j,1)
            }else{
                //we skip the space
                j++
            }

        }else{
            break;
        }
        //We not incrent j because the lenght of the array have change
    }

    let replacementText = chooseProposition(match,wordWithOffet)

    //word = wordWithOffet[i]
    console.log("word, replacementText",word, replacementText)
    //We replace the word
    if(!isPersonalWord(wordWithOffet[i])){
        wordWithOffet[i].word = replacementText
    }

    //replaceWord(word, replacementText, element);
    //for the delta
    return 0;
}






////////////////////////////////////////////////////////////////////////
//The goald is to find the closed propotion beween all possible correction
/*
@Input match : data form match
       wordWithOffeset : Array[Object { word: string, offset: int }]
@Out string
 */
function chooseProposition(match,wordWithOffet){
    console.log("=====")
    console.log(match)
    let start = match.offset;
    let end = start+match.length

    //1 : the fist step is to recobine the all portion need to be corrected
    let word =""
    for(let i =0;i<wordWithOffet.length;i++){
        //if we go out of the limit we stop to looking for the word
        if(wordWithOffet[i].offset>end){
            break;
        }
        if(wordWithOffet[i].offset>=start){
            word +=wordWithOffet[i].word+" "
        }
    }
    word = word.trim();
    if(match.replacements.length===0){
        return word;
    }
    console.log("combined word",word)
    //2 : We found the close propostion
    let replacements = match.replacements;
    let close = replacements[0].value;
    let minDist = levenshteinDistance(word.toLowerCase(),close.toLowerCase())
    if(word=="pdf"){
        console.log(close,minDist)
    }
    for(let i =1;i<replacements.length;i++){

        let levDistance = levenshteinDistance(word.toLowerCase(),replacements[i].value.toLowerCase());
        if(word=="pdf"){
            console.log(replacements[i].value,levDistance)
        }

        if(levDistance<minDist){
            close = replacements[i].value;
            minDist = levDistance;
            //in somme case the corrected say if is currated , in this case we choise this metode
        }else if (replacements[i].type!==undefined && levDistance<=minDist ){
            close = replacements[i].value;
        }
    }
    console.log("Close is ",close)
    return close;
}
/*
Check if the work is in the personal word
@Input : WordWithOffset ;{word:string,offset:int,oldword:string}
@Output: bool
 */
function isPersonalWord(wordWithOffset){

    if(nonEditableWord[wordWithOffset.word]!==undefined){
        console.log("Is personal word",wordWithOffset,nonEditableWord)
        return nonEditableWord[wordWithOffset.word]
    }
    return false
}
//https://en.m.wikipedia.org/wiki/Levenshtein_distance
function levenshteinDistance(a, b){
    if(a.length == 0) return b.length;
    if(b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
        for(j = 1; j <= a.length; j++){
            if(b.charAt(i-1) == a.charAt(j-1)){
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                    Math.min(matrix[i][j-1] + 1, // insertion
                        matrix[i-1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
};


