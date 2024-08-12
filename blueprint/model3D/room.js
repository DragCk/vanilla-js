import { Utils } from "../models2D/utils.model";

export class Room {
    constructor(corners) {
        this.corners = corners
        this.floorPlane = null
        this.interiorCorners = []
        this.area = 0
        this.areaCenter = null
        this.walls = null

        this.updateWalls()
        this.generateFloorPlane()
    }

    generateFloorPlane() {

    }

    getArea(){

    }

    updateWalls(){
        let prevEdge = null
        let firstedge = null 

        this.walls = []

        for(let i = 0; i < this.corners.length; i++){

        let firstCorner =  this.corners[i]
        let secondCorner = this.corners[(i + 1) % this.corners.length]

        
        }

    }
}