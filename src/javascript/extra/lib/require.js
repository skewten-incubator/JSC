"use strict";
////////////////////////////////////////////
//require.js
//Module for "requiring" Javascript modules.
var Require =(function(evaluator, root, paths){
	var logger = __self.logger;
	logger = logger.module("require");
	var result = null;
	var File = java.io.File;
	function locate_module(obj){
		var newobj;
		if (!obj.exists()){
			newobj = new File(obj.getCanonicalPath()+".js");
			if (newobj.exists() && newobj.isFile()){
				return newobj;
			}
			else{
				return null;
			}
		}
		else{
			if (obj.isFile()){
				return obj;
			}
			else{
				var newobj;
				newobj = new File(obj.getCanonicalPath()+"/package.json");
				if (newobj.exists() && newobj.isFile()){
					jsonobj = jsonfile.read(newobj);
					if (jsonobj.main){
						newobj = new File(obj.getCanonicalPath()+"/"+jsonobj.main);
						if (newobj.exists() && newobj.isFile()){
							return newobj;
						}
					}
				}
				newobj = new File(obj.getCanonicalPath()+"/"+obj.getName()+".js");
				if (newobj.exists() && newobj.isFile()){
					return newobj;
				}
				newobj = new File(obj.getCanonicalPath()+"/index.js");
				if (newobj.exists() && newobj.isFile()){
					return newobj;
				}
				return null;
			}
		}
	}
	function load_module(obj){
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
			logger.error("Could not compile the "+obj.getName()+" module!");
			throw e;
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
			logger.error("Could not execute the "+obj.getName()+" module!");
			throw e;
		}
		return exports;
	}
	function require(path, absolute){
		path = String(path);
		if (absolute && path[0] == "/"){
			result = locate_module(new File(path));
			if (!result){
				logger.error("Could not locate module with the path "+path);
				throw new Error("File not found");
			}
			else{
				return load_module(result);
			}
		}
		if (path[0] == "/"){
			result = locate_module(new File(root+path));
			if (!result){
				logger.error("Could not locate module with the path "+path);
				throw new Error("File not found");
			}
			else{
				return load_module(result);
			}
		}
		else if (path[0] == "." && path[1] == "/"){
			path = path.substr(1);
			try{
				path = __dirname+path;
			}
			catch(e){
				logger.error("An unexpected error occured.");
				throw e;
			}
			result = locate_module(new File(path));
			if (!result){
				logger.error("Could not locate module with the path "+path);
				throw new Error("File not found");
			}
			else{
				return load_module(result);
			}
		}
		else{
			var newpath;
			for (var i=0;i<paths.length;i++){
				newpath = paths[i]+path;
				result = locate_module(new File(newpath));
				if (result){
					return load_module(result);
				}
			}
			logger.error("Could not locate module in the module paths.");
			throw new Error("File not found");
		}
	}
	return require;
});
exports = Require;