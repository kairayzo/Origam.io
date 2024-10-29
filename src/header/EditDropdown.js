import * as backend from "../backend/backend.js"


export default function generateEditDropdown() {
    const undoElem = backend.elements.dropdownItem('Undo', undefined, 'Ctrl + Z')
    const redoElem = backend.elements.dropdownItem('Redo', undefined, 'Ctrl + Y')
    const zoominElem = backend.elements.dropdownItem('Zoom in', undefined, 'Ctrl + =')
    const zoomoutElem = backend.elements.dropdownItem('Zoom out', undefined, 'Ctrl + -')

    undoElem.addEventListener('click', backend.shortcuts.handleUndo)
    redoElem.addEventListener('click', backend.shortcuts.handleRedo)
    zoominElem.addEventListener('click', ()=>backend.shortcuts.handleZoom(true))
    zoomoutElem.addEventListener('click', ()=>backend.shortcuts.handleZoom(false))

    const editDropdown = backend.elements.dropdownList([undoElem, redoElem, zoominElem, zoomoutElem])
    editDropdown.id = 'edit-dropdown'
    editDropdown.style.visibility = 'hidden'

    return editDropdown
}