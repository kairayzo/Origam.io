import { Line } from "./Line.js"
import { Circle } from "./Circle.js"
import { SVG } from "./SVG.js"
import { Vertice } from "./Vertice.js"

const DEFAULT_SEGMENT = 8

const grid = document.querySelector('#grid')
const form = document.querySelector('#menu')
const segInput = document.querySelector('#segment')
segInput.value = DEFAULT_SEGMENT
form.addEventListener('submit',(e)=>render(e))

function clearGrid() {
    const grid = document.querySelector('#grid')
    grid.innerHTML = ''
}

function generateGridlines(segment) {
    const grid = document.querySelector('#grid')
    const height = grid.offsetHeight
    const interval = Math.ceil(height/segment)
    console.log(height, interval)

    const svgElem = new SVG(height, height)
    for (let i=interval; i<height; i+=interval) {
        const lineElemX = new Line(0, i, height, i, 'stroke:red;stroke-width:2')
        const lineElemY = new Line(i, 0, i, height, 'stroke:red;stroke-width:2')
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

    for (let i=0; i<=height+radius; i+=interval) {
        for (let j=0; j<=height+radius; j+=interval) {
            const vertice = new Vertice(radius, 'fill:red')
            vertice.style = `left:${i-radius}px;top:${j-radius}px`
            grid.append(vertice)

            // const svgElem = new SVG(radius*2, radius*2)
            // const circleElem = new Circle(radius, radius, radius, 'fill:red')
            // svgElem.classList.add("opacity-0")
            // svgElem.classList.add("transition")
            // svgElem.classList.add("hover:opacity-100")
            // svgElem.append(circleElem)
            // svgElem.style = `left:${i-radius-2}px;top:${j-radius-2}px`
            // grid.append(svgElem)
        }
    }
}

function setDrawTool() {
    let selected = []
    grid.addEventListener('click', (e) => handleVerticeClick(e))
    
    function handleVerticeClick(e) {
        e.preventDefault()
        if (e.target.closest('.vertice')) {
            const verticeElem = e.target.closest('.vertice')
            // const verticeBBox = verticeElem.getBBox()
            // const verticeLeft = parseLength(verticeElem.style.left)+verticeBBox.width/2
            // const verticeTop = parseLength(verticeElem.style.top)+verticeBBox.height/2
            addToSelected(verticeElem)
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

    function addToSelected(verticeElem) {
        if (selected.length == 0) {
            verticeElem.classList.remove(...['opacity-0', 'transition', 'hover:opacity-100'])
            selected.push(verticeElem)
        } else {
            let startVertice = selected[0]
            startVertice.classList.add(...['opacity-0', 'transition', 'hover:opacity-100'])
            let start = getSvgCoords(selected[0])
            let end = getSvgCoords(verticeElem)
            console.log(start, end)
            if (start.toString() !== end.toString()) {
                drawLine(start, end, 'black', 2)
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

        const svgElem = new SVG(Math.max(strokeWidth,width), Math.max(strokeWidth,height))
        if (xDiff == 0) {
            const newLine =  new Line(strokeWidth/2, 0, strokeWidth/2, height, 
                `stroke:${strokeColor};stroke-width:${strokeWidth}`
            )
            svgElem.append(newLine) 
            svgElem.style = `left:${Math.min(start[0],end[0])-strokeWidth/2}px;top:${Math.min(start[1],end[1])}px`
        } else if (yDiff == 0) {
            const newLine =  new Line(0, strokeWidth/2, width, strokeWidth/2, 
                `stroke:${strokeColor};stroke-width:${strokeWidth}`
            )
            svgElem.append(newLine) 
            svgElem.style = `left:${Math.min(start[0],end[0])}px;top:${Math.min(start[1],end[1])-strokeWidth/2}px`
        }else if (xDiff * yDiff > 0) {
            const newLine =  new Line(0, 0, width, height, `stroke:${strokeColor};stroke-width:${strokeWidth}`)
            svgElem.append(newLine)
            svgElem.style = `left:${Math.min(start[0],end[0])}px;top:${Math.min(start[1],end[1])}px`
        } else {
            const newLine =  new Line(0, height, width, 0, `stroke:${strokeColor};stroke-width:${strokeWidth}`)
            svgElem.append(newLine)
            svgElem.style = `left:${Math.min(start[0],end[0])}px;top:${Math.min(start[1],end[1])}px`
        }
        
        // console.log(svgElem)
        grid.append(svgElem)
    }

}

function render(e) {
    e.preventDefault()
    const segInput = document.querySelector('#segment')
    const segment = segInput.value
    clearGrid()
    generateGridlines(segment)
    generateSelectors(segment)
    setDrawTool()
}

generateGridlines(DEFAULT_SEGMENT)
generateSelectors(DEFAULT_SEGMENT)