

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
        this.adjacencyList.get(vertex1).push(vertex2)
        this.adjacencyList.get(vertex2).push(vertex1)
   }

   clearAdjacencyList() {
       this.adjacencyList.clear();
   }
}