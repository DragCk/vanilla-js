
import { Utils } from "./utils.model"

export class Corner{
    static cornerCount = 0
    constructor(position, color="red"){
        this.x = position.x
        this.y = position.y
        this.color = color
        this.radius = 7
        this.isDragging = false
        this.isHover = false
        
        this.cornerId = Corner.cornerCount
        Corner.cornerCount++
    }

    #inCorner(mousePos, scale){
        const cornerPos = {x: this.x, y: this.y}
        const distance = Utils.distance(cornerPos, mousePos)
        const radius = this.radius * scale
        if( distance < radius )
            return true

        return false
    }

    checkFollowTo(wall, offset, scale){
        const mainPoint = {
            x: Utils.toScreen(this.x, offset.x, scale),
            y: Utils.toScreen(this.y, offset.y, scale)
        }
        
        const ds = Utils.distance(mainPoint, {x:wall.sx,y:wall.sy})
        const de = Utils.distance(mainPoint, {x:wall.ex,y:wall.ey})
        
        if(ds < de){
            return true
        }else if(de < ds){
            return false
        }
        console.log("wall out of range")
    }

    mouseCheck(mousePos, scale){
        
        if(!this.#inCorner(mousePos,scale)) return

        this.isHover = !this.isHover
        this.isDragging = !this.isDragging
        
        return(this)
    }

    update(mousePos, offset, scale, mouseOffsetWall){
        const originWall = {
            sx: Utils.toScreen(Utils.toTrue(mousePos.x, offset.x, scale) + mouseOffsetWall.sx, offset.x, scale),
            sy: Utils.toScreen(Utils.toTrue(mousePos.y, offset.y, scale) + mouseOffsetWall.sy, offset.y, scale),
            ex: Utils.toScreen(Utils.toTrue(mousePos.x, offset.x, scale) + mouseOffsetWall.ex, offset.x, scale),
            ey: Utils.toScreen(Utils.toTrue(mousePos.y, offset.y, scale) + mouseOffsetWall.ey, offset.y, scale)
        }

        
        if(!this.isDragging) return
        
        if( mouseOffsetWall.sx === 0 && 
            mouseOffsetWall.sy === 0 &&    
            mouseOffsetWall.ex === 0 && 
            mouseOffsetWall.ey === 0){
            
            this.x = Utils.toTrue(mousePos.x, offset.x, scale)
            this.y = Utils.toTrue(mousePos.y, offset.y, scale)
        }else{
            const follow = this.checkFollowTo(originWall, offset, scale)
            this.x = Utils.toTrue(follow ? originWall.sx : originWall.ex, offset.x, scale)
            this.y = Utils.toTrue(follow ? originWall.sy : originWall.ey, offset.y, scale)
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
