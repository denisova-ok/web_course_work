export class fishManager {
    constructor() {
        this.background = new Image
        this.background.src = './assets/images/fish.png'
        this.x = null
        this.y = null
        this.health = 10000
        this.health_canvas = document.querySelector('#health')
        this.health_canvas.width = 150
        this.health_canvas.height = 30
    }

    moveLeft(){
        if (this.x > 0) this.x -= 48
    }

    moveRight(){
        if (this.x < 672)this.x += 48
    }

    moveUp(){
        if (this.y > 0)this.y -= 48
    }

    moveDown(){
        if (this.y < 672) this.y += 48
    }

    eat() {
        //console.log("EATING")
        if (this.health + 200 > 10000) this.health = 10000
        else this.health = this.health + 200
    }

    damage() {
        if (this.health - 100 < 0) this.health = 0
        else this.health = this.health - 100
    }

}