"use strict";
//////////////////////////////////////////
//command.js
//Module for managing registered commands.
var logger = __self.logger.module("command");

/*
    Local commands.
    These go under the /jsp namespace, e.g. '/jsp butts'
*/
var registeredCommands = {};
function registerCommand(name, handler, tabHandler){
    if (registeredCommands[name]){
        logger.warn("The command "+name+" is being overwritten by another plugin.");
    }
    if (!handler){
        throw new Error("Command function is undefined.");
    }
    if (typeof handler != "function"){
        throw new Error("Command parameter 'handler' is not a function.");
    }
    registeredCommands[name] = {
        handler: handler,
        tabHandler: tabHandler
    };
    return registeredCommands[name];
};

function handleCommand(sender, cmd, label, args){
    var a = [];
    for (var i=0;i<args.length;i++){
        a.push(String(args[i]));
    }
    if (a.length == 0){
        return false;
    }
    if (registeredCommands[a[0]]){
        var returnVal = registeredCommands[a[0]].handler(a, sender);
        if (returnVal === false){
            return false;
        }
        //Assume null and any non-false value success.
        else{
            return true;
        }
    }
    else{
        __self.announcer.tell("Unknown command.", sender);
        return true;
    }
}

exports.register        = registerCommand;
exports.commands        = registeredCommands;
exports.handleCommand   = handleCommand;

/*
    Global commands.
    These take the actual command namespace, as in "/<command>", not "/jsp <command>"
*/

var gregisteredCommands = {};
var gregisterCommand = function(name, handler, tabHandler){
    var gregister = true;
    if (gregisteredCommands[name]){
        logger.warn("The global command "+name+" is being overwritten by another plugin.");
        gregister = false;
    }
    if (!handler){
        throw new Error("Command function is undefined.");
    }
    if (typeof handler != "function"){
        throw new Error("Command parameter 'handler' is not a function.");
    }
    gregisteredCommands[name] = {
        handler: handler,
        tabHandler: tabHandler
    };
    gregister && _plugin.registerGlobalCommand(name, "/"+name+" args", "JSC global command.");
    return gregisteredCommands[name];
};

function ghandleCommand(sender, cmd, label, args){
    var a       = [],
        command = cmd.getName();
    a.push(command);
    for (var i=0;i<args.length;i++){
        a.push(String(args[i]));
    }
    if (gregisteredCommands[command]){
        var returnVal = gregisteredCommands[command].handler(a, sender);
        if (returnVal === false){
            return false;
        }
        //Assume null and any non-false value success.
        else{
            return true;
        }
    }
    else{
        __self.announcer.tell("Unknown command.", sender);
        logger.error("An unknown globally registered command was called!");
        return true;
    }
}

exports.gregister = gregisterCommand;
exports.gcommands = gregisteredCommands;
exports.ghandleCommand = ghandleCommand;