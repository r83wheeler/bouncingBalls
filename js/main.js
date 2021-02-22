// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

//Modeling a ball 

function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color; 
    this.size = size; 
}

//Drawing the ball

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color; 
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

//create a new ball instance

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY); 
  }

  if ((this.y - this.size) <=0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}


//Animation loop

function loop() {
  ctx.fillstyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  requestAnimationFrame(loop); 
} 

//Animating the ball

let balls = []; 

while (balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
    //bal position always drawn at least one ball width
    //away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7,7),
    random(-7,7),
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255)+')', size
  );

  balls.push(ball);
}

//Physics function
Physics(function (world) {

  //bounds of the window
  var viewportBounds = Physics.aabb(0,0, window.innerWidth, window.innerHeight)
  ,width = window.innerWidth
  ,height = window.innerHeight
  ,renderer
  ;

  //let's use the pixi renderer
  requestAnimationFrame(['vendor/pixi'], function(PIXI){
    window.PIXI = PIXI; 
    //create a renderer
    renderer = Physics.renderer('pixi', {
      el: 'viewport'
    });

    //add the renderer
    world.add(renderer);
    //render on each step
    world.on('step', function() {
      world.render();
    });

    //some fun colors
    var colors = {
      blue: '0x1d6b98',
      blueDark: '0x14546f',
      red: '0xdc322f',
      darkRed: '0xa42222'
    };

    //scale relative to window width
    function S(n){
      return n * window.innerWidth/600;
    }

    //create the zero
    var zero = Physics.body('compound', {
      x: width/2 - S(80)
      ,y: height/2
      ,treatment: 'static'
      ,styles: {
        fillStyle: colors.red
        ,lineWidth: 1
        ,strokeStyle: colors.darkRed
        ,alpha: 0.001 //pixi bug
      }
      ,children: [
        //coords of children are relative to the compound center of mass
        Physics.body('rectangle', {})
      ]
    })
  })
})

 
//Collision detection 

Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++){
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y; 
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}
loop(); 