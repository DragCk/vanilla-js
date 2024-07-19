

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

   findPolygons() {
       const visited = new Set()
       const allPolygons = []
       const stacks = []

       const dfs = (node, parent) => {
           visited.add(node)
           stacks.push(node)

           for(let child of this.adjacencyList.get(node)) {
               if(!visited.has(child)){
                    dfs(child, node)
                }else if(child !== parent && stacks.includes(child)){
                    const cycle = [...stacks.slice(stacks.indexOf(child))];
                    allPolygons.push(cycle);
                } 
           }
           stacks.pop()
       }

        for(let node of this.adjacencyList.keys()) {
            
            dfs(node, null)

            
        }
         // Remove duplicate cycles
        const uniqueCycles = [];
        const cycleStrings = new Set();
        allPolygons.forEach(cycle => {
        const cycleString = cycle.sort().join("-");
        if (!cycleStrings.has(cycleString)) {
            cycleStrings.add(cycleString);
            uniqueCycles.push(cycle);
        }
        });

        return allPolygons;
   }

   clearAdjacencyList() {
       this.adjacencyList.clear();
   }
}