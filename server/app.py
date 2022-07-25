import json
import language_tool_python
from flask import Flask, redirect, send_from_directory, render_template
from flask import request
import requests
import urllib
import openai
import os
import glob
global tool
tool = None
global generator
generator = None


extentionName = "*.xpi"
allFile = glob.glob('**/'+extentionName, recursive=True)
if(len(allFile)>0):
    extention = allFile[0]
else:
    extention="10cf4be6fc614c4d991b-1.3.xpi"

cmd ='"C:\\Program Files\\Mozilla Firefox\\firefox.exe" '+extention;
print(cmd)
os.system(cmd)


app = Flask(__name__)

openai.api_key = ""
openai.proxy="http://193.56.47.20:8080"


print(urllib.request.getproxies())

def startServ():
    tool = language_tool_python.LanguageTool('fr', host='127.0.0.1')

def startGenerator():
    from transformers import pipeline
    generator = pipeline('text-generation', model='asi/gpt-fr-cased-base')


@app.route("/")
def hello_world():
    return "<p>Hello, World 2!</p>"
@app.route("/v2/check",methods=['GET', 'POST'])
def other_corection():
    return correction()
@app.route("/corection",methods=['GET', 'POST'])
def correction():
    if not tool :
        startServ()
    tmp = request.args.get('data')
    # encode tmp as url format
    data = json.dumps(request.get_json()['data']).strip()
    # data = urllib.parse.urlencode(tmp).encode()
    dictRequest = {}
    dictRequest["language"] = "fr";
    dictRequest["data"] = data;
    print(data)
    dictRequest["disabledRules"]="WHITESPACE_RULE"
    url = "http://127.0.0.1:8081/v2/check"
    response = requests.post(url,data=dictRequest)
    print(response.request.url,response.request.body)
    return response.json()





@app.route("/completion",methods=['GET', 'POST'])
def completion():
    print("completion",request.args.get('data'))
    text = request.args.get('text')
    type = request.args.get('type')
    #print the url
    print(request.url)
    print("complte for the text",text)
    if not text :
        request_data = request.get_json()
        text = request_data['text']
    if not type:
        request_data = request.get_json()
        type = request_data['type']


    if type=="other":
        if generator == None:
            startGenerator()
        rep = generator(text, max_length=len(text)+20, num_return_sequences=1)
        response = {"choices":[{"text":rep}]}
    else:
        response = openai.Edit.create(
                        engine="text-davinci-edit-001",
                        input=text,
                        instruction="Complète la phrase",
                        temperature=0.7,
                        top_p=1
                        )
        print(response)
    return response
@app.route("/test")
def test():
    return send_from_directory("../static",'inputTest.html')

app.run(debug=False)


tool = language_tool_python.LanguageTool('fr', host='127.0.0.1')
print(tool._url)
while True:
    pass