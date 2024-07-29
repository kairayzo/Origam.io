import { line } from "./Line.js"
import { envVar } from "./index.js"
import { clearChildren } from "./helper.js"

function generateGrid() {

    const grid = document.querySelector('#grid')
    let segment = envVar.segment
    let height = envVar.height
    let width = envVar.width
    let interval = Math.ceil(height/segment)
    clearChildren(grid)
    generateGridlines()
    generateGridVertices()
    
    function generateGridlines() {
        for (let i = interval; i < width; i += interval) {
            const lineElemY = line(i, 0, i, height, 'stroke:white;stroke-width:2')
            grid.append(lineElemY)
        }
        for (let i = interval; i < height; i += interval) {
            const lineElemX = line(0, i, width, i, 'stroke:white;stroke-width:2')
            grid.append(lineElemX)
        }
    }

    function generateGridVertices() {
        let newGridVertices = []
        for (let i = 0; i <= width; i += interval) {
            for (let j = 0; j <= height; j += interval) {
                newGridVertices.push([i, j])
            }
        }
        envVar.gridVertices = newGridVertices;
    }
}

function toggleGrid() {
    let gridOn = envVar.gridlines
    const grid = document.querySelector("#grid")
    if (gridOn) {
        grid.style.display = "block"
    } else {
        grid.style.display = "none"
    }
}

export {generateGrid, toggleGrid}