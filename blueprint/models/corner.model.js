class corner{
    constructor(position, color="red"){
        this.x = position.x, 
        this.y = position.y,
        this.color = color
        this.size = 5
    }


    draw(ctx){
        ctx.beginPath()
        ctx.arc(this.x, this.y, 10, 0, Math.PI*2)
        ctx.fillstroke= this.color
        ctx.stroke()
    }


}   
export default corner