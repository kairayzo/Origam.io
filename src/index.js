import { initialiseForm } from "./Form.js"
import { generateGrid } from "./Grid.js"
import { generatePlane, setDrawTool } from "./Plane.js"
import { initialiseExportForm } from "./ExportForm.js"

export const vertexObj = {}
export const edgeObj = {}
export const assignObj = {}
export const FOLD = require('fold')

const DEFAULT_SEGMENT = 8
const DEFAULT_STROKE = 2
export const envVar = {
    'strokeWidth' : DEFAULT_STROKE,
    'segment' : DEFAULT_SEGMENT,
    'gridlines' : false,
    'file': '',
    'width': 600,
    'height': 600,
    'gridVertices': []
}

startup()


function startup() {
    initialiseForm()
    initialiseExportForm()
    generateGrid()
    generatePlane()
    setDrawTool()
}
