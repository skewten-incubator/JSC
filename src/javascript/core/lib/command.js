"use strict";
//////////////////////////////////////////
//command.js
//Module for managing registered commands.
var logger = __self.logger;
logger = logger.module("command");

var registeredCommands = {};

var executeCmd = function(args, player){
	if (args.length === 0){
		if (player){
			__self.announcer.tell("Usage: /jsp <command> [args]", player);	
		}
		else{
			throw new Error("Cannot execute the '/jsp' command without any arguments!");
		}
	}
	else{
		var name = args[0];
		var cmd = registeredCommands[name];
		if (!cmd){
			if (player){
				__self.announcer.tell("Unknown command.");	
			}
			else{
				throw new Error("Unknown command.");
			}
		}
		else{
			var result = null;
			try{
				cmd.callback(args.slice(1), player);
			}
			catch (e){
				if (player){
					__self.announcer.tell("An error occured while trying to run the command.".red(), player);	
				}
				logger.error("Error while trying to execute the command '"+name+"'.");
				logger.error("Arguments used: "+JSON.stringify(args));
				throw e;
			}
		}
	}
};

var registerCommand = function(name, func){
	if (registeredCommands[name]){
		logger.warn("The command "+name+" is being overwritten by another plugin.");
	}
	if (!func){
		throw new Error("Command function is undefined.");
	}
	if (typeof func != "function"){
		throw new Error("Command parameter 'function' is not a function.");
	}
	registeredCommands[name] = func;
	return func;
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
		registeredCommands[a[0]](a, sender);
		return true;
	}
	else{
		__self.announcer.tell("Unknown command.", sender);
		return true;
	}
}

registerCommand.prototype.exec = executeCmd;

exports.register = registerCommand;
exports.commands = registeredCommands;
exports.handleCommand = handleCommand;

/*
	Global commands.
	These take the actual command namespace, as in "/<command>", not "/jsp <command>"
*/

var gregisteredCommands = {};
var gexecuteCmd = function(args, player){
	var name = args[0];
	var cmd = gregisteredCommands[name];
	if (!cmd){
		if (player){
			__self.announcer.tell("Unknown command.");	
		}
		else{
			throw new Error("Unknown command.");
		}
	}
	else{
		var result = null;
		try{
			cmd.callback(args.slice(1), player);
		}
		catch (e){
			if (player){
				__self.announcer.tell("An error occured while trying to run the command.".red(), player);	
			}
			logger.error("Error while trying to execute the command '"+name+"'.");
			logger.error("Arguments used: "+JSON.stringify(args));
			throw e;
		}
	}
};

var gregisterCommand = function(name, func){
	var gregister = true;
	if (gregisteredCommands[name]){
		logger.warn("The global command "+name+" is being overwritten by another plugin.");
		gregister = false;
	}
	if (!func){
		throw new Error("Command function is undefined.");
	}
	if (typeof func != "function"){
		throw new Error("Command parameter 'function' is not a function.");
	}
	gregisteredCommands[name] = func;
	gregister && _plugin.registerGlobalCommand(name);
	return func;
};

function ghandleCommand(sender, cmd, label, args){
	var a = [];
	a.push(String(label));
	for (var i=0;i<args.length;i++){
		a.push(String(args[i]));
	}
	if (gregisteredCommands[label]){
		gregisteredCommands[label](a, sender);
		return true;
	}
	else{
		__self.announcer.tell("Unknown command.", sender);
		logger.error("An unknown globally registered command was called!");
		return true;
	}
}
gregisterCommand.prototype.exec = gexecuteCmd;

exports.gregister = gregisterCommand;
exports.gcommands = gregisteredCommands;
exports.ghandleCommand = ghandleCommand;