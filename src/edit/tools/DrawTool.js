import * as backend from "../../backend/backend.js"

const interf = document.querySelector('#interface')
const screen = document.querySelector('#screen')
const pointer = document.querySelector('#pointer')

let selectedPointer = []

export default function setDrawTool() {
    interf.addEventListener('mousemove', snapPointer)
    interf.addEventListener('mouseleave', removePointer)
    screen.addEventListener('click', handlePointerClick)
    screen.addEventListener('contextmenu', backend.draw.toggleAssign)

    // cleanup code on unmount
    return () => {
        pointer.style.display = 'none'
        interf.removeEventListener('mousemove', snapPointer)
        interf.removeEventListener('mouseleave', removePointer)
        screen.removeEventListener('click', handlePointerClick)
        screen.removeEventListener('contextmenu', backend.draw.toggleAssign)
    }
}

function snapPointer(e) { 
    e.preventDefault()
    let pointerPosition = backend.draw.getPointFromEvent(e)
    let x = pointerPosition.x
    let y = backend.data.envVar.height - pointerPosition.y
    let cursorCoord = [x, y]
    let snapToVert = false;

    // find min distance to any edge
    // find coordinates and edge of min distance
    let distEdgeMap = {}
    let coordEdgeMap = {}
    for (let lineElem of plane.children) {
        let x1 = lineElem.x1.baseVal.value
        let x2 = lineElem.x2.baseVal.value
        let y1 = backend.data.envVar.height - lineElem.y1.baseVal.value
        let y2 = backend.data.envVar.height - lineElem.y2.baseVal.value
        let closestCoord = backend.geom.closest(x1, y1, x2, y2, cursorCoord)
        distEdgeMap[backend.geom.distTo(closestCoord, cursorCoord)] = closestCoord
        coordEdgeMap[closestCoord] = [[x1, y1], [x2, y2]]
    }
    let minDistToLine = Math.min.apply(null, Object.keys(distEdgeMap))

    if (minDistToLine < 10) {
        cursorCoord = distEdgeMap[minDistToLine]
    }

    // find min distance to any grid vertex or edge vertex
    // consider grid vertices only if gridlines are enabled
    let distPtMap = {}
    if (backend.data.envVar.gridlines) {
        for (let gridVertex of backend.data.envVar.gridVertices) {
            distPtMap[backend.geom.distTo(cursorCoord, gridVertex)] = gridVertex
        }
    }
    for (let vertex of Object.values(backend.data.vertexObj)) {
        let scaledVertex = backend.draw.scaleUpCoords(vertex)
        distPtMap[backend.geom.distTo(cursorCoord, scaledVertex)] = scaledVertex
    }
    let minDistToVert = Math.min.apply(null, Object.keys(distPtMap))
    let verticeCoord = distPtMap[minDistToVert]

    // snap to closest vertex if vertex is on any edge
    if (minDistToVert < 5) {
        cursorCoord = verticeCoord
        snapToVert = true
    } else {
        snapToVert = false
    }

    let newX = cursorCoord[0]
    let newY = backend.data.envVar.height - cursorCoord[1]

    // update pointer position and styling
    pointer.style.display = 'block'
    pointer.style.transform = `translate(${newX}px, ${newY}px)`
    if (snapToVert) {
        pointer.classList.add('with-border')
    } else {
        pointer.classList.remove('with-border')
    }
}

function removePointer(e) {
    e.preventDefault();
    pointer.style.display = 'none'
}

function handlePointerClick(e) {
    e.preventDefault()
    let pointerCoord = backend.draw.getElemCoord(pointer)
    if (backend.geom.ontop(pointerCoord[0], 0, backend.data.envVar.width) && backend.geom.ontop(pointerCoord[1], 0, backend.data.envVar.height)) {
        selectedPointer.push(pointerCoord)
        if (selectedPointer.length >= 2) {
            backend.draw.addLine(selectedPointer[0], selectedPointer[1])
            selectedPointer = []
        } else {
            let withBorder = pointer.classList.contains('with-border')
            backend.draw.addVertSelector(pointerCoord, resetInterface, withBorder)
        }
    }
}