function completion(originalText,newText,ellement){
 //Get the text without the last html ellement with a regex
 let regex = /(<[^>]*>)*\s?$/m;


 let oldText = originalText.replace(regex, '').replace("<br>").replace("&nbsp;",'').trim();

 let tmp = newText.replace(oldText,'')

 let onlyNewModification = tmp.replace(regex, '');

 let replacmentText = "<span class=\"textPropostion\" style=\"color: rgba(187, 196, 190);font-style: oblique 10deg;font-weight: 900;\">"+onlyNewModification+"</span>"

 let tempTxt = ellement.value

 let newTxt = tempTxt .replace(regex, replacmentText+"$&")

 ellement.addCompletion(newTxt)
}

function applycompletion(ellement){

 if(ellement===undefined || ellement ===null){
  return;
 }
 let regex = /(<[^>]*>)*\s?$/m;
 let allCompletion = ellement.htmlEllement.getElementsByClassName("textPropostion")
 //for each completion remove the <span> and </span> and only keep the thexe who add to parent
 for(let i = 0; i < allCompletion.length; i++){
  let allChild = allCompletion[i].childNodes
  //replace the ellement by all this child
  for(let j = 0; j < allChild.length; j++){
   allCompletion[i].parentNode.insertBefore(allChild[j],allCompletion[i])
  }
  allCompletion[i].parentNode.removeChild(allCompletion[i])

 }

 ellement.placeCaretAtEnd(ellement.htmlEllement)
}

function removeAllCompletion(ellement){

 let allCompletion = document.getElementsByClassName("textPropostion")
 //for each completion remove the <span> and </span> and only keep the thexe who add to parent
 for(let i = 0; i < allCompletion.length; i++){
  allCompletion[i].parentNode.removeChild(allCompletion[i])

 }
//
 if(ellement.placeCaretAtEnd!==undefined){
  ellement.placeCaretAtEnd(ellement.htmlEllement)
 }

}

//If the user type a text and this text is in the textproposition we remove the start text to the proposal and let the rest of the text be the proposal
//the function is trigguer in press key , in htis case the letter has not been added to the text,so we need to add it
function removeStartText(ellement,addedLetter){
 let allCompletion = ellement.htmlEllement.parentElement.getElementsByClassName("textPropostion")
 if(allCompletion.length > 0){
  let proposal = allCompletion[0]
  let proposalText = proposal.textContent.replace("\n","").replace("\t","").replace("\r","").trim()
  //get the prvious child
  let previousChild = proposal.previousSibling
  //get the text of the previous child
  let previousChildText = previousChild.textContent.trim().replace("\n","").replace("\t","").replace("\r","")+addedLetter
  //check if the end of the previousChildText is the start of the proposalText

  if(proposalText.trim().length ===0){
   removeAllCompletion(ellement)
   return true;
  }
  let commonPart = endOfTextIsTheStartOfNewText(previousChildText,proposalText)
 
  if(commonPart){
   //remove the common part from the proposalText
   let replacementText = proposalText.substring(commonPart.length)
  
   //only replace the text not all the html element
   //replace only the first orcurence of the proposalText
   let regex = new RegExp(commonPart)

   proposal.innerHTML = proposal.innerHTML.replace(regex,"")

   if((proposal.textContent.trim().length ===0 || commonPart.trim().length===0)&&addedLetter!==" "){
    removeAllCompletion(ellement)
   }
   return true
  }else if(addedLetter!==" "){
  
   removeAllCompletion(ellement)
  }

 }
 return false
}

/*
If the end of the fist text is the start of the second text send the common part
In other case send undefined
 */
function endOfTextIsTheStartOfNewText(endText,startText){
 endText = endText.trim()
 startText = startText.trim()
 let i =0;
 let size = endText.length
 let find = false
 //while we have not found the end of the text
 while(i<endText.length&&i<startText.length){
  //we get the end of the text and check is is the start of the 2nd
  let subText = endText.substring(size-i-1,size)
  let isEnd = startText.startsWith(subText)
  //if we found is the case
  if(isEnd){
   find = true
  }
  //if prevoulis we have found the a end of texe who match par and not is not match => we have found the common part only
  if(!isEnd && find){
   break
  }
  i++
 }

 if(find){
   return endText.substring(size-i,size)
 }
 return undefined

}

//Check if we need to requete au autocompletion for the ellement
function needAutoCompletion(ellement){
 return ellement instanceof EditableHtmlEllement && ellement.htmlEllement.parentElement.getElementsByClassName("textPropostion").length ===0

}