import * as THREE from 'three'
import { Utils } from '../models2D/utils.model';
export class Wall {
    constructor(start, end, height, depth, color = 0xffffff) {
        const vector = {
            x: end.x - start.x,
            y: end.y - start.y
        }
        const width = Utils.vectorMagnitude(vector);
        const angle = Utils.vectorDirection(vector);
    
        this.geometry = new THREE.BufferGeometry();
    
        // Vertices
        const vertices = new Float32Array([
          // Front face
          0, 0, depth / 2,
          width, 0, depth / 2,
          width, height, depth / 2,
          0, height, depth / 2,
    
          // Back face
          0, 0, -depth / 2,
          width, 0, -depth / 2,
          width, height, -depth / 2,
          0, height, -depth / 2
        ]);
    
    
        // Faces (triangles)
        const indices = [
          // Front face
          0, 1, 2,
          2, 3, 0,
    
          // Back face
          4, 5, 6,
          6, 7, 4,
    
          // Top face
          3, 2, 6,
          6, 7, 3,
    
          // Bottom face
          1, 0, 4,
          4, 5, 1,
    
          // Right face
          1, 5, 6,
          6, 2, 1,
    
          // Left face
          0, 3, 7,
          7, 4, 0
        ];
    
        // Create the geometry
        this.geometry.setIndex(indices);
        this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.geometry.computeVertexNormals();
    
        // Material
        this.material = new THREE.MeshBasicMaterial({ color, wireframe: true });
    
        // Mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(start.x, 0, start.y);
        this.mesh.rotation.y = -angle; // Rotate to align with the line between start and end
      }
    
      addToScene(scene) {
        scene.add(this.mesh);
      }
    
      removeFromScene(scene) {
        scene.remove(this.mesh);
      }
}