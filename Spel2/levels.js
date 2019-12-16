data = [];

data.push(new level());
data[0].walls.push(new wall(0.7, 0.9, 0.8, 0.05, 1));
data[0].walls.push(new wall(1.45, 0.3, 0.05, 0.6, 1));
data[0].walls.push(new wall(0.7, 0.3, 0.05, 0.6, 1));
data[0].walls.push(new wall(0.2, 0.3, 0.3, 0.05, 1));
data[0].walls.push(new wall(0.7, 0.05, 0.8, 0.05, 1));
data[0].walls.push(new wall(0.9, 0.6, 0.4, 0.02, 1));
data[0].walls.push(new wall(0.5, 0.7, 0.2, 0.01, 1));
data[0].walls.push(new wall(0.2, 0.9, 0.6, 0.05, 1));
data[0].walls.push(new wall(-0.06640625, -0.006510416666666667, 0.45002442398299025, 0.056806793640777266, 1));
data[0].walls.push(new wall(0.13411458333333334, -0.3684895833333333, 0.6783470657011753, 0.03932291666654527, 1));
data[0].walls.push(new wall(0.09635416666666667, -0.3645833333333333, 0.052044982367595694, 0.38958333333333295, 1));
data[0].walls.push(new wall(0.7760416666666666, -0.3606770833333333, 0.052044982367595694, 0.43124999999999963, 1));

data[0].backgrounds.push(new background(-1, -1, 4, 3, 2, true, 0.2));

data[0].crates.push(new crate(0.2, -0.2, 0.1, 0.1, 7));

data[0].buttons.push(new button(0.6, 0.885));

function level() {
  this.walls = [];
  this.backgrounds = [];
  this.crates = [];
  this.buttons = [];
}

function button(x, y) {
  this.pos = {x, y};
  this.size = {x: 0.1, y: 0.015};
  this.texture = 6;
  this.pressed = false;
}

function crate(x, y, width, height, texture) {
  this.pos = {x, y};
  this.vel = {x: 0, y: 0};
  this.size = {x: width, y: height};
  this.texture = texture;
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
          this.player_.size.x += Math.abs(player.vel.x) * 2 + 2;
          this.player_.pos.x += -(Math.abs(player.vel.x) + 1);
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
    for(var i = 0; i < levels[0].walls.length; i++) {
      var xVel = this.vel.x;
      var yVel = this.vel.y;
      
      this.next.pos.x += this.vel.x;
      if(checkCollision(this.next, levels[0].walls[i])) {
        // Get closest side
        if(Math.abs((levels[0].walls[i].pos.x + levels[0].walls[i].size.x) - this.pos.x) < 
          Math.abs(levels[0].walls[i].pos.x - (this.pos.x + this.size.x))) {
          // Left
          xVel = 0;
          this.pos.x = levels[0].walls[i].pos.x + levels[0].walls[i].size.x;
        } else {
          // Right
          xVel = 0;
          this.pos.x = levels[0].walls[i].pos.x - this.size.x;
        }
      }
      
      this.next.pos.x -= this.vel.x;
      this.next.pos.y += this.vel.y;
      if(checkCollision(this.next, levels[0].walls[i])) {
        // Get closest side
        if(Math.abs((levels[0].walls[i].pos.y + levels[0].walls[i].size.y) - this.pos.y) < 
          Math.abs(levels[0].walls[i].pos.y - (this.pos.y + this.size.y))) {
          // Up
          yVel = 0;
          this.pos.y = levels[0].walls[i].pos.y + levels[0].walls[i].size.y;
        } else {
          // Down
          yVel = 0;
          this.pos.y = levels[0].walls[i].pos.y - this.size.y;
        }
      }
      
      this.next.pos.y -= this.vel.y;
      
      this.vel.x = xVel;
      this.vel.y = yVel;
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