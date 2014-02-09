function mainMap(player) {
	var mainMap = {		
		width:  30,
		height: 20,
		tile: {
			width:  32,
			height: 32
		},
		
		objects: [
			{
				perimeter: 'Wall'
			}
		]
	};
	
	// NPCs (including chickens)
	var npc = Crafty.e('Npc', 'sprite_npc2');
	npc.setMessages(["Salam!", "Peace!"]);
	npc.size(mainMap.tile.width, mainMap.tile.height);
	npc.move(8, 8);
	mainMap.objects.push(npc);
	
	var npc2 = Crafty.e('WalkingNpc', 'sprite_npc1');
	npc2.setMessages(["Catch me if you can!", "Let's see how fast you can run!"]);
	npc2.size(mainMap.tile.width, mainMap.tile.height);
	npc2.move(18, 11);
	npc2.setVelocity(90, 0);
	mainMap.objects.push(npc2);
	
	var chicken = Crafty.e('Npc, PositionalAudio, sprite_chicken_white');	
	chicken.size(mainMap.tile.width, mainMap.tile.height);
	chicken.PositionalAudio('chicken', 5, player)
	chicken.move(18, 18);
	chicken.play();
	mainMap.objects.push(chicken);
	
	chicken = Crafty.e('Npc, PositionalAudio, sprite_chicken_red');	
	chicken.size(mainMap.tile.width, mainMap.tile.height);
	chicken.PositionalAudio('chicken2', 5, player)	
	chicken.move(20, 15);
	chicken.play();
	mainMap.objects.push(chicken);
	
	for (var y = 10; y < 14; y++) {
		for (var x = 6; x < 16; x++) {
			if (x != 14 && y != 12) {
			var tree = Crafty.e('Tree');
			tree.size(mainMap.tile.width, mainMap.tile.height);
			tree.move(x, y);
			mainMap.objects.push(tree);
			}
		}
	}
	
	return mainMap;
}