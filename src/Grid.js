import { line } from "./Line.js"
import { envVar } from "./index.js"
import { clearElem } from "./helper.js"

function generateGrid() {

    const grid = document.querySelector('#grid')
    clearElem(grid)
    generateGridlines()
    generateGridVertices()
    
    function generateGridlines() {
        const grid = document.querySelector('#grid')
        let segment = envVar.segment
        let height = envVar.height
        let width = envVar.width
        let interval = Math.ceil(height/segment)

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
        let segment = envVar.segment
        let height = envVar.height
        let width = envVar.width
        let interval = Math.ceil(height/segment)
        envVar.gridVertices = [];

        for (let i = 0; i <= width; i += interval) {
            for (let j = 0; j <= height; j += interval) {
                envVar.gridVertices.push([i, j])
            }
        }
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