import * as THREE from 'three'
import { Planner2D } from '../models2D/planner2D';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


export class Test3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.canvas.clientWidth / this.canvas.clientHeight, 
            0.1, 
            1000
        );
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        });
        
        this.animationId = null

        this.init();
    }

    init() {
       
        this.renderer.setSize(this.canvas.innerWidth, this.canvas.innerHeight);
        this.renderer.setClearColor("black");
        
        this.camera.position.set(0, 6, 10);
        this.camera.lookAt(this.scene.position)
        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.createObjects();
        
        
    }

    createObjects() {
        // 创建一个简单的立方体
        const geometry = new THREE.BoxGeometry(5, 5, 5);
        const material = new THREE.MeshBasicMaterial({ color: "white" });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        
    }

    

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera)
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        this.cube.rotation.x += 0.001;
        this.cube.rotation.y += 0.001;
        
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