import { line } from "./Line.js"
import { svg } from "./SVG.js"
import { vertex as vertex } from "./Vertex.js"

const DEFAULT_SEGMENT = 8
const DEFAULT_STROKE = 2
const DEFAULT_STROKE_COLOR = 'black'
export const vertexList = []

const grid = document.querySelector('#grid')
const form = document.querySelector('#menu')
const segInput = document.querySelector('#segment')
const strInput = document.querySelector('#stroke')
segInput.value = DEFAULT_SEGMENT
strInput.value = DEFAULT_STROKE
form.addEventListener('submit',(e)=>render(e))

function clearGrid() {
    const grid = document.querySelector('#grid')
    grid.innerHTML = ''
    let newGrid = grid.cloneNode(true);
    grid.parentNode.replaceChild(newGrid, grid)
}

function generateGridlines(segment) {
    const grid = document.querySelector('#grid')
    const height = grid.offsetHeight
    const interval = Math.ceil(height/segment)
    console.log(height, interval)

    const svgElem = svg(height, height)
    for (let i = interval; i < height; i += interval) {
        const lineElemX = line(0, i, height, i, 'stroke:red;stroke-width:2')
        const lineElemY = line(i, 0, i, height, 'stroke:red;stroke-width:2')
        svgElem.append(lineElemX, lineElemY)
    }
    grid.append(svgElem)
}

function generateSelectors(segment) {
    const grid = document.querySelector('#grid')
    const height = grid.offsetHeight
    const interval = Math.ceil(height/segment)
    const radius = 6
    console.log(height, interval)

    for (let i = 0; i <= height + radius; i += interval) {
        for (let j=0; j <= height + radius; j += interval) {
            const vertexElem = vertex(radius, 'fill:red')
            vertexElem.style = `left:${i - radius}px;top:${j - radius}px`
            grid.append(vertexElem)
        }
    }
}

function setDrawTool(strokeColor, stroke) {
    let selected = []
    const grid = document.querySelector('#grid')
    grid.addEventListener('click', (e) => handleVerticeClick(e))
    
    function handleVerticeClick(e) {
        e.preventDefault()
        if (e.target.closest('.vertex')) {
            const vertexElem = e.target.closest('.vertex')
            addToSelected(vertexElem, strokeColor, stroke)
            console.log(selected)
        }
    }

    // Gets input string with length units (px, rem .etc) and returns a float
    function parseLength(str) {
        let parsedStr = str.replace(/\D\-/g, "")
        return parseFloat(parsedStr)
    }

    function getSvgCoords(svg) {
        const svgBBox = svg.getBBox()
        const svgLeft = parseLength(svg.style.left)+svgBBox.width/2
        const svgTop = parseLength(svg.style.top)+svgBBox.height/2
        return [svgLeft, svgTop]
    }

    function addToSelected(vertexElem, strokeColor, stroke) {
        if (selected.length == 0) {
            vertexElem.classList.remove(...['opacity-0', 'transition', 'hover:opacity-100'])
            selected.push(vertexElem)
        } else {
            let startVertex = selected[0]
            startVertex.classList.add(...['opacity-0', 'transition', 'hover:opacity-100'])
            let start = getSvgCoords(selected[0])
            let end = getSvgCoords(vertexElem)
            console.log(start, end)
            if (start.toString() !== end.toString()) {
                drawLine(start, end, strokeColor, stroke)
            }
            selected = []
        }
    }

    function drawLine(start, end, strokeColor, strokeWidth) {
        const grid = document.querySelector('#grid')
        let xDiff = start[0]-end[0]
        let yDiff = start[1]-end[1]
        let width = Math.max(Math.abs(xDiff), strokeWidth)
        let height = Math.max(Math.abs(yDiff), strokeWidth)

        const svgElem = svg(Math.max(strokeWidth,width), Math.max(strokeWidth,height))
        if (xDiff == 0) {
            const newLine =  line(strokeWidth/2, 0, strokeWidth/2, height, 
                `stroke:${strokeColor};stroke-width:${strokeWidth}`
            )
            svgElem.append(newLine) 
            svgElem.style = `left:${Math.min(start[0],end[0])-strokeWidth/2}px;top:${Math.min(start[1],end[1])}px`
        } else if (yDiff == 0) {
            const newLine =  line(0, strokeWidth/2, width, strokeWidth/2, 
                `stroke:${strokeColor};stroke-width:${strokeWidth}`
            )
            svgElem.append(newLine) 
            svgElem.style = `left:${Math.min(start[0],end[0])}px;top:${Math.min(start[1],end[1])-strokeWidth/2}px`
        }else if (xDiff * yDiff > 0) {
            const newLine =  line(0, 0, width, height, `stroke:${strokeColor};stroke-width:${strokeWidth}`)
            svgElem.append(newLine)
            svgElem.style = `left:${Math.min(start[0],end[0])}px;top:${Math.min(start[1],end[1])}px`
        } else {
            const newLine =  line(0, height, width, 0, `stroke:${strokeColor};stroke-width:${strokeWidth}`)
            svgElem.append(newLine)
            svgElem.style = `left:${Math.min(start[0],end[0])}px;top:${Math.min(start[1],end[1])}px`
        }

        svgElem.classList.add('line');
        grid.append(svgElem)

        vertexList.push([start, end])
        console.log(vertexList)
    }

}

function render(e) {
    e.preventDefault()
    const segInput = document.querySelector('#segment')
    const strInput = document.querySelector('#stroke')
    
    const segment = segInput.value
    const stroke = strInput.value
    const strokeColor = DEFAULT_STROKE_COLOR
    console.log(segment, stroke)

    clearGrid()
    generateGridlines(segment)
    generateSelectors(segment)
    setDrawTool(strokeColor, stroke)
}

generateGridlines(DEFAULT_SEGMENT)
generateSelectors(DEFAULT_SEGMENT)
setDrawTool(DEFAULT_STROKE_COLOR, DEFAULT_STROKE)