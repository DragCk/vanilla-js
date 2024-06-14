
import { Corner } from "./corner.model";
import { Utils } from "./utils.model";
import { Grid } from "./grid.model";
export class CanvasDrawer {
    constructor(canvas, ctx) {
      this.canvas = canvas;
      this.context = ctx;
  
      // disable right clicking
      document.oncontextmenu = function () {
        return false;
      };
  
      // list of all strokes drawn
      this.drawings = [];
  
      // coordinates of our cursor
      this.cursorX = 0;
      this.cursorY = 0;
      this.prevCursorX = 0;
      this.prevCursorY = 0;
  
      // distance from origin
      this.offsetX = 0;
      this.offsetY = 0;
  
      // zoom amount
      this.scale = 1;
  
      // mouse state
      this.leftMouseDown = false;
      this.rightMouseDown = false;
  
      this.grid = new Grid(this.canvas, this.context)

      this.init();
    }
  
    init() {
      this.redrawCanvas();
      window.addEventListener("resize", this.redrawCanvas.bind(this));
  
      // Mouse Event Handlers
      this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
      this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
      this.canvas.addEventListener("mouseout", this.onMouseUp.bind(this));
      this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
      this.canvas.addEventListener("wheel", this.onMouseWheel.bind(this));
      this.canvas.addEventListener("click", this.onMouseClick.bind(this))
    }
  
    trueHeight() {
      return this.canvas.clientHeight / this.scale;
    }
  
    trueWidth() {
      return this.canvas.clientWidth / this.scale;
    }
  
    redrawCanvas() {
      // set the canvas to the size of the window
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
  
      this.grid.drawGrid(this.offsetX, this.offsetY, this.scale)
    
      for (let i = 0; i < this.drawings.length; i++) {
        const line = this.drawings[i];
        this.drawLine(
          Utils.toScreen(line.x0, this.offsetX, this.scale),
          Utils.toScreen(line.y0, this.offsetY, this.scale),
          Utils.toScreen(line.x1, this.offsetX, this.scale),
          Utils.toScreen(line.y1, this.offsetY, this.scale)
        );
      }
      Corner.draw(this.context, this.offsetX, this.offsetY, this.scale)
    }
  
    onMouseClick(event){
        
        const x = Utils.toTrue(event.pageX, this.offsetX, this.scale)
        const y = Utils.toTrue(event.pageY, this.offsetY, this.scale)

        new Corner({x,y})
    }

    onMouseDown(event) {
      // detect left clicks
      if (event.button == 0) {
        this.leftMouseDown = true;
        this.rightMouseDown = false;
      }
      // detect right clicks
      if (event.button == 2) {
        this.rightMouseDown = true;
        this.leftMouseDown = false;
      }
  
      // update the cursor coordinates
      console.log(event.pageX, event.pageY)
      this.cursorX = event.pageX;
      this.cursorY = event.pageY;
      this.prevCursorX = event.pageX;
      this.prevCursorY = event.pageY;
    }
  
    onMouseMove(event) {
      // get mouse position
      this.cursorX = event.pageX;
      this.cursorY = event.pageY;

      const scaledX = Utils.toTrue(this.cursorX, this.offsetX, this.scale);
      const scaledY = Utils.toTrue(this.cursorY, this.offsetY, this.scale);
      const prevScaledX = Utils.toTrue(this.prevCursorX, this.offsetX, this.scale);
      const prevScaledY = Utils.toTrue(this.prevCursorY, this.offsetY, this.scale);
  
      
      if (this.leftMouseDown) { 
        // add the line to our drawing history
        this.drawings.push({
          x0: prevScaledX,
          y0: prevScaledY,
          x1: scaledX,
          y1: scaledY,
        });
        // draw a line
        this.drawLine(this.prevCursorX, this.prevCursorY, this.cursorX, this.cursorY);
      }
      if (this.rightMouseDown) {
        // move the screen
        this.offsetX += (this.cursorX - this.prevCursorX) / this.scale;
        this.offsetY += (this.cursorY - this.prevCursorY) / this.scale;
        this.redrawCanvas();
      }
      this.prevCursorX = this.cursorX;
      this.prevCursorY = this.cursorY;
    }
  
    onMouseUp() {
      this.leftMouseDown = false;
      this.rightMouseDown = false;
    }
  
    onMouseWheel(event) {
        console.log(event)
      const deltaY = event.deltaY;
      const scaleAmount = -deltaY / 500;
      this.scale = this.scale * (1 + scaleAmount);
  
      // zoom the page based on where the cursor is
      const distX = event.pageX / this.canvas.clientWidth;
      const distY = event.pageY / this.canvas.clientHeight;
  
      // calculate how much we need to zoom
      const unitsZoomedX = this.trueWidth() * scaleAmount;
      const unitsZoomedY = this.trueHeight() * scaleAmount;
  
      const unitsAddLeft = unitsZoomedX * distX;
      const unitsAddTop = unitsZoomedY * distY;
  
      this.offsetX -= unitsAddLeft;
      this.offsetY -= unitsAddTop;
  
      this.redrawCanvas();
    }
  
    drawLine(x0, y0, x1, y1) {
      this.context.beginPath();
      this.context.moveTo(x0, y0);
      this.context.lineTo(x1, y1);
      this.context.strokeStyle = "#000";
      this.context.lineWidth = 2;
      this.context.stroke();
      this.context.closePath()
    }
  
 
  }

  