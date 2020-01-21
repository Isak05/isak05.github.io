var c = document.getElementById("c");
c.width = screen.width;
c.height = screen.height;
var ctx = c.getContext("2d");
ctx.imageSmoothingEnabled = false;

var textureFiles = ["Player/boi", "wall", "brick", "Player/boi2", "Player/boi3", "Player/boi4", "crate", "crate2", "princess", "princess2", "princess3", "button", "button2", "spike", "chain", "skull", "Player/boi5", "Player/boi6", "Player/boi7", "wall2", "wall3", "wall4", "robot", "robot2", "robot3", "laser", "heart", "lava", "door", "smoke", "heart2", "heart3", "chest", "key", "gun", "chest2"];
var textures = [];
for(var i = 0; i < textureFiles.length; i++) {
  textures.push(new Image());
  textures[i].src = "Textures/" + textureFiles[i] + ".png";
}

loadLevels();

var player = {
  pos: JSON.parse(JSON.stringify(levels[0].spawnPoint)),
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
  pullingCrate: false,
  wallJumped: false,
  wallJumpStrength: c.height * 0.02,
  jumpStrength: c.height * 0.035,
  anims: [[{texture: 0, time: 4}, {texture: 3, time: 4}],
          [{texture: 0, time: 0}],
          [{texture: 4, time: 0}],
          [{texture: 5, time: 0}], 
          [{texture: 16, time: 5}, {texture: 17, time: 5}],
          [{texture: 16, time: 5}, {texture: 17, time: 5}], 
          [{texture: 16, time: 0}]],
  animTimer: 0,
  currentAnimFrame: 0,
  currentAnim: 1,
  texture: 0,
  textureFlipped: false,
  invulnerableTimer: 0,
  spawnTimer: 15,
  setAnim: function(x) {
    this.animTimer = 0;
    this.currentAnimFrame = 0;
    this.currentAnim = x;
    this.texture = this.anims[x][this.currentAnimFrame].texture;
  },
  die: function() {
    this.pos = JSON.parse(JSON.stringify(levels[0].spawnPoint));
    this.vel = new vec2(0, 0);
    this.onGround = false;
    this.hp = 100;
    this.invulnerableTimer = 0;
    this.spawnTimer = 30;
    loadLevels();
  }, 
  damage: function(n) {
    if(this.invulnerableTimer <= 0) {
      this.func = function() {
        return {x: Math.random() * 10 - 5, y: Math.random() * 10};
      }
      this.bloodTime = 5;
      levels[0].particleEmitters.push(new particleEmitter((this.pos.x + player.size.x / 2) / c.height, (this.pos.y + player.size.y / 2) / c.height, this.func, 0.005 + n * 0.00025, 0.005 + n * 0.00025, 0, 0, 10, 26, n / 50));
      this.bloodParticle = levels[0].particleEmitters.length - 1;
      this.hp -= n;
      this.invulnerableTimer = 15;
      if(this.hp <= 0) {
        this.invulnerableTimer = 30;
        this.hp = 0;
      }
    }
  },
  hp: 100,
  bloodParticle: -1,
  bloodTime: 0
};

function vec2(x, y) {
  this.x = x;
  this.y = y;
}

var fps = 30;
var cheatMode = false;
var building = false;
var editMode = false;
var mousePos = {x: 0, y: 0};
var selectedTexture = 0;
var selectedType = 0;
var editRepeating = false;
var editRepeatSize = 0.1;
var editId = 0;
var editSnap = 0.01;
var selectedSetting = -1;
var settingLength = 5;
var setting = -1;
var deleting = false;
var gravity = c.height * 0.0025;
var cameraOffset = new vec2(player.pos.x - c.width / 2, player.pos.y - c.height * 1);
var godMode = false;

// The object arrays are in order of rendering
var objectNames = ["backgrounds", "crates", "walls", "doors", "buttons", "npcs", "deaths", "foregrounds", "pickups"];
var objectColliders = ["", "collide(side, object)", "collide(side, object)", "collide(side, object)", "object.pressed = true", "", "collide(side, object); player.damage(50 - Math.round(Math.random() * 20))", "", "object.onPickup(); objects.splice(i, 1); i--"];

var score = 0;
var highScore = parseInt(document.cookie.substring(10));
if(!highScore) {
  document.cookie = "highScore=0";
  highScore = 0;
}

window.onbeforeunload = function() {
  document.cookie = "highScore=" + highScore;
}

var cv = document.createElement("canvas");
cv.width = c.width;
cv.height = c.width;
var ctxv = cv.getContext("2d");
var v = ctx.createRadialGradient(c.width / 2, c.width / 2, c.width / 2, c.width / 2, c.width / 2, 0);
v.addColorStop(0, "rgb(255, 0, 0, 1)");
v.addColorStop(1, "rgb(255, 0, 0, 0)");
ctxv.fillStyle = v;
ctxv.fillRect(0, 0, cv.width, cv.height);
var vignette = new Image();
vignette.src = cv.toDataURL();

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
  
  if(godMode) {
    player.hp = Infinity;
  } else if(player.hp > 100) {
    player.hp = 100;
  }
  
  if(player.bloodTime > 0) {
    player.bloodTime--;
  }
  
  if(player.bloodTime <= 0 && player.bloodParticle != -1) {
    levels[0].particleEmitters[player.bloodParticle].enabled = false;
    if(levels[0].particleEmitters[player.bloodParticle].particles.length == 0) {
      levels[0].particleEmitters.splice(player.bloodParticle, 1);
      player.bloodParticle = -1;
    }
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
  player.pullingCrate = false;
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
  
  // Pickups
  for(var i = 0; i < levels[0].pickups.length; i++) {
    levels[0].pickups[i].update();
  }
  
  // Animations
  if(player.acc.x != 0 && (player.currentAnim != 0 || player.acc.x != player.prevAcc.x) && player.onGround && !player.onCrate) {
    player.setAnim(0);
    if(player.acc.x > 0) {
      player.textureFlipped = false;
    } else {
      player.textureFlipped = true;
    }
  }
  
  if(player.onGround && !player.onCrate && player.currentAnim != 1 && player.acc.x == 0) {
    player.setAnim(1);
  }
  
  if((!player.onGround && player.currentAnim != 3) || (!player.onGround && player.acc.x != player.prevAcc.x)) {
    player.setAnim(3);
    if(player.acc.x > 0) {
      player.textureFlipped = false;
    } else {
      player.textureFlipped = true;
    }
  }
  
  if(player.onWall && player.currentAnim != 2 && !player.onCrate) {
    player.setAnim(2);
    if(player.acc.x > 0) {
      player.textureFlipped = false;
    } else {
      player.textureFlipped = true;
    }
  }
  
  if(((player.onCrate && player.currentAnim != 4 && !player.pullingCrate) || (player.currentAnim == 4 && player.acc.x != player.prevAcc.x && player.acc.x != 0)) && player.acc.x != 0) {
    player.setAnim(4);
    if(player.acc.x > 0) {
      player.textureFlipped = false;
    } else {
      player.textureFlipped = true;
    }
  }
  
  if((player.onCrate && player.currentAnim != 5 && player.pullingCrate) || (player.currentAnim == 4 && player.acc.x != player.prevAcc.x && player.acc.x != 0)) {
    player.setAnim(5);
    if(player.acc.x > 0) {
      player.textureFlipped = true;
    } else {
      player.textureFlipped = false;
    }
  }
  
  if(player.onCrate && player.acc.x == 0 && player.anim != 0) {
    player.setAnim(6);
  }
  
  if(cheatMode && player.currentAnim != 1) {
    player.setAnim(1);
    player.textureFlipped = false;
  }
  
  if(player.hp <= 0) {
    player.setAnim(1);
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
  
  // Npcs
  for(var i = 0; i < levels[0].npcs.length; i++) {
    levels[0].npcs[i].update();
    if(levels[0].npcs[i].delete) {
      levels[0].npcs.splice(i, 1);
      i--;
      continue;
    }
  }
  
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
  if(player.hp > 0) {
    player.pos.x += player.vel.x;
    player.pos.y += player.vel.y;
  }

  cameraOffset.x += ((player.pos.x - c.width * 0.5) - cameraOffset.x) * 0.1;
  cameraOffset.y += ((player.pos.y - c.height * 0.5 + player.size.y) - cameraOffset.y) * 0.1;
  
  player.prevAcc.x = player.acc.x;
  player.prevAcc.y = player.acc.y;
  
  player.prevInteracting = player.interacting;
  
  // Player death
  if(player.invulnerableTimer > 0) {
    player.invulnerableTimer--;
  }
  if(player.hp <= 0 && player.invulnerableTimer <= 0) {
    player.die();
  }
  if(player.spawnTimer > 0) {
    player.spawnTimer--;
  }

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
  if(player.invulnerableTimer > 0) {
    var t = Math.min(player.invulnerableTimer / 15, 0.75);
    cameraOffset.x += Math.random() * 50 * t - 25 * t;
    cameraOffset.y += Math.random() * 50 * t - 25 * t;
  }
  for(var i = 0; i < levels.length; i++) {
    for(var j = 0; j < objectNames.length; j++) {
      var objects = eval("levels[i]." + objectNames[j]);
      if(objects.length != 0 && objects[0].constructor.name == "foreground") {
        if(cheatMode) {
          ctx.globalCompositeOperation = "destination-out";
          drawPlayer();
          ctx.globalCompositeOperation = "destination-over";
          ctx.fillStyle = "rgb(255, 0, 0, 0.5)";
          ctx.fillRect(0, 0, c.width, c.height);
          drawPlayer();
          ctx.globalCompositeOperation = "source-over";
        } else {
          if(player.invulnerableTimer > 0) {
            var t = Math.min(player.invulnerableTimer / 15, 0.75);
            ctx.globalCompositeOperation = "destination-out";
            drawPlayer();
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "rgb(255, 255, 255, " + t + ")";
            ctx.fillRect(0, 0, c.width, c.height);
            drawPlayer();
            ctx.globalCompositeOperation = "source-over";
          } else {
            drawPlayer();
          }
        }
      }
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
  
  for(var i = 0; i < levels[0].particleEmitters.length; i++) {
    levels[0].particleEmitters[i].update();
    for(var j = 0; j < levels[0].particleEmitters[i].particles.length; j++) {
      var p = levels[0].particleEmitters[i].particles[j];
      ctx.globalAlpha = p.opacity;
      ctx.drawImage(textures[p.texture], p.pos.x - cameraOffset.x, p.pos.y - cameraOffset.y, p.size.x, p.size.y);
      ctx.globalAlpha = 1;
    }
  }
  
  for(var i = 0; i < levels[0].projectiles.length; i++) {
    var p = levels[0].projectiles[i];
    p.update();
    if(p.textureFlipped) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(textures[p.texture], cameraOffset.x - p.pos.x - p.size.x, p.pos.y - cameraOffset.y, p.size.x, p.size.y);
      ctx.restore();
    } else {
      ctx.drawImage(textures[p.texture], p.pos.x - cameraOffset.x, p.pos.y - cameraOffset.y, p.size.x, p.size.y);
    }
    if(p.delete) {
      levels[0].projectiles.splice(i, 1);
      i--;
      continue;
    }
  }
  
  // Vignette
  var heartbeat = Math.max(0, Math.sin((time / (player.hp * 5 + 250)) % 3.3 * Math.PI)) * (1 - player.hp * 1.5 / 100 - 0.25) * 0.2;
  if(player.hp > 50) {
    heartbeat = 0;
  }
  if(player.hp < 75) {
    ctx.globalAlpha = (1 - player.hp / 100) ** 4 * 0.75 + heartbeat;
  } else {
    ctx.globalAlpha = 0;
  }
  ctx.drawImage(vignette, 0, 0, c.width, c.height);
  ctx.globalAlpha = 1;
  
  // Hp
  var tex = 26;
  if(player.hp <= 66) {
    tex = 30;
  }
  if(player.hp <= 33) {
    tex = 31;
  }
  ctx.drawImage(textures[tex], 5, 5, 35, 35);
  
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(45, 5, 260, 35);
  
  if(player.hp > 500) {
    ctx.fillStyle = "hsl(" + time / 5 + ", 100%, " + (40 + player.invulnerableTimer * 5) + "%)";
    ctx.fillRect(50, 10, 100 / 100 * 250, 25);
  } else {
    ctx.fillStyle = "hsl(" + player.hp + ", 100%, " + (40 + player.invulnerableTimer * 5) + "%)";
    ctx.fillRect(50, 10, player.hp / 100 * 250, 25);
  }
  
  var offset = 0.1 * c.height;
  
  if(cheatMode && editMode) {
    ctx.fillStyle = "rgb(255, 255, 255, 0.5)";
    ctx.beginPath();
    var pos = {x: Math.round((mousePos.x + cameraOffset.x) / (editSnap * c.height)) * (editSnap * c.height), y: Math.round((mousePos.y + cameraOffset.y) / (editSnap * c.height)) * (editSnap * c.height)};
    ctx.ellipse(pos.x - cameraOffset.x, pos.y - cameraOffset.y, 10, 10, 0, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  
    ctx.fillStyle = "rgb(255, 255, 255, 0.5)";
    
    for(var i = 0; i < textures.length; i++) {
      if(selectedTexture == i) {
        ctx.fillStyle = "rgb(0, 255, 0)";
        ctx.fillRect((i % 16) * 0.1 * c.height, Math.floor(i / 16) * 0.1 * c.height, 0.1 * c.height, 0.1 * c.height);
      } else {
        ctx.fillStyle = "rgb(255, 255, 255, 0.5)";
        ctx.fillRect((i % 16) * 0.1 * c.height, Math.floor(i / 16) * 0.1 * c.height, 0.1 * c.height, 0.1 * c.height);
      }
      if(textures[i].height <= textures[i].width) {
        ctx.drawImage(textures[i], (i % 16) * 0.1 * c.height, Math.floor(i / 16) * 0.1 * c.height, 0.1 * c.height, textures[i].height * ((0.1 * c.height) / textures[i].width));
      } else {
        ctx.drawImage(textures[i], (i % 16) * 0.1 * c.height, Math.floor(i / 16) * 0.1 * c.height, textures[i].width * ((0.1 * c.height) / textures[i].height), 0.1 * c.height);
      }
    }
    
    ctx.fillStyle = "rgb(255, 255, 255, 0.75)";
    ctx.fillRect(0, 0.425 * c.height + offset, 0.175 * c.height, 0.22 * c.height);
    
    for(var i = 0; i < objectNames.length; i++) {
      if(selectedType == i) {
        ctx.fillStyle = "rgb(0, 200, 0)";
      } else {
        ctx.fillStyle = "rgb(0, 0, 0)";
      }
      ctx.font = c.height * 0.025 + "px Arial";
      ctx.fillText(objectNames[i], 0.005 * c.height, i * c.height * 0.025 + c.height * 0.45 + offset);
    }
    
    ctx.fillStyle = "rgb(255, 255, 255, 0.75)";
    ctx.fillRect(0, 0.2125 * c.height + offset, 0.2 * c.height, 0.2 * c.height );
       
    ctx.font = c.height * 0.025 + "px Arial";
    
    ctx.fillStyle = "rgb(0, 0, 0)";
    if(selectedSetting == 0) ctx.fillStyle = "rgb(0, 200, 0)";
    ctx.fillText("repeating: " + editRepeating, 0.005 * c.height, c.height * 0.245 + offset);
    
    ctx.fillStyle = "rgb(0, 0, 0)";
    if(selectedSetting == 1) ctx.fillStyle = "rgb(0, 200, 0)";
    ctx.fillText("repeat size: " + editRepeatSize, 0.005 * c.height, c.height * 0.275 + offset);
    
    ctx.fillStyle = "rgb(0, 0, 0)";
    if(selectedSetting == 2) ctx.fillStyle = "rgb(0, 200, 0)";
    ctx.fillText("delete", 0.005 * c.height, c.height * 0.305 + offset);
    
    ctx.fillStyle = "rgb(0, 0, 0)";
    if(selectedSetting == 3) ctx.fillStyle = "rgb(0, 200, 0)";
    ctx.fillText("id: " + editId, 0.005 * c.height, c.height * 0.335 + offset);
    
    ctx.fillStyle = "rgb(0, 0, 0)";
    if(selectedSetting == 4) ctx.fillStyle = "rgb(0, 200, 0)";
    ctx.fillText("snap: " + editSnap, 0.005 * c.height, c.height * 0.365 + offset);
  }
  
  var xOff = 1 * c.width - 0.15 * c.height;
  ctx.fillStyle = "rgb(255, 255, 255, 0.75)";
  ctx.fillRect(xOff, 0, c.height * 0.15, c.height * 0.2);
  
  ctx.fillStyle = "rgb(0, 0, 0, 0.75)";
  ctx.font = c.height * 0.02 + "px Arial";
  ctx.fillText("fps: " + Math.round(actualFps * 10) / 10, c.height * 0.01 + xOff, c.height * 0.03);
  ctx.fillText("avg. fps: " + Math.round(avgFps * 10) / 10, c.height * 0.01 + xOff, c.height * 0.06);
  ctx.fillText("score: " + Math.round(score / 100) / 10, c.height * 0.01 + xOff, c.height * 0.09);
  ctx.fillText("highscore: " + Math.round(highScore / 100) / 10, c.height * 0.01 + xOff, c.height * 0.12);
  
  ctx.fillStyle = "hsl(" + time / 5 + ", 100%, 50%)";
  ctx.font = "1000 " + c.height * 0.1 + "px Arial";
  ctx.fillText("HEJ", -2.6 * c.height - cameraOffset.x, 0 - cameraOffset.y);
  
  if(player.hp <= 0) {
    ctx.fillStyle = "rgb(0, 0, 0, " + (1 - player.invulnerableTimer / 30) + ")";
    ctx.fillRect(0, 0, c.width, c.height);
  }
  if(player.spawnTimer > 0) {
    ctx.fillStyle = "rgb(0, 0, 0, " + player.spawnTimer / 15 + ")";
    ctx.fillRect(0, 0, c.width, c.height);
  }
}

function drawPlayer() {
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
}


function collideObjects(objects, onCollide) {
  if(!cheatMode) {
    for(var i = 0; i < objects.length; i++) {
      var object = objects[i];

      // Check collision in x direction
      var player_ = JSON.parse(JSON.stringify(player));
      player_.pos.x += player_.vel.x;
      player_.pos.y += player_.vel.y;
      if(checkCollision(player_, object)) {
        // Get closest side
        var dist = [];
        dist.push({val: Math.abs((object.pos.y + object.size.y) - player.pos.y), id: 0});
        dist.push({val: Math.abs(object.pos.x - (player.pos.x + player.size.x)), id: 1});
        dist.push({val: Math.abs(object.pos.y - (player.pos.y + player.size.y)), id: 2});
        dist.push({val: Math.abs((object.pos.x + object.size.x) - player.pos.x), id: 3});
        
        dist.sort((a, b) => {return a.val - b.val});
        var side = dist[0].id;
        eval(onCollide);
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
  if(cheatMode && editMode) {
    if(!building) {
      if(!deleting) {
        var pos = {x: Math.round((mousePos.x + cameraOffset.x) / (editSnap * c.height)) * (editSnap * c.height), y: Math.round((mousePos.y + cameraOffset.y) / (editSnap * c.height)) * (editSnap * c.height)};
        pos.x /= c.height;
        pos.y /= c.height;
        switch(objectNames[selectedType]) {
        case "walls":
          levels[0].walls.push(new wall(pos.x, pos.y, 0.1, 0.1, selectedTexture, editRepeating, editRepeatSize));
          building = true;
          break;

        case "backgrounds":
          levels[0].backgrounds.push(new background(pos.x, pos.y, 0.1, 0.1, selectedTexture, editRepeating, editRepeatSize));
          building = true;
          break;

        case "crates":
          levels[0].crates.push(new crate(pos.x, pos.y, 0.1, 0.1));
          console.log("levels[0].crates.push(new crate(" + pos.x + ", " + pos.y + ", " + 0.1 + ", " + 0.1 + ");");
          break;
          
        case "doors":
          levels[0].doors.push(new door(pos.x, pos.y, 0.1, 0.1, editId));
          building = true;
          
          levels[0].signals = [];
          var x = 0;
          for(var i = 0; i < levels[0].doors.length; i++) {
            if(levels[0].doors[i].id > x) {
              x = levels[0].doors[i].id;
            }
          }
          for(var i = 0; i < x + 1; i++) {
            levels[0].signals.push(false);
          }
          break;
        case "buttons":
          levels[0].buttons.push(new button(pos.x, pos.y, editId));
          console.log("levels[0].buttons.push(new button(" + pos.x + ", " + pos.y + ", " + editId + "));");
          break;
        case "npcs":
          levels[0].npcs.push(new npc(pos.x, pos.y, editId));
          console.log("levels[0].npcs.push(new npc(" + pos.x + ", " + pos.y + ", " + editId + "));");
          break;
        }
        return;
      } else {
        var o;
        var j_ = 0;
        for(var i = 0; i < objectNames.length; i++) {
          var objects = eval("levels[0]." + objectNames[i]);
          for(var j = 0; j < objects.length; j++) {
            if(checkCollision(objects[j], {pos: {x: e.clientX + cameraOffset.x, y: e.clientY + cameraOffset.y}, size: {x: 0, y: 0}})) {
              o = objects;
              j_ = j;
            }
          }
        }
        console.log("Delete " + o[j_].constructor.name + " " + j_);
        o.splice(j_, 1);
      }
    }
    if(building) {
      building = false;
      var o_ = eval("levels[0]." + objectNames[selectedType] + "[levels[0]." + objectNames[selectedType] + ".length - 1]");
      if(o_.pos.x > o_.pos.x + o_.size.x) {
        o_.pos.x += o_.size.x;
        o_.size.x = Math.abs(o_.size.x);
      }
      if(o_.pos.y > o_.pos.y + o_.size.y) {
        o_.pos.y += o_.size.y;
        o_.size.y = Math.abs(o_.size.y);
      }
      var o = JSON.parse(JSON.stringify(o_));
      o.pos.x = Math.round(o.pos.x / c.height * 10000) / 10000;
      o.pos.y = Math.round(o.pos.y / c.height * 10000) / 10000;
      o.size.x = Math.round(o.size.x / c.height * 10000) / 10000;
      o.size.y = Math.round(o.size.y / c.height * 10000) / 10000;
      switch(o_.constructor.name) {
      case "wall":
        console.log("levels[0].walls.push(new wall(" + 
                    o.pos.x + ", " + 
                    o.pos.y + ", " + 
                    o.size.x + ", " + 
                    o.size.y + ", " +
                    o.texture + ", " + 
                    editRepeating + ", " + 
                    editRepeatSize + "));");
        break;
        
      case "background":
        console.log("levels[0].backgrounds.push(new background(" + 
                    o.pos.x + ", " + 
                    o.pos.y + ", " + 
                    o.size.x + ", " + 
                    o.size.y + ", " +
                    o.texture + ", " + 
                    editRepeating + ", " + 
                    editRepeatSize + "));");
        break;
        
      case "door":
        console.log("levels[0].doors.push(new door(" + 
                    o.pos.x + ", " + 
                    o.pos.y + ", " + 
                    o.size.x + ", " + 
                    o.size.y + ", " + 
                    editId + "));");
        break;
      }
      return;
    }
  }
}

window.onmousemove = function(e) {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
  if(cheatMode && building) {
    if(objectNames[selectedType] == "walls" || objectNames[selectedType] == "backgrounds" || objectNames[selectedType] == "doors") {
      var pos = {x: Math.round((mousePos.x + cameraOffset.x) / (editSnap * c.height)) * (editSnap * c.height), y: Math.round((mousePos.y + cameraOffset.y) / (editSnap * c.height)) * (editSnap * c.height)};
      var o = eval("levels[0]." + objectNames[selectedType] + "[levels[0]." + objectNames[selectedType] + ".length - 1]");;
      o.size.x = pos.x - o.pos.x;
      o.size.y = pos.y - o.pos.y;
    }
  }
}

window.onkeydown = function(e) {
if(player.hp > 0) {
  if(e.keyCode == 37 && cheatMode && editMode) {
    if(cheatMode && editMode) {
      if(selectedTexture > 0) {
        selectedTexture--;
      }
    }
  } else if(e.keyCode == 39 && cheatMode && editMode) {
    if(cheatMode && editMode) {
      if(selectedTexture < textures.length - 1) {
        selectedTexture++;
      }
    }
  } else if(e.keyCode == 38 && cheatMode && editMode) {
    if(cheatMode && editMode) {
      if(selectedSetting == -1) {
        if(selectedType > 0) {
          selectedType--;
        }
      } else {
        if(selectedSetting > 0 && setting == -1) {
          selectedSetting--;
        }
        if(setting == 0) {
          editRepeating = true;
        }
        if(setting == 1) {
          editRepeatSize += 0.01;
        }
        if(setting == 3) {
          editId++;
        }
        if(setting == 4) {
          editSnap += 0.01;
        }
      }
    }
  } else if(e.keyCode == 40 && cheatMode && editMode) {
    if(cheatMode && editMode) {
      if(selectedSetting == -1) {
        if(selectedType < objectNames.length - 1) {
          selectedType++;
        }
      } else {
        if(selectedSetting < settingLength - 1 && setting == -1) {
          selectedSetting++;
        }
        if(setting == 0) {
          editRepeating = false;
        }
        if(setting == 1) {
          editRepeatSize -= 0.01;
        }
        if(setting == 3) {
          editId--;
        }
        if(setting == 4) {
          editSnap -= 0.01;
        }
      }
    }
  } else {
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
      if(player.onCrate) {
        player.interacting = true;
      } else {
        if(!player.textureFlipped) {
        levels[0].projectiles.push(new projectile(player.pos.x / c.height, (player.pos.y + player.size.y * 0.5) / c.height, 0.025, 0, 25, false));
        } else {
          levels[0].projectiles.push(new projectile((player.pos.x - player.size.x / 2) / c.height, (player.pos.y + player.size.y * 0.5) / c.height, -0.025, 0, 25, false));
        }
      }
      break;

    case 69:
      if(cheatMode) {
        editMode = !editMode;
      }
      break;
      
    case 82:
      editRepeating = !editRepeating;
      break;
      
    case 79:
      if(selectedSetting == -1) {
        selectedSetting = 0;
      } else {
        selectedSetting = -1;
        setting = -1;
      }
      deleting = false;
      break;
      
    case 13:
      if(setting != -1) {
        setting = -1;
      } else if(setting == -1 && selectedSetting != -1) {
        setting = selectedSetting;
      } 
      if(setting == 2) {
        deleting = true;
      } else {
        deleting = false;
      }
      break;
    case 71:
      if(cheatMode) {
        godMode = !godMode;
      }
      break;
    }
  }
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