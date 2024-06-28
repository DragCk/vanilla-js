
import { Planner2D } from "./models2D/planner2D"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const draggableWindow = document.getElementById('draggableWindow');
const header = document.querySelector('.window-header');
const content = draggableWindow.querySelector('.window-content');
const toggleButton = document.getElementById('toggleButton');

let isDragging = false;
let dragStartX, dragStartY;
let windowStartX, windowStartY;
let isCollapsed = false;

toggleButton.addEventListener('click', function() {
    isCollapsed = !isCollapsed;
    content.classList.toggle('collapsed', isCollapsed);
    toggleButton.textContent = isCollapsed ? '▼' : '▲';

    // 可選：調整視窗高度
    if (isCollapsed) {
        draggableWindow.style.height = header.offsetHeight + 'px';
    } else {
        draggableWindow.style.height = 'auto';
    }
});

// 視窗拖拽功能
header.addEventListener('mousedown', startDragging);
draggableWindow.addEventListener('mousemove', drag);
draggableWindow.addEventListener('mouseup', stopDragging);

function startDragging(e) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    windowStartX = draggableWindow.offsetLeft;
    windowStartY = draggableWindow.offsetTop;
    e.preventDefault(); // 防止文本選中
}

function drag(e) {
    if (!isDragging) return;
    
    let newX = windowStartX + e.clientX - dragStartX;
    let newY = windowStartY + e.clientY - dragStartY;
    
    // 確保視窗不會被拖出視窗範圍
    newX = Math.max(0, Math.min(newX, canvas.width - draggableWindow.offsetWidth));
    newY = Math.max(0, Math.min(newY, canvas.height - draggableWindow.offsetHeight));
    
    draggableWindow.style.left = newX + 'px';
    draggableWindow.style.top = newY + 'px';
}

function stopDragging() {
    isDragging = false;
}

// 防止視窗拖拽影響 canvas 事件
window.addEventListener('mousedown', (e) => e.stopPropagation());
window.addEventListener('mousemove', (e) => e.stopPropagation());
window.addEventListener('mouseup', (e) => e.stopPropagation());

canvas.height = window.innerHeight
canvas.width = window.innerWidth

const planner2D = new Planner2D(canvas, ctx)

planner2D.animate()