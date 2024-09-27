
import { generateGrid } from "./Grid.js"
import { initialiseHeader } from "./Header.js"
import { retrieveHistory } from "./History.js"
import { initialiseHelp, setToast } from "./Notifs.js"
import { initialiseOverlay } from "./Overlay.js"
import { enableShortcuts, generatePlane, resetInterface, setSvgPadding, trackCoords } from "./Plane.js"
import { initialisePref } from "./Preferences.js"
import { initialiseSidebar } from "./Sidebar.js"
import { initialiseTools } from "./Tools.js"


export let vertexObj = {}
export let edgeObj = {}
export let assignObj = {}
export const FOLD = require('fold')

export const envVar = {
    'fileDetails': {
        'fileTitle': 'Crease Pattern 1',
        'fileAuthor': '',
        'fileCreator': '',
        'fileSpec': '',
        'fileClasses': []
    },
    'strokeWidth' : 2,
    'segment' : 8,
    'gridlines' : true,
    'edgeType': 'M',
    'width': 600,
    'height': 600,
    'gridVertices': [],
    'assignmentColor': {
        'U' : 'yellow',
        'M' : 'red',
        'V' : 'blue',
        'B' : 'black',
        'F' : 'lightgrey'
    },
    'defaultViewBox': {x: -50, y: -10, width: 700, height: 700},
    'svgPadding': {x: 0, y: 0},
    'activeTool': 'draw'
}

startup()

function startup() {
    retrieveHistory()
    initialisePref()
    initialiseTools()
    initialiseHeader()
    initialiseSidebar()
    initialiseHelp()
    initialiseOverlay()
    generateGrid()
    generatePlane()
    enableShortcuts()
    resetInterface()
    trackCoords()
    setSvgPadding()
}

export function editObjs(newVertexObj, newEdgeObj, newAssignObj) {
    vertexObj = structuredClone(newVertexObj)
    edgeObj = structuredClone(newEdgeObj)
    assignObj = structuredClone(newAssignObj)
}
