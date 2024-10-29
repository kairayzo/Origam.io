import { generateGrid, toggleGrid } from "../edit/Grid.js"
import { initialiseExportForm } from "../windows/ExportForm.js"
import * as backend from "../backend/backend.js"


const overlay = document.querySelector('#overlay')
const prefWindow = document.querySelector('#preferences')
const segInput = document.querySelector('#segment')
const strInput = document.querySelector('#stroke')
const gridInput = document.querySelector('#gridline')
const closeBtn = document.querySelector('#pref-close')

export default function initialisePref() {
    segInput.value = backend.data.envVar.segment
    strInput.value = backend.data.envVar.strokeWidth
    
    segInput.addEventListener('change', handleSegmentChange)
    strInput.addEventListener('change', handleStrokeChange)
    gridInput.addEventListener('change', handleGridChange)
    segInput.addEventListener('invalid',e=>invalidSegment(e))
    strInput.addEventListener('invalid', e=>invalidStroke(e))
    closeBtn.addEventListener('click', handleClosePref)
    
    initialiseExportForm()
}

function handleSegmentChange() {
    if (segInput.checkValidity()) {
        backend.data.envVar.segment = segInput.value
        generateGrid()
    }
}

function handleStrokeChange() {
    if (strInput.checkValidity()) {
        backend.data.envVar.strokeWidth = strInput.value
        backend.draw.drawPattern()
    }
}

function handleGridChange() {
    backend.data.envVar.gridlines = gridInput.checked
    toggleGrid()
}

function handleClosePref() {
    backend.dom.toggleElemVisibility(prefWindow, false)
    backend.dom.toggleElemVisibility(overlay, false)
}

function invalidSegment(e) {
    e.target.value = backend.data.envVar.segment
    window.alert('Grid segment must be a positive number')
}

function invalidStroke(e) {
    e.target.value = backend.data.envVar.strokeWidth
    window.alert('Line thickness must be a positive number')
}

function openPrefWindow() {
    const overlay = document.querySelector('#overlay')
    const prefWindow = document.querySelector('#preferences')
    backend.dom.toggleElemVisibility(overlay, true)
    backend.dom.toggleElemVisibility(prefWindow, true)
}


export { openPrefWindow }