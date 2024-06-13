export class Grid {
    constructor(canvas, ctx, cellSize = 40) {
      this.canvas = canvas;
      this.context = ctx;
      this.cellSize = cellSize;
  
      this.scale = 1;
      this.offsetX = 0;
      this.offsetY = 0;
  
      this.isDragging = false;
      this.lastMouseX = 0;
      this.lastMouseY = 0;
  
    }
  
    toVirtualX(xReal) {
      return (xReal - this.offsetX) * this.scale;
    }
  
    toVirtualY(yReal) {
      return (yReal - this.offsetY) * this.scale;
    }

  
  
    draw() {
      if (this.canvas && this.context) {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
      }
    }
  
    setupEvents(canvas) {
      canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
      canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
      canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
      canvas.addEventListener("mouseleave", this.onMouseUp.bind(this));
      window.addEventListener("resize", () => this.draw());
    }
  
    onMouseDown(event) {
      this.isDragging = true;
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
    }
  
    onMouseMove(event) {
      if (this.isDragging) {
        const dx = event.clientX - this.lastMouseX;
        const dy = event.clientY - this.lastMouseY;
        this.offsetX += dx / this.scale;
        this.offsetY += dy / this.scale;
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
        this.draw();
      }
    }
  
    onMouseUp() {
      this.isDragging = false;
    }
  
    drawGrid() {
      if (this.canvas && this.context) {
        this.context.strokeStyle = "rgb(229,231,235)";
        this.context.lineWidth = 1;
        this.context.font = "10px serif";
        this.context.beginPath();
  
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
  
        for (let x = (this.offsetX % this.cellSize) * this.scale; x <= width; x += this.cellSize * this.scale) {
          const source = x;
          this.context.moveTo(source, 0);
          this.context.lineTo(source, height);
          this.context.fillText(`${this.toVirtualX(source).toFixed(0)}`, source, 10);
        }
  
        for (let y = (this.offsetY % this.cellSize) * this.scale; y <= height; y += this.cellSize * this.scale) {
          const destination = y;
          this.context.moveTo(0, destination);
          this.context.lineTo(width, destination);
          this.context.fillText(`${this.toVirtualY(destination).toFixed(0)}`, 0, destination);
        }
        this.context.stroke();
      }
    }
  }
