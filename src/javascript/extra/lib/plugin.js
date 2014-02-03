"use strict";
//////////////////////////////////////////////////////////
//plugin.js
//Module for registering a plugin that will save its data.
var logger = __self.logger;
logger = logger.module("plugin");

var File = java.io.File;
var jsonfile = require("jsonfile");

var registeredPlugins = {};
function newPlugin(name){
	name = String(name);
	if (registeredPlugins[name]){
		logger.error("A plugin just now tried to register an existing plugin with the name "+name);
		throw new Error("Existing plugin.");
	}
	else{
		registeredPlugins[name] = {};
		return registeredPlugins[name];
	}
}
function deletePlugin(name){
	name = String(name);
	if (registeredPlugins[name]){
		logger.warn("A plugin is deleting a registered plugin "+name);
		delete registeredPlugins[name];
		var f = new File(_root+"/data/"+name+".json");
		if (f.exists()){
			if (!f["delete"]()){
				logger.error("Could not delete file "+f.getCanonicalPath());
			}
		}
	}
	else{
		logger.warn("A plugin just now tried to delete an unregistered plugin.");
	}
}
function onPluginLoad(){
	var f = new File(_root+"/data/");
	if (!f.exists()){
		logger.warn("The data directory doesn't exist! Making directory.");
		try{
			f.mkdir();
		}
		catch(e){
			logger.error("Could not make directory! Make sure the path is right.");
			logger.error("Path: "+_root+"/data/");
		}
	}
	else{
		var files = f.listFiles();
		for (var i=0;i<files.length;i++){
			try{
				var obj = jsonfile.load(files[i]);
				if (!obj.name){
					logger.error("JSON doesn't have a name! Skipping.");
					continue;
				}
				if (!obj.data){
					logger.error("JSON plugin "+obj.name+" doesn't have data! Skipping.");
					continue;
				}
				registeredPlugins[String(obj.name)] = obj.data;
			}
			catch(e){
				logger.error("Could not read a JSON file! Skipping.");
				continue;
			}
		}
	}
}
function onPluginUnload(){
	for (p in registeredPlugins){
		var f = new File(_root+"/data/"+p+".json");
		var o = {
			name: p,
			data: registeredPlugins[p]
		}
		jsonfile.save(f, o);
	}
}

function pluginExists(name){
	if (!registeredPlugins[String(name)]){
		return false;
	}
	return true;
}

function getPlugin(name){
	name = String(name);
	if (registeredPlugins[name]){
		return registeredPlugins[name];
	}
	else{
		throw new Error("Plugin doesn't exist.");
	}
}

exports.add = newPlugin;
exports.remove = deletePlugin;
exports.exists = pluginExists;
exports.get = getPlugin;
exports._load = onPluginLoad;
exports._unload = onPluginUnload;