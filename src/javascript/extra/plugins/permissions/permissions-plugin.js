/*
	JSC.extra.permissions:Plugin
	
	JSC's own permissions plugin.
*/

////////////////////////////////////////////////////////////////////////////////
var
	plgn_name = "jscPerms",
	plgn_version = "0.1.0",
	plgn
;
if (plugin.exists(plgn_name)){
	plgn = plugin.get(plgn_name);
}
else{
	plgn = plugin.add(plgn_name);
}
////////////////////////////////////////////////////////////////////////////////

var logger = require("logger")({
	prefix: "jscPerms"
}).module("main");

function plugin_setup(){
	var config = {};
	var workingDir = new java.io.File(_root+"/../jscPerms/");
	workingDir.mkdirs();
	var configFile = new java.io.File(workingDir, "config.json");
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