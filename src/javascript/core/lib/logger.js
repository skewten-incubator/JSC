"use strict";
/////////////////////////////////////////////
//logger.js
//Module for logging messages to the console.
var Logger = function(object){
	var self = this;
	self.name = String(object.prefix);
	self.prefix = "{"+self.name.darkpurple()+"} " || "{"+"UnknownPlugin".darkpurple()+"} ";
	self.logPrefix = (object.logPrefix)?"<"+String(object.logPrefix).green()+"> ":"";
	self.warnPrefix = object.warnPrefix || "[warn] ".yellow();
	self.errorPrefix = object.errorPrefix || "[error] ".red();
	self.debugPrefix = object.debugPrefix || "[debug] ".aqua();
	self.debugLevel = object.debugLevel || 0;
	self.sendRaw = function(message){
		server.getConsoleSender().sendMessage(message);
	};
	self.logRaw = function(message){
		self.sendRaw(self.prefix+self.logPrefix+message);
	}
	self.log = function(message){
		self.logRaw(message);
	};
	self.warn = function(message){
		self.logRaw(self.warnPrefix+message.yellow());
	};
	self.error = function(message){
		self.logRaw(self.errorPrefix+message.red());
	};
	self.getDebugLevel = function(){
		return self.debugLevel;
	};
	self.setDebugLevel = function(level){
		level = String(level);
		if (level/1 == level && level % 1 == 0){
			if (level >= 0){
				self.debugLevel = parseInt(level);
			}
			else{
				self.warn("Attempted to set its debugging level less than 0!");
			}
		}
		else{
			self.warn("Attempted to set its debugging level to a non-int!");
		}
	};
	self.debug = function(message, level){
		(!self.debugLevel || level >= self.debuggingLevel)&&self.logRaw(self.debugPrefix+message);
	};
	self.module = function(moduleName){
		return new Logger({
			prefix: self.name,
			logPrefix: moduleName,
			warnPrefix: self.warnPrefix,
			errorPrefix: self.errorPrefix,
			debugPrefix: self.debugPrefix,
			debugLevel: self.debugLevel
		});
	}
}
exports = Logger;