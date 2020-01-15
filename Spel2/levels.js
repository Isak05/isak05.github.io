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
  levels[0].walls.push(new wall(-0.75, 0.3502604166666667, 0.04999999999999982, 0.09973958333333337, 20, true, 0.05000000000000002));
  levels[0].walls.push(new wall(-0.049479166666666664, 0, 0.4494791666666667, 0.05000000000000001, 19, true, 0.05000000000000002));
  levels[0].walls.push(new wall(0.10026041666666667, -0.3502604166666667, 0.04973958333333336, 0.3502604166666667, 19, true, 0.05000000000000002));
  levels[0].walls.push(new wall(0.7994791666666666, -0.3502604166666667, 0.050520833333333424, 0.4002604166666666, 19, true, 0.05000000000000002));
  levels[0].walls.push(new wall(0.10026041666666667, -0.3997395833333333, 0.7497395833333335, 0.04973958333333325, 19, true, 0.05000000000000002));
  levels[0].walls.push(new wall(-0.20052083333333334, 0.8997395833333334, 0.9005208333333335, 0.05026041666666684, 21, true, 0.05000000000000002));
  levels[0].walls.push(new wall(-3.1497395833333335, 0.2994791666666667, 2.44973958333, 0.04973958333333339, 20, true, 0.05000000000000002));
  levels[0].walls.push(new wall(-0.20052083333333334, 0.3502604166666667, 0.05052083333333331, 0.04973958333333339, 19, true, 0.05000000000000002));
  
  levels[0].backgrounds.push(new background(-1.5, -1, 5, 3, 2, true, 0.1));
  levels[0].backgrounds.push(new background(-2.5, -0.15, 0.5, 0.5, 0, false, 0));

  levels[0].crates.push(new crate(0.2, -0.2, 0.1, 0.1));
  levels[0].crates.push(new crate(1.1, 0.3, 0.1, 0.1));

  levels[0].buttons.push(new button(0.6, 0.885, 0));
  levels[0].buttons.push(new button(0.75, 0.885, 0));
  levels[0].buttons.push(new button(0.3, 0.885, 1));

  levels[0].doors.push(new door(0.7, 0.1, 0.05, 0.2, 0));
  levels[0].doors.push(new door(1.45, 0.1, 0.05, 0.2, 1));

  levels[0].npcs.push(new npc(0.25, 0.5, 1, [[{texture: 23, time: 4}, {texture: 24, time: 4}]]));
  levels[0].npcs.push(new npc(1, 0.25, 0, [[{texture: 8, time: 5}, {texture: 9, time: 5}, {texture: 10, time: 5}]]));

  levels[0].deaths.push(new death(-0.7, 0.35, 0.5, 0.05, 27, true, 0.05));
  levels[0].deaths.push(new death(-5, 5, 10, 0.2, 13, true, 0.2));
  
  levels[0].foregrounds.push(new foreground(0, 0.05, 0.03 * (4 / 6), 0.15, 14, true, 0.03));
  levels[0].foregrounds.push(new foreground(0.1, 0.25, 0.05, 0.05, 15, false, 0));
  
  var x = 0;
  for(var i = 0; i < levels[0].buttons.length; i++) {
    if(levels[0].buttons[i].id > x) {
      x = levels[0].buttons[i].id;
    }
  }
  for(var i = 0; i < x + 1; i++) {
    levels[0].signals.push(false);
  }
  
  var objectNames = ["backgrounds", "crates", "walls", "doors", "buttons", "npcs", "deaths", "foregrounds"];
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
}

function level() {
  this.spawnPoint = {x: 0.6 * c.height, y: 0.15 * c.height};
  this.walls = [];
  this.backgrounds = [];
  this.foregrounds = [];
  this.crates = [];
  this.buttons = [];
  this.doors = [];
  this.signals = [];
  this.npcs = [];
  this.deaths = [];
}

function foreground(x, y, width, height, texture, repeating, repeatSize) {
  this.pos = {x, y};
  this.size = {x: width, y: height};
  this.texture = texture;
  this.repeating = repeating;
  this.repeatSize = repeatSize;
}

function death(x, y, width, height, texture, repeating, repeatSize) {
  this.pos = {x, y};
  this.size = {x: width, y: height};
  this.texture = texture;
  this.repeating = repeating;
  this.repeatSize = repeatSize;
}

function door(x, y, width, height, id) {
  this.pos = {x, y};
  this.origPos = {x, y};
  this.size = {x: width, y: height};
  this.id = id;
  this.texture = 6;
  
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
  this.pos = {x, y};
  this.size = {x: 0.1, y: 0.015};
  this.texture = 11;
  this.pressed = false;
  this.id = id;
}

function npc(x, y, type, anim) {
  this.type = type;
  this.pos = {x, y};
  this.vel = {x: 0, y: 0};
  this.size = {x: 0.1, y: 0.1};
  this.texture = anim[0][0].texture;
  this.anims = anim;
  this.animTimer = 0;
  this.currentAnimFrame = 0;
  this.currentAnim = 0;
  this.collisions = ["walls", "doors", "crates"];
  this.textureFlipped = false;
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
    
    if(this.type == 1) {
      if(player.pos.x > this.pos.x + this.size.x) {
        this.vel.x += this.speed;
      }
      if(player.pos.x + player.size.x < this.pos.x) {
        this.vel.x += -this.speed;
      }
      if(Math.abs((this.pos.x + this.size.x / 2) - (player.pos.x + player.size.x / 2)) < 200) {
        if(this.onGround && this.pos.y > player.pos.y + player.size.y) {
          this.vel.y = -this.jumpStrength;
          this.onGround = false;
        }
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
  this.pos = {x, y};
  this.vel = {x: 0, y: 0};
  this.size = {x: width, y: height};
  this.texture = 7;
  this.collisions = ["walls", "doors", "deaths", "crates"];
  this.update = function() {
    this.vel.y += gravity;
    this.vel.x = 0;
    
    // Collision
    this.next = new crate(this.pos.x, this.pos.y, this.size.x, this.size.y);
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
  this.pos = {x, y};
  this.size = {x: width, y: height};
  this.texture = texture;
  this.repeating = repeating;
  this.repeatSize = repeatSize;
}

function background(x, y, width, height, texture, repeating, repeatSize) {
  this.pos = {x, y};
  this.size = {x: width, y: height};
  this.texture = texture;
  this.repeating = repeating;
  this.repeatSize = repeatSize;
}