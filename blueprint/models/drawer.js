
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
      this.movingShape = []
      this.tempLine = null;
      this.prevCorner = null
      
  
      // coordinates of our cursor
      this.mousePos = {x:0, y:0}
      this.prevMousePos = {x:0, y:0}
      this.mouseOffsetWall = {sx:0, sy:0, ex:0, ey:0}

      // distance from origin
     
      this.offset = {x:0, y:0}

      // zoom amount
      this.scale = 1;
  
      // mouse state
      this.leftMouseDown = false;
      this.rightMouseDown = false;

      //Canvas state 
      this.movingMode = false
      this.drawingMode = true
      this.editMode = false
      this.isDraggingShape = false
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

      //clear temp drawing
      this.isdrawingTemp = false;
      this.tempLine = null
      this.prevCorner = null

      //Switch mode
      this.movingMode = !this.movingMode
      this.drawingMode = !this.drawingMode
      this.editMode = !this.editMode
      
    }

    trueHeight() {
      return this.canvas.clientHeight / this.scale;
    }
  
    trueWidth() {
      return this.canvas.clientWidth / this.scale;
    }
  
    redrawCanvas() {
      //Set the canvas to the size of the window
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      //Drawing grid
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.grid.drawGrid(this.offset, this.scale)

      //Drawing Walls
      for(let i=0 ; i<this.walls.length ; i++){
        this.walls[i].drawWall(this.ctx, this.offset, this.scale)
      }

      //Drawing Corners
      for(let i=0 ; i<this.corners.length ; i++){
        this.corners[i].drawCorner(this.ctx, this.offset, this.scale)
      }

      //Drawing TempLine
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
        event.stopPropagation()
    }

    onMouseDown(event) {
      //Detect left clicks
      if (event.button === 0) {
        this.leftMouseDown = true;
        this.rightMouseDown = false;
      }
      
      //Detect right clicks
      if (event.button === 2) {
        this.rightMouseDown = true;
        this.leftMouseDown = false;
      }
  
      //Update the cursor coordinates
      this.mousePos.x = event.pageX;
      this.mousePos.y = event.pageY;
      this.prevMousePos.x = event.pageX;
      this.prevMousePos.y = event.pageY;

      const mousePos = {
        x: Utils.toTrue(event.pageX, this.offset.x, this.scale),
        y: Utils.toTrue(event.pageY, this.offset.y, this.scale)
      }

      //Create Corner if in condition  
      if(this.leftMouseDown && this.drawingMode){
        const corner = new Corner(mousePos)
        this.corners.push(corner)
        if(this.prevCorner !== null){
          const wall = new Wall(this.prevCorner, corner)
          this.walls.push(wall)
        }
        this.prevCorner = corner
        this.isdrawingTemp = true
      }


      //EditMode
      if(this.leftMouseDown && this.editMode){
      if(this.movingShape.length > 0) this.movingShape = []

        //Check if is in any corner
        for(let i=0 ; i<this.corners.length ; i++){
          const cornerShape = this.corners[i].mouseCheck(mousePos, this.scale)
          if(cornerShape) {
            this.movingShape.push(cornerShape)
            for(let j=0 ; j<this.walls.length ; j++){
              const wallShape = this.walls[j].cornerCheck(cornerShape)
              if(wallShape) {
                this.walls[j].movingCorner = wallShape
                this.movingShape.push(this.walls[j])
              }
            }
            return
          }
        }
        
        //Check if is in any wall
        const wallIndex = Utils.closestWall(mousePos, this.walls);
        if (wallIndex !== undefined) {
          this.walls[wallIndex].isDragging = true
          this.walls[wallIndex].movingCorner = "both";
          this.movingShape.push(this.walls[wallIndex]);

          const mainWall = this.walls[wallIndex]
          
          this.mouseOffsetWall = {
            sx: mainWall.start.x - mousePos.x,
            sy: mainWall.start.y - mousePos.y,
            ex: mainWall.end.x - mousePos.x,
            ey: mainWall.end.y - mousePos.y
          }
          
          for(let i=0 ; i<this.corners.length ; i++){
            const corner = this.corners[i]
            if(corner.x === mainWall.start.x && corner.y === mainWall.start.y ||
              corner.x === mainWall.end.x && corner.y === mainWall.end.y)
            {
              corner.isDragging = true
              this.movingShape.push(corner) 
            }
          }

          for(let i=0 ; i<this.walls.length ; i++){
            if(i === wallIndex) continue
            const wall = this.walls[i].cornerCheck(mainWall.start) || this.walls[i].cornerCheck(mainWall.end)
            if(wall) {
              this.walls[i].movingCorner = wall
              this.movingShape.push(this.walls[i])
            }
          }
        }
      }
    }
  
    onMouseMove(event) {
      //Get mouse position
      this.mousePos.x = event.pageX;
      this.mousePos.y = event.pageY;
      
      if(this.movingShape.length > 0) {
        for(let i=0 ; i<this.movingShape.length ; i++){
          this.movingShape[i].update(this.mousePos, this.offset, this.scale, this.mouseOffsetWall)
        }
      }

      const scaledX = Utils.toTrue(this.mousePos.x, this.offset.x, this.scale);
      const scaledY = Utils.toTrue(this.mousePos.y, this.offset.y, this.scale);
    
      //Add tempLine
      if(this.drawingMode && this.isdrawingTemp) { 
        this.tempLine={
          x0: this.prevCorner.x,
          y0: this.prevCorner.y,
          x1: scaledX,
          y1: scaledY
        };
      }

      if(this.rightMouseDown && this.movingMode) {
        // move the screen
        this.offset.x += (this.mousePos.x - this.prevMousePos.x) / this.scale;
        this.offset.y += (this.mousePos.y - this.prevMousePos.y) / this.scale;
        this.redrawCanvas();
      }
      
      this.prevMousePos.x = this.mousePos.x;
      this.prevMousePos.y = this.mousePos.y;
    }
  
    onMouseUp() {
      this.leftMouseDown = false;
      this.rightMouseDown = false;
      
      for(let i=0 ; i<this.corners.length ; i++){
        this.corners[i].isDragging = false
        this.corners[i].isHover = false
      }

      for(let i=0 ; i<this.walls.length ; i++){
        this.walls[i].isDragging = false 
      }

      this.mouseOffsetWall = {sx:0, sy:0, ex:0, ey:0}
      this.movingShape = []
    }
  
    onMouseWheel(event) {
      const deltaY = event.deltaY;
      let scaleAmount = -deltaY / 1000;
      
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


  