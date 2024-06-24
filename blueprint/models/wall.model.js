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

    checkFollowTo(point, originWall){
        const ds = Utils.distance(point, {x:originWall.sx,y:originWall.sy})
        const de = Utils.distance(point, {x:originWall.ex,y:originWall.ey})

        if(ds < de){
            return true
        }
        return  false
    }

    update(mousePos, offset, scale, mouseOffsetWall){
        if(!this.isDragging) return
        
        const originWall = {
            sx: mousePos.x + mouseOffsetWall.sx,
            sy: mousePos.y + mouseOffsetWall.sy,
            ex: mousePos.x + mouseOffsetWall.ex,
            ey: mousePos.y + mouseOffsetWall.ey
        }

        if(this.movingCorner === "start"){
            if(mouseOffsetWall.sx === 0 && mouseOffsetWall.sy === 0){
                this.start = { 
                    x: Utils.toTrue(mousePos.x, offset.x, scale), 
                    y: Utils.toTrue(mousePos.y, offset.y, scale)
                }  
            }

            const follow = this.checkFollowTo(this.start, originWall)
            this.start = { 
                x: Utils.toTrue(follow ? originWall.sx : originWall.ex, offset.x, scale), 
                y: Utils.toTrue(follow ? originWall.sy : originWall.ey, offset.y, scale)
            }  
        }

        if(this.movingCorner === "end" ){
            if(mouseOffsetWall.ex === 0 && mouseOffsetWall.ey === 0){
                this.end = { 
                    x: Utils.toTrue(mousePos.x, offset.x, scale), 
                    y: Utils.toTrue(mousePos.y, offset.y, scale)
                }   
            }

            const follow = this.checkFollowTo(this.end, originWall)
            this.end = {
                x: Utils.toTrue(follow ? originWall.sx : originWall.ex, offset.x, scale), 
                y: Utils.toTrue(follow ? originWall.sy : originWall.ey, offset.y, scale)
            }
        }
        
        if(this.movingCorner === "both"){

            this.start = { 
                x: Utils.toTrue(originWall.sx , offset.x, scale),  
                y: Utils.toTrue(originWall.sy , offset.y, scale) 
            }
            this.end = { 
                x: Utils.toTrue(originWall.ex , offset.x, scale) , 
                y: Utils.toTrue(originWall.ey , offset.y, scale)
            }   
        }

    }

    mouseCheck(mousePos, scale){
        if(!Utils.isPointNearLine(mousePos, this.start, this.end, this.lineWidth * scale)) return

        this.isHover = true
        this.isDragging = true

        return(this)
    }
    cornerCheck(corner){

        if(this.start.x == corner.x && this.start.y == corner.y){
            this.isDragging = true
            return "start"
        }
        if(this.end.x == corner.x && this.end.y == corner.y) {
            this.isDragging = true 
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