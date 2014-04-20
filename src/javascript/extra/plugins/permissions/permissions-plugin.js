/*
    JSC.extra.permissions:Plugin
    
    JSC's own permissions plugin.
    Will not do anything until JSC 1.1.4 rolls out.
*/

////////////////////////////////////////////////////////////////////////////////
var plgn_name = "JSC.Perms",
    plgn_version = "0.1.0",
    plgn,
    plgn_commands = {
        "jscp":[]
    };

if (plugin.exists(plgn_name)){
    plgn = plugin.get(plgn_name).data;
}
else{
    plgn = plugin.add(plgn_name, plgn_commands).data;
}
////////////////////////////////////////////////////////////////////////////////

var logger = require("logger")({
    prefix: "JSC.Perms"
}).module("main");

function plugin_setup(){
    var config      = {},
        File        = java.io.File,
        workingDir  = new File(_root+"/../JSC.Perms/");
    //Do nothing. The new plugin creation system will be implemented in JSC 1.4
    return;
    ////////////////////    
    workingDir.mkdirs();
    var configFile = new File(workingDir, "config.json");
    if (configFile.exists()){
        config = jsonfile.load(configFile);
    }
    else{
        config = {
            "test": 5,
            "moretests":"yeah"
        }
        jsonfile.save(configFile, config);
    }
}

plugin_setup();