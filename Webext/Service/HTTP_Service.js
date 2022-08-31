
var chomePostDataUsed = false

//This fonction make a http call to correct the text
function getCorectionHTTPRequest(element, text){
    //make a fetch request to the server , use Post metode
    //get the response

    try {

        text = text.replace(/\n/g, " ");
       
        let body = {
            language: "fr",
            text: text,
            disabledRules: "WHITESPACE_RULE,ESPACE_APRES_POINT"
        }
        ip = ip.trim();
        let dowArray = this.convertDOMtoJSON(text);
        var url = ip + "/v2/check?text=" + text + "&language=fr"

       
        if (dowArray !== undefined && dowArray.length > 0) {
            body = {
                language: "fr",
                data: {
                    annotation: dowArray
                }
            }
            let data = JSON.stringify(
                {annotation: dowArray}
            )
            //if the url length is sort we keep them in sortway
            if(data.length<10_000){
                url = ip + "/v2/check?data=" + encodeURI(data) + "&language=fr"
            }else{
                //In orther case is only on post data (can have some bug)
                url = ip + "/v2/check?language=fr"
            }

        }


       
        RequestIsEnd = false;
       
       
       
        if (chrome !== null && chrome !== undefined) {
            //the only way to make this http call is to use a bagound methode
            //source : https://stackoverflow.com/questions/53405535/how-to-enable-fetch-post-in-chrome-extension-contentscript
            chrome.runtime.sendMessage(
                {
                    contentScriptQuery: "postData"
                    , data: JSON.stringify(body)
                    , url: url
                }, function (response) {
                   
                    correctText(response, element)
                    if (needAutoCompletion(element) && prediction) {
                       
                        getCompletionHTTPRequest(element, element.value)
                    }else{
                       
                    }
                    RequestIsEnd = true;
                });
        }else {


            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'access-control-allow-origin': '*'
                },
                body: JSON.stringify(body) + ""
            })
                .then(response => response.json())
                .then(response => {
                   
                    correctText(response, element)
                    if (needAutoCompletion(element) && prediction) {
                       
                        getCompletionHTTPRequest(element, element.value)
                    }
                    RequestIsEnd = true;
                })
                .catch(error => {
                   
                   

                    RequestIsEnd = true;
                });
        }



    }catch (error) {
       
        RequestIsEnd = true;
    }

}

if (chrome !== null && chrome !== undefined && !chomePostDataUsed) {
    chomePostDataUsed = true;
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.contentScriptQuery == "getdata") {
            var url = request.url;
            fetch(url)
                .then(response => response.text())
                .then(response => sendResponse(response))
                .catch()
            return true;
        }
        if (request.contentScriptQuery == "postData") {
           
            fetch(request.url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'access-control-allow-origin': '*'
                },
                body: request.data
            })
                .then(response => response.json())
                .then(response => sendResponse(response))
                .catch(error => console.log(error))
            return true;
        }
    });
}

function getCompletionHTTPRequest(element, text){
   
    text = text.trim();
    let url = ip+"/completion?text="+encodeURI(text)
   
    let body  = {
        text: text,
        api_key : gpt_key,
        type:corrector
    }
    try {

        if (chrome !== null && chrome !== undefined) {
            //the only way to make this http call is to use a bagound methode
            //source : https://stackoverflow.com/questions/53405535/how-to-enable-fetch-post-in-chrome-extension-contentscript
            chrome.runtime.sendMessage(
                {
                    contentScriptQuery: "postData"
                    , data: JSON.stringify(body)
                    , url: url
                }, function (response) {
                   
                    completion(text, response.choices[0].text, element)
                    RequestIsEnd = true;
                });
        }else {

            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(response => {
                   
                    completion(text, response.choices[0].text, element)
                    RequestIsEnd = true;
                })
                .catch(error => {
                   
                    RequestIsEnd = true;
                });
        }
        /*


                var xhrCompletion = new XMLHttpRequest();
                xhrCompletion.open("GET", url, true);
                xhrCompletion.setRequestHeader('Content-Type', 'application/json');
                xhrCompletion.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhrCompletion.setRequestHeader('Access-Control-Allow-Headers', '*');
                xhrCompletion.setRequestHeader('Access-Control-Allow-Methods', '*');
                xhrCompletion.setRequestHeader('access-control-allow-origin', '*');
                xhrCompletion.onreadystatechange = function () {
                    if (xhrCompletion.readyState === 4) {
                        RequestIsEnd = true;
                        if (xhrCompletion.status === 200) {
                            let data = this.responseText;
                            let parseData = JSON.parse(data);
                           
                            completion(text,parseData.choices[0].text,element)


                        } else {
                           
                            RequestIsEnd = true;
                        }
                    }
                }
                xhrCompletion.send(JSON.stringify(body));

         */
    }catch (error) {
       
        RequestIsEnd = true;
    }


}