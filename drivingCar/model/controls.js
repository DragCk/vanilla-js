export class Controls{
    constructor(controlType){
        this.foward = false
        this.left = false
        this.right = false
        this.reverse = false

        switch(controlType){
            case "KEYS":
                this.#addKeyboardListener();
                break
            case "DUMMY":
                this.foward = true
                break
        }
     
    }

    #addKeyboardListener(){
        document.onkeydown = (e) => {
            switch(e.key){
                case "ArrowLeft":
                    this.left = true
                    break
                case "ArrowRight":
                    this.right = true
                    break
                case "ArrowUp":
                    this.foward = true
                    break
                case "ArrowDown":
                    this.reverse = true
                    break
            }
            
        }
        document.onkeyup = (e) => {
            switch(e.key){
                case "ArrowLeft":
                    this.left = false
                    break
                case "ArrowRight":
                    this.right = false
                    break
                case "ArrowUp":
                    this.foward = false
                    break
                case "ArrowDown":
                    this.reverse = false
                    break
            }
           
        }
    }    

}