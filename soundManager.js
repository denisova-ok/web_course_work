export class SoundManager {
    constructor() {
        this.wall = new Audio('./assets/sounds/wall.mp3')
        this.wall.volume = 1
        
        this.grass = new Audio('./assets/sounds/rustle.mp3')
        this.grass.volume = 1

        this.finish = new Audio('./assets/sounds/finish.mp3')
        this.finish.volume = 0.5

        this.water = new Audio('./assets/sounds/water.mp3')
        this.water.volume = 0.05

        this.health = new Audio('./assets/sounds/health.mp3')
        this.health.volume = 0.5
    }
}