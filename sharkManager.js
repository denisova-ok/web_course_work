export class sharkManager {
    constructor(id, x, y) {
        this.background = new Image
        this.background.src = './assets/images/shark.png'
        this.id = id
        this.x = x
        this.y = y
        this.path = null
    }

    moveLeft(){
        this.x -= 48
    }

    moveRight(){
        this.x += 48
    }

    moveUp(){
        this.y -= 48
    }

    moveDown(){
        this.y += 48
    }

    move(x, y) {
        this.x = x
        this.y = y
    }
}