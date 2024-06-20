
import { Utils } from "./utils.model"

export class Corner{
    constructor(position, color="red"){
        this.x = position.x
        this.y = position.y
        this.color = color
        this.radius = 7
        this.isDragging = false
        this.isHover = false
        this.name = Math.floor(Math.random() * 100)
    }

    #inCorner(mousePos, scale){
        const cornerPos = {x: this.x, y: this.y}
        const distance = Utils.distance(cornerPos, mousePos)
        const radius = this.radius * scale
        if( distance < radius )
            return true

        return false
    }

    mouseCheck(mousePos, scale){
        
        if(!this.#inCorner(mousePos,scale)) return

        this.isHover = !this.isHover
        this.isDragging = !this.isDragging
        
        return(this)
    }
 
    update(mousePos, offset, scale){
        if(this.isDragging){
            this.x = Utils.toTrue(mousePos.x, offset.x, scale)
            this.y = Utils.toTrue(mousePos.y, offset.y, scale)
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
