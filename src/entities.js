// A Wall is a solid wall.
Crafty.c('Wall', {
	init: function() {
		this.requires('Actor, Color, Solid, sprite_wall')
			.color('none');
	}
});

// A tree is like a wall. But greener.
Crafty.c('Tree', {
	init: function() {
		this.requires('Actor, Color, Solid, sprite_tree')
			.color('none');
	}
});

Crafty.c('Npc', {
	init: function() {
		this.requires('Actor, Color, sprite_npc1, SpriteAnimation, Solid, Collision, Interactive')
			.color('none');
		
		var animationDuration = 200; //ms		
		this.bind('EnterFrame', this.moveToTarget);
		this.velocity = { x: 32, y: 0 };
		
		this.onHit('Solid', function(data) {
			this.x = this.lastX;
			this.y = this.lastY;
		});
	},
	
	moveToTarget: function(data) {
		// Keep the last (x, y) for moving back on a collision
		this.lastX = this.x;
		this.lastY = this.y;
		
		var elapsedMs = data.dt / 1000.0;		
		this.x += this.velocity.x * elapsedMs;
		this.y += this.velocity.y * elapsedMs;
	}
});

// This is the player-controlled character
Crafty.c('Player', {
	init: function() {
		var animationDuration = 200; //ms
		
		this.requires('Actor, Color, MoveAndCollide, sprite_player, SpriteAnimation, Solid')
			.fourway(4)			
			.color('none')
			.stopOnSolids()
			
			// Four animations (one per direction). X, Y, frames (excluding first frame)
			.reel('PlayerMovingDown', animationDuration, 0, 0, 2)
			.reel('PlayerMovingLeft', animationDuration, 0, 1, 2)
			.reel('PlayerMovingRight', animationDuration, 0, 2, 2)
			.reel('PlayerMovingUp', animationDuration, 0, 3, 2);
			
		// Change direction: tap into event
		var animation_speed = 6;
		this.bind('NewDirection', function(data) {
			if (data.x > 0) {
				this.animate('PlayerMovingRight', -1);
			} else if (data.x < 0) {
				this.animate('PlayerMovingLeft', -1);
			} else if (data.y > 0) {
				this.animate('PlayerMovingDown', -1);
			} else if (data.y < 0) {
				this.animate('PlayerMovingUp', -1);
			} else {
				this.pauseAnimation();
			}
		});
	}
});