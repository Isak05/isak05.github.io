var c = document.createElement("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
var ctx = c.getContext("2d");

var file = document.getElementById("file");
var text = document.getElementById("text");
var con = document.getElementById("console");
con.width = window.innerWidth * 0.25;
con.height = window.innerHeight;
var conCtx = con.getContext("2d");
var consoleText = "";
var fr = new FileReader();

var view = 0;
var lines = [];
var line = 0;
var variables = [];

function update() {
  if(view == 1) {
    var s = Date.now();
    while(Date.now() - 1000 / 60 < s) {
      var curLine = lines[line];
      var found = false;
      
      var l = curLine.match(/\/\/.*/);
      if(l == null) {
        
        l = curLine.match(/def +var\((.*)\) *= *([a-zA-Z]+) *=.*/);
        if(l != null && l.length == 3) {
          found = true;
          if(l[1] != "int" && l[1] != "float") {
            console.error('Invalid type "' + l[1] + '" on line ' + line);
          } else {
            var val = curLine.match(/def +var\(.*\) *= *[a-zA-Z]+ *= *(.+)$/);
            if(val == null) {
              console.error('Invalid variable declaration on line ' + line);
            } else {
              val = evalExp(val[1]);
              variables[l[2]] = new variable(val, l[1]);
            }
          }
        }

        l = curLine.match(/exe +(if|while)\((.*)\):$/);
        if(l != null && l.length == 3) {
          found = true;
          var res = evalExp(l[2]);
          if(!res) {
            var tempLine = line;
            var scope = 0;
            while(true) {
              if(lines[tempLine].match(/exe +(if|while)\((.*)\):$/) != null) {
                scope++;
              }
              if(lines[tempLine].match(/exe +end;$/) != null) {
                scope--;
              }

              if(scope == 0) {
                line = tempLine;
                break;
              }

              tempLine++;
              if(tempLine >= lines.length) {
                break;
              }
            }
          }
        }
        
        l = curLine.match(/exe end;$/);
        if(l != null && l.length == 1) {
          found = true;
          var start = line;
          var tempLine = line;
          var scope = 0;
          while(true) {
            if(lines[tempLine].match(/exe +(if|while)\((.*)\):$/) != null) {
              scope--;
            }
            if(lines[tempLine].match(/exe +end;$/) != null) {
              scope++;
            }

            if(scope == 0) {
              var temp = lines[tempLine].match(/exe +while\((.*)\):$/);
              if(temp != null && temp.length == 2) {
                line = tempLine - 1;
                break;
              } else {
                break;
              }
            }

            tempLine--;
            if(tempLine <= 0) {
              break;
            }
          }
        }
        
        l = curLine.match(/exe print\((.*)\)$/);
        if(l != null && l.length == 2) {
          found = true;
          console.log(evalExp(l[1]));
        }
        
        if(!found && curLine.search(/^\s*$/) == -1) {
          console.error("Couldn't parse line " + line);
        }
      }

      line++;
      if(line >= lines.length) {
        view = 0;
        stop();
        return;
      }
    }
    
    requestAnimationFrame(update);
  }
}

drawConsole();
function drawConsole() {
  conCtx.fillStyle = "rgb(255, 255, 255)";
  conCtx.fillRect(0, 0, con.width, con.height);
  var s = 15;
  conCtx.font = s + "px Arial";
  conCtx.fontWeight = 2;
  var maxLines = Math.ceil(con.height / s);
  var lines = consoleText.split("\n");
  for(var i = Math.max(0, lines.length - maxLines); i < lines.length; i++) {
    if(lines[i].substr(0, 1) == "i") {
      conCtx.fillStyle = "rgb(25, 25, 25)";
    } else if(lines[i].substr(0, 1) == "e") {
      conCtx.fillStyle = "rgb(255, 100, 100)";
    }
    conCtx.fillText(lines[i].substr(1), 0, (i + 1 - Math.max(0, lines.length - maxLines)) * s);
  }
  requestAnimationFrame(drawConsole);
}

function getPrecedence(x) {
  if(x == "||" || x == "&&") {
    return 1;
  }
  if(x == "<" || x == ">" || x == "<=" || x == ">=" || x == "==" || x == "!=") {
    return 2;
  }
  if(x == "+" || x == "-") {
    return 3;
  }
  if(x == "*" || x == "/" || x == "%") {
    return 4;
  }
  return 0; 
}

function calc(val1, val2, oper) {
  var res = 0;
  switch(oper) {
  case "+":
    res = val1 + val2;
    break;
  case "-":
    res = val1 - val2;
    break;
  case "*":
    res = val1 * val2;
    break;
  case "/":
    res = val1 / val2;
    break;
  case "<":
    res = val1 < val2;
    break;
  case ">":
    res = val1 > val2;
    break;
  case "<=":
    res = val1 <= val2;
    break;
  case ">=":
    res = val1 >= val2;
    break;
  case "||":
    res = val1 || val2;
    break;
  case "&&":
    res = val1 && val2;
    break;
  case "==":
    res = (val1 == val2) + 0;
    break;
  case "!=":
    res = (val1 != val2) + 0;
    break;
  case "%":
    res = val1 % val2;
    break;
  }
  return res;
}

function evalExp(exp) {
  for(var i = 0; i < exp.length; i++) {
    if(exp[i].search(/^[a-zA-Z"']$/) != -1) {
      var str = exp[i];
      var quote = "";
      if(str == '"' || str == "'") {
        quote = str;
      }
      var start = i;
      var len = 0;
      while(i < exp.length) {
        i++;
        len++;
        if(i >= exp.length) {
          i--;
          break;
        }
        if(quote == "") {
          if(exp[i].search(/^[a-zA-Z]$/) != -1) {
            str += exp[i];
          } else {
            i--;
            break;
          }
        } else {
          if(exp[i] == quote) {
            //i--;
            break;
          }
        }
      }
      
      if(quote == "") {
        var rep = "";
        switch(str) {
        case "true":
          rep = 1;
          break;
        case "false":
          rep = 0;
          break;
        default:
          rep = variables[str].value;
          break;
        }
        exp = exp.substr(0, start) + rep + exp.substr(start + len);
        i -= len;
      }
    }
  }
  
  var values = [];
  var operators = [];
  for(var i = 0; i < exp.length; i++) {
    if(exp[i] == " ") {
      continue;
    } else if(exp[i] == "(") {
      operators.push(exp[i]);
    } else if(!isNaN(parseInt(exp[i]))) {
      var start = i;
      var len = 1;
      while(i < exp.length && (!isNaN(parseInt(exp[i])) || exp[i] == ".")) {
        len++;
        i++;
      }
      len--;
      i--;
      values.push(parseFloat(exp.substr(start, len)));
    } else if(exp[i] == '"' || exp[i] == "'") {
      var quote = exp[i];
      var start = i + 1;
      var len = 0;
      i++;
      while(i < exp.length && exp[i] != quote) {
        len++;
        i++;
      }
      values.push(exp.substr(start, len));
    } else if(exp[i] == ")") {
      while(operators.length > 0 && operators[operators.length - 1] != "(") {
        var val2 = values.pop();
        var val1 = values.pop();
        var oper = operators.pop();
        values.push(calc(val1, val2, oper));
      } 
      if(operators.length > 0) {
        operators.pop();
      }
    } else {
      while(operators.length > 0 && getPrecedence(operators[operators.length - 1]) >= getPrecedence(exp[i])) {
        var val2 = values.pop();
        var val1 = values.pop();
        var oper = operators.pop();
        values.push(calc(val1, val2, oper));
      }
      
      var start = i;
      var len = 1;
      while(i < exp.length && (exp[i] == "&" || exp[i] == "|" || exp[i] == "<" || exp[i] == ">" || exp[i] == "=" || exp[i] == "!")) {
        len++;
        i++;
        if(exp[i].search(/[0-9] /) != -1) {
          i--;
          len--;
        }
      }
      if(len > 1) {
        len--;
        i--;
      }
      operators.push(exp.substr(start, len));
    }
  }
  
  while(operators.length > 0) {
    var val2 = values.pop();
    var val1 = values.pop();
    var oper = operators.pop();
    values.push(calc(val1, val2, oper));
  }
  
  return values[values.length - 1];
}

console.log = function() {
  consoleText += "i" + arguments[0] + "\n";
}

console.error = function() {
  consoleText += "e" + arguments[0] + "\n";
}

function variable(value, type) {
  this.type = type;
  this.value = 0;
  this.getValue = function() {
    return this.value;
  }
  this.setValue = function(value) {
    switch(this.type) {
    case "int":
      this.value = parseInt(value);
      if(isNaN(this.value)) {
        console.error('Couldn\'t parse int "' + value + '"');
      }
      break;
    case "float":
      this.value = parseFloat(value);
      if(isNaN(this.value)) {
        console.error('Couldn\'t parse float "' + value + '"');
      }
      break;
    }
  }
  this.setValue(value);
}

function run() {
  text.style.display = "none";
  c.style.display = "block";
  con.style.display = "none";
  
  lines = text.value.split("\n");
  
  reset();
  
  update();
}

function reset() {
  variables = [];
  consoleText = "";
}

function stop() {
  text.style.display = "block";
  c.style.display = "none";
  con.style.display = "block";
  
  line = 0;
}

file.onchange = function() {
  fr.readAsText(file.files[0]);
  fr.onload = function() {
    var fileEnding = file.files[0].name.match(/\.(.*)$/)[1];
    if(fileEnding == "boof") {
      text.value = fr.result;
    } else {
      console.error('Invalid file format "' + fileEnding + '"');
    }
  }
  file.style.display = "none";
  document.getElementById("temp-file-br").style.display = "none";
  text.style.height = "100%";
}

text.onfocus = function() {
  file.style.display = "none";
  document.getElementById("temp-file-br").style.display = "none";
  text.style.height = "100%";
}

window.onkeydown = function(e) {
  if(e.keyCode == 27) {
    view = !view;
    if(view == 0) {
      stop();
    } else if(view == 1) {
      run();
    }
  }
}

window.onresize = function() {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}