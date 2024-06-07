export class Grid {
    constructor(canvasId, gridSpacing) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSpacing = gridSpacing;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;

        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mouseout', this.onMouseUp.bind(this));
        
        this.draw();
    }

    onMouseDown(event) {
        this.isDragging = true;
        this.startX = event.clientX - this.offsetX;
        this.startY = event.clientY - this.offsetY;
    }

    onMouseMove(event) {
        if (!this.isDragging) return;
        this.offsetX = event.clientX - this.startX;
        this.offsetY = event.clientY - this.startY;
        this.draw();
    }

    onMouseUp() {
        this.isDragging = false;
    }

    draw() {
        const { ctx, canvas, gridSpacing, offsetX, offsetY } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;

        ctx.save();
        ctx.translate(offsetX, offsetY);

        const cols = Math.ceil(canvas.width / gridSpacing);
        const rows = Math.ceil(canvas.height / gridSpacing);
        const startX = -Math.floor(offsetX / gridSpacing) * gridSpacing;
        const startY = -Math.floor(offsetY / gridSpacing) * gridSpacing;

        for (let x = startX; x <= canvas.width; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        for (let y = startY; y <= canvas.height; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        ctx.restore();
    }
}