import { Vector2 } from "three";
import { Corner } from "../models2D/corner.model";


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
            )
            return theta
        }

        const _findTightestRoom = (firstCorner, secondCorner) => {
            const stack = []
            const next = { corner : secondCorner, previousCorners: [firstCorner]}
            const visited = {}
            visited[firstCorner.id] = true


            while(next){
                const currentCorner = next.corner
                visited[currentCorner.id] = true

                if(next.corner === firstCorner && currentCorner !== secondCorner){
                    return next.previousCorners
                }

                const addToStack = []
                const adjacentCorners = this.adjacencyList.get(currentCorner)
                
                for(let i = 0 ; i < adjacentCorners.length; i++){
                    const nextCorner = adjacentCorners[i]
                    console.log(i)
                    if(nextCorner.id in visited && !(nextCorner === firstCorner && currentCorner !== secondCorner)){
                        continue
                    }

                    addToStack.push(nextCorner)
                }
               
                const previousCorners = next.previousCorners.slice(0)
                previousCorners.push(currentCorner)

                if(addToStack.length > 1){
                    const previousCorner = next.previousCorners[next.previousCorners.length - 1]
                    addToStack.sort((a, b) => {
                        return(
                            calculateTheta(previousCorner, currentCorner, b) - calculateTheta(previousCorner, currentCorner, a)
                        )
                    })
                }

                if(addToStack.length > 0){
                    addToStack.forEach(corner => {
                        stack.push({ corner :corner, previousCorners: previousCorners })
                    })
                }
                console.log(stack)
                next = stack.pop()
            }

            return []
        }

        const loops = []

        this.adjacencyList.forEach((firstCorner) => {
            firstCorner.forEach((secondCorner) => {
                loops.push(_findTightestRoom(firstCorner, secondCorner))
            })
        })

        return loops
   }

   clearAdjacencyList() {
       this.adjacencyList.clear();
   }
}