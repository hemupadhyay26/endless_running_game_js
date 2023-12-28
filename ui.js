export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Helvetica";
    this.liveImage = lives;
  }
  draw(ctx) {
    ctx.save();
    ctx.font = this.fontSize + "px " + this.fontFamily;
    ctx.textAlign = "left";
    ctx.fillStyle = this.game.fontColor;
    ctx.fillText("Score: " + this.game.score, 20, 50);
    for (let i = 0; i < this.game.lives; i++) {
      ctx.drawImage(this.liveImage, 30 * i + 20, 65, 25, 25);
    }

    if (this.game.gameOver) {
      ctx.textAlign = "center";
      ctx.fillStyle = "Red";
      ctx.font = this.fontSize * 2 + "px " + this.fontFamily;
      ctx.fillText(
        "Game Over!!! ",
        this.game.width * 0.5,
        this.game.height * 0.5 - 60
      );
      ctx.fillStyle = "red";
      ctx.font = this.fontSize +"px " + this.fontFamily;
      ctx.fillText(
        "Your Score is: " + this.game.score,
        this.game.width * 0.5,
        this.game.height * 0.5
      );
    }
    ctx.restore();
  }
}
