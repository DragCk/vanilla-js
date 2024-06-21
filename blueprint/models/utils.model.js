export class Utils{

    static distance(start, end){
        const result = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
        return result
    }

    static calculateRelativeDistances(mousePos, point) {
        const mouseOffset = {
            x: mousePos.x - point.x,
            y: mousePos.y - point.y
        };
    
        return  mouseOffset;
    }
    static isPointNearLine(mousePos, start, end, lineWidth) {
        // 计算点到线段的距离
        const numerator = Math.abs((end.y - start.y) * mousePos.x - (end.x - start.x) * mousePos.y + end.x * start.y - end.y * start.x);
        const denominator = Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2));
        const distance = numerator / denominator;
    
        // 如果距离小于等于线段宽度的一半，则认为点在线段上
        return distance <= (lineWidth / 2);
    }
    
    static lerp(A, B, t) {
        return A+(B-A)*t
    }

    static closestWall(mousePos, walls) {
        let dist = 20;
        let index, pt;
        for (let i = 0; i < walls.length; i++) {
          //
          let xy = this.closestXY(walls[i], mousePos);
          //
          let dx = mousePos.x - xy.x;
          let dy = mousePos.y - xy.y;
          let thisDist = dx * dx + dy * dy;
          if (thisDist < dist) {
            dist = thisDist;
            pt = xy;
            index = i;
          }
        }
        

        return index;
    }


    static closestXY(wall, mousePos) {
        let x0 = wall.start.x;
        let y0 = wall.start.y;
        let x1 = wall.end.x
        let y1 = wall.end.y;
        let dx = x1 - x0;
        let dy = y1 - y0;
        let t = ((mousePos.x - x0) * dx + (mousePos.y - y0) * dy) / (dx * dx + dy * dy);
        t = Math.max(0, Math.min(1, t));
        let x = this.lerp(x0, x1, t);
        let y = this.lerp(y0, y1, t);
        return ({ x: x, y: y });
      }

    static toScreen(position, offset, scale) {
        return (position + offset) * scale;
    }
    
    static toTrue(screen, offset, scale) {
        return screen / scale - offset;
    }

    static toVirtual(real, offset, scale = 1) {
        return (real - offset) * scale;
    }
    
    static toPolar =({x, y}) => {
        return {
            dir: this.vectorDirection({x,y}),
            mag: this.vectorMagnitude({x,y})
        }
    }

    static add = (p1, p2) => {
        return {
            x: p1.x + p2.x,
            y: p1.y + p2.y
        }
    }
    
    static subtract = (p1, p2) => {
        return {
            x: p1.x - p2.x,
            y: p1.y - p2.y
        }
    }
    
    //return angle from (0,0) to (x,y)
    vectorDirection = ({x,y}) => {
        return Math.atan2(y,x)
    }

    //return magnitude from (0,0) to (x,y)
    vectorMagnitude = ({x,y}) => {
        return Math.hypot(x,y)
    }
}