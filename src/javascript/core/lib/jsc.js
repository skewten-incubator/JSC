"use strict";
/*THIS FILE IS EXECUTED BEFORE ANY OTHER FILE !*/

//////////////////////////////////
//jsc.js
//Main file for the JSC plugin.

var global 	= this,
	__self 	= {},
	build	= 15;

function __onEnable(evaluator, plugin, root){
	var settingsVersion = 1;
	
	if (global.__pluginEnabled){
		logger.error("Something tried to enable already-enabled JSC!");
		return;
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
	String.prototype.trim = function(){
		return this.replace(/^\s+|\s+$/gm, '');
	};

	//////////////////////////////////////////////////////////////////////////////
	//require_tiny
	//A minimized form of require.js, used for quick module loading for jsc.js
	function require_tiny(module){
		var fileobj = new java.io.File(root+"/lib/"+module+".js"),
			reader 	= new java.io.BufferedReader(new java.io.FileReader(fileobj)),
			code 	= "",
			line;

		//We're not checking for cache here because it'd be stupid to.
		//Caching will be used by the actual require() plugin.

		while ((line = reader.readLine()) !== null){
			code += line+"\n";
		}

		var head = "(function(exports, _filename, _dirname){",
			tail = ";return exports;})";
		
		code = head+code+tail;
		try{
			var compiled = evaluator.eval(code);
		}
		catch(e){
			logger && logger.error("Could not compile the "+fileobj.getName()+" module!");
			logger.debug(e);
			return;
		}
		try{
			var exports = compiled.call(
				compiled,
				{},
				fileobj.getName(),
				fileobj.getParentFile().getCanonicalPath()
			);
		}
		catch(e){
			logger && logger.error("Could not execute the "+fileobj.getName()+" module!");
			logger.debug(e.stack);
			return;
		}
		//Cache the exports.
		__JSCache[fileobj.getCanonicalPath()] = exports;
		return exports;
	}

	////////////////////////////
	//Set up global environment
	//global JS cache.
	global.__JSCache = {};
	//root path (usually {bukkitdir}/plugins/jsc/)
	global._root = root.getParentFile().getCanonicalPath();
	//java Plugin object
	global._plugin = plugin;
	//java ScriptEngine object
	global._evaluator = evaluator;
	//java Server object
	global.server = plugin.getServer();
	//if the plugin is enabled or not (in this case, yes)
	global.__pluginEnabled = true;
	//replace the root variable with the path
	root = _root;

	//Create the logger object
	__self.logger = new (require_tiny("logger"))({
		prefix: "JSC"
	}).module("main");
	var logger = __self.logger;
	logger.log("Loading plugin.");

	//Load up require()
	global.require = (new (require_tiny("require"))(
		evaluator,
		root,
		[
			root+"/lib/",
			root+"/modules/"
		]
	)).require;

	//Create the announcer object
	__self.announcer = new (require("announcer"))({
		tell_prefix: "JSC> ".gray(),
		broadcast_prefix: "["+"JSC".gold()+"]> "
	});
	var announcer = __self.announer;
	//load the command module
	global.command = require("command");
	//load the events module
	global.events = require("events");
	//load the plugin module
	global.plugin = require("plugin");
	
	///////////////////////////////
	//(set/clear)(Timeout/Interval)
	//Bukkit uses ticks.
	//1 tick = 50ms
	global.setTimeout = function(callback, delay){
		//If there is no delay specified, assume 0.
		delay = (delay)?delay:0;
		return server.getScheduler().runTaskLater(_plugin, callback, delay/50);
	};
	global.clearTimeout = function(task){
		task.cancel();
	};
	global.setInterval = function(callback, delay){
		//If there is no delay specified, assume 0.
		delay = (delay)?delay:0;
		var interval = delay/50;
		return server.getScheduler().runTaskTimer(_plugin, callback, interval, interval);
	};
	global.clearInterval = function(task){
		task.cancel();
	};
	
	///////////////////////////////////////////////
	//Run all global modules' pluginEnable handlers
	global.plugin._load();

	///////////////////////
	//Update JSC's savedata
	function updateInfo(s){
		s.settingsVersion = settingsVersion;
	}
	if (!global.plugin.exists("JSC")){
		logger.warn("JSC savedata doesn't exist, creating.");
		var savedata = global.plugin.add("JSC");
		updateInfo(savedata);
	}
	else{
		var savedata = global.plugin.get("JSC");
		if (!savedata.settingsVersion || savedata.settingsVersion < settingsVersion){
			logger.log("Updating plugin's savedata.");
			updateInfo(savedata);
		}
	}

	/////////////////////////////////////
	//Register plugin commands and events
	command.register("update", function(a,p){
		if (!p.isOp()){
			__self.announcer.tell("You're not allowed to run the update command.", p);
			return;
		}
		if (a.length < 2){
			__self.announcer.tell("Usage: /jsp update core", p);
		}
		else{
			if (!global.__confirmUpdate){
				__self.announcer.tell("WARNING: THIS WILL OVERWRITE ALL CUSTOM CORE MODULES.".red(), p);
				__self.announcer.tell("TO CONTINUE, RUN THE COMMAND AGAIN. OTHERWISE, DO /jsp cancel".red(), p);
				global.__confirmUpdate = true;
			}
			else{
				if (a[1] == "core"){
					plugin.checkFiles(true);
					__self.announcer.tell("Done. To load the new files, run the 'reload' command.".green(), p);
				}
				global.__confirmUpdate = false;
			}
		}
	}, function(){return ["core"]});
	command.register("cancel", function(a,p){
		if (!p.isOp()){
			__self.announcer.tell("You're not allowed to run the cancel command.", p);
			return;
		}
		if (!global.__confirmUpdate){
			__self.announcer.tell("There is no update pending!".yellow(), p);
			return;
		}
		global.__confirmUpdate = false;
		__self.announcer.tell("Cancelled JSC updating.".green(), p);
	});
	command.register("jsc", function(a,p){
		__tellVersion(p);
	});
	
	//////////////////////////
	//Handle plugin unloading.
	events.on("server.PluginDisableEvent", function(l,e){
		if (e.getPlugin() != _plugin){
			logger.error("Disable: e.getPlugin() isn't the same as _plugin!");
			return;
		}
		logger.log("Unloading plugin.");
		global.plugin._unload();
	}, "LOWEST");

	//Register global command JSC as a test.
	_plugin.registerGlobalCommand("jsc", "/jsc", "Displays JSC info.");
	//Load up tabcomplete.
	global.__tabComplete = require("tabcomplete").handle;
	//Load all the plugins.
	(function(){
		var File 		= java.io.File,
			directory 	= new File(global._root+"/plugins/");
		function loadPlugin(obj){
			var reader 	= new java.io.BufferedReader(new java.io.FileReader(obj)),
				code 	= "",
				line 	= "",
				head 	= "(function(exports, _filename, _dirname){",
				tail	= ";return exports;})";
			while ((line = reader.readLine()) !== null){
				code += line+"\n";
			}
			code = head+code+tail;
			//Try to evaluate the code.
			try{
				var compiled = evaluator.eval(code);
			}
			catch(e){
				logger.error("Could not compile the "+obj.getName()+" module!");
				logger.debug(e);
			}
			//If we could compile, then we run it asynchronously.
			try{
				setTimeout(function(){__JSCache[obj.getCanonicalPath()] = compiled.call(
					compiled,
					global.require,
					obj.getName(),
					obj.getParentFile().getCanonicalPath()
				)});
			}
			catch(e){
				logger.error("Could not execute the "+obj.getName()+" module!");
				logger.debug(e);
			}
		}
		function loadList(directory){
			var list = directory.list();
			if (!list){
				return;
			}
			for (var i=0;i<list.length;i++){
				var newFile 	= new File(directory, list[i]),
					newFileName = String(newFile.getName());
				if (newFile.isFile()&&
					newFileName.substr(newFileName.length-3) == ".js"
				){
					//Run asynchronously.
					setTimeout(function(){loadPlugin(newFile)});
				}
				else if (newFile.isDirectory()){
					//Run asynchronously.
					setTimeout(function(){loadList(newFile)});
				}
				else{
					continue;
				}
			}
		}
		loadList(directory);
	})();
};

global.__tellVersion = function(sender){
	__self.announcer.tell("JSC "+_plugin.getDescription().getVersion()+". Made by Ivan K (Strat)", sender);
}

global.__onCommand = function(sender,cmd,label,args){
	if (cmd.getName() == "jsp"){
		return command.handleCommand(sender, cmd, label, args);	
	}
	else if (cmd.getName() == "js"){
		global.self = sender;
		try{ 
			returnVar = _evaluator.eval(args.join(" "));
			if (returnVar !== 'undefined'){ 
				if (returnVar === null){ 
					__self.announcer.tell("null", sender);
				}
				else{
					__self.announcer.tell(returnVar.toString(), sender);
				}
			}
			else{
				__self.announcer.tell("undefined", sender);
			}
		}
		catch(e){
			__self.announcer.tell("Could not evaluate the JS!", sender);
			__self.announcer.tell("Error: "+e, sender);
		}
		//Suppress the usage output.
		return true;
	}
	else if (cmd.getName() == "jsc"){
		__tellVersion(sender);
	}
	else{
		return command.ghandleCommand(sender, cmd, label, args);
	}
}