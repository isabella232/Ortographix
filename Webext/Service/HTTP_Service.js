

//This fonction make a http call to correct the text
function getCorectionHTTPRequest(element, text){
    //make a fetch request to the server , use Post metode
    //get the response

    try {

        text = text.replace(/\n/g, " ");
        console.log("Convert text to down",element)
        let body  = {
            language: "fr",
            text: text
        }
        ip=ip.trim();
        let dowArray = this.convertDOMtoJSON(text);
        var url = ip+"/v2/check?text="+text+"&language=fr"

        console.log("dowArray",dowArray);
        if(dowArray !==undefined&&dowArray.length>0){
            body = {
                language: "fr",
                data :{
                    annotation: dowArray
                }
            }
            let data =JSON.stringify(

                {annotation: dowArray}

            )
            url = ip+"/v2/check?data="+encodeURI(data)+"&language=fr"
        }


        console.log("body",body);
        RequestIsEnd = false;
        console.log("url",url);
        console.log("Before http",JSON.stringify(body))

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
            body: JSON.stringify(body)+""
        })
            .then(response => response.json())
            .then(response => {
                console.log("--Reponse : ",response)
                correctText(response,element)
                if(needAutoCompletion(element) && prediction){
                    console.log("we run the auto completion",prediction)
                    getCompletionHTTPRequest(element,element.value)
                }
                RequestIsEnd = true;
            } )
            .catch(error => {console.log('Error:', error)
                console.log(error)});

        /*

                var xhr = new XMLHttpRequest();
                xhr.open("POST", url , true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                //xhr.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

                console.log("Boswer = ",browser)
                if(browser!==undefined){
                    xhr.setRequestHeader('Access-Control-Allow-Methods', '*');
                    xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
                    xhr.setRequestHeader('access-control-allow-origin', '*');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                }


                xhr.onload = function (data) {
                    console.log("data satus" ,data)
                    if (xhr.readyState === 4) {
                        RequestIsEnd = true;
                        if(xhr.status === 200) {
                            let data = this.responseText;
                            console.log("data", JSON.parse(data),element)
                            correctText(JSON.parse(data),element)

                        }else {
                            console.log("error", xhr.status,xhr)
                            RequestIsEnd = true;
                        }
                    }
                }
                xhr.send(JSON.stringify(body));

                xhr.onloadend = function () {
                    console.log("end")
                    if(needAutoCompletion(element) && prediction){
                        console.log("we run the auto completion",prediction)
                        getCompletionHTTPRequest(element,element.value)
                    }
                }
        */


    }catch (error) {
        console.log("error",error)
        RequestIsEnd = true;
    }

}



function getCompletionHTTPRequest(element, text){
    console.log("Get the completion for ",text)
    text = text.trim();
    let url = ip+"/completion?text="+encodeURI(text)
    console.log("url",url)
    let body  = {
        text: text,
        api_key : gpt_key,
        type:corrector
    }
    try {



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
                console.log("Reponse : ",response)
                completion(text,response.choices[0].text,element)
                RequestIsEnd = true;
            } )
            .catch(error => console.log('Error:', error,error.body,error.stack));

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
                            console.log("Completion ", parseData, element)
                            completion(text,parseData.choices[0].text,element)


                        } else {
                            console.log("error in completion", xhrCompletion.status, xhrCompletion)
                            RequestIsEnd = true;
                        }
                    }
                }
                xhrCompletion.send(JSON.stringify(body));

         */
    }catch (error) {
        console.log("error",error)
        RequestIsEnd = true;
    }


}