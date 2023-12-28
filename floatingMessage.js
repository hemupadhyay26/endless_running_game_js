export class FloatingMessage {
  constructor(value, x, y, targetX, targetY) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.timer = 0;
    this.markForDeletion = false;
  }
  update() {
    this.x += (this.targetX - this.x) * 0.03;
    this.y += (this.targetY - this.y) * 0.03;
    this.timer++;
    if (this.timer > 100) this.markForDeletion = true;
  }
  draw(ctx) {
    ctx.font = "20px Helvetica";
    ctx.fillStyle = "white";
    ctx.fillText(this.value, this.x, this.y);
  }
}
