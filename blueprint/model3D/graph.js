import { Vector2 } from "three";
import { Utils } from "../models2D/utils.model";

export class Graph {
   constructor() {
       this.adjacencyList = new Map();
   } 

   addVertex(vertex) {
        
       if(!this.adjacencyList.has(vertex)) this.adjacencyList.set(vertex, []);
   }

   addEdge(wall) {
        const vertex1 = wall.startVertex;
        const vertex2 = wall.endVertex;
        
        if(!this.adjacencyList.has(vertex1) || !this.adjacencyList.has(vertex2)) return 

        this.adjacencyList.get(vertex1).push(vertex2)
        this.adjacencyList.get(vertex2).push(vertex1)
   }

    findRooms() {
        const calculateTheta = (previousCorner, currentCorner, nextCorner) => {
            const theta = Utils.angle2pi(
                new Vector2(previousCorner.x - currentCorner.x, previousCorner.y - currentCorner.y), 
                new Vector2(nextCorner.x - currentCorner.x, nextCorner.y - currentCorner.y)
            );
            return theta;
        };

        const removeDuplicateRooms = (roomArrays) => {
            const result = []
            const temp = new Set()
            const hashFunc = (corner) => {
                return corner.id
            }

            roomArrays.forEach((room) => {
                let addToResult = true
                const str = Utils.map(room, hashFunc).sort((a,b) => a - b).join("-")
                if(temp.has(str)) {
                    addToResult = false
                }

                if(addToResult) {
                    result.push(room)
                    temp.add(str)
                }
            })

            return result
        }

        const _findTightestRoom = (firstCorner, secondCorner) => {
            const stack = [];
            const initialState = { corner: secondCorner, previousCorners: [firstCorner] };
            const visited = new Set();
            
            visited.add(firstCorner.id);
            
            stack.push(initialState);
            
            while (stack.length > 0) {
                const nextState = stack.pop();
                const currentCorner = nextState.corner;
                visited.add(currentCorner.id);

                
                // Check if we completed a loop back to the first corner
                if (currentCorner === firstCorner && currentCorner !== secondCorner) {
                    return nextState.previousCorners;
                }

                const adjacentCorners = this.adjacencyList.get(currentCorner);
                const addToStack = adjacentCorners.filter(nextCorner => {
                    return !visited.has(nextCorner.id) || (nextCorner === firstCorner && currentCorner !== secondCorner);
                });
                
                
                if (addToStack.length > 1) {
                    const previousCorner = nextState.previousCorners[nextState.previousCorners.length - 1];
                    addToStack.sort((a, b) => {
                        return calculateTheta(previousCorner, currentCorner, b) - calculateTheta(previousCorner, currentCorner, a);
                    });
                }

                if (addToStack.length > 0) {
                    const previousCorners = [...nextState.previousCorners, currentCorner];
                    addToStack.forEach(corner => {
                        stack.push({ corner: corner, previousCorners: previousCorners });
                    });
                }
            }

            return [];
        };

        const loops = [];

        this.adjacencyList.forEach((firstCornerValue, firstCornerKey) => {
            firstCornerValue.forEach((secondCorner) => {
                const loop = _findTightestRoom(firstCornerKey, secondCorner);
                if (loop.length > 0) {
                    loops.push(loop);
                }
            });
        });
        
        const uniqueRooms = removeDuplicateRooms(loops);

        const uniqueCCWRoom = Utils.removeIf(uniqueRooms, Utils.isClockWise)

        return uniqueCCWRoom;
    }


   clearAdjacencyList() {
       this.adjacencyList.clear();
   }
}