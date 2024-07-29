import { initialiseForm } from "./Form.js"
import { generateGrid } from "./Grid.js"
import { enableShortcuts, generatePlane, resetScreen } from "./Plane.js"

export let vertexObj = {}
export let edgeObj = {}
export let assignObj = {}
export const FOLD = require('fold')

export const envVar = {
    'strokeWidth' : 2,
    'segment' : 8,
    'gridlines' : true,
    'activeFile': '',
    'edgeType': 'M',
    'width': 600,
    'height': 600,
    'gridVertices': [],
    'assignmentColor': {
        'U' : 'yellow',
        'M' : 'red',
        'V' : 'blue',
        'B' : 'black',
        'F' : 'lightgray'
    },
    'defaultViewBox': {x: -50, y: -50, width: 700, height: 700},
    'activeTool': 'draw'
}

startup()

function startup() {
    initialiseForm()
    generateGrid()
    generatePlane()
    enableShortcuts()
    resetScreen()
}

export function editObjs(newVertexObj, newEdgeObj, newAssignObj) {
    vertexObj = structuredClone(newVertexObj)
    edgeObj = structuredClone(newEdgeObj)
    assignObj = structuredClone(newAssignObj)
}
