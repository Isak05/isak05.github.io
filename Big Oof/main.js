var c = document.createElement("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
var ctx = c.getContext("2d");

var file = document.getElementById("file");
var text = document.getElementById("text");
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
      
      var l = curLine.match(/\/\/.*/);
      if(l == null) {
      
        l = curLine.match(/def +var\((.*)\) *= *([a-zA-Z]+) *=.*/);
        if(l != null && l.length == 3) {
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
              line = tempLine;
            }

            tempLine--;
            if(tempLine <= 0) {
              break;
            }
          }
          line = tempLine;
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

function getPrecedence(x) {
  if(x == "||" || x == "&&") {
    return 1;
  }
  if(x == "<" || x == ">" || x == "<=" || x == ">=") {
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
  case "%":
    res = val1 % val2;
    break;
  }
  return res;
}

function evalExp(exp) {
  for(var i = 0; i < exp.length; i++) {
    if(exp[i].search(/^[a-zA-Z]$/) != -1) {
      var str = exp[i];
      var start = i;
      var len = 0;
      while(i < exp.length) {
        i++;
        len++;
        if(i >= exp.length) {
          i--;
          break;
        }
        if(exp[i].search(/^[a-zA-Z]$/) != -1) {
          str += exp[i];
        } else {
          i--;
          break;
        }
      }
      
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
      while(i < exp.length && (exp[i] == "&" || exp[i] == "|")) {
        len++;
        i++;
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
  
  lines = text.value.split("\n");
  
  reset();
  
  update();
}

function reset() {
  variables = [];
}

function stop() {
  text.style.display = "block";
  c.style.display = "none";
  
  line = 0;
}

file.onchange = function() {
  fr.readAsText(file.files[0]);
  fr.onload = function() {
    console.log(file.files[0]);
    text.value = fr.result;
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