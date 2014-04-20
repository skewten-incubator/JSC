"use strict";
///////////////////////////////////////////
//jsonfile.js
//Module for saving and loading JSON files.
var logger = __self.logger.module("jsonfile");

function loadFile(file){
	if (!file.exists()){
		logger.error("Plugin sent in non-existent file.");
		throw "File doesn't exist.";
	}
	if (!file.isFile()){
		logger.error("Plugin sent it a non-file File object.");
		throw "Can't read a non-file.";
	}
	//Try to parse the JSON.
	var reader 	= new java.io.BufferedReader(new java.io.FileReader(file)),
		json 	= "",
		line;
	while ((line = reader.readLine()) !== null){
		json += line;
	}
	try{
		return JSON.parse(json);
	}
	catch(e){
		logger.error("Could not parse JSON.");
		throw "Couldn't parse JSON";
	}
}

function saveFile(file, obj){
	//Try to stringify the object.
	try{
		var lines = JSON.stringify(obj,null,2).split("\n");
	}
	catch(e){
		logger.error("Could not stringify object!");
		throw "Couldn't stringify object";
	}
	//Write the file.
	var pr = new java.io.PrintWriter(file.getCanonicalPath(), "UTF-8");
	for (var i=0;i<lines.length;i++){
		pr.println(lines[i]);
	}
	//Close the file.
	pr.close();
}

exports.load = loadFile;
exports.save = saveFile;