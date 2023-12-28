import {
  Sitting,
  Running,
  Jumping,
  Falling,
  Rolling,
  Diving,
  Hit,
} from "./state.js";
import { Collision } from "./collision.js";
import { FloatingMessage } from "./floatingMessage.js";
export default class Player {
  constructor(game) {
    this.game = game;
    this.image = playerImage;
    this.width = 100;
    this.height = 91.2;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame;
    this.speed = 0;
    this.maxSpeed = 10;
    this.vy = 0;
    this.weight = 1;
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game),
    ];
    this.currentState = null;
    this.fps = 20;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
    this.sound = new Audio();
    this.sound.src = "boom.wav";
  }
  update(input, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(input);
    this.x += this.speed;
    if (input.includes("ArrowRight")) this.speed = this.maxSpeed;
    else if (input.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    else this.speed = 0;

    if (this.x < 0) this.x = 0;
    else if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    // Vertical movement
    // if (input.includes("ArrowUp") && this.onGround()) this.vy -= 25;
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;
    // vertical Bounding
    if (this.y > this.game.height - this.height - this.game.groundMargin)
      this.y = this.game.height - this.height - this.game.groundMargin;
    // sprite animation
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }
  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }
  draw(ctx) {
    if (this.game.debug) {
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter(state);
  }

  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        enemy.markForDeletion = true;
        this.game.collisions.push(
          new Collision(
            this.game,
            enemy.x + enemy.width * 0.5,
            enemy.y + enemy.height * 0.5
          )
        );
        this.sound.play();
        if (
          this.currentState === this.states[4] ||
          this.currentState === this.states[5]
        ) {
          this.game.score++;
          this.game.floatingMessage.push(
            new FloatingMessage("+1", enemy.x, enemy.y, 150, 50)
          );
        } else {
          this.setState(6, 0);
          this.game.lives--;
          if (this.game.lives < 0) {
            this.game.gameOver = true;
          }
        }
      }
    });
  }
}
