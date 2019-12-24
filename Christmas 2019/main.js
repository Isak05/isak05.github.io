var c = document.getElementById("c");
c.width = screen.width;
c.height = screen.height;
var ctx = c.getContext("2d");
ctx.imageSmoothingEnabled = false;

var prefabs = [];
prefabs.push(new prefab());
prefabs[prefabs.length - 1].walls.push(new wall(0, 0.75, 0.75, 0.05, 7, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(0, 0.8, 0.75, 0.5, 10, 0.1));


prefabs.push(new prefab());
prefabs[prefabs.length - 1].walls.push(new wall(0, 0.751, 1.05, 0.199, 9, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(0, 0.75, 0.5, 0.05, 7, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(0.5, 0.6, 0.25, 0.05, 7, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(0, 0.8, 0.75, 0.5, 10, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(0.5, 0.65, 0.25, 0.5, 10, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(0.75, 0.95, 0.3, 0.5, 10, 0.1));

prefabs[prefabs.length - 1].deaths.push(new wall(0.75, 0.75, 0.3, 0.2, 8, 0.2));

prefabs[prefabs.length - 1].presents.push(new present(0.9, 0.3));


prefabs.push(new prefab());
prefabs[prefabs.length - 1].walls.push(new wall(0, 0.8, 0.5, 0.5, 10, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(0, 0.75, 0.5, 0.05, 7, 0.1));

prefabs[prefabs.length - 1].deaths.push(new wall(0.4, 0.65, 0.1, 0.1, 8, 0.1));

prefabs[prefabs.length - 1].presents.push(new present(0.425, 0.4));


prefabs.push(new prefab());
prefabs[prefabs.length - 1].walls.push(new wall(0, 0.8, 0.5, 0.5, 10, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(0, 0.75, 0.5, 0.05, 7, 0.1));

prefabs[prefabs.length - 1].walls.push(new wall(0.8, 0.6, 0.2, 0.05, 7, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(1.3, 0.45, 0.15, 0.05, 7, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(1.9, 0.6, 0.1, 0.05, 7, 0.1));

prefabs[prefabs.length - 1].walls.push(new wall(0.5, 0.85, 1.8, 0.5, 10, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(0.5, 0.751, 1.8, 0.099, 9, 0.1));
prefabs[prefabs.length - 1].deaths.push(new wall(0.5, 0.75, 1.8, 0.1, 8, 0.1));

prefabs[prefabs.length - 1].presents.push(new present(0.875, 0.5));
prefabs[prefabs.length - 1].presents.push(new present(1.35, 0.35));
prefabs[prefabs.length - 1].presents.push(new present(1.925, 0.5));


prefabs.push(new prefab());
prefabs[prefabs.length - 1].walls.push(new wall(0, 0.8, 1, 0.5, 10, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(0, 0.75, 1, 0.05, 7, 0.1));

prefabs[prefabs.length - 1].walls.push(new wall(0.7, 0.55, 0.2, 0.5, 10, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(0.7, 0.5, 0.2, 0.05, 7, 0.1));

prefabs[prefabs.length - 1].deaths.push(new wall(0.55, 0.6, 0.15, 0.15, 8, 0.15));

prefabs[prefabs.length - 1].presents.push(new present(0.775, 0.4));


prefabs.push(new prefab());
prefabs[prefabs.length - 1].walls.push(new wall(0, 0.8, 1.4, 0.5, 10, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(0, 0.75, 1.4, 0.05, 7, 0.1));

prefabs[prefabs.length - 1].walls.push(new wall(0.5, 0.55, 0.1, 0.05, 7, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(0.9, 0.35, 0.1, 0.05, 7, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(1.2, 0.2, 0.1, 0.05, 7, 0.1));

prefabs[prefabs.length - 1].walls.push(new wall(1.2, 0.25, 0.1, 1, 10, 0.1));
prefabs[prefabs.length - 1].walls.push(new wall(1.2, 0.2, 0.1, 0.05, 7, 0.1));

prefabs[prefabs.length - 1].deaths.push(new wall(1, 0.55, 0.2, 0.2, 8, 0.2));

prefabs[prefabs.length - 1].presents.push(new present(1.225, 0.1));

var player = {
	x: 0,
	y: c.height / 2,
	yVel: 0,
	width: c.height * 0.15,
	height: c.height * 0.15,
	jumpStrength: c.height * 0.025,
	jumping: false,
	onGround: false,
	texture: 0,
	anim: 0,
	animFrame: 0,
	animTimer: 0,
	animations: [[0, 1, 0, 2],
				[11],
				[12], 
				[13]],
	die: function() {
		paused = true;
	},
	reset: function() {
		this.x = 0;
		this.y = c.height / 2;
		this.yVel = 0;
		this.jumping = false;
		this.onGround = false;
		score = 0;
		presentsCollected = 0;
		
		walls = [];
		deaths = [];
		presents = [];
		parallaxes = [];
		particles = [];
		
		for(var i = 0; i < 3; i++) {
			parallaxes.push(new parallax(c.width / 3 * i / c.height, 0.15 + Math.random() * 0.15, 0.3, 0.6, 3, 0.0025, "hsl(" + Math.random() * 360 + ", 50%, 50%)"));
		}
		for(var i = 0; i < 2; i++) {	
			parallaxes.unshift(new parallax(c.width / 2 * i / c.height, 0.05 + Math.random() * 0.15, 0.5, 0.7, 4, 0.00125));
		}
		
		worldEnd = 0;
		gen(0, 0);
		
		paused = false;
		prevPaused = false;
		pauseTimer = 0;
	}
};

var walls = [];
var deaths = [];
var presents = [];
var parallaxes = [];
var particles = [];

for(var i = 0; i < 3; i++) {
	parallaxes.push(new parallax(c.width / 3 * i / c.height, 0.15 + Math.random() * 0.15, 0.3, 0.6, 3, 0.0025, "hsl(" + Math.random() * 360 + ", 50%, 50%)"));
}
for(var i = 0; i < 2; i++) {	
	parallaxes.unshift(new parallax(c.width / 2 * i / c.height, 0.05 + Math.random() * 0.15, 0.5, 0.7, 4, 0.00125));
}

var windDir = 0;

var textureFiles = ["santa", "santa2", "santa3", "building", "mountain", "snowflake", "present", "tile", "spike", "dirt", "ground", "santa4", "santa5", "santa6", "soundOn", "soundOff"];
var textures = [];
for(var i = 0; i < textureFiles.length; i++) {
	textures.push(new Image());
	textures[textures.length - 1].src = "Textures/" + textureFiles[i] + ".png";
}

var highScore = getCookie("highScore");
if(!highScore) {
	highScore = 0;
}

var soundEnabled = getCookie("music");
if(!soundEnabled) {
	soundEnabled = true;
}

var music = new Audio("music.wav");
music.loop = true;
music.volume = 0.05;

var gravity = c.height * 0.001;
var speed = c.height * 0.0075;
var buildingTime = 0;
var mountainTime = 0;

var startScreen = true;
var paused = false;
var prevPaused = false;
var pauseTimer = 0;

var worldEnd = 0;
gen(0, 0);

var time = 0;
var presentsCollected = 0;

var fps = 60;
var loop = setInterval(update, 1000 / fps);
function update() {
	if(!paused && !startScreen) {
		time++;
		
		speed = c.height * (0.0075 + Math.atan(presentsCollected * 0.1) / (Math.PI / 2) * 0.002);
		
		windDir *= 0.9;
		windDir += (Math.random() * 0.025 - 0.0125) * 0.1;
		
		if(time > buildingTime) {
			parallaxes.push(new parallax(c.width / c.height, 0.15 + Math.random() * 0.15, 0.3, 0.6, 3, 0.0025, "hsl(" + Math.random() * 360 + ", 50%, 50%)"));
			buildingTime = time + 150 + Math.random() * 100;
		}
		
		if(time > mountainTime) {
			parallaxes.unshift(new parallax(c.width / c.height, 0.05 + Math.random() * 0.15, 0.5, 0.7, 4, 0.00125));
			mountainTime = time + 300 + Math.random() * 200;
		}
		
		if(Math.random() < 0.1) {
			particles.push(new particle(Math.random() * (c.width / c.height), 0, windDir - speed / c.height, 0.005 + Math.random() * 0.005, 5, 0));
		}
		
		if(player.x + c.width > worldEnd) {
			gen(worldEnd);
		}
		
		player.yVel += gravity;
		if(player.onGround && player.jumping) {
			player.yVel = -player.jumpStrength;
			player.onGround = false;
		}
		
		player.onGround = false;
		
		ctx.fillStyle = "rgb(150, 175, 200)";
		ctx.fillRect(0, 0, c.width, c.height);

		for(var i = 0; i < parallaxes.length; i++) {
			parallaxes[i].x -= parallaxes[i].speed;
			ctx.fillStyle = parallaxes[i].color;
			
			ctx.drawImage(textures[parallaxes[i].texture], parallaxes[i].x, parallaxes[i].y, parallaxes[i].width, parallaxes[i].height);
			if(parallaxes[i].texture == 3) {
				ctx.globalCompositeOperation = "multiply";
				ctx.fillRect(parallaxes[i].x, parallaxes[i].y, parallaxes[i].width, parallaxes[i].height);
			}
			ctx.globalCompositeOperation = "source-over";
			
			if(parallaxes[i].x + parallaxes[i].width < 0) {
				parallaxes.splice(i, 1);
				i--;
				continue;
			}
		}
		
		var player_ = shCopy(player);
		player_.y += player_.yVel;
		player_.x += c.height * 0.25 + player_.width * 0.25;
		player_.width *= 0.5;
		for(var i = 0; i < walls.length; i++) {
			if(AABB(player_, walls[i])) {
				var distX = Math.abs(walls[i].x - (player_.x + player_.width));
				var distY = Math.abs(walls[i].y - (player_.y + player_.height));
				if(distY < distX) {
					player.yVel = 0;
					player.y = walls[i].y - player.height;
					player.onGround = true;
				} else {
					player.die();
				}
			}
			var pattern = ctx.createPattern(textures[walls[i].texture], "repeat");
			ctx.fillStyle = pattern;
			ctx.save();
			ctx.translate(walls[i].x - player.x, walls[i].y);
			var s = c.height / textures[walls[i].texture].height;
			ctx.scale(s, s);
			ctx.scale(walls[i].repeatSize, walls[i].repeatSize);
			ctx.fillRect(0, 0, walls[i].width / s / walls[i].repeatSize, walls[i].height / s / walls[i].repeatSize);
			ctx.restore();
			
			if(walls[i].x + walls[i].width - player.x < 0) {
				walls.splice(i, 1);
				i--;
				continue;
			}
		}
		
		player_ = shCopy(player);
		player_.y += player_.yVel;
		player_.x += c.height * 0.25 + player_.width * 0.25;
		player_.width *= 0.5;
		for(var i = 0; i < deaths.length; i++) {
			if(AABB(player_, deaths[i])) {
				player.die();
			}
			var pattern = ctx.createPattern(textures[deaths[i].texture], "repeat");
			ctx.fillStyle = pattern;
			ctx.save();
			ctx.translate(deaths[i].x - player.x, deaths[i].y);
			var s = c.height / textures[deaths[i].texture].height;
			ctx.scale(s, s);
			ctx.scale(deaths[i].repeatSize, deaths[i].repeatSize);
			ctx.fillRect(0, 0, deaths[i].width / s / deaths[i].repeatSize, deaths[i].height / s / deaths[i].repeatSize);
			ctx.restore();
			
			if(deaths[i].x + deaths[i].width - player.x < 0) {
				deaths.splice(i, 1);
				i--;
				continue;
			}
		}
		
		for(var i = 0; i < presents.length; i++) {
			ctx.fillStyle = presents[i].color;
			ctx.globalCompositeOperation = "destination-out"; // Cut out present shape
			ctx.drawImage(textures[presents[i].texture], presents[i].x - player.x, presents[i].y, presents[i].width, presents[i].height);
			ctx.globalCompositeOperation = "destination-over"; // Place color in cut out
			ctx.fillRect(presents[i].x - player.x, presents[i].y, presents[i].width, presents[i].height);
			ctx.globalCompositeOperation = "multiply"; // Draw present and combine it with color under
			ctx.drawImage(textures[presents[i].texture], presents[i].x - player.x, presents[i].y, presents[i].width, presents[i].height);
			ctx.globalCompositeOperation = "source-over";
			
			if(AABB(player_, presents[i])) {
				for(var j = 0; j < 10; j++) {
					particles.push(new particle((presents[i].x - player.x) / c.height, (presents[i].y) / c.height, Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005, 5, 0.05));
				}
				presents.splice(i, 1);
				i--;
				presentsCollected++;
				continue;
			}
			
			if(presents[i].x + presents[i].width - player.x < 0) {
				presents.splice(i, 1);
				i--;
				continue;
			}
		}
		
		player.x += speed;
		player.y += player.yVel;
		
		if(player.onGround && player.anim != 0) {
			player.anim = 0;
			player.animFrame = 0;
			player.animTimer = 0;
		}
		
		if(player.yVel > 2.5 && !player.onGround && player.anim != 1) {
			player.anim = 1;
			player.animFrame = 0;
			player.animTimer = 0;
		}
		
		if(player.yVel < -2.5 && !player.onGround && player.anim != 2) {
			player.anim = 2;
			player.animFrame = 0;
			player.animTimer = 0;
		}
		
		if(player.yVel > -2.5 && player.yVel < 2.5 && !player.onGround && player.anim != 3) {
			player.anim = 3;
			player.animFrame = 0;
			player.animTimer = 0;
		}
		
		player.texture = player.animations[player.anim][player.animFrame];
		player.animTimer++;
		if(player.animTimer > 7.5) {
			player.animTimer = 0;
			player.animFrame++;
		}
		if(player.animFrame > player.animations[player.anim].length - 1) {
			player.animFrame = 0;
		}
		
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.drawImage(textures[player.texture], c.height * 0.25, player.y, player.width, player.height);
		
		for(var i = 0; i < particles.length; i++) {
			particles[i].update();
			ctx.globalAlpha = Math.max(particles[i].alpha, 0);
			ctx.drawImage(textures[particles[i].texture], particles[i].x, particles[i].y, particles[i].width, particles[i].height);
			ctx.globalAlpha = 1;
			
			if(particles[i].y > c.height || particles[i].alpha <= 0) {
				particles.splice(i, 1);
				i--;
				continue;
			}
			
			var particle_ = shCopy(particles[i]);
			particle_.x += player.x;
			for(var j = 0; j < walls.length; j++) {
				if(AABB(particle_, walls[j])) {
					particles.splice(i, 1);
					i--;
					break;
				}
			}
		}
		
		ctx.font = c.height * 0.05 + "px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillText(presentsCollected, c.width * 0.5, c.height * 0.1);
		
		if(presentsCollected > highScore) {
			highScore = presentsCollected;
		}
	} else {
		pauseTimer++;
			
		if(!prevPaused) {
			ctx.fillStyle = "rgb(0, 0, 0, 0.75)";
			ctx.fillRect(0, 0, c.width, c.height);
		}
		
		if(!startScreen) {
			ctx.font = c.height * 0.1 + "px Arial";
			ctx.textAlign = "center";
			ctx.fillStyle = "rgb(255, 255, 255)";
			ctx.fillText("Score: " + presentsCollected, c.width * 0.5, c.height * 0.25);
			ctx.fillText("Highscore: " + highScore, c.width * 0.5, c.height * 0.35);
			
			ctx.font = c.height * 0.025 + "px Arial";
			ctx.fillText("Press any key to continue", c.width * 0.5, c.height * 0.55);
		} else {
			ctx.textAlign = "center";
			ctx.fillStyle = "rgb(255, 255, 255)";
			ctx.font = c.height * 0.1 + "px Arial";
			ctx.fillText("Press any key to start", c.width * 0.5, c.height * 0.25);
		}
		
		prevPaused = paused;
	}
	
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(c.width - 0.1 * c.height, 0.05 * c.height, 0.05 * c.height, 0.05 * c.height);
	if(soundEnabled) {
		ctx.drawImage(textures[14], c.width - 0.1 * c.height, 0.05 * c.height, 0.05 * c.height, 0.05 * c.height);
	} else {
		ctx.drawImage(textures[15], c.width - 0.1 * c.height, 0.05 * c.height, 0.05 * c.height, 0.05 * c.height);
	}
}

function gen(offset, x) {
	var index = Math.round(Math.random() * (prefabs.length - 2) + 1);
	if(x != undefined) {
		index = x;
	}
	for(var i = 0; i < prefabs[index].walls.length; i++) {
		walls.push(shCopy(prefabs[index].walls[i]));

		walls[walls.length - 1].x += offset;
		
		if(walls[walls.length - 1].x + walls[walls.length - 1].width > worldEnd) {
			worldEnd = walls[walls.length - 1].x + walls[walls.length - 1].width;
		}
	}
	for(var i = 0; i < prefabs[index].deaths.length; i++) {
		deaths.push(shCopy(prefabs[index].deaths[i]));

		deaths[deaths.length - 1].x += offset;
		
		if(deaths[deaths.length - 1].x + deaths[deaths.length - 1].width > worldEnd) {
			worldEnd = deaths[deaths.length - 1].x + deaths[deaths.length - 1].width;
		}
	}
	for(var i = 0; i < prefabs[index].presents.length; i++) {
		presents.push(shCopy(prefabs[index].presents[i]));
		
		presents[presents.length - 1].x += offset;
		presents[presents.length - 1].color = "hsl(" + 360 * Math.random() + ", 100%, 75%)";
		
		if(presents[presents.length - 1].x + presents[presents.length - 1].width > worldEnd) {
			worldEnd = presents[presents.length - 1].x + presents[presents.length - 1].width;
		}
	}
}

function getCookie(c) {
	var cookies = document.cookie.split(";");
	for(var i = 0; i < cookies.length; i++) {
		if(cookies[i].indexOf(c) != -1) {
			if(cookies[i].substr(cookies[i].indexOf("=") + 1) == "undefined") {
				return undefined;
			}
			return JSON.parse(cookies[i].substr(cookies[i].indexOf("=") + 1));
		}
	}
}

function setCookie(c, v) {
	document.cookie = (c + "=" + v);
}

function AABB(a, b) {
	if(a.x + a.width > b.x &&
		a.y + a.height > b.y &&
		a.x < b.x + b.width &&
		a.y < b.y + b.height) {
			
		return true;
	} else {
		return false;
	}
}

function shCopy(obj) {
	return Object.assign({}, obj);
}

function prefab() {
	this.walls = [];
	this.presents = [];
	this.deaths = [];
}

function wall(x, y, width, height, texture, repeatSize) {
	this.x = x * c.height;
	this.y = y * c.height;
	this.width = width * c.height;
	this.height = height * c.height;
	this.texture = texture;
	this.repeatSize = repeatSize;
}

function present(x, y, color) {
	this.x = x * c.height;
	this.y = y * c.height;
	this.width = c.height * 0.05;
	this.height = c.height * 0.05;
	this.texture = 6;
	this.color = color;
}

function parallax(x, y, width, height, texture, speed, color) {
	this.x = x * c.height;
	this.y = y * c.height;
	this.width = c.height * width;
	this.height = c.height * height;
	this.texture = texture;
	this.speed = speed * c.height;
	this.color = color;
}

function particle(x, y, xSpeed, ySpeed, texture, fadeSpeed) {
	this.x = x * c.height;
	this.y = y * c.height;
	this.width = c.height * 0.015;
	this.height = c.height * 0.015;
	this.texture = texture;
	this.xSpeed = xSpeed * c.height;
	this.ySpeed = ySpeed * c.height;
	this.fadeSpeed = fadeSpeed;
	this.alpha = 1;
	this.update = function() {
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		this.alpha -= this.fadeSpeed;
	}
}

window.onmousedown = function(e) {
	var a = {x: e.clientX, y: e.clientY, width: 0, height: 0};
	var b = {x: c.width - 0.1 * c.height, y: 0.05 * c.height, width: 0.05 * c.height, height: 0.05 * c.height};
	if(AABB(a, b)) {
		soundEnabled = !soundEnabled;
		if(!soundEnabled) {
			music.pause();
		} else {
			music.currentTime = 0;
			music.play();
		}
	}
}

window.onkeydown = function(e) {
	if(pauseTimer > 30) {
		player.reset();
	}
	if(startScreen) {
		startScreen = false;
		music.play();
	}
	switch(e.keyCode) {
	case 87:
	case 32:
	case 38:
		player.jumping = true;
		break;
	}
}

window.onkeyup = function(e) {
	switch(e.keyCode) {
	case 87:
	case 32:
	case 38:
		player.jumping = false;
		break;
	}
}

window.onbeforeunload = function() {
	setCookie("highScore", highScore);
	setCookie("music", soundEnabled);
}