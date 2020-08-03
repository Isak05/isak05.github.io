var c = document.createElement("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
var ctx = c.getContext("2d");

document.getElementById("load").onclick = function() {
	loadRom(document.getElementById("roms").value);
};

ctx.fillStyle = "rgb(0, 0, 0)";
ctx.fillRect(0, 0, pixelSize * 64, pixelSize * 32);

var chars = JSON.parse('["€","","‚","ƒ","„","…","†","‡","ˆ","‰","Š","‹","Œ","","Ž","","","‘","’","“","”","•","–","—","˜","™","š","›","œ","","ž","Ÿ"]');
var specialChars = new Map();
for(var i = 0; i < chars.length; i++) {
	specialChars.set(chars[i], i + 128);
}
var files;
getFile("roms.txt").then((value) => {
	files = value.split("\n");
	files.pop();
	
	var s = document.getElementById("roms");
	for(var i = 0; i < files.length; i++) {
		var start = files[i].lastIndexOf("/") + 1;
		var end = files[i].lastIndexOf(".ch8");
		var name = files[i].substr(start, end - start);
		s.innerHTML += '<option value="' + files[i] + '">' + name + '</option>';
	}
	
	loadRom(files[0]);
});

var pixelSize = 1 / 64 * c.width;
if(pixelSize * 32 > c.height * 0.75) {
	pixelSize = 1 / 32 * c.height * 0.75;
}
var running = false;
var hz = 0;
var memory = new Uint8Array(0x1000);
var V = new Uint8Array(0x10); // Registers
var I = 0; // Memory addresses
var DT = 0; // Delay timer
var ST = 0; // Sound timer
var PC = 0x200; // Program counter
var SP = 0; // Stack pointer
var stack = new Uint16Array(0x10);
var screen = [];
for(var i = 0; i < 64; i++) {
	screen.push([]);
	for(var j = 0; j < 32; j++) {
		screen[i].push(false);
	}
}

var font = [
	0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
	0x20, 0x60, 0x20, 0x20, 0x70, // 1
	0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
	0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
	0x90, 0x90, 0xF0, 0x10, 0x10, // 4
	0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
	0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
	0xF0, 0x10, 0x20, 0x40, 0x40, // 7
	0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
	0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
	0xF0, 0x90, 0xF0, 0x90, 0x90, // A
	0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
	0xF0, 0x80, 0x80, 0x80, 0xF0, // C
	0xE0, 0x90, 0x90, 0x90, 0xE0, // D
	0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
	0xF0, 0x80, 0xF0, 0x80, 0x80  // F
];
for(var i = 0; i < font.length; i++) {
	memory[i] = font[i];
}

var keyMap = ['x', '1', '2', '3', 'q', 'w', 'e', 'a', 's', 'd', 'z', 'c', '4', 'r', 'f', 'v'];
var keys = [];
for(var i = 0; i < 16; i++) {
	keys.push(false);
}

var prevTime = Date.now();

var fps = 60;
var loop = setInterval(update, 1000 / fps);
function update() {
	var now = Date.now();
	
	var speed = document.getElementById("speed").value;
	hz = parseInt(speed);
	document.getElementById("speed-text").innerHTML = speed + " Hz";
	
	for(var k = 0; k < (now - prevTime) / (1000 / 60); k++) {
		if(DT > 0) {
			DT--;
		}
		if(ST > 0) {
			ST--;
		}
	}

	for(var k = 0; k < (now - prevTime) / (1000 / hz); k++) {
		if(running) {
			var opcode = memory[PC + 1] | (memory[PC] << 8);
			//console.log("op:" + ((memory[PC] & 0xF0) >> 4), "x:" + (memory[PC] & 0xF), "y:" + ((memory[PC + 1] & 0xF0) >> 4), "kk:" + memory[PC + 1], "nnn:" + (((memory[PC] << 8) | memory[PC + 1]) & 0x0FFF), "n:" + (memory[PC + 1] & 0xF));
			switch(opcode & 0xF000) {
			case 0x0000:
				switch((opcode & 0x00FF)) {
				case 0x00E0:
					for(var i = 0; i < screen.length; i++) {
						for(var j = 0; j < screen[i].length; j++) {
							screen[i][j] = false;
						}
					}
					ctx.fillStyle = "rgb(0, 0, 0)";
					ctx.fillRect(0, 0, pixelSize * 64, pixelSize * 32);
					break;
					
				case 0x00EE:
					PC = stack[SP];
					stack[SP] = 0;
					SP--;
					break;
				}
				break;
				
			case 0x1000:
				PC = (opcode & 0x0FFF) - 2;
				break;
				
			case 0x2000:
				SP++;
				stack[SP] = PC;
				PC = (opcode & 0x0FFF) - 2;
				break;
				
			case 0x3000:
				if(V[(opcode & 0x0F00) >> 8] == (opcode & 0x00FF)) {
					PC += 2;
				}
				break;
				
			case 0x4000:
				if(V[(opcode & 0x0F00) >> 8] != (opcode & 0x00FF)) {
					PC += 2;
				}
				break;
				
			case 0x5000:
				if(V[(opcode & 0x0F00) >> 8] == V[(opcode & 0x00F0) >> 4]) {
					PC += 2;
				}
				break;
				
			case 0x6000:
				V[(opcode & 0x0F00) >> 8] = (opcode & 0x00FF);
				break;
				
			case 0x7000:
				V[(opcode & 0x0F00) >> 8] += (opcode & 0x00FF);
				break;
				
			case 0x8000:
				switch(opcode & 0x000F) {
				case 0x0000:
					V[(opcode & 0x0F00) >> 8] = V[(opcode & 0x00F0) >> 4];
					break;
					
				case 0x0001:
					V[(opcode & 0x0F00) >> 8] |= V[(opcode & 0x00F0) >> 4];
					break;
					
				case 0x0002:
					V[(opcode & 0x0F00) >> 8] &= V[(opcode & 0x00F0) >> 4];
					break;
					
				case 0x0003:
					V[(opcode & 0x0F00) >> 8] ^= V[(opcode & 0x00F0) >> 4];
					break;
					
				case 0x0004:
					V[0xF] = V[(opcode & 0x0F00) >> 8] + V[(opcode & 0x00F0) >> 4] > 255;
					V[(opcode & 0x0F00) >> 8] += V[(opcode & 0x00F0) >> 4];
					break;
					
				case 0x0005:
					V[0xF] = V[(opcode & 0x0F00) >> 8] > V[(opcode & 0x00F0) >> 4];
					V[(opcode & 0x0F00) >> 8] -= V[(opcode & 0x00F0) >> 4];
					break;
					
				case 0x0006:
					V[0xF] = V[(opcode & 0x0F00) >> 8] & 0x1;
					V[(opcode & 0x0F00) >> 8] /= 2;
					break;
					
				case 0x0007:
					V[0xF] = V[(opcode & 0x0F00) >> 8] < V[(opcode & 0x00F0) >> 4];
					V[(opcode & 0x0F00) >> 8] = V[(opcode & 0x00F0) >> 4] - V[(opcode & 0x0F00) >> 8];
					break;
					
				case 0x000E:
					V[0xF] = V[(opcode & 0x0F00) >> 8] >> 7;
					V[(opcode & 0x0F00) >> 8] *= 2;
					break;
				}
				break;
				
			case 0x9000:
				if(V[(opcode & 0x0F00) >> 8] != V[(opcode & 0x00F0) >> 4]) {
					PC += 2;
				}
				break;
				
			case 0xA000:
				I = (opcode & 0x0FFF);
				break;
				
			case 0xB000:
				PC = ((opcode & 0x0FFF)) + V[0];
				break;
				
			case 0xC000:
				V[(opcode & 0x0F00) >> 8] = Math.floor(Math.random() * 256) & ((opcode & 0x00FF));
				break;
				
			case 0xD000:
				V[0xF] = 0;
				var x = V[(opcode & 0x0F00) >> 8];
				var y = V[(opcode & 0x00F0) >> 4];
				for(var i = 0; i < 8; i++) {
					for(var j = 0; j < (opcode & 0x000F); j++) {
						var screenX = x + i;
						while(screenX < 0) 
							screenX += 64;
						screenX = screenX % 64;
						
						var screenY = y + j;
						while(screenY < 0) 
							screenY += 32;
						screenY = screenY % 32;

						var pixel = Math.min(1, memory[I + j] & (2 ** (7 - i)));
						if(screen[screenX][screenY] && pixel) {
							V[0xF] = 1;
						}
						
						screen[screenX][screenY] ^= pixel;
						
						if(screen[screenX][screenY]) {
							ctx.fillStyle = "rgb(255, 255, 255)";
						} else {
							ctx.fillStyle = "rgb(0, 0, 0)";
						}
						ctx.strokeStyle = "rgb(0, 0, 0)";
						ctx.lineWidth = 1;
						
						ctx.beginPath()
						ctx.rect(screenX * pixelSize, screenY * pixelSize, pixelSize, pixelSize);
						ctx.closePath();
						ctx.fill();
						ctx.stroke();
					}
				}
				break;
				
			case 0xE000:
				switch((opcode & 0x00FF)) {
				case 0x009E:
					if(keys[V[(opcode & 0x0F00) >> 8]]) {
						PC += 2;
					}
					break;
					
				case 0x00A1:
					if(!keys[V[(opcode & 0x0F00) >> 8]]) {
						PC += 2;
					}
					break;
				}
				break;
				
			case 0xF000:
				switch((opcode & 0x00FF)) {
				case 0x0007:
					V[(opcode & 0x0F00) >> 8] = DT;
					break;
					
				case 0x000A:
					var keyPressed = false;
					for(var i = 0; i < keys.length; i++) {
						if(keys[i]) {
							V[(opcode & 0x0F00) >> 8] = i;
							keys[i] = false;
							keyPressed = true;
							break;
						}
					}
					if(!keyPressed) {
						PC -= 2;
					}
					break;
					
				case 0x0015:
					DT = V[(opcode & 0x0F00) >> 8];
					break;
					
				case 0x0018:
					ST = V[(opcode & 0x0F00) >> 8];
					break;
					
				case 0x001E:
					I += V[(opcode & 0x0F00) >> 8];
					break;
					
				case 0x0029:
					I = V[(opcode & 0x0F00) >> 8] * 5;
					break;
					
				case 0x0033:
					memory[I] = Math.floor(V[(opcode & 0x0F00) >> 8] / 100);
					memory[I + 1] = Math.floor((V[(opcode & 0x0F00) >> 8] - memory[I] * 100) / 10);
					memory[I + 2] = Math.floor((V[(opcode & 0x0F00) >> 8] - memory[I] * 100 - memory[I + 1] * 10) / 1);
					break;
					
				case 0x0055:
					for(var i = 0; i <= ((opcode & 0x0F00) >> 8); i++) {
						memory[I + i] = V[i];
					}
					break;
					
				case 0x0065:
					for(var i = 0; i <= ((opcode & 0x0F00) >> 8); i++) {
						V[i] = memory[I + i];
					}
					break;
				}
				break;
			}
			
			PC += 2;
		}
	}
	
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(0, pixelSize * 32, c.width, c.height - pixelSize * 32);
	ctx.fillRect(pixelSize * 64, 0, c.width - pixelSize * 64, c.height);
	
	prevTime = now;
}

function loadRom(file) {
	running = false;

	keys.fill(false, 0, -1);
	memory.fill(0, 0, -1);
	V.fill(0, 0, -1); // Registers
	stack.fill(0, 0, -1);
	I = 0; // Memory addresses
	DT = 0; // Delay timer
	ST = 0; // Sound timer
	PC = 0x200; // Program counter
	SP = 0; // Stack pointer
	
	for(var i = 0; i < font.length; i++) {
		memory[i] = font[i];
	}
	
	for(var i = 0; i < screen.length; i++) {
		for(var j = 0; j < screen[i].length; j++) {
			screen[i][j] = false;
		}
	}
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, pixelSize * 64, pixelSize * 32);
	
	getFile(file).then((value) => {
		for(var i = 0; i < value.length; i++) {
			if(specialChars.has(value[i])) {
				memory[0x200 + i] = specialChars.get(value[i]);
			} else {
				memory[0x200 + i] = value.charCodeAt(i);
			}
		}
		running = true;
	});
}

function getFile(file) {
	return new Promise(function(resolve, reject) {
		var req = new XMLHttpRequest();
		req.open("GET", file, true);
		req.overrideMimeType('application/octet-stream; charset=iso-8859-1');
		req.onload = function() {
			resolve(req.responseText);
		}
		req.send();
	});
}

window.onkeydown = function(e) {
	for(var i = 0; i < keyMap.length; i++) {
		if(e.key == keyMap[i]) {
			keys[i] = true;
		}
	}
}

window.onkeyup = function(e) {
	for(var i = 0; i < keyMap.length; i++) {
		if(e.key == keyMap[i]) {
			keys[i] = false;
		}
	}
}

window.onresize = function() {
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	
	pixelSize = 1 / 64 * c.width;
	if(pixelSize * 32 > c.height * 0.75) {
		pixelSize = 1 / 32 * c.height * 0.75;
	}
	
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, pixelSize * 64, pixelSize * 32);
	
	for(var i = 0; i < screen.length; i++) {
		for(var j = 0; j < screen[i].length; j++) {
			if(screen[i][j]) {
				ctx.fillStyle = "rgb(255, 255, 255)";
			} else {
				ctx.fillStyle = "rgb(0, 0, 0)";
			}
			ctx.strokeStyle = "rgb(0, 0, 0)";
			ctx.lineWidth = 1;
				
			ctx.beginPath()
			ctx.rect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}
	}
}