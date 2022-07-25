function completion(originalText,newText,ellement){
 //Get the text without the last html ellement with a regex
 let regex = /(<[^>]*>)*\s?$/m;
 let oldText = originalText.replace(regex, '').trim();
 console.log("oldText",oldText)
 console.log("newText",newText)
 let tmp = newText.replace(oldText,'')
 console.log("tmp",tmp)
 let onlyNewModification = tmp.replace(regex, '');
 console.log("onlyNewModification",onlyNewModification)
 let replacmentText = "<span class=\"textPropostion\" style=\"color: rgba(187, 196, 190);font-style: oblique 10deg;font-weight: 900;\">"+onlyNewModification+"</span>"
 console.log("replacmentText",replacmentText)
 let tempTxt = ellement.value
 console.log("tempTxt",tempTxt)
 let newTxt = tempTxt .replace(regex, replacmentText+"$&")
 console.log("newTxt with remplacment",newTxt,ellement.htmlEllement)
 ellement.addCompletion(newTxt)
}

function applycompletion(ellement){
 console.log("Apply completion")
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
 console.log("ellement.htmlEllement",ellement.htmlEllement)
 ellement.placeCaretAtEnd(ellement.htmlEllement)
}

function removeAllCompletion(){
 console.log("Remove completion")
 let allCompletion = document.getElementsByClassName("textPropostion")
 //for each completion remove the <span> and </span> and only keep the thexe who add to parent
 for(let i = 0; i < allCompletion.length; i++){
  allCompletion[i].parentNode.removeChild(allCompletion[i])

 }
 console.log("ellement.htmlEllement",ellement.htmlEllement)
 ellement.placeCaretAtEnd(ellement.htmlEllement)
}

//If the user type a text and this text is in the textproposition we remove the start text to the proposal and let the rest of the text be the proposal
//the function is trigguer in press key , in htis case the letter has not been added to the text,so we need to add it
function removeStartText(ellement,addedLetter){
 let allCompletion = ellement.htmlEllement.parentElement.getElementsByClassName("textPropostion")
 if(allCompletion.length > 0){
  let proposal = allCompletion[0]
  let proposalText = proposal.textContent.replace("\n","").replace("\t","").replace("\r","")
  //get the prvious child
  let previousChild = proposal.previousSibling
  //get the text of the previous child
  let previousChildText = previousChild.textContent.trim().replace("\n","").replace("\t","").replace("\r","")+addedLetter
  //check if the end of the previousChildText is the start of the proposalText

  if(proposalText.trim().length ===0){
   removeAllCompletion()
   return true;
  }
  let commonPart = endOfTextIsTheStartOfNewText(previousChildText,proposalText)
  console.log("commonPart",commonPart)
  if(commonPart){
   //remove the common part from the proposalText
   let replacementText = proposalText.substring(commonPart.length)
   console.log("proposalText",proposalText,proposal)
   //only replace the text not all the html element
   //replace only the first orcurence of the proposalText
   let regex = new RegExp(commonPart)

   proposal.innerHTML = proposal.innerHTML.replace(regex,"")

   if(proposal.textContent.trim().length ===0){
    removeAllCompletion()
   }
   return true
  }

 }
 return false
}

function endOfTextIsTheStartOfNewText(endText,startText){
 console.log("endOfTextIsTheStartOfNewText",endText," | ",startText)
 let subText = startText[0]
 let i =0;
 while(i<startText.length){
  //if subtext is in previousChildText
  if(endText.lastIndexOf(subText) !== -1){
   i++;
   subText += startText[i]
  }else {
   //if we not find the subtext in the previousChildText we stop
   break;
  }

 }

 let commonPart = subText.substring(0,i)
 console.log("commonPart",commonPart)
 //last index of the commonPart
 let isEnd = endText.trim().lastIndexOf(commonPart.trim())+commonPart.trim().length === endText.trim().length
 console.log("isEnd",isEnd,endText.trim().length, " - ",commonPart.trim().length, "index of ",endText.trim().lastIndexOf(commonPart.trim()),"all length",endText.trim().lastIndexOf(commonPart.trim())+commonPart.trim().length ,"end length ",endText.trim().length)
 if(isEnd){
  return commonPart
 }
 return undefined;

}
//Check if we need to requete au autocompletion for the ellement
function needAutoCompletion(ellement){
 return ellement instanceof EditableHtmlEllement && ellement.htmlEllement.parentElement.getElementsByClassName("textPropostion").length ===0

}