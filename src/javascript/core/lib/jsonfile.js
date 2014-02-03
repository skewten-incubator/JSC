"use strict";
///////////////////////////////////////////
//jsonfile.js
//Module for saving and loading JSON files.
var logger = __self.logger;
logger = logger.module("jsonfile");

function loadFile(file){
	if (!file.exists()){
		logger.error("Plugin sent in non-existent file.");
		throw new Error("File doesn't exist.");
	}
	else{
		if (!file.isFile()){
			logger.error("Plugin sent it a non-file File object.");
			throw new Error("Can't read a non-file.");
		}
		else{
			var reader = new java.io.BufferedReader(new java.io.FileReader(file));
			var json = "";
			var line;
			while ((line = reader.readLine()) !== null){
				json += line;
			}
			try{
				return JSON.parse(json);
			}
			catch(e){
				logger.error("Could not parse JSON.");
				throw new Error("Couldn't parse JSON");
			}
		}
	}
}

function saveFile(file, obj){
	try{
		var lines = JSON.stringify(obj,null,2).split("\n");
	}
	catch(e){
		logger.error("Could not stringify object!");
		throw new Error("Couldn't stringify object");
	}
	var pr = new java.io.PrintWriter(file.getCanonicalPath(), "UTF-8");
	for (var i=0;i<lines.length;i++){
		pr.println(lines[i]);
	}
	pr.close();
}

exports.load = loadFile;
exports.save = saveFile;