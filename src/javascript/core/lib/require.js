"use strict";
////////////////////////////////////////////
//require.js
//Module for "requiring" Javascript modules.

var Require = function(evaluator, root, paths){
    var self    = this,
        logger  = __self.logger.module("require"),
        result  = null,
        File    = java.io.File;
    
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
        var reader  = new java.io.BufferedReader(new java.io.FileReader(obj)),
            code    = "",
            line,
            head    = "(function(exports, _filename, _dirname){",
            tail    = ";return exports;})";

        //Check if it's cached. If it is, return the cached exports.
        if (__JSCache[obj.getCanonicalPath()]){
            return __JSCache[obj.getCanonicalPath()];
        }

        while ((line = reader.readLine()) !== null){
            code += line+"\n";
        }
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
        //Cache the exports.
        __JSCache[obj.getCanonicalPath()] = exports;
        return exports;
    }
    
    function do_require(path, absolute){
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
            logger.error("Could not locate module "+path+" in the module paths.");
            throw new Error("File not found");
        }
    }
    //Allow access to do_require
    self.require = do_require;
};
exports = Require;