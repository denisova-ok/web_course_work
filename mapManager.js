export class MapManager {
    constructor(lvl)  {
        this.mapData = null
        this.tileLayers = null
        this.xCount = 0
        this.yCount = 0
        this.tileSize = {x: 0, y: 0}
        this.mapSize = {x: 0, y: 0}

        this.background = new Image

        if (lvl == 1)                    
            this.background.src = "./assets/images/map-1.png"
        
        if (lvl == 2)        
            this.background.src = "./assets/images/map-2.png"     

        this.jsonLoaded = false

        this.map_canvas = document.querySelector('#map')
        this.map_canvas.width = 720
        this.map_canvas.height = 720
        

        //this.pers_img = new Image
        //this.pers_img.src = IMG_PATH + "pers_res.jpeg"


        // нумирация - верхний левый угло - 0;0
        // движение по оси ox - индекс j
        // движение по оси oy - индекс i
        this.Matrix_field = new Array(15)
        this.entities = new Array(15)
        for (let i=0; i < 15; i++) {
            this.Matrix_field[i] = new Array(15)
            this.entities[i] = new Array(15)
        }

        for (let i=0; i < 15; i++) {
            for (let j=0; j < 15; j++) {
                this.Matrix_field[i][j] = 0
                this.entities[i][j] = 0
            }
        }
        
        this.fish_x = null
        this.fish_y = null

        this.shark_coords = []
    }


    parseMap(tilesParsedJSON) {
        //let img = new Image();
        //img.src = IMG_PATH + "pers_res.jpeg"
        //this.map_canvas.getContext("2d").drawImage(img, 0, 0, this.map_canvas.width, this.map_canvas.height)
        
        this.mapData = tilesParsedJSON
        this.xCount = this.mapData.width
        this.yCount = this.mapData.height
        this.tileSize.x = this.mapData.tilewidth 
        this.tileSize.y = this.mapData.tileheight      

        this.mapSize.x = this.xCount * this.tileSize.x
        this.mapSize.y = this.yCount * this.tileSize.y

        this.tileLayers = this.mapData.layers               

        this.jsonLoaded = true // когда разобран весь json
        this.makeMap()
    }


    makeMap() {
        for(let idx = 0; idx < this.tileLayers.length; idx++) {
            if (this.tileLayers[idx].name === 'background') {
                let temp = new Array(15)
                
            for (let i=0; i < 15; i++) {
                temp[i] = new Array(15)
                for (let j=0; j < 15; j++) {
                    temp[i][j] = this.tileLayers[idx].data[j+15*i]
                }
            }

                for (let i=0; i < 15; i++) {
                    for (let j=0; j < 15; j++) {
                        if (temp[i][j] == 85) this.Matrix_field[i][j] = 1
                        if (temp[i][j] == 57) this.Matrix_field[i][j] = -1

                    }
                }
            } else if (this.tileLayers[idx].name === 'entities') {
                let shark_counter = 0;
                for (let obj of this.tileLayers[idx].objects) {
                    if (obj.gid == 163) {
                        this.entities[obj.y / 32][obj.x / 32] = 1
                        this.fish_x = obj.x * 1.5;
                        this.fish_y = obj.y * 1.5;
                    }

                    else if(obj.gid == 164) {
                        this.entities[obj.y / 32][obj.x / 32] = -1 
                        this.shark_coords.push({"id": shark_counter, "x": obj.x * 1.5, "y": obj.y * 1.5})
                        shark_counter += 1
                }
                }
            }
        }
    }
}