
var dataToSend = {"name":"test","isChecked":false};

var optionHide = true

console.log("Load popup js")
var lastResult = undefined

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

function printAll(){
    if(browser != undefined) {
        browser.storage.sync.get().then((result) => {
            console.log("print all", result);
        });
    }else{
        chrome.storage.sync.get(null, function(items) {
            var allKeys = Object.keys(items);
            console.log(allKeys);
        });
    }
}

function onLoad(){
    printAll()
    //Need to update this part to facortise
    if(browser != undefined) {
        browser.storage.sync.get().then((result) => {
            console.log("onload", result);
            lastResult = result
            //for each key in result, set the value of the corresponding input field
            for (var key in result) {
                console.log("key", key, "value", result[key]);
                console.log("key is correcot",(key==="corrector_tab"),(document.getElementById(key) !== null))
                if (document.getElementById(key) !== null) {
                    //if the ellment is a check box
                    console.log("toto",(document.getElementById(key).type === "checkbox"))
                    if (document.getElementById(key).type === "checkbox") {
                        document.getElementById(key).checked = result[key];
                    }
                    else {
                        document.getElementById(key).value = result[key];
                    }

                }else if(key==="corrector_tab"){
                    //If we are in the case of tab , we need to updte all the class for the tab

                    //for all the tab we hide them
                    console.log("ajout des classe pour ",result[key])
                    let alltab = document.getElementsByClassName("corrector_tab_pan")
                    for(let t of alltab){
                        t.classList.remove("show")
                        t.classList.remove("active")
                    }
                    //we remove the unline in bleu for the selected tab
                    alltab = document.getElementsByClassName("tab_name")
                    for(let t of alltab){
                        t.classList.remove("active")
                    }

                    //We set the active table visible
                    let el =  document.getElementById("tabs-"+result[key])
                    if(el !==undefined){
                        el.classList.add("show")
                        el.classList.add("active")
                    }
                    //We underline the curent tab
                    el =  document.getElementById("tabs-"+result[key]+"-tab")
                    if(el !==undefined){
                        el.classList.add("active")
                    }

                }

            }
            //for each key value pair in result, set the value of the corresponding input field


        });
    }else{
        chrome.storage.sync.get(null, function(result) {
            var allKeys = Object.keys(result);
            console.log(allKeys);


            for (var key in result) {
                console.log("key", key, "value", result[key]);
                if (document.getElementById(key) !== null) {
                    //if the ellment is a check box
                    if (document.getElementById(key).type === "checkbox") {
                        document.getElementById(key).checked = result[key];
                    } else {
                        document.getElementById(key).value = result[key];
                    }

                }else if(key==="corrector_tab"){
                    //If we are in the case of tab , we need to updte all the class for the tab

                    //for all the tab we hide them
                    console.log("ajout des classe pour ",result[key])
                    let alltab = document.getElementsByClassName("corrector_tab_pan")
                    for(let t of alltab){
                        t.classList.remove("show")
                        t.classList.remove("active")
                    }
                    //we remove the unline in bleu for the selected tab
                    alltab = document.getElementsByClassName("tab_name")
                    for(let t of alltab){
                        t.classList.remove("active")
                    }

                    //We set the active table visible
                    let el =  document.getElementById("tabs-"+result[key])
                    if(el !==undefined){
                        el.classList.add("show")
                        el.classList.add("active")
                    }
                    //We underline the curent tab
                    el =  document.getElementById("tabs-openai"+result[key]+"-tab")
                    if(el !==undefined){
                        el.classList.add("active")
                    }

                }

            }

        });
    }
    addWordToList();

}
onLoad();
function editLocalStorage(key,value){
    console.log("before edit",key,value);

    if(browser != undefined) {
        browser.storage.sync.get().then((result) => {
            lastResult = result
            result[key] = value;
            console.log("result", result)
            browser.storage.sync.set(result);
            printAll()
        });
    }else{

        chrome.storage.sync.get(null, function(result) {
            lastResult = result
            result[key] = value;
            console.log("result", result)
            chrome.storage.sync.set(result, function(){
                //  A data saved callback omg so fancy
            });
        });

    }
}

document.addEventListener("change", function(e) {
    console.log("change",e)
    //if the ellment is a input checkbox
    if (e.target.type === "checkbox") {
        console.log("checkbox changed", e.target.checked);
        // if checkbox is checked
        dataToSend.isChecked =  e.target.checked;
        //name is the id of the checkbox
        dataToSend.name = e.target.id;
        editLocalStorage(e.target.id,e.target.checked);
        printAll()
        if(browser != undefined) {
            browser.tabs.query({currentWindow: true}).then(sendMessageFirefox)
        }else {
            sendMessageChrome()
        }

    }else if(e.target.type=== "text"){
        console.log("text changed", e.type);

        dataToSend.name = e.target.id;
        dataToSend.value = e.target.value;
        if(e.target.id!=="addWord" || e.target.id=="openaikey"){
            editLocalStorage(dataToSend.name,dataToSend.value);
            if(browser != undefined){
                browser.tabs.query({ currentWindow: true}).then(sendMessageFirefox)
            }else{
                sendMessageChrome()
            }

        }
        printAll()
    }else{
        console.log("other changed", e.target.value);
    }


});

//get all button and add onclick event
var buttons = document.getElementsByTagName("button");
for(var i=0;i<buttons.length;i++){
    buttons[i].addEventListener("click",function(e){
        if(parentHaveId(e.target,"buttonAddWord")){
            addWord();
        }else if(parentHaveId(e.target,"dropdown")){
            displayOption()
        }
    },false);
}

let all_tab = document.getElementsByClassName("chose_completor")
for(let i =0;i<all_tab.length;i++){
    all_tab[i].addEventListener("click",function (e) {
        console.log("Click on ",e,e.target.id,JSON.stringify(e.target))
        if(e.target.id==="tabs-other-tab"){
            dataToSend.name = "corrector_tab"
            dataToSend.value = "other"
        }else if (e.target.id==="tabs-openai-tab"){
            dataToSend.name = "corrector_tab"
            dataToSend.value = "openai"
        }

        editLocalStorage(dataToSend.name,dataToSend.value);
        if(browser != undefined){
            browser.tabs.query({ currentWindow: true}).then(sendMessageFirefox)
        }else{
            sendMessageChrome()
        }
    })
}

//We get all the dom until we fin the ID , this is not optimal but is work
function parentHaveId(obj,id) {
    var o = obj;
    while(o!==null && o !== undefined) {
        if(o.id === id)
            return true
        o = o.parentNode;
    }
    return false


}
function displayOption(){
    optionHide = !optionHide ;

    var menu = document.getElementById("menu");

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
    } else {
        menu.classList.add('hidden');
    }

}

function addWord(){
    //Get the text from the input field ".addWord"
    var word = document.getElementById("addWord").value;
    //Clear the input field
    document.getElementById("addWord").value = "";
    //Add the word to the list of words
    if(browser!=undefined) {
        browser.storage.sync.get("wordList").then((result) => {
            console.log("result", result)
            if (result.wordList === undefined) {
                result.wordList = {};
            }
            //add to the dict
            result.wordList[word] = true;
            browser.storage.sync.set({"wordList": result.wordList});
            addWordToList();
        });
    }else{

        chrome.storage.sync.get("wordList", function(result) {
            if (result.wordList === undefined) {
                result.wordList = {};
            }
            //add to the dict
            result.wordList[word] = true;
            chrome.storage.sync.set({"wordList": result.wordList});
            addWordToList();
        })

    }
}

function addWordToList(){
    //clear all the child of ul with id="listWord"
    document.getElementById("listWord").innerHTML = "";
    if(browser!=undefined) {
        //get the list of words
        browser.storage.sync.get("wordList").then((result) => {
            console.log("result", result)
            if (result.wordList === undefined) {
                result.wordList = {};
            }
            updateWordList(result.wordList)

            dataToSend.name = "allWords";
            dataToSend.value = result.wordList;
            browser.tabs.query({currentWindow: true}).then(sendMessageFirefox)
        });
    }else{
        chrome.storage.sync.get("wordList", function(result) {
            let wordList = result.wordList
            if (wordList === undefined) {
                wordList = {};
            }
            updateWordList(wordList)
            dataToSend.name = "allWords";
            dataToSend.value = wordList;
            sendMessageChrome()
        });

    }

}

function updateWordList(wordlist){
    //for each word in the dict
    for(var word in wordlist){
        var li = document.createElement("li");
        li.className = "flex wordlist";
        var p = document.createElement("p");
        p.innerText = word;
        var button = document.createElement("button");
        button.innerText = "X";
        button.addEventListener("click",function(){
            //remove the word from the list
            delete lastResult.wordList[word];
            //remove the word from the list
            this.parentNode.remove();
            dataToSend.name = "allWords";
            dataToSend.value = result.wordList;
            if(browser!=undefined) {

                //save the new list
                browser.storage.sync.set({"wordList": lastResult.wordList});
                browser.tabs.query({ currentWindow: true}).then(sendMessageFirefox)
            }else{
                chrome.storage.sync.set({"wordList": result.wordList});
                sendMessageChrome()
            }
        });
        li.appendChild(p);
        li.appendChild(button);
        document.getElementById("listWord").appendChild(li);
    }
}

//Create fonction to only display words who match with addWord
function filterWord(){
    var word = document.getElementById("addWord").value;
    var listWord = document.getElementById("listWord");
    var li = listWord.getElementsByTagName("li");
    for(var i=0;i<li.length;i++){
        if(li[i].innerText.indexOf(word)===-1){
            li[i].style.display = "none";
        }else{
            li[i].style.display = "flex";
        }
    }
}

function eventSearchWord(e){
    //if the key pressed is enter
    if(e.keyCode===13){
        addWord();
    }else{
        filterWord();
    }

}

//add action to #addWord when we type
document.getElementById("addWord").addEventListener("keyup",eventSearchWord);

function sendMessageFirefox(tabs){
    console.log("send message ${tabs}",tabs,tabs[0],tabs[0].id);
    //find the first tab who the url is not undefined
    var tab = tabs.find(function(tab){
        return tab.url !== undefined;
    });
    console.log("tab",tab);
    browser.tabs.sendMessage(tab.id, {
        "data":dataToSend
    })

    var tabIds = tabs.filter(tab => tab.url !== undefined);
    console.log("tabIds",tabIds);

//for all tabIds
    tabIds.forEach(tabId => {
        console.log("tabId",tabId , tabId.url);
        browser.tabs.sendMessage(tabId.id, {
            "data":dataToSend
        })
    });

}

async function sendMessageChrome() {
    console.log("send message chrome", dataToSend)


    chrome.tabs.query({   currentWindow: true },function(tabs) {
        console.log("tab",tabs)

        tabs.forEach(tab=>{
            console.log(tab)
            try{
                chrome.tabs.sendMessage(tab.id, {"data":dataToSend}, function(response) {
                    console.log(response.farewell);
                })
            }catch (e){
                console.log(tab)
                console.log(e)
            }
        })





    });



// The body of this function will be executed as a content script inside the
// current page
    function sendData() {
        console.log("In send data")
        chrome.runtime.sendMessage({"data": dataToSend});
    }

}

function setLogo(){
    document.getElementById("logo").src =browser.runtime.getURL("icone/menir bleu.png");
    let logopath = browser.runtime.getURL("icone/menir bleu.png");
    console.log("logo path ",logopath)
}


function reportError(error) {
    console.error(`Beastify impossible : ${error}`);
}
setLogo()
console.log("in test click")
//print a debug message in firefox extension console
console.log("popup.js loaded");

