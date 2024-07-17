
import { Corner } from "./corner.model";
import { Utils } from "./utils.model";
import { Grid } from "./grid.model";
import { Wall } from "./wall.model";
import { displayBuddha } from "../blessing/buddhaBless";
export class Planner2D {

    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.canvas.style.background = "lightgray"
      // disable right clicking
      document.oncontextmenu = function () {
        return false;
      };
  
      // list of all drawing
      this.corners = []
      this.walls = []
      this.movingShape = []
      this.mainWall = null
      this.tempLine = null;
      this.prevCorner = null
      
      
      // coordinates of our cursor
      this.mousePos = {x:0, y:0}
      this.prevMousePos = {x:0, y:0}
      this.mouseOffsetWall = {sx:0, sy:0, ex:0, ey:0}

      // distance from origin
      this.offset = {x:this.canvas.width/2, y:this.canvas.height/2}

      // zoom amount
      this.scale = 1;
  
      // mouse state
      this.leftMouseDown = false;
      this.rightMouseDown = false;

      // button
      this.drawButton = document.getElementById("drawButton")
      this.editButton = document.getElementById("editButton")
      this.deleteButton = document.getElementById("deleteButton")

      // Canvas state 
      this.paningMode = false
      this.drawingMode = true
      this.editMode = false
      this.deleteMode = false
      this.isdrawingTemp = false

      this.cellsize = 50
      this.grid = new Grid(this.canvas, this.ctx, this.cellsize)

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
      this.drawButton.addEventListener('click', () => {this.onDrawButton()})
      this.editButton.addEventListener('click', () => {this.onEditButton()})
      this.deleteButton.addEventListener('click', () => {this.onDeleteButton()})

      //Windows Event Handlers
      document.addEventListener("keydown", this.onKeyDown.bind(this))
      displayBuddha()
    }

    notifyChange() {
      if (this.onChange) {
        this.onChange(this.walls, this.corners);
      }
    }

    setOnChangeCallback(callback) {
      this.onChange = callback;
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
      this.ctx.arc(
        Utils.toScreen(0, this.offset.x, this.scale), 
        Utils.toScreen(0, this.offset.y, this.scale), 
        5*this.scale, 0, 2 * Math.PI)
      this.ctx.fill()
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
        const existCorner = this.corners.find(corner => corner.mouseCheck(mousePos, this.scale))
        let newCorner
        if(!existCorner){
          newCorner = new Corner(mousePos)
          this.corners.push(newCorner)
        }
        
        //Create wall if there is a prevCorner
        if(this.prevCorner !== null && existCorner !== this.prevCorner){
          const newWall = new Wall(this.prevCorner, existCorner ? existCorner : newCorner)
          const existWall = this.walls.find(wall => wall.checkIfWallExists(newWall))
          if(!existWall){
            newWall.startVertex = this.prevCorner.cornerId
            newWall.endVertex = existCorner ? existCorner.cornerId : newCorner.cornerId
            this.walls.push(newWall)
          }
        }
        
        this.prevCorner = existCorner ? existCorner : newCorner
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
          
          this.mainWall = this.walls[wallIndex]

          this.mouseOffsetWall = {
            sx: this.mainWall.start.x - mousePos.x,
            sy: this.mainWall.start.y - mousePos.y,
            ex: this.mainWall.end.x - mousePos.x,          
            ey: this.mainWall.end.y - mousePos.y,      
          }
          
          for(let i=0 ; i<this.corners.length ; i++){
            const corner = this.corners[i]
            if(corner.x === this.mainWall.start.x && corner.y === this.mainWall.start.y ||
              corner.x === this.mainWall.end.x && corner.y === this.mainWall.end.y)
            {
              corner.isDragging = true
              this.movingShape.push(corner) 
            }
          }

          for(let i=0 ; i<this.walls.length ; i++){
            if(i === wallIndex) continue
            const wall = this.walls[i].cornerCheck(this.mainWall.start) || this.walls[i].cornerCheck(this.mainWall.end)
            if(wall) {
              this.walls[i].movingCorner = wall
              this.movingShape.push(this.walls[i])
            }
          }
        }
        return
      }

      if(this.leftMouseDown && this.deleteMode){
        
        for(let i=0 ; i<this.corners.length ; i++){
          const cornerShape = this.corners[i].mouseCheck(mousePos, this.scale)
          if(cornerShape) {
            const tempWall = []
            const tempCorners = [cornerShape]
            for(let j=0 ; j<this.walls.length ; j++){
              const wallShape = this.walls[j].cornerCheck(cornerShape)
              if(wallShape) {
                tempWall.push(this.walls[j])
                let tempC 
                if(wallShape === "start") tempC = this.walls[j].end
                if(wallShape === "end") tempC = this.walls[j].start

                const count = Utils.countOccurrences(tempC, this.walls)
                if(count <= 1) tempCorners.push(tempC)
              }
            }
            this.walls = this.walls.filter(wall => !tempWall.includes(wall));
            
            this.corners = this.corners.filter(corner => 
              !tempCorners.some(tempCorner => 
                tempCorner.x === corner.x && tempCorner.y === corner.y
              )
            );
            return
          }
        }

        const wallIndex = Utils.closestWall(mousePos, this.walls);
        if (wallIndex !== undefined) {
          const corner1 = this.walls[wallIndex].start
          const corner2 = this.walls[wallIndex].end
          this.walls.splice(wallIndex, 1);
          
          const corner1Count = Utils.countOccurrences(corner1, this.walls);
          const corner2Count = Utils.countOccurrences(corner2, this.walls);
          
          if (corner1Count < 1) {
            this.corners = this.corners.filter(corner => !(corner.x === corner1.x && corner.y === corner1.y));
          }
        
          if (corner2Count < 1) {
            this.corners = this.corners.filter(corner => !(corner.x === corner2.x && corner.y === corner2.y));
          }
        }
      }
    }
  
    onMouseMove(event) {
      //Get mouse position
      // this.mousePos = Utils.snapToGrid({
      //   x: event.pageX,
      //   y: event.pageY
      // }, this.cellsize, this.offset, this.scale )

      this.mousePos ={
        x: event.pageX,
        y: event.pageY
      } 

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

      if(this.rightMouseDown && this.paningMode) {
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
        this.walls[i].isHover = false 
      }

      this.mouseOffsetWall = {sx:0, sy:0, ex:0, ey:0}
      this.movingShape = []
      this.mainWall = null
      this.notifyChange();
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
  
      
    onDrawButton(){
      this.drawingMode = true
      this.paningMode = false
      this.editMode = false
      this.deleteMode = false
    }
    
    onEditButton(){
      this.drawingMode = false
      this.paningMode = true
      this.editMode = true
      this.deleteMode = false
    }

    onDeleteButton(){
      this.drawingMode = false
      this.editMode = false
      this.paningMode = true
      this.deleteMode = true
    }
    onKeyDown(event){
      if( event.key !== "Escape") return

      //clear temp drawing
      this.isdrawingTemp = false;
      this.tempLine = null
      this.prevCorner = null

      this.drawingMode = !this.drawingMode
      this.paningMode = !this.paningMode
      this.editMode = !this.editMode
      this.deleteMode = false
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
    
  }


  