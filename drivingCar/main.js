import { Car } from "./model/car"
import { NeuralNetwork } from "./model/network"
import { Road } from "./model/road"
import { Visualizer } from "./model/visualizer"

const canvas = document.getElementById("canvas")
const networkCanvas = document.getElementById("networkCanvas")

canvas.width = 200
networkCanvas.width = 300

const ctx = canvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d")

const generateCars = (N) => {
    const cars=[]
    for(let i=0 ; i<N ; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars
}


const road = new Road(canvas.width/2, canvas.width*0.9)
const N = 1000
const cars = generateCars(N)
let bestCar = cars[0]
if(localStorage.getItem("bestbrain")){
    for(let i=0 ; i<cars.length ; i++){
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestbrain")
        )
        if(i!==0){
            NeuralNetwork.mutate(cars[i].brain, 0.1)
        }
    }
    
}
const traffic = [
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
]


const save = () => {
    localStorage.setItem("bestbrain",JSON.stringify(bestCar.brain))
}

const discard = () => {
    localStorage.removeItem("bestbrain")
}

const saveButton = document.getElementById("saveButton")
const discardButton = document.getElementById("discardButton")

saveButton.addEventListener("click", () => {save()})
discardButton.addEventListener("click", () => {discard()})

const animate = (time) => {
    for(let i=0 ; i < traffic.length ; i++){
        traffic[i].update(road.borders, [])
    }
    for(let i=0 ; i < cars.length ; i++){
        cars[i].update(road.borders, traffic)
    }
    bestCar = cars.find( c => c.y === Math.min(...cars.map( c => c.y)))

    canvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    ctx.save()
    ctx.translate(0, -bestCar.y + canvas.height * 0.7)
    road.draw(ctx)
    for(let i=0 ; i < traffic.length ; i++){
        traffic[i].draw(ctx, "blue")
    }
    ctx.globalAlpha = 0.2
    for(let i=0 ; i < cars.length ; i++){
        cars[i].draw(ctx, "green")
    }
    ctx.globalAlpha = 1
    bestCar.draw(ctx, "green",true)

    ctx.restore()

    networkCtx.lineDashOffset = -time / 50
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    requestAnimationFrame(animate)
}


animate()