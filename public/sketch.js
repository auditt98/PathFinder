class Board{
    constructor(){
        this.speed = "insane"
    }
}

class Grid{
    constructor(){
        this.rows = gRows
        this.cols = gCols
        this.cells = new Array(this.cols * this.rows)   
    }

    draw(){
        var table = document.getElementById("board")
        var tableHtml =""
        for(let row = 0; row < this.rows; row++){
            var curRow = `<tr id="row_${row}">`
            for(let col = 0; col < this.cols; col++){
                let cell = new Cell();
                cell.col = col
                cell.row = row
                this.cells[row * this.cols + col] = cell
                curRow += `<td id="cell_${row}_${col}" data-col=${col} data-row=${row} class="cell" onmousedown="cellMouseDown(this)" onmouseover="cellMouseOver(this)"></td>`
            }
            tableHtml += curRow + "</tr>"
        }
        table.innerHTML = tableHtml
    }

    update(){
        var i = 0
        GridUpdate(i, board.speed)
    }
}

class Cell{
    constructor(){
        this.width = cWidth
        this.height = cHeight
        this.col = 0
        this.row = 0
        this.isWall = false
        this.isDoor = false
    }

    update(){
        if(this.isWall){
            document.getElementById(`cell_${this.row}_${this.col}`).classList.add("wall")
        }
        if(this.isWall == false){
            document.getElementById(`cell_${this.row}_${this.col}`).classList.remove("wall")
        }
        if(this.isDoor){
            document.getElementById(`cell_${this.row}_${this.col}`).classList.remove("wall")
            this.isWall = false
        }
        return this
    }

    click(){
        if(this.isWall){
            this.isWall = false
            document.getElementById(`cell_${this.row}_${this.col}`).classList.remove("wall")
        } else{
            this.isWall = true
            document.getElementById(`cell_${this.row}_${this.col}`).classList.add("wall")
        }
    }
}

let board
let grid
let fps = 60
let cWidth = 25
let cHeight = 25
let gRows = 28
let gCols = 65
let rDiv = 0
let isMouseDown = false
let stack = []
let speedDict = { instant: 0, insane: 50, fast: 200, medium: 400 }

function setup() {
    board = new Board()
    grid = new Grid()
    grid.draw();
}

setup();
document.addEventListener('mouseup', e => {
    isMouseDown = false
});

function cellClick(cell){
    grid.cells[parseInt(cell.dataset.row) * gCols + parseInt(cell.dataset.col)].click();
}

function cellMouseDown(cell){
    isMouseDown = true;
    if(isMouseDown){
        grid.cells[parseInt(cell.dataset.row) * gCols + parseInt(cell.dataset.col)].click();
    }
    console.log("md on " + cell.dataset.row + " " + cell.dataset.col)
    return false;
}

function cellMouseOver(cell){
    if(isMouseDown == true){
        grid.cells[parseInt(cell.dataset.row) * gCols + parseInt(cell.dataset.col)].click();
    }
}

function GenMaze(name){
    if(name == "recursive_division"){
        clearWalls()
        RecursiveDivision(0, 0, gRows - 1, gCols - 1)
        var i = 0
        StackCellDisplay(i, board.speed)

    }
}

function StackCellDisplay(i, speed){
    if(speed == "instant"){
        stack.forEach(function(cell){
            cell.update()
        })
    } else{
        stack[i].update()
        if(++i < stack.length){
            setTimeout(function(){
                StackCellDisplay(i)
            }, speedDict[`${speed}`])
        }
    }
}

function GridUpdate(i, speed){
    if(speed == "instant"){
        grid.cells.forEach(function(cell){
            cell.update()
        })
    } else{
        grid.cells[i].update()
        if(++i < grid.cells.length){
            setTimeout(function(){
                GridUpdate(i)
            }, speedDict[`${speed}`])
        }
    }
}

function clearWalls(){
    stack.length = 0
    grid.cells.forEach(function(cell){
        cell.isWall = false
        cell.isDoor = false
        cell.update()
    })
    
    // grid.update()
}

function isNeighbourDoor(cell){
    // if(grid[cell.row * gCols + cell.col] )
    if(cell.col == cell.row && cell.col == 0){
        return true
    }
    if(cell.col == 0){
        if( grid.cells[(cell.row * gCols + cell.col) + 1].isDoor == true || 
            grid.cells[(cell.row * gCols + cell.col) + gCols].isDoor == true ||
            grid.cells[(cell.row * gCols + cell.col) - gCols].isDoor == true){
            return true
        }
        return false;
    }
    if(cell.row == 0){
        if( grid.cells[(cell.row * gCols + cell.col) + 1].isDoor == true || 
            grid.cells[(cell.row * gCols + cell.col) + gCols].isDoor == true ||
            grid.cells[(cell.row * gCols + cell.col) - 1].isDoor == true){
            return true
        }
        return false;
    }
    if(cell.col == gCols - 1){
        if( grid.cells[(cell.row * gCols + cell.col) - 1].isDoor == true || 
            grid.cells[(cell.row * gCols + cell.col) + gCols].isDoor == true ||
            grid.cells[(cell.row * gCols + cell.col) - gCols].isDoor == true){
            return true
        }
        return false;
    }
    if(cell.row == gRows - 1){
        if( grid.cells[(cell.row * gCols + cell.col) + 1].isDoor == true || 
            grid.cells[(cell.row * gCols + cell.col) - 1].isDoor == true ||
            grid.cells[(cell.row * gCols + cell.col) - gCols].isDoor == true){
            return true
        }
        return false;
    }
    if( grid.cells[(cell.row * gCols + cell.col) + 1].isDoor == true || 
        grid.cells[(cell.row * gCols + cell.col) - 1].isDoor == true ||
        grid.cells[(cell.row * gCols + cell.col) - gCols].isDoor == true ||
        grid.cells[(cell.row * gCols + cell.col) + gCols].isDoor == true){
            return true
        }
    return false
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

  //orientation 0 means vertical, 1 means horizontal

function RecursiveDivision(from_row, from_col, to_row, to_col){
    var width = to_col - from_col
    var height = to_row - from_row
    var orientation
    if(width > height){
        orientation = 0
    }
    if(width < height){
        orientation = 1
    }
    if(width == height){
        orientation = Math.random() < 0.5 ? 0 : 1
    }
    if(((width == 1) && (height == 1)) || (width < 1) || (height < 1)){
        return
    }
    if(orientation == 0){
        var wallPlace = randomInt(from_col, to_col)
        while(wallPlace == 0 || wallPlace == gCols - 1 || wallPlace == from_col || wallPlace == to_col){
            wallPlace = randomInt(from_col, to_col)
        }
        var filtered = grid.cells.filter(function(cell){
            return cell.col == wallPlace && cell.row >= from_row && cell.row <= to_row
        })
        filtered.forEach(function(cell){
            cell.isWall = true          
        })
        stack.push(filtered)
        var door = randomInt(0, filtered.length - 1)
        var filteredNextToDoor = filtered.filter(function(cell){
            return isNeighbourDoor(cell)
        })
        if(filteredNextToDoor.length > 0){
            filteredNextToDoor.forEach(function(cell){
                cell.isWall = false
                cell.isDoor = true
            })
            stack.push(filteredNextToDoor)

        } else{
            filtered[door].isWall = false
            filtered[door].isDoor = true
            // filtered[door].draw()
            stack.push(filtered[door])
        }
        stack = stack.flat()
        RecursiveDivision(from_row, from_col, to_row, wallPlace - 1)
        RecursiveDivision(from_row, wallPlace + 1, to_row, to_col)
    } 
    else if(orientation == 1){
        var wallPlace = randomInt(from_row, to_row)
        while(wallPlace == from_row || wallPlace == to_row || wallPlace == 0 || wallPlace == gRows - 1){
            wallPlace = randomInt(from_row, to_row)
        }
        var filtered = grid.cells.filter(function(cell){
            return cell.row == wallPlace && cell.col >= from_col && cell.col <= to_col
        })
        filtered.forEach(function(cell){
            cell.isWall = true
        })
        stack.push(filtered)

        var door = randomInt(0, filtered.length - 1)
        var filteredNextToDoor = filtered.filter(function(cell){
            return isNeighbourDoor(cell)
        })
        if(filteredNextToDoor.length > 0){
            filteredNextToDoor.forEach(function(cell){
                cell.isWall = false
                cell.isDoor = true
            })
            stack.push(filteredNextToDoor)
        } else{
            filtered[door].isWall = false
            filtered[door].isDoor = true
            stack.push(filtered[door])
        }
        stack = stack.flat()
        RecursiveDivision(from_row, from_col, wallPlace - 1, to_col)
        RecursiveDivision(wallPlace + 1, from_col, to_row, to_col)
    }
}
