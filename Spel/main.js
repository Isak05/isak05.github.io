window.onload = function() {
  let c = document.getElementById("canvas");
  c.width = screen.width;
  c.height = screen.height;
  let ctx = c.getContext("2d");
  let fps = 30;
  let pW = 25;
  let pH = 50;
  let speed = 10;
  let jumpStrength = 20;
  let gravity = 1;
  let xVel = 0;
  let yVel = 0;
  let timer = 0;
  let totalTimer = 0;
  let timerRunning = true;
  let level = 0;
  let interacting = false;
  let lastLevel = 0;
  let wonGame = false;
  let spawnpoints = [new spawnpoint(700, -100, -1),
                     new spawnpoint(700, 600, 0),
                     new spawnpoint(700, 600, 1),
                     new spawnpoint(675, 650, 2),
                     new spawnpoint(500, 500, 3)];
  let movableLavas = [new movableLava(screen.width / 2, 700, 50, 25, 0, 500, 0.6, 1, 0),
                      new movableLava(-1500, 600, 2000, 25, 2, 500, 2, 1, 0),
                      new movableLava(900, 600, 2000, 25, 2, 500, 2, 1, 0),
                      new movableLava(-1500, 450, 2000, 25, 2, 500, 2.5, 1, 0),
                      new movableLava(900, 450, 2000, 25, 2, 500, 2.5, 1, 0),
                      new movableLava(-1500, 300, 2000, 25, 2, 500, 2, 1, 0),
                      new movableLava(900, 300, 2000, 25, 2, 500, 2, 1, 0),
                      new movableLava(625, 300, 50, 50, 3, 200, 2, 1, 1)];
  let movableWalls = [];
  let levers = [new lever(850, 618, 0, 0),
                new lever(675, screen.height - 525, 2, 1)];
  let switchableWalls = [new switchableWall(1200, 450, 25, 275, 0, 255, 255, 0, 0),
                         new switchableWall(0, 150, 1500, 25, 0, 0, 0, 2, 1)];
  let lavas = [new lava(-1000, 1000, 5000, 500, 2),
               new lava(850, screen.height - 55, screen.width / 2 - 430, 20, 0),
               new lava(1100, 100, 75, 150, 1),
               new lava(975, 100, 25, 250, 1),
               new lava(900, 325, 25, 200, 1),
               new lava(425, 150, 400, 25, 1)]; 
  
  let finishes = [new finish(1250, screen.height - 75, 0),
                  new finish(500, 100, 1),
                  new finish(900, 500, -1),
                  new finish(400, 100, 2),
                  new finish(862, 125, 3)];
  let levels = 4;
  let walls = [new wall(850, 150, 50, 350, 255, 255, 255, 3),
               new wall(450, 150, 50, 350, 255, 255, 255, 3),
               new wall(862, 350, 25, 75, 0, 0, 0, 3),
               new wall(462, 350, 25, 75, 0, 0, 0, 3),
               new wall(300, 600, 50, 25, 0, 0, 0, 3),
               new wall(350, 625, 100, 25, 0, 0, 0, 3),
               new wall(450, 650, 450, 25, 0, 0, 0, 3),
               new wall(900, 625, 100, 25, 0, 0, 0, 3),
               new wall(1000, 600, 50, 25, 0, 0, 0, 3),
               new wall(500, 475, 25, 25, 0, 0, 0, 3),
               new wall(825, 375, 25, 25, 0, 0, 0, 3),
               new wall(500, 300, 25, 25, 0, 0, 0, 3),
               new wall(825, 200, 25, 25, 0, 0, 0, 3),
               new wall(675, screen.height - 500, 25, 25, 0, 0, 0, 2),
               new wall(675, screen.height - 350, 25, 25, 0, 0, 0, 2),
               new wall(675, screen.height - 200, 25, 25, 0, 0, 0, 2),
               new wall(675, screen.height - 50, 25, 25, 0, 0, 0, 2),
               new wall(0, screen.height - 50, screen.width, 50, 0, 0, 0, -1),
               new wall(875, 100, 25, 25, 0, 255, 255, 1),
               new wall(0, 0, screen.width, 15, 0, 255, 255, 1),
               new wall(750, 125, 25, 25, 0, 255, 255, 1),
               new wall(975, 75, 200, 25, 0, 255, 255, 1),
               new wall(1175, 225, 25, 25, 0, 255, 255, 1),
               new wall(1300, 400, 25, 25, 0, 255, 255, 1),
               new wall(925, 500, 100, 25, 0, 255, 255, 1),
               new wall(900, 300, 25, 25, 0, 255, 255, 1),
               new wall(700, 400, 25, 25, 0, 255, 255, 1),
               new wall(500, 550, 25, 25, 0, 255, 255, 1),
               new wall(0, screen.height - 50, screen.width, 50, 0, 0, 0, 1),
               new wall(975, screen.height - 65, 40, 50, 0, 0, 0, 0),
               new wall(800, screen.height - 125, screen.width / 2 - 600, 20, 0, 0, 0, 0),
               new wall(0, screen.height - 50, screen.width, 50, 0, 0, 0, 0), 
               new wall(0, 0, 50, screen.height, 0, 0, 0, 0), 
               new wall(300, screen.height - 200, 300, 50, 0, 0, 0, 0),
               new wall(600, screen.height - 500, 50, 350, 0, 0, 0, 0),
               new wall(0, screen.height / 2, 400, 50, 0, 0, 0, 0),
               new wall(0, 0, screen.width, 50, 0, 0, 0, 0),
               new wall(screen.width - 50, 0, 50, screen.height, 0, 0, 0, 0),
               new wall(200, 250, 1000, 50, 0, 0, 0, 0),
               new wall(800, 250, 50, 500, 0, 0, 0, 0),
               new wall(screen.width / 2, 0, 50, 150, 0, 0, 0, 0),
               new wall(screen.width / 2 - 150, 150, 50, 100, 0, 0, 0, 0),
               new wall(1000, 400, 400, 50, 0, 0, 0, 0),
               new wall(850, 550, 200, 25, 0, 0, 0, 0),
               new wall(1100, 600, 50, 300, 0, 0, 0, 0),
               new wall(0, c.height, c.width, c.height, 0, 0, 0, levels),
               new wall(-100, 0, 100, c.height, 0, 0, 0, levels),
               new wall(c.width, 0, c.width, c.height, 0, 0, 0, levels)];
  let pX = spawnpoints[level + 1].x;
  let pY = spawnpoints[level + 1].y;
  let backgrounds = ["katt", "hund", "marsvin", "katt2", "hund2", "igelkott", "sengangare", "kanin", "skoldpadda", "lejon"];
  let random = Math.round(Math.random() * (backgrounds.length - 1));
  let background = backgrounds[random];
  
  setInterval(update, 1000 / fps);
  
  function update() {
    if(level != -1 && level != levels) {
      ctx.drawImage(document.getElementById(background), 0, 0, screen.width, screen.height);      
    } else if(level == -1 || level == levels) {
      ctx.fillStyle = "rgb(30, 30, 30)";
      ctx.fillRect(0, 0, screen.width, screen.height); 
    }
    
    if(level == 3) {
      ctx.fillStyle = "rgb(200, 0, 255)";
      ctx.fillRect(0, 0, screen.width, screen.height); 
    }

    yVel += gravity;  
      
    pX += xVel;       
    pY += yVel;

    let collider = walls;
    for(let i = 0; i < collider.length; i++) {  
      if(collider[i].level == level) {
        if(collision(collider[i]) == 3) { // Down
          pY += walls[i].y - (pY + pH);
          yVel = 0;
        } 

        if(collision(collider[i]) == 1) { // Up
          pY -= pY - (walls[i].y + walls[i].h);
          yVel /= 1.3;
        } 

        if(collision(collider[i]) == 0) { // Left
          pX -= pX - (walls[i].x + walls[i].w);
          //xVel = 0;
        }  

        if(collision(collider[i]) == 2) { // Right
          pX += walls[i].x - (pX + pW);
          //xVel = 0;
        } 

        ctx.fillStyle = "rgb(" + collider[i].r + ", " + collider[i].g + "," + collider[i].b + ")";
        ctx.fillRect(collider[i].x, collider[i].y, collider[i].w, collider[i].h);
      }
    }
    
    collider = movableWalls;
    for(let i = 0; i < collider.length; i++) {  
      if(collider[i].level == level) {
        collider[i].x = Math.round(Math.sin(timer * collider[i].speed) * collider[i].move) + collider[i].startX;
        if(collision(collider[i]) == 3) { // Down
          pY += collider[i].y - (pY + pH);
          yVel = 0;
        } 

        if(collision(collider[i]) == 1) { // Up
          pY -= pY - (collider[i].y + collider[i].h);
          yVel /= 1.3;
        } 

        if(collision(collider[i]) == 0) { // Left
          pX -= pX - (collider[i].x + collider[i].w);
          //xVel = 0;
        }  

        if(collision(collider[i]) == 2) { // Right
          pX += collider[i].x - (pX + pW);
          //xVel = 0;
        } 

        ctx.fillStyle = "rgb(" + collider[i].r + ", " + collider[i].g + "," + collider[i].b + ")";
        ctx.fillRect(collider[i].x, collider[i].y, collider[i].w, collider[i].h);
      }
    }
    
    collider = switchableWalls;
    for(let i = 0; i < collider.length; i++) {  
      if(collider[i].level == level) {
        if(collider[i].switched == false) {
          if(collision(collider[i]) == 3) { // Down
            pY += collider[i].y - (pY + pH);
            yVel = 0;
          } 

          if(collision(collider[i]) == 1) { // Up
            pY -= pY - (collider[i].y + collider[i].h);
            yVel /= 1.3;
          } 

          if(collision(collider[i]) == 0) { // Left
            pX -= pX - (collider[i].x + collider[i].w);
            //xVel = 0;
          }  

          if(collision(collider[i]) == 2) { // Right
            pX += collider[i].x - (pX + pW);
            //xVel = 0;
          } 
        }
        
        if(collider[i].switched == false) {
          ctx.fillStyle = "rgb(" + collider[i].r + ", " + collider[i].g + "," + collider[i].b + ")";
        }
        
        if(collider[i].switched == true) {
          ctx.fillStyle = "rgb(" + collider[i].r + ", " + collider[i].g + "," + collider[i].b + ", 0.5)";
        }
        
        ctx.fillRect(collider[i].x, collider[i].y, collider[i].w, collider[i].h);
      }
    }
    
    collider = movableLavas;
    for(let i = 0; i < collider.length; i++) {  
      if(collider[i].level == level) {
        collider[i].x = (Math.round(collider[i].moveX * Math.sin(timer * collider[i].speed) * collider[i].move) + collider[i].startX);
        collider[i].y = (Math.round(collider[i].moveY * Math.sin(timer * collider[i].speed) * collider[i].move) + collider[i].startY);
        if(collision(collider[i]) == 3) { // Down
          die();
        } 

        if(collision(collider[i]) == 1) { // Up
          die();
        } 

        if(collision(collider[i]) == 0) { // Left
          die();
        }  

        if(collision(collider[i]) == 2) { // Right
          die();
        } 

        ctx.fillStyle = "rgb(" + collider[i].r + ", " + collider[i].g + "," + collider[i].b + ")";
        ctx.fillRect(collider[i].x, collider[i].y, collider[i].w, collider[i].h);
      }
    }
    
    
    collider = finishes;
    for(let i = 0; i < collider.length; i++) {  
      if(collider[i].level == level) {
        if(collision(collider[i]) == 3) { // Down
          win();
        } 

        if(collision(collider[i]) == 1) { // Up
          win();
        } 

        if(collision(collider[i]) == 0) { // Left
          win();
        }  

        if(collision(collider[i]) == 2) { // Right
          win();
        } 

        ctx.fillStyle = "rgb(" + collider[i].r + ", " + collider[i].g + "," + collider[i].b + ")";
        ctx.fillRect(collider[i].x, collider[i].y, collider[i].w, collider[i].h);
      }
    }
    
    
    
    collider = lavas;
    for(let i = 0; i < collider.length; i++) {  
      if(collider[i].level == level) {
        if(collision(collider[i]) == 3) { // Down
          die();
        } 

        if(collision(collider[i]) == 1) { // Up
          die();
        } 

        if(collision(collider[i]) == 0) { // Left
          die();
        }  

        if(collision(collider[i]) == 2) { // Right
          die();
        } 

        ctx.fillStyle = "rgb(" + collider[i].r + ", " + collider[i].g + "," + collider[i].b + ")";
        ctx.fillRect(collider[i].x, collider[i].y, collider[i].w, collider[i].h);
      }
    }
    
    collider = levers;
    for(let i = 0; i < collider.length; i++) {  
      if(collider[i].level == level) {
        if(collision(collider[i]) == 3) { // Down
          if(interacting) {
            for(let j = 0; j < switchableWalls.length; j++) {
              if(switchableWalls[j].id == collider[i].id) {
                switchableWalls[j].switched = true;
              }
            }
          }
        } 

        if(collision(collider[i]) == 1) { // Up
          if(interacting) {
            for(let j = 0; j < switchableWalls.length; j++) {
              if(switchableWalls[j].id == collider[i].id) {
                switchableWalls[j].switched = true;
              }
            }
          }
        } 

        if(collision(collider[i]) == 0) { // Left
          if(interacting) {
            for(let j = 0; j < switchableWalls.length; j++) {
              if(switchableWalls[j].id == collider[i].id) {
                switchableWalls[j].switched = true;
              }
            }
          }
        }  

        if(collision(collider[i]) == 2) { // Right
          if(interacting) {
            for(let j = 0; j < switchableWalls.length; j++) {
              if(switchableWalls[j].id == collider[i].id) {
                switchableWalls[j].switched = true;
              }
            }
          }
        } 

        ctx.fillStyle = "rgb(" + collider[i].r + ", " + collider[i].g + "," + collider[i].b + ")";
        ctx.fillRect(collider[i].x, collider[i].y, collider[i].w, collider[i].h);
      }
    }
    
    if(level == levels) {
      wonGame = true;
    }
      
    ctx.fillStyle = "rgb(255, 255, 0)"; // Player
    ctx.fillRect(pX, pY, pW, pH);
    
    
    ctx.fillStyle = "rgb(0, 255, 0)";
    if(timerRunning && !wonGame) {  
      timer += 1 / fps;
      totalTimer += 1 / fps;
      ctx.fillStyle = "rgb(255, 255, 255)"; // Timer
    }
    if(level != -1) {
      ctx.font = "30px Arial";
     ctx.fillText(Math.round(timer), 20, 30);  
    } else if(level == -1) {
      ctx.font = "200px Arial";
     ctx.fillText(Math.round(timer), 200, 300);  
    }
    
    if(level != -1) {
      ctx.fillText("Level " + (level + 1), 1250, 35);
    }
    
    if(wonGame) {
      ctx.fillStyle = "rgb(0, 255, 0)";
      ctx.font = "200px Arial";
      ctx.fillText(Math.round(totalTimer), 200, 300);  
    }
      
  }
    
  function wall(x, y, w, h, r, g, b, level) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.r = r;
    this.g = g;
    this.b = b;
    this.level = level;
  }
  
  function movableWall(x, y, w, h, r, g, b, level, move) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.w = w;
    this.h = h;
    this.r = r;
    this.g = g;
    this.b = b;
    this.level = level;
    this.move = move;
  }
  
  function movableLava(x, y, w, h, level, move, speed, moveX, moveY) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.w = w;
    this.h = h;
    this.r = 255;
    this.g = 0;
    this.b = 0;
    this.speed = speed;
    this.level = level;
    this.move = move;
    this.moveX = moveX;
    this.moveY = moveY;
  }
  
  function spawnpoint(x, y, level) {
    this.x = x;
    this.y = y;
    this.level = level;
  }
    
  function finish(x, y, level) {
    this.w = 25;
    this.h = 25;
    this.x = x;
    this.y = y;
    this.level = level;
    this.r = 0;
    this.g = 255;
    this.b = 0;
  }
  
  function lava(x, y, w, h, level) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.level = level;
    this.r = 255;
    this.g = 0;
    this.b = 0;
  }
  
  function lever(x, y, level, id) {
    this.x = x;
    this.y = y;
    this.w = 26;
    this.h = 26;
    this.level = level;
    this.id = id;
    this.r = 255;
    this.g = 255;
    this.b = 0;
  }
  
  function switchableWall(x, y, w, h, r, g, b, level, id) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.r = r;
    this.g = g;
    this.b = b;
    this.level = level;
    this.id = id;
    this.switched = false;
  }
  
  function win() {
    timerRunning = false;

    if(level != -1) {
      lastLevel = level;
      level = -1;
    } else if(level == -1) {
      level = lastLevel + 1;
      timer = 0;
      timerRunning = true;
    }
    pX = spawnpoints[level + 1].x;
    pY = spawnpoints[level + 1].y;
  }
  
  function die() {
    pX = spawnpoints[level + 1].x;
    pY = spawnpoints[level + 1].y;
    timer = 0;
    xVel = 0;
    yVel = 0;
    console.log("switch");
    for(var i = 0; i < switchableWalls.length; i++) {
      switchableWalls[i].switched = false;
      
    }
  }
  
  function collision(collider) {
    if(pY + pH > collider.y && pX < collider.x + collider.w + xVel && pX + pW > collider.x + xVel && pY + pH < collider.y + collider.h) { // Down
      return 3;
    } 
      
    if(pY < collider.y + collider.h && pX - xVel < collider.x + collider.w && pX + pW - xVel > collider.x && pY > collider.y) { // Up
      return 1;
    } 
      
    if(pX < collider.x + collider.w && pY < collider.y + collider.h && pY + pH > collider.y && pX > collider.x) { // Left
      return 0;
    }  
      
    if(pX + pW > collider.x && pY < collider.y + collider.h && pY + pH > collider.y && pX + pW < collider.x + collider.w) { // Right
      return 2;
    }
  }
    
  window.onkeydown = function(e) {
    if(e.keyCode == 65) { // A
      xVel = -speed;
    } else if(e.keyCode == 68) { // D
      xVel = speed;
    } else if(e.keyCode == 87) { // W
      for(let i = 0; i < walls.length; i++) {
        if(walls[i].level == level) {
          if(pY + pH > walls[i].y - 1 && pX < walls[i].x + walls[i].w && pX + pW > walls[i].x && pY + pH < walls[i].y + walls[i].h) {
            yVel = -jumpStrength;
          }
        }
      }
    } else if(e.keyCode == 69) {
      interacting = true;
    }
  }
    
  window.onkeyup = function(e) {
    if(e.keyCode == 65) { // A
      if(xVel < 0) {
        xVel = 0;
      }
    } else if(e.keyCode == 68) { // D 
      if(xVel > 0) {
        xVel = 0;
      }
    } else if(e.keyCode == 69) {
      interacting = false;
    }
  }
};