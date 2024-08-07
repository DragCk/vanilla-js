import { Utils } from "../models2D/utils.model";

export class Room {
    constructor(corners) {
        this.carners = corners
        this.floorPlane = null
        this.interiorCorners = []
        this.area = 0
        this.areaCenter = null

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

        
    }
}