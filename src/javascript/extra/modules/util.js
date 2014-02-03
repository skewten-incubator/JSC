////////////////////////////////////////////
//JSC.extra.module.Util
//Provides miscellaneous helper functions
//v1.0
var Util = function(){
	data = {};
	data.getWorlds = function(){
		var worlds = _server.getWorlds().toArray();
		var arr = [];
		for (var i=0;i<worlds.length;i++){
			arr.push(new String(worlds[i].getName()));
		}
		return arr;
	};
	data.getPlayers = function(){
		return _server.getOnlinePlayers();
	}

	player = {};
	player.data = data;
	player.toSpawn = function(player, n){
		player.teleport(player.getWorld().getSpawnLocation());
	};
	player.doAll = function(func, arg){
		var players = data.getPlayers();
		for (var i=0;i<players.length;i++){
				this[func](players[i], arg);
		}
	}
	player.toWorld = function(player, world){
		var location;
		try{
			location = _server.getWorld(world).getSpawnLocation();
		}catch(e){
			try{
				location = _server.getWorld(data.getWorlds()[0]).getSpawnLocation();
			}catch(e){
				return false;
			}
		}
		player.teleport(location);
	};
	player.clearInv = function(player, n){
		player.getInventory().clear();
	};
	player.heal = function(player, n){
		player.setHealth(player.getMaxHealth());
	};

	conv = {};
	conv.locationToString = function(location){
		var string;
		var x = location.getX();
		var y = location.getY();
		var z = location.getZ();
		var world = String(location.getWorld().getName());
		string = String(world+"|"+x+"|"+y+"|"+z);
		return string;
	}
	conv.stringToLocation = function(string){
		var location;
		var arr = string.split("|");
		location = new org.bukkit.Location(_server.getWorld(arr[0]),arr[1],arr[2],arr[3]);
		return location;
	}
	return this;
}
exports = Util;
