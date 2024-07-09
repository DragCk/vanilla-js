import * as THREE from 'three'
import { Planner2D } from '../models2D/planner2D';
import { Wall } from './wall.geometry.model';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


export class Planner3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.setupScene()
        this.setupCamera()
        this.setupRenderer()
        this.setOrbitControls()
        this.setupGridHelper()
        this.init();

        this.walls = []
    }

    setupScene(){
        //Scene Setup
        this.scene = new THREE.Scene();        
    }

    setupCamera(){
        //Camera Setup
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.canvas.clientWidth / this.canvas.clientHeight, 
            0.1, 
            10000
        );
        this.camera.position.set(0, 600, 600);
        this.camera.lookAt(this.scene.position)
    }

    setupRenderer(){
        //Renderer Setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        });
        this.renderer.setSize(this.canvas.innerWidth, this.canvas.innerHeight);
        this.renderer.setClearColor("black");
    }

    setOrbitControls(){
        // OrbitControls setup
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxPolarAngle = Math.PI * 0.5
        this.controls.enablePan = false
        this.controls.rotateSpeed = 0.5
    }

    setupGridHelper(){
        // GridHelper setup
        const gridSize = 5000; // Size of the grid in scene units
        const divisions = gridSize / 50; // Number of divisions to make each cell ~50px
        this.gridHelper = new THREE.GridHelper(gridSize, divisions);
        this.scene.add(this.gridHelper);
    }

    init() {
        this.onWindowResize()
        window.addEventListener('resize', () => this.onWindowResize());
        
    }

    updateWalls(walls2d) {
        // Remove all existing walls from the scen
        console.log(walls2d)
        this.walls.forEach(wall => wall.removeFromScene(this.scene));
        this.walls = [];
    
        // Create new walls based on the wallArray
        walls2d.forEach(wall => {
          const { start, end } = wall;
          const height = 200; // Default height, can be customized
          const depth = 10; // Default depth, can be customized
          const wallObject = new Wall(start, end, height, depth);
          wallObject.addToScene(this.scene);
          this.walls.push(wallObject);
        });
      }

    clearScene() {
        // Remove all objects except the grid helper
        this.scene.children = this.scene.children.filter(child => child === this.gridHelper);
      
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Update controls
        this.controls.update();
        
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.animate()
    }

    stop() {
        if(this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null
        }
    }
}