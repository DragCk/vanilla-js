let canvas = document.getElementById("canvas")

let context = canvas.getContext("2d")

const windowH = window.innerHeight
const windowW = window.innerWidth

canvas.style.background = "#ff8"
canvas.height = windowH
canvas.width = windowW

class Circle {
  constructor(x, y, radius, color){
      this.x = x
      this.y = y 
      this.radius = radius
      this.color = color
  }

  draw(context){
    context.beginPath()
    context.strokeStyle = "gray"
    context.lineWidth = 5
    context.fillStyle = this.color
    context.arc(this.x, this.y, this.radius, 0 ,Math.PI * 2, false)
    context.fill()
    context.stroke()
    context.closePath()
  }
  
  clickCircle(x, y){
    const distance = Math.sqrt(((x - this.x) * (x - this.x) ) + ((y- this.y) * (y- this.y)))
    if (distance < this.radius) console.log("inside circle")
  }

  update(){
    this.draw(context)

    if((this.x + this.radius) > windowW || (this.x - this.radius) < 0) this.directionX = -this.direction

    if((this.y + this.radius) > windowH || (this.y - this.radius) < 0) this.directionY = -this.directionY

    this.x += this.directionX
    this.y += this.directionY
  }
}


class Wall {
  constructor(startX, startY, endX, endY){
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY =endY
  }

  draw(context){
    context.beginPath()
    context.moveTo(this.startX, this.startY)
    context.lineTo(this.endX, this.endY)
    context.stroke()
    context.closePath()
  }
}

const all_circle = []
const walls = []
let lastPoint = null

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  

  const corner = new Circle(x,y,10,"red")
  all_circle.push(corner)

  let wall

  if (!lastPoint) wall = new Wall(0, 0, x ,y)
  else wall = new Wall(lastPoint.x, lastPoint.y, x, y)

  lastPoint = corner
  
  walls.push(wall)
  
})

const update = () => {
  requestAnimationFrame(update)
 
  all_circle.forEach((circle) => circle.draw(context))
  walls.forEach((wall) => wall.draw(context))
}

update()