var formatted = JSON.parse(localStorage.getItem("schedule"));
if(formatted == null) {
  formatted = [[], [], [], [], []];
}
var days = [];
for(var i = 0; i < formatted.length; i++) {
  days[i] = [];
  for(var j = 0; j < formatted[i].length; j++) {
    days[i][j] = {subject: formatted[i][j].s, start: formatted[i][j].b, end: formatted[i][j].e, location: formatted[i][j].l};
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
      day = days[0][0];
    } else {
      day = days[date.getDay()][0];
    }
    if(day == undefined) {
      return;
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

var prevMinute = undefined;
setInterval(update, 5000);
setInterval(updateSchematic, 60000);
function update() {
  var lesson = getLesson();
  if(lesson && !lesson.active && lesson.minutes == 3 && prevMinute > lesson.minutes) {
    var settings = JSON.parse(localStorage.getItem("settings"));
    if(settings == null) {
      settings = [false, false, true, true];
    }
    if(settings[3]) {
      var t = lesson.subject + " börjar om " + lesson.minutes + " minuter vid " + lesson.location;
      if(settings[1]) {
        t = lesson.subject + " starts in " + lesson.minutes + " minutes at " + lesson.location;
      }
      chrome.notifications.create({
        type: "basic", 
        iconUrl: "icon.png", 
        title: t, 
        message: "", 
        requireInteraction: true, 
        priority: 2
      });
    }
  }
  if(lesson) {
    prevMinute = lesson.minutes;
  }
}

function updateSchematic() {
  formatted = JSON.parse(localStorage.getItem("schedule"));
  if(formatted == null) {
    formatted = [[], [], [], [], []];
  }
  days = [];
  for(var i = 0; i < formatted.length; i++) {
    days[i] = [];
    for(var j = 0; j < formatted[i].length; j++) {
      days[i][j] = {subject: formatted[i][j].s, start: formatted[i][j].b, end: formatted[i][j].e, location: formatted[i][j].l};
    }
  }
}