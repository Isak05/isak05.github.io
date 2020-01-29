function loadLevel(id) {
  var res = new level_();

  switch(id) {
  case 0:
    res.spawnPoint = {x: 0.3 * c.height, y: 0.15 * c.height};
    res.end = {x: 0.2 * c.height, y: -1 * c.height};
    
    res.walls.push(new wall(0.7, 0.9, 0.8, 0.05, 19, true, 0.05));
    res.walls.push(new wall(1.45, 0.3, 0.05, 0.6, 19, true, 0.05));
    res.walls.push(new wall(0.7, 0.3, 0.05, 0.6, 19, true, 0.05));
    res.walls.push(new wall(-0.2, 0.3, 0.7, 0.05, 19, true, 0.05));
    res.walls.push(new wall(0.7, 0.05, 0.8, 0.05, 19, true, 0.05));
    res.walls.push(new wall(0.9, 0.6, 0.4, 0.02, 19, true, 0.05));
    res.walls.push(new wall(0.5, 0.7, 0.2, 0.01, 19, true, 0.05));
    res.walls.push(new wall(-0.2, 0.9, 0.4, 0.05, 21, true, 0.05));
    res.walls.push(new wall(-0.25, 0.4, 0.05, 0.55, 20, true, 0.05));
    res.walls.push(new wall(-0.7, 0.4, 0.45, 0.05, 20, true, 0.05));
    res.walls.push(new wall(-0.05, 0, 0.45, 0.05, 19, true, 0.05));
    res.walls.push(new wall(0.1, -0.35, 0.05, 0.35, 19, true, 0.05));
    res.walls.push(new wall(0.8, -0.35, 0.05, 0.4, 19, true, 0.05));
    res.walls.push(new wall(0.1, -0.4, 0.75, 0.05, 19, true, 0.05));
    res.walls.push(new wall(-0.2, 0.9, 0.9, 0.05, 21, true, 0.05));
    res.walls.push(new wall(-3.15, 0.3, 2.55, 0.05, 20, true, 0.05));
    res.walls.push(new wall(1.5, 0.3, 0.8, 0.05, 19, true, 0.05));
    res.walls.push(new wall(-0.05, -0.65, 0.05, 0.65, 19, true, 0.05));
    res.walls.push(new wall(2.15, 0.05, 0.1, 0.1, 19, true, 0.1));
    res.walls.push(new wall(1.6, -0.1, 0.2, 0.05, 19, true, 0.05));
    res.walls.push(new wall(1.6, -0.4, 0.65, 0.05, 19, true, 0.05));
    res.walls.push(new wall(2.1, -0.6, 0.15, 0.05, 20, true, 0.05));
    res.walls.push(new wall(1.45, -0.9, 0.65, 0.05, 20, true, 0.05));
    res.walls.push(new wall(2.05, -0.85, 0.05, 0.3, 20, true, 0.05));
    res.walls.push(new wall(1.5, -0.05, 0.1, 0.05, 19, true, 0.05));
    res.walls.push(new wall(2.45, 1.4, 0.55, 0.05, 21, true, 0.05));
    res.walls.push(new wall(1.45, -0.65, 0.05, 0.7, 19, true, 0.05));
    res.walls.push(new wall(2.25, -0.65, 0.05, 0.95, 19, true, 0.05));
    res.walls.push(new wall(-0.05, -1, 0.05, 0.35, 19, true, 0.05));
    res.walls.push(new wall(-0.85, -0.15, 0.8, 0.05, 19, true, 0.05));
    res.walls.push(new wall(-0.9, -0.15, 0.05, 0.45, 19, true, 0.05));
    res.walls.push(new wall(0.55, -1.2, 0.05, 0.4, 19, true, 0.05));
    res.walls.push(new wall(-0.05, -1.2, 0.6, 0.05, 19, true, 0.05));
    res.walls.push(new wall(-0.05, -1.15, 0.05, 0.15, 19, true, 0.05));
    res.walls.push(new wall(0.8, -0.65, 0.65, 0.05, 19, true, 0.05));
    res.walls.push(new wall(0, -0.65, 0.8, 0.05, 21, true, 0.05));
    res.walls.push(new wall(-0.2, 0.35, 0.05, 0.05, 19, true, 0.05));
    res.walls.push(new wall(0.6, -1, 0.9, 0.05, 19, true, 0.05));
    res.walls.push(new wall(1.45, -0.95, 0.05, 0.05, 19, true, 0.05));
   
    res.backgrounds.push(new background(-2, -2, 10, 3, 2, true, 0.1));
    res.backgrounds.push(new background(-0.75, 0.35, 0.05, 0.1, 20, true, 0.05));
    res.backgrounds.push(new background(-2.35, 0.45, 2.1, 1.2, 20, true, 0.05));
    res.backgrounds.push(new background(-2.35, 0.35, 1.75, 0.1, 20, true, 0.05));
    res.backgrounds.push(new background(-0.25, 0.95, 3.65, 0.8, 20, true, 0.05));
    res.backgrounds.push(new background(1.5, 0.35, 1.9, 0.6, 20, true, 0.05));
    res.backgrounds.push(new background(2.3, -0.65, 1.2, 1.0, 20, true, 0.05));
    res.backgrounds.push(new background(0.85, -0.65, 0.6, 0.7, 20, true, 0.05));
    res.backgrounds.push(new background(0.1, -0.65, 0.75, 0.25, 20, true, 0.05));
    res.backgrounds.push(new background(0, -0.65, 0.1, 0.65, 20, true, 0.05));
    res.backgrounds.push(new background(-2, -1.85, 1.1, 2.15, 20, true, 0.05));
    res.backgrounds.push(new background(-0.9, -1.85, 0.85, 1.7, 20, true, 0.05));

    res.crates.push(new crate(0.2, -0.2, 0.1, 0.1));
    res.crates.push(new crate(1.1, 0.3, 0.1, 0.1));
    res.crates.push(new crate(1.7, -0.6, 0.1, 0.1));
    res.crates.push(new crate(2.61, 1.25, 0.1, 0.1));
    res.crates.push(new crate(2.73, 1.25, 0.1, 0.1));
    res.crates.push(new crate(2.67, 1.1, 0.1, 0.1));

    res.buttons.push(new button(0.6, 0.885, 0));
    res.buttons.push(new button(0.75, 0.885, 0));
    res.buttons.push(new button(0.3, 0.885, 1));
    res.buttons.push(new button(2.15, 0.285, 2));
    res.buttons.push(new button(0.6, -0.665, 3));

    res.doors.push(new door(0.7, 0.1, 0.05, 0.2, 0));
    res.doors.push(new door(1.45, 0.1, 0.05, 0.2, 1));
    res.doors.push(new door(1.45, -0.85, 0.05, 0.2, 2));
    res.doors.push(new door(2.05, -0.55, 0.05, 0.15, 2));
    res.doors.push(new door(0.55, -0.8, 0.05, 0.15, 3));

    res.npcs.push(new npc(1, 0.25, 0));
    res.npcs.push(new npc(0.25, 0.5, 1));
    res.npcs.push(new npc(2.125, -0.525, 1));

    res.deaths.push(new death(-0.6, 0.35, 0.4, 0.05, 27, true, 0.05));
    res.deaths.push(new death(-5, 5, 10, 0.2, 13, true, 0.2));
    res.deaths.push(new death(1.5, -0.1, 0.1, 0.05, 13, true, 0.05));

    res.foregrounds.push(new foreground(0, 0.05, 0.03 * (4 / 6), 0.15, 14, true, 0.03));
    res.foregrounds.push(new foreground(0.1, 0.25, 0.05, 0.05, 15, false, 0));
    res.foregrounds.push(new foreground(1.9, -0.35, 0.03, 0.38, 14, true, 0.04));
    res.foregrounds.push(new foreground(1.88, 0.03, 0.07, 0.07, 15, true, 0.07));

    var func = function() {
      return {x: 0, y: -1};
    }
    res.particleEmitters.push(new particleEmitter(-0.6, 0.375, func, 0.05, 0.05, 0.4, 0, 90, 29, 0.025));
    res.particleEmitters.push(new particleEmitter(2.6, 1.3, func, 0.025, 0.025, 0.25, 0, 60, 7, 0.05));

    res.pickups.push(new pickup(-0.1, 0.8, 26, () => {player.hp = 100}));
    res.pickups.push(new pickup(-0.8, 0.15, 33, () => {keys++}));
    res.pickups.push(new pickup(1.1, 0.8, 39, () => {player.speed += 0.005 * c.height}));

    break;
    
  case 1:
    res.spawnPoint = {x: 0 * c.height, y: 0 * c.height};
    res.end = {x: 1.15 * c.height, y: 1.55 * c.height};
    
    res.walls.push(new wall(-0.4, 0, 0.8, 0.1, 38, true, 0.1));
    res.walls.push(new wall(0.2, 0.95, 0.1, 0.1, 38, true, 0.1));
    res.walls.push(new wall(-0.2, 1.05, 0.5, 0.1, 38, true, 0.1));
    res.walls.push(new wall(-0.3, 0.4, 0.5, 0.1, 38, true, 0.1));
    res.walls.push(new wall(-0.3, 1.4, 0.35, 0.05, 38, true, 0.05));
    res.walls.push(new wall(0.4, 0.7, 0.4, 0.1, 38, true, 0.1));
    res.walls.push(new wall(0.3, 0.1, 0.1, 0.4, 38, true, 0.1));
    res.walls.push(new wall(0.8, 0.4, 0.1, 0.4, 38, true, 0.1));
    res.walls.push(new wall(0.4, 0.3, 0.5, 0.1, 38, true, 0.1));
    res.walls.push(new wall(-0.3, 1.7, 1.4, 0.1, 38, true, 0.1));
    res.walls.push(new wall(0.3, 0.7, 0.1, 0.8, 38, true, 0.1));
    res.walls.push(new wall(0.4, 1.4, 0.7, 0.1, 38, true, 0.1));
    res.walls.push(new wall(-0.8, 1.7, 0.5, 0.1, 38, true, 0.1));
    res.walls.push(new wall(-0.8, 1.4, 0.1, 0.3, 38, true, 0.1));
    res.walls.push(new wall(-0.7, 1.4, 0.3, 0.1, 38, true, 0.1));
    res.walls.push(new wall(-0.4, 0.1, 0.1, 1.4, 38, true, 0.1));
    res.walls.push(new wall(0.5, 1.5, 0.2, 0.05, 38, true, 0.1));

    res.crates.push(new crate(-0.5, 1.5, 0.1, 0.1));
    res.crates.push(new crate(0.5, 0.6, 0.1, 0.1));
    res.crates.push(new crate(0.7, 1.55, 0.1, 0.1));
    
    res.backgrounds.push(new background(-1.4, -1, 2.9, 5.1, 2, true, 0.1));

    res.deaths.push(new death(0.2, 0.9, 0.1, 0.05, 13, true, 0.05));
    
    res.npcs.push(new npc(-0.1, 0.8, 1));
    
    res.doors.push(new door(0, 1.15, 0.05, 0.25, 0));
    res.doors.push(new door(0.3, 1.7, 0.05, 0.2, 1));
    res.doors.push(new door(-0.35, 1.5, 0.05, 0.2, 1));
    res.doors.push(new door(0.9, 1.5, 0.05, 0.2, 1));
    res.doors.push(new door(0.95, 1.5, 0.05, 0.2, 2));
    
    res.buttons.push(new button(-0.3, 1.385, 0));
    res.buttons.push(new button(0, 1.685, 1));
    res.buttons.push(new button(-0.7, 1.685, 2));
    res.buttons.push(new button(0.55, 1.685, 1));
    
    res.pickups.push(new pickup(-0.675, 1.525, 40, () => {player.jumpStrength += 0.0075 * c.height}));
    
    break;
    
  default:
    res.spawnPoint = {x: 0 * c.height, y: 0 * c.height};
    res.end = {x: 0.675 * c.height, y: 0 * c.height};
    
    res.walls.push(new wall(-0.3, -0.3, 1.4, 0.1, 2, true, 0.1));
    res.walls.push(new wall(-0.3, 0.3, 1.4, 0.1, 2, true, 0.1));
    res.walls.push(new wall(-0.3, -0.2, 0.1, 0.5, 2, true, 0.1));
    res.walls.push(new wall(1, -0.2, 0.1, 0.5, 2, true, 0.1));
    res.doors.push(new door(0, 1.15, 0.05, 0.25, 0));
    
    res.backgrounds.push(new background(-0.2, -0.2, 1.2, 0.5, 20, true, 0.1));
    
    break;
  }
  
  var x = 0;
  for(var i = 0; i < res.buttons.length; i++) {
    if(res.buttons[i].id > x) {
      x = res.buttons[i].id;
    }
  }
  for(var i = 0; i < x + 1; i++) {
    res.signals.push(false);
  }
  
  return res;
}

function level_() {
  this.spawnPoint = undefined;
  this.end = undefined;
  this.walls = [];
  this.backgrounds = [];
  this.foregrounds = [];
  this.crates = [];
  this.buttons = [];
  this.doors = [];
  this.signals = [];
  this.npcs = [];
  this.deaths = [];
  this.pickups = [];
  
  this.projectiles = [];
  this.particleEmitters = [];
}

function pickup(x, y, texture, onPickup) {
  this.pos = {x: x * c.height, y: y * c.height};
  this.time = 0;
  this.size = {x: 0.05 * c.height, y: 0.05 * c.height};
  this.texture = texture;
  this.onPickup = onPickup;
  this.update = function() {
    this.time++;
    this.pos.y += Math.sin(this.time / 10) * 0.6;
  }
}

function particle(x, y, xVel, yVel, width, height, life, opacityCurve, texture) {
  this.pos = {x: x * c.height, y: y * c.height};
  this.size = {x: width * c.height, y: height * c.height};
  this.vel = {x: xVel, y: yVel};
  this.texture = texture;
  this.time = 0;
  this.delete = false;
  this.life = life;
  this.opacityCurve = opacityCurve;
  this.opacity = opacityCurve(0);
  this.update = function() {
    this.time++;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.opacity = this.opacityCurve(this.time / this.life);
    if(this.time > this.life) {
      this.delete = true;
    }
  };
}

function particleEmitter(x, y, velFunc, sizeX, sizeY, rangeX, rangeY, life, texture, rate) {
  this.pos = {x: x * c.height, y: y * c.height};
  this.size = {x: sizeX * c.height, y: sizeY * c.height};
  this.range = {x: rangeX * c.height, y: rangeY * c.height};
  this.particles = [];
  this.rate = rate;
  this.enabled = true;
  this.texture = texture;
  this.life = life;
  this.opacityCurve = function(time) {return Math.tanh((Math.sin(time*Math.PI*2-Math.PI/2) * 0.5 + 0.5)*3)};
  this.update = function() {
    for(var i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      if(this.particles[i].delete) {
        this.particles.splice(i, 1);
      }
    }
    if(Math.random() < this.rate && this.enabled) {
      this.w = this.size.x / c.height;
      this.h = this.size.y / c.height;
      this.vel = velFunc();
      this.particles.push(new particle((this.pos.x + (this.range.x - this.w * c.height) * Math.random()) / c.height, (this.pos.y + (this.range.y - this.h * c.height) * Math.random()) / c.height, this.vel.x, this.vel.y, this.w, this.h, this.life, this.opacityCurve, this.texture));
    }
  };
}

function projectile(x, y, width, height, xVel, yVel, texture, canHurtPlayer) {
  this.size = {x: width * c.height, y: height * c.height};
  this.pos = {x: x * c.height + this.size.x / 2, y: y * c.height - this.size.y / 2};
  this.texture = texture;
  this.vel = {x: xVel * c.height, y: yVel * c.height};
  this.canHurtPlayer = canHurtPlayer;
  this.textureFlipped = false;
  if(this.vel.x > 0) {
    this.textureFlipped = true;
  }
  if(this.texture == 36) {
    this.textureFlipped = true;
    if(this.vel.x > 0) {
      this.textureFlipped = false;
    }
  }
  this.delete = false;
  this.collisions = ["walls", "doors", "crates"];
  this.update = function() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    if(!cheatMode && checkCollision(this, player) && this.canHurtPlayer) {
      player.damage(15 + Math.round(Math.random() * 20));
      this.delete = true;
    }
    
    for(var i = 0; i < this.collisions.length; i++) {
      this.objects = eval("level." + this.collisions[i]);
      for(var j = 0; j < this.objects.length; j++) {
        if(checkCollision(this, this.objects[j])) {
          this.delete = true;
        } 
      }
    }
  }
}

function foreground(x, y, width, height, texture, repeating, repeatSize) {
  this.pos = {x: x * c.height, y: y * c.height};
  this.size = {x: width * c.height, y: height * c.height};
  this.texture = texture;
  this.repeating = repeating;
  this.repeatSize = repeatSize;
}

function death(x, y, width, height, texture, repeating, repeatSize) {
  this.pos = {x: x * c.height, y: y * c.height};
  this.size = {x: width * c.height, y: height * c.height};
  this.texture = texture;
  this.repeating = repeating;
  this.repeatSize = repeatSize;
}

function door(x, y, width, height, id) {
  this.pos = {x: x * c.height, y: y * c.height};
  this.origPos = {x: x * c.height, y: y * c.height};
  this.size = {x: width * c.height, y: height * c.height};
  this.id = id;
  this.texture = 28;
  
  this.update = function() {
    if(!editMode || !cheatMode) {
      if(level.signals[this.id]) {
        if(this.origPos.y - this.size.y < this.pos.y) {
          this.pos.y -= c.height * 0.025;
        }
      } else {
        if(this.pos.y < this.origPos.y) {
          this.pos.y += c.height * 0.025;
        }
      }
    }
  }
}

function button(x, y, id) {
  this.pos = {x: x * c.height, y: y * c.height};
  this.size = {x: 0.1 * c.height, y: 0.015 * c.height};
  this.texture = 11;
  this.pressed = false;
  this.id = id;
}

function npc(x, y, type) {
  this.type = type;
  this.pos = {x: x * c.height, y: y * c.height};
  this.vel = {x: 0, y: 0};
  this.size = {x: 0.1 * c.height, y: 0.1 * c.height};
  this.anims = [];
  if(this.type == 0) {
    this.anims = [[{texture: 8, time: 5}, {texture: 9, time: 5}, {texture: 10, time: 5}]];
  }
  if(this.type == 1) {
    this.anims = [
    [{texture: 23, time: 4}, {texture: 24, time: 4}], 
    [{texture: 22, time: 0}]];
  }
  this.texture = this.anims[0][0].texture;
  this.animTimer = 0;
  this.currentAnimFrame = 0;
  this.currentAnim = 0;
  this.collisions = ["walls", "doors", "crates", "deaths"];
  this.textureFlipped = false;
  this.fireCooldown = 0;
  this.fireSpeed = 30;
  this.setAnim = function(x) {
    this.animTimer = 0;
    this.currentAnimFrame = 0;
    this.currentAnim = x;
    this.texture = this.anims[x][this.currentAnimFrame].texture;
  }
  this.speed = 0;
  if(this.type == 0) {
    this.speed = c.height * 0.001;
  }
  if(this.type == 1) {
    this.speed = c.height * 0.003;
  }
  
  this.hp = 100;
  this.damage = function(hp) {
    this.hp -= hp;
  }
  this.delete = false;
  this.die = function() {
    this.delete = true;
  }
  
  this.onGround = false;
  this.jumpStrength = c.height * 0.035;
  
  this.update = function() {
    this.vel.x /= 1.7;
  
    this.animTimer++;
    if(this.animTimer >= this.anims[this.currentAnim][this.currentAnimFrame].time) {
      this.animTimer = 0;
      if(this.currentAnimFrame < this.anims[this.currentAnim].length - 1) {
        this.currentAnimFrame++;
      } else {
        this.currentAnimFrame = 0;
      }
      this.texture = this.anims[this.currentAnim][this.currentAnimFrame].texture;
    }
    
    if(this.type == 0) {
      if(!this.textureFlipped) {
        this.vel.x += -this.speed;
      } else {
        this.vel.x += this.speed;
      }
    }
    
    if(this.type == 1 && !cheatMode) {
      var distX = Math.abs((this.pos.x + this.size.x / 2) - (player.pos.x + player.size.x / 2));
      var distY = Math.abs((this.pos.y + this.size.y / 2) - (player.pos.y + player.size.y / 2));
      if(player.pos.x > this.pos.x + this.size.x && distX < 500 && distX > 100 && distY < 300) {
        this.vel.x += this.speed;
      }
      if(player.pos.x + player.size.x < this.pos.x && distX < 500 && distX > 100 && distY < 300) {
        this.vel.x += -this.speed;
      }
      if(distX < 200 && distY < 200 && this.fireCooldown <= 0) {
        if(this.onGround && this.pos.y > player.pos.y + player.size.y) {
          this.vel.y = -this.jumpStrength;
          this.onGround = false;
        }
      }
    }
    
    if(this.type == 1 && !cheatMode) {
      if(Math.abs(this.vel.x) <= 5 && this.currentAnim != 1) {
        this.animTimer = 0;
        this.currentAnimFrame = 0;
        this.currentAnim = 1;
        this.texture = this.texture = this.anims[this.currentAnim][this.currentAnimFrame].texture;
      } else if(Math.abs(this.vel.x) > 5 && this.currentAnim != 0) {
        this.animTimer = 0;
        this.currentAnimFrame = 0;
        this.currentAnim = 0;
        this.texture = this.texture = this.anims[this.currentAnim][this.currentAnimFrame].texture;
      }
      if(this.fireCooldown > 0) {
        this.fireCooldown--;
      }
      if(this.fireCooldown <= 0 && this.pos.y + 0.05 * c.height > player.pos.y && this.pos.y + 0.05 * c.height < player.pos.y + player.size.y && 
        this.pos.x + 400 > player.pos.x && this.pos.x - 400 < player.pos.x) {
        if(this.textureFlipped) {
          level.projectiles.push(new projectile(this.pos.x / c.height, this.pos.y / c.height + 0.05, 0.045, 0.02, 0.025, 0, 25, true));
        } else {
          level.projectiles.push(new projectile(this.pos.x / c.height, this.pos.y / c.height + 0.05, 0.045, 0.02, -0.025, 0, 25, true));
        }
        this.fireCooldown = this.fireSpeed;
      }
    }
    
    this.vel.y += gravity;
    this.turn = false;
    
    this.onGround = false;
    //this.next = JSON.parse(JSON.stringify(this));
    this.next = {pos: {x: this.pos.x, y: this.pos.y}, size: {x: this.size.x, y: this.size.y}};
    this.next.pos.x += this.vel.x;
    this.next.pos.y += this.vel.y;
    for(var i = 0; i < this.collisions.length; i++) {
      this.objects = eval("level." + this.collisions[i]);
      for(var j = 0; j < this.objects.length; j++) {
        if(checkCollision(this.next, this.objects[j])) {
          // Get closest side
          var dist = [];
          dist.push({val: Math.abs((this.objects[j].pos.y + this.objects[j].size.y) - this.pos.y), id: 0});
          dist.push({val: Math.abs(this.objects[j].pos.x - (this.pos.x + this.size.x)), id: 1});
          dist.push({val: Math.abs(this.objects[j].pos.y - (this.pos.y + this.size.y)), id: 2});
          dist.push({val: Math.abs((this.objects[j].pos.x + this.objects[j].size.x) - this.pos.x), id: 3});
          
          dist.sort((a, b) => {return a.val - b.val});
          var side = dist[0].id;
          switch(side) {
          case 0:
            this.pos.y = this.objects[j].pos.y + this.objects[j].size.y;
            this.vel.y = 0;
            break;
          case 1:
            this.pos.x = this.objects[j].pos.x - this.size.x;
            this.turn = true;
            break;
          case 2:
            this.pos.y = this.objects[j].pos.y - this.size.y;
            this.vel.y = 0;
            this.onGround = true;
            break;
          case 3:
            this.pos.x = this.objects[j].pos.x + this.objects[j].size.x;
            this.turn = true;
            break;
          }
        }
      }
    }
    
    for(var i = 0; i < level.projectiles.length; i++) {
      if(checkCollision(this, level.projectiles[i]) && !level.projectiles[i].canHurtPlayer) {
        level.projectiles.splice(i, 1);
        this.damage(50);
      }
    }
    
    if(this.hp <= 0) {
      this.die();
    }
    
    if(this.turn && this.type == 0) {
      this.vel.x *= -1;
    }
    
    if(this.vel.x > 0) {
      this.textureFlipped = true;
    }
    if(this.vel.x < 0) {
      this.textureFlipped = false;
    }
    
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
}

function crate(x, y, width, height) {
  this.pos = {x: x * c.height, y: y * c.height};
  this.vel = {x: 0, y: 0};
  this.size = {x: width * c.height, y: height * c.height};
  this.texture = 7;
  this.collisions = ["walls", "doors", "deaths", "crates"];
  this.update = function() {
    this.vel.y += gravity;
    this.vel.x = 0;
    
    // Collision
    this.next = new crate(this.pos.x / c.height, this.pos.y / c.height, this.size.x / c.height, this.size.y / c.height);
    this.next.vel.x = this.vel.x;
    this.next.vel.y = this.vel.y;
    
    this.player_ = JSON.parse(JSON.stringify(player));
    if(player.onGround) {
      this.player_.vel.x /= 1.7;
    } else {
      this.player_.vel.x /= 1.15;
    }
    this.player_.vel.x *= player.crateSpeed;
    this.player_.pos.x += this.player_.vel.x;
    this.player_.pos.y += this.player_.vel.y;
    
    if(!cheatMode) {
      if(player.pos.y + player.size.y > this.pos.y) {
        if(checkCollision(this.next, this.player_)) {
          player.onCrate = true;
          // Going right on left side
          if(this.player_.acc.x > 0 && 
            this.player_.pos.x + this.player_.size.x / 2 < 
            this.pos.x + this.size.x / 2) {

            player.vel.x *= player.crateSpeed;
            this.vel.x = (player.pos.x + player.vel.x + player.size.x - 1) - this.pos.x;
          }
            
          // Going left on right side
          if(this.player_.acc.x < 0 && 
            this.player_.pos.x + this.player_.size.x / 2 > 
            this.pos.x + this.size.x / 2) {

            player.vel.x *= player.crateSpeed;
            this.vel.x = (player.pos.x + player.vel.x - this.size.x + 1) - this.pos.x;
          }
        }
        
        this.player_.size.x += Math.abs(player.vel.x) * 2 + 2;
        this.player_.pos.x += -(Math.abs(player.vel.x) + 1);
        if(checkCollision(this.next, this.player_)) {
          if(!player.interacting && player.prevInteracting) {
            if(this.player_.pos.x + this.player_.size.x / 2 < 
              this.pos.x + this.size.x / 2) {

              this.pos.x = player.pos.x + player.size.x;

            }

            if(this.player_.pos.x + this.player_.size.x / 2 > 
              this.pos.x + this.size.x / 2) {

              this.pos.x = player.pos.x - this.size.x;
            }
          }
        }
        
        if(player.interacting) {
          if(checkCollision(this.next, this.player_)) {
            player.onCrate = true;
            // Going right on right side
            if(this.player_.acc.x > 0 && 
              this.player_.pos.x + this.player_.size.x / 2 > 
              this.pos.x + this.size.x / 2) {

              player.vel.x *= player.crateSpeed;
              player.vel.x *= player.crateSpeed;
              this.vel.x = (player.pos.x + player.vel.x - this.size.x + 1) - this.pos.x;
              player.pullingCrate = true;
            }

            // Going left on left side
            if(this.player_.acc.x < 0 && 
              this.player_.pos.x + this.player_.size.x / 2 < 
              this.pos.x + this.size.x / 2) {

              player.vel.x *= player.crateSpeed;
              player.vel.x *= player.crateSpeed;
              this.vel.x = (player.pos.x + player.vel.x + player.size.x - 1) - this.pos.x;
              player.pullingCrate = true;
            }
          }
        }
      }
    }
    
    for(var j = 0; j < this.collisions.length; j++) {
      this.objects = eval("level." + this.collisions[j]);
      for(var i = 0; i < this.objects.length; i++) {
        if(this.objects[i] != this) {
          var xVel = this.vel.x;
          var yVel = this.vel.y;

          this.next.pos.x += this.vel.x;
          if(checkCollision(this.next, this.objects[i])) {
            // Get closest side
            if(Math.abs((this.objects[i].pos.x + this.objects[i].size.x) - this.pos.x) < 
              Math.abs(this.objects[i].pos.x - (this.pos.x + this.size.x))) {
              // Left
              xVel = 0;
              this.pos.x = this.objects[i].pos.x + this.objects[i].size.x;
            } else {
              // Right
              xVel = 0;
              this.pos.x = this.objects[i].pos.x - this.size.x;
            }
          }

          this.next.pos.x -= this.vel.x;
          this.next.pos.y += this.vel.y;
          if(checkCollision(this.next, this.objects[i])) {
            // Get closest side
            if(Math.abs((this.objects[i].pos.y + this.objects[i].size.y) - this.pos.y) < 
              Math.abs(this.objects[i].pos.y - (this.pos.y + this.size.y))) {
              // Up
              yVel = 0;
              this.pos.y = this.objects[i].pos.y + this.objects[i].size.y;
            } else {
              // Down
              yVel = 0;
              this.pos.y = this.objects[i].pos.y - this.size.y;
            }
          }

          this.next.pos.y -= this.vel.y;

          this.vel.x = xVel;
          this.vel.y = yVel;
        }
      }
    }
    
    for(var i = 0; i < level.buttons.length; i++) {
      if(checkCollision(level.buttons[i], this)) {
        level.buttons[i].pressed = true;
      }
    }
    
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
}

function wall(x, y, width, height, texture, repeating, repeatSize) {
  this.pos = {x: x * c.height, y: y * c.height};
  this.size = {x: width * c.height, y: height * c.height};
  this.texture = texture;
  this.repeating = repeating;
  this.repeatSize = repeatSize;
}

function background(x, y, width, height, texture, repeating, repeatSize) {
  this.pos = {x: x * c.height, y: y * c.height};
  this.size = {x: width * c.height, y: height * c.height};
  this.texture = texture;
  this.repeating = repeating;
  this.repeatSize = repeatSize;
}