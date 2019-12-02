var gameLoop;

function stopSpaceinvaders() {
  while(document.getElementsByClassName("block")[0]) {
    document.getElementById("offset").removeChild(document.getElementsByClassName("block")[0]);
  } 
  clearInterval(gameLoop);
  
  for(var i = 0; i < document.getElementsByClassName("games").length; i++) {
    document.getElementsByClassName("games")[i].style.display = "block";
  }
}


function startSpaceinvaders() {
  for(var i = 0; i < document.getElementsByClassName("games").length; i++) {
    document.getElementsByClassName("games")[i].style.display = "none";
  }
  var enemies = [];
  var tiles = [];
  var grid = [];
  for(var i = 0; i < 15; i++) {
    grid.push([]);
    for(var j = 0; j < 57; j++) {
      grid[i].push("&nbsp");
    }
  }
  
  for(var i = 0; i < 15; i++) {
    tiles.push([]);
    for(var j = 0; j < 57; j++) {
      tiles[i].push(0);
    }
  }
  
  for(var i = 0; i < 4; i++) {
    var xOff = i * 12 + 10;
    var yOff = 11;
    tiles[yOff][xOff + 1] = 2;
    tiles[yOff][xOff - 1] = 2;
    tiles[yOff - 1][xOff] = 2;
    tiles[yOff - 1][xOff + 1] = 2;
    tiles[yOff - 1][xOff - 1] = 2;
    tiles[yOff - 2][xOff] = 2;
  }
  
  for(var i = 0; i < 10; i++) {
    for(var j = 0; j < 4; j++) {
      enemies.push(new enemy(i * 5 + 5, j * 2));
    }
  }
  
  var lines = [];
    for(var i = 0; i < 15; i++) {
      lines.push(document.createElement("p"));
      lines[i].className = "block";
      lines[i] = document.getElementById("offset").appendChild(lines[i]);
    }
    
  var player = {
    x: 29,
    xVel: 0,
    speed: 0.5,
    shoot: false,
    shootTimer: 0,
    dead: false
  };
  
  function missile(x, y, yVel) {
     this.x = x;
     this.y = y;
     this.yVel = yVel;
  }
  
  function enemy(x, y) {
    this.x = x;
    this.y = y;
  }
  
  var missiles = [];
  var timer = 0;
  var deadTimer = 0;

  gameLoop = setInterval(update, 1000 / 60);
  
  function update() {
    if(!player.dead) {
      timer++;
      for(var i = 0; i < 15; i++) {
        for(var j = 0; j < 57; j++) {
          grid[i][j] = "&nbsp";
        }
      }
      for(var i = 0; i < 15; i++) {
        for(var j = 0; j < 57; j++) {
          if(tiles[i][j] == 2) {
            grid[i][j] = "#";
          }
          if(tiles[i][j] == 1) {
            grid[i][j] = "*";
          }
        }
      }
      if(player.xVel < 0 && player.x > 2 || 
        player.xVel > 0 && player.x < 55) {
        player.x += player.xVel;
      } 
      
      if(player.shoot == true && player.shootTimer >= 60 * 0.25) {
        player.shootTimer = 0;
        missiles.push(new missile(player.x, 13, -0.5));
      }
      
      player.shootTimer++;
      
      for(var i = 0; i < missiles.length; i++) {
        if(missiles[i].x + 1 >= Math.round(player.x) && missiles[i].x - 1 <= Math.round(player.x) && missiles[i].y > 14) {
          missiles.splice(i, 1);
          player.dead = true;
          continue;
        }
        if(missiles[i].y > 14 || missiles[i].y < 0) {
          missiles.splice(i, 1);
          continue;
        } else {
          grid[Math.round(missiles[i].y)][Math.round(missiles[i].x)] = "|";
        }
        if(tiles[Math.round(missiles[i].y)][Math.round(missiles[i].x)] > 0) {
          tiles[Math.round(missiles[i].y)][Math.round(missiles[i].x)]--;
          missiles.splice(i, 1);
          continue;
        }
        missiles[i].y += missiles[i].yVel;
      }
      
      for(var i = 0; i < enemies.length; i++) {
        enemies[i].x += Math.cos(timer / 100) / 50;
      }
      
      for(var i = 0; i < enemies.length; i++) {
        if(Math.random() < 0.01) {
          var shoot = true;
          for(var j = 0; j < enemies.length; j++) {
            if(Math.round(enemies[i].x) == Math.round(enemies[j].x) && Math.round(enemies[j].y) > Math.round(enemies[i].y)) {
              shoot = false;
            }
          }
          if(shoot) {
            missiles.push(new missile(Math.round(enemies[i].x), Math.round(enemies[i].y) + 1, 0.25));
          }
        }
        for(var j = 0; j < missiles.length; j++) {
          if(Math.round(enemies[i].x) - 1 <= Math.round(missiles[j].x) && Math.round(enemies[i].x) + 1 >= Math.round(missiles[j].x) && Math.round(enemies[i].y) == Math.round(missiles[j].y)) {
            missiles.splice(j, 1);
            enemies.splice(i, 1);
          }
        }
        grid[Math.round(enemies[i].y)][Math.round(enemies[i].x) - 1] = "\\";
        grid[Math.round(enemies[i].y)][Math.round(enemies[i].x)] = "_";
        grid[Math.round(enemies[i].y)][Math.round(enemies[i].x) + 1] = "/";
      }
      
      grid[14][Math.round(player.x) - 1] = "/";
      grid[14][Math.round(player.x) + 1] = "\\";

      for(var i = 0; i < 15; i++) {
        lines[i].innerHTML = "";
        for(var j = 0; j < 57; j++) {
          lines[i].innerHTML += grid[i][j];
        }
      }
    } else {
      deadTimer++;
      if(deadTimer > 60 * 1) {
        deadTimer = 0;
        stopSpaceinvaders();
        startSpaceinvaders();
      }
      for(var i = 0; i < 15; i++) {
        for(var j = 0; j < 57; j++) {
          grid[i][j] = "&nbsp";
        }
      }
      grid[1][5] = "/";
      grid[2][5] = "|";
      grid[3][5] = "|";
      grid[4][5] = "\\";
      grid[0][6] = "_";
      grid[0][7] = "-";
      grid[0][8] = "-";
      grid[0][9] = "-";
      grid[0][10] = "_";
      grid[5][6] = "-";
      grid[5][7] = "_";
      grid[5][8] = "_";
      grid[5][9] = "_";
      grid[5][10] = "-";
      grid[4][11] = "|";
      grid[3][10] = "_";
      grid[3][9] = "_";
      
      grid[5][15] = "/";
      grid[4][16] = "|";
      grid[3][17] = "/";
      grid[2][18] = "|";
      grid[1][19] = "/";
      grid[0][20] = "/";
      grid[0][21] = "\\";
      grid[1][22] = "\\";
      grid[2][23] = "|";
      grid[3][24] = "\\";
      grid[4][25] = "|";
      grid[5][26] = "\\";
      grid[3][18] = "=";
      grid[3][19] = "=";
      grid[3][20] = "=";
      grid[3][21] = "=";
      grid[3][22] = "=";
      grid[3][23] = "=";
      
      grid[5][29] = "/";
      grid[4][29] = "|";
      grid[3][30] = "/";
      grid[2][30] = "|";
      grid[1][31] = "/";
      grid[0][32] = "/";
      grid[0][33] = "\\";
      grid[1][34] = "\\";
      grid[2][34] = "|";
      grid[3][35] = "\\";
      grid[3][36] = "/";
      grid[2][37] = "|";
      grid[1][37] = "/";
      grid[0][38] = "/";
      grid[0][39] = "\\";
      grid[1][40] = "\\";
      grid[2][41] = "|";
      grid[3][41] = "\\";
      grid[4][42] = "|";
      grid[5][42] = "\\";
      
      grid[5][45] = "|";
      grid[4][45] = "|";
      grid[3][45] = "|";
      grid[2][45] = "|";
      grid[1][45] = "|";
      grid[0][45] = "|";
      grid[0][46] = "=";
      grid[0][47] = "=";
      grid[0][48] = "=";
      grid[0][49] = "=";
      grid[0][50] = "=";
      grid[0][51] = "=";
      grid[0][52] = "=";
      grid[2][46] = "=";
      grid[2][47] = "=";
      grid[2][48] = "=";
      grid[2][49] = "=";
      grid[2][50] = "=";
      grid[2][51] = "=";
      grid[2][52] = "=";
      grid[5][46] = "=";
      grid[5][47] = "=";
      grid[5][48] = "=";
      grid[5][49] = "=";
      grid[5][50] = "=";
      grid[5][51] = "=";
      grid[5][52] = "=";
      
      grid[7][6] = "/";
      grid[8][5] = "|";
      grid[9][5] = "|";
      grid[10][5] = "|";
      grid[11][6] = "\\";
      grid[6][8] = "_";
      grid[6][9] = "_";
      grid[6][10] = "_";
      grid[6][11] = "_";
      grid[7][13] = "\\";
      grid[8][14] = "|";
      grid[9][14] = "|";
      grid[10][14] = "|";
      grid[11][13] = "/";
      grid[11][12] = "_";
      grid[11][11] = "_";
      grid[11][10] = "_";
      grid[11][9] = "_";
      grid[11][8] = "_";
      grid[11][7] = "_";
      for(var i = 0; i < 15; i++) {
        lines[i].innerHTML = "";
        for(var j = 0; j < 57; j++) {
          lines[i].innerHTML += grid[i][j];
        }
      }
    }
  }
  
  window.onkeydown = function(e) {
  switch(e.keyCode) {
    case 65:
      player.xVel = -player.speed;
      break;
    case 68:
      player.xVel = player.speed;
      break;
    case 32:
      player.shoot = true;
      break;
  }

}

window.onkeyup = function(e) {
    switch(e.keyCode) {
      case 65:
        if(player.xVel == -player.speed) {
          player.xVel = 0;
        }
        break;
      case 68:
        if(player.xVel == player.speed) {
          player.xVel = 0;
        }
        break;
      case 32:
        player.shoot = false;
        break;
    }
}
}


function startBreakout() {
game = 0;
for(var i = 0; i < document.getElementsByClassName("games").length; i++) {
  document.getElementsByClassName("games")[i].style.display = "none";
}

var lines = [];
var grid = [[]];
var tiles = [[]];
var width = 57;
var height = 6;
var balls = [];

function Ball(x, y ,xVel, yVel) {
  this.x = x;
  this.y = y;
  this.xVel = xVel;
  this.yVel = yVel;
}

var player = {
  x: Math.round((Math.random() * (width - 8)) + 4),
  size: 4,
  xVel: 0,
  lose: false,
  speed: 1,
  powerup: -1
};

var fps = 60;

var powerup = {
  x:-5,
  y:20,
  power:0,
  speed:0.1
};

var powerupTimer = 0;

balls.push(new Ball(player.x, 14, (Math.random() * 3) - 1.5, 0.25));

for(var i = 0; i < 15; i++) {
  lines.push(document.createElement("p"));
  lines[i].className = "block";
  lines[i] = document.getElementById("offset").appendChild(lines[i]);
}

for(var i = 0; i < 15; i++) {
  grid.push([]);
  for(var j = 0; j < width; j++) {
    if(i < height) {
      if(Math.random() > 0) {
        grid[i].push("X");
      } else {
        grid[i].push("&nbsp");
      }
    } else {
      grid[i].push("&nbsp");
    }
    
  }
}

for(var i = 0; i < height; i++) {
  tiles.push([]);
  for(var j = 0; j < width; j++) {
    tiles[i].push(true);
  }
}

gameLoop = setInterval(update, 1000 / fps);

function update() {
/*if(balls[0].yVel < 0 && powerupTimer == 0) {
  var x = powerup.x;
} else {
  if(balls[0].yVel < 0 && balls[1] != undefined) {
    var x = balls[1].x;
  } else {
    var x = balls[0].x;
  }
}
if(player.x + player.size < x) {
  player.xVel = 1;
}
if(player.x - player.size > x) {
  player.xVel = -1;
}*/

  for(var i = 0; i < 15; i++) {
    for(var j = 0; j < width; j++) {
      grid[i][j] = "&nbsp";
    }
  }
  
  
  for(var i = 0; i < tiles.length; i++) {
    for(var j = 0; j < tiles[i].length; j++) {
      if(tiles[i][j] == true) {
        grid[i][j] = "X";
      }
    }
  }

  if(player.power == 1) {
    player.power = -1;
    balls.push(new Ball(player.x, 14, 0, -0.25));
  }

  for(var i = 0; i < balls.length; i++) {
    balls[i].x += balls[i].xVel;
    balls[i].y += balls[i].yVel;
    
    if(grid[Math.floor(balls[i].y)][Math.floor(balls[i].x)] == "X" || balls[i].y <= 0) {
      if(grid[Math.floor(balls[i].y)][Math.floor(balls[i].x)] == "X") {
        if(player.power == 0) {
          player.power = -1;
          for(var j = 0; j < 5; j++) {
            for(var w = 0; w < 2; w++) {
              tiles[Math.floor(balls[i].y + (w - 1))][Math.floor(balls[i].x + (j - 3))] = "&nbsp";
            }
          }
        } else {
          tiles[Math.floor(balls[i].y)][Math.floor(balls[i].x)] = "&nbsp";
        }
      }
      balls[i].yVel *= -1;
      balls[i].x += Math.ceil(balls[i].xVel);
      balls[i].y += Math.ceil(balls[i].yVel);
    }

    if(balls[i].x >= width || balls[i].x <= 0) {
      balls[i].xVel *= -1;
      balls[i].x += balls[i].xVel;
      balls[i].y += balls[i].yVel;
    }

    if(balls[i].y >= 14 && balls[i].x > player.x - player.size - 1 && balls[i].x < player.x + player.size + 1) {
      balls[i].yVel *= -1;
      balls[i].xVel = (balls[i].x - player.x) / (player.size * 2);
      balls[i].x += balls[i].xVel;
      balls[i].y += balls[i].yVel;
    }
    
    grid[Math.floor(balls[i].y)][Math.floor(balls[i].x)] = "O";
    
    if(balls[i].y >= 15) {
      balls.splice(i, 1);
    }
  }
  
  if(balls.length == 0) {
    stopBreakout();
    startBreakout();
  }
  
  if(powerup.y >= 14 && powerup.x > player.x - player.size - 1 && powerup.x < player.x + player.size + 1) {
    powerup.y = 16;
    if(powerupTimer == 0) {
      player.power = powerup.power;
    }
  }
  
  if(player.x - player.size <= 0 && player.xVel == -player.speed) {
    player.xVel = 0;
  }
  
  if(player.x + player.size >= width - 1 && player.xVel == player.speed) {
    player.xVel = 0;
  }
  
  
  powerup.y += powerup.speed;
  
  if(powerup.y >= 16) {
    powerupTimer++;
    if(powerupTimer >= 5 * fps) {
      powerupTimer = 0;
      powerup.y = 1;
      powerup.x = Math.round(Math.random() * width);
      powerup.power = Math.round(Math.random() * 1);
    }
  } else {
    switch(powerup.power) {
      case 0:
        grid[Math.floor(powerup.y)][powerup.x] = "&";
        break;
      case 1:
        grid[Math.floor(powerup.y)][powerup.x] = "o";
        break;
    }
  }
  
  
  player.x += player.xVel;
  
  grid[14][player.x] = "=";
  
  for(var i = 0; i < player.size; i++) {
    grid[14][player.x + i + 1] = "=";
  }
  
  for(var i = 0; i < player.size; i++) {
    grid[14][player.x - i - 1] = "=";
  }
  

  for(var i = 0; i < 15; i++) {
    lines[i].innerHTML = "";
    for(var j = 0; j < width; j++) {
      lines[i].innerHTML += grid[i][j];
    }
  }



}

window.onkeydown = function(e) {
  switch(e.keyCode) {
    case 65:
      player.xVel = -player.speed;
      break;
    case 68:
      player.xVel = player.speed;
      break;
  }

}

window.onkeyup = function(e) {
    switch(e.keyCode) {
      case 65:
        if(player.xVel == -player.speed) {
          player.xVel = 0;
        }
        break;
      case 68:
        if(player.xVel == player.speed) {
          player.xVel = 0;
        }
        break;
    }
}


}

function stopBreakout() {
  game = -1;
  while(document.getElementsByClassName("block")[0]) {
    document.getElementById("offset").removeChild(document.getElementsByClassName("block")[0]);
  } 
  clearInterval(gameLoop);
  
  for(var i = 0; i < document.getElementsByClassName("games").length; i++) {
    document.getElementsByClassName("games")[i].style.display = "block";
  }
}