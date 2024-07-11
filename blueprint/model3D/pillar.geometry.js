
import * as THREE from 'three'
export class Pillar {
    constructor(corner, height, radius){
        this.x = corner.x
        this.y = corner.y
        this.height = height
        this.radius = radius

        this.mesh = this.setupGeometry()
    }

    setupGeometry() {
        const geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16);
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00,
            wireframe: false
        } ); 
        const cylinder = new THREE.Mesh( geometry, material ); 
        cylinder.position.set(this.x, this.height/2 , this.y); // Set the position
        return cylinder
    }
    addToScene(scene) {
        scene.add(this.mesh);
    }

    removeFromScene(scene) {
        scene.remove(this.mesh);
    }
}