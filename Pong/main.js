var c = document.getElementById("c");
c.width = window.innerWidth;
c.height = window.innerHeight;
var ctx = c.getContext("2d");

var ball = {x: 300, y: 500, xVel: 7.5, yVel: -10, r: 10, c: 0};
var tileSize = 50;
var tiles = [];
for(var i = 0; i < 25; i++) {
	tiles.push([]);
	for(var j = 0; j < 25; j++) {
		tiles[i].push(true);
	}
}

var fps = 60;
var loop = setInterval(update, 1000 / fps);
function update() {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, c.width, c.height);

	for(var i = 0; i < tiles.length; i++) {
		for(var j = 0; j < tiles[i].length; j++) {
			if(tiles[i][j]) {
				var x = i * tileSize + 1 + 300;
				var y = j * tileSize / 2 + 1 + 200;
				if(j > 2) {
					y += 250;
				}
				var w = tileSize - 2;
				var h = tileSize / 2 - 2;
				if(ball.x + ball.r + ball.xVel > x && 
				ball.x - ball.r + ball.xVel < x + w && 
				ball.y + ball.r > y && 
				ball.y - ball.r < y + h) {
					ball.xVel *= -1;
					tiles[i][j] = false;
					ball.c = ((i + j) * 15) + 180;
				}
				if(ball.x + ball.r > x && 
				ball.x - ball.r < x + w && 
				ball.y + ball.r + ball.yVel > y && 
				ball.y - ball.r + ball.yVel < y + h) {
					ball.yVel *= -1;
					tiles[i][j] = false;
					ball.c = ((i + j) * 15) + 180;
				}
				if(tiles[i][j]) {
					ctx.fillStyle = "hsl(" + ((i + j) * 15) + ", 100%, 50%)";
					ctx.fillRect(x, y, w, h);
				}
			}
		}
	}
	
	if(ball.y + ball.r > c.height || ball.y - ball.r < 0) {
		ball.yVel *= -1;
	}
	if(ball.x + ball.r > c.width || ball.x - ball.r < 0) {
		ball.xVel *= -1;
	}
	
	ball.x += ball.xVel;
	ball.y += ball.yVel;
	
	ctx.beginPath();
	ctx.ellipse(ball.x, ball.y, ball.r, ball.r, 0, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fillStyle = "hsl(" + ball.c + ", 100%, 50%)";
	ctx.fill();
}