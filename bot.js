const Discord = require('discord.js')
const request = require('request');
const fs = require("fs");

const bot = new Discord.Client();

bot.on('message', (receivedMessage) => {
    if (receivedMessage.author == bot.user) { 
        return
    }
    
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
})

function boldify(contents) {
	return "**" + contents + "**"
}


function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1)
    let splitCommand = fullCommand.split(" ")
    let primaryCommand = splitCommand[0]
    let arguments = splitCommand.slice(1)

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments)

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "isitup") {
        isItUpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "pwned") {
        pwnedCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help [command]`")
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 1) {
        receivedMessage.channel.send("Please specify one single command. Try `!help [command]`")
    } else if (arguments.length == 1) {
	    if (arguments == "isitup") {
	    	receivedMessage.channel.send("_isitup_ - check if a site is up or down.\nExample: `!isitup redbrick.dcu.ie`")
	    } else if (arguments == "pwned") {
	    	receivedMessage.channel.send("_pwned_ - check if an email has been pwned .\nExample: `!pwned bertie@redbrick.dcu.ie`")
            }
    } else {
        receivedMessage.channel.send("Here is the list of brickbot commands:\n • isitup\n • pwned\n • help")
    }
}

function isItUpCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
	receivedMessage.channel.send("No URL supplied. Try `!isitup redbrick.dcu.ie`")
	return
    }
    else if (arguments.length > 0) {
        request.post({
            url:     'https://faas.jamesmcdermott.ie/function/isitup',
            body:    arguments
        }, function(error, response, body) {
            receivedMessage.channel.send(boldify(body))
        });
    }
}


function pwnedCommand(arguments, receivedMessage) {
    email = arguments
    if (arguments.length == 0) {
	receivedMessage.channel.send("No email supplied. Try `!pwned bertie@redbrick.dcu.ie`")
        return
    } else if (arguments.length > 0) {
        request.post({
            url:     'https://faas.jamesmcdermott.ie/function/haveibeenpwned',
            body:    arguments
        }, function(error, response, body) {
		n = JSON.parse(body).found
		if (n == 0) { 
                	receivedMessage.channel.send(boldify(email + " has not been pwned"))
            	} else {
                	receivedMessage.channel.send(boldify(email + " has been pwned"))
            	}
        });
    } 
}

bot_secret_token = fs.readFileSync("/tmp/brickbot.token", "utf-8").replace(/\n$/, '')
bot.login(bot_secret_token)
