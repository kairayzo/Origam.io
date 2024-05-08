import { vertexObj, edgeObj, assignObj, envVar} from "./index.js"
import { line as lineVal } from "./Line.js"
import { generateId, exists, getKey, clearElem, cloneElem, closest, distTo, onLine, intersect, acrossPts, bisectPts, bisectAngle, bisectLines, equalLine, within, ontop, getCoordId} from "./helper.js"
import { circle } from "./Circle.js"

function generatePlane() {
    const plane = document.querySelector('#plane')
    clearElem(plane)
    setBorder()
    drawPattern()
    trackCoords()
}

function resetScreen() {
    const screen = document.querySelector('#screen')
    cloneElem(screen)
    trackCoords()
    clearMarkers()
    clearSelectors()
}

function setBorder() {
    const width = envVar.width
    const height = envVar.height
    let borderLines = [
        [[0, 0], [width, 0]],
        [[0, 0], [0, height]],
        [[width, 0], [width, height]],
        [[0,height],[width,height]]
    ]
    for (let line of borderLines) {
        addLine(line[0],line[1], 'B')
    }
}

function drawPattern() {
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
        drawLine(lineId, start, end, strokeColor)
    }
}

function trackCoords() {
    const screen = document.querySelector('#screen')
    screen.addEventListener('mousemove', (e)=>trackMouse(e))
    screen.addEventListener('mouseout', (e)=>resetDisplay(e))
    function trackMouse(e) {
        e.preventDefault()
        const displayX = document.querySelector('#displayX')
        const displayY = document.querySelector('#displayY')
        let rect = paper.getBoundingClientRect()
        let height = envVar.height
        let x = Math.round((e.clientX - rect.left) * 100) / 100
        let y = Math.round((height - (e.clientY - rect.top)) * 100) / 100
        displayX.innerHTML = `x: ${x}`
        displayY.innerHTML = `y: ${y}`
    }
    function resetDisplay(e) {
        e.preventDefault()
        const displayX = document.querySelector('#displayX')
        const displayY = document.querySelector('#displayY')
        displayX.innerHTML = `x: 0`
        displayY.innerHTML = `y: 0`
    }
 }

function toggleAssign(e) {
    e.preventDefault
    const paper = document.querySelector('#paper')
    let rect = paper.getBoundingClientRect()
    let height = envVar.height
    let x = e.clientX - rect.left
    let y = height - (e.clientY - rect.top)
    let cursorCoord = scaleDownCoords([x,y])
    for (let [lineId, lineVal] of Object.entries(edgeObj)) {
        let startId = lineVal[0]
        let endId = lineVal[1]
        let start = vertexObj[startId]
        let end = vertexObj[endId]
        if (onLine(start[0], start[1], end[0], end[1], cursorCoord)) {
            if (within(cursorCoord[0], start[0], end[0]) || within(cursorCoord[1], start[1], end[1])) {
                let lineAssign = assignObj[lineId]
                switch(lineAssign) {
                    case 'U':
                        assignObj[lineId] = 'M'
                        break
                    case 'M':
                        assignObj[lineId] = 'V'
                        break
                    case 'V':
                        assignObj[lineId] = 'M'
                        break
                    default:
                        assignObj[lineId] = 'M'
                }
                drawPattern()
            }
        }
    }
}

function setDrawTool() {
    const screen = document.querySelector('#screen')
    let selectedPointer = []
    let currLine = [[0,0],[0,0]] 
    let currDist = Infinity
    screen.addEventListener('mousemove', (e)=>trackPointer(e))
    screen.addEventListener('mouseleave', (e)=>removePointer(e));
    screen.addEventListener('click', (e)=>handlePointerClick(e))
    screen.addEventListener('contextmenu', e => toggleAssign(e))

    function trackPointer(e) {
        e.preventDefault()
        const screen = document.querySelector('#screen')
        const pointer = document.querySelector('#pointer')
        let rect = screen.getBoundingClientRect()
        let height = envVar.height
        let x = e.clientX - rect.left
        let y = height - (e.clientY - rect.top)

        // find min distance to any edge
        // find coordinates and edge of min distance
        let distLineMap = {}
        let coordLineMap = {}
        for (let lineElem of plane.children) {
            let x1 = lineElem.x1.baseVal.value
            let x2 = lineElem.x2.baseVal.value
            let y1 = envVar.height - lineElem.y1.baseVal.value
            let y2 = envVar.height - lineElem.y2.baseVal.value
            let coord = closest(x1, y1, x2, y2, [x, y])
            distLineMap[distTo(coord, [x, y])] = coord
            coordLineMap[coord] = [[x1, y1], [x2, y2]]
        }
        let minDistToLine = Math.min.apply(null, Object.keys(distLineMap))
        let cursorCoord = distLineMap[minDistToLine]
        let newLine = coordLineMap[cursorCoord]

        // find min distance to any grid vertex or line vertex
        let distPtMap = {}
        for (let gridVertex of envVar.gridVertices) {
            distPtMap[distTo(cursorCoord, gridVertex)] = gridVertex
        }
        for (let vertex of Object.values(vertexObj)) {
            let scaledVertex = scaleUpCoords(vertex)
            distPtMap[distTo(cursorCoord, scaledVertex)] = scaledVertex
        }
        let minDistToVert = Math.min.apply(null, Object.keys(distPtMap))
        let verticeCoord = distPtMap[minDistToVert]

        // snap to closest vertex if vertex is on any edge
        if (minDistToVert < 10) {
            for (let lineElem of plane.children) {
                let x1 = lineElem.x1.baseVal.value
                let x2 = lineElem.x2.baseVal.value
                let y1 = envVar.height - lineElem.y1.baseVal.value
                let y2 = envVar.height - lineElem.y2.baseVal.value
                if (onLine(x1, y1, x2, y2, verticeCoord)) {
                    cursorCoord = verticeCoord
                }
            }
        }

        // update pointer position
        if ((!equalLine(currLine, newLine) && minDistToLine < currDist - 5) || equalLine(currLine, newLine)) {
            pointer.style.transform = `translate(${cursorCoord[0]}px, ${envVar.height - (cursorCoord[1])}px)`
        }
        currLine = newLine
        currDist = minDistToLine
        
        // show pointer if it is close to cursor
        if (minDistToLine < 20) {
            // pointerVisible = true
            pointer.style.display = 'block'
        } else {
            // pointerVisible = false
            pointer.style.display = 'none'
        }
    }

    function removePointer(e) {
        e.preventDefault();
        const pointer = document.querySelector('#pointer')
        pointer.style.display = 'none'
    }

    function handlePointerClick(e) {
        e.preventDefault()
        const pointer = document.querySelector('#pointer')
        let pointerCoord = getSelectedCoord(pointer)
        if (pointer.style.display == 'block') {
            selectedPointer.push(pointerCoord)
            if (selectedPointer.length >= 2) {
                for (let marker of document.querySelectorAll('.marker')) {
                    marker.remove()
                }
                addLine(selectedPointer[0], selectedPointer[1])
                drawPattern()
                selectedPointer = []
            } else {
                addMarker(pointerCoord)
            }
        }
    }

    
}

function setBisectorTool() {
    const vertexList = []
    const screen = document.querySelector('#screen')

    screen.addEventListener('contextmenu', e => toggleAssign(e))
    generateVertSelectors()

    function generateVertSelectors() {
        for (let vertex of Object.values(vertexObj)) {
            addVertSelector(scaleUpCoords(vertex))
        }
    }

    function addVertSelector(coord) {
        const selectors = document.querySelector('#selectors')
        const vertex = new circle(6, 0, 0, 'position: absolute;')
        vertex.style = `position:absolute;display:block;transform:translate(${coord[0]}px,${envVar.height - coord[1]}px);fill:blue; hover::transform:scale(1.5)`
        vertex.addEventListener('click', (e) => handleSelectorClick(e))
        vertex.classList.add('selector')
        selectors.append(vertex)
    }
    
    function handleSelectorClick(e) {
        e.preventDefault();
        if (e.target) {
            let selector = e.target.closest('.selector')
            let selectorCoord = getSelectedCoord(selector)
            if (!vertexList.includes(selectorCoord)) {
                vertexList.push(selectorCoord)
                addMarker(selectorCoord)
                selector.remove()
                generateLineSelectors(vertexList)
            }
        }
    }

    function generateLineSelectors(vertexList) {
        for (let lineSelector of document.querySelectorAll('line.selector')) {
            lineSelector.remove()
        }
        let size = vertexList.length
        switch (size) {
            case 2:
                let lineAcross1 = acrossPts(vertexList[0], vertexList[1])
                let lineBisect1 = bisectPts(vertexList[0], vertexList[1])
                addLineSelector(lineAcross1[0], lineAcross1[1])
                addLineSelector(lineBisect1[0], lineBisect1[1])
                break
            case 3:
                let angleBisect1 = bisectAngle(vertexList[1], vertexList[0], vertexList[2])
                let angleBisect2 = bisectAngle(vertexList[0], vertexList[1], vertexList[2])
                addLineSelector(angleBisect1[0], angleBisect1[1])
                addLineSelector(angleBisect2[0], angleBisect2[1])
                break
            case 4:
                let linesBisect1 = bisectLines(vertexList[0], vertexList[1], vertexList[2], vertexList[3])[0]
                let linesBisect2 = bisectLines(vertexList[0], vertexList[1], vertexList[2], vertexList[3])[1]
                addLineSelector(linesBisect1[0], linesBisect1[1])
                addLineSelector(linesBisect2[0], linesBisect2[1])
                break
        }
    }
    
    function addLineSelector(start, end) {
        const selectors = document.querySelector('#selectors')
        const newLine = lineVal(start[0], envVar.height - start[1], end[0], envVar.height - end[1], `position:absolute;stroke:blue;stroke-width:${envVar.strokeWidth * 2}; z-index: 1`)

        newLine.classList.add('selector')
        newLine.addEventListener('click', (e) => handleLineSelectorClick(e))
        selectors.append(newLine);
    }

    function handleLineSelectorClick(e) {
        e.preventDefault()
        if (e.target) {
            const lineElem = e.target
            let x1 = lineElem.x1.baseVal.value
            let x2 = lineElem.x2.baseVal.value
            let y1 = envVar.height - lineElem.y1.baseVal.value
            let y2 = envVar.height - lineElem.y2.baseVal.value
            addLine([x1, y1], [x2, y2])
            drawPattern()
            clearMarkers()
            clearSelectors()
            vertexList.length = 0
            generateVertSelectors()
        }
    }
}

function addMarker(coord) {
    const markers = document.querySelector('#markers')
    const marker = new circle(6, 0, 0, 'fill: red')
    marker.style = `position:absolute;display:block;transform:translate(${coord[0]}px, ${envVar.height - (coord[1])}px); fill:red; z-index:2`
    marker.classList.add('marker')
    markers.append(marker)
}

function clearMarkers() {
    for (let marker of document.querySelectorAll('.marker')) {
        marker.remove()
    }
}

function clearSelectors() {
    for (let selector of document.querySelectorAll('.selector')) {
        selector.remove()
    }
}

function getSelectedCoord(elem) {
    let matrix = new WebKitCSSMatrix(window.getComputedStyle(elem).transform);
    return [matrix.m41, envVar.height - matrix.m42]
}

function drawLine(lineId, start, end, strokeColor = 'black') {
    const plane = document.querySelector("#plane")
    const newLine = lineVal(start[0], envVar.height - start[1], end[0], envVar.height - end[1], `stroke:${strokeColor};stroke-width:${envVar.strokeWidth}`, lineId)
    plane.append(newLine);
}

function addLine(start, end, assign = "U") {
    
    let sStart = scaleDownCoords(start)
    let sEnd = scaleDownCoords(end)

    // if added line cuts through existing line, split lines up and add vertices
    let intersectObj = {
        "0" : sStart,
        "1" : sEnd
    }
    let breakArr = []
    for (let [lineId, lineVal] of Object.entries(edgeObj)) {
        let startId = lineVal[0]
        let endId = lineVal[1]
        let start = vertexObj[startId]
        let end = vertexObj[endId]
        let line = [start, end]
        let intersectPt = intersect([sStart, sEnd], line)

        // intersection point is defined and is on top of both existing line and line to be drawn
        if (intersectPt && ontop(intersectPt[0], start[0], end[0]) && ontop(intersectPt[1], start[1], end[1]) && ontop(intersectPt[0], sStart[0], sEnd[0]) && ontop(intersectPt[1], sStart[1], sEnd[1])) {
            // cuts an existng line
            if (within(intersectPt[0], start[0], end[0]) || within(intersectPt[1], start[1], end[1])) {
                breakArr.push([lineId, intersectPt])
            }
            // cuts the line to be drawn
            if (within(intersectPt[0], sStart[0], sEnd[0]) || within(intersectPt[1], sStart[1], sEnd[1])) {
                let lineSegSize = (sEnd[0] - sStart[0]) != 0 ? 
                    (intersectPt[0] - sStart[0]) / (sEnd[0] - sStart[0]) : 
                    (intersectPt[1] - sStart[1]) / (sEnd[1] - sStart[1])
                    intersectObj[lineSegSize] = intersectPt
            }
        }
    }

    // break lines that the new line passes through
    for (let [lineId, intersectPt] of breakArr) {
        breakLine(lineId, intersectPt)
    }

    // add line
    if (Object.keys(intersectObj).length > 2) {
        let linePtArr = []
        for (let lineSeg of Object.keys(intersectObj).sort()) {
            linePtArr.push(intersectObj[lineSeg])
        }
        let lineSegArr = []
        for (let i = 0; i < linePtArr.length - 1; i++) {
            lineSegArr.push([linePtArr[i], linePtArr[i + 1]])
        }
        for (let lineSeg of lineSegArr) {
            let segStart = scaleUpCoords(lineSeg[0])
            let segEnd = scaleUpCoords(lineSeg[1])
            addLineSeg(segStart, segEnd, assign)
        }
    } else {
        addLineSeg(start, end, assign)
    }
}

// detect line crossings
function addLineSeg(start, end, assign = "U") {
    
    let sStart = scaleDownCoords(start)
    let sEnd = scaleDownCoords(end)
    let lineId
    let startId = getCoordId(sStart)
    let endId = getCoordId(sEnd)

    if (exists(edgeObj, [startId, endId])) {
        lineId = getKey(edgeObj, [startId, endId])
    } else if (exists(edgeObj, [endId, startId])) {
        lineId = getKey(edgeObj, [endId, startId])
    } else {
        lineId = generateId(edgeObj)
    }

    vertexObj[startId] = sStart
    vertexObj[endId] = sEnd
    edgeObj[lineId] = [startId, endId]
    assignObj[lineId] = assign
    console.log("add line " + sStart + " " + sEnd)
}

function breakLine(lineId, intersect) {
    let line = edgeObj[lineId]
    let assign = assignObj[lineId]
    let intersectId = getCoordId(intersect)
    let startId = line[0]
    let endId = line[1]


    console.log("break " + [vertexObj[startId], vertexObj[endId]] + " with " + intersect)
    
    vertexObj[intersectId] = intersect
    edgeObj[lineId] = [startId, intersectId]
    let newEdgeId = generateId(edgeObj)
    edgeObj[newEdgeId] = [intersectId, endId]
    assignObj[newEdgeId] = assign
}

function scaleDownCoords(coords) {
    let height = envVar.height
    let width = envVar.width
    let x = coords[0] / width
    let y = coords[1] / height
    return [x, y]
}

function scaleUpCoords(coords) {
    let height = envVar.height
    let width = envVar.width
    let x = coords[0] * width
    let y = coords[1] * height
    return [x, y]
}

export { generatePlane, resetScreen, setDrawTool, setBisectorTool }