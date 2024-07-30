import { Utils } from "./utils.model"

export class Wall{
    static wallCount = 0
    constructor(start, end, color="blue"){
        this.start = { x:start.x, y:start.y }
        this.end = { x:end.x, y:end.y }
        this.color = color
        this.lineWidth = 3

        this.startVertex = null
        this.endVertex = null

        this.movingCorner = null
        this.isDragging = false
        this.isHover = false

        this.wallId = Utils.guide()
    }

    checkFollowTo(point, originWall, offset, scale){

        const mainPoint = {
            x: Utils.toScreen(point.x, offset.x, scale),
            y: Utils.toScreen(point.y, offset.y, scale)
        }
        const ds = Utils.distance(mainPoint, {x:originWall.sx,y:originWall.sy})
        const de = Utils.distance(mainPoint, {x:originWall.ex,y:originWall.ey})
        
        if(ds < de){
            return true
        }else if(de < ds){
            return false
        }
        console.log("wall out of range")
    }

    update(mousePos, offset, scale, mouseOffsetWall){
        if(!this.isDragging) return
        
        const originWall = {
            sx: Utils.toScreen(Utils.toTrue(mousePos.x, offset.x, scale) + mouseOffsetWall.sx, offset.x, scale),
            sy: Utils.toScreen(Utils.toTrue(mousePos.y, offset.y, scale) + mouseOffsetWall.sy, offset.y, scale),
            ex: Utils.toScreen(Utils.toTrue(mousePos.x, offset.x, scale) + mouseOffsetWall.ex, offset.x, scale),
            ey: Utils.toScreen(Utils.toTrue(mousePos.y, offset.y, scale) + mouseOffsetWall.ey, offset.y, scale)
        }


        if(this.movingCorner === "start"){
            if(mouseOffsetWall.sx === 0 && mouseOffsetWall.sy === 0){
                this.start = { 
                    x: Utils.toTrue(mousePos.x, offset.x, scale), 
                    y: Utils.toTrue(mousePos.y, offset.y, scale)
                }  
                return
            }

            const follow = this.checkFollowTo(this.start, originWall, offset, scale)
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
                return
            }
            
            const follow = this.checkFollowTo(this.end, originWall, offset, scale)
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

    checkIfWallExists(newWall){
       if(newWall.start.x === this.start.x && newWall.start.y === this.start.y && 
        newWall.end.x === this.end.x && newWall.end.y === this.end.y) return true
       if(newWall.end.x === this.start.x && newWall.end.y === this.start.y && 
        newWall.start.x === this.end.x && newWall.start.y === this.end.y) return true

       return false
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
        const distance = Utils.distance(this.start, this.end);
        const calculatePoints = {
            sx: Utils.toScreen(this.start.x, offset.x, scale),
            sy: Utils.toScreen(this.start.y, offset.y, scale),
            ex: Utils.toScreen(this.end.x, offset.x, scale),
            ey: Utils.toScreen(this.end.y, offset.y, scale)
        }
        ctx.beginPath()
        ctx.moveTo(
            calculatePoints.sx, 
            calculatePoints.sy)
        ctx.lineTo(
            calculatePoints.ex, 
            calculatePoints.ey)
        ctx.lineWidth = this.lineWidth * scale
        ctx.strokeStyle = this.isDragging ? "red" : this.color
        ctx.lineJoin = "round"
        ctx.font = `${15 * scale}px arial`;
        ctx.fillText(distance.toFixed(0), 
            (calculatePoints.sx + calculatePoints.ex) / 2, 
            (calculatePoints.sy + calculatePoints.ey) / 2);
        ctx.miterLimit = 2;
        ctx.closePath()
        ctx.stroke()
    }

    
}