//constructor function to create all the grid points as objects containind the data for the points
export class GridPoint {
    constructor(x, y, value) {
    this.x = x; //x location of the grid point
    this.y = y; //y location of the grid point
    this.f = 0; //total cost function
    this.g = 0; //cost function from start to the current grid point
    this.h = 0;
    this.value = value; //heuristic estimated cost function from current grid point to the goal
    this.neighbors = []; // neighbors of the current grid point
    this.parent = undefined; // immediate source of the current grid point
    }
    // update neighbors array for a given grid point
  }