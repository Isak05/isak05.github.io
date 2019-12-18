var c = document.getElementById("c");
c.width = screen.width;
c.height = screen.height;
var ctx = c.getContext("2d");
ctx.imageSmoothingEnabled = false;

var player = {
  pos: new vec2(c.height * 0.6, c.height * 0.15),
  size: {x: c.height * 0.06, y: c.height * 0.1},
  vel: new vec2(0, 0),
  acc: new vec2(0, 0),
  prevAcc: new vec2(0, 0),
  speed: c.height * 0.01,
  crateSpeed: 0.666,
  interacting: false,
  prevInteracting: false,
  onGround: false,
  onWall: false,
  onCrate: false,
  wallJumped: false,
  wallJumpStrength: c.height * 0.02,
  jumpStrength: c.height * 0.035,
  anims: [[{texture: 0, time: 4}, {texture: 3, time: 4}],
          [{texture: 0, time: 0}],
          [{texture: 4, time: 0}],
          [{texture: 5, time: 0}], 
          [{texture: 4, time: 0}]],
  animTimer: 0,
  currentAnimFrame: 0,
  currentAnim: 1,
  texture: 0,
  textureFlipped: false,
  setAnim: function(x) {
    this.animTimer = 0;
    this.currentAnimFrame = 0;
    this.currentAnim = x;
    this.texture = this.anims[x][this.currentAnimFrame].texture;
  }
};

function vec2(x, y) {
  this.x = x;
  this.y = y;
}

var fps = 30;
var cheatMode = false;
var building = false;
var gravity = c.height * 0.0025;
var cameraOffset = new vec2(0, 0);
var levels = data;
// The object arrays are in order of rendering
var objectNames = ["backgrounds", "crates", "walls", "doors", "buttons", "princesses"];
var objectColliders = ["", "collide(side, object)", "collide(side, object)", "collide(side, object)", "object.pressed = true"];
for(var i = 0; i < levels.length; i++) {
  for(var j = 0; j < objectNames.length; j++) {
    var objectLength = eval("levels[i]." + objectNames[j] + ".length");
    for(var k = 0; k < objectLength; k++) {
      eval("levels[i]." + objectNames[j] + "[k].pos.x *= c.height");
      eval("levels[i]." + objectNames[j] + "[k].pos.y *= c.height");
      eval("levels[i]." + objectNames[j] + "[k].size.x *= c.height");
      eval("levels[i]." + objectNames[j] + "[k].size.y *= c.height");
      
      if(objectNames[j] == "doors") {
        eval("levels[i]." + objectNames[j] + "[k].origPos.x *= c.height");
        eval("levels[i]." + objectNames[j] + "[k].origPos.y *= c.height");
      }
    }
  }
}

var textureFiles = ["boi", "wall", "brick", "boi2", "boi3", "boi4", "crate", "crate2", "princess", "princess2", "princess3", "button", "button2"];
var textures = [];
for(var i = 0; i < textureFiles.length; i++) {
  textures.push(new Image());
  textures[i].src = "Textures/" + textureFiles[i] + ".png";
}

textures[textures.length - 1].onload = function() {
  for(var i = 0; i < textures.length; i++) {
    if(textures[i].width <= textures[i].height) {
      levels[0].backgrounds.push(new background(i * c.height * 0.1 + c.height * -1, c.height * -1.1, textures[i].width / (textures[i].height / (c.height * 0.1)), c.height * 0.1, i, false, 0.1));
    } else {
      levels[0].backgrounds.push(new background(i * c.height * 0.1 + c.height * -1, c.height * -1.1, c.height * 0.1, textures[i].height / (textures[i].width / (c.height * 0.1)), i, false, 0.1));
    }
  }
}

var score = 0;
var highScore = parseInt(document.cookie.substring(10));
if(highScore == "") {
  document.cookie = "highScore=0";
  highScore = 0;
}

window.onbeforeunload = function() {
  document.cookie = "highScore=" + highScore;
}

var prevTime = 0;
var time = 0;
var actualFps = 0;
var avgFps = -1;
var avgSize = 1;

var loop = setInterval(update, 1000 / fps);
function update() {
  time = window.performance.now();
  
  score = time;
  if(score > highScore) {
    highScore = score;
  }
  
  // Movement
  if(player.onGround || cheatMode) {
    player.vel.x += player.acc.x;
  } else {
    player.vel.x += player.acc.x / 4;
  }
  player.vel.y += player.acc.y;

  player.onGround = false;
  player.onWall = false;
  player.onCrate = false;
  if(!cheatMode) {
    player.vel.y += gravity;
  }
  
  // Buttons
  for(var i = 0; i < levels[0].buttons.length; i++) {
    levels[0].buttons[i].pressed = false;
  }
  
  // Crates
  for(var i = 0; i < levels[0].crates.length; i++) {
    levels[0].crates[i].update();
  }

  // Collisions
  for(var i = 0; i < levels.length; i++) {
    for(var j = 0; j < objectNames.length; j++) {
      collideObjects(eval("levels[i]." + objectNames[j]), objectColliders[j]);
    }
  }
  
  // Buttons
  for(var i = 0; i < levels[0].signals.length; i++) {
    levels[0].signals[i] = false;
  }
  
  for(var i = 0; i < levels[0].buttons.length; i++) {
    if(levels[0].buttons[i].pressed) {
      levels[0].buttons[i].texture = 12;
    } else {
      levels[0].buttons[i].texture = 11;
    }
    
    if(levels[0].buttons[i].pressed) {
      levels[0].signals[levels[0].buttons[i].id] = true;
    }
  }
  
  // Doors
  for(var i = 0; i < levels[0].doors.length; i++) {
    levels[0].doors[i].update();
  }
  
  // Animations
  if(player.acc.x != 0 && (player.currentAnim != 0 || player.acc.x != player.prevAcc.x) && player.onGround) {
    player.setAnim(0);
    if(player.acc.x > 0) {
      player.textureFlipped = false;
    } else {
      player.textureFlipped = true;
    }
  }
  
  if(player.onGround && !player.onCrate && player.currentAnim != 1 && player.acc.x == 0) {
    player.setAnim(1);
    player.textureFlipped = false;
  }
  
  if(!player.onGround && player.currentAnim != 3) {
    player.setAnim(3);
    player.textureFlipped = false;
  }
  
  if(player.onWall && player.currentAnim != 2) {
    player.setAnim(2);
    if(player.acc.x > 0) {
      player.textureFlipped = false;
    } else {
      player.textureFlipped = true;
    }
  }
  
  if(player.onCrate && player.currentAnim != 4) {
    player.setAnim(4);
    if(player.acc.x > 0) {
      player.textureFlipped = false;
    } else {
      player.textureFlipped = true;
    }
  }
  
  if(cheatMode && player.currentAnim != 1) {
    player.setAnim(1);
    player.textureFlipped = false;
  }
  
  player.animTimer++;
  if(player.animTimer >= player.anims[player.currentAnim][player.currentAnimFrame].time) {
    player.animTimer = 0;
    if(player.currentAnimFrame < player.anims[player.currentAnim].length - 1) {
      player.currentAnimFrame++;
    } else {
      player.currentAnimFrame = 0;
    }
    player.texture = player.anims[player.currentAnim][player.currentAnimFrame].texture;
  }
  
  levels[0].princesses[0].update();
  
  // Friction
  if(!cheatMode) {
    if(player.onGround) {
      player.vel.x /= 1.7;
    } else {
      player.vel.x /= 1.15;
    }
    if(player.onWall) {
      player.vel.y /= 1.5;
    }
  }

  // Player and camera movement
  player.pos.x += player.vel.x;
  player.pos.y += player.vel.y;

  cameraOffset.x += ((player.pos.x - c.width * 0.5) - cameraOffset.x) * 0.1;
  cameraOffset.y += ((player.pos.y - c.height * 0.5 + player.size.y) - cameraOffset.y) * 0.1;
  
  player.prevAcc.x = player.acc.x;
  player.prevAcc.y = player.acc.y;
  
  player.prevInteracting = player.interacting;

  draw();
  
  actualFps = 1000 / (time - prevTime);
  if(avgFps == -1) {
    avgFps = actualFps;
  } else {
    avgFps = avgFps * avgSize + actualFps;
    avgFps /= avgSize + 1;
    avgSize++;
  }
  prevTime = time;
}

function draw() {
  // Clear screen
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, c.width, c.height);
  
  // Objects
  for(var i = 0; i < levels.length; i++) {
    for(var j = 0; j < objectNames.length; j++) {
      var objects = eval("levels[i]." + objectNames[j]);
      for(var k = 0; k < objects.length; k++) {
        if(objects[k].repeating) {
          var pattern = ctx.createPattern(textures[objects[k].texture], "repeat");
          ctx.fillStyle = pattern;
          ctx.save();
          ctx.translate(objects[k].pos.x - cameraOffset.x, objects[k].pos.y - cameraOffset.y);
          // Scale to fit entire screen and then scale down to right size
          var s = c.height / textures[objects[k].texture].height;
          var repeatSize = objects[k].repeatSize;
          ctx.scale(s, s);
          ctx.scale(repeatSize, repeatSize);
          ctx.fillRect(0, 0, objects[k].size.x / s / repeatSize, objects[k].size.y / s / repeatSize);
          ctx.restore();
        } else {
          if(objects[k].textureFlipped) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(textures[objects[k].texture], -objects[k].pos.x + cameraOffset.x - objects[k].size.x, objects[k].pos.y - cameraOffset.y, objects[k].size.x, objects[k].size.y);
            ctx.restore();
          } else {
            ctx.drawImage(textures[objects[k].texture], objects[k].pos.x - cameraOffset.x, objects[k].pos.y - cameraOffset.y, objects[k].size.x, objects[k].size.y);
          }
        }
        
        if(objects[k].constructor.name == "button") {
          ctx.fillStyle = "hsl(" + objects[k].id * (360 / levels[0].signals.length) + ", 100%, 50%)";
          if(!objects[k].pressed) {
            ctx.fillRect(objects[k].pos.x - cameraOffset.x + objects[k].size.x / 2 - 0.01 * c.height, objects[k].pos.y - cameraOffset.y, 0.02 * c.height, 0.005 * c.height);
          } else {
            ctx.fillRect(objects[k].pos.x - cameraOffset.x + objects[k].size.x / 2 - 0.01 * c.height, objects[k].pos.y - cameraOffset.y + objects[k].size.y / 2, 0.02 * c.height, 0.005 * c.height);
          }
        }
        
        if(objects[k].constructor.name == "door") {
          ctx.fillStyle = "hsl(" + objects[k].id * (360 / levels[0].signals.length) + ", 100%, 50%)";
          ctx.fillRect(objects[k].pos.x - cameraOffset.x + objects[k].size.x / 2 - 0.01 * c.height, objects[k].pos.y - cameraOffset.y, 0.02 * c.height, 0.005 * c.height);
        }
      }
    }
  }
  
  if(cheatMode) {
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(player.pos.x - cameraOffset.x, player.pos.y - cameraOffset.y, player.size.x, player.size.y);
  }
  var w = textures[player.texture].width / (textures[player.texture].height / player.size.y);
  
  if(player.textureFlipped) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(textures[player.texture], 
                -(player.pos.x - cameraOffset.x - (-w - player.size.x) / 2), 
                player.pos.y - cameraOffset.y, 
                w, 
                player.size.y);
    ctx.restore();
  } else {
    ctx.drawImage(textures[player.texture], 
                player.pos.x - cameraOffset.x - (w - player.size.x) / 2, 
                player.pos.y - cameraOffset.y, 
                w, 
                player.size.y);
  }
  ctx.globalCompositeOperation = "source-over";
  
  
  
  ctx.fillStyle = "rgb(255, 255, 255, 0.75)";
  ctx.fillRect(0, 0, c.height * 0.15, c.height * 0.2);
  
  ctx.fillStyle = "rgb(0, 0, 0, 0.75)";
  ctx.font = c.height * 0.02 + "px Arial";
  ctx.fillText("fps: " + Math.round(actualFps * 10) / 10, c.height * 0.01, c.height * 0.03);
  ctx.fillText("avg. fps: " + Math.round(avgFps * 10) / 10, c.height * 0.01, c.height * 0.06);
  ctx.fillText("score: " + Math.round(score / 100) / 10, c.height * 0.01, c.height * 0.09);
  ctx.fillText("highscore: " + Math.round(highScore / 100) / 10, c.height * 0.01, c.height * 0.12);
}


function collideObjects(objects, onCollide) {
  if(!cheatMode) {
    for(var i = 0; i < objects.length; i++) {
      var object = objects[i];

      // Check collision in x direction
      var player_ = JSON.parse(JSON.stringify(player));
      player_.pos.x += player_.vel.x;
      if(checkCollision(player_, object)) {
        // Get closest side
        if(Math.abs((object.pos.x + object.size.x) - player.pos.x) < 
          Math.abs(object.pos.x - (player.pos.x + player.size.x))) {
          side = 3;
          eval(onCollide);
        } else {
          side = 1;
          eval(onCollide);
        }
      }

      // Check collision in y direction
      player_ = JSON.parse(JSON.stringify(player));
      player_.pos.y += player_.vel.y;
      if(checkCollision(player_, object)) {
        // Get closest side
        if(Math.abs((object.pos.y + object.size.y) - player.pos.y) < 
          Math.abs(object.pos.y - (player.pos.y + player.size.y))) {
          side = 0;
          eval(onCollide);
        } else {
          side = 2;
          eval(onCollide);
        }
      }
    }
  }
}

// Solid collision
function collide(side, object) {
  switch(side) {
  case 0: // Up
    player.vel.y = 0;
    player.pos.y = object.pos.y + object.size.y;
    break;
  case 1: // Right
    player.vel.x = 0;
    player.pos.x = object.pos.x - player.size.x;
    player.onWall = true;
    break;
  case 2: // Down
    player.vel.y = 0;
    player.pos.y = object.pos.y - player.size.y;
    player.onGround = true;
    player.wallJumped = false;
    break;
  case 3: // Left
    player.vel.x = 0;
    player.pos.x = object.pos.x + object.size.x;
    player.onWall = true;
    break;
  }
}

// AABB
function checkCollision(colliderA, colliderB) {
  if(colliderA.pos.x + colliderA.size.x > colliderB.pos.x &&
    colliderA.pos.y + colliderA.size.y > colliderB.pos.y &&
    colliderA.pos.x < colliderB.pos.x + colliderB.size.x && 
    colliderA.pos.y < colliderB.pos.y + colliderB.size.y) {
    return true;  
  } else {
    return false;
  }
}

window.onmousedown = function(e) {
  if(cheatMode) {
    if(!building) {
      levels[0].walls.push(new wall(Math.round(e.clientX + cameraOffset.x), Math.round(e.clientY + cameraOffset.y), 0.1 * c.height, 0.1 * c.height, 1));
      building = true;
      return;
    }
    if(building) {
      building = false;
      var wall_ = levels[0].walls[levels[0].walls.length - 1];
      console.log("data[0].walls.push(new wall(" + 
                  wall_.pos.x / c.height + ", " + 
                  wall_.pos.y / c.height + ", " + 
                  wall_.size.x / c.height + ", " + 
                  wall_.size.y / c.height + ", 1));");
      return;
    }
  }
}

window.onmousemove = function(e) {
  if(cheatMode && building) {
    var wall_ = levels[0].walls[levels[0].walls.length - 1];
    wall_.size.x = e.clientX + cameraOffset.x - wall_.pos.x;
    wall_.size.y = e.clientY + cameraOffset.y - wall_.pos.y;
  }
}

window.onkeydown = function(e) {
  switch(e.keyCode) {
  case 39: // Right
  case 68:
    player.acc.x = player.speed;
    break;
    
  case 37: // Left
  case 65:
    player.acc.x = -player.speed;
    break;
    
  case 38: // Up
  case 87:
    if(!cheatMode) {
      if(player.onGround) {
        player.vel.y = -player.jumpStrength;
        player.onGround = false;
      } else if(player.onWall && !player.wallJumped) {
        player.vel.y = -player.jumpStrength;
        player.vel.x += player.wallJumpStrength * -Math.max(Math.min(player.acc.x, 1), -1);
        player.onWall = false;
        player.wallJumped = true;
      }
    } else {
      player.acc.y = -player.speed;
    }
    break;
    
  case 83:
  case 40:
    if(cheatMode) {
      player.acc.y = player.speed
    }
    break;
    
  case 8:
    cheatMode = !cheatMode;
    player.vel.x = 0;
    player.vel.y = 0;
    player.acc.x = 0;
    player.acc.y = 0;
    break;
  
  case 32:
    player.interacting = true;
    break;
  }
}

window.onkeyup = function(e) {
  switch(e.keyCode) {
  case 39: // Right
  case 68:
    if(player.acc.x > 0) {
      player.acc.x = 0;
    }
    if(cheatMode) {
      player.vel.x = 0;
    }
    break;
    
  case 37: // Left
  case 65:
    if(player.acc.x < 0) {
      player.acc.x = 0;
    }
    if(cheatMode) {
      player.vel.x = 0;
    }
    break;
    
  case 38: // Up
  case 87:
    if(cheatMode) {
      player.acc.y = 0;
      player.vel.y = 0;
    }
    break;
    
  case 83:
  case 40:
    if(cheatMode) {
      player.acc.y = 0
      player.vel.y = 0;
    }
    break;
    
  case 32:
    player.interacting = false;
    break;
  }
}