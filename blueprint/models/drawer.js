
import { Corner } from "./corner.model";
import { Utils } from "./utils.model";
import { Grid } from "./grid.model";
import { Wall } from "./wall.model";
export class CanvasDrawer {
    constructor(canvas, ctx) {
      this.canvas = canvas;
      this.ctx = ctx;
  
      // disable right clicking
      document.oncontextmenu = function () {
        return false;
      };
  
      // list of all drawing
      this.corners = []
      this.walls = []
      this.tempLine = null;
      this.prevCorner = null
  
      // coordinates of our cursor
      this.cursor = {x:0, y:0}
      this.prevCursor = {x:0, y:0}

      // distance from origin
      this.offset = {x:0, y:0}

      // zoom amount
      this.scale = 1;
  
      // mouse state
      this.leftMouseDown = false;
      this.rightMouseDown = false;

      

      //Canvas state
      this.isMoving = false
      this.isdrawingTemp = false
  
      this.grid = new Grid(this.canvas, this.ctx, 50)

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

      //Windows Event Handlers
      document.addEventListener("keydown", this.onKeyDown.bind(this))
    }
  
    onKeyDown(event){
      if( event.key !== "Escape") return

      this.leftMouseDown = false;
      this.rightMouseDown = false;
      this.isdrawingTemp = false
      this.tempLine = null
      this.prevCorner = null
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

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.grid.drawGrid(this.offset, this.scale)

      for(let i=0 ; i<this.walls.length ; i++){
        this.walls[i].drawWall(this.ctx, this.offset, this.scale)
      }

      for(let i=0 ; i<this.corners.length ; i++){
        this.corners[i].drawCorner(this.ctx, this.offset, this.scale)
      }

      if(this.tempLine !== null){
        this.drawTempLine(
          Utils.toScreen(this.tempLine.x0, this.offset.x, this.scale),
          Utils.toScreen(this.tempLine.y0, this.offset.y, this.scale),
          Utils.toScreen(this.tempLine.x1, this.offset.x, this.scale),
          Utils.toScreen(this.tempLine.y1, this.offset.y, this.scale)
        );
      }
      
    }

    onMouseClick(event){
        event.preventDefault()
        
    }

    onMouseDown(event) {
      // detect left clicks
      if (event.button === 0) {
        this.leftMouseDown = true;
        this.rightMouseDown = false;
      }
      // detect right clicks
      if (event.button === 2) {
        this.rightMouseDown = true;
        this.leftMouseDown = false;
      }
  
      
      // update the cursor coordinates
      this.cursor.x = event.pageX;
      this.cursor.y = event.pageY;
      this.prevCursor.x = event.pageX;
      this.prevCursor.y = event.pageY;

      if(!this.leftMouseDown) return

      const x = Utils.toTrue(event.pageX, this.offset.x, this.scale)
      const y = Utils.toTrue(event.pageY, this.offset.y, this.scale)

      const corner = new Corner({x,y})
      this.corners.push(corner)
      if(this.prevCorner !== null){
        const wall = new Wall(this.prevCorner, corner)
        this.walls.push(wall)
      }
      this.prevCorner = corner
      this.isdrawingTemp = true
    }
  
    onMouseMove(event) {
      // get mouse position
      this.cursor.x = event.pageX;
      this.cursor.y = event.pageY;
      
      const scaledX = Utils.toTrue(this.cursor.x, this.offset.x, this.scale);
      const scaledY = Utils.toTrue(this.cursor.y, this.offset.y, this.scale);
  
      if(this.isdrawingTemp) { 
        // add the line to our drawing histsory
        this.tempLine={
          x0: this.prevCorner.x,
          y0: this.prevCorner.y,
          x1: scaledX,
          y1: scaledY
        };
      }

      if(this.rightMouseDown) {
        // move the screen
        this.offset.x += (this.cursor.x - this.prevCursor.x) / this.scale;
        this.offset.y += (this.cursor.y - this.prevCursor.y) / this.scale;
        this.redrawCanvas();
      }
      
      this.prevCursor.x = this.cursor.x;
      this.prevCursor.y = this.cursor.y;
    }
  
    onMouseUp() {
      this.leftMouseDown = false;
      this.rightMouseDown = false;
    }
  
    onMouseWheel(event) {
      const deltaY = event.deltaY;
      let scaleAmount = -deltaY / 500;
      
      this.scale = this.scale * (1 + scaleAmount);
      if(this.scale > 3){
        this.scale = 3
        scaleAmount = 0
      }else if(this.scale < 0.5){
        this.scale = 0.5
        scaleAmount = 0
      }

      // zoom the page based on where the cursor is
      const distX = event.pageX / this.canvas.clientWidth;
      const distY = event.pageY / this.canvas.clientHeight;
      
      // calculate how much we need to zoom
      const unitsZoomedX = this.trueWidth() * scaleAmount;
      const unitsZoomedY = this.trueHeight() * scaleAmount;
  
      const unitsAddLeft = unitsZoomedX * distX;
      const unitsAddTop = unitsZoomedY * distY;
  
      this.offset.x -= unitsAddLeft;
      this.offset.y -= unitsAddTop;
  
      this.redrawCanvas();
    }
  
    drawTempLine(x0, y0, x1, y1) {
      this.ctx.beginPath();
      this.ctx.moveTo(x0, y0);
      this.ctx.lineTo(x1, y1);
      this.ctx.strokeStyle = "red";
      this.ctx.lineWidth = 3 * this.scale;
      this.ctx.stroke();
      this.ctx.closePath()
    }
  }

  