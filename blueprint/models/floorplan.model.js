import { Corner } from "./corner.model"
import { Grid } from "./grid.model"
export class Floorplan{
    constructor(canvas, ctx){
        this.canvas = canvas
        this.ctx = ctx
        this.cell = 50

        this.grid = new Grid(this.canvas, this.ctx, this.cell)
        
        this.init()
    }

    init(){
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.grid.setupEvents(this.canvas)
        this.#addEventListener()
    }
    
    update(){

    }

    #addEventListener(){
        // this.canvas.addEventListener("click", (e) => {this.#onmouseclick(e)})
        // this.canvas.addEventListener("mousedown", (e) => {this.grid.onMouseDown(e)})
        // this.canvas.addEventListener("mousemove", (e) => {this.grid.onMouseMove(e)})
        // this.canvas.addEventListener("mouseup", () => {this.grid.onMouseUp()})
    }


    #onmouseclick(e){
        console.log("Mouse down")
        const x = e.offsetX
        const y = e.offsetY
        new Corner({x,y})
        
    }

    #onmousedown(){
        this.grid.moving = true
        
    }

    #onmousemove(e){
        console.log(e)
        const mouseOffset = {x:e.offsetX, y: e.offsetY}
        this.grid.drawGrid(mouseOffset)
    }

    #onmouseup(){
        this.grid.moving = false
    }
    
    draw(ctx){
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.grid.drawGrid()
        Corner.draw(ctx)
        
    }
    

}