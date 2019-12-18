var levels = [];

function loadLevels() {
  levels = [];

  levels.push(new level());
  levels[0].walls.push(new wall(0.7, 0.9, 0.8, 0.05, 1));
  levels[0].walls.push(new wall(1.45, 0.3, 0.05, 0.6, 1));
  levels[0].walls.push(new wall(0.7, 0.3, 0.05, 0.6, 1));
  levels[0].walls.push(new wall(-0.2, 0.3, 0.7, 0.05, 1));
  levels[0].walls.push(new wall(0.7, 0.05, 0.8, 0.05, 1));
  levels[0].walls.push(new wall(0.9, 0.6, 0.4, 0.02, 1));
  levels[0].walls.push(new wall(0.5, 0.7, 0.2, 0.01, 1));
  levels[0].walls.push(new wall(0.2, 0.9, 0.6, 0.05, 1));
  levels[0].walls.push(new wall(-0.06640625, -0.006510416666666667, 0.45002442398299025, 0.056806793640777266, 1));
  levels[0].walls.push(new wall(0.13411458333333334, -0.3684895833333333, 0.6783470657011753, 0.03932291666654527, 1));
  levels[0].walls.push(new wall(0.09635416666666667, -0.3645833333333333, 0.052044982367595694, 0.38958333333333295, 1));
  levels[0].walls.push(new wall(0.7760416666666666, -0.3606770833333333, 0.052044982367595694, 0.43124999999999963, 1));
  levels[0].walls.push(new wall(-3, 0.3, 2.3, 0.05, 1));

  levels[0].backgrounds.push(new background(-1.5, -1, 5, 3, 2, true, 0.1));
  levels[0].backgrounds.push(new background(-2.5, -0.15, 0.5, 0.5, 0, false, 0));

  levels[0].crates.push(new crate(0.2, -0.2, 0.1, 0.1, 7));
  levels[0].crates.push(new crate(1.1, 0.3, 0.1, 0.1, 7));

  levels[0].buttons.push(new button(0.6, 0.885, 0));
  levels[0].buttons.push(new button(0.75, 0.885, 0));
  levels[0].buttons.push(new button(0.3, 0.885, 1));

  levels[0].doors.push(new door(0.7, 0.1, 0.05, 0.2, 0));
  levels[0].doors.push(new door(1.45, 0.1, 0.05, 0.2, 1));

  levels[0].princesses.push(new princess(1, 0.25));

  levels[0].deaths.push(new death(-0.7, 0.35, 0.5, 0.05, 7, true, 0.05));

  var x = 0;
  for(var i = 0; i < levels[0].buttons.length; i++) {
    if(levels[0].buttons[i].id > x) {
      x = levels[0].buttons[i].id;
    }
  }
  for(var i = 0; i < x + 1; i++) {
    levels[0].signals.push(false);
  }
  
  var objectNames = ["backgrounds", "crates", "walls", "doors", "buttons", "princesses", "deaths"];
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
  this.crates = [];
  this.buttons = [];
  this.doors = [];
  this.signals = [];
  this.princesses = [];
  this.deaths = [];
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

function button(x, y, id) {
  this.pos = {x, y};
  this.size = {x: 0.1, y: 0.015};
  this.texture = 11;
  this.pressed = false;
  this.id = id;
}

function princess(x, y) {
  this.pos = {x, y};
  this.vel = {x: 0, y: 0};
  this.size = {x: 0.064, y: 0.1};
  this.texture = 8;
  this.anims = [[{texture: 8, time: 5}, {texture: 9, time: 5}, {texture: 10, time: 5}]];
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
  this.speed = c.height / 768;
  
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
    
    if(!this.textureFlipped) {
      this.vel.x += -this.speed;
    } else {
      this.vel.x += this.speed;
    }
    
    this.vel.y += gravity;
    this.turn = false;
    this.x = 0;
    
    //this.next = JSON.parse(JSON.stringify(this));
    this.next = this;
    for(var i = 0; i < this.collisions.length; i++) {
      this.objects = eval("levels[0]." + this.collisions[i]);
      for(var j = 0; j < this.objects.length; j++) {
        this.next.pos.x += this.vel.x;
        if(checkCollision(this.next, this.objects[j])) {
          this.turn = true;
          if(!this.textureFlipped) {
            this.x = this.objects[j].pos.x + this.objects[j].size.x;
          } else {
            this.x = this.objects[j].pos.x - this.size.x;
          }
        } 
        this.next.pos.x -= this.vel.x;
        
        this.next.pos.y += this.vel.y;
        if(checkCollision(this.next, this.objects[j])) {
          this.vel.y = 0;
          this.pos.y = this.objects[j].pos.y - this.size.y;
        } 
        this.next.pos.y -= this.vel.y;
      }
    }
    
    if(this.turn) {
      this.vel.x *= -1;
      this.pos.x = this.x;
      this.textureFlipped = !this.textureFlipped;
    }
    
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
}

function crate(x, y, width, height, texture) {
  this.pos = {x, y};
  this.vel = {x: 0, y: 0};
  this.size = {x: width, y: height};
  this.texture = texture;
  this.collisions = ["walls", "doors"];
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
            }

            // Going left on left side
            if(this.player_.acc.x < 0 && 
              this.player_.pos.x + this.player_.size.x / 2 < 
              this.pos.x + this.size.x / 2) {

              player.vel.x *= player.crateSpeed;
              player.vel.x *= player.crateSpeed;
              this.vel.x = (player.pos.x + player.vel.x + player.size.x - 1) - this.pos.x;
              
            }
          }
        }
      }
    }
    for(var j = 0; j < this.collisions.length; j++) {
      this.objects = eval("levels[0]." + this.collisions[j]);
      for(var i = 0; i < this.objects.length; i++) {
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
    
    for(var i = 0; i < levels[0].buttons.length; i++) {
      if(checkCollision(levels[0].buttons[i], this)) {
        levels[0].buttons[i].pressed = true;
      }
    }
    
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
}

function wall(x, y, width, height, texture) {
  this.pos = {x, y};
  this.size = {x: width, y: height};
  this.texture = texture;
}

function background(x, y, width, height, texture, repeating, repeatSize) {
  this.pos = {x, y};
  this.size = {x: width, y: height};
  this.texture = texture;
  this.repeating = repeating;
  this.repeatSize = repeatSize;
}