import { vertexObj, edgeObj, assignObj, envVar, editObjs} from "./index.js"
import { line as lineVal } from "./Line.js"
import { generateId, exists, getKey, clearElem, cloneElem, closest, distTo, onLine, intersect, acrossPts, bisectPts, bisectAngle, bisectLines, equalLine, within, ontop, getCoordId, grad, equalVal, exact} from "./helper.js"
import { circle } from "./Circle.js"
import { backHistory, forwardHistory, initialiseHistory, overwriteHistory, retrieveHistory } from "./History.js"

function generatePlane() {
    if (!retrieveHistory()) {
        setBorder()
        initialiseHistory()
    }
    drawPattern()
    trackCoords()
    enableGestures()

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
}

function trackCoords() {
    const screen = document.querySelector('#screen')
    screen.addEventListener('mousemove', (e)=>trackMouse(e))
    screen.addEventListener('mouseout', (e)=>resetDisplay(e))

    function trackMouse(e) {
        e.preventDefault()
        const displayX = document.querySelector('#displayX')
        const displayY = document.querySelector('#displayY')
         
        let pointerPosition = getPointFromEvent(e)
        let x = Math.round(pointerPosition.x * 100)/100
        let y = Math.round((envVar.height - pointerPosition.y) * 100)/100
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

 function getPointFromEvent (event) {
    const svg = document.querySelector('svg')
    let point = new DOMPoint()
    point.x = event.clientX
    point.y = event.clientY
    var invertedSVGMatrix = svg.getScreenCTM().inverse()
    return point.matrixTransform(invertedSVGMatrix)
}

function enableGestures() {
    const svg = document.querySelector('svg')
    let spaceDown = false
    let ctrlDown = false

    let cursorCoord

    window.addEventListener('keydown', function(e) {
        switch(e.code) {
            case 'Space':
                spaceDown = true
                svg.style.cursor = 'move'
                break
            case 'ControlLeft' || 'ControlRight':
                ctrlDown = true
                break
            case 'KeyY':
                if (ctrlDown) {
                    handleRedo(e)
                }
                break
            case 'KeyZ':
                if (ctrlDown) {
                    handleUndo(e)
                }
        }  
    })
    window.addEventListener('keyup', function(e) {
        switch(e.code) {
            case 'Space':
                spaceDown = false
                svg.style.cursor = 'default'
                svg.dispatchEvent(new Event('spaceclickup'))
                break
            case 'ControlLeft' || 'ControlRight':
                ctrlDown = false
                break
        }
    })
    svg.addEventListener('mousedown', function (e1) {
        let e2 = new Event('spaceclickdown')
        e2.clientX = e1.clientX
        e2.clientY = e1.clientY
        if (e1.button === 0 && spaceDown) {
            svg.dispatchEvent(e2)
        }
    })
    svg.addEventListener('mouseup', function (e1) {
        let e2 = new Event('spaceclickup')
        e2.clientX = e1.clientX
        e2.clientY = e1.clientY
        if (e1.button === 0 && spaceDown) {
            svg.dispatchEvent(e2)
        }
    })
    
    svg.addEventListener('spaceclickdown', onPointerDown) // Pressing the mouse
    svg.addEventListener('spaceclickup', onPointerUp) // Releasing the mouse
    svg.addEventListener('mouseleave', onPointerUp) // Mouse gets out of the SVG area
    svg.addEventListener('mousemove', onPointerMove) // Mouse is moving
    svg.addEventListener('wheel', onScroll)

    
    let isPointerDown = false
    let pointerOrigin
    let defaultViewBox = envVar.defaultViewBox
    let viewBox = svg.viewBox.baseVal
    let scale = 0

    function onPointerDown(e) {
        isPointerDown = true
        pointerOrigin = getPointFromEvent(e)
    }
    function onPointerUp() {
        isPointerDown = false
      }

    function onPointerMove (e) {
        e.preventDefault();

        cursorCoord = getPointFromEvent(e)
        if (isPointerDown) {
            viewBox.x -= (cursorCoord.x - pointerOrigin.x)
            viewBox.y -= (cursorCoord.y - pointerOrigin.y)
        }
      }

    function onScroll(e) {
        e.preventDefault()
        scale += e.deltaY * -0.001
        // restrict scale
        scale = Math.min(Math.max(-2, scale), 1)

        let newWidth = defaultViewBox.width - envVar.width * scale
        let newHeight = defaultViewBox.height - envVar.height * scale

        viewBox.width = newWidth
        viewBox.height = newHeight
        viewBox.x = cursorCoord.x - e.offsetX * envVar.width / svg.children[0].getBoundingClientRect().width
        viewBox.y = cursorCoord.y - e.offsetY * envVar.height / svg.children[0].getBoundingClientRect().height
    }
    
    function handleUndo(e) {
        e.preventDefault()
        backHistory()
        drawPattern()
    }

    function handleRedo(e) {
        e.preventDefault()
        forwardHistory()
        drawPattern()
    }
}

function resetScreen() {
    const screen = document.querySelector('#screen')
    const markers = document.querySelector('#markers')
    const selectors = document.querySelector('#selectors')
    cloneElem(screen)
    clearElem(screen)
    clearElem(markers)
    clearElem(selectors)
    trackCoords()
}

function resetViewbox(e) {
    e.preventDefault()
    const svg = document.querySelector('svg');
    let viewBox = svg.viewBox.baseVal
    let width = viewBox.width
    let height = viewBox.height
    let x = (envVar.width - width) / 2
    let y = (envVar.height - height) / 2
    viewBox.x = x
    viewBox.y = y
}

function drawPattern() {
    clearElem(plane)
    for (let lineId of Object.keys(edgeObj)) {
        let lineCoord = edgeObj[lineId]
        let assignment = assignObj[lineId]
        let strokeColor = envVar.assignmentColor[assignment]
        let start = scaleUpCoords(vertexObj[lineCoord[0]])
        let end = scaleUpCoords(vertexObj[lineCoord[1]])
        drawLine(lineId, start, end, strokeColor)
    }

    function drawLine(lineId, start, end, 
    strokeColor = envVar.assignmentColor[envVar.edgeType]) {
        const plane = document.querySelector("#plane")
        const newLine = lineVal(start[0], envVar.height - start[1], end[0], envVar.height - end[1], `stroke:${strokeColor};stroke-width:${envVar.strokeWidth}`, lineId)
        newLine.addEventListener('click', e => handleDeleteLine(e))
        plane.append(newLine)
    
        function handleDeleteLine(e) {
            e.preventDefault()
            if (e.target) {
                let lineId = e.target.id
                deleteLineSeg(lineId)
                drawPattern()
                overwriteHistory()
            }
        }
    }
}

// right click in draw and bisector tool to toggle edge assignment
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
        if (onLine([start, end], cursorCoord)) {
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
                overwriteHistory()
            }
        }
    }
}

function setDrawTool() {
    const screen = document.querySelector('#screen')
    const pointer = document.querySelector('#pointer')
    
    let selectedPointer = []
    let currLine = [[0,0],[0,0]] 
    let currDist = Infinity
    
    screen.style.display = 'block'
    screen.addEventListener('mousemove', (e)=>trackPointer(e))
    screen.addEventListener('mouseleave', (e)=>removePointer(e));
    screen.addEventListener('click', (e)=>handlePointerClick(e))
    screen.addEventListener('contextmenu', e => toggleAssign(e))

    function trackPointer(e) {
        e.preventDefault()
        let pointerPosition = getPointFromEvent(e)
        let x = Math.round(pointerPosition.x * 100)/100
        let y = Math.round((envVar.height - pointerPosition.y) * 100)/100

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
                if (onLine([[x1, y1], [x2, y2]], verticeCoord)) {
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
            pointer.style.display = 'block'
        } else {
            pointer.style.display = 'none'
        }
    }

    function removePointer(e) {
        e.preventDefault();
        pointer.style.display = 'none'
    }

    function handlePointerClick(e) {
        e.preventDefault()
        let pointerCoord = getSelectedCoord(pointer)
        if (pointer.style.display == 'block') {
            selectedPointer.push(pointerCoord)
            if (selectedPointer.length >= 2) {
                for (let marker of document.querySelectorAll('.marker')) {
                    marker.remove()
                }
                addLine(selectedPointer[0], selectedPointer[1])
                drawPattern()
                overwriteHistory()
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
    const markers = document.querySelector('#markers')
    const selectors = document.querySelector('#selectors')

    screen.style.display = 'block'
    screen.addEventListener('contextmenu', e => toggleAssign(e))
    generateVertSelectors()

    function generateVertSelectors() {
        for (let vertex of Object.values(vertexObj)) {
            addVertSelector(scaleUpCoords(vertex))
        }
    }

    function addVertSelector(coord) {
        const vertex = new circle(6, 0, 0, 'position: absolute;')
        vertex.style = `position:absolute;display:block;transform:translate(${coord[0]}px,${envVar.height - coord[1]}px);fill:blue;`
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
        const newLine = lineVal(start[0], envVar.height - start[1], end[0], envVar.height - end[1], `position:absolute;stroke:blue;stroke-width:${envVar.strokeWidth * 2}; z-index: 1;`)

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
            overwriteHistory()
            clearElem(markers)
            clearElem(selectors)
            vertexList.length = 0
            generateVertSelectors()
        }
    }
}

function setDeleteTool() {
    const screen = document.querySelector('#screen')
    screen.style.display = 'none'   
}

function addMarker(coord) {
    const markers = document.querySelector('#markers')
    const marker = new circle(6, 0, 0, 'fill: red')
    marker.style = `position:absolute;display:block;transform:translate(${coord[0]}px, ${envVar.height - (coord[1])}px); fill:${envVar.assignmentColor[envVar.edgeType]}; z-index:2`
    marker.classList.add('marker')
    markers.append(marker)
}


function getSelectedCoord(elem) {
    let matrix = new WebKitCSSMatrix(window.getComputedStyle(elem).transform);
    return [matrix.m41, envVar.height - matrix.m42]
}

function addLine(start, end, assign = envVar.edgeType) {
    
    let sStart = scaleDownCoords(start)
    let sEnd = scaleDownCoords(end)

    let linesToBreak = {}
    let ptsOnAddedLine = []
    let pointIdsToMerge = []
    // if added edge cuts through existing edge, split edges up and add vertices
    for (let [lineId, lineVal] of Object.entries(edgeObj)) {
        let startId = lineVal[0]
        let endId = lineVal[1]
        let lineStart = vertexObj[startId]
        let lineEnd = vertexObj[endId]
        let line = [lineStart, lineEnd]

        // handle overwriting when added edge overlap with existing edges
        if (onLine(line, sStart) && onLine(line, sEnd)) {
            // any line point that is within existing line
            if (within(sStart[0], lineStart[0], lineEnd[0]) || within(sStart[1], lineStart[1], lineEnd[1])) {
                linesToBreak[lineId] = [sStart]
            }
            if (within(sEnd[0], lineStart[0], lineEnd[0]) || within(sEnd[1], lineStart[1], lineEnd[1])) {
                if (Object.keys(linesToBreak).includes(lineId)) {
                    linesToBreak[lineId].push(sEnd)
                } else {
                    linesToBreak[lineId] = [sEnd]
                }
            }

            if (within(lineStart[0], sStart[0], sEnd[0]) || within(lineStart[1], sStart[1], sEnd[1])) {
                ptsOnAddedLine.push(lineStart)
                pointIdsToMerge.push(startId)
            }
            if (within(lineEnd[0], sStart[0], sEnd[0]) || within(lineEnd[1], sStart[1], sEnd[1])) {
                ptsOnAddedLine.push(lineEnd)
                pointIdsToMerge.push(endId)
            }
        } else {
            let intersectPt = intersect([sStart, sEnd], line)
            // intersection point is defined and on top of both existing line and line to be drawn
            if (intersectPt && ontop(intersectPt[0], lineStart[0], lineEnd[0]) && ontop(intersectPt[1], lineStart[1], lineEnd[1]) && ontop(intersectPt[0], sStart[0], sEnd[0]) && ontop(intersectPt[1], sStart[1], sEnd[1])) {
                // cuts an existng line
                if (within(intersectPt[0], lineStart[0], lineEnd[0]) || within(intersectPt[1], lineStart[1], lineEnd[1])) {
                    linesToBreak[lineId] = [intersectPt]
                }
                // cuts the line to be drawn
                if (within(intersectPt[0], sStart[0], sEnd[0]) || within(intersectPt[1], sStart[1], sEnd[1])) {
                    ptsOnAddedLine.push(intersectPt)
                }
            }
        }
        
    }

    for (let [lineId, points] of Object.entries(linesToBreak)) {
        breakLine(lineId, points)
    }
    let addedLineId = addLineSeg(start, end, assign)
    if (ptsOnAddedLine.length > 0) {
        breakLine(addedLineId, ptsOnAddedLine)
    }
    for (let pointId of pointIdsToMerge) {
        joinLineSeg(pointId)
    }

}

function addLineSeg(start, end, assign = envVar.edgeType) {
    
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
    return lineId
}

function deleteLineSeg(lineId) {
    let startId = edgeObj[lineId][0]
    let endId = edgeObj[lineId][1]
    delete edgeObj[lineId]
    delete assignObj[lineId]

    joinLineSeg(startId)
    joinLineSeg(endId)
}

// merge existing edges that contain a given vertex if they have the same gradient and have the same assignment
function joinLineSeg(ptId) {
    let linesWithPt = Object.keys(edgeObj).filter(lineId => edgeObj[lineId].includes(ptId))
    if (linesWithPt.length == 2) {
        let line1Id = linesWithPt[0]
        let start1Id = edgeObj[line1Id][0]
        let end1Id = edgeObj[line1Id][1]
        let line1Grad = grad(vertexObj[start1Id][0], vertexObj[start1Id][1], vertexObj[end1Id][0], vertexObj[end1Id][1])

        let line2Id = linesWithPt[1]
        let start2Id = edgeObj[line2Id][0]
        let end2Id = edgeObj[line2Id][1]
        let line2Grad = grad(vertexObj[start2Id][0], vertexObj[start2Id][1], vertexObj[end2Id][0], vertexObj[end2Id][1])
        if (equalVal(line1Grad, line2Grad) && 
            assignObj[line1Id] == assignObj[line2Id]) {
            let edgeAssign = assignObj[line1Id]
            let newStart = start1Id != ptId ? start1Id : end1Id
            let newEnd = start2Id != ptId ? start2Id : end2Id
            delete edgeObj[line1Id]
            delete assignObj[line1Id]
            delete edgeObj[line2Id]
            delete assignObj[line2Id]
            delete vertexObj[ptId]
            let newLineId = generateId(edgeObj)
            edgeObj[newLineId] = [newStart, newEnd]
            assignObj[newLineId] = edgeAssign
        }
    }
}

function breakLine(lineId, points) {
    let startId = edgeObj[lineId][0]
    let endId = edgeObj[lineId][1]
    let start = vertexObj[startId]
    let end = vertexObj[endId]
    let assign = assignObj[lineId]

    let segObj = {"0" : start, "1" : end}

    for (let point of points) {
        let segSize = (start[0] - end[0]) != 0 ? 
            (point[0] - start[0]) / (end[0] - start[0]) : 
            (point[1] - start[1]) / (end[1] - start[1])
        segObj[segSize] = point
    }
    let linePtArr = []
    for (let seg of Object.keys(segObj).sort()) {
        linePtArr.push(segObj[seg])
    }
    let lineSegArr = []
    for (let i = 0; i < linePtArr.length - 1; i++) {
        lineSegArr.push([linePtArr[i], linePtArr[i + 1]])
    }
    console.log('break line ' + [start, end] + ' with ' + lineSegArr)
    delete edgeObj[lineId]
    delete assignObj[lineId]
    for (let lineSeg of lineSegArr) {
        let segStart = scaleUpCoords(lineSeg[0])
        let segEnd = scaleUpCoords(lineSeg[1])
        addLineSeg(segStart, segEnd, assign)
    }
}

function scaleDownCoords(coords) {
    let height = envVar.height
    let width = envVar.width
    let x = coords[0] / width
    let y = coords[1] / height
    return [exact(x), exact(y)]
}

function scaleUpCoords(coords) {
    let height = envVar.height
    let width = envVar.width
    let x = coords[0] * width
    let y = coords[1] * height
    return [exact(x), exact(y)]
}

export { generatePlane, resetScreen, setDrawTool, setBisectorTool, setDeleteTool, enableGestures, resetViewbox, drawPattern }