"use strict";
///////////////////////////////////////////////
//announcer.js
//Module for broadcasting messages to player(s)
var logger = __self.logger.module("announcer");
var Announcer = function(object){
    var self = this;
    self.tell_prefix = object.tell_prefix || "Server> ".gray();
    self.broadcast_prefix = object.broadcast_prefix || "[Server] ";
    self.tell_raw = function(message, player){
        if (!player){
            throw new Error("No player specified!");
        }
        player.sendMessage(message);
        }
    self.tell = function(message, player){
        self.tell_raw(self.tell_prefix+message, player);
    };
    self.broadcast_raw = function(message){
        server.broadcastMessage(message);
    }
    self.broadcast = function(message){
        self.broadcast_raw(self.broadcast_prefix+message);
    };
}
exports = Announcer;