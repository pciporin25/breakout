/*
 * "Constants"
 */
// frames per second to run game
var FPS = 50;
// color for everything
var COLOR = '#0095DD';
// ball specific values
var BALL_IMAGE = 'images/ball.gif';
var BALL_SPEED = 4;
var BALL_SIZE = 10;
// paddle specific values
var PADDLE_SOUND = 'sounds/pong_beep.wav';
var PADDLE_SPEED = 8;
var PADDLE_SIZE = 10;
var BRICK_SIZE = 8;
//var BRICK_COLOR = '#FF0000'


/*
 * Image and Sound manager
 */
// handle image and sounds loading, really only needed for LOTS or BIG images and sounds
class ResourceManager {
    constructor () {
        this.numImagesLeftToLoad = 0;
        this.numSoundsLeftToLoad = 0;
    }

    // these need to be called BEFORE the game starts so they are loaded and available DURING the game
    loadImage (url) {
        // create actual HTML element and note when it finishes loading
        var img = new Image();
        var self = this;
        img.onload = function () {
            self.numImagesLeftToLoad -= 1;
            console.log(url + ' loaded');
            // reset so it is only counted once (just in case)
            this.onload = null;
        }
        img.onerror = function () {
            console.log('ERROR: could not load ' + url);
        }
        img.src = url;
        this.numImagesLeftToLoad += 1;
        return img;
    }

    loadSound (url) {
        // create actual HTML element and note when it finishes loading
        var snd = new Audio();
        var self = this;
        snd.oncanplay = function () {
            self.numSoundsLeftToLoad -= 1;
            console.log(url + ' loaded');
            // reset so it is only counted once (just in case)
            this.oncanplay = null;
        }
        snd.onerror = function () {
            console.log('ERROR: could not load ' + url);
        }
        snd.src = url;
        this.numSoundsLeftToLoad += 1;
        return snd;
    }

    isLoadingComplete () {
        return this.numImagesLoaded === this.numImagesExpected &&
               this.numSoundsLoaded === this.numSoundsExpected;
    }
}


/*
 * Key and mouse input manager
 */
class InputManager {
    constructor (canvas) {
        this.canvas = canvas;
        this.leftPressed = false;
        this.rightPressed = false;
        this.rPressed = false;
        this.gPressed = false;
        this.bPressed = false;
        this.mouseX = 0;
        this.mouseY = 0;
    }

    get leftPressed () {
        return this._leftPressed;
    }
    get rightPressed () {
        return this._rightPressed;
    }

    get rPressed () {
        return this._rPressed;
    }

    get gPressed () {
        return this._gPressed;
    }

    get bPressed () {
        return this._bPressed;
    }

    set leftPressed (pressed) {
        this._leftPressed = pressed;
    }
    set rightPressed (pressed) {
        this._rightPressed = pressed;
    }

    set rPressed (pressed) {
        this._rPressed = pressed;
    }
    set gPressed (pressed) {
        this._gPressed = pressed;
    }
    set bPressed (pressed) {
        this._bPressed = pressed;
    }

    keyDownHandler (e) {
        if (e.keyCode == 37) {
            this.leftPressed = true;
        }
        else if (e.keyCode == 39) {
            this.rightPressed = true;
            //console.log("right pressed")
        }
        else if (e.keyCode == 82) {
          this.rPressed = true;
        }
        else if (e.keyCode == 71) {
          this.gPressed = true;
        }
        else if (e.keyCode == 66) {
          this.bPressed = true;
        }
    }

    keyUpHandler (e) {
        if (e.keyCode == 37) {
            this.leftPressed = false;
        }
        else if (e.keyCode == 39) {
            this.rightPressed = false;
        }
        else if (e.keyCode == 82) {
          this.rPressed = false;
        }
        else if (e.keyCode == 71) {
          this.gPressed = false;
        }
        else if (e.keyCode == 66) {
          this.bPressed = false;
        }
    }

    // get the mouse coordinates relative to the canvas rather than the page
    mouseMoveHandler (e) {
        this.mouseX = e.clientX - this.canvas.offsetLeft;
        this.mouseY = e.clientY - this.canvas.offsetTop;
    }

    mouseInBounds () {
        return this.mouseX > 0 && this.mouseX < this.canvas.width &&
               this.mouseY > 0 && this.mouseY < this.canvas.height;
    }
}


/*
 * Generic game element that can move and be drawn on the canvas.
 */
class Sprite {
    constructor (x, y, width, height, dx, dy) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
    }

    get x () {
        return this._x;
    }

    get y () {
        return this._y;
    }

    get dx () {
        return this._dx;
    }

    get dy () {
        return this._dy;
    }

    get nextX () {
        return this._x + this._dx;
    }

    get nextY () {
        return this._y + this._dy;
    }

    get width () {
        return this._width;
    }

    get height () {
        return this._height;
    }


    set x (x) {
        this._x = x;
    }

    set y (y) {
        this._y = y;
    }

    set dx (dx) {
        this._dx = dx;
    }

    set dy (dy) {
        this._dy = dy;
    }

    set width (w) {
        this._width = w;
    }

    set height (h) {
        this._height = h;
    }

    reset () {
        this.x = this.startX;
        this.y = this.startY;
    }

    move (canvas) {
    }

    draw (ctx) {
    }
}

class Ball extends Sprite {
    constructor (image, x, y, size, dx, dy) {
        super(x, y, size, size, dx, dy);
        this.image = image;
    }

    get size () {
        return this.width;
    }

    move () {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      /*
        if (this.image != null) {
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        }
        else {
            // set features first, so they are active when the rect is drawn
            ctx.beginPath();
            ctx.fillStyle = COLOR;
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
        */
    }
}

class Paddle extends Sprite {
    constructor (x, y, width, height, dx, dy) {
        super(x, y, width, height, dx, dy);
    }

    move (canvas) {
        if (input.rightPressed && this.x < (canvas.width - this.width)) {
          //console.log("here")
            this.x += this.dx;
        }
        else if (input.leftPressed && this.x > 0) {
            this.x -= this.dx;
            //console.log("this works.")
        }
        else if (input.mouseInBounds()) {
            this.x = input.mouseX - this.width / 2;
        }
    }

    draw (ctx) {
        // set features first, so they are active when the rect is drawn
        ctx.fillStyle = COLOR;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Brick extends Sprite {
  constructor(x, y, width, height, color) {
    super(x, y, width, height, 0, 0);
    this.isHit = false;
    this.brickColor = color;
  }

  draw (ctx) {
    if (!this.isHit) {
      ctx.fillStyle = this.brickColor;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  hit (ctx) {
    ctx.clearRect(this.x, this.y, this.width, this.height);
    this.isHit = true;
  }

  reset() {
    super.reset();
    this.isHit = false;
    //ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}


class Score extends Sprite {
    constructor (x, y) {
        super(x, y, 0, 0, 0, 0);
        this.score = 0;
        this.hiScore = 0;
    }

    draw (ctx) {
        // set features first, so they are active when the text is drawn
        ctx.font = '10px Arial';
        ctx.fillStyle = COLOR;
        ctx.fillText('Score: ' + this.score, this.x, this.y);
        ctx.fillText('Hi Score: ' + this.hiScore, this.x + 90, this.y);
    }

    reset () {
        this.score = 0;
    }

    increment () {
        this.score += 1;
        if (this.score > this.hiScore) {
            this.hiScore = this.score;
        }
    }
}


/*
 * Game class contains everything about the game and displays in a given canvas
 */
class Game {
    constructor (canvas) {
        // the area in the HTML document where the game will be played
        this.canvas = canvas;
        // the actual object that handles drawing on the canvas
        this.ctx = this.canvas.getContext('2d');
        this.paddleSound = resources.loadSound(PADDLE_SOUND);
        // elements in the game
        this.ball = new Ball(resources.loadImage(BALL_IMAGE),
                             0 + BALL_SIZE, BRICK_SIZE*5 + BALL_SIZE, BALL_SIZE,
                             BALL_SPEED, BALL_SPEED);
        this.paddle = new Paddle((this.canvas.width - PADDLE_SIZE * 6) / 2, this.canvas.height - PADDLE_SIZE * 2,
                                 PADDLE_SIZE * 6, PADDLE_SIZE, PADDLE_SPEED, 0);
        this.score = new Score(this.canvas.width - 150, 10);
        //this.brick = new Brick(0, BRICK_SIZE, BRICK_SIZE * 6, BRICK_SIZE);
        this.redRow = this.makeBricks('#FF0000', BRICK_SIZE*2);
        this.greenRow = this.makeBricks('#00FF00', BRICK_SIZE*3);
        this.blueRow = this.makeBricks('#0000FF', BRICK_SIZE*4);
        //console.log(this.brickRow.length);
      }

    makeBricks(color, yPos) {
      var brickRow = new Array(0);
      //let count = 0;
      for (let i=0; i<this.canvas.width; i+=BRICK_SIZE*6) {
        let b = new Brick(i, yPos, BRICK_SIZE * 6, BRICK_SIZE, color);
        console.log(b);
        brickRow.push(b);
        //count++;
      }
      return brickRow;
    }

    cheatBricks(brickRow) {
      for (let i=0; i<brickRow.length; i++) {
        if (!brickRow[i].isHit) {
          brickRow[i].hit(this.ctx);
          this.score.increment();
        }
      }
    }

    loop () {
        if (resources.isLoadingComplete()) {
            this.update();
            this.draw();

            //end game if ball falls below paddle
            if (this.ball.nextY > this.canvas.height - this.ball.size) {
              clearInterval(gameLoop);
              this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
              this.ctx.font = '30px Arial';
              this.ctx.fillStyle = '#000000';
              this.ctx.fillText("You Lose!", this.canvas.width / 2 - 65, this.canvas.height / 2);
              console.log("you lose!");
            }
            //end game if all bricks are hit
            else if (this.score.score == 30) {
              clearInterval(gameLoop);
              this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
              this.ctx.font = '30px Arial';
              this.ctx.fillStyle = '#000000';
              this.ctx.fillText("You Win!", this.canvas.width / 2 - 55, this.canvas.height / 2)
              console.log("you win!")
            }

        }
    }

    update() {
        this.ball.move(this.canvas);
        this.paddle.move(this.canvas);
        this.checkCollisions(this.canvas);
        // no way to win or lose, it just plays forever!

        //cheat codes
        if (input.rPressed) {
          this.cheatBricks(this.redRow);
        }
        else if (input.gPressed) {
          this.cheatBricks(this.greenRow);
        }
        else if (input.bPressed) {
          this.cheatBricks(this.blueRow);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ball.draw(this.ctx);
        this.paddle.draw(this.ctx);
        this.score.draw(this.ctx);
        //this.brick.draw(this.ctx);
        for (let i=0; i<this.redRow.length; i++) {
          let brick = this.redRow[i];
          brick.draw(this.ctx);
        }
        for (let i=0; i<this.blueRow.length; i++) {
          let brick = this.blueRow[i];
          brick.draw(this.ctx);
        }
        for (let i=0; i<this.greenRow.length; i++) {
          let brick = this.greenRow[i];
          brick.draw(this.ctx);
        }

        //draw separator line at top
        this.ctx.beginPath();
        this.ctx.moveTo(0, BRICK_SIZE*2 - 1);
        this.ctx.lineTo(this.canvas.width, BRICK_SIZE*2 - 1);
        this.ctx.stroke();
    }


    checkCollisions() {
      if (this.ball.nextY < BRICK_SIZE*4) {
        for (let i=0; i<this.blueRow.length; i++) {
          let brick = this.blueRow[i];
          console.log(brick, this.ball);
          console.log(brick.x, this.ball.x, (brick.x + brick.width));
          if (!brick.isHit && brick.x <= this.ball.x && (brick.x + brick.width) >= this.ball.x) {
            console.log("hit!");
            this.score.increment();
            brick.hit(this.ctx);
            this.ball.dy = -this.ball.dy;
          }
        }
      }
      if (this.ball.nextY < BRICK_SIZE*3) {
        for (let i=0; i<this.greenRow.length; i++) {
          let brick = this.greenRow[i];
          console.log(brick, this.ball);
          console.log(brick.x, this.ball.x, (brick.x + brick.width));
          if (!brick.isHit && brick.x <= this.ball.x && (brick.x + brick.width) >= this.ball.x) {
            console.log("hit!");
            this.score.increment();
            brick.hit(this.ctx);
            this.ball.dy = -this.ball.dy;
          }
        }
      }
      if (this.ball.nextY < BRICK_SIZE*2) {
          for (let i=0; i<this.redRow.length; i++) {
            let brick = this.redRow[i];
            console.log(brick, this.ball);
            console.log(brick.x, this.ball.x, (brick.x + brick.width));
            if (!brick.isHit && brick.x <= this.ball.x && (brick.x + brick.width) >= this.ball.x) {
              console.log("hit!");
              this.score.increment();
              brick.hit(this.ctx);
              this.ball.dy = -this.ball.dy;
            }
          }
           //change y direction no matter what for top row
        }
        if (this.ball.nextY < BRICK_SIZE) {
          this.ball.dy = -this.ball.dy;
        }
        if (this.ball.nextX < 0 || this.ball.nextX > this.canvas.width - this.ball.size) {
            this.ball.dx = -this.ball.dx;
        }
        else if (this.ball.nextY > this.paddle.y - this.ball.size && //if ball is colliding with paddle
                 this.ball.nextX > this.paddle.x && this.ball.nextX < this.paddle.x + this.paddle.width) {
            this.ball.dy = -this.ball.dy;
            //this.paddleSound.play();
        }
        else if (this.ball.nextY > this.canvas.height - this.ball.size) {
            //clearInterval(gameLoop);
            //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            //this.ctx.font = '30px Arial';
            //this.ctx.fillText("You Lose!", this.canvas.width / 2 - 50, this.canvas.height / 2);
            //console.log("you lose!");
            /*
            this.ball.reset();
            this.paddle.reset();
            this.score.reset();
            for (let i=0; i<this.redRow.length; i++) {
              let brick = this.redRow[i];
              brick.reset();
            }
            for (let i=0; i<this.greenRow.length; i++) {
              let brick = this.greenRow[i];
              brick.reset();
            }
            for (let i=0; i<this.blueRow.length; i++) {
              let brick = this.blueRow[i];
              brick.reset();
            }
            */

        }
    }


}


/*
 * Setup classes
 */
var canvas = document.getElementById('gameCanvas');
var resources = new ResourceManager();
var input = new InputManager(canvas);
var game = new Game(canvas);
var gameLoop = null;
//game.makeBricks();

/*
 * Setup input responses
 */
// respond to both keys and mouse movements
document.addEventListener('keydown', event => input.keyDownHandler(event), false);
document.addEventListener('keyup', event => input.keyUpHandler(event), false);
document.addEventListener('mousemove', event => input.mouseMoveHandler(event), false);
document.getElementById('start').addEventListener('click', playGame, false);

/*
 * Game loop
 */
// NOT IDEAL --- just starts when the everthing is done loading, not necessarily when the user is ready
function playGame() {
  clearInterval(gameLoop);
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

  document.getElementById('start').innerHTML = "Restart Game";

  //reset previous game elements
  game.ball.reset();
  game.paddle.reset();
  game.score.reset();

  for (let i=0; i<game.redRow.length; i++) {
    let brick = game.redRow[i];
    brick.reset();
  }
  for (let i=0; i<game.greenRow.length; i++) {
    let brick = game.greenRow[i];
    brick.reset();
  }
  for (let i=0; i<game.blueRow.length; i++) {
    let brick = game.blueRow[i];
    brick.reset();
  }

  gameLoop = setInterval(function() {
      game.loop();
  }, 1000/FPS);
}
