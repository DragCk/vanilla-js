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
        this.canvas.addEventListener("mousedown", () => {console.log("mouse down")})
        this.canvas.addEventListener("mousemove", () => {console.log("mouse move")})
        this.canvas.addEventListener("mouseup", () => {console.log("mouse up")})
    }

    draw(ctx){
        
    }

}