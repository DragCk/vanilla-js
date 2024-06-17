import { Utils } from "./utils.model";
export class Grid {
    constructor(canvas, ctx, cellSize = 40) {
      this.canvas = canvas;
      this.context = ctx;
      this.cellSize = cellSize;
      this.isDragging = false;

    }

    

    drawGrid(offsetX, offsetY, scale) {
      if (this.canvas && this.context) {
        this.context.strokeStyle = "rgb(229,231,235)";
        this.context.lineWidth = 1;
        this.context.font = "10px serif";
        this.context.beginPath();
  
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
  
        for (let x = (offsetX % this.cellSize) * scale; x <= width; x += this.cellSize * scale) {
          const source = x;
          this.context.moveTo(source, 0);
          this.context.lineTo(source, height);

          
          this.context.fillText(`${Utils.toVirtual(source, offsetX, scale).toFixed(0)}`, source, 10);
        }
  
        for (let y = (offsetY % this.cellSize) * scale; y <= height; y += this.cellSize * scale) {
          const destination = y;
          this.context.moveTo(0, destination);
          this.context.lineTo(width, destination);
          this.context.fillText(`${Utils.toVirtual(destination, offsetY, scale).toFixed(0)}`, 0, destination);
        }
        this.context.stroke();
        this.context.closePath()
      }
    }
  }
