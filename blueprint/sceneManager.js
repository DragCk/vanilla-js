class SceneManager {
    constructor() {
        this.canvas2D = new Canvas2D('canvas2d'); // 假設你已經有這個類
        this.threeScene = new ThreeScene('canvas3d');
        this.currentScene = 'canvas2d';

        this.init();
    }

    init() {
        window.addEventListener('resize', () => this.handleResize());
        this.canvas2D.show();
        this.threeScene.hide();
        this.threeScene.animate(); // 開始 3D 動畫循環
    }

    switchScene() {
        if (this.currentScene === 'canvas2d') {
            this.canvas2D.hide();
            this.threeScene.show();
            this.currentScene = 'canvas3d';
        } else {
            this.threeScene.hide();
            this.canvas2D.show();
            this.currentScene = 'canvas2d';
        }
    }

    handleResize() {
        this.canvas2D.resize();
        this.threeScene.resize();
    }
}