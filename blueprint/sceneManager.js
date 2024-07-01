import { Planner2D } from "./models2D/planner2D";


export class SceneManager {
    constructor() {
        this.canvas2D = document.getElementById('canvas2d');
        this.canvas3D = document.getElementById('canvas3d');
        this.toggleButton = document.getElementById('toggleButton');
        
        this.is3DMode = false;
        this.view2D = new Planner2D(this.canvas2D);
        this.view3D = new Canvas3DView(this.canvas3D);
        
        this.setupEventListeners();
        this.updateView();
    }

    setupEventListeners() {
        this.toggleButton.addEventListener('click', () => this.toggleView());
    }

    toggleView() {
        this.is3DMode = !this.is3DMode;
        this.updateView();
        this.toggleButton.textContent = this.is3DMode ? '切換到 2D' : '切換到 3D';
    }

    updateView() {
        if (this.is3DMode) {
            this.canvas2D.classList.remove('active');
            this.canvas3D.classList.add('active');
            this.view3D.start();
            this.view2D.stop();
        } else {
            this.canvas3D.classList.remove('active');
            this.canvas2D.classList.add('active');
            this.view2D.start();
            this.view3D.stop();
        }
    }
}