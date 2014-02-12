Game = {	
	// This defines our grid's size and the size of each of its tiles
	view: {
		width: 800,
		height: 600
	},

	// Load all the maps
	maps: {
		"worldMap": worldMap(),
		"house": house1()
	},
	
	// Initialize and start our game
	start: function() {		
		// Disable scrolling so people can't scroll the browser screen with arrows.
		// This is annoying, but works well in production.
		window.addEventListener("keydown", function(e) {
			// space and arrow keys
			if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
		}, false);
		
		// Start the game
		Crafty.init(Game.view.width, Game.view.height);		
		if (debug != null && debug == true) {
			Crafty.scene('Loading');
		} else {
			Crafty.scene('SplashScreen');		
		}		
	},
	
	width: function() {
		return this.currentMap.width * this.currentMap.tile.width;
	},
	
	height: function() {
		return this.currentMap.height * this.currentMap.tile.height;
	},
	
	showMap: function(map) {
		this.gameObjects = [];
		
		this.currentMap = this.maps[map];
		
		if (this.currentMap.audio != null) {
			Crafty.audio.play(this.currentMap.audio, -1);
		}
		
		for (var y = 0; y < this.currentMap.height; y++) {
			for (var x = 0; x < this.currentMap.width; x++) {
				var bg = Crafty.e('2D, Grid, Canvas, ' + this.currentMap.background);
				bg.size(this.currentMap.tile.width, this.currentMap.tile.height);			
				bg.move(x, y);
				bg.z = -1;
			}
		}
		
		var fade = Crafty.e('2D, Canvas, Color, Tween')
			.attr({w: Game.width(), h: Game.height(), alpha: 1.0, z: 99999 })
			.color('black')
			.tween({alpha: 0.0}, 1000);
				
		if (this.currentMap.perimeter != null) {
			var entityName = 'Actor, Solid, ' + this.currentMap.perimeter;
			
			// Top and bottom
			for (var x = 0; x < this.currentMap.width; x++) {
				var e = Crafty.e(entityName);
				// They're all the same, so check the first one only.
				if (e.has('Grid') == false) {
					throw new Error("Can't create entity of type " + entityName + " for map perimeter. Check the name is correct.");
				}				
				e.size(this.currentMap.tile.width, this.currentMap.tile.height);
				e.move(x, 0);
				this.gameObjects.push(e);
				
				e = Crafty.e(entityName);
				e.size(this.currentMap.tile.width, this.currentMap.tile.height);
				e.move(x, this.currentMap.height - 1);		
				this.gameObjects.push(e);
			}
			
			// Left and right
			for (var y = 0; y < this.currentMap.height; y++) {
				var e = Crafty.e(entityName);
				e.size(this.currentMap.tile.width, this.currentMap.tile.height);
				e.move(0, y);
				this.gameObjects.push(e);
				
				e = Crafty.e(entityName);
				e.size(this.currentMap.tile.width, this.currentMap.tile.height);
				e.move(this.currentMap.width - 1, y);
				this.gameObjects.push(e);
			}
		}
		
		for (var i = 0; i < this.currentMap.objects.length; i++) {
			var def = this.currentMap.objects[i];
			// TODO: strategy pattern will work well here
			var type = def.type;
			if (def.type == null) {
				throw new Error("Object without specified type found. Definition: " + def);
			} else {
				if (def.range != null) {
					for (var y = def.range.start.y; y <= def.range.end.y; y++) {
						for (var x = def.range.start.x; x <= def.range.end.x; x++) {
							def.x = x;
							def.y = y;						
							this.createObjectFrom(def, this.player);						
						}
					}
				} else {
					this.createObjectFrom(def, this.player);				
				}			
			}
		}
	},
	
	///// HELPER FUNCTIONZ /////
	
	createObjectFrom: function(def, player) {
		// Common properties
		var name = def.type
		if (def.components != null) {
			name = name + ', ' + def.components;
		}
		
		var obj = Crafty.e(name + ', ' + def.sprite);
		obj.size(this.currentMap.tile.width, this.currentMap.tile.height);			
		obj.move(def.x, def.y);			
		
		if (def.type.toUpperCase() == 'NPC' || def.type.toUpperCase() == 'WALKINGNPC') {											
			obj.setMessages(def.messages);				
			// Walking NPCs have velocity, too.
			if (def.type.toUpperCase() == 'WALKINGNPC') {
				obj.velocity = def.velocity;
				if (obj.velocity == null) {
					throw new Error("Walking NPC defined without velocity. Use normal NPC instead.");
				}
			}
		}
		
		this.initializeAndAdd(def, obj, player);
	},
	
	initializeAndAdd: function(def, obj, player) {
		// Did we define custom intialization? Call it. (eg. positional audio NPCs)
		// First argument is the object itthis; second is the player.
		if (def.initialize != null) {
			def.initialize(obj, player);
		}
		this.gameObjects.push(obj);
	},
	
	// Is a tile occupied?
	isOccupied: function(x, y) {
		for (var i = 0; i < this.gameObjects.length; i++) {
			var obj = this.gameObjects[i];			
			if (obj.gridX() == x && obj.gridY() == y) {
				return true;
			}
		}
		
		return false;
	},
	
	findAdjacentInteractiveObject: function(x, y) {
		// TODO: use spatial partitioning to trim this list down.
		for (var i = 0; i < this.gameObjects.length; i++) {
			var obj = this.gameObjects[i];
			
			if (obj == this.player || !obj.has('Interactive')) {
				continue;
			}			
			
			// d = sqrt[(x1-x2)^2 + (y1-y2)^2]
			// or: d^2 = (x1-x2)^2 + (y1-y2)^2
			// d^2 = 2 (1^2 + 1^2 for diagonals)			
			var dSquared = Math.pow(obj.gridX() - x, 2) + Math.pow(obj.gridY() - y, 2);
			if (dSquared <= 2) {				
				return obj;
			}
		}
		
		return null;
	}
}