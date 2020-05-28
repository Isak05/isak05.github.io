var c = document.getElementById("c");
c.width = screen.width;
c.height = screen.height;
var ctx = c.getContext("2d");
ctx.imageSmoothingEnabled = false;

var graph = [];
var maxGraph = 0;
var totalDead = 0;
var gen = 1;
var speed = 5;
var realScore = 0;
var pipe = new vec2(c.width, Math.round(Math.random() * (c.height - 350) + 300));;
var birds = [];
var speeded = false;
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

var speedBoost = 100;
var fps = 30;
var loop = setInterval(update, 1000 / fps);
function update() {
  for(var l = 0; l < speedBoost; l++) {
    // Move pipes
    pipe.x -= speed;
    if(pipe.x + 75 < 0) {
      pipe.x = c.width / 2 - 25;
      pipe.y = Math.round(Math.random() * (c.height - 350) + 300);
      realScore++;
    }

    // Draw birds and check if alive
    var birdsAlive = false;
    for(var i = 0; i < birds.length; i++) {
      if(!birds[i].dead) {
        birdsAlive = true;
        birds[i].agent.update();
        birds[i].update();
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
      realScore = 0;
      graph.push(bestBird.time);
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
    if(!speeded && l > 0) {
      break;
    }
  }
  
  // Draw
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, c.width, c.height);
  
  ctx.drawImage(img, 330, 0, 26, 135, pipe.x, pipe.y, 150, 600);
  ctx.drawImage(img, 302, 0, 26, 135, pipe.x, pipe.y - 250, 150, -600);
  
  for(var i = 0; i < birds.length; i++) {
    if(!birds[i].dead) {
      var rot = birds[i].yVel / 20;
      ctx.translate(birds[i].x + 25 * 1.416, birds[i].y + 25);
      ctx.rotate(rot);
      ctx.drawImage(img, 223, 124, 17, 12, -25, -25, 50 * 1.416, 50);
      ctx.rotate(-rot);
      ctx.translate(-birds[i].x - 25 * 1.416, -birds[i].y - 25);
    }
  }
  
  ctx.fillStyle = "#555555";
  ctx.fillRect(c.width / 2, 0, c.width / 2, c.height);
  
  // Draw text
  ctx.font = "30px verdana";
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillText("Gen: " + gen, 1200, 50);
  ctx.fillText("Score: " + realScore, 950, 50);
  ctx.fillText("Birds killed: " + totalDead, 950, 100);
  
  // Draw weights
  for(var i = 1; i < bestBird.agent.neurons.length; i++) {
    for(var j = 0; j < bestBird.agent.neurons[i].length; j++) {
      for(var k = 0; k < bestBird.agent.neurons[i][j].weights.length + 1; k++) {
        ctx.beginPath();
        ctx.moveTo((i - 1) * 250 + 750, k * 50 + 150);
        ctx.lineTo(i * 250 + 750, j * 50 + 150);
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
      ctx.ellipse(i * 250 + 750, j * 50 + 150, 10, 10, 0, 0, Math.PI * 2);
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
  
  // Graph
  for(var i = 0; i < graph.length; i++) {
    if(graph[i] > maxGraph) {
      maxGraph = graph[i];
    }
    ctx.beginPath();
    ctx.moveTo((i * 500) / graph.length + 750, 750 - (graph[i] * 500 / maxGraph));
    if(i + 1 <= graph.length) {
      ctx.lineTo(((i + 1) * 500) / graph.length + 750, 750 - (graph[i + 1] * 500 / maxGraph));
    }
    ctx.closePath();

    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 5;
    ctx.stroke();
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

window.onkeydown = function(e) {
  switch(e.keyCode) {
  case 32:
    speeded = !speeded;  
    break;
  }
}