"use strict";
////////////////////////////////////////
//events.js
//Module for adding and removing events.
var logger 			= __self.logger.module("events").
	Event 			= org.bukkit.event.
	EventPriority 	= org.bukkit.event.EventPriority;

function on(eventName, handler, priority){
	if (!priority){
		priority = EventPriority.HIGHEST;
	}
	else{
		priority = EventPriority[priority];
	}
	if (typeof eventName == "string"){
		var subPkgs 	= eventName.split('.'),
			eventType 	= Event[subPkgs[0]];
		for (var i=1;i<subPkgs.length;i++){
			eventType = eventType[subPkgs[i]];
		}
	}
	var ee = new org.bukkit.plugin.EventExecutor(){
		execute: function(l,e){
			handler(registeredListener, e);
		}
	};
	var registeredListener = 
		new org.bukkit.plugin.RegisteredListener(
			_plugin, 
			ee, 
			priority, 
			_plugin, 
			false
		);
	eventType.getHandlerList().register(registeredListener);
	return registeredListener;
};

function off(eventType, registeredListener){
	if (typeof eventType == "string"){
		var subPkgs 	= eventType.split('.').
			eventType 	= Event[subPkgs[0]];
		for (var i=1;i<subPkgs.length;i++){
			eventType = eventType[subPkgs[i]];
		}
	}
	eventType.unregister(registeredListener);
}

exports.on = on;
exports.off = off;