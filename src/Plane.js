import { vertexObj, edgeObj, assignObj } from "./index.js"
import { vertex } from "./Vertex.js"
import { svg } from "./SVG.js"
import { line } from "./Line.js"

function generatePlane(segment, strokeWidth) {

    clearPlane()
    generateSelectors(segment)
    drawPlane(strokeWidth)

    function generateSelectors(segment) {
        const plane = document.querySelector('#plane')
        const height = plane.offsetHeight
        const interval = Math.ceil(height/segment)
        const radius = 6
        console.log(height, interval)
    
        for (let i = 0; i <= height + radius; i += interval) {
            for (let j=0; j <= height + radius; j += interval) {
                const vertexElem = vertex(radius, 'fill:red')
                vertexElem.style = `left:${i - radius}px;bottom:${j - radius}px`
                plane.append(vertexElem)
            }
        }
    }
}

function clearPlane() {
    const plane = document.querySelector('#plane')
    plane.innerHTML = ''
    let newPlane = plane.cloneNode(true);
    plane.parentNode.replaceChild(newPlane, plane)
}

function drawPlane(strokeWidth) {
    for (let lineId of Object.keys(edgeObj)) {
        let lineCoord = edgeObj[lineId]
        let assignment = assignObj[lineId]
        let strokeColor = assignment == 'U' ? 'black' :
            assignment == 'M' ? 'red' :
            assignment == 'V' ? 'blue' :
            assignment == 'B' ? 'black' :
            'black'
        let start = scaleUpCoords(vertexObj[lineCoord[0]])
        let end = scaleUpCoords(vertexObj[lineCoord[1]])
        drawLine(start, end, strokeWidth, strokeColor, lineId)
    }
}

function drawLine(start, end, strokeWidth, strokeColor, lineId) {
    const plane = document.querySelector('#plane')
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
        svgElem.style = `left:${Math.min(start[0],end[0])-strokeWidth/2}px;bottom:${Math.min(start[1],end[1])}px`
    } else if (yDiff == 0) {
        const newLine =  line(0, strokeWidth/2, width, strokeWidth/2, 
            `stroke:${strokeColor};stroke-width:${strokeWidth}`
        )
        svgElem.append(newLine) 
        svgElem.style = `left:${Math.min(start[0],end[0])}px;bottom:${Math.min(start[1],end[1])-strokeWidth/2}px`
    }else if (xDiff * yDiff < 0) {
        const newLine =  line(0, 0, width, height, `stroke:${strokeColor};stroke-width:${strokeWidth}`)
        svgElem.append(newLine)
        svgElem.style = `left:${Math.min(start[0],end[0])}px;bottom:${Math.min(start[1],end[1])}px`
    } else {
        const newLine =  line(0, height, width, 0, `stroke:${strokeColor};stroke-width:${strokeWidth}`)
        svgElem.append(newLine)
        svgElem.style = `left:${Math.min(start[0],end[0])}px;bottom:${Math.min(start[1],end[1])}px`
    }

    svgElem.classList.add('line');
    svgElem.id = lineId
    plane.append(svgElem)
}

function setDrawTool(stroke) {
    let selected = []
    const plane = document.querySelector('#plane')
    plane.addEventListener('click', (e) => handleVerticeClick(e))
    
    function handleVerticeClick(e) {
        e.preventDefault()
        if (e.target.closest('.vertex')) {
            const vertexElem = e.target.closest('.vertex')
            addToSelected(vertexElem, stroke)
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
        const svgBottom = parseLength(svg.style.bottom)+svgBBox.height/2
        return [svgLeft, svgBottom]
    }

    function addToSelected(vertexElem, strokeWidth) {
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
                addLine(start, end)
                drawPlane(strokeWidth)
            }
            selected = []
        }
    }

    function addLine(start, end) {
        let startId = crypto.randomUUID()
        let endId = crypto.randomUUID()
        let lineId = crypto.randomUUID()
        vertexObj[startId] = scaleDownCoords(start)
        vertexObj[endId] = scaleDownCoords(end)
        edgeObj[lineId] = [startId, endId]
        assignObj[lineId] = "U"
        console.log(vertexObj)
        console.log(edgeObj)
        console.log(assignObj)
    }
}

function scaleDownCoords(coords) {
    const plane = document.querySelector('#plane')
    const height = plane.offsetHeight
    const width = plane.offsetWidth
    let x = coords[0] / width
    let y = coords[1] / height
    return [x, y]
}

function scaleUpCoords(coords) {
    const plane = document.querySelector('#plane')
    const height = plane.offsetHeight
    const width = plane.offsetWidth
    let x = coords[0] * width
    let y = coords[1] * height
    return [x, y]
}

export { generatePlane, clearPlane, setDrawTool }