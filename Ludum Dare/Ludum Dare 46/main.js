var c = document.createElement("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
var ctx = c.getContext("2d");
ctx.imageSmoothingEnabled = false;

var textures = [loadTexture("Textures/player.png"),
				loadTexture("Textures/ground.png"), 
				loadTexture("Textures/altar.png"), 
				loadTexture("Textures/sword.png"), 
				loadTexture("Textures/goat.png"),
				loadTexture("Textures/goat2.png"),
				loadTexture("Textures/goat3.png"),
				loadTexture("Textures/goat4.png"),
				loadTexture("Textures/soul.png"),
				loadTexture("Textures/soul2.png"),
				loadTexture("Textures/demon.png"), 
				loadTexture("Textures/logo.png"), 
				loadTexture("Textures/menuBackground.png"),
				loadTexture("Textures/play.png"),
				loadTexture("Textures/playEnabled.png"),
				loadTexture("Textures/continue.png"), 
				loadTexture("Textures/demonHead.png"), 
				loadTexture("Textures/tunnel.png"), 
				loadTexture("Textures/bear.png"), 
				loadTexture("Textures/bear2.png"), 
				loadTexture("Textures/bear3.png"), 
				loadTexture("Textures/bear4.png"), 
				loadTexture("Textures/bush.png"), 
				loadTexture("Textures/zeus.png"), 
				loadTexture("Textures/zeusHead.png"), 
				loadTexture("Textures/cloud.png"), 
				loadTexture("Textures/icon.png"), 
				loadTexture("Textures/endScreen.png")];
var keys = [];
for(var i = 0; i < 255; i++) {
	keys.push(false);
}
var winh = c.width / c.height;
var player = {
	x: 1.25, 
	y: 0.5,
	width: 0.1,
	height: 0.1,
	xVel: 0,
	speed: 0.0075,
	yVel: 0,
	wobbleX: 0,
	wobbleY: 0,
	origSwordRot: -0.8,
	swordRot: -0.8,
	swordVel: 0,
	swingDirectly: false
};
var souls = [];
var animals = [];
var camera = {x: 0, y: -0.6};
var mousePos = {x: 0, y: 0};
var menu = true;
var lost = false;
var lostTimer = 0;
var life = 100;
var soulsCollected = 0;
var playedRip = false;
var music = undefined;

var dialogueTimer = 0;
var dialogueId = 0;
var dialogueLine = 0;
var dialogue = [{icon: 16, text: ["Hey, you mortal!"]}, 
				{icon: 16, text: ["I have gotten stuck in this awful",  "world of yours."]}, 
				{icon: 16, text: ["I need to consume souls to survive," , "but I can't get away from this", "altar. So you need to gather me", "some souls."]}, 
				{icon: 16, text: ["What do you mean you don't want to?", "YOU HAVE TO IF YOU DON'T WANT TO", "DIE!"]}, 
				{icon: 16, text: [""]},
				{icon: 16, text: ["YOU HAVE BETRAYED ME!", "NOW YOU SHALL DIE!"]}, 
				{icon: 16, text: [""]}, 
				{icon: 16, text: ["Good."]},
				{icon: 16, text: ["Now I will need some more", "powerful souls to be able to gain", "enough power."]}, 
				{icon: 16, text: ["I will lure some bears to you."]}, 
				{icon: 16, text: [""]}, 
				{icon: 24, text: ["What do you guys think you are", "doing?"]}, 
				{icon: 16, text: ["Psst, kill that guy NOW!"]}, 
				{icon: 24, text: ["I can hear you.", "Also I'm immortal, so good luck", "on killing me."]}, 
				{icon: 24, text: [""]}, 
				{icon: 16, text: ["HAHAHA, FINALLY HE IS DEAD.", "I'M FREE!"]}, 
				{icon: 26, text: ["2 Years later there is not a single", "living thing left on earth."]},
				{icon: 26, text: ["Because you let that demon free."]},
				{icon: 26, text: ["It is a vast wasteland that will", "never be what it once was."]},
				{icon: 26, text: ["All thanks to you."]},
				{icon: 26, text: ["THE END", "Thanks for playing!"]},
				{icon: 26, text: ["Restart?"]}];

var spawnTimer = 0;
var liveAnimals = 0;
var zeusSpawned = false;
var zeusDead = false;
var zeusDeadTime = 0;

var endStage = 0;
var transitionTimer = 0;

var timer = 0;
var fps = 30;
var loop = setInterval(update, 1000 / fps);
function update() {
	if(!menu) {
		timer++;
		
		// Spawning
		if(dialogue[dialogueId].text[0] == "" && liveAnimals <= 4) {
			if(spawnTimer == 0) {
				if(soulsCollected < 4) {
					animals.push(new animal(-1 + Math.round(Math.random()) * 7, 0, 0));
					liveAnimals++;
				}
				if(soulsCollected >= 4) {
					animals.push(new animal(-1 + Math.round(Math.random()) * 7, 0, Math.min(1, Math.round(Math.random() * 2))));
					liveAnimals++;
				}
				spawnTimer = Math.round(Math.random() * 120 + 60);
			}
			spawnTimer--;
		}
		
		if(endStage != 0) {
			transitionTimer++;
		}
		
		if(zeusSpawned) {
			life = 100;
		}
		
		if(soulsCollected >= 7 && dialogueId == 10) {
			dialogueId = 11;
			dialogueTimer = 0;
			dialogueLine = 0;
			animals.push(new animal(player.x - 0.3, player.y - 1.5, 2));
			zeusSpawned = true;
			playSound("float", 0.4);
		}
		
		if(zeusDead && dialogueId < 15) {
			dialogueId = 15;
		}
		
		var dI = dialogueId;
		// Half of the following is probably not needed. idk
		if(soulsCollected >= 4 && dI != 7 && dI != 8 && dI != 9 && dI != 10 && dI != 5 && dI != 6 && dI < 11) {
			dialogueId = 7;
		}
		
		if(dialogueId >= 4 && dialogueTimer == 0 && life > 0) {
			life -= 0.125;
		} 
		dI = dialogueId;
		if(life <= 0 && dI != 5 && dI != 6 && dI != 21) {
			lost = true;
			dialogueId = 5;
		}
		if(lost) {
			lostTimer++;
		}
		
		var xAcc = 0;
		if(!lost) {
			// Left
			if(keys[65] || keys[37]) {
				xAcc--;
			}
			// Right
			if(keys[68] || keys[39]) {
				xAcc++;
			}
			// Up
			if(keys[87] || keys[38]) {
				if(player.onGround) {
					player.yVel -= 0.05;
					player.onGround = false;
					player.wobbleY = 0.2;
					player.wobbleX = 0.075;
				}
			}
		}
		
		if(xAcc != 0) {
			player.wobbleY = Math.max(0.05, player.wobbleY);
			player.wobbleX = Math.max(0.025, player.wobbleY);
		}
		player.wobbleX *= 0.8;
		player.wobbleY *= 0.8;
		
		player.swordVel *= 0.975;
		if(player.swordRot % (Math.PI * 2) > player.origSwordRot && player.swordVel > -0.8) {
			player.swordVel = 0;
			player.swordRot = player.origSwordRot;
		}
		player.swordRot += player.swordVel;
		
		if(player.swingDirectly && player.swordVel == 0) {
			player.swordVel -= 1;
			player.swingDirectly = false;
		}
		
		player.xVel *= 0.65;
		player.yVel *= 0.99;
		player.yVel += 0.005;
		player.xVel += xAcc * player.speed;
		player.onGround = false;
		if(player.y + player.yVel + player.height >= 0 && (!lost || lostTimer < 60)) {
			if(player.yVel > 0.01) {
				player.wobbleY = 0.25;
				player.wobbleX = 0.125;
			}
			player.onGround = true;
			player.y = -player.height;
			player.yVel = 0;
		}
		if(player.x + player.xVel <= -0.255) {
			player.x = -0.255;
			player.xVel = 0;
		}
		if(player.x + player.xVel >= 2.975) {
			player.x = 2.975;
			player.xVel = 0;
		}
		player.x += player.xVel;
		player.y += player.yVel;
		
		camera.x += (player.x - winh * 0.5 - (camera.x)) / 5;
		if(!lost) {
			camera.y += (player.y - 0.75 - (camera.y)) / 5;
		} else {
			camera.y += (-player.height - 0.5 - (camera.y)) / 5;
		}
		
		// Clear / Background
		ctx.fillStyle = "rgb(150, 175, 255)";
		ctx.fillRect(0, 0, c.width, c.height);
		
		// Ground
		drawRepeating(1, (-10 - camera.x) * c.height, (0 - camera.y) * c.height, 20 * c.height, 0.4 * c.height, 0.5)
		
		// Tunnel
		if(lost && lostTimer > 60 && lostTimer < 100) {
			if(!playedRip) {
				playedRip = true;
				playSound("rip", 0.5);
			}
			ctx.drawImage(textures[17], (player.x - 0.05 - camera.x) * c.height, (0.002 - camera.y) * c.height, 0.2 * c.height, 0.6 * c.height);
		}
		
		// Animals
		for(var i = 0; i < animals.length; i++) {
			
			animals[i].update();
			ctx.save();
			if(animals[i].hp <= 0) {
				ctx.translate(0, 0.005 * c.height);
			}
			if(animals[i].flipped) {
				ctx.scale(-1, 1);
			}
			ctx.globalCompositeOperation = "destination-out";
			var d = () => {ctx.drawImage(textures[animals[i].texture], (animals[i].flipped ? -1 : 1) * (animals[i].x + (animals[i].flipped ? 1 : 0) * animals[i].width - camera.x) * c.height, (animals[i].y - camera.y) * c.height, animals[i].width * c.height, animals[i].height * c.height);}
			d();
			ctx.globalCompositeOperation = "destination-over";
			ctx.fillStyle = "rgb(255, 255, 255, " + (animals[i].noDamageTimer / 20) + ")";
			if(animals[i].hp > 0) {
				ctx.fillRect(0, 0, (animals[i].flipped ? -1 : 1) * c.width, c.height);
			}
			d();
			ctx.restore();
		}
		
		// Bushes
		ctx.drawImage(textures[22], (-1.25 - camera.x) * c.height, (-0.59 - camera.y) * c.height, 1 * c.height, 0.6 * c.height);
		ctx.save();
		ctx.translate((4 - camera.x) * c.height, (-0.59 - camera.y) * c.height);
		ctx.scale(-1, 1);
		ctx.drawImage(textures[22], 0, 0, 1 * c.height, 0.6 * c.height);
		ctx.restore();
		
		// Player
		var sX = 1 - (Math.cos(timer / 1.25) + 1) * player.wobbleX;
		var sY = 1 - (Math.sin(timer / 1.25) + 1) * player.wobbleY;
		ctx.save();
		if(player.xVel > 0) {
			ctx.scale(-1, 1);
			ctx.translate(-(player.x + (player.width + sX * player.width) * 0.5 - camera.x) * c.height, 1 + (player.y + (player.height - sY * player.height) - camera.y) * c.height);
		} else {
			ctx.translate((player.x + (player.width - sX * player.width) * 0.5 - camera.x) * c.height, 1 + (player.y + (player.height - sY * player.height) - camera.y) * c.height);
		}
		ctx.drawImage(textures[0], 0, 0, player.width * c.height * sX, player.height * c.height * sY);
		ctx.restore();
		
		// Sword
		var playerCenter = {x: (player.x + (player.width - sX * player.width) * 0.5 - camera.x) * c.height + player.width * c.height * sX / 2,
							y: 1 + (player.y + (player.height - sY * player.height) - camera.y) * c.height + player.height * c.height * sY / 2};
		if(player.xVel > 0) {
			playerCenter = {x: (player.x - (player.width + sX * player.width) * 0.5 - camera.x) * c.height + player.width * c.height * sX / 2,
							y: 1 + (player.y - (player.height + sY * player.height) - camera.y) * c.height + player.height * c.height * sY / 2};
		}
		if(player.swordVel != 0) {
			for(var i = 0; i < animals.length; i++) {
				var animalCenter = {x: animals[i].x + animals[i].width * 0.5, y: animals[i].y + animals[i].height * 0.5};
				var worldPlayerCenter = {x: player.x + player.width * 0.5, y: player.y + player.height * 0.5};
				if(Math.sqrt((worldPlayerCenter.x - animalCenter.x) ** 2 + (worldPlayerCenter.y - animalCenter.y) ** 2) < animals[i].hitDist) {
					var dir = 0;
					if(worldPlayerCenter.x < animalCenter.x) {
						dir = 0;
					}
					if(worldPlayerCenter.x > animalCenter.x) {
						dir = 1;
					}
					animals[i].damage(25, dir);
				}
			}
		}
		ctx.save();
		if(player.xVel > 0) {
			ctx.translate(playerCenter.x + 0.14 * c.height, playerCenter.y + 0.23 * c.height);
		} else {
			ctx.translate(playerCenter.x - 0.038 * c.height, playerCenter.y + 0.03 * c.height);
		}
		if(player.xVel > 0) {
			ctx.rotate(-player.swordRot);
		} else {
			ctx.rotate(player.swordRot);
		}
		for(var i = 0; i < 10; i++) {
			
			if(player.xVel > 0) {
				ctx.rotate(0.375 * Math.min(0, player.swordVel + 0.7));
			} else {
				ctx.rotate(-0.375 * Math.min(0, player.swordVel + 0.7));
			}
			ctx.globalAlpha = 1 - i * 0.1;
			ctx.drawImage(textures[3], -0.02 * c.height, -0.075 * c.height, 0.04 * c.height, 0.08 * c.height);
		}
		ctx.restore();
		
		// Souls
		for(var i = 0; i < souls.length; i++) {
			var x = 1.5 - souls[i].x;
			var y = -0.4 - souls[i].y;
			var n = Math.abs(x) + Math.abs(y);
			if(n < 0.1) {
				life = Math.min(100, life + 25);
				if(souls[i].zeus) {
					zeusDead = true;
					zeusDeadTime = timer;
				}
				souls.splice(i, 1);
				i--;
				soulsCollected++;
				playSound("soulCollection", 0.05);
				continue;
			}
			souls[i].x += x / n * 0.025;
			souls[i].y += y / n * 0.025;
			ctx.save();
			ctx.translate((souls[i].x - camera.x) * c.height, (souls[i].y - camera.y) * c.height);
			ctx.rotate(Math.atan2(-0.4 - souls[i].y, 1.5 - souls[i].x));
			ctx.globalAlpha = 0.5;
			if(!souls[i].zeus) {
				ctx.drawImage(textures[8 + Math.round(timer / 5) % 2], 0, 0, 0.1 * c.height, 0.1 * c.height);
			} else {
				ctx.drawImage(textures[8 + Math.round(timer / 5) % 2], 0, 0, 0.3 * c.height, 0.3 * c.height);
			}
			ctx.globalAlpha = 1;
			ctx.restore();
		}
		
		// Altar
		ctx.drawImage(textures[2], (1.5 - camera.x) * c.height, (-0.075 - camera.y) * c.height, 0.25 * c.height, 0.1 * c.height);
		
		// Demon
		var inc = 0.025;
		if(zeusDead) {
			inc += (timer - zeusDeadTime) * 0.001;
		}
		ctx.drawImage(textures[10], (1.425 - camera.x - soulsCollected * inc * 0.5) * c.height, (-0.5 - camera.y - soulsCollected * inc * 1 + Math.sin(timer / 20) * 0.01) * c.height, (0.4 + soulsCollected * inc) * c.height, (0.4 + soulsCollected * inc) * c.height);
		
		// Life
		if(!zeusSpawned) {
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.fillRect(0.25 * c.width, 0.025 * c.height, 0.5 * c.width, 0.075 * c.height);
			ctx.fillStyle = "rgb(100, 100, 255)";
			ctx.fillRect(0.255 * c.width, 0.025 * c.height + 0.005 * c.width, 0.5 * life / 100 * c.width, 0.075 * c.height);
			ctx.drawImage(textures[16], 0.25 * c.width - 0.075 * c.height, 0.025 * c.height, 0.075 * c.height, 0.075 * c.height);
		}
		
		// End Screens
		if(endStage == 1) {
			ctx.fillStyle = "rgb(0, 0, 0, " + transitionTimer / 30 + ")";
			ctx.fillRect(0, 0, c.width, c.height);
			if(transitionTimer / 30 >= 1.25) {
				ctx.globalAlpha = Math.min(1, transitionTimer / 30 - 1.25);
				ctx.drawImage(textures[27], 0, 0, c.width, c.width / 1.777777);
				ctx.globalAlpha = 1;
			}
		}
		
		// Dialogue
		if(dialogueId < dialogue.length && dialogue[dialogueId].text[0] != "") {
			ctx.fillStyle = "rgb(0, 0, 0, 0.5)";
			ctx.fillRect(0.25 * c.width, 0.75 * c.height, 0.5 * c.width, 0.25 * c.height);
			ctx.fillStyle = "rgb(0, 0, 0, 0.5)";
			ctx.fillRect(0.175 * c.width, 0.75 * c.height, 0.075 * c.width, 0.075 * c.width);
			ctx.drawImage(textures[dialogue[dialogueId].icon], 0.175 * c.width, 0.75 * c.height, 0.075 * c.width, 0.075 * c.width);
			if(dialogueTimer < dialogue[dialogueId].text[dialogueLine].length) {
				dialogueTimer += 0.75;
			} else {
				if(dialogueLine < dialogue[dialogueId].text.length - 1) {
					dialogueTimer = 0;
					dialogueLine++;
				}
			}
			ctx.fillStyle = "rgb(255, 255, 255, 0.75)";
			ctx.font = 0.025 * c.width + "px Monospace";
			for(var i = 0; i < dialogueLine + 1; i++) {
				var t = dialogueTimer;
				if(i < dialogueLine) {
					t = dialogue[dialogueId].text[i].length;
				}
				ctx.fillText(dialogue[dialogueId].text[i].substr(0, Math.floor(t)), 0.26 * c.width, (0.81 + 0.05 * i) * c.height);
			}
			ctx.globalAlpha = 0.75;
			ctx.drawImage(textures[15], 0.7125 * c.width, (0.95 + 0.0075 * Math.sin(timer / 10)) * c.height, 0.05 * c.height, 0.025 * c.height);
			ctx.globalAlpha = 1;
		}
	} else {
		// Main menu
		drawRepeating(12, 0, 0, c.width, c.height, 0.3);
		ctx.fillStyle = "rgb(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, c.width, c.height);
		ctx.drawImage(textures[11], 0.35 * c.width, 0.025 * c.width, 0.3 * c.width, 0.15 * c.width);
		if(mousePos.x > 0.45 * c.width && mousePos.y > 0.6 * c.height && mousePos.x < 0.55 * c.width && mousePos.y < 0.6 * c.height + 0.05 * c.width) {
			ctx.drawImage(textures[14], 0.44 * c.width, 0.59 * c.height, 0.12 * c.width, 0.06 * c.width);
		} else {
			ctx.drawImage(textures[13], 0.45 * c.width, 0.6 * c.height, 0.1 * c.width, 0.05 * c.width);
		}
	}
}

function playSound(file, volume) {
	var audio = new Audio("Audio/" + file + ".wav");
	audio.volume = volume;
	audio.oncanplaythrough = function() {
		audio.play();
	}
}

function restart() {
	// Redeclare all variables
	player = {
		x: 1.25, 
		y: 0.5,
		width: 0.1,
		height: 0.1,
		xVel: 0,
		speed: 0.0075,
		yVel: 0,
		wobbleX: 0,
		wobbleY: 0,
		origSwordRot: -0.8,
		swordRot: -0.8,
		swordVel: 0,
		swingDirectly: false
	};
	souls = [];
	animals = [];
	camera = {x: 0, y: -0.6};
	mousePos = {x: 0, y: 0};
	//menu = true;
	lost = false;
	lostTimer = 0;
	life = 100;
	soulsCollected = 0;

	dialogueTimer = 0;
	dialogueId = 0;
	dialogueLine = 0;
	
	spawnTimer = 0;
    liveAnimals = 0;
    zeusSpawned = false;
	zeusDead = false;
	zeusDeadTime = 0;

	endStage = 0;
	transitionTimer = 0;

	timer = 0;
	
	playedRip = false;
}

function animal(x, y, type) {
	this.x = x;
	this.y = y;
	this.xVel = 0;
	this.yVel = 0;
	this.type = type;
	this.texture = 0;
	this.width = 0;
	this.height = 0;
	this.onGround = false;
	this.goalX = this.x;
	this.walkTimer = 0;
	this.walkTime = Math.round(Math.random() * 120 + 30);
	this.speed = 0.00125;
	this.flipped = false;
	this.anims = [];
	this.anim = 0;
	this.animFrame = 0;
	this.hitDist = 0;
	this.hp = 100;
	this.animDuration = 0;
	switch(this.type) {
	case 0:
		this.animDuration = 3;
		this.hp = 75;
		this.hitDist = 0.15;
		this.texture = 4;
		this.width = 0.1;
		this.height = 0.1;
		this.anims = [[4], 
					  [4, 5, 4, 6], 
					  [7]];
		break;
		
	case 1:
		this.animDuration = 5;
		this.hp = 200;
		this.hitDist = 0.25;
		this.texture = 18;
		this.width = 0.3;
		this.height = 0.3;
		this.anims = [[18], 
					  [18, 19, 18, 20], 
					  [21]];
		break;
	
	case 2:
		this.animDuration = 5;
		this.hp = 50;
		this.hitDist = 0.4;
		this.texture = 23;
		this.width = 0.5;
		this.height = 0.5;
		this.anims = [[23], 
					  [23, 23, 23, 23], 
					  [25]];
		break;
	}
	this.noDamageTimer = 0;
	this.animTimer = 0;
	this.damage = function(hp, dir) {
		if(this.noDamageTimer == 0) {
			if(this.hp > 0 && this.hp - hp <= 0) {
				souls.push({x: this.x, y: this.y});
				liveAnimals--;
				if(this.type == 2) {
					this.y += 0.5;
					souls[souls.length - 1].zeus = true;
				}
			}
			this.hp -= hp;
			playSound("hit", 0.05)
			this.noDamageTimer = 15;
			if(dir == 0) {
				this.xVel += 0.05;
			}
			if(dir == 1) {
				this.xVel += -0.05;
			}
			this.yVel += -0.025;
		}
	}
	this.update = function() {
		if(this.noDamageTimer > 0) {
			this.noDamageTimer--;
		}
		
		this.xVel *= 0.65;
		this.yVel *= 0.99;
		if(this.type != 2) {
			this.yVel += 0.005;
		}
		if(this.texture == 25) {
			this.yVel = -0.0075;
			this.height = 0.2;
		}
		
		var xAcc = 0;
		if(this.noDamageTimer == 0 && this.hp > 0 && this.type != 2) {
			if(Math.abs(this.goalX - this.x) < 0.05) {
				this.walkTimer++;
				if(this.walkTimer > this.walkTime) {
					this.walkTimer = 0;
					this.walkTime = Math.round(Math.random() * 120 + 30);
					this.goalX = this.x + (Math.random() - 0.5) * 1;
				}
			} else {
				if(this.goalX - this.x < 0) {
					xAcc--;
				}
				if(this.goalX - this.x > 0) {
					xAcc++;
				}
			}
		}
		this.anim = 0;
		if(xAcc != 0) {
			this.anim = 1;
		}
		if(this.hp <= 0) {
			this.anim = 2;
		}
		this.xVel += xAcc * this.speed;
		if(this.xVel > 0) {
			this.flipped = false;
		} else if(this.xVel < 0) {
			this.flipped = true;
		}
		this.onGround = false;
		if(this.y + this.yVel + this.height >= 0) {
			this.onGround = true;
			this.y = -this.height;
			this.yVel = 0;
		}
		if(this.x + this.xVel <= -0.255) {
			this.x = -0.255;
			this.xVel = 0;
			this.goalX = this.x + Math.random() * 1;
		}
		if(this.x + this.xVel >= 2.975) {
			this.x = 2.975;
			this.xVel = 0;
			this.goalX = this.x - Math.random() * 1;
		}
		if(this.type == 2 && this.texture != 25) {
			this.yVel = Math.sin(timer / 30) * 0.001;
		}
		if(this.type == 2 && !this.landed) {
			this.yVel = 0.025;
			if(this.y > -0.7) {
				this.landed = true;
			}
		}
		this.x += this.xVel;
		this.y += this.yVel;
		
		this.animTimer++;
		if(this.animTimer > this.animDuration) {
			this.animTimer = 0;
			this.animFrame++;
		}
		if(this.animFrame >= this.anims[this.anim].length) {
			this.animFrame = 0;
		}
		this.texture = this.anims[this.anim][this.animFrame];
	}
}

function drawRepeating(tex, x, y, w, h, repSize) {
	var pattern = ctx.createPattern(textures[tex], "repeat");
	ctx.fillStyle = pattern;
	ctx.save();
	ctx.translate(x, y - 0.25);
	var s = repSize * c.height / textures[tex].width;
	ctx.scale(s, s);
	ctx.fillRect(0, 0.25, w / s, h / s);
	ctx.restore();
}

function loadTexture(file) {
	var img = new Image();
	img.src = file;
	return img;
}

window.onmousemove = function(e) {
	mousePos.x = e.clientX;
	mousePos.y = e.clientY;
}

window.onmousedown = function(e) {
	if(music == undefined) {
		music = new Audio("Audio/music.wav");
		music.volume = 0.2;
		music.loop = true;
		music.play();
	}

	if(!menu && dialogueId >= dialogue.length || dialogue[dialogueId].text[0] == "") {
		if(player.swordVel > -0.8) {
			if(player.swordVel == 0) {
				player.swordVel -= 1;
			} else {
				player.swingDirectly = true;
			}
		}
	}
	if(dialogueId < dialogue.length && !menu && dialogue[dialogueId].text[0] != "") {
		if(Math.floor(dialogueTimer) == dialogue[dialogueId].text[dialogueLine].length && dialogueLine + 1 == dialogue[dialogueId].text.length) {
			if(dialogueId == 5) {
				dialogueId = 21;
			} else {
				if(dialogueId == 21) {
					restart();
					return;
				}
				if(dialogueId == 15) {
					endStage = 1;
					transitionTimer = 0;
				}
				dialogueId++;
			}
			dialogueTimer = 0;
			dialogueLine = 0;
		} else {
			dialogueLine = dialogue[dialogueId].text.length - 1;
			dialogueTimer = dialogue[dialogueId].text[dialogueLine].length;
		}
	}
	if(mousePos.x > 0.45 * c.width && mousePos.y > 0.6 * c.height && mousePos.x < 0.55 * c.width && mousePos.y < 0.6 * c.height + 0.05 * c.width) {
		if(menu) {
			playSound("click", 0.5);
		}
		menu = false;
	}
}

window.onkeydown = function(e) {
	keys[e.keyCode] = true;
}

window.onkeyup = function(e) {
	keys[e.keyCode] = false;
}

window.onresize = function() {
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	winh = c.width / c.height;
	
	// Reset canvas
	c.parentElement.removeChild(c);
	c = document.createElement("canvas");
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	document.body.appendChild(c);
	ctx = c.getContext("2d");
	ctx.imageSmoothingEnabled = false;
}