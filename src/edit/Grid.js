import * as backend from "../backend/backend.js"

const grid = document.querySelector('#grid')

function generateGrid() {
    backend.dom.clearChildren(grid)
    generateGridlines()
    generateGridVertices()
}

function generateGridlines() {
    let segment = backend.data.envVar.segment
    let height = backend.data.envVar.height
    let width = backend.data.envVar.width
    let interval = backend.helper.exact(height/segment)

    for (let i = interval; i < width; i += interval) {
        const lineElemY = backend.elements.line(i, 0, i, height, 'stroke:white;stroke-width:2')
        grid.append(lineElemY)
    }
    for (let i = interval; i < height; i += interval) {
        const lineElemX = backend.elements.line(0, i, width, i, 'stroke:white;stroke-width:2')
        grid.append(lineElemX)
    }
}

function generateGridVertices() {
    let segment = backend.data.envVar.segment
    let height = backend.data.envVar.height
    let width = backend.data.envVar.width
    let interval = backend.helper.exact(height/segment)

    let newGridVertices = []
    for (let i = 0; i <= width; i += interval) {
        for (let j = 0; j <= height; j += interval) {
            newGridVertices.push([i, j])
        }
    }
    backend.data.envVar.gridVertices = newGridVertices;
}

function toggleGrid() {
    let gridOn = backend.data.envVar.gridlines
    backend.dom.toggleElemDisplay(grid, gridOn, 'block')
}

export { generateGrid, toggleGrid}