import Player from "./player.js";
import InputHandler from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";
import { UI } from "./ui.js";
window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.lives = 5;
      this.width = width;
      this.height = height;
      this.groundMargin = 50;
      this.speed = 0;
      this.maxSpeed = 3;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.background = new Background(this);
      this.ui = new UI(this);
      this.enemies = [];
      this.collisions = [];
      this.floatingMessage = [];
      this.enemyTimer = 0;
      this.enemyInterval = 500;
      this.debug = false;
      this.score = 0;
      this.gameOver = false;
      this.fontColor = "black";
      this.particles = [];
      this.maxParticles = 30;
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }
    update(deltaTime) {
      this.background.update();
      this.player.update(this.input.keys, deltaTime);
      // handle enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else this.enemyTimer += deltaTime;

      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
      });

      this.floatingMessage.forEach((message) => {
        message.update();
      });

      // handle particles
      this.particles.forEach((particle, index) => {
        particle.update();
      });
      // console.log(this.particles)

      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }

      // collision sprite
      this.collisions.forEach((collision, index) => {
        collision.update(deltaTime);
      });

      this.floatingMessage = this.floatingMessage.filter(
        (message) => !message.markForDeletion
      );
      this.particles = this.particles.filter(
        (particle) => !particle.markForDeletion
      );
      this.enemies = this.enemies.filter((enemy) => !enemy.markForDeletion);
      this.collisions = this.collisions.filter(
        (collision) => !collision.markForDeletion
      );
    }
    draw(ctx) {
      this.background.draw(ctx);
      this.player.draw(ctx);
      this.enemies.forEach((enemy) => {
        enemy.draw(ctx);
      });
      this.particles.forEach((particle) => {
        particle.draw(ctx);
      });
      this.collisions.forEach((collision) => {
        collision.draw(ctx);
      });
      this.floatingMessage.forEach((message) => {
        message.draw(ctx);
      });
      this.ui.draw(ctx);
    }
    addEnemy() {
      this.enemies.push(new FlyingEnemy(this));
      if (this.speed > 0 && Math.random() < 0.5)
        this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      // console.log(this.enemies);
      // console.log(this.floatingMessage.length,this.particles.length,this.collisions.length,this.enemies.length);
    }
  }
  const game = new Game(canvas.width, canvas.height);
  //   console.log(game);
  let lastTime = 0;
  function animate(timestap) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timestap - lastTime;
    lastTime = timestap;
    game.update(deltaTime);
    if (!game.gameOver) {
      requestAnimationFrame(animate);
    }
    game.draw(ctx);
  }
  animate(0);
});
