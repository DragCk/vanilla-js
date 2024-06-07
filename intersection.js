

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")


canvas.width = window.innerWidth
canvas.height = window.innerHeight

canvas.style.background = "black"

const A = {x: 200, y: 150}
const B = {x: 150, y: 250}
const C = {x: 50, y: 100}
const D = {x: 250, y: 200}
const E = {x: 100, y: 100}
const F = {x:200, y:300}

let angle = 0
const mouse = {x:0, y:0}
document.onmousemove = (e) => {
    mouse.x = e.x
    mouse.y = e.y
}

const lerp = (A, B, t) => {
    return A+(B-A)*t
}

const drawDot = ({x,y}, text, isRed) => {
    const radius = 50
    A.x = mouse.x + Math.cos(angle) * radius
    A.y = mouse.y - Math.sin(angle) * radius
    B.x = mouse.x - Math.cos(angle) * radius
    B.y = mouse.y + Math.sin(angle) * radius
    angle += 0.002
    ctx.beginPath()
    ctx.fillStyle = isRed ? "red" : "black"
    ctx.arc(x, y, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = "bold 14px Arial"
    ctx.fillText(text, x, y)
}

const getIntersection = (A, B, C, D) => {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x-C.x)
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y)
    const bottom = (D.y - C.y) * (B.x - A.x) -(D.x- C.x) * (B.y - A.y)
 
    if(bottom!==0) {
        const t = tTop / bottom
        const u = uTop / bottom
        if( t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }
}

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.beginPath()
    ctx.moveTo(A.x, A.y)
    ctx.lineTo(B.x, B.y)
    ctx.moveTo(C.x, C.y)
    ctx.lineTo(D.x, D.y)
    ctx.moveTo(E.x, E.y)
    ctx.lineTo(F.x, F.y)
    ctx.strokeStyle ="white"
    ctx.stroke()

    drawDot(A, "A")
    drawDot(D, "D")
    drawDot(C, "C")
    drawDot(B, "B")
    drawDot(E, "E")
    drawDot(F, "F")


    const I = getIntersection(A, B, C, D)
    if(I) drawDot(I, "I")
    const J = getIntersection(A, B, E, F)
    if(J) drawDot(J, "J")

    requestAnimationFrame(animate)
}


animate()