import { Car } from "./model/car"
import { Road } from "./model/road"
import { Visualizer } from "./model/visualizer"

const canvas = document.getElementById("canvas")
const networkCanvas = document.getElementById("networkCanvas")

canvas.width = 200
networkCanvas.width = 300

const ctx = canvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d")

const road = new Road(canvas.width/2, canvas.width*0.9)
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI")
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
]

const animate = (time) => {
    for(let i=0 ; i < traffic.length ; i++){
        traffic[i].update(road.borders, [])
    }
    car.update(road.borders, traffic)

    canvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    ctx.save()
    ctx.translate(0, -car.y + canvas.height * 0.7)
    road.draw(ctx)
    for(let i=0 ; i < traffic.length ; i++){
        traffic[i].draw(ctx, "blue")
    }
    car.draw(ctx, "green")
    
    ctx.restore()

    networkCtx.lineDashOffset = -time / 50
    Visualizer.drawNetwork(networkCtx, car.brain)
    requestAnimationFrame(animate)
}


animate()