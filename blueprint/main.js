import { Floorplan } from "./models/floorplan.model"
import { CanvasDrawer } from "./models/drawer"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const floorplan = new Floorplan(canvas, ctx)
const drawer = new CanvasDrawer(canvas, ctx)

const animate= () => {

    //floorplan.draw(ctx)
    drawer.redrawCanvas()
    requestAnimationFrame(animate)
}

animate()