var c = document.createElement("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
var ctx = c.getContext("2d");

var editItemDiv = document.getElementById("editItemDiv");
document.getElementById("delete").onclick = function() {
  days[editScheduleItem.day].splice(editScheduleItem.item);
  editScheduleItem = null;
  sortSchedule();
}
document.getElementById("ok").onclick = function() {
  editScheduleItem = null;
  sortSchedule();
}

var days = [];
const monthNames = {
  sv: ["Januari", "Februari", "Mars", "April", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
  en: ["January", "February", "March", "April", "June", "July", "August", "September", "October", "November", "December"]
};
const dayNames = {
  sv: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"],
  en: ["Sundag", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
};
var time = document.getElementById("time");
var flipSpeed = 750;
var flipTimer = flipSpeed;
var prevMinute = new Date().getMinutes();
var clock = {time: Date.now(), prevTime: Date.now(), deltaTime: 0};
var mouse = {x: c.width, y: c.height, down: false, prevDown: false};

var tempInput = document.createElement("input");
document.body.appendChild(tempInput);
var heldNote = undefined;
var noteOffset = {x: 0, y: 0};
var notes = [];
var scheduleEditorOpen = false;
var editScheduleItem = null;
var settingsOpen = false;
var settings = [];
var prevSettings = [];

var loop = null;

var speed = 1;
var points = [];
for(var i = 0; i < 6; i++) {
  points.push({
    x: (Math.random() * 1.5 - 0.25) * Math.max(c.width * 0.2, c.width - 0.4 * c.height), 
    y: (Math.random() * 1.5 - 0.25) * c.height, 
    xVel: (Math.random() - 0.5) * speed,
    yVel: (Math.random() - 0.5) * speed
  });
}

var grad;
resetGradients();

load();

update();
function update() {
  clock.prevTime = clock.time;
  clock.time = Date.now();
  clock.deltaTime = clock.time - clock.prevTime;
  
  ctx.fillStyle = "rgb(40, 40, 45)";
  ctx.fillRect(0, 0, c.width, c.height);
  
  if(!settings[0])
  renderBackground();
  renderShadow();
  updateNotes();
  renderClock();
  renderLessonNotification();
  renderBattery();
  renderDate();
  updateScheduleEditor();
  updateSettings();
  updateModeButtons();
  
  mouse.prevDown = mouse.down;
  
  if(!settings[0]) {
    if(loop != null) {
      clearInterval(loop);
      loop = null;
    }
    
    requestAnimationFrame(update);
  } else if(loop == null) {
    loop = setInterval(update, 30000);
  }
}

function load() {
  notes = [];
  var formatted = JSON.parse(localStorage.getItem("notes"));
  if(formatted == null) {
    formatted = [{
      x: 0.25,
      y: 0.25,
      w: 0.5,
      h: 0.35,
      t: "GUIDE\u{2424}\u{2424}Tryck på plustecknet i hörnet uppe till vänster för att lägga till en ny anteckning.\u{2424}\u{2424}Du kan lägga till saker i ditt schema på penn-ikonen till höger.\u{2424}\u{2424}Du kan ändra inställningarna på kugghjuls-ikonen till höger.",
      m: false
    }];
  }
  for(var i = 0; i < formatted.length; i++) {
    notes.push(new note(formatted[i].x, formatted[i].y, formatted[i].w, formatted[i].h));
    notes[notes.length - 1].text = formatted[i].t;
    notes[notes.length - 1].minimized = formatted[i].m;
  }
  
  formatted = JSON.parse(localStorage.getItem("schedule"));
  if(formatted == null || formatted.length < 5) {
    formatted = [[], [], [], [], []];
  }
  days = [];
  for(var i = 0; i < formatted.length; i++) {
    days[i] = [];
    for(var j = 0; j < formatted[i].length; j++) {
      days[i][j] = {subject: formatted[i][j].s, start: formatted[i][j].b, end: formatted[i][j].e, location: formatted[i][j].l};
    }
  }
  
  settings = JSON.parse(localStorage.getItem("settings"));
  if(settings == null) {
    settings = [false, false, true, true];
  }
  prevSettings = JSON.parse(JSON.stringify(settings));
}

function save() {
  var formatted = [];
  for(var i = 0; i < notes.length; i++) {
    formatted.push({x: notes[i].x, y: notes[i].y, w: notes[i].width, h: notes[i].height, t: notes[i].text, m: notes[i].minimized});
  }
  localStorage.setItem("notes", JSON.stringify(formatted));
  
  formatted = [];
  for(var i = 0; i < days.length; i++) {
    formatted.push([]);
    for(var j = 0; j < days[i].length; j++) {
      formatted[i].push({s: days[i][j].subject, b: days[i][j].start, e: days[i][j].end, l: days[i][j].location});
    }
  }
  localStorage.setItem("schedule", JSON.stringify(formatted));
  
  localStorage.setItem("settings", JSON.stringify(settings));
}

function updateSettings() {
  if(settingsOpen) {
    var w = Math.max(c.width * 0.2, c.width - 0.4 * c.height);
    
    ctx.fillStyle = "rgb(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, w, c.height);
    
    ctx.beginPath();
    ctx.rect(0.125 * w, 0.125 * c.height, w * 0.75, c.height * 0.75);
    ctx.fillStyle = "rgb(200, 200, 205)";
    ctx.fill();
    ctx.rect(0.125 * w + c.height * 0.01, 0.135 * c.height, w * 0.75 - c.height * 0.02, c.height * 0.73);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(150, 150, 155)";
    ctx.stroke();
    
    var s = [
      settings[1] ? "Reduced CPU usage" : "Minskad CPU-användning", 
      "English", 
      "Svenska", 
      settings[1] ? "Send notifications" : "Skicka notifikationer"
    ];
    
    for(var i = 0; i < s.length; i++) {
      ctx.font = 0.035 * c.height + "px Arial";
      ctx.fillStyle = "rgb(50, 50, 55)";
      ctx.textAlign = "left";
      ctx.fillText(s[i], 0.15 * w + 0.05 * c.height, (0.19 + 0.05 * i) * c.height);
      
      ctx.beginPath();
      ctx.rect(0.15 * w, (0.16 + 0.05 * i) * c.height, 0.03 * c.height, 0.03 * c.height);
      ctx.fillStyle = "rgb(175, 175, 180)";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgb(100, 100, 105)";
      ctx.stroke();
      
      if(mouse.x > 0.15 * w && mouse.y > (0.16 + 0.05 * i) * c.height && 
         mouse.x < 0.03 * c.height + 0.15 * w && mouse.y < (0.19 + 0.05 * i) * c.height) {
        if(mouse.down && !mouse.prevDown) {
          settings[i] = !settings[i];
        }
      }
      
      if(settings[i]) {
        ctx.font = 0.04 * c.height + "px Arial";
        ctx.fillStyle = "rgb(50, 50, 55)";
        ctx.textAlign = "center";
        ctx.fillText("\u{2A2F}", 0.159 * w, (0.19 + 0.05 * i) * c.height);
      }
    }
  }
  
  if(settings[1] && !prevSettings[1]) {
    settings[2] = false;
  }
  if(settings[2] && !prevSettings[2]) {
    settings[1] = false;
  }
  if(!settings[1] && prevSettings[1]) {
    settings[2] = true;
  }
  if(!settings[2] && prevSettings[2]) {
    settings[1] = true;
  }
  
  prevSettings = JSON.parse(JSON.stringify(settings));
}

function updateModeButtons() {
  var w = Math.max(c.width * 0.2, c.width - 0.4 * c.height);
  for(var i = 0; i < 2; i++) {
    var x = w + c.height * 0.1 + 0.125 * c.height * i;
    var y = c.height * 0.5;
    var width = c.height * 0.075;
    var height = c.height * 0.075;
    if(mouse.x >= x && mouse.x <= x + width && mouse.y >= y && mouse.y <= y + height) {
      x -= 0.005 * c.height;
      y -= 0.005 * c.height;
      width += 0.01 * c.height;
      height += 0.01 * c.height;
      
      if(mouse.down && !mouse.prevDown) {
        switch(i) {
        case 0: 
          scheduleEditorOpen = !scheduleEditorOpen;
          settingsOpen = false;
          if(!scheduleEditorOpen) {
            save();
          }
          break;
        case 1: 
          settingsOpen = !settingsOpen;
          scheduleEditorOpen = false;
          if(!settingsOpen) {
            save();
          }
          break;
        }
      }
    }
    ctx.fillStyle = "rgb(130, 130, 140)";
    ctx.fillRect(x, y, width, height);
    
    ctx.fillStyle = "rgb(220, 220, 225)";
    ctx.textAlign = "center";
    switch(i) {
    case 0:
      var s = "";
      if(scheduleEditorOpen) {
        ctx.font = "bold " + c.height * 0.001 * width + "px Arial";
        s = "\u{1F5CA}";
      } else {
        ctx.font = c.height * 0.001 * width + "px Arial";
        s = "\u{1F589}";
      }
      ctx.fillText(s, x + width * 0.5, y + height * 0.7);
      break;
    case 1:
      ctx.font = "bold " + c.height * 0.001 * width + "px Arial";
      ctx.fillText("\u{26ED}", x + width * 0.5, y + height * 0.75);
      break;
    }
  }
}

function updateScheduleEditor() {
  if(scheduleEditorOpen) {
    var w = Math.max(c.width * 0.2, c.width - 0.4 * c.height);
    ctx.fillStyle = "rgb(200, 200, 205)";
    ctx.beginPath();
    ctx.rect(0.025 * c.height, c.height * 0.025, w - 0.05 * c.height, c.height * 0.95);
    ctx.fill();
    ctx.rect(0.0325 * c.height, c.height * 0.0325, w - 0.065 * c.height, c.height * 0.935);
    ctx.closePath();
    ctx.strokeStyle = "rgb(150, 150, 155)";
    for(var i = 0; i < days.length; i++) {
      var x = 0.0325 * c.height + (w - 0.065 * c.height) / 5 * i;
      if(i > 0) {
        ctx.moveTo(x, c.height * 0.0325);
        ctx.lineTo(x, c.height * (0.0325 + 0.935));
      }
      for(var j = 0; j < Math.min(days[i].length + 1, 8); j++) {
        var x_ = x + (w - 0.065 * c.height) / 10 - w * 0.075;
        var y_ = c.height * (0.06 + 0.11 * j);
        ctx.fillStyle = "rgb(120, 120, 125)";
        ctx.fillRect(
          x_, 
          y_, 
          w * 0.15, 
          c.height * 0.1
        );
        
        var buttonHovered = -1;
        if(editScheduleItem == null) {
          for(var k = 0; k < 1; k++) {
            if(mouse.x > x_ + w * 0.13 && mouse.x < x_ + w * 0.15 && mouse.y > y_ + c.height * 0.05 * k && mouse.y < y_ + c.height * (0.05 + 0.05 * k)) {
              buttonHovered = k;
            }
          }
        }
        
        ctx.fillStyle = "rgb(240, 240, 245)";
        if(j < days[i].length) {
          ctx.textAlign = "left";
          ctx.font = "bold " + c.height * 0.03 + "px Arial";
          ctx.fillText(days[i][j].subject, x_ + w * 0.005, y_ + c.height * 0.03);
          ctx.font = c.height * 0.025 + "px Arial";
          ctx.fillText(days[i][j].start + " - " + days[i][j].end, x_ + w * 0.005, y_ + c.height * 0.06);
          ctx.fillText(days[i][j].location, x_ + w * 0.005, y_ + c.height * 0.09);
          ctx.textAlign = "center";
          if(buttonHovered == 0) {
            ctx.font = c.height * 0.05 + "px Arial";
            if(mouse.down && !mouse.prevDown) {
              editScheduleItem = {day: i, item: j};
              document.getElementById("subject").value = days[i][j].subject;
              document.getElementById("location").value = days[i][j].location;
              document.getElementById("start").value = days[i][j].start;
              document.getElementById("end").value = days[i][j].end;
            }
          } else {
            ctx.font = c.height * 0.04 + "px Arial";
          }
          ctx.fillText("\u{22EE}", x_ + w * 0.14, y_ + c.height * 0.0375);
          /*if(buttonHovered == 1) {
            ctx.font = c.height * 0.05 + "px Arial";
          } else {
            ctx.font = c.height * 0.04 + "px Arial";
          }
          ctx.fillText("\u{2B0D}", x_ + w * 0.14, y_ + c.height * 0.09);*/
        } else {
          ctx.textAlign = "center";
          if(mouse.x > x_ && mouse.x < x_ + w * 0.15 && mouse.y > y_ && mouse.y < y_ + 0.1 * c.height && 
             editScheduleItem == null) {
            ctx.font = c.height * 0.1125 + "px Arial";
            if(mouse.down && !mouse.prevDown) {
              days[i].push({subject: "", location: "", start: "", end: ""});
              editScheduleItem = {day: i, item: days[i].length - 1};
            }
          } else {
            ctx.font = c.height * 0.1 + "px Arial";
          }
          ctx.fillText("+", x_ + w * 0.075, y_ + c.height * 0.08);
        }
      }
    }
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Edit item
    if(editScheduleItem != null) {
      var item = days[editScheduleItem.day][editScheduleItem.item];
      
      item.subject = document.getElementById("subject").value;
      item.location = document.getElementById("location").value;
      item.start = document.getElementById("start").value;
      item.end = document.getElementById("end").value;
      
      ctx.fillStyle = "rgb(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, w, c.height);
      
      ctx.beginPath();
      ctx.rect(w * 0.25, 0.25 * c.height, 0.5 * w, 0.5 * c.height);
      ctx.fillStyle = "rgb(200, 200, 205)";
      ctx.fill();
      ctx.rect(w * 0.25 + 0.0075 * c.height, 0.25 * c.height + 0.0075 * c.height, 0.5 * w - 0.015 * c.height, 0.5 * c.height - 0.015 * c.height);
      ctx.strokeStyle = "rgb(150, 150, 155)";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      var closeHovered = false;
      if(mouse.x > 0.75 * w - 0.05 * c.height && mouse.x < 0.75 * w && mouse.y > 0.25 * c.height && mouse.y < 0.3 * c.height) {
        closeHovered = true;
        if(mouse.down && !mouse.prevDown) {
          editScheduleItem = null;
          sortSchedule();
          return;
        }
      }
      
      ctx.font = 0.05 * c.height + "px Arial";
      if(closeHovered) {
        ctx.font = 0.06 * c.height + "px Arial";
      }
      ctx.textAlign = "center";
      ctx.fillStyle = "rgb(100, 100, 105)";
      ctx.fillText("\u{2A2F}", 0.73 * w, 0.3 * c.height);
      
      editItemDiv.style.display = "block";
      editItemDiv.style.marginLeft = 0.25 * w + "px";
      editItemDiv.style.width = 0.5 * w + "px";
      editItemDiv.style.marginTop = 0.25 * c.height + "px";
      editItemDiv.style.height = c.height * 0.5 + "px";
    }
  } else {
    editScheduleItem = null;
    editItemDiv.style.display = "none";
    sortSchedule();
  }
}

function sortSchedule() {
  for(var i = 0; i < days.length; i++) {
    days[i].sort((a, b) => {
      var aTime = parseInt(a.start.substr(0, 2)) * 60 + parseInt(a.start.substr(3, 2));
      var bTime = parseInt(b.start.substr(0, 2)) * 60 + parseInt(b.start.substr(3, 2));
      if(isFinite(aTime - bTime)) {
        return aTime - bTime;
      } else {
        return isFinite(aTime) ? -1 : 1;
      }
    });
  }
  editItemDiv.style.display = "none";
  document.getElementById("subject").value = "";
  document.getElementById("location").value = "";
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
}

function renderBackground() {
  var w = Math.max(c.width * 0.2, c.width - 0.4 * c.height);
  for(var i = 0; i < points.length; i++) {
    points[i].x += points[i].xVel;
    points[i].y += points[i].yVel;
    if(points[i].x > w * 1.25 || points[i].x < -0.25 * w) {
      points[i].xVel *= -1;
    }
    if(points[i].y > c.height * 1.25 || points[i].y < -0.25 * c.height) {
      points[i].yVel *= -1;
    }
  }
  for(var i = 0; i < points.length; i++) {
    ctx.beginPath();
    for(var j = 0; j < points.length; j++) {
      if(i != j) {
        ctx.moveTo(points[j].x, points[j].y);
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
    ctx.strokeStyle = "rgb(33, 33, 38)";
    ctx.lineWidth = 4;
    ctx.stroke();
  }
}

function renderDate() {
  var date = new Date();
  var str = dayNames[settings[1] ? "en" : "sv"][date.getDay()] + " " + date.getDate() + " " + monthNames[settings[1] ? "en" : "sv"][date.getMonth() - 1];
  ctx.fillStyle = "rgb(240, 240, 240)";
  ctx.font = 0.03 * c.height + "px Arial";
  ctx.textAlign = "center";
  ctx.fillText(str, Math.max(c.width * 0.2, c.width - c.height * 0.2), c.height * 0.2);
  var s = new Date(date.getFullYear(), 0);
  var week = Math.ceil((date - s + 1000 * 60 * 60 * 24 * 2) / (24 * 60 * 60 * 1000 * 7));
  ctx.fillText((settings[1] ? "Week " :"Vecka ") + week, Math.max(c.width * 0.2, c.width - c.height * 0.2), c.height * 0.25);
}

function updateNotes() {
  if(!scheduleEditorOpen && !settingsOpen) {
    var w = Math.max(c.width * 0.2, c.width - 0.4 * c.height);
    var h = c.height;
    var aspect = w / h;
    notes.sort((a, b) => {
      return a.z - b.z;
    });
    var hovering = undefined;
    var resetCursor = true;
    for(var i = 0; i < notes.length; i++) {
      if(mouse.x > (notes[i].x * aspect - notes[i].width * 0.5) * h && 
         mouse.y > (notes[i].y - 0.02) * h && 
         mouse.x < (notes[i].x * aspect + notes[i].width * 0.5) * h && 
         mouse.y < (notes[i].y + 0.02 + (0.005 + notes[i].height) * !notes[i].minimized) * h
      ) {
        hovering = i;
      }
      if(notes[i].resizing.grabbed) {
        resetCursor = false;
      }
      if(mouse.down && !mouse.prevDown) {
        notes[i].writing = false;
      }
    }
    if(resetCursor) {
      document.body.style.cursor = "default";
    }

    var fontSize = 0.075 * c.height;
    if(mouse.x < fontSize && 
       mouse.y < fontSize && 
       hovering == undefined
    ) {
      if(mouse.down && !mouse.prevDown) {
        createNote();
      }
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.textAlign = "center";
      ctx.font = fontSize * 1.2 + "px Arial";
      ctx.fillText("+", fontSize * 0.5, fontSize * 0.85);
    } else {
      ctx.fillStyle = "rgb(175, 175, 175)";
      ctx.textAlign = "center";
      ctx.font = fontSize + "px Arial";
      ctx.fillText("+", fontSize * 0.5, fontSize * 0.8);
    }

    var minimizeHover = undefined;
    var otherHover = undefined;
    var select = undefined;
    var grab = undefined;
    for(var i = 0; i < notes.length; i++) {
      if(i == hovering) {
        if(mouse.down && !mouse.prevDown) {
          select = i;
        }
        var s = 0.015;
        var right = mouse.x > (notes[i].x * aspect + notes[i].width * 0.5 - s) * h;
        var left = mouse.x < (notes[i].x * aspect - notes[i].width * 0.5 + s) * h;
        var down = mouse.y > (notes[i].y + 0.02 - s + (0.005 + notes[i].height) * !notes[i].minimized) * h;
        if(mouse.y > (notes[i].y + 0.02) * h && !notes[i].resizing.grabbed && resetCursor) {
          if(mouse.down && !mouse.prevDown) {
            notes[i].resizing.grabbed = true;
          }
          if(right) {
            notes[i].resizing.x = 1;
            if(down) {
              notes[i].resizing.y = 1;
              document.body.style.cursor = "nw-resize";
            } else {
              notes[i].resizing.y = 0;
              document.body.style.cursor = "ew-resize";
            }
          } else if(left) {
            notes[i].resizing.x = -1;
            if(down) {
              notes[i].resizing.y = 1;
              document.body.style.cursor = "ne-resize";
            } else {
              notes[i].resizing.y = 0;
              document.body.style.cursor = "ew-resize";
            }
          } else if(down) {
            notes[i].resizing.x = 0;
            notes[i].resizing.y = 1;
            document.body.style.cursor = "ns-resize";
          } else {
            notes[i].resizing.x = 0;
            notes[i].resizing.y = 0;
            notes[i].resizing.grabbed = false;
            document.body.style.cursor = "text";
            if(mouse.down && !mouse.prevDown) {
              notes[i].writing = true;
              tempInput.value = notes[i].text;
              tempInput.focus();
            }
          }
          notes[i].resizing.origX = notes[i].x;
          notes[i].resizing.origY = notes[i].y;
          notes[i].resizing.origWidth = notes[i].width;
          notes[i].resizing.origHeight = notes[i].height;
        }

        if(mouse.x > (notes[i].x * aspect - notes[i].width * 0.5) * h && 
           mouse.y > (notes[i].y - 0.02) * h && 
           mouse.x < (notes[i].x * aspect + notes[i].width * 0.5) * h && 
           mouse.y < (notes[i].y + 0.02) * h
        ) {
          if(mouse.x > (notes[i].x * aspect + notes[i].width * 0.5 - 0.04) * h) {
            minimizeHover = i;
            if(mouse.down && !mouse.prevDown) {
              // Minimize
              notes[i].minimized = !notes[i].minimized;
            }
          } else if(mouse.x < (notes[i].x * aspect - notes[i].width * 0.5 + 0.03) * h) {
            otherHover = i;
            if(mouse.down && !mouse.prevDown) {
              // Close
              select = undefined;
              grab = undefined;
              minimizeHover = undefined;
              otherHover = undefined;
              hovering = undefined;
              notes.splice(i, 1);
              i--;
              continue;
            }
          } else {
            if(mouse.down && !mouse.prevDown) {
              grab = i;
            }
          }
        }
      }

      notes[i].x = Math.max(0, Math.min(1, notes[i].x));
      notes[i].y = Math.max(0, Math.min(1, notes[i].y));

      if(!mouse.down) {
        notes[i].resizing.grabbed = false;
      }
      if(notes[i].resizing.grabbed) {
        if(notes[i].resizing.x == -1) {
          var s = notes[i].resizing.origX + notes[i].resizing.origWidth / 2 / aspect;
          var mX = Math.min(mouse.x / w, s - 0.1);
          notes[i].x = (mX + s) / 2;
          notes[i].width = (s - mX) * aspect;
        } else if(notes[i].resizing.x == 1) {
          var s = notes[i].resizing.origX - notes[i].resizing.origWidth / 2 / aspect;
          var mX = Math.max(mouse.x / w, s + 0.1);
          notes[i].x = (mX + s) / 2;
          notes[i].width = -(s - mX) * aspect;
        }
        if(notes[i].resizing.y == 1) {
          var mY = Math.max(mouse.y / h, notes[i].resizing.origY + 0.1);
          notes[i].height = mY - notes[i].resizing.origY - 0.02;
        }
      }

      if(notes[i].writing) {
        notes[i].text = tempInput.value;
      }
      var fontSize = 0.025 * c.height;
      ctx.font = fontSize + "px Arial";
      var lines = multiLineString(notes[i].text, (notes[i].width - 0.04) * h);
      if(notes[i].y + 0.03 * (lines.length - 1) + 0.05 > notes[i].y + notes[i].height) {
        notes[i].height = 0.03 * (lines.length - 1) + 0.05;
      }

      ctx.fillStyle = "rgb(100, 100, 105)";
      ctx.fillRect((notes[i].x * aspect - notes[i].width * 0.5) * h, (notes[i].y - 0.02) * h, notes[i].width * h, 0.04 * h);

      ctx.textAlign = "center";
      if(minimizeHover == i) {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.font = 0.05 * c.height + "px Arial";
      } else {
        ctx.fillStyle = "rgb(240, 240, 240)";
        ctx.font = 0.04 * c.height + "px Arial";
      }
      ctx.fillText(notes[i].minimized ? "+" : "\u{2212}", (notes[i].x * aspect + notes[i].width * 0.5 - 0.0175) * h, (notes[i].y + 0.015) * h);
      ctx.fillStyle = "rgb(240, 240, 240)";
      if(otherHover == i) {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.font = 0.05 * c.height + "px Arial";
      } else {
        ctx.fillStyle = "rgb(240, 240, 240)";
        ctx.font = 0.04 * c.height + "px Arial";
      }
      ctx.fillText("\u{2A2F}", (notes[i].x * aspect - notes[i].width * 0.5 + 0.015) * h, (notes[i].y + 0.0125) * h);
      ctx.fillStyle = "rgb(240, 240, 240)";
      ctx.font = 0.02 * c.height + "px Arial";
      ctx.fillText(lines[0], (notes[i].x * aspect) * h, (notes[i].y + 0.01) * h);

      if(!notes[i].minimized) {
        ctx.beginPath();
        ctx.rect((notes[i].x * aspect - notes[i].width * 0.5 + 0.005) * h, (notes[i].y + 0.02) * h, (notes[i].width - 0.01) * h, notes[i].height * h);
        ctx.fillStyle = "rgb(200, 200, 205)";
        ctx.fill();
        ctx.rect((notes[i].x * aspect - notes[i].width * 0.5 + 0.01) * h, (notes[i].y + 0.025) * h, (notes[i].width - 0.02) * h, (notes[i].height - 0.01) * h);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(150, 150, 155)";
        ctx.stroke();

        ctx.fillStyle = "rgb(50, 50, 50)";
        ctx.font = fontSize + "px Arial";
        ctx.textAlign = "left";
        var chars = 0;
        for(var j = 0; j < lines.length; j++) {
          var caretPos = undefined;
          var selectionStart = undefined;
          var selectionEnd = undefined;
          var line = "";
          for(var k = 0; k < lines[j].length + 1; k++) {
            if(tempInput.selectionStart == tempInput.selectionEnd && tempInput.selectionStart == chars && (k < lines[j].length || j == lines.length - 1)) {
              caretPos = ctx.measureText(line).width;
            }
            if(tempInput.selectionStart != tempInput.selectionEnd) {
              if(tempInput.selectionStart == chars) {
                selectionStart = ctx.measureText(line).width;
              }
              if(tempInput.selectionEnd == chars) {
                selectionEnd = ctx.measureText(line).width;
              }
            }
            if(k < lines[j].length) {
              line += lines[j][k];
            } else if(selectionStart != undefined && selectionEnd == undefined) {
              selectionEnd = ctx.measureText(line).width;
            } else if(selectionStart == undefined && selectionEnd != undefined) {
              selectionStart = 0;
            } else if(chars > tempInput.selectionStart && chars < tempInput.selectionEnd) {
              selectionStart = 0;
              selectionEnd = ctx.measureText(line).width;
            } 
            chars++;
          }
          chars--;
          ctx.fillStyle = "rgb(50, 50, 50)";
          ctx.fillText(line, (notes[i].x * aspect - notes[i].width / 2 + 0.02) * h, (notes[i].y + 0.03 * j + 0.05) * h);
          if(notes[i].writing) {
            if(clock.time % 1000 < 750 && caretPos != undefined) {
              ctx.fillText("|", (notes[i].x * aspect - notes[i].width / 2 + 0.0175) * h + caretPos, (notes[i].y + 0.03 * j + 0.05) * h);
            }
            if(selectionStart != undefined && selectionEnd != undefined) {
              ctx.fillStyle = "rgb(90, 90, 130, 0.35)";
              ctx.fillRect((notes[i].x * aspect - notes[i].width / 2 + 0.0175) * h + selectionStart + fontSize * 0.1, (notes[i].y + 0.03 * j + 0.05) * h - fontSize * 0.75, selectionEnd - selectionStart, fontSize);
            }
          }
        }
      }
    }
    if(grab != undefined) {
      noteOffset.x = notes[grab].x - mouse.x / w;
      noteOffset.y = notes[grab].y - mouse.y / h;
      notes[grab].x = Math.max(0, Math.min(1, mouse.x / w));
      notes[grab].y = Math.max(0, Math.min(1, mouse.y / h));
      notes[grab].select();
      heldNote = notes.length - 1;
    }
    if(select != undefined && grab == undefined) {
      notes[select].select();
    }
    if(!mouse.down) {
      heldNote = undefined;
      noteOffset.x = 0;
      noteOffset.y = 0;
    } else if(heldNote != undefined) {
      notes[heldNote].x = Math.max(0, Math.min(1, mouse.x / w + noteOffset.x));
      notes[heldNote].y = Math.max(0, Math.min(1, mouse.y / h + noteOffset.y));
    }
  }
}

function multiLineString(str, w) {
  var strings = [];
  var substr = "";
  var lastAllowedString = "";
  var lastAllowedIndex = 0;
  for(var i = 0; i < str.length; i++) {
    if(str[i] != "\u{2424}") {
      substr += str[i];
    } else {
      substr += " ";
    }
    if(str[i] == " ") {
      lastAllowedString = substr;
      lastAllowedIndex = i;
    }
    if(ctx.measureText(substr).width > w || str[i] == "\u{2424}") {
      if(str[i] == "\u{2424}" || lastAllowedString == "") {
        strings.push(substr);
        lastAllowedString = "";
        substr = "";
      } else if(lastAllowedString != "") {
        strings.push(lastAllowedString);
        lastAllowedString = "";
        substr = "";
        i = lastAllowedIndex;
      }
    }
  }
  strings.push(substr);
  return strings;
}

function note(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.z = notes.length;
  this.width = width;
  this.height = height;
  this.resizing = {x: 0, y: 0, grabbed: false};
  this.text = "";
  this.minimized = false;
  this.dropdown = false;
  this.select = function() {
    this.z = notes.length;
    notes.sort((a, b) => {
      return a.z - b.z;
    });
    for(var i = 0; i < notes.length; i++) {
      notes[i].z = i;
    }
  }
}

function createNote() {
  var x = 0;
  var y = 0;
  var w = 0.3;
  var h = 0.25;
  for(var i = 0; i < 100; i++) {
    var x = Math.random() * 0.75 + 0.125;
    var y = Math.random() * 0.75;
    var occupied = false;
    for(var j = 0; j < notes.length; j++) {
      if(AABB(x, y, w, h, notes[j].x, notes[j].y, notes[j].width, notes[j].height)) {
        occupied = true
        break;
      }
    }
    if(!occupied) {
      break;
    }
  }
  notes.push(new note(x, y, w, h));
}

function AABB(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 + w1 > x2 && y1 + h1 > y2 && x1 < x2 + w2 && y1 < y2 + h2;
}

function renderBattery() {
  navigator.getBattery().then((res) => {
    ctx.fillStyle = "rgb(240, 240, 240)";
    var s = 0.0375 * c.height;
    ctx.font = s + "px Arial";
    ctx.textAlign = "center";
    var delay = (res.level <= 0.25) * (res.level * 3200 + 200);
    if(((settings[0] && delay != 0) || clock.time % delay < delay / 2) && !res.charging) {
      ctx.fillStyle = "rgb(240, 25, 25)";
    } else {
      ctx.fillStyle = "rgb(240, 240, 240)";
    }
    ctx.fillText((res.charging ? "\u{1F5F2} " : "") + Math.round(res.level * 100) + "%", Math.max(c.width * 0.2, c.width - c.height * 0.2), c.height * 0.33);
  });
}

function renderShadow() {
  var s = 0.1 * c.height;
  var x = Math.max(c.width * 0.2, c.width - s * 4);
  var w = c.height * 0.15;
  ctx.fillStyle = grad;
  ctx.fillRect(x - w, 0, w, c.height);
}

function renderClock() {
  var d = new Date();
  var s = 0.1 * c.height;
  ctx.fillStyle = "rgb(45, 45, 50)";
  var x = Math.max(c.width * 0.2, c.width - s * 4);
  ctx.fillRect(x, 0, c.width - x, c.height);
  
  var m = d.getMinutes();
  if(m != prevMinute && !settings[0]) {
    prevMinute = m;
    flipTimer = 0;
  }
  
  ctx.fillStyle = "rgb(240, 240, 240)";
  ctx.font = s + "px Arial";
  ctx.textAlign = "center";
  var x = Math.max(c.width * 0.6, c.width - s * 2);
  var y = c.height * 0.05;
  ctx.translate(x, y);
  if(flipTimer < flipSpeed) {
    flipTimer += clock.deltaTime;
    var delay = 1.5;
    var t = Math.min(flipSpeed, map(flipTimer, 0, flipSpeed, 0, flipSpeed * delay));
    ctx.scale(1, 1 - Math.sin(t / flipSpeed * Math.PI * 0.5));
    ctx.fillText((d.getHours() + "").padStart(2, "0") + ":" + (d.getMinutes() - 1 + "").padStart(2, "0"), 0, s);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(x, y + s);
    t = Math.max(0, map(flipTimer, flipSpeed - flipSpeed / delay, flipSpeed, 0, flipSpeed));
    ctx.scale(1, (Math.cos(t / flipSpeed * Math.PI + Math.PI) + 1) / 2);
    ctx.fillText((d.getHours() + "").padStart(2, "0") + ":" + (d.getMinutes() + "").padStart(2, "0"), 0, 0);
  } else {
    ctx.fillText((d.getHours() + "").padStart(2, "0") + ":" + (d.getMinutes() + "").padStart(2, "0"), 0, s); 
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function renderLessonNotification() {
  var s = 0.1 * c.height;
  var x = Math.max(c.width * 0.6, c.width - s * 2);
  var lesson = getLesson();
  var str = "";
  if(typeof lesson == "string") {
    str = lesson;
  } else {
    if(!lesson.active) {
      str = lesson.subject + " börjar om " + lesson.minutes + " minut" + (lesson.minutes > 1 ? "er" : "") + " vid " + lesson.location;
      if(settings[1])
      str = lesson.subject + " starts in " + lesson.minutes + " minute" + (lesson.minutes > 1 ? "s" : "") + " at " + lesson.location;
    } else {
      str = lesson.subject + " vid " + lesson.location + " slutar om " + lesson.minutes + " minut" + (lesson.minutes > 1 ? "er" : "");
      if(settings[1])
      str = lesson.subject + " at " + lesson.location + " ends in " + lesson.minutes + " minute" + (lesson.minutes > 1 ? "s" : "");
    }
  }
  ctx.font = c.height * 0.03 + "px Arial";
  var delay = (lesson.minutes <= 5) * lesson.minutes * 200;
  if(((settings[0] && delay != 0) || clock.time % delay < delay / 2) && !lesson.active) {
    ctx.fillStyle = "rgb(240, 25, 25)";
  } else {
    ctx.fillStyle = "rgb(240, 240, 240)";
  }
  var strings = multiLineString(str, c.height * 0.3);
  for(var i = 0; i < strings.length; i++) {
    ctx.fillText(strings[i], x, c.height * (0.4 + i * 0.04));
  }
}

function getLesson() {
  var res = {};
  var date = new Date();
  if(date.getDay() < 6 && date.getDay() > 0) {
    for(var i = 0; i < days[date.getDay() - 1].length; i++) {
      var startHour = parseInt(days[date.getDay() - 1][i].start.substr(0, 2));
      var startMinute = parseInt(days[date.getDay() - 1][i].start.substr(3, 2));
      var endHour = parseInt(days[date.getDay() - 1][i].end.substr(0, 2));
      var endMinute = parseInt(days[date.getDay() - 1][i].end.substr(3, 2));

      if(date.getHours() < endHour || 
      (date.getHours() == endHour && date.getMinutes() < endMinute)) {
        res.subject = days[date.getDay() - 1][i].subject;
        res.active = 1;
        res.minutes = ((endHour * 60 + endMinute) - (date.getHours() * 60 + date.getMinutes()));
        res.location = days[date.getDay() - 1][i].location;
        if(date.getHours() < startHour || 
        (date.getHours() == startHour && date.getMinutes() < startMinute)) {
          res.subject = days[date.getDay() - 1][i].subject;
          res.active = 0;
          res.minutes = ((startHour * 60 + startMinute) - (date.getHours() * 60 + date.getMinutes()));
          res.location = days[date.getDay() - 1][i].location;
        }
        break;
      }
    }
  }
  if(!res.subject) {
    var day;
    if(date.getDay() >= 5 || date.getDay() == 0) {
      if(days[0].length > 0) {
        day = days[0][0];
      } else {
        return settings[1] ? "Add items to your schedule on the button below" : "Lägg till saker i ditt schema på knappen under";
      }
    } else {
      if(days[date.getDay()].length > 0) {
        day = days[date.getDay()][0];
      } else {
        return settings[1] ? "Add items to your schedule on the button below" : "Lägg till saker i ditt schema på knappen under";
      }
    }
    var startHour = parseInt(day.start.substr(0, 2));
		var startMinute = parseInt(day.start.substr(3, 2));
    res.subject = day.subject;
    res.active = 0;
    var temp = 0;
    if(date.getHours() < startHour || (date.getHours() == startHour && date.getMinutes() <= startMinute)) {
      temp = (startHour - date.getHours()) * 60 + startMinute - date.getMinutes();
    } else {
      temp = (startHour + 24 - date.getHours()) * 60 + startMinute - date.getMinutes();
    }
    if(date.getDay() >= 5) {
      res.minutes = (7 - date.getDay()) * 1440 + temp;
    } else {
      res.minutes = temp;
    }
    res.location = day.location;
  }
  return res;
}

function resetGradients() {
  var s = 0.1 * c.height;
  var x = Math.max(c.width * 0.2, c.width - s * 4);
  var w = c.height * 0.15;
  grad = ctx.createLinearGradient(x - w, 0, x, 0);
  grad.addColorStop(0, "rgb(30, 30, 35, 0)");
  grad.addColorStop(1, "rgb(30, 30, 35)");
}

function map(value, minA, maxA, minB, maxB) {
  return minB + (value - minA) / (maxA - minA) * (maxB - minB);
}

window.onkeydown = function(e) {
  if(e.keyCode == 13) {
    var start = tempInput.selectionStart;
    var end = tempInput.selectionEnd;
    tempInput.value = tempInput.value.substr(0, start) + "\u{2424}" + tempInput.value.substr(end);
    tempInput.selectionStart = start + 1;
    tempInput.selectionEnd = end + 1;
  }
}

window.onmousemove = function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  
  if(settings[0]) update();
}

window.onmousedown = function(e) {
  mouse.down = true;
  
  if(settings[0]) update();
}

window.onmouseup = function(e) {
  mouse.down = false;
  
  if(settings[0]) update();
}

window.onbeforeunload = function() {
  save();
}

window.onresize = function() {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  
  resetGradients();
}