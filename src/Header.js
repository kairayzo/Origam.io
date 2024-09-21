import { dropdownItem, dropdownList } from "./Elements.js"
import { openExportForm } from "./ExportForm.js"
import { generateGrid, toggleGrid } from "./Grid.js"
import { generateId, toggleElemVisibility } from "./helper.js"
import { backHistory, deleteHistory, history, overwriteFilename, overwriteHistory, retrieveHistory, saveHistory } from "./History.js"
import { vertexObj, edgeObj, assignObj, envVar, editObjs, FOLD } from "./index.js"
import { setDialogue, setToast } from "./Notifs.js"
import { drawPattern, handleRedo, handleUndo, handleZoom, resetInterface, setBorder, setDrawTool } from "./Plane.js"
import { openPrefWindow } from "./Preferences.js"

function initialiseHeader() {
    const logoElem = document.querySelector('#logo')
    const filenameElem = document.querySelector('#filename')
    filenameElem.innerHTML = envVar.fileDetails.fileTitle
    filenameElem.addEventListener('click', handleFilenameClick)
    logoElem.addEventListener('click', handleLogoClick)
    generateMenuDropdown()
}

function handleFilenameClick() {
    const filenameElem = document.querySelector('#filename')
    const filenameInput = document.createElement('input')
    filenameInput.type = 'text'
    filenameInput.id = 'filename'
    filenameInput.value = filenameElem.innerHTML
    filenameInput.addEventListener('blur', handleFilenameDeselect)
    filenameInput.addEventListener('change', handleFilenameDeselect)

    filenameElem.replaceWith(filenameInput)
    filenameInput.select()

    function handleFilenameDeselect() {
        const filenameInput = document.querySelector('#filename')
        const filenameElem = document.createElement('div')
        if (filenameInput.value) {
            envVar.fileDetails.fileTitle = filenameInput.value
        }
        filenameElem.innerHTML = envVar.fileDetails.fileTitle
        filenameElem.id = 'filename'
        filenameElem.addEventListener('click', handleFilenameClick)

        filenameInput.replaceWith(filenameElem)
        overwriteFilename()
    }
}

function handleLogoClick() {
    let menuContainer = document.querySelector('#menu-container')
    toggleElemVisibility(menuContainer)
}

function generateMenuDropdown() {
    const menuContainer = document.querySelector('#menu-container') 
    const fileElem = dropdownItem('File', 'file', undefined, true)
    const editElem = dropdownItem('Edit', 'edit', undefined, true)
    const prefElem = dropdownItem('Preferences', 'preferences')
    const fileDropdown = generateFileDropdown()
    const editDropdown = generateEditDropdown()
    const prefWindow = document.querySelector('#preferences')

    fileElem.appendChild(fileDropdown)
    editElem.appendChild(editDropdown)

    fileElem.addEventListener('mouseover', ()=>toggleElemVisibility(fileDropdown, true))
    fileElem.addEventListener('mouseleave',()=>toggleElemVisibility(fileDropdown, false))
    editElem.addEventListener('mouseover', ()=>toggleElemVisibility(editDropdown, true))
    editElem.addEventListener('mouseleave',()=>toggleElemVisibility(editDropdown, false))
    prefElem.addEventListener('click', openPrefWindow)


    let menuDropdown = dropdownList([fileElem, editElem, prefElem])
    menuDropdown.id = 'menu-dropdown'
    menuContainer.appendChild(menuDropdown)

    return menuDropdown
}

function generateFileDropdown() {
    const newfileElem = dropdownItem('New File')
    const openfileElem = dropdownItem('Open File')
    const saveElem = dropdownItem('Save')
    const exportElem = dropdownItem('Export')

    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.id = 'file'
    fileInput.accept = '.fold'
    fileInput.style.display = 'none'
    fileInput.addEventListener('change', handleImportFile)
    openfileElem.appendChild(fileInput)

    newfileElem.addEventListener('click', handleNewFileClick)
    openfileElem.addEventListener('click', handleOpenFilePicker)
    saveElem.addEventListener('click', handleSaveClick)
    exportElem.addEventListener('click', openExportForm)

    const fileDropdown = dropdownList([newfileElem, openfileElem, saveElem, exportElem])
    fileDropdown.id = 'file-dropdown'
    fileDropdown.style.visibility = 'hidden'

    return fileDropdown
}

function generateEditDropdown() {
    const undoElem = dropdownItem('Undo', undefined, 'Ctrl + Z')
    const redoElem = dropdownItem('Redo', undefined, 'Ctrl + Y')
    const zoominElem = dropdownItem('Zoom in', undefined, 'Ctrl + =')
    const zoomoutElem = dropdownItem('Zoom out', undefined, 'Ctrl + -')

    undoElem.addEventListener('click', handleUndo)
    redoElem.addEventListener('click', handleRedo)
    zoominElem.addEventListener('click', ()=>handleZoom(true))
    zoomoutElem.addEventListener('click', ()=>handleZoom(false))

    const editDropdown = dropdownList([undoElem, redoElem, zoominElem, zoomoutElem])
    editDropdown.id = 'edit-dropdown'
    editDropdown.style.visibility = 'hidden'

    return editDropdown
}

function handleNewFileClick() {
    setDialogue('Clear current project?', 'Creating a new project will clear current progress. Do you wish to export the current project?', 'Export', 'Proceed', openExportForm, createNewFile)
}

function createNewFile() {
    const fileInput = document.querySelector('#file')

    deleteHistory()
    fileInput.value = null
    handleImportFile()
    saveHistory()

}

function handleOpenFilePicker() {
    const fileInput = document.querySelector('#file')
    fileInput.click()
}

async function handleImportFile() {
    // const pickerOpts = {
    //     types: [
    //       {
    //         description: "JSON",
    //         accept: {
    //           "application/json": [".fold", ".json", ".cp"],
    //         },
    //       },
    //     ],
    //     excludeAcceptAllOption: true,
    //     multiple: false,
    // };

    // editObjs({},{},{})
    // const [fileHandle] = await window.showOpenFilePicker(pickerOpts)
    // const file = await fileHandle.getFile()
    // console.log(fileHandle, file)
    // envVar.activeFile = file

    const fileInput = document.querySelector('#file')
    const file = fileInput.files[0]
    editObjs({},{},{})
    if (file) {
        await loadFile(file)
    } else {
        setBorder()
    }
    render()
    overwriteHistory()

    async function loadFile(file) {
        
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            const fileName = `${file.name}`
            const fileExt = fileName.substring(fileName.indexOf('.'))
            
            reader.onload = (e) => onReaderLoad(e, resolve, fileExt);
            reader.readAsText(file);
        })

        function onReaderLoad(event, resolve, fileExt){
            let obj = JSON.parse(event.target.result);
            processData(obj)
            resolve()
        }
    }

    function processData(data) {
        console.log(data)
        envVar.fileDetails.fileTitle = data.file_title
        envVar.fileDetails.fileAuthor = data.file_author
        envVar.fileDetails.fileCreator = data.file_creator
        envVar.fileDetails.fileSpec = data.file_spec
        envVar.fileDetails.fileClasses = data.file_classes

        let vList = data.vertices_coords
        let eList = data.edges_vertices
        let aList = data.edges_assignment

        const vIdMap = {}
        const eIdMap = {}

        for (let [idx, v] of vList.entries()) {
            let vId = generateId(vertexObj);        
            vIdMap[idx] = vId
            vertexObj[vId] = v
        }

        for (let [idx, e] of eList.entries()) {
            let eId = generateId(edgeObj)
            let e1 = vIdMap[e[0]]
            let e2 = vIdMap[e[1]]
            eIdMap[idx] = eId
            edgeObj[eId] = [e1, e2]
        }

        for (let [idx, a] of aList.entries()) {
            let eId = eIdMap[idx]
            assignObj[eId] = a
        }
    }
      
}

function handleSaveClick() {
    saveHistory()
    setToast('success', 'File saved')
}

function render() {
    generateGrid()
    toggleGrid()
    resetInterface()
    drawPattern()
}

export { initialiseHeader, render, handleNewFileClick, handleOpenFilePicker, handleSaveClick }