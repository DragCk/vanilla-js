import { Utils } from "./utils.model"

export class Wall{
    constructor(start, end, color="blue"){
        this.start = { x:start.x, y:start.y }
        this.end = { x:end.x, y:end.y }
        this.color = color
        this.lineWidth = 3
        
        this.movingCorner = null
        this.isDragging = false
        this.isHover = false
        this.name = Math.floor(Math.random() * 100)
    }

    update(mousePos, offset, scale){
        if(!this.isDragging) return
        
        const mouseOffset = Utils.calculateRelativeDistances(mousePos, this.start)
        console.log(mouseOffset)

        if(this.movingCorner === "start"){
            this.start = { 
                x: Utils.toTrue(mousePos.x, offset.x, scale), 
                y: Utils.toTrue(mousePos.y, offset.y, scale)
            }
        }
        if(this.movingCorner === "end"){
            this.end = { 
                x: Utils.toTrue(mousePos.x, offset.x, scale), 
                y: Utils.toTrue(mousePos.y, offset.y, scale)
            }   
        }
        if(this.movingCorner === "both"){
            this.start = { 
                x: Utils.toTrue(mousePos.x, offset.x, scale) + mouseOffset.x, 
                y: Utils.toTrue(mousePos.y, offset.y, scale) + mouseOffset.y
            }
            
            console.log(`Moving line number : ${this.name}`)
        }


    }

    mouseCheck(mousePos, scale){
         if(!Utils.isPointNearLine(mousePos, this.start, this.end, this.lineWidth * scale)) return

        this.isHover = !this.isHover
        this.isDragging = !this.isDragging

        return(this)
    }
    cornerCheck(corner){

        if(this.start.x == corner.x && this.start.y == corner.y){
            this.isDragging = !this.isDragging
            return "start"
        }
        if(this.end.x == corner.x && this.end.y == corner.y) {
            this.isDragging = !this.isDragging   
            return "end"
        }
        return false
    }

    drawWall(ctx, offset, scale){
        ctx.beginPath()
        ctx.moveTo(
            Utils.toScreen(this.start.x, offset.x, scale), 
            Utils.toScreen(this.start.y, offset.y, scale))
        ctx.lineTo(
            Utils.toScreen(this.end.x, offset.x, scale), 
            Utils.toScreen(this.end.y, offset.y, scale))
        ctx.lineWidth = this.lineWidth * scale
        ctx.strokeStyle = this.isDragging ? "red" : this.color
        ctx.lineJoin = "round"
        ctx.miterLimit = 2;
        ctx.closePath()
        ctx.stroke()
    }

    
}