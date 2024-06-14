import { Utils } from "./utils.model"

export class Corner{
    static corners = []

    constructor(position, color="red"){
        this.x = position.x, 
        this.y = position.y,
        this.color = color
        this.size = 5
        this.isDragging = false
        
        Corner.corners.push({x:this.x, y:this.y, size:this.size})
    }


 
    static draw(ctx, offsetX, offsetY, scale){
        if(Corner.corners.length > 0){
            Corner.corners.map((c)=>{
                ctx.beginPath()
                ctx.arc(
                    Utils.toScreen(c.x, offsetX, scale), 
                    Utils.toScreen(c.y, offsetY, scale),
                    c.size * scale, 
                    0, 
                    Math.PI*2
                )
                ctx.fillStyle= "red"
                ctx.strokeStyle = "black"
                ctx.fill()
                ctx.stroke()
            })
        }
    }
}   
