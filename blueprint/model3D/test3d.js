import * as THREE from 'three'
import { Planner2D } from '../models2D/planner2D';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


export class Test3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.setupScene()
        this.init();
    }

    setupScene(){
        //Scene Setup
        this.scene = new THREE.Scene();

        //Camera Setup
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.canvas.clientWidth / this.canvas.clientHeight, 
            0.1, 
            10000
        );
        this.camera.position.set(0, 600, 600);
        this.camera.lookAt(this.scene.position)

        //Renderer Setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        });
        this.renderer.setSize(this.canvas.innerWidth, this.canvas.innerHeight);
        this.renderer.setClearColor("black");
    
        // OrbitControls setup
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxPolarAngle = Math.PI * 0.5
        this.controls.enablePan = false
        this.controls.rotateSpeed = 0.5


        // GridHelper setup
        const gridSize = 1000; // Size of the grid in scene units
        const divisions = gridSize / 50; // Number of divisions to make each cell ~50px
        this.gridHelper = new THREE.GridHelper(gridSize, divisions);
        this.scene.add(this.gridHelper);

        this.onWindowResize()
        
    }
    init() {
        window.addEventListener('resize', () => this.onWindowResize());

        this.createObjects();
    }

    createObjects() {
        // Create cube
        const geometry = new THREE.BoxGeometry(200, 200, 200);
        const material = new THREE.MeshBasicMaterial({ color: "#f6ff33" });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube); 
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

        this.cube.rotation.x += 0.001;
        this.cube.rotation.y += 0.001;

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