
import { Corner } from "./corner.model";
import { Utils } from "./utils.model";
import { Grid } from "./grid.model";
import { Wall } from "./wall.model";
import { displayBuddha } from "../blessing/buddhaBless";
export class Planner2D {

    static corners = []
    static walls = []
    
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.canvas.style.background = "lightgray"
      // disable right clicking
      document.oncontextmenu = function () {
        return false;
      };
  
      // list of all drawing
      
      this.movingShape = []
      this.mainWall = null
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

      //button
      this.drawButton = document.getElementById("drawButton")
      this.editButton = document.getElementById("editButton")
      this.deleteButton = document.getElementById("deleteButton")

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

      //Button Event Handlers
      this.drawButton.addEventListener('click', () => {console.log("DrawButton clicked")})
      this.editButton.addEventListener('click', () => {console.log("EditButton clicked")})
      this.deleteButton.addEventListener('click', () => {console.log("DeleteButton clicked")})
      //Windows Event Handlers
      document.addEventListener("keydown", this.onKeyDown.bind(this))
      displayBuddha()
    }
  
    onDrawButton(){
      this.drawingMode = !this.drawingMode
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
      for(let i=0 ; i<Planner2D.walls.length ; i++){
        Planner2D.walls[i].drawWall(this.ctx, this.offset, this.scale)
      }

      //Drawing Corners
      for(let i=0 ; i<Planner2D.corners.length ; i++){
        Planner2D.corners[i].drawCorner(this.ctx, this.offset, this.scale)
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
        //if mousePos already in corner array, 
        const existCorner = Planner2D.corners.find(corner => corner.mouseCheck(mousePos, this.scale))
        let newCorner
        if(!existCorner){
          newCorner = new Corner(mousePos)
          Planner2D.corners.push(newCorner)
        }

        //Create wall if there is a prevCorner
        if(this.prevCorner !== null){
          const newWall = new Wall(this.prevCorner, existCorner ? existCorner : newCorner)
          const existWall = Planner2D.walls.find(wall => wall.checkIfWallExists(newWall))
          if(!existWall)  Planner2D.walls.push(newWall)
        }
        
        this.prevCorner = existCorner ? existCorner : newCorner
        this.isdrawingTemp = true 
      }


      //EditMode
      if(this.leftMouseDown && this.editMode){
      if(this.movingShape.length > 0) this.movingShape = []

        //Check if is in any corner
        for(let i=0 ; i<Planner2D.corners.length ; i++){
          const cornerShape = Planner2D.corners[i].mouseCheck(mousePos, this.scale)
          if(cornerShape) {
            this.movingShape.push(cornerShape)
            for(let j=0 ; j<Planner2D.walls.length ; j++){
              const wallShape = Planner2D.walls[j].cornerCheck(cornerShape)
              if(wallShape) {
                Planner2D.walls[j].movingCorner = wallShape
                this.movingShape.push(Planner2D.walls[j])
              }
            }
            return
          }
        }
        
        //Check if is in any wall
        const wallIndex = Utils.closestWall(mousePos, Planner2D.walls);
        if (wallIndex !== undefined) {
          Planner2D.walls[wallIndex].isDragging = true
          Planner2D.walls[wallIndex].movingCorner = "both";
          this.movingShape.push(Planner2D.walls[wallIndex]);
          
          this.mainWall = Planner2D.walls[wallIndex]

          this.mouseOffsetWall = {
            sx: this.mainWall.start.x - mousePos.x,
            sy: this.mainWall.start.y - mousePos.y,
            ex: this.mainWall.end.x - mousePos.x,          
            ey: this.mainWall.end.y - mousePos.y,      
          }
          
          for(let i=0 ; i<Planner2D.corners.length ; i++){
            const corner = Planner2D.corners[i]
            if(corner.x === this.mainWall.start.x && corner.y === this.mainWall.start.y ||
              corner.x === this.mainWall.end.x && corner.y === this.mainWall.end.y)
            {
              corner.isDragging = true
              this.movingShape.push(corner) 
            }
          }

          for(let i=0 ; i<Planner2D.walls.length ; i++){
            if(i === wallIndex) continue
            const wall = Planner2D.walls[i].cornerCheck(this.mainWall.start) || Planner2D.walls[i].cornerCheck(this.mainWall.end)
            if(wall) {
              Planner2D.walls[i].movingCorner = wall
              this.movingShape.push(Planner2D.walls[i])
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
      


      for(let i=0 ; i<Planner2D.corners.length ; i++){
        Planner2D.corners[i].isDragging = false
        Planner2D.corners[i].isHover = false
      }

      for(let i=0 ; i<Planner2D.walls.length ; i++){
        Planner2D.walls[i].isDragging = false 
        Planner2D.walls[i].isHover = false 
      }

      this.mouseOffsetWall = {sx:0, sy:0, ex:0, ey:0}
      this.movingShape = []
      this.mainWall = null
      
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
  
    animate() {
      requestAnimationFrame(this.animate.bind(this));
      this.redrawCanvas();
    }

    start(){
      this.animate()
    }
    stop(){
      cancelAnimationFrame(this.animate.bind(this));
    }
    drawTempLine(x0, y0, x1, y1) {
      const distance = Utils.distance({x: x0, y: y0}, {x: x1, y: y1});
      this.ctx.beginPath();
      this.ctx.moveTo(x0, y0);
      this.ctx.lineTo(x1, y1);
      this.ctx.strokeStyle = "red";
      this.ctx.lineWidth = 3 * this.scale;
      this.ctx.font = `${15 * this.scale}px arial`;
      this.ctx.fillText(distance.toFixed(0), (x0 + x1) / 2, (y0 + y1) / 2);
      this.ctx.stroke();
      this.ctx.closePath()
    }
  }


  