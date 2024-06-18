export class Utils{

    static distance(start, end){
        const result = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
        return result
    }

    static lerp(A, B, t) {
        return A+(B-A)*t
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