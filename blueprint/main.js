import { Floorplan } from "./models/floorplan.model"
import { CanvasDrawer } from "./models/drawer"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.height = window.innerHeight
canvas.width = window.innerWidth

const drawer = new CanvasDrawer(canvas, ctx)

const animate= () => {

   
    drawer.redrawCanvas()
    requestAnimationFrame(animate)
}

animate()