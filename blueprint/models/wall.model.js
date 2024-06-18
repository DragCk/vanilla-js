import { Utils } from "./utils.model"

export class Wall{
    constructor(start, end, color="blue"){
        this.start = { x:start.x, y:start.y }
        this.end = { x:end.x, y:end.y }
        this.color = color
        
        this.isDragging = false
        this.isHover = false
    }

    drawWall(ctx, offset, scale){
        ctx.beginPath()
        ctx.moveTo(
            Utils.toScreen(this.start.x, offset.x, scale), 
            Utils.toScreen(this.start.y, offset.y, scale))
        ctx.lineTo(
            Utils.toScreen(this.end.x, offset.x, scale), 
            Utils.toScreen(this.end.y, offset.y, scale))
        ctx.lineWidth = 5 * scale
        ctx.strokeStyle = this.color
        ctx.miterLimit = 2;
        ctx.closePath()
        ctx.stroke()
    }

    
}