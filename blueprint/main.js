import { Floorplan } from "./models/floorplan.model"


const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const floorplan = new Floorplan(canvas, ctx)


const animate= () => {

    floorplan.draw(ctx)

    requestAnimationFrame(animate)
}

animate()