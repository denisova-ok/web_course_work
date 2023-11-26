import { GridPoint } from "./gridPoint.js";

export class AStar {

constructor(cols, rows, passability, startpos, endpos) {
    this.cols = cols; //columns in the grid
    this.rows = rows; //rows in the grid

    this.test = passability
    /*this.test = [[0, 0, 1, 1, 0],
                [0, 1, 1, 0, 0],
                [0, 1, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0]]*/

    this.grid = new Array(this.cols); //array of all the grid points
    for (let i = 0; i < this.cols; i++) {
        this.grid[i] = new Array(this.rows);
    }

    for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = new GridPoint(i, j, this.test[j][i]); //// ???????????
        }
    }

    this.openSet = []; //array containing unevaluated grid points
    this.closedSet = []; //array containing completely evaluated grid points

    this.start = this.grid[startpos.x][startpos.y]; //starting grid point
    this.end = this.grid[endpos.x][endpos.y]; // ending grid point (goal)
   // this.start = this.grid[0][0];
   // this.end = this.grid[4][0];
    this.path = [];
}

//heuristic we will be using - Manhattan distance
//for other heuristics visit - https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
heuristic(position0, position1) {
  let d1 = Math.abs(position1.x - position0.x);
  let d2 = Math.abs(position1.y - position0.y);

  return d1 + d2;
}

//initializing the grid
init() {
  //making a 2D array

  for (let i = 0; i < this.cols; i++) {
    for (let j = 0; j < this.rows; j++) {
      this.updateNeighbors(this.grid[i][j]);
    }
  }



  this.openSet.push(this.start);

  //console.log(this.grid);
}

updateNeighbors(node) {
    let i = node.x;
    let j = node.y;
    if ((i < this.cols - 1) && (!this.grid[i+1][j].value)) {
      node.neighbors.push(this.grid[i + 1][j]);
    }
    if ((i > 0) && (!this.grid[i-1][j].value)) {
      node.neighbors.push(this.grid[i - 1][j]);
    }
    if ((j < this.rows - 1) && (!this.grid[i][j+1].value)) {
      node.neighbors.push(this.grid[i][j + 1]);
    }
    if ((j > 0) && (!this.grid[i][j - 1].value)) {
      node.neighbors.push(this.grid[i][j - 1]);
    }
    //console.log(node.neighbors)
  }

//A star search implementation
search() {
  this.init();
  while (this.openSet.length > 0) {
    //assumption lowest index is the first one to begin with
    let lowestIndex = 0;
    for (let i = 0; i < this.openSet.length; i++) {
      if (this.openSet[i].f < this.openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    let current = this.openSet[lowestIndex];

    if (current === this.end) {
      let temp = current;
      this.path.push({'x': temp.x * 48, 'y': temp.y * 48});
      while (temp.parent) {
        this.path.push({'x': temp.parent.x * 48, 'y': temp.parent.y * 48});
        temp = temp.parent;
      }
      //console.log("DONE!");
      // return the traced path
      return this.path.reverse();
    }

    //remove current from openSet
    this.openSet.splice(lowestIndex, 1);
    //add current to closedSet
    this.closedSet.push(current);

    let neighbors = current.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (!this.closedSet.includes(neighbor)) {
        let possibleG = current.g + 1;

        if (!this.openSet.includes(neighbor)) {
          this.openSet.push(neighbor);
        } else if (possibleG >= neighbor.g) {
          continue;
        }

        neighbor.g = possibleG;
        neighbor.h = this.heuristic(neighbor, this.end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
      }
    }
  }

  //no solution by default
  return [];
}
}