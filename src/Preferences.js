import { vertexObj, edgeObj, assignObj, envVar } from "./index.js"
import { generateId, toggleElemVisibility } from "./helper.js"
import { generateGrid, toggleGrid } from "./Grid.js"
import { resetInterface, setDrawTool, resetViewbox, drawPattern, generatePlane, setBorder} from "./Plane.js"
import { initialiseExportForm } from "./ExportForm.js"
import { deleteHistory, overwriteHistory, saveHistory } from "./History.js"

function initialisePref() {
    const overlay = document.querySelector('#overlay')
    const prefWindow = document.querySelector('#preferences')
    const segInput = document.querySelector('#segment')
    const strInput = document.querySelector('#stroke')
    const gridInput = document.querySelector('#gridline')
    const closeBtn = document.querySelector('#pref-close')
    
    segInput.value = envVar.segment
    strInput.value = envVar.strokeWidth
    
    segInput.addEventListener('change', handleSegmentChange)
    strInput.addEventListener('change', handleStrokeChange)
    gridInput.addEventListener('change', handleGridChange)
    segInput.addEventListener('invalid',e=>invalidSegment(e))
    strInput.addEventListener('invalid', e=>invalidStroke(e))
    closeBtn.addEventListener('click', handleClosePref)
    
    initialiseExportForm()

    function handleSegmentChange() {
        if (segInput.checkValidity()) {
            envVar.segment = segInput.value
            generateGrid()
        }
    }

    function handleStrokeChange() {
        if (strInput.checkValidity()) {
            envVar.strokeWidth = strInput.value
            drawPattern()
        }
    }

    function handleGridChange() {
        envVar.gridlines = gridInput.checked
        toggleGrid()
    }

    function handleClosePref() {
        toggleElemVisibility(prefWindow, false)
        toggleElemVisibility(overlay, false)
    }

    // async function render() {
    //     const segInput = document.querySelector('#segment')
    //     const strInput = document.querySelector('#stroke')
    //     const toggleGridInput = document.querySelector('#gridline')
    //     if (segInput.checkValidity()) {
    //         envVar.segment = segInput.value
    //     }
    //     if (strInput.checkValidity()) {
    //         envVar.strokeWidth = strInput.value
    //     }
    //     envVar.gridlines = toggleGridInput.checked
        
    //     generateGrid()
    //     toggleGrid()
    //     resetInterface()
    //     drawPattern()
    // }

    function invalidSegment(e) {
        e.target.value = envVar.segment
        window.alert('Grid segment must be a number')
    }

    function invalidStroke(e) {
        e.target.value = envVar.strokeWidth
        window.alert('Line thickness must be a number')
    }

}

function openPrefWindow() {
    const overlay = document.querySelector('#overlay')
    const prefWindow = document.querySelector('#preferences')
    toggleElemVisibility(overlay, true)
    toggleElemVisibility(prefWindow, true)
}


export { initialisePref, openPrefWindow }