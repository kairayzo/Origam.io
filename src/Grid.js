import { svg } from "./SVG.js"
import { line } from "./Line.js"

function generateGrid(segment) {

    clearGrid()
    generateGridlines(segment)

    function generateGridlines(segment) {
        const grid = document.querySelector('#grid')
        const height = grid.offsetHeight
        const width = grid.offsetWidth
        const interval = Math.ceil(height/segment)
        console.log(height, interval)

        const svgElem = svg(width, height)
        for (let i = interval; i < width; i += interval) {
            const lineElemY = line(i, 0, i, height, 'stroke:white;stroke-width:2')
            svgElem.append(lineElemY)
        }
        for (let i = interval; i < height; i += interval) {
            const lineElemX = line(0, i, width, i, 'stroke:white;stroke-width:2')
            svgElem.append(lineElemX)
        }

        console.log(svgElem)

        grid.append(svgElem)
    }

    function clearGrid() {
        const grid = document.querySelector('#grid')
        grid.innerHTML = ''
        let newGrid = grid.cloneNode(true);
        grid.parentNode.replaceChild(newGrid, grid)
    }

}

function toggleGrid(gridOn) {
    const gridElem = document.querySelector("#grid")
    const gridSvg = gridElem.children[0]
    if (gridOn) {
        gridSvg.style.display = "block"
    } else {
        gridSvg.style.display = "none"
    }
}

export {generateGrid, toggleGrid}