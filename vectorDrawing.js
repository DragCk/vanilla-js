const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")


canvas.width = window.innerWidth
canvas.height = window.innerHeight


const point = {x: 90 , y: 120}
const offset = {
    x: canvas.width / 2,
    y: canvas.height / 2
}
const G = {x:20, y:50}

document.onmousemove = (e) => {
    point.x = e.x - offset.x
    point.y = e.y - offset.y

    update()
}

const update = () => {
    ctx.clearRect(-offset.x, -offset.y, canvas.width, canvas.height)

    drawCoordinates()

    const {mag, dir} = toPolar(point)
    const same = toXY({mag, dir})

    const resultAdd = add(point , G)

    ctx.beginPath()
    ctx.setLineDash([3,3])
    ctx.moveTo(G.x, G.y)
    ctx.lineTo(resultAdd.x, resultAdd.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke() 
    ctx.setLineDash([])

    drawArrow({x:0, y:0}, resultAdd, "red")

    const resulSub = subtract(point, G)
    drawArrow({x:0, y:0}, resulSub, "red")
    drawArrow(G, point, "red")

    const scaleSub = scale(normalize(resulSub), 50)
    drawArrow({x:0, y:0}, scaleSub , "red")

    console.log(Math.acos(dot(normalize(G), normalize(point))))

    drawArrow({x:0, y:0},point) //from (0,0) to the point 
    drawArrow({x:0, y:0},G)
}


canvas.style.background = "darkred"


ctx.translate(offset.x, offset.y)


//convert magnitudo and direction to cartesian (x, y)
const toXY = ({mag, dir}) => {
    return{
        x:Math.cos(dir)*mag,
        y:Math.sin(dir)*mag
    }
}

//convert (x,y) coordinates to polar(mag, dir)
const toPolar =({x, y}) => {
    return {
        dir: vectorDirection({x,y}),
        mag: vectorMagnitude({x,y})
    }
}

//return angle from (0,0) to (x,y)
const vectorDirection = ({x,y}) => {
    return Math.atan2(y,x)
}

//return magnitude from (0,0) to (x,y)
const vectorMagnitude = ({x,y}) => {
    return Math.hypot(x,y)
}

const dot = (p1, p2) => {
    return p1.x * p2.x + p1.y * p2.y
}

//set the value between 0 - 1
const normalize = (p) => {
    return scale(p, 1/vectorMagnitude(p))
}

const add = (p1, p2) => {
    return {
        x: p1.x + p2.x,
        y: p1.y + p2.y
    }
}

const subtract = (p1, p2) => {
    return {
        x: p1.x - p2.x,
        y: p1.y - p2.y
    }
}

const scale = (p, scalar) => {
    return {
        x: p.x * scalar,
        y: p.y * scalar
    }
}
//draw default coornidates pass througth(0,0)
const drawCoordinates = () => {
    ctx.beginPath()
    ctx.moveTo(-offset.x, 0)
    ctx.lineTo(canvas.width-offset.x, 0)
    ctx.moveTo(0, -offset.y)
    ctx.lineTo(0, canvas.height-offset.y)
    ctx.setLineDash([5,4])
    ctx.lineWidth = 2
    ctx.strokeStyle = "white"
    ctx.stroke()
    ctx.setLineDash([])

}

//draw point
const drawPoint = (location, size = 6, color = "white") => {
    
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(location.x, location.y, size, 0, Math.PI*2)
    ctx.fill()
}

//draw Arrows
const drawArrow = (tail, tip, color="white", size=20) => {
    const {mag, dir} = toPolar(subtract(tip, tail))
    const v1 = {
        dir: dir + Math.PI/0.8,
        mag: size/2
    }
    const p1 = toXY(v1)
    const t1 = add(p1, tip)
    const v2 = {
        dir: dir - Math.PI/0.8,
        mag: size/2
    }
    const p2 = toXY(v2)
    const t2 = add(p2, tip)

    ctx.beginPath()
    ctx.moveTo(tail.x,tail.y)
    ctx.lineTo(tip.x, tip.y)
    ctx.strokeStyle=color
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(tip.x, tip.y)
    ctx.lineTo(t1.x, t1.y)
    ctx.lineTo(t2.x, t2.y)
    ctx.closePath()
    ctx.stroke()
    ctx.fillStyle= color
    ctx.fill()
}

update()