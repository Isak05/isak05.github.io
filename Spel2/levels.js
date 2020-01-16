var levels = [];

function loadLevels() {
  levels = [];

  levels.push(new level());
  levels[0].walls.push(new wall(0.7, 0.8997395833333334, 0.8, 0.05, 19, true, 0.05));
  levels[0].walls.push(new wall(1.45, 0.3, 0.05, 0.6, 19, true, 0.05));
  levels[0].walls.push(new wall(0.7, 0.3, 0.05, 0.6, 19, true, 0.05));
  levels[0].walls.push(new wall(-0.2, 0.3, 0.7, 0.05, 19, true, 0.05));
  levels[0].walls.push(new wall(0.7, 0.05, 0.8, 0.05, 19, true, 0.05));
  levels[0].walls.push(new wall(0.9, 0.6, 0.4, 0.02, 19, true, 0.05));
  levels[0].walls.push(new wall(0.5, 0.7, 0.2, 0.01, 19, true, 0.05));
  levels[0].walls.push(new wall(-0.20052083333333334, 0.8997395833333334, 0.4005208333333334, 0.05026041666666684, 21, true, 0.05000000000000002));
  levels[0].walls.push(new wall(-0.25, 0.3997395833333333, 0.04999999999999997, 0.5502604166666668, 20, true, 0.05000000000000002));
  levels[0].walls.push(new wall(-0.7005208333333334, 0.3997395833333333, 0.4505208333333333, 0.050260416666666696, 20, true, 0.05000000000000002));
  levels[0].walls.push(new wall(-0.049479166666666664, 0, 0.4494791666666667, 0.05000000000000001, 19, true, 0.05000000000000002));
  levels[0].walls.push(new wall(0.10026041666666667, -0.3502604166666667, 0.04973958333333336, 0.3502604166666667, 19, true, 0.05000000000000002));
  levels[0].walls.push(new wall(0.7994791666666666, -0.3502604166666667, 0.050520833333333424, 0.4002604166666666, 19, true, 0.05000000000000002));
  levels[0].walls.push(new wall(0.10026041666666667, -0.3997395833333333, 0.7497395833333335, 0.04973958333333325, 19, true, 0.05000000000000002));
  levels[0].walls.push(new wall(-0.20052083333333334, 0.8997395833333334, 0.9005208333333335, 0.05026041666666684, 21, true, 0.05000000000000002));
  levels[0].walls.push(new wall(-3.1497395833333335, 0.2994791666666667, 2.44973958333, 0.04973958333333339, 20, true, 0.05000000000000002));
  levels[0].walls.push(new wall(1.5000000000000002, 0.30000000000000004, 0.8000000000000002, 0.050000000000000044, 19, true, 0.05000000000000002));
  levels[0].walls.push(new wall(2.2500000000000004, -0.6500000000000001, 0.04999999999999982, 0.9500000000000002, 20, true, 0.05000000000000002));
  levels[0].walls.push(new wall(1.4500000000000002, -0.651, 0.05000000000000012, 0.7000000000000001, 20, true, 0.05000000000000002));
  levels[0].walls.push(new wall(-0.05000000000000001, -0.65, 0.05000000000000001, 0.65, 19, true, 0.05000000000000002));
  levels[0].walls.push(new wall(2.1500000000000004, 0.05000000000000001, 0.09999999999999994, 0.10000000000000002, 19, true, 0.1));
  levels[0].walls.push(new wall(1.6000000000000003, -0.10000000000000002, 0.19999999999999987, 0.05000000000000001, 19, true, 0.05000000000000002));
  levels[0].walls.push(new wall(1.6000000000000003, -0.4000000000000001, 0.65, 0.04999999999999997, 19, true, 0.05000000000000002));
  levels[0].walls.push(new wall(2.1, -0.6000000000000001, 0.15000000000000005, 0.04999999999999997, 20, true, 0.05000000000000002));
  levels[0].walls.push(new wall(0, -0.651, 1.4500000000000002, 0.04999999999999997, 20, true, 0.05000000000000002));
  levels[0].walls.push(new wall(1.4500000000000002, -0.9, 0.6500000000000002, 0.04999999999999997, 20, true, 0.05000000000000003));
  levels[0].walls.push(new wall(2.05, -0.8500000000000001, 0.0500000000000012, 0.3, 20, true, 0.05000000000000003));
  levels[0].walls.push(new wall(1.5000000000000002, -0.05000000000000002, 0.09999999999999994, 0.05000000000000001, 19, true, 0.05000000000000003));
  levels[0].walls.push(new wall(2.4500000000000006, 1.4000000000000004, 0.5500000000000002, 0.04999999999999982, 21, true, 0.05000000000000003));
  
  levels[0].backgrounds.push(new background(-2, -2, 10, 3, 2, true, 0.1));
  levels[0].backgrounds.push(new background(-2.5, -0.15, 0.5, 0.5, 0, false, 0));
  levels[0].backgrounds.push(new background(-0.20052083333333334, 0.3502604166666667, 0.05052083333333331, 0.04973958333333339, 19, true, 0.05000000000000002));
  levels[0].backgrounds.push(new background(-0.7500000000000001, 0.3500000000000001, 0.04999999999999997, 0.09999999999999994, 20, true, 0.05000000000000002));
  levels[0].backgrounds.push(new background(-2.35, 0.45, 2.1, 1.2000000000000004, 20, true, 0.05000000000000002));
  levels[0].backgrounds.push(new background(-2.35, 0.3500000000000001, 1.6000000000000003, 0.09999999999999994, 20, true, 0.05000000000000002));
  levels[0].backgrounds.push(new background(-0.25000000000000006, 0.9500000000000002, 3.6500000000000004, 0.8000000000000002, 20, true, 0.05000000000000002));
  levels[0].backgrounds.push(new background(1.5000000000000002, 0.3500000000000001, 1.9000000000000001, 0.6000000000000001, 20, true, 0.05000000000000002));
  levels[0].backgrounds.push(new background(2.3000000000000003, -0.65, 1.2000000000000004, 1.0000000000000002, 20, true, 0.05000000000000002));
  levels[0].backgrounds.push(new background(0.8500000000000001, -0.65, 0.6000000000000001, 0.7000000000000001, 20, true, 0.05000000000000002));
  levels[0].backgrounds.push(new background(0.10000000000000009, -0.65, 0.75, 0.25, 20, true, 0.05000000000000002));
  levels[0].backgrounds.push(new background(0, -0.65, 0.10000000000000002, 0.65, 20, true, 0.05000000000000002));

  levels[0].crates.push(new crate(0.2, -0.2, 0.1, 0.1));
  levels[0].crates.push(new crate(1.1, 0.3, 0.1, 0.1));
  levels[0].crates.push(new crate(1.7000000000000002, -0.5500000000000002, 0.1, 0.1));
  levels[0].crates.push(new crate(2.61, 1.2500000000000002, 0.1, 0.1));
  levels[0].crates.push(new crate(2.7300000000000004, 1.2500000000000002, 0.1, 0.1));
  levels[0].crates.push(new crate(2.67, 1.1, 0.1, 0.1));

  levels[0].buttons.push(new button(0.6, 0.885, 0));
  levels[0].buttons.push(new button(0.75, 0.885, 0));
  levels[0].buttons.push(new button(0.3, 0.885, 1));
  levels[0].buttons.push(new button(2.1500000000000004, 0.28500000000000006, 2));

  levels[0].doors.push(new door(0.7, 0.1, 0.05, 0.2, 0));
  levels[0].doors.push(new door(1.45, 0.1, 0.05, 0.2, 1));
  levels[0].doors.push(new door(1.4500000000000002, -0.8500000000000001, 0.05000000000000012, 0.20000000000000004, 2));
  levels[0].doors.push(new door(2.05, -0.5500000000000002, 0.05000000000000012, 0.15000000000000005, 2));

  levels[0].npcs.push(new npc(1, 0.25, 0));
  levels[0].npcs.push(new npc(0.25, 0.5, 1));
  levels[0].npcs.push(new npc(2.125, -0.55, 1));

  levels[0].deaths.push(new death(-0.7, 0.35, 0.5, 0.05, 27, true, 0.05));
  levels[0].deaths.push(new death(-5, 5, 10, 0.2, 13, true, 0.2));
  levels[0].deaths.push(new death(1.5, -0.1, 0.1, 0.05, 13, true, 0.05));

  
  levels[0].foregrounds.push(new foreground(0, 0.05, 0.03 * (4 / 6), 0.15, 14, true, 0.03));
  levels[0].foregrounds.push(new foreground(0.1, 0.25, 0.05, 0.05, 15, false, 0));
  levels[0].foregrounds.push(new foreground(1.8999999999999995, -0.3499999999999999, 0.029999999999999954, 0.3799999999999999, 14, true, 0.040000000000000015));
  levels[0].foregrounds.push(new foreground(1.8799999999999997, 0.02999999999999999, 0.06999999999999999, 0.06999999999999999, 15, true, 0.07000000000000002));

  levels[0].particleEmitters.push(new particleEmitter(-0.7, 0.375, 0.05, 0.05, 0.5, 0, 90, 29, 0.025));
  levels[0].particleEmitters.push(new particleEmitter(2.6, 1.3, 0.025, 0.025, 0.25, 0, 60, 7, 0.05));
  
  var x = 0;
  for(var i = 0; i < levels[0].buttons.length; i++) {
    if(levels[0].buttons[i].id > x) {
      x = levels[0].buttons[i].id;
    }
  }
  for(var i = 0; i < x + 1; i++) {
    levels[0].signals.push(false);
  }
}

function level() {
  this.spawnPoint = {x: 0.3 * c.height, y: 0.15 * c.height};
  this.walls = [];
  this.backgrounds = [];
  this.foregrounds = [];
  this.crates = [];
  this.buttons = [];
  this.doors = [];
  this.signals = [];
  this.npcs = [];
  this.deaths = [];
  
  this.projectiles = [];
  this.particleEmitters = [];
}

function particle(x, y, width, height, life, opacityCurve, texture) {
  this.pos = {x: x * c.height, y: y * c.height};
  this.size = {x: width * c.height, y: height * c.height};
  this.texture = texture;
  this.time = 0;
  this.delete = false;
  this.life = life;
  this.opacityCurve = opacityCurve;
  this.opacity = opacityCurve(0);
  this.update = function() {
    this.time++;
    this.pos.y += -2;
    this.opacity = this.opacityCurve(this.time / this.life);
    if(this.time > this.life) {
      this.delete = true;
    }
  };
}

function particleEmitter(x, y, sizeX, sizeY, rangeX, rangeY, life, texture, rate) {
  this.pos = {x: x * c.height, y: y * c.height};
  this.size = {x: sizeX * c.height, y: sizeY * c.height};
  this.range = {x: rangeX * c.height, y: rangeY * c.height};
  this.particles = [];
  this.rate = rate;
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
    if(Math.random() < this.rate) {
      this.w = this.size.x / c.height;
      this.h = this.size.y / c.height;
      this.particles.push(new particle((this.pos.x + (this.range.x - this.w * c.height) * Math.random()) / c.height, (this.pos.y + (this.range.y - this.h * c.height) * Math.random()) / c.height, this.w, this.h, this.life, this.opacityCurve, this.texture));
    }
  };
}

function projectile(x, y, xVel, yVel, texture) {
  this.size = {x: 0.045 * c.height, y: 0.02 * c.height};
  this.pos = {x: x * c.height + this.size.x / 2, y: y * c.height - this.size.y / 2};
  this.texture = texture;
  this.vel = {x: xVel, y: yVel};
  this.textureFlipped = false;
  if(this.vel.x > 0) {
    this.textureFlipped = true;
  }
  this.delete = false;
  this.collisions = ["walls", "doors", "crates"];
  this.update = function() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    if(!cheatMode && checkCollision(this, player)) {
      player.damage(25);
      this.delete = true;
    }
    
    for(var i = 0; i < this.collisions.length; i++) {
      this.objects = eval("levels[0]." + this.collisions[i]);
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
      if(levels[0].signals[this.id]) {
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
      if(player.pos.x > this.pos.x + this.size.x && distX < 500 && distY < 300) {
        this.vel.x += this.speed;
      }
      if(player.pos.x + player.size.x < this.pos.x && distX < 500 && distY < 300) {
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
      if(this.fireCooldown <= 0 && this.pos.y + 0.05 * c.height > player.pos.y && this.pos.y + 0.05 * c.height < player.pos.y + player.size.y) {
        if(this.textureFlipped) {
          levels[0].projectiles.push(new projectile(this.pos.x / c.height, this.pos.y / c.height + 0.05, 0.025 * c.height, 0, 25));
        } else {
          levels[0].projectiles.push(new projectile(this.pos.x / c.height, this.pos.y / c.height + 0.05, -0.025 * c.height, 0, 25));
        }
        this.fireCooldown = this.fireSpeed;
      }
    }
    
    this.vel.y += gravity;
    this.turn = false;
    
    this.onGround = false;
    //this.next = JSON.parse(JSON.stringify(this));
    this.next = this;
    for(var i = 0; i < this.collisions.length; i++) {
      this.objects = eval("levels[0]." + this.collisions[i]);
      for(var j = 0; j < this.objects.length; j++) {
        this.next.pos.x += this.vel.x;
        if(checkCollision(this.next, this.objects[j])) {
          this.turn = true;
          if(!this.textureFlipped) {
            this.pos.x = this.objects[j].pos.x + this.objects[j].size.x;
          } else {
            this.pos.x = this.objects[j].pos.x - this.size.x;
          }
        } 
        this.next.pos.x -= this.vel.x;
        
        this.next.pos.y += this.vel.y;
        if(checkCollision(this.next, this.objects[j])) {
          this.vel.y = 0;
          if(Math.abs((this.pos.y + this.size.y) - this.objects[j].pos.y) < 
          Math.abs(this.pos.y - (this.objects[j].pos.y + this.objects[j].size.y))) {
            this.onGround = true;
            this.pos.y = this.objects[j].pos.y - this.size.y;
          } else {
            this.pos.y = this.objects[j].pos.y + this.objects[j].size.y;
          }
        } 
        this.next.pos.y -= this.vel.y;
      }
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
      this.objects = eval("levels[0]." + this.collisions[j]);
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
    
    for(var i = 0; i < levels[0].buttons.length; i++) {
      if(checkCollision(levels[0].buttons[i], this)) {
        levels[0].buttons[i].pressed = true;
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