import { Planner2D } from "./models2D/planner2D";
import { Planner3D } from "./model3D/planner3D";

export class SceneManager {
    constructor() {
        this.canvas2D = document.getElementById('canvas2d');
        this.canvas3D = document.getElementById('canvas3d');
        this.modeButton = document.getElementById('view-mode-button');
        
        this.is3DMode = false;
        this.view2D = new Planner2D(this.canvas2D);
        this.view3D = new Planner3D(this.canvas3D);

        this.view2D.setOnChangeCallback((walls) => this.view3D.updateWalls(walls));
        this.updateView();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.modeButton.addEventListener('click', () => this.toggleView());
    }

    toggleView() {
        this.is3DMode = !this.is3DMode;
        this.updateView();
        //this.modeButton.textContent = this.is3DMode ? '切換到 2D' : '切換到 3D';
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