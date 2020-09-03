var c = document.createElement("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
var ctx = c.getContext("2d");
var cData = ctx.getImageData(0, 0, c.width, c.height);

var file = document.getElementById("file");
var text = document.getElementById("text");
var con = document.getElementById("console");
con.width = window.innerWidth * 0.25;
con.height = window.innerHeight;
var conCtx = con.getContext("2d");
var consoleText = "";
var fr = new FileReader();

var keys = [];
for(var i = 0; i < 256; i++) keys.push(0);

var view = 0;
var lines = [];
var line = 0;
var variables = [];
var functions = [];
var stack = [];

reset();

function update() {
  if(view == 1) {
    var s = Date.now();
    while(Date.now() - 1000 / 60 < s) {
      var curLine = lines[line];
      var found = false;
      
      var l = curLine.match(/^\s*\/\/.*/);
      if(l == null) {
        
        l = curLine.match(/^\s*def +var\((.*)\) *= *([a-zA-Z]+) *=.*/);
        if(l != null && l.length == 3) {
          found = true;
          if(l[1] != "int" && l[1] != "float" && l[1] != "bool") {
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
        
        l = curLine.match(/^\s*def +fvar\((.*) *\, *(.*)\) *= *([a-zA-Z]+) *=.*/);
        if(l != null && l.length == 4) {
          found = true;
          if(l[2] != "int" && l[2] != "float" && l[2] != "bool") {
            console.error('Invalid type "' + l[2] + '" on line ' + line);
          } else {
            var val = curLine.match(/def +fvar\(.* *\, *.*\) *= *[a-zA-Z]+ *= *(.+)$/);
            if(val == null) {
              console.error('Invalid variable declaration on line ' + line);
            } else {
              val = evalExp(val[1]);
              if(functions[l[1]] == undefined) {
                functions[l[1]] = {line: undefined, vars: []};
              }
              functions[l[1]].vars[l[3]] = new variable(val, l[2]);
            }
          }
        }

        l = curLine.match(/^\s*exe +(if|while)\((.*)\):$/);
        if(l != null && l.length == 3) {
          found = true;
          var res = evalExp(l[2]);
          if(!res) {
            var tempLine = line;
            var scope = 0;
            while(true) {
              if(lines[tempLine].match(/^\s*exe +(if|while)\((.*)\):$/) != null) {
                scope++;
              }
              if(lines[tempLine].match(/^\s*exe +end;$/) != null) {
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
        
        l = curLine.match(/^\s*exe end;$/);
        if(l != null && l.length == 1) {
          found = true;
          var start = line;
          var tempLine = line;
          var scope = 0;
          while(true) {
            if(lines[tempLine].match(/^\s*exe +(if|while)\((.*)\):$/) != null || lines[tempLine].match(/^\s*def +(func)\((.*)\):$/)) {
              scope--;
            }
            if(lines[tempLine].match(/^\s*exe +end;$/) != null) {
              scope++;
            }

            if(scope == 0) {
              var temp = lines[tempLine].match(/^\s*exe +while\((.*)\):$/);
              if(temp != null && temp.length == 2) {
                line = tempLine - 1;
                break;
              } else {
                temp = lines[tempLine].match(/^\s*def +func\((.*)\):$/);
                if(temp != null && temp.length == 2) {
                  line = stack.pop().line;
                  break;
                } else {
                  break;
                }
              }
            }

            tempLine--;
            if(tempLine < 0) {
              break;
            }
          }
        }
        
        l = curLine.match(/^\s*([^ ]+?) *([+\-*/=]{1,2}) *(.*)$/);
        if(l != null && l.length >= 3) {
          found = true;
          var v = 0;
          var a = 0;
          var b = 0;
          var f = false;
          
          var temp = curLine.match(/^\s*get\.var\((.+?)\) *[+\-*/=]{1,2}/);
          if(temp != null && temp.length == 2) {
            f = true;
            if(stack.length > 0) {
              a = functions[stack[stack.length - 1].name].vars[temp[1]].value;
              b = new variable(evalExp(l[3]), functions[stack[stack.length - 1].name].vars[temp[1]].type).value;
            }
          } else {
            a = variables[l[1]].value;
            b = new variable(evalExp(l[3]), variables[l[1]].type).value;
          }
          switch(l[2]) {
          case "+=":
            if(l.length == 4) {
              v = a + b;
            } else {
              console.error("No value to be added at line " + line);
            }
            break;
          case "-=":
            if(l.length == 4) {
              v = a - b;
            } else {
              console.error("No value to be subtracted at line " + line);
            }
            break;
          case "*=":
            if(l.length == 4) {
              v = a * b;
            } else {
              console.error("No value to be multiplied at line " + line);
            }
            break;
          case "/=":
            if(l.length == 4) {
              v = a / b;
            } else {
              console.error("No value to be divided at line " + line);
            }
            break;
          case "++":
            v = a + 1;
            break;
          case "--":
            v = a - 1;
            break;
          case "=":
            v = b;
            break;
          }
          
          if(f) {
            functions[stack[stack.length - 1].name].vars[temp[1]].setValue(v);
          } else {
            variables[l[1]].setValue(v);
          }
        }
        
        l = curLine.match(/^\s*exe +print\((.*)\)$/);
        if(!found && l != null && l.length == 2) {
          found = true;
          console.log(evalExp(l[1]));
        }
        
        l = curLine.match(/^\s*exe +func\(([a-zA-Z]+)\)$/);
        if(!found && l != null) {
          found = true;
          if(l[1] == "getKey") {
            functions[l[1]].vars["state"].setValue(keys[functions[l[1]].vars["key"].value]);
          } else if(l[1] == "drawPixel") {
            var index = functions[l[1]].vars["x"].value + functions[l[1]].vars["y"].value * cData.width;
            cData.data[index * 4 + 0] = functions[l[1]].vars["r"].value;
            cData.data[index * 4 + 1] = functions[l[1]].vars["g"].value;
            cData.data[index * 4 + 2] = functions[l[1]].vars["b"].value;
            cData.data[index * 4 + 3] = 255;
          } else {
            if(functions[l[1]] == undefined) {
              console.error('Undefined function "' + l[1] + '"');
            } else {
              stack.push({line, name: l[1]});
              line = functions[l[1]].line;
            }
          }
        }
        
        l = curLine.match(/^\s*def +func\((.*)\):$/);
        if(!found && l != null && l.length == 2) {
          found = true;
          if(functions[l[1]] == undefined)
            functions[l[1]] = {line: line, vars: []};
          if(functions[l[1]].line == undefined)
            functions[l[1]].line = line;
          if(functions[l[1]].vars == undefined)
            functions[l[1]].vars = [];
          
          var tempLine = line;
          var scope = 0;
          while(true) {
            if(lines[tempLine].match(/^\s*exe +(if|while)\((.*)\):$/) != null || lines[tempLine].match(/^\s*def +(func)\((.*)\):$/) != null) {
              scope++;
            }
            if(lines[tempLine].match(/^\s*exe +end;$/) != null) {
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
    
    draw();
    requestAnimationFrame(update);
  }
}

function draw() {
  ctx.putImageData(cData, 0, 0);
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
  exp += "";
  exp.replace(/\s/g, "");
  for(var i = 0; i < exp.length; i++) {
    if(exp[i].search(/^[a-zA-Z"'\.]$/) != -1 && (i == 0 || exp[i - 1].search(/[0-9]/) == -1)) {
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
          if((exp[i].search(/^[a-zA-Z\.\, ]$/) != -1 || (exp[i - 1].search(/[\(]/) != -1 && exp[i].search(/[\)]/) != -1)) && exp[i - 1].search(/[0-9]/) == -1) {
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
          if(str.substr(0, 8) == "get.var(") {
            rep = functions[stack[stack.length - 1].name].vars[str.substr(8, str.length - 9)].value;
          } else if(str.substr(0, 9) == "get.fvar(") {
            rep = functions[str.substr(9, str.length - 10).match(/(.*)\,/)[1]].vars[str.substr(9, str.length - 10).match(/\, *(.*)/)[1]].value;
          } else if(str != ".") {
            rep = variables[str.replace(/[^a-zA-Z]/g, "")].value;
          } else {
            rep = ".";
          }
          break;
        }
        
        exp = exp.substr(0, start) + rep + exp.substr(start + len);
        i -= len;
      }
    }
  }
  
  s = 0;
  while(s != -1 && s != null) {
    s = exp.match(/(?<=[+\-*/<>=]|^) *(\- *[0-9]+\.{0,1}[0-9]*)/);
    if(s != null && s.length == 2) {
      exp = exp.substr(0, s.index) + "(0" + s[1] + ")" + exp.substr(s.index + s[0].length);
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
      if(value == "" || value == undefined) {
        this.value = 0;
      }
      if(isNaN(this.value)) {
        console.error('Couldn\'t parse int "' + value + '"');
      }
      break;
    case "float":
      this.value = parseFloat(value);
      if(value == "" || value == undefined) {
        this.value = 0;
      }
      if(isNaN(this.value)) {
        console.error('Couldn\'t parse float "' + value + '"');
      }
      break;
    case "bool":
      this.value = Math.max(0, Math.min(1, value));
      if(value == "" || value == undefined) {
        this.value = 0;
      }
      if(isNaN(this.value)) {
        console.error('Couldn\'t parse bool "' + value + '"');
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
  functions = [];
  stack = [];
  consoleText = "";
  var vars = [];
  vars["key"] = new variable(0, "int");
  vars["state"] = new variable(0, "bool");
  functions["getKey"] = {line: -1, vars};
  vars = [];
  vars["x"] = new variable(0, "int");
  vars["y"] = new variable(0, "int");
  vars["r"] = new variable(0, "int");
  vars["g"] = new variable(0, "int");
  vars["b"] = new variable(0, "int");
  functions["drawPixel"] = {line: -1, vars};
  
  ctx.clearRect(0, 0, c.width, c.height);
  cData = ctx.getImageData(0, 0, c.width, c.height);
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
  keys[e.keyCode] = true;
}

window.onkeyup = function(e) {
  keys[e.keyCode] = false;
}

window.onresize = function() {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  cData = ctx.getImageData(0, 0, c.width, c.height);
}