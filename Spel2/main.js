var c = document.getElementById("c");
c.width = screen.width;
c.height = screen.height;
var ctx = c.getContext("2d");
ctx.imageSmoothingEnabled = false;
var zoom = 1;

var textureFiles = ["Player/boi", "wall", "brick", "Player/boi2", "Player/boi3", "Player/boi4", "brick2", "crate2", "princess", "princess2", "princess3", "button", "button2", "spike", "chain", "skull", "Player/boi5", "Player/boi6", "Player/boi7", "wall2", "wall3", "wall4", "robot", "robot2", "robot3", "laser", "heart", "lava", "door", "smoke", "heart2", "heart3", "chest", "key", "gun", "chest2", "bullet", "portal", "tile", "speed", "jump", "plates", "controls", "controls2", "arrow", "spiky", "spiky2", "controls3", "controls4", "lock", "question", "crown", "Player/ikea/Main Character (IKEA)-1", "Player/ikea/Main Character (IKEA)-2", "Player/ikea/Main Character (IKEA)-3", "Player/ikea/Main Character (IKEA)-4", "Player/ikea/Main Character (IKEA)-5", "Player/ikea/Main Character (IKEA)-6", "Player/ikea/Main Character (IKEA)-7", "Player/ikea/Main Character (IKEA)-8", "Player/ikea/Main Character (IKEA)-9", "shelf", "ikeaportal", "dirt", "buttongui", "information", "ikeaclothes", "robotfrag1", "robotfrag2", "robotfrag3", "saw1", "saw2", "shelf2", "sofa", "brokenRobot", "Player/coolguy/coolguy", "Player/coolguy/coolguy2", "Player/coolguy/coolguy3", "Player/coolguy/coolguy4", "Player/coolguy/coolguy5", "Player/coolguy/coolguy6", "concrete", "brokenRobot2", "brokenRobot3", "plank", "lamp"];
var hiddenTextures = [0, 3, 4, 5, 8, 9, 10, 11, 12, 16, 17, 18, 22, 23, 24, 25, 29, 30, 31, 34, 35, 36, 37, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 56, 57, 58, 59, 60, 62, 64, 65, 66, 67, 68, 69, 70, 71, 74, 75, 76, 77, 78, 79, 80, 82, 83];
// Uncomment to show all textures in the editor
//hiddenTextures = [];

var audioFiles = ["shot", "audio", "hurt", "music"];

var actx;
var audio = [];

var textures = [];
var loadedItems = 0;
var totalItems = textureFiles.length;
for(var i = 0; i < textureFiles.length; i++) {
  textures.push(new Image());
  textures[i].src = "Textures/" + textureFiles[i] + ".png";
  textures[i].onload = progressLoad;
}

for(var i = 0; i < audioFiles.length; i++) {
  audio.push(new sound("Audio/" + audioFiles[i] + ".wav"));
}

function progressLoad() {
  loadedItems++; 
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(c.width / 2 - c.width / 5, c.height / 2 - c.height / 20, c.width / 5 * 2 * loadedItems / textureFiles.length, c.height / 20 * 2);
  if(loadedItems == totalItems) {
    startUpdateLoop();
  }
}

var levelId = 0;
var level = loadLevel(levelId);
var levels = 4;
var unlockedLevels = getCookie("unlockedLevels");
if(unlockedLevels == undefined) {
  unlockedLevels = 0;
}
var unlockedChallengeLevels = getCookie("unlockedChallengeLevels");
if(unlockedChallengeLevels == undefined) {
  unlockedChallengeLevels = 0;
}

var player = {
  pos: JSON.parse(JSON.stringify(level.spawnPoint)),
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
  anims: [],
  animTimer: 0,
  currentAnimFrame: 0,
  currentAnim: 1,
  texture: 0,
  textureFlipped: false,
  invulnerableTimer: 0,
  spawnTimer: 15,
  shootTimer: 0,
  shootSpeed: 15,
  shooting: false,
  e: false,
  setAnim: function(x) {
    this.animTimer = 0;
    this.currentAnimFrame = 0;
    this.currentAnim = x;
    this.texture = this.anims[x][this.currentAnimFrame].texture;
  },
  die: function() {
    this.pos = JSON.parse(JSON.stringify(level.spawnPoint));
    this.vel = new vec2(0, 0);
    this.onGround = false;
    this.hp = 100;
    if(challengeMode) {
      this.hp = 1;
    }
    this.invulnerableTimer = 0;
    this.spawnTimer = 30;
    this.speed = c.height * 0.01,
    this.jumpStrength = c.height * 0.035;
    keys = 0;
    level = loadLevel(levelId);
    startTime = time;
    score = 0;
    deaths++;
  }, 
  damage: function(n) {
    if(this.invulnerableTimer <= 0) { 
      audio[2].play(1 * soundVolume, false);
      this.func = function() {
        return {x: Math.random() * 10 - 5, y: Math.random() * 10};
      }
      for(var i = 0; i < 3; i++) {
        level.particles.push(new particle((this.pos.x + this.size.x / 2) / c.height - 0.01, (this.pos.y + this.size.y / 2) / c.height - 0.01, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, 0.015, 0.015, 8, (time) => {return Math.tanh((Math.sin(time*Math.PI*2-Math.PI/2) * 0.5 + 0.5)*3);}, 26));
      }
      this.hp -= n;
      this.invulnerableTimer = 15;
      if(this.hp <= 0) {
        this.invulnerableTimer = 30;
        this.hp = 0;
      }
    }
  },
  hp: 100
};

function vec2(x, y) {
  this.x = x;
  this.y = y;
}

var fps = 30;
var cheatable = false;
var cheatMode = false;
var building = false;
var editMode = false;
var mousePos = {x: 0, y: 0};
var mousePressed = false;
var selectedSlider = -1;
var prevMousePressed = mousePressed;
var selectedTexture = 1;
var selectedType = 0;
var editRepeating = true;
var editRepeatSize = 0.05;
var editId = 0;
var editSnap = 0.05;
var selectedSetting = -1;
var settingLength = 5;
var setting = -1;
var deleting = false;
var consoleOpen = false;
var gravity = c.height * 0.0025;
var cameraOffset = new vec2(player.pos.x - c.width / 2, player.pos.y - c.height * 1);
var godMode = false;
var keys = 0;
var paused = true;
var challengeMode = false;
var menu = 0;
var musicVolume = 0.1;
var prevMusicVolume = musicVolume;
var soundVolume = 0.1;
var currentConsoleText = "";
var consoleStack = [];
var consoleCursorPos = 0;
var controls = [
{code: 65, name: "a"},
{code: 68, name: "d"},
{code: 87, name: "w"},
{code: 32, name: "Space"},
{code: 16, name: "Shift"},
{code: 69, name: "e"},
{code: 27, name: "Escape"},
];
var changeControl = -1;
var deaths = parseInt(getCookie("deaths"));
if(isNaN(deaths)) {
  deaths = 0;
}
var notification = {texture: 0, text: "", description: "", timer: 0};
var achievements = [
{name: "Pro Gamer", description: "Finish the tutorial", texture: 51, unlocked: false}, 
{name: "Powerup", description: "Open a chest", texture: 32, unlocked: false},
{name: "You're bad", description: "Die 50 times", texture: 15, unlocked: false},
{name: "Secret", description: "Find a secret", texture: 50, unlocked: false},
{name: "IKEA", description: "Visit IKEA", texture: 52, unlocked: false}
];
for(var i = 0; i < achievements.length; i++) {
  var val = getCookie("achievement" + i);
  if(val == undefined) {
    continue;
  } else {
    if(val == "true") {
      achievements[i].unlocked = true;
    }
    if(val == "false") {
      achievements[i].unlocked = false;
    }
  }
}
var buttons = [
{x: 0.35 * c.width, y: 0.1 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Error 404", menu: -1, onClick: () => {}},
{x: 0.35 * c.width, y: 0.2 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Back", menu: -1, onClick: () => {menu = 0}},

{x: 0.35 * c.width, y: 0.1 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Play", menu: 0, onClick: () => {menu = 10}},
{x: 0.35 * c.width, y: 0.2 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Settings", menu: 0, onClick: () => {menu = 11}},
{x: 0.35 * c.width, y: 0.3 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Highscores", menu: 0, onClick: () => {menu = 6}},
{x: 0.35 * c.width, y: 0.4 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Achievements", menu: 0, onClick: () => {menu = 7}},
{x: 0.35 * c.width, y: 0.5 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Credits", menu: 0, onClick: () => {menu = 2}},

{x: 0.4 * c.width, y: 0.1 * c.height, w: 0.2 * c.width, h: 0.075 * c.height, text: "Continue", menu: 1, onClick: () => {paused = false}}, 
{x: 0.4 * c.width, y: 0.8 * c.height, w: 0.2 * c.width, h: 0.075 * c.height, text: "Main Menu", menu: 1, onClick: () => {menu = 0}}, 

{x: 0.35 * c.width, y: 0.9 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Back", menu: 2, onClick: () => {menu = 0}},

{x: 0.35 * c.width, y: 0.8 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Back", menu: 3, onClick: () => {menu = 11}},

{x: 0.35 * c.width, y: 0.8 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Back", menu: 4, onClick: () => {menu = 6}},

{x: 0.35 * c.width, y: 0.8 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Back", menu: 5, onClick: () => {menu = 6}},

{x: 0.35 * c.width, y: 0.1 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Normal", menu: 6, onClick: () => {menu = 4}},
{x: 0.35 * c.width, y: 0.2 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Challenge", menu: 6, onClick: () => {menu = 5}},
{x: 0.35 * c.width, y: 0.3 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Reset Highscores", menu: 6, onClick: () => {resetScore()}},
{x: 0.35 * c.width, y: 0.8 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Back", menu: 6, onClick: () => {menu = 0}},

{x: 0.35 * c.width, y: 0.85 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Back", menu: 7, onClick: () => {menu = 0}},

{x: 0.35 * c.width, y: 0.1 * c.height, w: 0.15 * c.width, h: 0.075 * c.height, text: "Left", menu: 8, onClick: () => {changeControl = 0}},
{x: 0.35 * c.width, y: 0.2 * c.height, w: 0.15 * c.width, h: 0.075 * c.height, text: "Right", menu: 8, onClick: () => {changeControl = 1}},
{x: 0.35 * c.width, y: 0.3 * c.height, w: 0.15 * c.width, h: 0.075 * c.height, text: "Jump", menu: 8, onClick: () => {changeControl = 2}},
{x: 0.35 * c.width, y: 0.4 * c.height, w: 0.15 * c.width, h: 0.075 * c.height, text: "Grab", menu: 8, onClick: () => {changeControl = 3}},
{x: 0.35 * c.width, y: 0.5 * c.height, w: 0.15 * c.width, h: 0.075 * c.height, text: "Shoot", menu: 8, onClick: () => {changeControl = 4}},
{x: 0.35 * c.width, y: 0.6 * c.height, w: 0.15 * c.width, h: 0.075 * c.height, text: "Interact", menu: 8, onClick: () => {changeControl = 5}},
{x: 0.35 * c.width, y: 0.8 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Back", menu: 8, onClick: () => {menu = 11}},

{x: 0.35 * c.width, y: 0.8 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Back", menu: 9, onClick: () => {menu = 10}},

{x: 0.35 * c.width, y: 0.1 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Normal", menu: 10, onClick: () => {challengeMode = false; menu = 9}},
{x: 0.35 * c.width, y: 0.2 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Challenge", menu: 10, onClick: () => {challengeMode = true; menu = 9}},
{x: 0.35 * c.width, y: 0.8 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Back", menu: 10, onClick: () => {menu = 0}},

{x: 0.35 * c.width, y: 0.1 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Sound", menu: 11, onClick: () => {menu = 12}},
//{x: 0.35 * c.width, y: 0.2 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Controls", menu: 11, onClick: () => {menu = 8}},
{x: 0.35 * c.width, y: 0.2 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Characters", menu: 11, onClick: () => {menu = 3}},
{x: 0.35 * c.width, y: 0.8 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Back", menu: 11, onClick: () => {menu = 0}},

{x: 0.35 * c.width, y: 0.8 * c.height, w: 0.3 * c.width, h: 0.075 * c.height, text: "Back", menu: 12, onClick: () => {menu = 11}}

];

var sliders = [
{x: 0.35 * c.width, y: 0.1 * c.height, w: 0.3 * c.width, min: 0, max: 1, value: 0.1, menu: 12},
{x: 0.35 * c.width, y: 0.2 * c.height, w: 0.3 * c.width, min: 0, max: 1, value: 0.1, menu: 12}
];

var texts = [
{x: 0.23 * c.width, y: 0.125 * c.height, size: 0.05 * c.height, menu: 12, text: "Music"},
{x: 0.23 * c.width, y: 0.225 * c.height, size: 0.05 * c.height, menu: 12, text: "Sound"}
];

var costumes = [
{anims: [[{texture: 0, time: 4}, {texture: 3, time: 4}],
        [{texture: 0, time: 0}],
        [{texture: 18, time: 0}],
        [{texture: 5, time: 0}], 
        [{texture: 16, time: 5}, {texture: 17, time: 5}],
        [{texture: 16, time: 5}, {texture: 17, time: 5}], 
        [{texture: 16, time: 0}]], unlocked: false},
        
{anims: [[{texture: 52, time: 4}, {texture: 53, time: 4}],
        [{texture: 52, time: 0}],
        [{texture: 57, time: 0}],
        [{texture: 59, time: 0}],  
        [{texture: 55, time: 5}, {texture: 56, time: 5}],
        [{texture: 55, time: 5}, {texture: 56, time: 5}], 
        [{texture: 56, time: 0}]], unlocked: false},
        
{anims: [[{texture: 75, time: 4}, {texture: 76, time: 4}],
        [{texture: 75, time: 0}],
        [{texture: 79, time: 0}],
        [{texture: 80, time: 0}],  
        [{texture: 77, time: 5}, {texture: 78, time: 5}],
        [{texture: 77, time: 5}, {texture: 78, time: 5}], 
        [{texture: 78, time: 0}]], unlocked: false}
];

for(var i = 0; i < costumes.length; i++) {
  buttons.push({x: (0.3 + 0.15 * (i % 3)) * c.width, y: (0.1 + 0.275 * Math.floor(i / 3)) * c.height, w: 0.2 * c.height, h: 0.2 * c.height, text: i.toString(), texture: costumes[i].anims[1][0].texture, menu: 3, onClick: function(i) {return () => {setCostume(i)}}(i)});
}

var costume = 0;
for(var i = 0; i < costumes.length; i++) {
  var res = getCookie("costume" + i);
  if(res == undefined || res == "false") {
    costumes[i].unlocked = false;
  }
  if(res == "true") {
    costumes[i].unlocked = false;
  }
}

costumes[0].unlocked = true;

setCostume(costume);
function setCostume(id) {
  if(costumes[id].unlocked) {
    costume = id;
    player.anims = costumes[costume].anims;
  }
}

function unlockCostume(id) {
  if(!costumes[id].unlocked) {
    costumes[id].unlocked = true;
    notification.timer = 90;
    notification.texture = costumes[id].anims[1][0].texture;
    notification.text = "Character unlocked!";
    notification.description = "You got a new character";
  }
}

for(var i = 0; i < levels; i++) {
  var text = i;
  var w = 0.1;
  if(i == 0) {
    text = "Tutorial";
    w = 0.3375;
  }
  if(i <= 1) {
    buttons.push({x: (0.562 - w / 1.75 + 0.067 * (i % 2)) * c.width, y: (0.1 + 0.15 * Math.floor(i / 2)) * c.height, w: w * c.height, h: 0.1 * c.height, text: text, menu: 9, onClick: () => {start()}});
  } else {
    buttons.push({x: (0.425 - w / 1.75 + 0.068 * ((i - 2) % 4)) * c.width, y: (0.1 + 0.125 * Math.floor((i - 2) / 4 + 1)) * c.height, w: w * c.height, h: 0.1 * c.height, text: text, menu: 9, onClick: () => {start()}});
  }
}

function setZoom(z) {
  ctx.scale(1 / zoom, 1 / zoom);
  ctx.translate(c.width / (1 / zoom * 2) - c.width / 2, c.height / (1 / zoom * 2) - c.height / 2);

  zoom = z;
  ctx.scale(z, z);
  ctx.translate(c.width / (z * 2) - c.width / 2, c.height / (z * 2) - c.height / 2);
}

function start() {
  editMode = false;
  cheatMode = false;
  deaths--; // Prevent extra death count
  player.die(); 
  player.spawnTimer = 15;
  if(challengeMode) {
    player.hp = 1;
  }
  player.pos.x = level.spawnPoint.x;
  player.pos.y = level.spawnPoint.y;
  paused = false;
  menu = 1;
  startTime = time;
  score = 0;
}

function startTutorial() {
  editMode = false;
  cheatMode = false;
  levelId = 0;
  deaths--; // Prevent extra death count
  player.die(); 
  player.spawnTimer = 15;
  if(challengeMode) {
    player.hp = 1;
  }
  player.pos.x = level.spawnPoint.x;
  player.pos.y = level.spawnPoint.y;
  paused = false;
  menu = 1;
  startTime = time;
  score = 0;
}

function resetScore() {
  for(var i = 0; i < highscores.length; i++) {
    highscores[i].normal = NaN;
    highscores[i].challenge = NaN;
  }
}

// The object arrays are in order of rendering
var objectNames = ["backgrounds", "crates", "walls", "doors", "buttons", "npcs", "deaths", "chests", "foregrounds", "pickups"];
var objectColliders = ["", "collide(side, object)", "collide(side, object)", "collide(side, object)", "object.pressed = true", "if(object.type == 2) {player.damage(25)} if(object.type == 3) {player.damage(40)}", "collide(side, object); player.damage(50 - Math.round(Math.random() * 20))", "", "", "if(!challengeMode || object.inChallengeMode) {object.onPickup(); objects.splice(i, 1); i--}"];

var startTime = 0;
var score = 0;
var highscores = [];
for(var i = 0; i < levels; i++) {
  highscores.push({normal: parseFloat(getCookie("highscore" + i)), challenge: parseFloat(getCookie("challengeHighscore" + i))});
}

///////////////////////////
levelId = -1;
start();
cheatMode = true;
godMode = true;
///////////////////////////

window.onbeforeunload = function() {
  for(var i = 0; i < highscores.length; i++) {
    setCookie("highscore" + i, highscores[i].normal);
    setCookie("challengeHighscore" + i, highscores[i].challenge);
  }
  for(var i = 0; i < achievements.length; i++) {
    setCookie("achievement" + i, achievements[i].unlocked);
  }
  setCookie("deaths", deaths);
  setCookie("unlockedLevels", unlockedLevels);
  setCookie("unlockedChallengeLevels", unlockedChallengeLevels);
  for(var i = 0; i < costumes.length; i++) {
    setCookie("costume" + i, costumes[i].unlocked);
  }
}

var cv = document.createElement("canvas");
cv.width = c.width;
cv.height = c.width;
var ctxv = cv.getContext("2d");
var v = ctx.createRadialGradient(c.width / 2, c.width / 2, c.width / 2, c.width / 2, c.width / 2, c.width / 10);
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
var helpTimer = 0;

if(window.location.origin == "file://") {
  cheatable = true;
  unlockedLevels = levels - 1;
  unlockedChallengeLevels = levels - 1;
  for(var i = 0; i < costumes.length; i++) {
    costumes[i].unlocked = true;
  }
}

ctx.fillStyle = "rgb(0, 0, 0)";
ctx.fillRect(0, 0, c.width, c.height);

ctx.beginPath();
ctx.rect(c.width / 2 - c.width / 5 - c.height * 0.01, c.height / 2 - c.height / 20 - c.height * 0.01, c.width / 5 * 2 + c.height * 0.02, c.height / 20 * 2 + c.height * 0.02);
ctx.closePath();
ctx.strokeStyle = "rgb(255, 255, 255)"; 
ctx.lineWidth = c.height * 0.005;
ctx.stroke();

var loadScreenTimer = 0;
var loop;
function startUpdateLoop() {
  loop = setInterval(update, 1000 / fps);
}

function update() {
if(deaths >= 50) {
  unlockAchievement(2);
}
if(menu == 0) {
  player.spawnTimer = 15;
}
if(menu != 8) {
  changeControl = -1;
}
prevMusicVolume = musicVolume;
prevMousePressed = mousePressed;
musicVolume = sliders[0].value;
soundVolume = sliders[1].value;
if(prevMusicVolume != musicVolume) {
  audio[3].stop();
  audio[3].play(musicVolume, true);
}
if(!paused) {
  time = window.performance.now();
  
  score++;
  
  if(player.pos.x < 0.05 * c.height && player.pos.x > -0.05 * c.height && levelId == 0) {
    helpTimer++;
    if(helpTimer > 200) {
      helpTimer = 0;
      notification.texture = 65;
      notification.text = "Tip";
      notification.description = "Press A, D, \u21E6 or \u21E8 to move";
      notification.timer = 90;
    }
  } else if(player.pos.x < 0.8 * c.height && player.pos.x > 0.1 * c.height && levelId == 0) {
    helpTimer++;
    if(helpTimer > 200) {
      helpTimer = 0;
      notification.texture = 65;
      notification.text = "Tip";
      notification.description = "Press W or \u21E7 to jump";
      notification.timer = 90;
    }
  } else if(player.pos.x < 1.3 * c.height && player.pos.x > 0.9 * c.height && levelId == 0) {
    helpTimer++;
    if(helpTimer > 200) {
      helpTimer = 0;
      notification.texture = 65;
      notification.text = "Tip";
      notification.description = "While sliding down the wall, jump";
      notification.timer = 90;
    }
  } else if(player.pos.x < 2 * c.height && player.pos.x > 1.4 * c.height && levelId == 0) {
    helpTimer++;
    if(helpTimer > 200) {
      helpTimer = 0;
      notification.texture = 65;
      notification.text = "Tip";
      notification.description = "Press Space to pull the crate";
      notification.timer = 90;
    }
  } else if(player.pos.x < 3 * c.height && player.pos.x > 2.2 * c.height && levelId == 0) {
    helpTimer++;
    if(helpTimer > 200) {
      helpTimer = 0;
      notification.texture = 65;
      notification.text = "Tip";
      notification.description = "Press Shift to shoot";
      notification.timer = 90;
    }
  } else {
    helpTimer = 0;
  }
  
  if(player.jumping) {
    
  }
  
  var area = {pos: {x: 0.4 * c.height, y: 0 * c.height}, size: {x: 0.4 * c.height, y: 0.3 * c.height}};
  if(checkCollision(player, area) && levelId == 2) {
    unlockAchievement(3);
  }

  if(player.shootTimer <= 0 && player.shooting && !cheatMode) {
    player.shootTimer = player.shootSpeed;
    audio[0].play(1 * soundVolume, false);
    if(!player.textureFlipped) {
      level.projectiles.push(new projectile((player.pos.x - player.size.x - 0.075) / c.height, (player.pos.y + player.size.y * 0.5) / c.height, 0.075, 0.075, 0.025, 0, 36, false));
    } else {
      level.projectiles.push(new projectile((player.pos.x - player.size.x / 2) / c.height, (player.pos.y + player.size.y * 0.5) / c.height, 0.075, 0.075, -0.025, 0, 36, false));
    }
  }
  
  if(godMode) {
    player.hp = Infinity;
  } else if(player.hp > 100) {
    player.hp = 100;
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
  for(var i = 0; i < level.buttons.length; i++) {
    level.buttons[i].pressed = false;
  }
  
  // Crates
  for(var i = 0; i < level.crates.length; i++) {
    level.crates[i].update();
  }

  // Collisions
  for(var j = 0; j < objectNames.length; j++) {
    collideObjects(eval("level." + objectNames[j]), objectColliders[j]);
  }
  
  // Buttons
  for(var i = 0; i < level.signals.length; i++) {
    level.signals[i] = false;
  }
  
  for(var i = 0; i < level.buttons.length; i++) {
    if(level.buttons[i].pressed) {
      level.buttons[i].texture = 12;
    } else {
      level.buttons[i].texture = 11;
    }
    
    if(level.buttons[i].pressed) {
      level.signals[level.buttons[i].id] = true;
    }
  }
  
  // Doors
  for(var i = 0; i < level.doors.length; i++) {
    level.doors[i].update();
  }
  
  // Pickups
  for(var i = 0; i < level.pickups.length; i++) {
    level.pickups[i].update();
  }
  
  // Chests
  for(var i = 0; i < level.chests.length; i++) {
    var chestPos = {x: level.chests[i].pos.x + level.chests[i].size.x / 2, y: level.chests[i].pos.y + level.chests[i].size.y / 2};
    var playerPos = {x: player.pos.x + player.size.x / 2, y: player.pos.y + player.size.y / 2};
    var dist = Math.sqrt(Math.abs(chestPos.x - playerPos.x) ** 2 + Math.abs(chestPos.y - playerPos.y) ** 2);
    if(dist < 0.13 * c.height && !cheatMode && player.e) {
      if(keys > 0 && !level.chests[i].opened) {
        level.chests[i].opened = true;
        keys--;
        level.chests[i].openTimer = 15;
        unlockAchievement(1);
      }
    }
    if(level.chests[i].opened && level.chests[i].texture != 35) {
      level.chests[i].texture = 35;
    }
    if(level.chests[i].openTimer > 0) {
      level.chests[i].openTimer--;
    } else if(level.chests[i].opened && level.chests[i].openTimer == 0 && level.chests[i].gotItem) {
      var item = Object.assign({}, level.chests[i].item);
      item.pos.x = level.chests[i].pos.x + level.chests[i].size.x / 2 - item.size.x / 2;
      item.pos.y = level.chests[i].pos.y + level.chests[i].size.y / 2 - item.size.y / 2 - 0.075 * c.height;
      level.pickups.push(item);
      level.chests[i].gotItem = false;
    }
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
    if(player.vel.x > 0) {
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
  
  for(var i = 0; i < level.portals.length; i++) {
    var dX = (player.pos.x + player.size.x / 2) - (level.portals[i].x + 0.075 * c.height);
    var dY = (player.pos.y + player.size.y / 2) - (level.portals[i].y + 0.075 * c.height);
    var distEnd = Math.sqrt(Math.abs(dX) ** 2 + Math.abs(dY) ** 2);
    if(distEnd < 0.26 * c.height && !cheatMode) {
      player.vel.x += -dX / distEnd * 3;
      player.vel.y += -dY / distEnd * 3;
    }
    if(distEnd < 0.033 * c.height && !cheatMode) {
      if(levelId < levels && levelId >= 0) {
        if(!challengeMode) {
          if(levelId >= unlockedLevels) {
            unlockedLevels = levelId + 1;
          }
          if((score / fps < highscores[levelId].normal || isNaN(highscores[levelId].normal)) && levelId < levels) {
            highscores[levelId].normal = Math.round(score / fps * 1000) / 1000;
          }
        }
        if(challengeMode) {
          if(levelId >= unlockedChallengeLevels) {
            unlockedChallengeLevels = levelId + 1;
          }
          if((score / fps < highscores[levelId].challenge || isNaN(highscores[levelId].challenge)) && levelId < levels) {
            highscores[levelId].challenge = Math.round(score / fps * 1000) / 1000;
          }
        }
      }
      if(levelId == 0) {
        unlockAchievement(0);
      }
      if(levelId != 0) {
        startTime = time;
        levelId = level.portals[i].dest;
        level = loadLevel(levelId);
        player.speed = c.height * 0.01,
        player.jumpStrength = c.height * 0.035;
        player.pos.x = level.spawnPoint.x;
        player.pos.y = level.spawnPoint.y;
        player.onGround = false;
        player.spawnTimer = 30;
        player.vel = new vec2(0, 0);
        player.hp = 100;
        if(challengeMode) {
          player.hp = 1;
        }
        player.invulnerableTimer = 0;
        keys = 0;
        score = 0;
      } else {
        paused = true;
        menu = 0;
      }
    }
  }
  
  // Npcs
  for(var i = 0; i < level.npcs.length; i++) {
    level.npcs[i].update();
    if(level.npcs[i].delete) {
      level.npcs.splice(i, 1);
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
  
  if(player.shootTimer > 0) {
    player.shootTimer--;
    if(player.textureFlipped) {
      cameraOffset.x += player.shootTimer * 0.75;
      cameraOffset.x += (Math.random() - 0.5) * 0.001 * c.height * player.shootTimer;
      cameraOffset.y += (Math.random() - 0.5) * 0.002 * c.height * player.shootTimer;
    } else {
      cameraOffset.x += -player.shootTimer * 0.75;
      cameraOffset.x += (Math.random() - 0.5) * 0.001 * c.height * player.shootTimer;
      cameraOffset.y += (Math.random() - 0.5) * 0.002 * c.height * player.shootTimer;
    }
  }
  
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
} else {
  // Paused
  draw();
  ctx.fillStyle = "rgb(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, c.width, c.height);
  drawMenu();
}
if(notification.timer > 0) {
  var off = Math.min(10, 90 - notification.timer) / 10 * 0.1 - 0.1;
  if(notification.timer < 10) {
    off = notification.timer / 10 * 0.1 - 0.1;
  }
  ctx.fillStyle = "rgb(150, 150, 150, 0.75)";
  ctx.fillRect(0.35 * c.width, (0 + off) * c.height, 0.3 * c.width, 0.1 * c.height);
    
  ctx.drawImage(textures[notification.texture], 0.36 * c.width, (0.01 + off) * c.height, 0.075 * c.height, 0.075 * c.height);

  drawText(notification.text, 0.42 * c.width, (0.045 + off) * c.height, 0.06 * c.height);
  drawText(notification.description, 0.42 * c.width, (0.075 + off) * c.height, 0.04 * c.height);
    
  notification.timer--;
}

if(loadScreenTimer < 15) {
  loadScreenTimer++;
  ctx.fillStyle = "rgb(0, 0, 0," + (1 - loadScreenTimer / 15) + ")";
  ctx.fillRect(0, 0, c.width, c.height);
}
}

function setCookie(name, value) {
  var d = new Date();
  d.setFullYear(d.getFullYear() + 5);
  document.cookie = name + "=" + value + "; expires=" + d.toGMTString();
}

function getCookie(name) {
  var cookies = document.cookie.split("; ");
  for(var i = 0; i < cookies.length; i++) {
    if(cookies[i].search(name) == 0) {
      var res = cookies[i].substr(cookies[i].search("=") + 1);
      if(res != "undefined") {
        return res;
      }
    }
  }
  return undefined;
}

function unlockAchievement(id) {
  if(!achievements[id].unlocked) {
    achievements[id].unlocked = true;
    notification.texture = achievements[id].texture;
    notification.text = "Achievement unlocked!";
    notification.description = achievements[id].description;
    notification.timer = 90;
  }
}

function drawMenu() {
  if(menu == 0 || menu == 2 || menu == 3 || menu == 4 || menu == 5 || menu == 6 || menu == 7 || menu == 8 || menu == 9 || menu == 10 || menu == 11 || menu == 12) {
    var pattern = ctx.createPattern(textures[2], "repeat");
    ctx.fillStyle = pattern;
    ctx.save();
    ctx.scale(c.height / textures[2].height, c.height / textures[2].height);
    ctx.scale(0.2, 0.2);
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.restore();
  }
  if(menu == 4 || menu == 5) {
    if(menu == 4) {
      ctx.fillStyle = "rgb(255, 255, 255, 0.75)";
    } else if(menu == 5) {
      ctx.fillStyle = "rgb(255, 100, 100, 0.75)";
    }
    ctx.fillRect(0.3 * c.width, 0.05 * c.height, 0.4 * c.width, 0.7 * c.height);
    ctx.font = 0.04 * c.height + "px Arial";
    for(var i = 0; i < levels; i++) {
      if(menu == 4) {
        ctx.fillStyle = "rgb(0, 0, 0, 0.75)";
        ctx.fillText("Level " + i + ": " + highscores[i].normal, 0.31 * c.width, (0.1 + 0.05 * i) * c.height);
      } else if(menu == 5) {
        ctx.fillStyle = "rgb(0, 0, 0, 0.75)";
        ctx.fillText("Level " + i + ": " + highscores[i].challenge, 0.31 * c.width, (0.1 + 0.05 * i) * c.height);
      }
    }
  }
  if(menu == 12) {
    ctx.fillStyle = "rgb(255, 255, 255, 0.75)";
    ctx.fillRect(0.4 * c.height, 0.075 * c.height, 0.2 * c.height, 0.5 * c.height);
  }
  if(menu == 8) {
    ctx.font = 0.05 * c.height + "px Arial";
    for(var i = 0; i < controls.length - 1; i++) {
      ctx.fillStyle = "rgb(255, 255, 255, 0.75)";
      ctx.fillRect(0.525 * c.width, (0.1 + 0.1 * i) * c.height, 0.3 * c.height, 0.075 * c.height);
      ctx.fillStyle = "rgb(0, 0, 0, 0.75)";
      if(controls[i].code != 32) {
        var text = controls[i].name;
        if(i == 0) {
          text += " or \u21E6";
        }
        if(i == 1) {
          text += " or \u21E8";
        }
        if(i == 2) {
          text += " or \u21E7";
        }
        ctx.fillText(text, 0.535 * c.width, (0.15 + 0.1 * i) * c.height);
      } else {
        ctx.fillText("Space", 0.535 * c.width, (0.15 + 0.1 * i) * c.height);
      }
    }
  }
  if(menu == 2) {
    ctx.fillStyle = "rgb(255, 255, 255, 0.75)";
    ctx.fillRect(0.375 * c.width, 0.05 * c.height, 0.25 * c.width, 0.8 * c.height);
    ctx.textAlign = "center";
    drawText("Credits", 0.5 * c.width, 0.1 * c.height, 0.1 * c.height);
    
    drawText("Art", 0.5 * c.width, 0.15 * c.height, 0.075 * c.height);
    drawText("Anton", 0.5 * c.width, 0.2 * c.height, 0.05 * c.height);
    drawText("Isak", 0.5 * c.width, 0.25 * c.height, 0.05 * c.height);
    drawText("Markus", 0.5 * c.width, 0.3 * c.height, 0.05 * c.height);
    drawText("Love", 0.5 * c.width, 0.35 * c.height, 0.025 * c.height);
    
    drawText("Music & Sound", 0.5 * c.width, 0.45 * c.height, 0.075 * c.height);
    drawText("Isak", 0.5 * c.width, 0.5 * c.height, 0.05 * c.height);

    drawText("Coding", 0.5 * c.width, 0.6 * c.height, 0.075 * c.height);
    drawText("Isak", 0.5 * c.width, 0.65 * c.height, 0.05 * c.height);

    drawText('"Det mesta"', 0.5 * c.width, 0.75 * c.height, 0.075 * c.height);
    drawText("Love", 0.5 * c.width, 0.8 * c.height, 0.05 * c.height);
    drawText("Jakob", 0.5 * c.width, 0.825 * c.height, 0.01 * c.height);
    
    ctx.textAlign = "left";
  }
  for(var i = 0; i < buttons.length; i++) {
    if(buttons[i].menu == menu) {
      ctx.fillStyle = "rgb(255, 255, 255, 0.75)";
      if(buttons[i].text == "Challenge") {
        ctx.fillStyle = "rgb(255, 100, 100, 0.75)";
      }
      ctx.fillStyle = "#2b1204";
      ctx.fillRect(buttons[i].x, buttons[i].y, buttons[i].w, buttons[i].h);
      var pattern = ctx.createPattern(textures[64], "repeat");
      ctx.fillStyle = pattern;
      ctx.save();
      ctx.translate(buttons[i].x + buttons[i].h / 11, buttons[i].y);
      var s = c.height / textures[64].height;
      var r = buttons[i].h / c.height;
      ctx.scale(s, s);
      ctx.scale(r, r);
      ctx.fillRect(0, 0, (buttons[i].w - buttons[i].h / 11 * 2) / s / r, buttons[i].h / s / r);
      ctx.restore();
      var s = 0.1 * c.height;
      var off = 0.025 * c.height;
      ctx.fillStyle = "rgb(175, 125, 75)";
      if(menu == 3) {
        if(buttons[i].texture || buttons[i].texture == 0) {
          if(!isNaN(parseInt(buttons[i].text)) && costumes[parseInt(buttons[i].text)].unlocked) {
            if(costume == parseInt(buttons[i].text)) {
              ctx.fillStyle = "rgb(0, 255, 0, 0.125)";
              ctx.fillRect(buttons[i].x, buttons[i].y, buttons[i].w, buttons[i].h);
            }
            ctx.drawImage(textures[buttons[i].texture], buttons[i].x + 0.02 * c.height, buttons[i].y + 0.02 * c.height, buttons[i].w - 0.04 * c.height, buttons[i].h - 0.04 * c.height);
          } else {
            ctx.drawImage(textures[49], buttons[i].x + 0.02 * c.height, buttons[i].y + 0.02 * c.height, buttons[i].w - 0.04 * c.height, buttons[i].h - 0.04 * c.height);
          }
        }
      }
      if(menu == 9) {
        if(buttons[i].text.constructor.name == "Number") {
          if(parseInt(buttons[i].text) > unlockedLevels && !challengeMode) {
            ctx.drawImage(textures[49], buttons[i].x + 0.005 * c.height, buttons[i].y + 0.0075 * c.height, buttons[i].h * 0.9, buttons[i].h * 0.9);
          } else if(parseInt(buttons[i].text) > unlockedChallengeLevels && challengeMode) {
            ctx.drawImage(textures[49], buttons[i].x + 0.005 * c.height, buttons[i].y + 0.0075 * c.height, buttons[i].h * 0.9, buttons[i].h * 0.9);
          } else {
            drawText(buttons[i].text, buttons[i].x + off, buttons[i].y + s / 5 + buttons[i].h / 2, s);
          }
        } else {
          drawText(buttons[i].text, buttons[i].x + off, buttons[i].y + s / 5 + buttons[i].h / 2, s);
        }
      } else if(menu != 3 || (menu == 3 && buttons[i].texture == undefined)) {
        drawText(buttons[i].text, buttons[i].x + off, buttons[i].y + s / 5 + buttons[i].h / 2, s);
      }
    }
  }
  for(var i = 0; i < sliders.length; i++) {
    if(sliders[i].menu == menu) {
      ctx.fillStyle = "rgb(150, 150, 150, 1)";
      ctx.fillRect(sliders[i].x, sliders[i].y, sliders[i].w, 0.02 * c.height);
      ctx.beginPath();
      ctx.ellipse(sliders[i].x + (sliders[i].value - sliders[i].min) / (sliders[i].max - sliders[i].min) * sliders[i].w, sliders[i].y + 0.01 * c.height, 0.025 * c.height, 0.025 * c.height, 0, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = "rgb(255, 255, 255, 1)";
      ctx.fill();
    }
  }
  for(var i = 0; i < texts.length; i++) {
    if(texts[i].menu == menu) {
      ctx.fillStyle = "#000000";
      ctx.font = texts[i].size + "px Arial";
      ctx.fillText(texts[i].text, texts[i].x, texts[i].y);
    }
  }
  if(menu == 7) {
    for(var i = 0; i < achievements.length; i++) {
      var x = (0.15 + 0.15 * (i % 3 + 1)) * c.width;
      var y = (0.1 + 0.25 * Math.floor(i / 3)) * c.height;
      ctx.fillStyle = "rgb(255, 255, 255, 0.75)";
      if(achievements[i].unlocked) {
        ctx.fillStyle = "rgb(100, 255, 100, 0.75)";
      }
      ctx.fillRect(x, y, 0.2 * c.height, 0.2 * c.height);
      ctx.drawImage(textures[achievements[i].texture], x + 0.025 * c.height, y + 0.025 * c.height, 0.15 * c.height, 0.15 * c.height);
      if(!achievements[i].unlocked) {
        ctx.globalCompositeOperation = "saturation";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(x, y, 0.2 * c.height, 0.2 * c.height);
        ctx.globalCompositeOperation = "source-over";
      }
    }
    for(var i = 0; i < achievements.length; i++) {
      var x = (0.15 + 0.15 * (i % 3 + 1)) * c.width;
      var y = (0.1 + 0.25 * Math.floor(i / 3)) * c.height;
      
      var m = {pos: {x: mousePos.x, y: mousePos.y}, size: {x: 0, y: 0}};
      var a = {pos: {x: x, y: y}, size: {x: 0.2 * c.height, y: 0.2 * c.height}};
      if(checkCollision(m, a)) {
        if(achievements[i].unlocked) {
          ctx.fillStyle = "rgb(100, 255, 100, 0.8)";
        } else {
          ctx.fillStyle = "rgb(150, 150, 150, 0.8)";
        }
        ctx.fillRect(mousePos.x, mousePos.y, 0.4 * c.height, 0.125 * c.height);
        
        var name = achievements[i].name;
        var desc = achievements[i].description;
        if(!achievements[i].unlocked) {
          name = "???";
          desc = "???";
        }
        drawText(name, mousePos.x + 0.025 * c.height, mousePos.y + 0.06 * c.height, 0.075 * c.height);
        drawText(desc, mousePos.x + 0.025 * c.height, mousePos.y + 0.1 * c.height, 0.05 * c.height);
      }
    }
  }
}

function drawText(text, x, y, size) {
  ctx.font = size + "px font";
  ctx.strokeStyle = "rgb(0, 0, 0)";
  ctx.lineWidth = size * 0.1;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText(text, x, y);
}

function draw() {
  // Clear screen
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(-c.width / zoom + c.width, -c.height / zoom + c.height, c.width / zoom * 2, c.height / zoom * 2);
  
  // Objects
  if(player.invulnerableTimer > 0 && !paused) {
    var t = Math.min(player.invulnerableTimer / 15, 0.75);
    cameraOffset.x += Math.random() * 50 * t - 25 * t;
    cameraOffset.y += Math.random() * 50 * t - 25 * t;
  }
  for(var j = 0; j < objectNames.length; j++) {
    var objects = eval("level." + objectNames[j]);
    if(objectNames[j] == "foregrounds") {
      for(var i = 0; i < level.portals.length; i++) {
        ctx.drawImage(textures[level.portals[i].texture], level.portals[i].x - cameraOffset.x, level.portals[i].y - cameraOffset.y, 0.15 * c.height, 0.15 * c.height);
      }
  
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
      if((challengeMode && objects[k].inChallengeMode) || !challengeMode || objectNames[j] != "pickups") {
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
          ctx.fillStyle = "hsl(" + objects[k].id * (360 / level.signals.length) + ", 100%, 50%)";
          if(!objects[k].pressed) {
            ctx.fillRect(objects[k].pos.x - cameraOffset.x + objects[k].size.x / 2 - 0.01 * c.height, objects[k].pos.y - cameraOffset.y, 0.02 * c.height, 0.005 * c.height);
          } else {
            ctx.fillRect(objects[k].pos.x - cameraOffset.x + objects[k].size.x / 2 - 0.01 * c.height, objects[k].pos.y - cameraOffset.y + objects[k].size.y / 2, 0.02 * c.height, 0.005 * c.height);
          }
        }

        if(objects[k].constructor.name == "door") {
          ctx.fillStyle = "hsl(" + objects[k].id * (360 / level.signals.length) + ", 100%, 50%)";
          ctx.fillRect(objects[k].pos.x - cameraOffset.x + objects[k].size.x / 2 - 0.01 * c.height, objects[k].pos.y - cameraOffset.y, 0.02 * c.height, 0.005 * c.height);
        }
      }
    }
  }
  
  for(var i = 0; i < level.particleEmitters.length; i++) {
    if(!paused) {
      level.particleEmitters[i].update();
    }
  }
  for(var i = 0; i < level.particles.length; i++) {
    var p = level.particles[i];
    ctx.globalAlpha = p.opacity;
    ctx.drawImage(textures[p.texture], p.pos.x - cameraOffset.x, p.pos.y - cameraOffset.y, p.size.x, p.size.y);
    ctx.globalAlpha = 1;
    p.update();
    if(p.delete) {
      level.particles.splice(i, 1);
      i--;
      continue;
    }
  }
  
  for(var i = 0; i < level.projectiles.length; i++) {
    var p = level.projectiles[i];
    if(!paused) {
      p.update();
    }
    if(p.textureFlipped) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(textures[p.texture], cameraOffset.x - p.pos.x - p.size.x, p.pos.y - cameraOffset.y, p.size.x, p.size.y);
      ctx.restore();
    } else {
      ctx.drawImage(textures[p.texture], p.pos.x - cameraOffset.x, p.pos.y - cameraOffset.y, p.size.x, p.size.y);
    }
    if(p.delete) {
      level.projectiles.splice(i, 1);
      i--;
      continue;
    }
  }
  
  // Chest interact
  for(var i = 0; i < level.chests.length; i++) {
    var chestPos = {x: level.chests[i].pos.x + level.chests[i].size.x / 2, y: level.chests[i].pos.y + level.chests[i].size.y / 2};
    var playerPos = {x: player.pos.x + player.size.x / 2, y: player.pos.y + player.size.y / 2};
    var dist = Math.sqrt(Math.abs(chestPos.x - playerPos.x) ** 2 + Math.abs(chestPos.y - playerPos.y) ** 2);
    if(dist < 0.13 * c.height && !cheatMode) {
      if(!level.chests[i].opened) {
        var text = "Press 'E' to open";
        if(keys == 0) {
          text = "It's locked";
        }
        ctx.textAlign = "center";
        drawText(text, level.chests[i].pos.x - cameraOffset.x + level.chests[i].size.x / 2, level.chests[i].pos.y - cameraOffset.y - 0.02 * c.height - Math.sin(time / 250) * 3, 0.05 * c.height);
        ctx.textAlign = "left";
      }
    }
    if(level.chests[i].opened && level.chests[i].openTimer > 0) {
      ctx.drawImage(textures[level.chests[i].item.texture], level.chests[i].pos.x + level.chests[i].size.x / 2 - level.chests[i].item.size.x / 2 - cameraOffset.x, level.chests[i].pos.y + level.chests[i].openTimer * 2 - 0.025 * c.height - cameraOffset.y, level.chests[i].item.size.x, level.chests[i].item.size.x);
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
  if(!challengeMode) {
    ctx.drawImage(vignette, 0, 0, c.width, c.height);
  }
  ctx.globalAlpha = 1;
  
  // Hp
  var tex = 26;
  if(player.hp <= 66) {
    tex = 30;
  }
  if(player.hp <= 33) {
    tex = 31;
  }
  ctx.drawImage(textures[tex], 0.005 * c.height, 0.005 * c.height, 0.045 * c.height, 0.045 * c.height);
  
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0.06 * c.height, 0.005 * c.height, 0.35 * c.height, 0.05 * c.height);
  
  if(player.hp > 5000) {
    ctx.fillStyle = "hsl(" + time / 5 + ", 100%, " + (40 + player.invulnerableTimer * 5) + "%)";
    ctx.fillRect(0.065 * c.height, 0.01 * c.height, 0.34 * c.height, 0.04 * c.height);
  } else {
    ctx.fillStyle = "hsl(" + player.hp + ", 100%, " + (40 + player.invulnerableTimer * 5) + "%)";
    ctx.fillRect(0.065 * c.height, 0.01 * c.height, 0.34 * c.height / 100 * player.hp, 0.04 * c.height);
  }
  
  // Keys
  ctx.drawImage(textures[33], 0.005 * c.height, 0.075 * c.height, 0.05 * c.height, 0.05 * c.height);
  drawText(keys, 0.06 * c.height, 0.115 * c.height, 0.1 * c.height);
  
  var offset = 0.1 * c.height;
  
  if(cheatMode && editMode) {
    ctx.fillStyle = "rgb(255, 255, 255, 0.5)";
    ctx.beginPath();
    var pos = {x: Math.round((mousePos.x + cameraOffset.x) / (editSnap * c.height)) * (editSnap * c.height), y: Math.round((mousePos.y + cameraOffset.y) / (editSnap * c.height)) * (editSnap * c.height)};
    ctx.ellipse(pos.x - cameraOffset.x, pos.y - cameraOffset.y, 10, 10, 0, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  
    ctx.fillStyle = "rgb(255, 255, 255, 0.5)";
    
    var textures_ = [];
    for(var i = 0; i < textures.length; i++) {
      var add = true;
      for(var j = 0; j < hiddenTextures.length; j++) {
        if(i == hiddenTextures[j]) {
          add = false;
          break;
        }
      }
      if(add) {
        textures_.push(i);
      }
    }
    for(var i = 0; i < textures_.length; i++) {
      if(selectedTexture == textures_[i]) {
        ctx.fillStyle = "rgb(0, 255, 0)";
        ctx.fillRect((i % 16) * 0.1 * c.height, Math.floor(i / 16) * 0.1 * c.height, 0.1 * c.height, 0.1 * c.height);
      } else {
        ctx.fillStyle = "rgb(255, 255, 255, 0.5)";
        ctx.fillRect((i % 16) * 0.1 * c.height, Math.floor(i / 16) * 0.1 * c.height, 0.1 * c.height, 0.1 * c.height);
      }
      if(textures[i].height <= textures[textures_[i]].width) {
        ctx.drawImage(textures[textures_[i]], (i % 16) * 0.1 * c.height, Math.floor(i / 16) * 0.1 * c.height, 0.1 * c.height, textures[textures_[i]].height * ((0.1 * c.height) / textures[textures_[i]].width));
      } else {
        ctx.drawImage(textures[textures_[i]], (i % 16) * 0.1 * c.height, Math.floor(i / 16) * 0.1 * c.height, textures[textures_[i]].width * ((0.1 * c.height) / textures[textures_[i]].height), 0.1 * c.height);
      }
      if(selectedTexture == textures_[i]) {
        ctx.fillStyle = "rgb(0, 255, 0, 0.1)";
        ctx.fillRect((i % 16) * 0.1 * c.height, Math.floor(i / 16) * 0.1 * c.height, 0.1 * c.height, 0.1 * c.height);
      }
    }
    
    ctx.fillStyle = "rgb(255, 255, 255, 0.75)";
    ctx.fillRect(0, 0.425 * c.height + offset, 0.175 * c.height, 0.26 * c.height);
    
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

  drawText(Math.round(actualFps), 0.975 * c.width, 0.03 * c.height, 0.075 * c.height);
  
  if(player.hp <= 0) {
    ctx.fillStyle = "rgb(0, 0, 0, " + (1 - player.invulnerableTimer / 30) + ")";
    ctx.fillRect(0, 0, c.width, c.height);
  }
  if(player.spawnTimer > 0) {
    ctx.fillStyle = "rgb(0, 0, 0, " + player.spawnTimer / 15 + ")";
    ctx.fillRect(0, 0, c.width, c.height);
  }
  
  if(consoleOpen) {
    ctx.fillStyle = "rgb(0, 0, 0, 0.75)";
    ctx.fillRect(0.5 * c.width, 0, 0.5 * c.width, 0.3 * c.height);
    
    var cur = "\u00A6";
    if(Math.round(time / 400) % 2 == 0) {
      cur = "|"
    }
    
    drawText(currentConsoleText.slice(0, consoleCursorPos) + cur + currentConsoleText.slice(consoleCursorPos), 0.51 * c.width, 0.035 * c.height, 0.05 * c.height);
    for(var i = 0; i < Math.min(consoleStack.length, 9); i++) {
      drawText(consoleStack[i], 0.51 * c.width, (0.06 + 0.025 * (i + 1)) * c.height, 0.05 * c.height);
    }
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
    if(player.shootTimer > 0) {
      ctx.drawImage(textures[34], -(player.pos.x - cameraOffset.x + 0.02 * c.height), player.pos.y - cameraOffset.y + 0.025 * c.height, 0.04 * c.height, 0.04 * c.height);
    }
    ctx.restore();
  } else {
    ctx.drawImage(textures[player.texture], 
                player.pos.x - cameraOffset.x - (w - player.size.x) / 2, 
                player.pos.y - cameraOffset.y, 
                w, 
                player.size.y);
    if(player.shootTimer > 0) {
      ctx.drawImage(textures[34], player.pos.x - cameraOffset.x + 0.04 * c.height, player.pos.y - cameraOffset.y + 0.025 * c.height, 0.04 * c.height, 0.04 * c.height);
    }
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

function sound(file) {
  this.file = file;
  this.audio = new Audio();
  this.audio.src = this.file;
  this.load = function() {
    this.source = actx.createMediaElementSource(this.audio);
    this.gain = actx.createGain();
    this.source.connect(this.gain);
    this.gain.connect(actx.destination);
  }
  this.play = function(volume, loop) {
    this.gain.gain.value = volume;
    if(loop) {
      this.audio.loop = true;
    }
    this.audio.play();
  }
  this.stop = function() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}

function activateAudio() {
  if(!actx) {
    actx = new AudioContext();
    for(var i = 0; i < audioFiles.length; i++) {
      audio[i].load();
    }
    audio[3].play(1 * musicVolume, true);
  }
}

function setSliderFromMousePos(s, x) {
  if(s >= 0) {
    sliders[s].value = Math.min(sliders[s].max, Math.max(sliders[s].min, (x - sliders[s].x) / sliders[s].w * (sliders[s].max - sliders[s].min) + sliders[s].min));
  }
}

window.onmouseup = function(e) {
  mousePressed = false;
  selectedSlider = -1;
}

window.onmousedown = function(e) {
  activateAudio();
  mousePressed = true;
  if(paused) {
    for(var i = 0; i < sliders.length; i++) {
      if(sliders[i].menu == menu) {
        var m = {pos: {x: e.clientX, y: e.clientY}, size: {x: 0, y: 0}};
        var b = {pos: {x: sliders[i].x, y: sliders[i].y}, size: {x: sliders[i].w, y: 0.02 * c.height}};
        if(checkCollision(m, b)) {
          selectedSlider = i;
          setSliderFromMousePos(selectedSlider, e.clientX);
        }
      }
    }
    for(var i = 0; i < buttons.length; i++) {
      if(buttons[i].menu == menu) {
        var m = {pos: {x: e.clientX, y: e.clientY}, size: {x: 0, y: 0}};
        var b = {pos: {x: buttons[i].x, y: buttons[i].y}, size: {x: buttons[i].w, y: buttons[i].h}};
        if(checkCollision(m, b)) {
          if(buttons[i].menu == 9) {
            if(buttons[i].text.constructor.name == "Number") {
              if(challengeMode) {
                if(buttons[i].text <= unlockedChallengeLevels) {
                  levelId = buttons[i].text;
                  buttons[i].onClick();
                }
              } else {
                if(buttons[i].text <= unlockedLevels) {
                  levelId = buttons[i].text;
                  buttons[i].onClick();
                }
              }
            } else if(buttons[i].text == "Tutorial") {
              levelId = 0;
              buttons[i].onClick();
            } else {
              buttons[i].onClick();
            }
          } else {
            buttons[i].onClick();
          }
          break;
        }
      }
    }
  } else {
  if(cheatMode && editMode) {
    if(!building) {
      if(!deleting) {
        var pos = {x: Math.round((mousePos.x + cameraOffset.x) / (editSnap * c.height)) * (editSnap * c.height), y: Math.round((mousePos.y + cameraOffset.y) / (editSnap * c.height)) * (editSnap * c.height)};
        pos.x /= c.height;
        pos.y /= c.height;
        switch(objectNames[selectedType]) {
        case "walls":
          level.walls.push(new wall(pos.x, pos.y, 0.1, 0.1, selectedTexture, editRepeating, editRepeatSize));
          building = true;
          break;

        case "backgrounds":
          level.backgrounds.push(new background(pos.x, pos.y, 0.1, 0.1, selectedTexture, editRepeating, editRepeatSize));
          building = true;
          break;

        case "crates":
          level.crates.push(new crate(pos.x, pos.y, 0.1, 0.1));
          console.log("res.crates.push(new crate(" + pos.x + ", " + pos.y + ", " + 0.1 + ", " + 0.1 + "));");
          break;
          
        case "doors":
          level.doors.push(new door(pos.x, pos.y, 0.1, 0.1, editId));
          building = true;
          
          level.signals = [];
          var x = 0;
          for(var i = 0; i < level.doors.length; i++) {
            if(level.doors[i].id > x) {
              x = level.doors[i].id;
            }
          }
          for(var i = 0; i < x + 1; i++) {
            level.signals.push(false);
          }
          break;
        case "buttons":
          level.buttons.push(new button(pos.x, pos.y, editId));
          console.log("res.buttons.push(new button(" + pos.x + ", " + pos.y + ", " + editId + "));");
          break;
        case "npcs":
          level.npcs.push(new npc(pos.x, pos.y, editId));
          console.log("res.npcs.push(new npc(" + pos.x + ", " + pos.y + ", " + editId + "));");
          break;
        case "deaths":
          level.deaths.push(new death(pos.x, pos.y, 0.1, 0.1, selectedTexture, editRepeating, editRepeatSize));
          building = true;
          break;
        case "foregrounds":
          level.foregrounds.push(new foreground(pos.x, pos.y, 0.1, 0.1, selectedTexture, editRepeating, editRepeatSize));
          building = true;
          break;
        case "pickups":
          level.pickups.push(new pickup(pos.x, pos.y, selectedTexture, () => {}));
          console.log("res.pickups.push(new pickup(" + pos.x + ", " + pos.y + ", " + selectedTexture + ", () => {}));");
          break;
        case "chests":
          level.chests.push(new chest(pos.x, pos.y, new pickup(0, 0, selectedTexture, () => {})));
          console.log("res.chests.push(new chest(" + pos.x + ", " + pos.y + ", new pickup(0, 0, " + selectedTexture + ", () => {}));");
          break;
        }
        return;
      } else {
        var o;
        var j_ = 0;
        for(var i = 0; i < objectNames.length; i++) {
          var objects = eval("level." + objectNames[i]);
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
      var o_ = eval("level." + objectNames[selectedType] + "[level." + objectNames[selectedType] + ".length - 1]");
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
      repSize = Math.round(editRepeatSize * 10000) / 10000;
      switch(o_.constructor.name) {
      case "wall":
        console.log("res.walls.push(new wall(" + 
                    o.pos.x + ", " + 
                    o.pos.y + ", " + 
                    o.size.x + ", " + 
                    o.size.y + ", " +
                    o.texture + ", " + 
                    editRepeating + ", " + 
                    repSize + "));");
        break;
        
      case "background":
        console.log("res.backgrounds.push(new background(" + 
                    o.pos.x + ", " + 
                    o.pos.y + ", " + 
                    o.size.x + ", " + 
                    o.size.y + ", " +
                    o.texture + ", " + 
                    editRepeating + ", " + 
                    repSize + "));");
        break;
        
      case "door":
        console.log("res.doors.push(new door(" + 
                    o.pos.x + ", " + 
                    o.pos.y + ", " + 
                    o.size.x + ", " + 
                    o.size.y + ", " + 
                    editId + "));");
        break;
        
      case "death":
        console.log("res.deaths.push(new death(" + 
                    o.pos.x + ", " + 
                    o.pos.y + ", " + 
                    o.size.x + ", " + 
                    o.size.y + ", " + 
                    o.texture + ", " + 
                    editRepeating + ", " + 
                    repSize + "));");
        break;
        
      case "foreground":
        console.log("res.foregrounds.push(new foreground(" + 
                    o.pos.x + ", " + 
                    o.pos.y + ", " + 
                    o.size.x + ", " + 
                    o.size.y + ", " + 
                    o.texture + ", " + 
                    editRepeating + ", " + 
                    repSize + "));");
        break;
      }
      return;
    }
  }
  }
}

window.onmousemove = function(e) {
mousePos.x = e.clientX;
mousePos.y = e.clientY;
if(mousePressed) {
  setSliderFromMousePos(selectedSlider, e.clientX);
}
if(!paused) {
  if(cheatMode && building) {
    var pos = {x: Math.round((mousePos.x + cameraOffset.x) / (editSnap * c.height)) * (editSnap * c.height), y: Math.round((mousePos.y + cameraOffset.y) / (editSnap * c.height)) * (editSnap * c.height)};
    var o = eval("level." + objectNames[selectedType] + "[level." + objectNames[selectedType] + ".length - 1]");;
    o.size.x = pos.x - o.pos.x;
    o.size.y = pos.y - o.pos.y;
  }
}
}

window.onkeydown = function(e) {
activateAudio();
if(changeControl != -1) {
  controls[changeControl].code = e.keyCode;
  controls[changeControl].name = e.key;
  changeControl = -1;
} else {
if(!paused && !consoleOpen) {
if(player.hp > 0) {
  if(e.keyCode == 37 && cheatMode && editMode) {
    if(cheatMode && editMode) {
      if(selectedTexture > 0) {
        selectedTexture--;
        var run = true;
        var len = 0;
        while(run) {
          run = false;
          for(var i = 0; i < hiddenTextures.length; i++) {
            if(selectedTexture + len == hiddenTextures[i]) {
              run = true;
              len--;
            }
          }
          if(selectedTexture + len >= textures.length || selectedTexture + len <= hiddenTextures[0]) {
            len = 0;
            selectedTexture++;
            break;
          }
        }
        selectedTexture += len;
      }
    }
  } else if(e.keyCode == 39 && cheatMode && editMode) {
    if(cheatMode && editMode) {
      if(selectedTexture < textures.length - 1) {
        selectedTexture++;
        var run = true;
        var len = 0;
        while(run) {
          run = false;
          for(var i = 0; i < hiddenTextures.length; i++) {
            if(selectedTexture + len == hiddenTextures[i]) {
              run = true;
              len++;
            }
          }
          if(selectedTexture + len >= textures.length) {
            len = 0;
            selectedTexture--;
            break;
          }
        }
        selectedTexture += len;
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
    case controls[1].code:
      player.acc.x = player.speed;
      break;

    case 37: // Left
    case controls[0].code:
      player.acc.x = -player.speed;
      break;

    case 38: // Up
    case controls[2].code:
      player.jumping = true;
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
      if(cheatable) {
        cheatMode = !cheatMode;
        player.vel.x = 0;
        player.vel.y = 0;
        player.acc.x = 0;
        player.acc.y = 0;
      }
      break;

    case controls[3].code:
      player.interacting = true;
      break;

    case controls[5].code:
      if(cheatMode) {
        editMode = !editMode;
      }
      player.e = true;
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
      
    case controls[4].code:
      player.shooting = true;
      break;
    }
  }
}
}
if(e.keyCode == controls[6].code) {
  if(menu != 0 && menu != 2 && menu != 3 && menu != 4 && menu != 5 && menu != 6 && menu != 7 && menu != 8 && menu != 9 && menu != 10 && menu != 11 && menu != 12) {
    if(!consoleOpen) {
      paused = !paused;
      menu = 1;
    }
    consoleOpen = false;
  }
}
}
if(consoleOpen && e.location == 0) {
  if(e.keyCode == 32) {
    currentConsoleText = currentConsoleText.slice(0, consoleCursorPos) + " " + currentConsoleText.slice(consoleCursorPos);
    consoleCursorPos++;
  } else if(e.keyCode == 8) {
    if(consoleCursorPos > 0) {
      currentConsoleText = currentConsoleText.slice(0, consoleCursorPos - 1) + currentConsoleText.slice(consoleCursorPos);
      consoleCursorPos--;
    }
  } else if(e.keyCode == 46) {
    currentConsoleText = currentConsoleText.slice(0, consoleCursorPos) + currentConsoleText.slice(consoleCursorPos + 1);
  } else if(e.keyCode == 37) {
    consoleCursorPos = Math.max(consoleCursorPos - 1, 0);
  } else if(e.keyCode == 39) {
    consoleCursorPos = Math.min(consoleCursorPos + 1, currentConsoleText.length);
  } else if(e.keyCode == 13) {
    consoleCursorPos = 0;
    try {
      function set(variable, value) {return eval("window." + variable + " = " + value)}
      function clear() {consoleStack = [];}
      consoleStack.unshift(eval(currentConsoleText));
    } catch {}
    currentConsoleText = "";
  } else {
    currentConsoleText = currentConsoleText.slice(0, consoleCursorPos) + e.key + currentConsoleText.slice(consoleCursorPos);
    consoleCursorPos++;
  }
}
if(e.keyCode == 67 && cheatMode && e.keyCode != controls[6].code && !paused) {
  consoleOpen = true;
}
}

window.onkeyup = function(e) {
  switch(e.keyCode) {
  case 39: // Right
  case controls[1].code:
    if(player.acc.x > 0) {
      player.acc.x = 0;
    }
    if(cheatMode) {
      player.vel.x = 0;
    }
    break;
    
  case 37: // Left
  case controls[0].code:
    if(player.acc.x < 0) {
      player.acc.x = 0;
    }
    if(cheatMode) {
      player.vel.x = 0;
    }
    break;
    
  case 38: // Up
  case controls[2].code:
    if(cheatMode) {
      player.acc.y = 0;
      player.vel.y = 0;
    }
    player.jumping = false;
    break;
    
  case 83:
  case 40:
    if(cheatMode) {
      player.acc.y = 0
      player.vel.y = 0;
    }
    break;
    
  case controls[3].code:
    player.interacting = false;
    break;
    
  case controls[4].code:
      player.shooting = false;
      break;
      
  case controls[5].code:
      player.e = false;
      break;
  }
}