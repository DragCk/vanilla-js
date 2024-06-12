import { Corner } from "./corner.model"
export class Floorplan{
    constructor(canvas, ctx){
        this.canvas = canvas
        this.ctx = ctx
        this.cell = 50
        
        this.init()
    }

    init(){
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.#addEventListener()
    }
    
    update(){

    }

    #addEventListener(){
        this.canvas.addEventListener("mousedown", (e) => {this.#onmousedown(e)})
        this.canvas.addEventListener("mousemove", () => {console.log("mouse move")})
        this.canvas.addEventListener("mouseup", () => {console.log("mouse up")})
    }


    #onmousedown(e){
        console.log("Mouse down")
        const x = e.offsetX
        const y = e.offsetY
        new Corner({x,y})
        
    }
    draw(ctx){
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        Corner.draw(ctx)
    }

}