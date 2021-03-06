function Agent(id) {
  this.id = id;
  this.neurons = [];
  this.mutationMult = 0.75;
  this.inputs = ["y", "yVel", "nextY", "nextX"];
  this.inputRange = [new vec2(0, c.height), new vec2(-15, 40), new vec2(-c.height, c.height), new vec2(0, c.width)];
  this.layerSizes = [this.inputs.length, 2, 1];
  // Create all layers
  for(var i = 0; i < this.layerSizes.length; i++) {
    this.neurons.push([]);
  }
  
  // Add all neurons
  for(var i = 0; i < this.layerSizes.length; i++) {
    for(var j = 0; j < this.layerSizes[i]; j++) {
      if(i == 0) {
        this.neurons[i].push(new Neuron(0));
      } else {
        this.neurons[i].push(new Neuron(0));
        this.neurons[i][j].bias = Math.random() * 0.5 - 0.25;
        for(var k = 0; k < this.layerSizes[i - 1]; k++) {
          this.neurons[i][j].weights.push(Math.random() * 2 - 1);
        }
      }
    }
  }
  
  // Mutate agent
  this.mutate = function() {
    this.mutationMult *= 1.2 - Math.random() * 0.4;
    for(var i = 0; i < this.neurons.length; i++) {
      for(var j = 0; j < this.neurons[i].length; j++) {
        for(var k = 0; k < this.neurons[i][j].weights.length; k++) {
          if(i > 0 && Math.random() > 0.9) {
            this.neurons[i][j].weights[k] += Math.random() * this.mutationMult - this.mutationMult * 0.5;
          }
        }
        if(i > 0 && Math.random() > 0.9) {
          this.neurons[i][j].bias += Math.random() * this.mutationMult - this.mutationMult * 0.5;
        }
      }
    }
  };
  
  this.update = function() {
    // Update neurons
    for(var i = 0; i < this.layerSizes.length; i++) {
      for(var j = 0; j < this.layerSizes[i]; j++) {
        if(i == 0) {
          this.neurons[i][j].value = map(eval("birds[this.id]." + this.inputs[j]), this.inputRange[j].x, this.inputRange[j].y, 0, 1);
        } else {
          var val = 0;
          for(var k = 0; k < this.layerSizes[i - 1]; k++) {
            val += this.neurons[i - 1][k].value * this.neurons[i][j].weights[k];
          }
          this.neurons[i][j].value = Math.tanh(val + this.neurons[i][j].bias);
        }
      }
    }
    
    if(this.neurons[this.neurons.length - 1][0].value > 0) {
      birds[this.id].jump = true;
    } else {
      birds[this.id].jump = false;
    }
  }
}

function Neuron(value) {
  this.weights = [];
  this.value = value;
  this.bias = 0;
}