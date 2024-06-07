import { Floorplan } from "./models/floorplan.model"
import { Grid } from "./models/grid"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const floorplan = new Floorplan(ctx)


function animate(){
    
  
    
    requestAnimationFrame(animate)
}

animate()