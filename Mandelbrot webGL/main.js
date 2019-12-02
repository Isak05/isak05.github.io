var c = document.getElementById("c");
c.width = screen.width;
c.height = screen.height;
var gl = c.getContext("webgl");

gl.clearColor(1.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

var quadVertices = [
  -1.0, -1.0,
  1.0, 1.0,
  -1.0, 1.0,
  -1.0, -1.0,
  1.0, -1.0,
  1.0, 1.0
];

var VBO = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVertices), gl.STATIC_DRAW);

var vertexShaderSource = `
attribute vec2 aVertexPos;

void main() {
  gl_Position = vec4(aVertexPos * vec2(1.0, 1.0), 0.0, 1.0);
}
`;

var fragmentShaderSource = `
precision mediump float;

void main() {
  float ratio = 1080.0 / 1920.0;
  float hue = 0.0;
  bool inSet = true;
  int index = 0;
  float x = 0.0;
  float y = 0.0;
  float zoom = 2.0;
  
  float real = 0.0;
  float imag = 0.0;
  for(int i = 0; i < 500; i++) {
    index = i;
    float tempReal = real * real - imag * imag;
    imag = real * imag * 2.0;
    real = tempReal;
    
    real += (gl_FragCoord.x - 1080.0 / 2.0) / (1080.0 / 2.0) * zoom + x;
    imag += (gl_FragCoord.y - 1920.0 / 5.0) / (1080.0 / 2.0) * zoom + y;
    
    if(real * real + imag * imag >= 32.0) {
      inSet = false;
      break;
    }
  }
  
  vec3 color;
  if(inSet == false) {
    hue = mod((float(index) - log2(log2(real * real + imag * imag) + 4.0)) * 5.0, 360.0);

    float x = mod(hue / 60.0, 1.0);

    if(0.0 <= hue && hue < 60.0) {
      color = vec3(1, x, 0);
    }
    if(60.0 <= hue && hue < 120.0) {
      color = vec3(1.0 - x, 1, 0);
    }
    if(120.0 <= hue && hue < 180.0) {
      color = vec3(0, 1, x);
    }
    if(180.0 <= hue && hue < 240.0) {
      color = vec3(0, 1.0 - x, 1);
    }
    if(240.0 <= hue && hue < 300.0) {
      color = vec3(x, 0, 1);
    }
    if(300.0 <= hue && hue <= 360.0) {
      color = vec3(1, 0, 1.0 - x);
    }
  } else {
    color = vec3(0.0, 0.0, 0.0);
  }
  
  gl_FragColor = vec4(color, 1.0);
}
`;

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  console.log(gl.getShaderInfoLog(vertexShader));
}
if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  console.log(gl.getShaderInfoLog(fragmentShader));
}
if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
  console.log(gl.getProgramInfoLog(shaderProgram));
}

gl.bindBuffer(gl.ARRAY_BUFFER, VBO);

var loc = gl.getAttribLocation(shaderProgram, 'aVertexPos');
gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(loc, 'aVertexPos');


gl.useProgram(shaderProgram);
gl.drawArrays(gl.TRIANGLES, 0, quadVertices.length / 2);