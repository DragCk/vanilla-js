export class Utils{

    static snapToGrid(point, gridsize, offset, scale){
        const grid = gridsize * scale
        return {
            x: Math.floor(point.x / grid) * grid,
            y: Math.floor(point.y / grid) * grid
        }
    }

    /**
     * Calculate the count of the number of walls around the corner
     * @param {*} corner corner to check
     * @param {array} walls arrays of walls to check
     * @returns the count of the number of walls around the corner
    */
    static countOccurrences (corner, walls){
        return walls.reduce((count, currentWall) => {
            return count + (
            (currentWall.start.x === corner.x && currentWall.start.y === corner.y) || 
            (currentWall.end.x === corner.x && currentWall.end.y === corner.y)
            ? 1 : 0);
        }, 0);
    };


    /**
     * Calculate the distance between two points
     * @param {*} start starting point
     * @param {*} end ending point
     * @returns The distance between two points
     */
    static distance(start, end){
        const result = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
        return result
    }

    /**
     * Calculate the distance between the mouse and the point
     * @param {*} mousePos Current mouse position
     * @param {*} point The point we want to calculate the distance
     * @returns return the offset of the mouse from the point
     */
    static calculateRelativeDistances(mousePos, point) {
        const mouseOffset = {
            x: mousePos.x - point.x,
            y: mousePos.y - point.y
        };
    
        return  mouseOffset;
    }

    /**
     * Calculate the distance between the mouse and the line 
     * @param {*} mousePos current mouse position
     * @param {*} start starting point of the line
     * @param {*} end end point of the line
     * @param {*} lineWidth width of the line
     * @returns Return a boolean if the mouse is near the line
     */
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

    /**
     * Caluculate the position in current screen
     * @param {*} position current position
     * @param {*} offset the offset
     * @param {*} scale window scale
     * @returns return the position in current screen
     */
    static toScreen(position, offset, scale) {
        return (position + offset) * scale;
    }
    
    /**
     * Calculate the position in true 
     * @param {*} screen current screen
     * @param {*} offset window offset
     * @param {*} scale window scale
     * @returns return the position in true scale
     */
    static toTrue(screen, offset, scale) {
        return screen / scale - offset;
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
    
    static angle = (start, end) => {
        const dotProduct = start.x * end.x + start.y * end.y
        const determinant = start.x * end.y - start.y * end.x
        const angle = -Math.atan2(determinant, dotProduct)
        return angle
    }

    static angle2pi = (start, end) => {
        let theta = this.angle(start, end)
        
        // normalize theta to be between 0 and 360 degrees
        if ( theta < 0 ) theta += 2 * Math.PI
        return theta
    }

    /**
     * Check if array of points is clockwise or not
     * @param {*} points arrays of poins contain x, y coordinates
     * @return return true if the points are clockwise
     */
    static isClockWise = (points) => {
        let tsubX = Math.min(0, Math.min.apply(null, this.map(points, function(p) { return p.x })))
        let tsubY = Math.min(0, Math.min.apply(null, this.map(points, function(p) { return p.y })))
    
        const tNewPoints = Utils.map(points, function(p) {
            return {
                x: p.x - tsubX,
                y: p.y - tsubY
            };
        });

        /**
         *  Determine whether the shape is clockwise or not
         *  if the sum are positive, the shape is clockwise
         *  otherwise the shape is counterclockwise
         *  this step used the algorithm of Gauss's shoelace area formula
         * */
        let sum = 0
        for (let i = 0; i < tNewPoints.length ; i++) {
            const p1 = tNewPoints[i]
            let p2
            if( i === tNewPoints.length - 1 ) p2 = tNewPoints[0]
            else p2 = tNewPoints[i + 1]

            sum += (p2.x - p1.x) * (p1.y + p2.y)

        }

        return (sum >= 0)
    }


    /**
     * Map an array using a function and return a new array with corner id
     * @param {*} array room array
     * @param {*} func  function that return corner id
     * @returns return new array with corner id
     */
    static map = (array, func) => {
        const result = []
        array.forEach((element) => {
            result.push(func(element))
        })
        return result
    }

    /**
     * Traverse an array and remove if the function return true
     * @param {*} array array of rooms
     * @param {*} func function to detect if the room should be removed
     * @returns return the only true rooms
     */
    static removeIf = (array, func) => {
        const result = []
        array.forEach((element) => {
            if(!func(element)) result.push(element)
        })
        return result
    }


    /**
     * Calculate the direction from (0,0) to (x,y)
     * @param {*} 2D vector
     * @returns return 0 to 360 degree
     */
    static vectorDirection = ({x,y}) => {
        return Math.atan2(y,x)
    }

    /**
     * Calculate th magnitude from (0,0) to (x,y)
     * @param {*} 2D vector 
     * @returns return the magnitude of the vector
     */
    static vectorMagnitude = ({x,y}) => {
        return Math.hypot(x,y)
    }

    /** Creates a Guide.
     * @returns A new Guide.
     */
    static guide() {
        var tS4 = function() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return tS4() + tS4() + '-' + tS4() + '-' + tS4() + '-' + tS4() + '-' + tS4() + tS4() + tS4();
    }
}