const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")

canvas.width = window.innerWidth - 30
canvas.height = window.innerHeight - 10

canvas.style.border = "5px solid red"

const canvasWidth = canvas.width
const canvasHeight = canvas.height

let shapes = []
let currentShapeIndex = null
let isDragging = false
let startX
let startY

shapes.push({x:100, y:100, width:200, height:200, color:"red"})
shapes.push({x:0, y:0, width:100, height:100, color:"blue"})


const mouseInShape = (x, y, shape) => {
    const shapeLeft = shape.x
    const shapeRight = shape.x + shape.width
    const shapeTop = shape.y
    const shapeBottom = shape.y + shape.height

    if(x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom)
        return true

    return false
}


const mouseDown = (e) => {
    e.preventDefault()
    startX = parseInt(e.clientX)
    startY = parseInt(e.clientY)

    let index = 0
    for(let shape of shapes){
        
        if(mouseInShape(startX, startY, shape)){           
            currentShapeIndex = index
            isDragging = true
            return
        }

        index++
    }
}

const mouseUp = (e) => {
    
    if(!isDragging) return

    e.preventDefault()
    isDragging = false

}

const mouseOut = (e) => {
    
    if(!isDragging) return

    e.preventDefault()
    isDragging = false

}

const mouseMove = (e) => {
    if(!isDragging){
        return
    }
    else {
        e.preventDefault()
        const mouseX = parseInt(e.clientX)
        const mouseY = parseInt(e.clientY)

        const deltaX = mouseX - startX
        const deltaY = mouseY - startY

        const currentShape = shapes[currentShapeIndex]
        currentShape.x += deltaX
        currentShape.y += deltaY 

        drawShape()

        startX = mouseX
        startY = mouseY
    }
}



canvas.onmousedown = mouseDown
canvas.onmouseup = mouseUp
canvas.onmouseout = mouseOut
canvas.onmousemove = mouseMove


const drawShape = () => {
    context.clearRect(0, 0, canvasWidth, canvasHeight)
    for( let shape of shapes){
        console.log(shape)
        context.fillStyle = shape.color
        context.fillRect(shape.x, shape.y, shape.width, shape.height)
    }
}

drawShape()