"use strict";
/*THIS FILE IS EXECUTED BEFORE ANY OTHER FILE !*/

//////////////////////////////////
//jsc.js
//Main file for the JSC plugin.

var global = this;
var __self = {};
var __onEnable = function(evaluator, plugin, root){
	var build = 11;
	
	if (global.__pluginEnabled){
		logger.error("Something tried to enable already-enabled JSC!");
		return null;
	}
	
	/////////////////////////////////////////////////////////////////////
	//json2
	//Provides the JSON object for parsing and stringifying JSON objects.
	global.JSON = {};
	(function(){
		if(typeof JSON!=="object"){JSON={}}(function(){"use strict";function f(e){return e<10?"0"+e:e}function quote(e){escapable.lastIndex=0;return escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t==="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];if(a&&typeof a==="object"&&typeof a.toJSON==="function"){a=a.toJSON(e)}if(typeof rep==="function"){a=rep.call(t,e,a)}switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a){return"null"}gap+=indent;u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1){u[n]=str(n,a)||"null"}i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]";gap=o;return i}if(rep&&typeof rep==="object"){s=rep.length;for(n=0;n<s;n+=1){if(typeof rep[n]==="string"){r=rep[n];i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}else{for(r in a){if(Object.prototype.hasOwnProperty.call(a,r)){i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}";gap=o;return i}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b"," ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;if(typeof JSON.stringify!=="function"){JSON.stringify=function(e,t,n){var r;gap="";indent="";if(typeof n==="number"){for(r=0;r<n;r+=1){indent+=" "}}else if(typeof n==="string"){indent=n}rep=t;if(t&&typeof t!=="function"&&(typeof t!=="object"||typeof t.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":e})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i==="object"){for(n in i){if(Object.prototype.hasOwnProperty.call(i,n)){r=walk(i,n);if(r!==undefined){i[n]=r}else{delete i[n]}}}}return reviver.call(e,t,i)}var j;text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})()
	})();
	
	///////////////////////////////////////////////////
	//stringcolor
	//Adds String prototypes that set a string's color.
	(function(){
		var c = org.bukkit.ChatColor;
		var formattingCodes = {
			aqua: c.AQUA,
			gold: c.GOLD,
			lightpurple: c.LIGHT_PURPLE,
			//////////////////////////
			green: c.GREEN,
			red: c.RED,
			yellow: c.YELLOW,
			blue: c.BLUE,
			//////////////////////////
			darkaqua: c.DARK_AQUA,
			darkblue: c.DARK_BLUE,
			darkgray: c.DARK_GRAY,
			darkgreen: c.DARK_GREEN,
			darkpurple: c.DARK_PURPLE,
			darkred: c.DARK_RED,
			//////////////////////////
			gray: c.GRAY,
			black: c.BLACK,
			white: c.WHITE,
			//////////////////////////
			bold: c.BOLD,
			italic: c.ITALIC,
			strike: c.STRIKETHROUGH,
			magic: c.MAGIC,
			underline: c.UNDERLINE,
			//////////////////////////
			reset: c.RESET
		};
		for (var method in formattingCodes){
			String.prototype[method] = function(color){
				return function(){return color+this+c.RESET;};
			}(formattingCodes[method]);
		}
	})();
	///////////////////////////////////////////////////
	//stringtrim
	//Adds the String.trim() prototype.
	if (!String.prototype.trim) {
		String.prototype.trim = function(){
			return this.replace(/^\s+|\s+$/gm, '');
		};
	}
	//////////////////////////////////////////////////////////////////////////////
	//require_tiny
	//A minimized form of require.js, used for quick module loading for jsc.js
	function require_tiny(module){
		var obj = new java.io.File(root+"/lib/"+module+".js");
		var reader = new java.io.BufferedReader(new java.io.FileReader(obj));
		var code = "";
		var line;
		while ((line = reader.readLine()) !== null){
			code += line+"\n";
		}
		var head = "(function(exports, _filename, _dirname){";
		var tail = ";return exports;})";
		code = head+code+tail;
		try{
			var compiled = evaluator.eval(code);
		}
		catch(e){
			logger && logger.error("Could not compile the "+obj.getName()+" module!");
			logger.debug(e.stack);
		}
		try{
			var exports = compiled.call(
				compiled,
				{},
				obj.getName(),
				obj.getParentFile().getCanonicalPath()
			);
		}
		catch(e){
			logger && logger.error("Could not execute the "+obj.getName()+" module!");
			logger.debug(e.stack);
		}
		return exports;
	}

	//Set up global environment
	global._root = root.getParentFile().getCanonicalPath();
	global._plugin = plugin;
	global._evaluator = evaluator;
	global._server = plugin.getServer();
	global.__pluginEnabled = true;
	root = root.getParentFile().getCanonicalPath();
	__self.playerVariables = {};

	__self.logger = new require_tiny("logger")({
		prefix: "JSC"
	}).module("main");
	var logger = __self.logger;
	logger.log("Loading plugin.");

	global.require = new require_tiny("require")(
		evaluator,
		root,
		[
			root+"/lib/",
			root+"/modules/"	
		]
	);

	__self.announcer = new require("announcer")({
		tell_prefix: "JSC> ".gray(),
		broadcast_prefix: "["+"JSC".gold()+"]> "
	});
	var announcer = __self.announer;

	global._command = require("command");
	global.command = _command.register;
	global.events = require("events");
	global.plugin = require("plugin");
	global.setTimeout = function(callback, delay){
		//Bukkit uses ticks.
		//1 tick = 50ms
		return _server.getScheduler().runTaskLater(_plugin, callback, delay/50);
	};
	global.clearTimeout = function(task){
		task.cancel();
	};
	global.setInterval = function(callback, delay){
		var interval = delay/50;
		return _server.getScheduler().runTaskTimer(__plugin, callback, interval, interval);
	};
	global.clearInterval = function(task){
		task.cancel();
	};
	
	//Run all global modules' pluginEnable handlers
	global.plugin._load();

	//Register plugin commands and events
	if (!global.plugin.exists("JSC")){
		logger.warn("Plugin JSC doesn't exist, making plugin.");
		var savedata = global.plugin.add("JSC");
		updateInfo(savedata);
	}
	else{
		var savedata = global.plugin.get("JSC");
		if (!savedata.build || savedata.build < build){
			logger.log("Updating plugin's savedata.");
			updateInfo(savedata);
		}
	}

	function updateInfo(s){
		s.build = build;
	}

	command("update", function(a,p){
		if (!p.isOp()){
			__self.announcer.tell("You're not allowed to run the update command.", p);
			return false;
		}
		if (a.length < 2){
			__self.announcer.tell("Usage: /jsp update core", p);
		}
		else{
			if (global.__confirmUpdate){
				if (a[1] == "core"){
					plugin.checkFiles(true);
				}
				global.__confirmUpdate = false;
				__self.announcer.tell("Done. To load the new files, run the 'reload' command.".green(), p);
			}
			else{
				__self.announcer.tell("WARNING: THIS WILL OVERWRITE ALL CUSTOM CORE MODULES.".red(), p);
				__self.announcer.tell("TO CONTINUE, RUN THE COMMAND AGAIN.".red(), p);
				global.__confirmUpdate = true;
			}
		}
	});
	command("jsc", function(a,p){
		__self.announcer.tell("This is a reserved command.", p);
	});
	events.on("server.PluginDisableEvent", function(l,e){
		if (e.getPlugin() == _plugin){
			logger.log("Unloading plugin.");
			global.plugin._unload();
		}
	}, "LOWEST");
	
	//Load the command map so we can register global commands.
	_plugin.loadCommandMap(_server["class"].getDeclaredField("commandMap"));
	//Register global command JSC as a test.
	_plugin.registerGlobalCommand("jsc");
	
	//Load all the plugins.
	(function(){
		var File = java.io.File;
		var f = new File(global._root+"/plugins/");
		function lp(obj){
			var reader = new java.io.BufferedReader(new java.io.FileReader(obj));
			var code = "";
			var line;
			while ((line = reader.readLine()) !== null){
				code += line+"\n";
			}
			var head = "(function(require, _filename, _dirname){";
			var tail = "})";
			code = head+code+tail;
			try{
				var compiled = evaluator.eval(code);
			}
			catch(e){
				logger.error("Could not compile the "+obj.getName()+" module!");
				logger.debug(e.stack);
			}
			try{
				var exports = compiled.call(
					compiled,
					global.require,
					obj.getName(),
					obj.getParentFile().getCanonicalPath()
				);
			}
			catch(e){
				logger.error("Could not execute the "+obj.getName()+" module!");
				logger.debug(e.stack);
			}
		}
		function l(f){
			var list = f.list();
			if (!list){
				return false;
			}
			for (var i=0;i<list.length;i++){
				var nf = new File(f, list[i]);
				var nfn = String(nf.getName());
				if (nf.isFile() && nfn.substr(nfn.length-3) == ".js"){
					lp(nf);
				}
				else if (nf.isDirectory()){
					l(nf);
				}
				else{
					continue;
				}
			}
		}
		l(f);
	})();
};

global.__onCommand = function(sender,cmd,label,args){
	if (label == "jsp"){
		return _command.handleCommand(sender, cmd, label, args);	
	}
	else if (label == "js"){
		if (!__self.playerVariables[sender.getName()]){
			__self.playerVariables[sender.getName()] = {};
		}
		var code = args.join(" ");
		(function(){
			//Add a return statement.
			var splitcode = code.split(";");
			if (splitcode[splitcode.length-1].trim() == ""){
				splitcode.pop();
			}
			var lastSnippet = splitcode[splitcode.length-1].trim();
			if (lastSnippet.indexOf("return ") != 0){
				lastSnippet = "return "+lastSnippet;
			}
			//Set it up so return returns "v" and then the return value.
			var lastSnippetSplit = lastSnippet.split(" ");
			var ls = lastSnippetSplit.shift();
			var lsa = lastSnippetSplit.join(" ");
			var lsa = "[v, "+lsa+"]";
			lastSnippet = ls+" "+lsa;
			//Connect everything together.
			splitcode[splitcode.length-1] = lastSnippet;
			code = splitcode.join(";");
		})();
		var returnVars = _evaluator.eval("function(v,self){"+code+"}")
			(__self.playerVariables[sender.getName()],sender);
		__self.playerVariables[sender.getName()] = returnVars[0];
		__self.announcer.tell(returnVars[1],sender);
		return true;
	}
	else if (label == "jsc"){
		__self.announcer.tell("JSC "+_plugin.getDescription().getVersion()+". Made by Ivan K (Strat)", sender);
	}
	else{
		return _command.ghandleCommand(sender, cmd, label, args);
	}
}