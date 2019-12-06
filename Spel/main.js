
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
  var leveltimer = 0;
  var cheatmode = false;
  var totalPrevious = [];
  var savedTimer = 0;
  var replayPaused = false;
  var replayButton = new wall(300, 600, 25, 25, 255, 0, 0, -1);
  let spawnpoints = [new spawnpoint(700, -100, -1),
                     new spawnpoint(700, 600, 0),
                     new spawnpoint(700, 600, 1),
                     new spawnpoint(675, 650, 2),
                     new spawnpoint(500, 500, 3), 
                     new spawnpoint(700, -100, 4)];
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
                  new finish(900, 600, -1),
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
  var previous = [];
  var replayIndex = 0;
  var replayLoop;
  var replayRunning = false;
  var epilepsyMode = false;
  var musics = ["musik", "musik2"];
  document.getElementById("music").innerHTML = '<source src="' + musics[Math.round(Math.random() * 1)] + '.mp3" type="audio/mpeg">';
  document.getElementById("music").load();
  
  if(Math.random() < 1 / 100) {
    epilepsyMode = true;
  }
  
  function vec2(x, y) {
    this.x = x;
    this.y = y;
  }
  
  function playerCopy() {
    this.level;
    this.xVel;
    this.yVel;
    this.interacting = false;
    this.keys = new key();
  }
  
  function key() {
    this.w = false;
    this.a = false;
    this.d = false;
    this.e = false;
  }
  
  function replay() {
    if(level == 4) {
      previous = totalPrevious;
    } 
    savedTimer = leveltimer;
    replayIndex = 0;
    timer = 0;
    leveltimer = 0;
    timerRunning = true;
    replayRunning = true;
    level = previous[0].level;
    die();
    replayLoop = setInterval(updateReplay, 1000 / fps);
  }
  
  function updateReplay() {
  if(!replayPaused) {
    if(level == 4) {
      previous = totalPrevious;
    } 
    if(level != lastLevel) {
      lastLevel = level;
      die();
    }
    
    level = previous[replayIndex].level;
    if(level == -1) {
      clearInterval(replayLoop);
      level = lastLevel;
      previous = [];
      replayRunning = false;
      win();
      if(wonGame) {
        level = levels;
      }
      ctx.restore();
      return;
    }
    
    if(previous[replayIndex].xVel != undefined) {
      xVel = previous[replayIndex].xVel;
    }
    if(previous[replayIndex].yVel != undefined) {
      yVel = previous[replayIndex].yVel;
    }
    if(previous[replayIndex].interacting != undefined) {
      interacting = previous[replayIndex].interacting;
    }

    replayIndex++;
    if(replayIndex >= previous.length) {
      clearInterval(replayLoop);
      timer = 0;
      replayRunning = false;
      win();
      if(wonGame) {
        level = levels;
      }
      leveltimer = savedTimer;
      ctx.restore();
      replayPaused = false;
    }
    }
  }
  
  var loop = setInterval(update, 1000 / fps);
  
  function update() {
  if(!replayPaused) { 
    if(pY > 5000) {
      die();
    }
    
    if(!replayRunning && level != -1 && level != 4) {
      previous.push(new playerCopy());
      previous[previous.length - 1].level = level;
      if(previous.length - 2 > 0) {
        previous[previous.length - 1].interacting = previous[previous.length - 2].interacting;
        previous[previous.length - 1].keys = JSON.parse(JSON.stringify(previous[previous.length - 2].keys));
      } else {
        previous[previous.length - 1].interacting = false;
      }
    }
    
    if(level != -1 && level != levels) {
      ctx.drawImage(document.getElementById(background), 0, 0, screen.width, screen.height);      
    } else if(level == -1 || level == levels) {
      ctx.fillStyle = "rgb(30, 30, 30)";
      ctx.fillRect(0, 0, screen.width, screen.height); 
    }
    if(epilepsyMode) {
      ctx.fillStyle = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ", 0.75)";
      ctx.fillRect(0, 0, c.width, c.height);
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
        if(epilepsyMode) {
          ctx.fillStyle = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
        }
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
        if(epilepsyMode) {
          ctx.fillStyle = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
        }
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
          if(epilepsyMode) {
            ctx.fillStyle = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
          }
        }
        
        if(collider[i].switched == true) {
          ctx.fillStyle = "rgb(" + collider[i].r + ", " + collider[i].g + "," + collider[i].b + ", 0.5)";
          if(epilepsyMode) {
            ctx.fillStyle = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ", 0.5)";
          }
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
        if(epilepsyMode) {
          ctx.fillStyle = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
        }
        ctx.fillRect(collider[i].x, collider[i].y, collider[i].w, collider[i].h);
      }
    }
    
    collider = replayButton;
    if(replayButton.level == level || level == 4) {
      if(collision(collider) != undefined) {
        replay();
        ctx.save();
        ctx.scale(0.8, 0.8);
      }
      ctx.fillStyle = "rgb(" + collider.r + ", " + collider.g + "," + collider.b + ")";
      if(epilepsyMode) {
          ctx.fillStyle = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
        }
      ctx.fillRect(collider.x, collider.y, collider.w, collider.h);
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
        if(epilepsyMode) {
          ctx.fillStyle = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
        }
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
        if(epilepsyMode) {
          ctx.fillStyle = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
        }
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
        if(epilepsyMode) {
          ctx.fillStyle = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
        }
        ctx.fillRect(collider[i].x, collider[i].y, collider[i].w, collider[i].h);
      }
    }
    
    if(level == levels) {
      wonGame = true;
    }
      
    ctx.fillStyle = "rgb(255, 255, 0)"; // Player
    if(epilepsyMode) {
      ctx.fillStyle = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
    }
    ctx.fillRect(pX, pY, pW, pH);
    
    
    ctx.fillStyle = "rgb(0, 255, 0)";
    if(timerRunning && !wonGame || replayRunning) {  
      timer += 1 / fps;
      leveltimer += 1 / fps;
      if(!wonGame && !replayRunning) {
        totalTimer += 1 / fps;
      }
      ctx.fillStyle = "rgb(255, 255, 255)"; // Timer
    }
    if(level != -1) {
      ctx.font = "30px Arial";
     ctx.fillText(Math.round(leveltimer * 100) / 100, 20, 30);  
    } else if(level == -1) {
      ctx.font = "200px Arial";
     ctx.fillText(Math.round(leveltimer * 100) / 100, 200, 300);  
    }
    
    if(cheatmode) {
      ctx.font = "30px Arial";
      ctx.fillStyle = "rgb(255, 0, 0)"; 
      if(epilepsyMode) {
          ctx.fillStyle = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
        }
     ctx.fillText("Save mode", 150, 30);  
    }
    
    if(level != -1) {
    ctx.fillStyle = "rgb(255, 255, 255)"; 
      ctx.fillText("Level " + (level + 1), 1250, 35);
    }
    
    if(wonGame && !replayRunning) {
      ctx.fillStyle = "rgb(0, 255, 0)";
      ctx.font = "200px Arial";
      ctx.fillText(Math.round(totalTimer * 100) / 100, 200, 300);  
    }
    
    if(replayRunning) {
      ctx.fillStyle = "#555555";
      ctx.fillRect(c.width, 0, 1000, 1000);
      ctx.fillRect(0, c.height, 2000, 1000);
      
      
      ctx.font = "50px Arial";
      
      if(previous[replayIndex].keys.w) {
        ctx.fillStyle = "#777777";
      } else {
        ctx.fillStyle = "#AAAAAA";
      }
      ctx.fillRect(1500, 100, 50, 50);
      ctx.fillStyle = "#000000";
      ctx.fillText("W", 1500, 150);  
      
      if(previous[replayIndex].keys.a) {
        ctx.fillStyle = "#777777";
      } else {
        ctx.fillStyle = "#AAAAAA";
      }
      ctx.fillRect(1425, 175, 50, 50);
      ctx.fillStyle = "#000000";
      ctx.fillText("A", 1425, 225); 
      
      if(previous[replayIndex].keys.d) {
        ctx.fillStyle = "#777777";
      } else {
        ctx.fillStyle = "#AAAAAA";
      }
      ctx.fillRect(1575, 175, 50, 50);
      ctx.fillStyle = "#000000";
      ctx.fillText("D", 1575, 225); 
      
      if(previous[replayIndex].keys.e) {
        ctx.fillStyle = "#777777";
      } else {
        ctx.fillStyle = "#AAAAAA";
      }
      ctx.fillRect(1575, 100, 50, 50);
      ctx.fillStyle = "#000000";
      ctx.fillText("E", 1575, 150); 
    }
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
    xVel = 0;
    yVel = 0;
    timerRunning = false;
    
    if(level != -1) {
      lastLevel = level;
      level = -1;
    } else if(level == -1) {
      if(cheatmode == false) {
        level = lastLevel + 1;
      } else {
        level = lastLevel;
      }
      timer = 0;
      leveltimer = 0;
      timerRunning = true;
      
      for(var i = 0; i < previous.length; i++) {
        totalPrevious.push(previous[i]);
      }
      previous = [];
      previous.push(new playerCopy());
      previous[previous.length - 1].level = level;
      previous[previous.length - 1].interacting = false;
    }
    pX = spawnpoints[level + 1].x;
    pY = spawnpoints[level + 1].y;
    
    for(var i = 0; i < switchableWalls.length; i++) {
      switchableWalls[i].switched = false;
      
    }
  }
  
  function die() {
    xVel = 0;
    yVel = 0;
    pX = spawnpoints[level + 1].x;
    pY = spawnpoints[level + 1].y;
    timer = 0;
    xVel = 0;
    yVel = 0;
    if(cheatmode) {
      leveltimer = 0;
      
      if(!replayRunning) {
        previous = [];
        previous.push(new playerCopy());
        previous[previous.length - 1].level = level;
        previous[previous.length - 1].interacting = false;
      }
    }
    //console.log("switch");
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
  if(e.keyCode == 70) {
    level = 0;
    wonGame = 0;
    die();
    timer = 0;
    leveltimer = 0;
    totalTimer = 0;
    cheatmode = false;
  }
  if(!replayRunning) {
    if(e.keyCode - 48 > 0 && e.keyCode - 48 < 5) {
      cheatmode = true;
      level = e.keyCode - 48 - 1;
      die();
      leveltimer = 0;
      timer = 0;
      timerRunning = true;
      
      previous = [];
      previous.push(new playerCopy());
      previous[previous.length - 1].level = level;
      previous[previous.length - 1].interacting = false;
    }
    
    if(e.keyCode == 65 || e.keyCode == 37) { // A
      previous[previous.length - 1].xVel = -speed;
      previous[previous.length - 1].keys.a = true;
      xVel = -speed;
    } else if(e.keyCode == 68 || e.keyCode == 39) { // D
      previous[previous.length - 1].xVel = speed;
      previous[previous.length - 1].keys.d = true;
      xVel = speed;
    } else if(e.keyCode == 87 || e.keyCode == 38) { // W
      
      for(let i = 0; i < walls.length; i++) {
        if(walls[i].level == level) {
          if(pY + pH > walls[i].y - 1 && pX < walls[i].x + walls[i].w && pX + pW > walls[i].x && pY + pH < walls[i].y + walls[i].h) {
            yVel = -jumpStrength;
            previous[previous.length - 1].yVel = -jumpStrength;
            previous[previous.length - 1].keys.w = true;
          }
        }
      }
    } else if(e.keyCode == 69) {
      previous[previous.length - 1].interacting = true;
      previous[previous.length - 1].keys.e = true;
      interacting = true;
    } 
    }
    if(e.keyCode == 32) {
      if(replayRunning) {
        replayPaused = !replayPaused;
      }
    }
  }
    
  window.onkeyup = function(e) {
  if(!replayRunning) {
    if(e.keyCode == 65 || e.keyCode == 37) { // A
previous[previous.length - 1].keys.a = false;
      if(xVel < 0) {
        xVel = 0;
        previous[previous.length - 1].xVel = 0;
        
      }
    } else if(e.keyCode == 68 || e.keyCode == 39) { // D 
    previous[previous.length - 1].keys.d = false;
      if(xVel > 0) {
        xVel = 0;
        previous[previous.length - 1].xVel = 0;
        
      }
    } else if(e.keyCode == 69) {
    previous[previous.length - 1].interacting = false;
    previous[previous.length - 1].keys.e = false;
      interacting = false;
    } else if(e.keyCode == 87) {
    previous[previous.length - 1].keys.w = false;
    }
    }
  }
