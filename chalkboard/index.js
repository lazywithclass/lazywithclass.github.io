$(document).ready(chalkboard);

function programmaticallyDraw() {
  var canvas = document.getElementById("chalkboard")
  var ctx = canvas.getContext("2d")
  ctx.strokeStyle = 'rgba(255,255,255,'+ (0.4 + Math.random() *0.2) + ')'

  var lastX = 0, lastY = 0

  return function(x, y) {
    console.log(x, lastX, Math.abs(lastX - x))

    if (Math.abs(lastX - x) > 15 || Math.abs(lastY - y) > 15) {
      console.log('shorten')
      lastX = x
      lastY = y
      return
    }

    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.stroke()

    lastX = x
    lastY = y
  }
}

function drawFromMemory() {
  var draw = programmaticallyDraw()
  JSON.parse(localStorage.getItem('movements')).forEach(function(xy) {
    draw(xy.x, xy.y)
  })
}

function persist(x, y, mouseDown) {
  var movements = JSON.parse(localStorage.getItem('movements')) || []
  movements.push({x: x, y: y})
  localStorage.setItem('movements', JSON.stringify(movements))
}

function clean() {
  localStorage.removeItem('movements')
}

function chalkboard(){
  $('#chalkboard').remove();
  $('.chalk').remove();
  $('body').prepend('<canvas id="chalkboard"></canvas>');
  $('body').prepend('<div class="chalk"></div>');

  var canvas = document.getElementById("chalkboard");
  $('#chalkboard').css('width',$(window).width());
  $('#chalkboard').css('height',$(window).height());
  canvas.width = $(window).width();
  canvas.height = $(window).height();

  var ctx = canvas.getContext("2d");

  var width = canvas.width;
  var height = canvas.height;
  var mouseX = 0;
  var mouseY = 0;
  var mouseD = false;
  var xLast = 0;
  var yLast = 0;
  var brushDiameter = 3;

  document.onselectstart = function(){ return false; };

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = brushDiameter;
  ctx.lineCap = 'round';

  document.addEventListener('touchmove', function(evt) {
    var touch = evt.touches[0];
    mouseX = touch.pageX;
    mouseY = touch.pageY;
    if (mouseY < height && mouseX < width) {
      evt.preventDefault();
      $('.chalk').css('left', mouseX + 'px');
      $('.chalk').css('top', mouseY + 'px');
      if (mouseD) {
        draw(mouseX, mouseY);
      }
    }
  }, false);

  document.addEventListener('touchstart', function(evt) {
    var touch = evt.touches[0];
    mouseD = true;
    mouseX = touch.pageX;
    mouseY = touch.pageY;

    xLast = mouseX;
    yLast = mouseY;
    draw(mouseX + 1, mouseY + 1);
  }, false);

  document.addEventListener('touchend', function(evt) {
    mouseD = false;
  }, false);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = brushDiameter;
  ctx.lineCap = 'round';

  $(document).mousemove(function(evt){
    mouseX = evt.pageX;
    mouseY = evt.pageY;
    if(mouseY<height && mouseX<width){
      $('.chalk').css('left',(mouseX-0.5*brushDiameter)+'px');
      $('.chalk').css('top',(mouseY-0.5*brushDiameter)+'px');
      if(mouseD){
        draw(mouseX,mouseY);
      }
    }else{
      $('.chalk').css('top',height-10);
    }
  });

  $(document).mousedown(function(evt) {
    mouseD = true;
    xLast = mouseX;
    yLast = mouseY;

    draw(mouseX+1,mouseY+1);
  });

  $(document).mouseup(function(evt) {
    mouseD = false;
  });

  function draw(x, y) {
    ctx.strokeStyle = 'rgba(255,255,255,'+ (0.4 + Math.random() *0.2) + ')';
    ctx.beginPath();
    ctx.moveTo(xLast, yLast);
    ctx.lineTo(x, y);
    ctx.stroke();

    persist(mouseX, mouseY)

    xLast = x;
    yLast = y;
  }

  $(window).resize(chalkboard);
}
