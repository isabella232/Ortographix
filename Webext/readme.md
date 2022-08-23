# Ortographix
An automatize web extension corrector

---

## Goal of the project

The purpose of this project is to create an automated spell checker for web browsers.

The principle is the following: when the user writes his text on the web it is automatically corrected without
the need for the user to choose the selection. Moreover, the application also offers automatic text completion.

## Usage

You can download the source and build the web extension (see details in the Webextention/readme)
or download the last version of the extension .

The server is also available in EXE , you can build the server with pyinstaller or download in the realise


### Installation
- Firefox : Download the xpi and import in Firefox (https://wiki.mozilla.org/Installing_Extensions)
- Chrome : Download the source and install manually , a package will be set in the future (https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/) .
- Server : Download the python script , install the decency with pip (see in the requirement.txt)

###Correction

After the installation you can write on the internet and the text will automatics be corrected and replace

If you need to ignore a word for the correction , Click and the app icon and add the word in the "Ignored word list"

### Text completion

With this service, you can complete the text with a suggestion .
The solution will appear in gray if you press tab it will be automatically inserted.
If it does not suit you to write, the solution is deleted if it does not suit.

**If you enable this option you need to provide a server and for the Open AI you need a key to aces at the IA .**


###Option and settings

#### Settings
- Activate / deactivate the automatics correction
- Activate / deactivate the automatics completion

#### Option
- Server address : if you run on your local server you can set this address
- Completion services : You can choose by using GPT-3 open ai to complete the text or a custom version in the sever .
  For both of them you need to run a external server (the langetool api not provide completion) .


- - -

## Technical composition of the project

This project is composed of 2 parts :
- A web extension for Firefox and chromium (Google chrome , chromium , edge)
- A web server for a local use developed in python

- - -

## Support

If you find a bug or have a suggestion , please open a issue . The support of this application is made by the community Atos have no obligation to correct or adpte the software.
This is a open source software if you can contribute to make it better ;)

## Contribute

You can contribute to this project by making a pull request
