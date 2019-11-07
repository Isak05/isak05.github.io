var c = document.getElementById("c");
c.width = screen.width;
c.height = screen.height;
var ctx = c.getContext("2d");

function vec2(x, y) {
	this.x = x;
	this.y = y;
}

function node() {
	this.open = true;
	this.parent = new vec2(-1, -1);
	this.g = -1;
	this.h = -1;
	this.f = -1;
	this.col = -1;
}

grid = [];
var width = 50;
var height = 50;

for(var i = 0; i < width; i++) {
	grid.push([]);
	for(var j = 0; j < height; j++) {
		grid[i].push(new node());
		grid[i][j].col = 0;
		if(i == width - 1 || i == 0 || j == height - 1 || j == 0) {
			grid[i][j].col = 1;
		}
		if(Math.random() > 1) {
			grid[i][j].col = 1;
		}
	}
}

var openList = [];
var start = new vec2(1, 1);
var end = new vec2(48, 48);
var current = start;
openList.push(start);
var finish = false;

grid[start.x][start.y].col = 2;
grid[end.x][end.y].col = 3;

for(var i = 0; i < 15; i++) {
	for(var j = 0; j < 48; j++) {
		if(Math.random() < 0.9) {
			grid[i * 3 + 3][j + 1].col = 1;
		} else {
			grid[i * 3 + 3][j + 1].col = 0;
		}
	}
}

update();

//var interval = setInterval(update, 1000 / 100);

function update() {
	var s = new Date().getTime();
	while(!finish) {
	for(var i = 0; i < 3; i++) {
		for(var j = 0; j < 3; j++) {
			if(i != 1 || j != 1) {
				if(grid[current.x + i - 1][current.y + j - 1].col == 3) {
					//clearInterval(interval);
					var x = current.x;
					var y = current.y;
					while(!finish) {
						grid[x][y].col = 5;
						var tempX = grid[x][y].parent.x;
						y = grid[x][y].parent.y;
						x = tempX;
						if(start.x == x && start.y == y) {
							finish = true;
						}
					}
				}
				if((grid[current.x + i - 1][current.y + j - 1].col == 0 || grid[current.x + i - 1][current.y + j - 1].col == 4) && 
					grid[current.x + i - 1][current.y + j - 1].open == true) {
					if(grid[current.x + i - 1][current.y].col != 1 && 
						grid[current.x][current.y + j - 1].col != 1) {
						if(grid[current.x + i - 1][current.y + j - 1].col == 0) {
							openList.push(new vec2(current.x + i - 1, current.y + j - 1));
						}
						grid[current.x + i - 1][current.y + j - 1].col = 4;
						var g = grid[current.x][current.y].g + Math.sqrt(Math.abs(i - 1) + Math.abs(j - 1));
						
						var h = 
							Math.sqrt(
								Math.pow(Math.abs(current.x + i - 1 - end.x), 2) + 
								Math.pow(Math.abs(current.y + j - 1 - end.y), 2)
							);
						
						var f = g + h;
						if(grid[current.x + i - 1][current.y + j - 1].f == -1 || grid[current.x + i - 1][current.y + j - 1].f > f) {
							grid[current.x + i - 1][current.y + j - 1].g = g;
							grid[current.x + i - 1][current.y + j - 1].h = h;
							grid[current.x + i - 1][current.y + j - 1].f = f;
							grid[current.x + i - 1][current.y + j - 1].parent = new vec2(current.x, current.y);
						}
					}
				}
			}
		}
	}

	var lowVal = -1;
	var lowPos = vec2(-1, -1);
	var lowId = -1;
	for(var i = 0; i < openList.length; i++) {
		if((lowVal > grid[openList[i].x][openList[i].y].f || lowVal == -1) && 
			grid[openList[i].x][openList[i].y].f != -1) {
			lowVal = grid[openList[i].x][openList[i].y].f;
			lowPos = openList[i];
			lowId = i;
		}
	}
	openList.splice(lowId, 1);
	current = lowPos;
	grid[current.x][current.y].open = false;
	}
	
	console.log(new Date().getTime() - s + " ms");

	for(var i = 0; i < grid.length; i++) {
		for(var j = 0; j < grid[i].length; j++) {
			if(grid[i][j].col == 0) {
				ctx.fillStyle = "#303030";
				ctx.fillRect(i * 500 / width, j * 500 / height, 500 / width, 500 / height);
			}
			if(grid[i][j].col == 1) {
				ctx.fillStyle = "#101010";
				ctx.fillRect(i * 500 / width, j * 500 / height, 500 / width, 500 / height);
			}
			if(grid[i][j].col == 2) {
				ctx.fillStyle = "#00FF00";
				ctx.fillRect(i * 500 / width, j * 500 / height, 500 / width, 500 / height);
			}
			if(grid[i][j].col == 3) {
				ctx.fillStyle = "#FF0000";
				ctx.fillRect(i * 500 / width, j * 500 / height, 500 / width, 500 / height);
			}
			if(grid[i][j].col == 4) {
				if(grid[i][j].open == true) {
					ctx.fillStyle = "#505050";
				} else {
					ctx.fillStyle = "#A0A0A0";
				}
				ctx.fillRect(i * 500 / width, j * 500 / height, 500 / width, 500 / height);
			}
			if(grid[i][j].col == 5) {
				ctx.fillStyle = "#0000FF";
				ctx.fillRect(i * 500 / width, j * 500 / height, 500 / width, 500 / height);
			}
		}
	}
	
	for(var i = 0; i < grid.length; i++) {
		for(var j = 0; j < grid[i].length; j++) {
			if((grid[i][j].col == 4 || grid[i][j].col == 5) && grid[i][j].open == false) {
				ctx.strokeStyle = "#FF00FF";
				ctx.beginPath();
				ctx.moveTo(i * 500 / width + 500 / (width * 2), j * 500 / height + 500 / (height * 2));
				ctx.lineTo(grid[i][j].parent.x * 500 / width + 500 / (width * 2), grid[i][j].parent.y * 500 / height + 500 / (height * 2));
				ctx.stroke();
			}
		}
	}
}