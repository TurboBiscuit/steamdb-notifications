const notifier = require('node-notifier');
const open = require("open")
const WebSocket = require("ws")
var ws = new WebSocket("wss://steamdb.info/api/realtime/", ["steam-pics"]);
var config = {
    appids: ["620"], //App Ids of apps you want to watch
    debug: false //Returns all changes for all apps if enabled
}
ws.on("open", function open() {
    console.log("open");
});
ws.on("close", function open() {
    console.log("closed");
});
ws.on("error", function incoming(data) {
    console.log(data);
});
ws.on("message", function incoming(data) {
    console.log(data)
    var json = JSON.parse(data)
    if (json.Users) return
    if (json.Apps) {
        if (config.appids.includes(Object.keys(json.Apps)[0]) || config.debug) {
            notifier.notify({
                title: 'Steam DB',
                message: 'New Change for ' + json.Apps[Object.keys(json.Apps)[0]] + '! \nChangeNumber: ' + json.ChangeNumber
            }, function (err, response) {
                if (err) return
                if (response == "activate") open("https://steamdb.info/app/" + Object.keys(json.Apps)[0] + "/history/?changeid=" + json.ChangeNumber)
            });
        }
    }
})