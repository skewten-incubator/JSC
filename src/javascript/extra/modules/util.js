////////////////////////////////////////////
//JSC.extra.module.Util
//Provides miscellaneous helper functions
//v1.0
var Util = function(){
	var self = this;
	
	////////////////
	//Various data.
	self.data = {};
	//Get a list of the worlds in string format.
	data.getWorlds = function(){
		var worlds 	= server.getWorlds().toArray(),
			arr 	= [];
		for (var i=0;i<worlds.length;i++){
			arr.push(new String(worlds[i].getName()));
		}
		return arr;
	};
	//Get a list of the players.
	data.getPlayers = function(){
		return server.getOnlinePlayers();
	}

	///////////////////
	//Player functions.
	self.player = {};
	//Teleport player to the spawn of a world.
	player.toSpawn = function(player, world){
		//If no world is specified, assume the world the player is in.
		var w = (world)?server.getWorld(world):player.getWorld();
		player.teleport(w.getSpawnLocation());
	};
	//Run a specific function to all players.
	player.doAll = function(func, args){
		var players = data.getPlayers();
		for (var i=0;i<players.length;i++){
			//If args isn't an array, make it a new one.
			if (Object.prototype.toString.call(args) !== '[object Array]'){
				args = [];
			}
			//Add the player to the beginning of array.
			args.unshift(players[i]);
			//Run the function asynchronously.
			setTimeout(function(){func.apply(func, args)});
		}
	}
	//Clear the inventory of a player.
	player.clearInv = function(player){
		player.getInventory().clear();
	};
	//Heal a player.
	player.heal = function(player){
		player.setHealth(player.getMaxHealth());
	};
	
	//////////////
	//Conversions.
	self.conv = {};
	//Convert player's location to string.
	conv.locationToString = function(location, yp){
		var	x 		= location.getX(),
			y 		= location.getY(),
			z 		= location.getZ(),
			world 	= String(location.getWorld().getName()),
			yaw 	= location.getYaw(),
			pitch 	= location.getPitch();
		return String(world+"|"+x+"|"+y+"|"+z+((yp)?("|"+yaw+"|"+pitch):""));
	}
	//Convert string to location.
	conv.stringToLocation = function(string){
		var arr = string.split("|");
		//If we don't have arr[4/5] (yaw/pitch), then set them to 0.
		if (!arr[4]){arr[4]=0;}
		if (!arr[5]){arr[5]=0;}
		//Make and return the location object.
		return new org.bukkit.Location(
			server.getWorld(arr[0]),
			arr[1],
			arr[2],
			arr[3],
			arr[4],
			arr[5]
		);
	}
}
exports = Util;
