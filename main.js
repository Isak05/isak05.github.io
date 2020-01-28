var c = document.getElementById("c");
c.width = window.innerWidth;
c.height = window.innerHeight;
var ctx = c.getContext("2d");

ctx.fillStyle = "rgb(0, 0, 0)";
ctx.fillRect(0, 0, c.width, c.height);

var size = 7;
var aspect = c.width / c.height;
var particles = [];
var w = 50;
var h = Math.round(w / aspect);
for(var i = 0; i < w; i++) {
	for(var j = 0; j < h; j++) {
		particles.push(new particle(i * aspect / w, j / h));
	}
}

var fps = 15;
var loop = setInterval(update, 1000 / fps);
function update() {
	for(var i = 0; i < particles.length; i++) {
		particles[i].update();
	}
}

function particle(x, y) {
	this.x = x;
	this.y = y;
	this.speed = 0.01;
	this.life = 0;
	this.update = function() {
		this.life++;
		ctx.beginPath();
		ctx.moveTo(this.x * c.height, this.y * c.height);
		this.x += (noise2d(this.x * size, this.y * size) - 0.5) * this.speed;
		this.y += (noise2d(this.x * size, this.y * size + 10000) - 0.5) * this.speed;
		ctx.lineTo(this.x * c.height, this.y * c.height);
		ctx.closePath();
		var opacity = Math.min(0.05, this.life / 60 * 0.05);
		ctx.strokeStyle = "rgb(255, 255, 255, " + opacity + ")";
		ctx.stroke();
	}
}

function rand(x) {
	return (Math.abs(x) * 3.834525 * Math.abs(x + 2.1267) * 7.2168745 * Math.abs(x + 0.734) + 25.273783) % 1;
}

function rand2(x, y) {
	return rand(rand(x) + y);
}

function fract(x) {
	return x - Math.floor(x);
}

function lerp(a, b, i) {
	return a * (1 - i) + b * i;
}

function ease(x) {
	return Math.cos(x * Math.PI + Math.PI) / 2 + 0.5;
}

function noise2d(x, y) {
	var u = lerp(rand2(Math.floor(x), Math.floor(y)), rand2(Math.floor(x) + 1, Math.floor(y)), ease(fract(x)));
	var v = lerp(rand2(Math.floor(x), Math.floor(y) + 1), rand2(Math.floor(x) + 1, Math.floor(y) + 1), ease(fract(x)));
	var res = lerp(u, v, ease(fract(y)));
	return res;
}
