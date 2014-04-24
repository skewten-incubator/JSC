//BUILD #1
//////////////////////////////////////////////////////////
//plugin.js
//Module for registering a plugin that will save its data.
var logger              = __self.logger.module("plugin"),
    File                = java.io.File,
    jsonfile            = require("jsonfile"),
    registeredPlugins   = {};

var JSCPlugin = function(name, commands){
    var self = this;
    self.name = name;
    self.data = {};
    self.commands = commands;
}

function newPlugin(name, commands){
    if (registeredPlugins[name]){
        logger.error("A plugin just now tried to register an existing plugin with the name "+name);
        throw new Error("Existing plugin.");
    }
    registeredPlugins[name] = new JSCPlugin(name, commands);
    return registeredPlugins[name];
}

function deletePlugin(name){
    if (!registeredPlugins[name]){
        logger.warn("A plugin just now tried to delete an unregistered plugin.");
    }
    logger.warn("A plugin is deleting a registered plugin "+name);
    delete registeredPlugins[name];
    var f = new File(_root+"/data/"+name+".json");
    if (f.exists()){
        //We have to do delete via associative array.
        //delete is a JS keyword.
        if (!f["delete"]()){
            logger.error("Could not delete file "+f.getCanonicalPath());
        }
    }
}

function pluginExists(name){
    if (!registeredPlugins[String(name)]){
        return false;
    }
    return true;
}

function getPlugin(name){
    if (registeredPlugins[name]){
        return registeredPlugins[name];
    }
    else{
        return null;
    }
}

function onPluginLoad(){
    var directory = new File(_root+"/data/");
    if (!directory.exists()){
        logger.warn("The data directory doesn't exist! Making directory.");
        try{
            directory.mkdir();
        }
        catch(e){
            logger.error("Could not make directory! Make sure the path is right.");
            logger.error("Path: "+_root+"/data/");
        }
        return;
    }
    var files = directory.listFiles();
    for (var i=0;i<files.length;i++){
        try{
            //Try to load the JSON.
            var pluginobj = jsonfile.load(files[i]);
            if (!pluginobj.name){
                logger.error("JSON file "+files[i].getName()+" doesn't have a name property! Skipping.");
                continue;
            }
            if (!pluginobj.data){
                logger.error("JSON plugin "+pluginobj.name+" doesn't have data! Skipping.");
                continue;
            }
            registeredPlugins[pluginobj.name] = pluginobj;
        }
        catch(e){
            logger.error("Could not read JSON file '"+files[i].getName()+"'! Skipping.");
            logger.error(e);
            continue;
        }
    }
}

function onPluginUnload(){
    //Save all plugins.
    for (p in registeredPlugins){
        var file = new File(_root+"/data/"+p+".json");
        jsonfile.save(file, registeredPlugins[p]);
    }
}

exports.add = newPlugin;
exports.remove = deletePlugin;
exports.exists = pluginExists;
exports.get = getPlugin;
exports._load = onPluginLoad;
exports._unload = onPluginUnload;