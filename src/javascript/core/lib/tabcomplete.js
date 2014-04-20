"use strict";
//////////////////////////////////////
//tabcomplete.js
//Module for handling tab completions.
var logger = __self.logger.module("tabcomplete");

//Handle global commands.
function handleGlobalCommand(result, sender, cmd, alias, args){
    var cObj = command.gcommands[String(cmd.getName())];
    if (!cObj || !cObj.tabHandler || !args[0]){
        return;
    }
    var arr = cObj.tabHandler(sender, alias, args);
    for (var i=0;i<arr.length;i++){
        result.add(arr[i]);
    }
}

function completeLocalCommand(result, args){
    //Iterate through all the commands to try to find a match.
    for (var i in command.commands){
        if (i.toLowerCase().indexOf(args[0].toLowerCase()) > -1){
            result.add(i);
        }
    }
}

//Handle /jsp commands.
function handleLocalCommand(result, sender, cmd, alias, args){
    var cObj = command.commands[args[0]];
    if (!cObj){
        //Maybe it's a partial command.
        completeLocalCommand(result, args);
        return;
    }
    if (!cObj.tabHandler || !args[1]){
        return;
    }
    var arr = cObj.tabHandler(sender, alias, args);
    for (var i=0;i<arr.length;i++){
        result.add(arr[i]);
    }
}

function handleTabComplete(result, sender, cmd, alias, args){
    //Check the command that is being used.
    var command = String(cmd.getName());
    //Convert all required variables to Javascript strings.
    for (var i=0;i<args.length;i++){
        args[i] = String(args[i]);
    }
    alias = String(alias);
    switch(command){
        case "js":
            //We're not going to do anything with it yet.
            return;
        case "jsp":
            handleLocalCommand(result, sender, cmd, alias, args);
            break;
        default:
            handleGlobalCommand(result, sender, cmd, alias, args);
            break;
    }
}

exports.handle = handleTabComplete;

/*
    ScriptCraft's JS tabComplete functions.
    Written by Walter Higgins (https://github.com/walterhiggins/), left for reference.
*/
var _isJavaObject = function(o){
    var result = false;
    try {
        o.hasOwnProperty("testForJava");
    }catch (e){
        // java will throw an error when an attempt is made to access the
        // hasOwnProperty method. (it won't exist for Java objects)
        result = true;
    }
    return result;
};
var _javaLangObjectMethods = [
    'equals'
    ,'getClass'
    ,'class'
    ,'getClass'
    ,'hashCode'
    ,'notify'
    ,'notifyAll'
    ,'toString'
    ,'wait'
    ,'clone'
    ,'finalize'
];
function _getProperties(o){
    var result = [];
    if (_isJavaObject(o))
    {
        propertyLoop:
        for (var i in o)
        {
            //
            // don't include standard Object methods
            //
            var isObjectMethod = false;
            for (var j = 0;j < _javaLangObjectMethods.length; j++)
                if (_javaLangObjectMethods[j] == i)
                    continue propertyLoop;
            var typeofProperty = null;
            try { 
                typeofProperty = typeof o[i];
            }catch( e ){
                if (e.message == 'java.lang.IllegalStateException: Entity not leashed'){
                    // wph 20131020 fail silently for Entity leashing in craftbukkit
                }else{
                    throw e;
                }
            }
            if (typeofProperty == 'function' )
                result.push(i+'()');
            else
                result.push(i);
        }
    }else{
        if (o.constructor == Array)
            return result;
        
        for (var i in o){
            if (i.match(/^[^_]/)){
                if (typeof o[i] == 'function')
                    result.push(i+'()');
                else
                    result.push(i);
            }
        }
    }
    return result.sort();
};
var onTabCompleteJS = function(result, sender, cmd, alias, args){
    if (cmd.name == 'jsp'){
        return completeJSP(result, sender, cmd, alias, args);
    }

    var _globalSymbols = _getProperties(global);
    var lastArg = args.length?args[args.length-1]+'':null;
    var propsOfLastArg = [];
    var statement = args.join(' ');
    
    statement = statement.replace(/^\s+/,'').replace(/\s+$/,'');
    
    
    if (statement.length == 0)
        propsOfLastArg = _globalSymbols;
    else{
        var statementSyms = statement.split(/[^\$a-zA-Z0-9_\.]/);
        var lastSymbol = statementSyms[statementSyms.length-1];
        //print('DEBUG: lastSymbol=[' + lastSymbol + ']');
        //
        // try to complete the object ala java IDEs.
        //
        var parts = lastSymbol.split(/\./);
        var name = parts[0];
        var symbol = global[name];
        var lastGoodSymbol = symbol;
        if (typeof symbol != 'undefined')
        {
            for (var i = 1; i < parts.length;i++){
                name = parts[i];
                symbol = symbol[name];
                if (typeof symbol == 'undefined')
                    break;
                lastGoodSymbol = symbol;
            }
            //print('debug:name['+name+']lastSymbol['+lastSymbol+']symbol['+symbol+']');
            if (typeof symbol == 'undefined'){
                //
                // look up partial matches against last good symbol
                //
                var objectProps = _getProperties(lastGoodSymbol);
                if (name == ''){
                    // if the last symbol looks like this.. 
                    // ScriptCraft.
                    //
                    
                    for (var i =0;i < objectProps.length;i++){
                        var candidate = lastSymbol + objectProps[i];
                        var re = new RegExp(lastSymbol + '$','g');
                        propsOfLastArg.push(lastArg.replace(re,candidate));
                    }
                    
                }else{
                    // it looks like this..
                    // ScriptCraft.co
                    //
                    //print('debug:case Y: ScriptCraft.co');
                    
                    var li = statement.lastIndexOf(name);
                    for (var i = 0; i < objectProps.length;i++){
                        if (objectProps[i].indexOf(name) == 0)
                        {
                            var candidate = lastSymbol.substring(0,lastSymbol.lastIndexOf(name));
                            candidate = candidate + objectProps[i];
                            var re = new RegExp(lastSymbol+ '$','g');
                            //print('DEBUG: re=' + re + ',lastSymbol='+lastSymbol+',lastArg=' + lastArg + ',candidate=' + candidate);
                            propsOfLastArg.push(lastArg.replace(re,candidate));
                        }
                    }
                    
                }
            }else{
                //print('debug:case Z:ScriptCraft');
                var objectProps = _getProperties(symbol);
                for (var i = 0; i < objectProps.length; i++){
                    var re = new RegExp(lastSymbol+ '$','g');
                    propsOfLastArg.push(lastArg.replace(re,lastSymbol + '.' + objectProps[i]));
                }
            }
        }else{
            //print('debug:case AB:ScriptCr');
            // loop thru globalSymbols looking for a good match
            for (var i = 0;i < _globalSymbols.length; i++){
                if (_globalSymbols[i].indexOf(lastSymbol) == 0){
                    var possibleCompletion = _globalSymbols[i];
                    var re = new RegExp(lastSymbol+ '$','g');
                    propsOfLastArg.push(lastArg.replace(re,possibleCompletion));
                }
            }
                
        }
    }
    for (var i = 0;i < propsOfLastArg.length; i++)
        result.add(propsOfLastArg[i]);
};