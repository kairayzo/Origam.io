import { initialiseForm } from "./Form.js"
import { generateGrid } from "./Grid.js"
import { generatePlane, setDrawTool } from "./Plane.js"
import { initialiseExportForm } from "./ExportForm.js"

export let vertexObj = {}
export let edgeObj = {}
export let assignObj = {}
export const FOLD = require('fold')

const DEFAULT_SEGMENT = 8
const DEFAULT_STROKE = 2
export const envVar = {
    'strokeWidth' : DEFAULT_STROKE,
    'segment' : DEFAULT_SEGMENT,
    'gridlines' : false,
    'file': '',
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
    'defaultViewBox': {x: -50, y: -50, width: 700, height: 700}
}

startup()

function startup() {
    initialiseForm()
    generateGrid()
    generatePlane()
    setDrawTool()
}

export function editObjs(newVertexObj, newEdgeObj, newAssignObj) {
    vertexObj = structuredClone(newVertexObj)
    edgeObj = structuredClone(newEdgeObj)
    assignObj = structuredClone(newAssignObj)
    console.log(vertexObj, edgeObj, assignObj)
}
