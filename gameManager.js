import { MapManager } from "./mapManager.js";
import { fishManager } from "./fishManager.js";
import { sharkManager } from "./sharkManager.js";
import { AStar } from "./astar.js";
import { FoodManager } from "./foodManager.js";
import { SoundManager } from "./soundManager.js";

export class Game {

    constructor(lvl) {
        this.lvl = lvl
        this.mapManager = new MapManager(this.lvl)
        this.map = null
        this.fishManager = null
        this.sharkManagers = []
        this.time = 0
        this.alive = true
    }

    async onInit() {
        if (this.lvl == 1) {
           await this.loadMap('./assets/images/my-map-1.json').then((json) => this.mapManager.parseMap(json))
        } else {
            await this.loadMap('./assets/images/my-map-2.json').then((json) => this.mapManager.parseMap(json))
        }
        this.mapManager.map_canvas.getContext("2d").drawImage(this.mapManager.background, 0, 0, 720, 720)
        console.log(this.mapManager.map_canvas)
        this.map = this.mapManager.Matrix_field
        this.entities = this.mapManager.entities
        console.log(this.entities)

        this.soundManager = new SoundManager()

        this.fishManager = new fishManager()
        this.fishManager.x = this.mapManager.fish_x
        this.fishManager.y = this.mapManager.fish_y

        this.updateHealth()
        this.foodManager = new FoodManager()
        for (let shark of this.mapManager.shark_coords) {
            this.sharkManagers.push(new sharkManager(shark.id, shark.x, shark.y))
        }


        console.log(this.map)
        console.log(this.fishManager.x)
        console.log(this.fishManager.y)
        this.keys()
        
        this.update()
        //this.findPathfromSharkToFish(0);
        for (let i = 0; i < this.sharkManagers.length; i++) {
            this.sharkManagers[i].path = this.findPathfromSharkToFish(i)
        }

        let upd = setInterval(() => {
            this.update()
        }, 10);

        let ms = setInterval(() => {
            this.moveSharkToFish()
        }, 200);

        let fp = setInterval(() => {
            for (let i = 0; i < this.sharkManagers.length; i++) {
                this.sharkManagers[i].path = this.findPathfromSharkToFish(i)
            }
        }, 1000);

        let md = setInterval(() => {
            this.fishManager.damage()
            this.updateHealth()
        }, 400);

        let gf = setInterval(() => {
            this.generateFood()
        }, 5000);

        let ca = setInterval(() => {
            this.checkAlive()
            //console.log(this.fishManager.x, this.fishManager.y)
            if (this.foodManager.pos.includes('x:'+this.fishManager.x+'y:'+this.fishManager.y)) {
                this.fishManager.eat()
                this.soundManager.health.play()
                let index = this.foodManager.pos.indexOf('x:'+this.fishManager.x+'y:'+this.fishManager.y)
                this.foodManager.pos.splice(index, 1)
            }
            this.time += 10
            document.getElementById('time').textContent='Time: '+ this.time/1000
            if (!this.alive) {
                clearInterval(upd)
                clearInterval(gf)
                clearInterval(md)
                clearInterval(ms)
                clearInterval(fp)
                //this.mapManager.map_canvas.getContext("2d").clearRect(0, 0, 720, 720)
                clearInterval(ca)
                this.finish()
            }
        }, 10);
        //console.log(this.mapManager.map_canvas.background.src)
    }

    finish(){
        this.soundManager.grass.pause()
        this.soundManager.water.pause()
        this.soundManager.finish.play()
        this.mapManager.background = new Image
        this.mapManager.background.src = './assets/images/game_over.jpg' 
        this.mapManager.background.onload = ()=>{
            this.update()
            this.mapManager.map_canvas.getContext('2d').font ='42px Verdana'
            this.mapManager.map_canvas.getContext('2d').fillText('Your time: '+this.time/1000, 170, 200)
            this.mapManager.map_canvas.getContext('2d').fillText('Press Enter...', 170, 550)
        };
        //this.mapManager.map_canvas.getContext("2d").drawImage(this.mapManager.background, 0, 0, 720, 720)
        document.querySelector('.container-2').setAttribute('hidden', 'hidden')
        let pr_result = JSON.parse(localStorage.getItem((localStorage.length - 1).toString()))
        let upd_result = {'nickname': pr_result.nickname, 'lvl': pr_result.lvl, 'result': this.time/1000}
        localStorage.setItem((localStorage.length - 1).toString(), JSON.stringify(upd_result));
    }

    generateFood(){
        //console.log('generating...')
        let x = Math.floor(Math.random() * 15) 
        let y = Math.floor(Math.random() * 15)
        //console.log(x, y)
        //console.log(this.map)
        //console.log(this.foodManager.pos)
        if (this.map[y][x] == 0) {
            //this.mapManager.map_canvas.getContext("2d").drawImage(this.foodManager.background, x*48, y*48, 48, 48)
            this.foodManager.pos.push('x:'+x*48+'y:'+y*48)
        }
    }

    updateHealth() {
        this.fishManager.health_canvas.getContext("2d").clearRect(0, 0, 150, 30)
        this.fishManager.health_canvas.getContext("2d").fillStyle = "red"
        this.fishManager.health_canvas.getContext("2d").fillRect(0, 0, ((this.fishManager.health * 100) / (66.666666 * this.fishManager.health_canvas.width)), 15)
    }

    checkAlive(){
        if (this.fishManager.health == 0) this.alive = false
        for (let i = 0; i < this.sharkManagers.length; ++i) {
            if ((this.sharkManagers[i].x == this.fishManager.x) && (this.sharkManagers[i].y == this.fishManager.y)) { 
                this.alive = false
                this.fishManager.health = 0
            }
        } 
    }


    moveFishDown() {
        let passability = this.map[(this.fishManager.y + 48)/ 48][this.fishManager.x/48]
        if (passability == 0 || passability == -1) {
            this.fishManager.background.src = './assets/images/fish-down.png'
            this.fishManager.background.onload = () => { 
                this.fishManager.moveDown()
            };
        if (passability == -1) {
            this.soundManager.water.pause()
            this.soundManager.grass.play()
        }
        if (passability == 0) {
            this.soundManager.grass.pause()
            this.soundManager.water.play()
            }
        }
        if (passability == 1) {
            this.soundManager.wall.play()
        }
    }

    moveFishLeft() {
        let passability = this.map[this.fishManager.y / 48][(this.fishManager.x - 48)/48]
        if (passability == 0 || passability == -1) {
            this.fishManager.background.src = './assets/images/fish.png'
            this.fishManager.background.onload = () => {
                this.fishManager.moveLeft()
            };
            if (passability == -1) {
                this.soundManager.water.pause()
                this.soundManager.grass.play()
            }
            if (passability == 0) {
                this.soundManager.grass.pause()
                this.soundManager.water.play()
            }
        }
        if (passability == 1) {
            this.soundManager.wall.play()
        }
    }

    moveFishRight() {
        let passability = this.map[this.fishManager.y / 48][(this.fishManager.x + 48)/48]
        if (passability == 0 || passability == -1) {
            this.fishManager.background.src='./assets/images/fish-right.png'
            this.fishManager.background.onload = () => {
                this.fishManager.moveRight()
            };
        if (passability == -1) {
            this.soundManager.water.pause()
            this.soundManager.grass.play()
        }
        if (passability == 0) {
            this.soundManager.grass.pause()
            this.soundManager.water.play()
        }
    }
    if (passability == 1) {
        this.soundManager.wall.play()
    }
}

    moveFishUp() {
        let passability = this.map[(this.fishManager.y - 48)/ 48][this.fishManager.x/48]
        if (passability == 0 || passability == -1) {
            this.fishManager.background.src='./assets/images/fish-up.png'
            this.fishManager.background.onload = () => {
                this.fishManager.moveUp()
            };
        if (passability == -1) {
            this.soundManager.water.pause()
            this.soundManager.grass.play()
        }
        if (passability == 0) {
            this.soundManager.grass.pause()
            this.soundManager.water.play()
            }
        }
        if (passability == 1) {
            this.soundManager.wall.play()
        }
    }

    moveSharkDown(id){
        let passability = this.map[(this.sharkManagers[id].y + 48)/ 48][this.sharkManagers[id].x/48]
        if (passability == 0) this.sharkManagers[id].moveDown() 
    }

    moveSharkUp(id){
        let passability = this.map[(this.sharkManagers[id].y - 48)/ 48][this.sharkManagers[id].x/48]
        if (passability == 0) this.sharkManagers[id].moveUp() 
    }

    moveSharkLeft(id){
        let passability = this.map[this.sharkManagers[id].y / 48][(this.sharkManagers[id].x - 48)/48]
        if (passability == 0) this.sharkManagers[id].moveLeft() 
    }

    moveSharkRight(id){
        let passability = this.map[this.sharkManagers[id].y / 48][(this.sharkManagers[id].x + 48)/48]
        if (passability == 0) this.sharkManagers[id].moveRight() 
    }


    moveSharkToFish() {
        for (let i = 0; i < this.sharkManagers.length; i++) {
            if (this.sharkManagers[i].path.length > 0) {
                this.sharkManagers[i].move(this.sharkManagers[i].path[0].x, this.sharkManagers[i].path[0].y)
                this.sharkManagers[i].path.splice(0,1)
            } else {
                this.moveSharkRandom(i)
            }
        }
        //console.log(this.sharkManagers[id].path)
    }

    moveSharkRandom(id) {
        let direction = Math.floor(Math.random() * 4);
        switch(direction) {
            case 0:
                this.moveSharkDown(id)
                break;
            case 1:
                this.moveSharkUp(id)
                break;
            case 2:
                this.moveSharkLeft(id)
                break;
            case 3:
                this.moveSharkRight(id)
                break;
        }
    }

    keys() {
        document.addEventListener('keydown', (event) => {
            if (event.code == 'ArrowLeft') {
                this.moveFishLeft() 
            }
            if (event.code == 'ArrowRight') {
                this.moveFishRight()
            }
            if (event.code == 'ArrowUp') {
                this.moveFishUp()
            }
            if (event.code == 'ArrowDown') {
                this.moveFishDown()
            }
            if (event.keyCode == 13) {
                document.location.replace('http://localhost:3000/menu.html')
            }
        });
    }

    update() {
        this.mapManager.map_canvas.getContext("2d").clearRect(0, 0, 720, 720)
        this.mapManager.map_canvas.getContext("2d").drawImage(this.mapManager.background, 0, 0, 720, 720)
        if (this.alive) {
            this.mapManager.map_canvas.getContext("2d").drawImage(this.fishManager.background, this.fishManager.x, this.fishManager.y, 48, 48)
            for (let sm of this.sharkManagers) {
                this.mapManager.map_canvas.getContext("2d").drawImage(sm.background, sm.x, sm.y, 48, 48)
            }
            for (let food of this.foodManager.pos) {
                let d_1_ind = food.indexOf(':', 0)
                let d_2_ind = food.indexOf(':', d_1_ind + 1)
                let x_ind = food.indexOf('x')
                let y_ind = food.indexOf('y')
                let x = Number(food.substring(d_1_ind + 1, y_ind))
                let y = Number(food.substring(d_2_ind + 1))
                console.log(d_1_ind)
                console.log(d_2_ind)
                console.log(x)
                console.log(y)
                this.mapManager.map_canvas.getContext("2d").drawImage(this.foodManager.background, x, y, 48, 48)
            }
        }
    }


    start() {
        this.onInit();
    }

    async loadMap(path) {
        let tilesParsedJSON = null
         await fetch(
            path,
            {
                headers:
                {
                    'Content-Type': 'application/json',
                },
                method: "GET"
            }
        )
        .then(response => response.json())
        .then(response => {
            tilesParsedJSON = response
        })

        return tilesParsedJSON
    }

    getCoordsByNum(x, y) {
        return {"x": x * 15,"y": y * 15};
    }

    findPathfromSharkToFish(id) {
        let astar = new AStar(15, 15, this.map, {'x': this.sharkManagers[id].x / 48, 'y': this.sharkManagers[id].y / 48}, {'x': this.fishManager.x / 48, 'y': this.fishManager.y / 48})
        return astar.search();
    }


}

let lvl = JSON.parse(localStorage.getItem((localStorage.length - 1).toString()))['lvl']
let game = new Game(lvl)
game.start()

