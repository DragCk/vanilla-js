import { Utils } from "./utils.model"

export class Corner{
    constructor(position, color="red"){
        this.x = position.x, 
        this.y = position.y,
        this.color = color
        this.radius = 7
        this.isDragging = false
        this.isHover = false
      
    }

    #inCorner(x, y){
        const shapeLeft = this.x
        const shapeRight = this.x + this.radius
        const shapeTop = this.y
        const shapeBottom = this.y + this.radius

        if(x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom)
            return true

        return false
    }

    update(event){

        if(this.#inCorner()){

        }
    }
 

    drawCorner(ctx, offset, scale){
        ctx.beginPath()
        ctx.arc(
            Utils.toScreen(this.x, offset.x, scale), 
            Utils.toScreen(this.y, offset.y, scale),
            this.isHover ? this.radius * 1.5 * scale : this.radius * scale, 
            0, 
            Math.PI*2
        )
        ctx.fillStyle= "red"
        ctx.strokeStyle = this.isHover ? "black" : "white"
        ctx.lineWidth = 2
        ctx.fill()
        ctx.stroke()
    }
}   
