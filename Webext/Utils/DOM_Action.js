
function convertDOMtoJSON(text) {
    let annotations = [];
//Parse the text
    let parser = new DOMParser();
    let fakeText = "<div>"+text+"</div>";
    let doc = parser.parseFromString(text, "text/html");
    console.log("doc",doc)
    this.convertDOMtoJSONWorker(doc.body, annotations);
    console.log("annotations",annotations)
    return annotations;
}
function convertDOMtoJSONWorker(htmlEllement,annotations){
    console.log("children",htmlEllement.childNodes)
    let allElements = htmlEllement.childNodes;
    let i = 0;
    while(i<allElements.length){
        let ellement = allElements[i];
        if(ellement.nodeName !== "#text"){
            let text = ellement.innerText;
            let markup = ellement.tagName;
            console.log("ellement",ellement)
            //convert ellement to get the balise in string
            let markupString = "<"+ellement.tagName.toLowerCase();
            //map all the attributes with space between them
            let attributes = Array.from(ellement.attributes).map(function(attr){
                    if(attr.value!==undefined){
                        return attr.name+"=\""+attr.value+"\"";
                    }else {
                        return attr.name;
                    }

                }
            ).join(" ");
            //add the attributes to the markup string
            if(attributes.length>0){
                markupString+= " "+attributes;
            }
            markupString+=">";

            annotations.push({
                "markup":markupString,
                "interpretAs":" "
            });
            /*
            annotations.push({
                    "text":text,
                }
            );

             */
            this.convertDOMtoJSONWorker(ellement, annotations);
            //push the closing balise
            if(ellement.tagName!=="BR") {
                annotations.push({
                    "markup": "</" + ellement.tagName.toLowerCase() + ">",
                });
            }
            console.log("end",markup.toLowerCase())
        }else {
            annotations.push({
                "text":ellement.data,
            });
        }

        i++;
    }
}


function splitText(text){
    let annotations = [];
    let textArray = []
    annotations = convertDOMtoJSON(text);
    if(annotations.length>0){
//for all anotation in annotations if he have a fild text add text if he have a fild body add body
        annotations.forEach(function(annotation){
            if(annotation.text!==undefined){
                //split the text and add all subpar in the array
                annotation.text.split(/(\s|'|’)/g).forEach(function(subText){
                    textArray.push(subText);
                });
            }else if(annotation.markup!==undefined){
                textArray.push(annotation.markup);
            }else{
                console.log("error")
            }
        });
        console.log("textArray",textArray)
        return textArray;
    }else {
        console.log("no annotations",text.split(" "))
        return text.split(" ");
    }

    /*
    let textArray2 = [];
    let i = 0;
    while(i<textArray.length){
        let element = textArray[i];
        if(element.includes(">")){
            let element2 = element.split(">");
            if(element2[0].includes("<")){
                let element3 = element2[0].split("<");
                textArray2.push(element3[0]);
                textArray2.push("<"+element3[1]);
            }
            textArray2.push(element2[0]+">");
            textArray2.push(element2[1]);
        }else if(element.includes("<")){
            //if start by <
            if(element.charAt(0)==="<"){
                textArray2.push(element);
            }else{
                let element2 = element.split("<");
                textArray2.push(element2[0]);
                textArray2.push("<"+element2[1]);
            }

        }
        else {
            textArray2.push(element);
        }
        i++;
    }
    return textArray2;

     */

}

/*
@Input : elementHTML : the element we want to get the css path
@Output : cssPath : the css path of the element (including the iframe)
 */
var cssPath = function(el,secure=true) {
    if (el instanceof GeneriqueHTMLEllement){
        el = el.htmlEllement;
    }
    let original = el;
    if (!(el instanceof Element)&&secure) return;
    var path = [];
    if(el.nodeType===3){
        el = el.parentElement;
    }
    while (el.nodeType === Node.ELEMENT_NODE) {
        var selector = el.nodeName.toLowerCase();
        if (el.id) {
            selector += '#' + el.id;
        } else {
            var sib = el, nth = 1;
            while (sib.nodeType === Node.ELEMENT_NODE && (sib = sib.previousSibling) && nth++);
            selector += ":nth-child("+nth+")";
        }
        path.unshift(selector);
        el = el.parentNode;
    }
    el = original
    //if we are in iframe

    if(el.ownerDocument !== document){
        try{
            selector = cssPath(el.ownerDocument.defaultView.frameElement)
            path.unshift(selector)
        }catch (e){

        }
    }

    return path.join(" > ");
}