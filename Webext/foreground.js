


/*
@TODO:
Revoir pour l'edit le cas ou il y a des espace suprimer , fair en sorte de choisire le mot d'apres si cela est le cas
Optimier en veirifant que si il depasse 10 fois le delta cest quil y a un pbr
Desactive pour les champ password et possiblment les login ou info perssonelle
Optimise pour les text de longusre superie a 1024
 */


if(document){
    document.body.style.border = "5px solid red";
}
//If we not set with this way the browserd send a exeption
try{
    if(browser==undefined){
        browser = undefined
    }
}catch (e){
    browser = undefined
}

try {
    if(chrome==undefined){
        chrome = undefined
    }
}catch (e){
    chrome = undefined
}


var ellementDict  ={};
var wordStarSift =[]; // contain the word who need to be sift type {start :int,shif:int}

var areas = document.querySelectorAll('*');

console.log("areas",areas)
var RequestIsEnd = true;
const duration = 2000;
const minDelayInSeconds = 2;
var lastUpdate = Date.now();
var previousUpdate = Date.now();
var activate = true;
var prediction = false;
var ip = "https://api.languagetoolplus.com"
var nonEditableWord ={} //Al the word who the user say he not need to be correct
var corrector="other"
var gpt_key =""


const observer = new MutationObserver(function(mutations_list) {
    mutations_list.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(added_node) {
            //console.log('#child has been added',mutations_list," addeed nonde ",added_node);
            if(added_node.children !== undefined){
                for(let i = 0; i<added_node.children.length;i++){
                    recuriveAddEventToChildren(added_node.children[i]);
                }
            }

            //If added Node is a iframe
            if(added_node.tagName!==undefined&&added_node.tagName.toLowerCase()==="IFRAME".toLowerCase()){
                console.log("iframe added we add event",added_node)
                addEventToAllNode(added_node.contentWindow.document.body.getElementsByTagName("*"))
                recuriveAddEventToChildren(added_node.contentWindow.document.body);
                added_node.addEventListener('load', function (e) {
                    let target = e.target
                    if(chrome!=null) {
                        //We use a sleep function to be sure that all ellement in the function is build , this is not the best bet its work
                        setTimeout(function () {
                            console.log("after sleep ",e)
                            target .contentWindow.addEventListener('keydown', atInput, false);
                            addEventToAllNode(target .contentWindow.document.body.getElementsByTagName("*"))
                        }, 100);
                    }else {
                        console.log("iframe loaded in mutation observer", e.target, e.target.contentWindow.document.body, e.target.contentWindow.document.body.getElementsByTagName("*"))
                        e.target.contentWindow.addEventListener('keydown', atInput, false);
                        addEventToAllNode(e.target.contentWindow.document.body.getElementsByTagName("*"))
                    }
                });
            }

        });
    });
});



addEventToAllNode(areas);

var t=setInterval(checkIfWeRunTextCorrection,duration);


////////////////////////////////////////////////////////////////////////////////
//  Message recive for the communication betwwent the modal and the forground //
////////////////////////////////////////////////////////////////////////////////
if(browser !== undefined) {
    console.log("browser",browser)
    browser.runtime.onMessage.addListener((message) => {
        processeceMessage(message)
    });
}else{
    // background.js
    chrome.runtime.onMessage.addListener(
        function(message, sender, sendResponse) {
            console.log("message in chrome",message)
            processeceMessage(message)
        }
    );
}
console.log("lest go 2")
function processeceMessage(message){
    //get curent url of the page
    console.log("message in " + window.location.href, message)
    if (message.data.name === "corrector") {
        activate = message.data.isChecked
    }
    if (message.data.name === "prediction") {
        prediction = message.data.isChecked
    }
    if (message.data.name === "serverip") {
        ip = message.data.value
    }
    if (message.data.name === "allWords") {
        nonEditableWord = message.data.value
        console.log("nonEditableWord", nonEditableWord)
    }
    if(message.data.name==="openaikey"){
        gpt_key =message.data.value
    }
    if(message.data.name==="corrector_tab"){
        corrector = message.data.value
        console.log("Corrector",message.data.value)
    }
}
/*
This metode is use when a event is send by the modal to the background
 */
if(browser !== undefined) {
    browser.storage.sync.get().then((result) => {
        forLoad(result)
    });
}else{
    chrome.storage.sync.get(null, function(result) {
        forLoad(result)
    })
}

//action use on load , the main idea is to set the default value for the key
function forLoad(result){
    console.log("onload", result);
    result["corrector"] !== undefined ? activate = result["corrector"] : activate = activate;
    result["prediction"] !== undefined ? prediction = result["prediction"] : prediction = prediction;
    result["serverip"] !== undefined ? ip = result["serverip"] : ip = "https://api.languagetoolplus.com";
    result["wordList"] !== undefined ? nonEditableWord = result["wordList"] : nonEditableWord = {};
    result["openaikey"] !== undefined ? gpt_key = result["openaikey"] : gpt_key= "";
    result["corrector_tab"] !== undefined ?  corrector = result["corrector_tab"] :  corrector = "other";
    console.log("prediction", prediction, result["prediction"])
    console.log("result", result)
}

//replace the text for I18N
function replaceTextI18N(){
 let text = {
     "title":"title"
 }
}

/////////////////TEST////////////////////////////////////////////////////////////
console.log("==== TEST ====")
let startTest ="j'ai manger des pommes  etd"
let endTest ="des poires"
let resss =endOfTextIsTheStartOfNewText(startTest,endTest)
console.log("resss",resss)

startTest ="aaaab"
endTest ="aab"
resss =endOfTextIsTheStartOfNewText(startTest,endTest)
console.log("resss",resss)

startTest ="1234"
endTest =" 234"
resss =endOfTextIsTheStartOfNewText(startTest,endTest)
console.log("resss",resss)

startTest ="1234"
endTest ="1234"
resss =endOfTextIsTheStartOfNewText(startTest,endTest)
console.log("resss",resss)

startTest ="12345"
endTest ="1234"
resss =endOfTextIsTheStartOfNewText(startTest,endTest)
console.log("resss",resss)


