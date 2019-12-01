var c = document.getElementById("c");
c.width = screen.width;
c.height = screen.height;
var ctx = c.getContext("2d");

var totalDead = 0;
var gen = 1;
var speed = 5;
var pipe = new vec2(c.width, Math.round(Math.random() * (c.height - 350) + 300));;
var birds = [];
var img = new Image();
img.src = "img.png";

function start() {
// Add all birds
for(var i = 0; i < 100; i++) {
  birds.push(new Bird());
  birds[i].agent = new Agent(i);
}

function Bird() {
  this.timer = 1;
  this.agent;
  this.time = 0;
  this.x = 250;
  this.y = 250;
  this.yVel = 0;
  this.jump = false;
  this.lastJump = false;
  this.nextY = 0;
  this.nextX = 0;
  this.gravity = 1;
  this.jumpStrength = 15;
  this.lastJump = false;
  this.dead = false;
  this.update = function() {
    // Timing
    if(this.timer == 1) {
      this.timer = -1;
    } else if(this.timer == -1) {
      this.timer = 1;
    }

    this.time++;
    
    // Jump bird
    if(this.jump == true && this.lastJump == false) {
      this.yVel = -this.jumpStrength;
      this.lastJump = true;
      this.lastJump = true;
    }
    if(this.jump == false) {
      this.lastJump = false;
    }
    
    // Move bird
    this.yVel += this.gravity;
    this.y += this.yVel;
    
    // Collide bird
    if((this.x + 50 * 1.41666666667 >= pipe.x && this.x <= pipe.x + 150 && (this.y + 50 >= pipe.y || this.y <= pipe.y - 250)) || 
      this.y + 50 > c.height || this.y < 0) {
      this.dead = true;
      totalDead++;
    } 
      
    // Get variables for AI
    this.nextY = pipe.y;
    this.nextX = pipe.x - this.x;
  };
}

var fps = 120;
var loop = setInterval(update, 1000 / fps);
function update() {
  // Draw background
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, c.width, c.height);

  // Move and draw pipes
  pipe.x -= speed;
  if(pipe.x + 75 < 0) {
    pipe.x = c.width / 2 - 25;
    pipe.y = Math.round(Math.random() * (c.height - 350) + 300);
  }
  ctx.drawImage(img, 330, 0, 26, 135, pipe.x, pipe.y, 150, 600);
  ctx.drawImage(img, 302, 0, 26, 135, pipe.x, pipe.y - 250, 150, -600);
  
  // Draw birds and check if alive
  var birdsAlive = false;
  for(var i = 0; i < birds.length; i++) {
    if(!birds[i].dead) {
      birdsAlive = true;
      birds[i].agent.update();
      birds[i].update();
      var rot = birds[i].yVel / 20;
      ctx.translate(birds[i].x + 25 * 1.416, birds[i].y + 25);
      ctx.rotate(rot);
      ctx.drawImage(img, 223, 124, 17, 12, -25, -25, 50 * 1.416, 50);
      ctx.rotate(-rot);
      ctx.translate(-birds[i].x - 25 * 1.416, -birds[i].y - 25);
    }
  }
  
  // Get best bird
  var bestBird = null;
  var highestId = -1;
  for(var i = 0; i < birds.length; i++) {
    if(highestId == -1 || birds[i].time > birds[highestId].time) {
      highestId = i;
    }
  }
  var bestBird = JSON.parse(JSON.stringify(birds[highestId]));
  
  // Reset all birds
  if(!birdsAlive) {
    gen++;

    pipe = new vec2(c.width, Math.round(Math.random() * (c.height - 350) + 300));
    for(var i = 0; i < birds.length; i++) {
      birds[i] = new Bird();
      birds[i].agent = new Agent(i);
      birds[i].agent.neurons = JSON.parse(JSON.stringify(bestBird.agent.neurons));
      if(i != -1) {
        birds[i].agent.mutate();
      }
    }
  }
  
  // Draw text
  ctx.font = "30px verdana";
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillText("Gen: " + gen, 1200, 50);
  ctx.fillText("Score: " + bestBird.time, 950, 50);
  ctx.fillText("Birds killed: " + totalDead, 950, 100);
  
  // Draw weights
  for(var i = 1; i < bestBird.agent.neurons.length; i++) {
    for(var j = 0; j < bestBird.agent.neurons[i].length; j++) {
      for(var k = 0; k < bestBird.agent.neurons[i][j].weights.length + 1; k++) {
        ctx.beginPath();
        ctx.moveTo((i - 1) * 250 + 100, k * 50 + 50);
        ctx.lineTo(i * 250 + 100, j * 50 + 50);
        ctx.closePath();
        
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = 5;
        ctx.stroke();
        
        if(k < bestBird.agent.neurons[i][j].weights.length) {
          if(bestBird.agent.neurons[i][j].weights[k] < 0) {
            var col = Math.abs(bestBird.agent.neurons[i][j].weights[k] * 255);
            ctx.strokeStyle = "rgb(" + col + ", 0, 0)";
          } else {
            var col = bestBird.agent.neurons[i][j].weights[k] * 255;
            ctx.strokeStyle = "rgb(0, " + col + ", 0)";
          }
        } else {
          if(bestBird.agent.neurons[i][j].bias < 0) {
            var col = Math.abs(bestBird.agent.neurons[i][j].bias * 255);
            ctx.strokeStyle = "rgb(" + col + ", 0, 0)";
          } else {
            var col = bestBird.agent.neurons[i][j].bias * 255;
            ctx.strokeStyle = "rgb(0, " + col + ", 0)";
          }
        }
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
  }
  
  // Draw neurons
  for(var i = 0; i < bestBird.agent.neurons.length; i++) {
    for(var j = 0; j < bestBird.agent.neurons[i].length + 1; j++) {
      ctx.beginPath();
      ctx.ellipse(i * 250 + 100, j * 50 + 50, 10, 10, 0, 0, Math.PI * 2);
      ctx.closePath();

      if(j < bestBird.agent.neurons[i].length) {
        if(bestBird.agent.neurons[i][j].value < 0) {
          var col = Math.abs(bestBird.agent.neurons[i][j].value * 255);
          ctx.fillStyle = "rgb(" + col + ", 0, 0)";
        } else {
          var col = bestBird.agent.neurons[i][j].value * 255;
          ctx.fillStyle = "rgb(0, " + col + ", 0)";
        }
      } else {
          ctx.fillStyle = "rgb(0, 255, 0)";
      }
      
      if(i < bestBird.agent.neurons.length - 1 || j < bestBird.agent.neurons[i].length) {
        ctx.fill();

        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = 5;
        ctx.stroke();
      }
    }
  }
}
}

window.onkeydown = function(e) {
  if(e.keyCode == 32) {
    jump = true;
  }
}

window.onkeyup = function(e) {
  if(e.keyCode == 32) {
    jump = false;
  }
}

function vec2(x, y) {
  this.x = x;
  this.y = y;
}

function rand(seed) {
  return Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000);
}

function map(value, minIn, maxIn, minOut, maxOut) {
	return minOut + (maxOut - minOut) * (value - minIn) / (maxIn - minIn);
}