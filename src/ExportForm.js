import { vertexObj, edgeObj, assignObj, FOLD, envVar} from "./index.js"
import { svg } from "./Elements.js"
import { toggleElemVisibility } from "./helper.js"

function initialiseExportForm() {
    
    const exportForm = document.querySelector('#exportForm')
    const confirmExport = document.querySelector('#exportBtn')
    const titleInput = document.querySelector('#fileTitle')
    const closeBtn = document.querySelector('#export-close')
    // exportBtn.addEventListener('click', (e) => openExportForm(e))
    closeBtn.addEventListener('click', (e) => closeExportForm(e))
    confirmExport.addEventListener('click', (e) => handleExportClick(e))
}

function openExportForm() {
    const overlay = document.querySelector('#overlay')
    const exportForm = document.querySelector('#exportForm')
    const fileTitleInput = document.querySelector('#fileTitle')
    const fileAuthorInput = document.querySelector('#fileAuthor')
    const fileCreatorInput = document.querySelector('#fileCreator')
    const fileSpecInput = document.querySelector('#fileSpec')
    const fileClasses = document.querySelector('#fileClasses')
    
    fileTitleInput.value = envVar.fileDetails.fileTitle
    fileAuthorInput.value = envVar.fileDetails.fileAuthor
    fileCreatorInput.value = envVar.fileDetails.fileCreator
    fileSpecInput.value = envVar.fileDetails.fileSpec
    for (let cls of envVar.fileDetails.fileClasses) {
        const clsInput = fileClasses.querySelector(`#${cls}`)
        clsInput.checked = true
    }

    loadPreview()
    toggleElemVisibility(overlay, true)
    toggleElemVisibility(exportForm, true)
}

function closeExportForm(e) {
    e.preventDefault()
    const overlay = document.querySelector('#overlay')
    const exportForm = document.querySelector('#exportForm')
    toggleElemVisibility(overlay, false)
    toggleElemVisibility(exportForm, false)
}

function loadPreview() {
    let previewElem = document.querySelector('#preview')
    let plane = document.querySelector('#plane')
    let previewGroup = plane.cloneNode(true)
    let previewSvg = svg(300, 300)
    previewSvg.setAttribute('viewBox', '-5 -5 610 610')
    previewSvg.appendChild(previewGroup)
    previewElem.innerHTML = ''
    previewElem.append(previewSvg)
}

function handleExportClick(e) {
    const titleInput = document.querySelector('#fileTitle')
    if (titleInput.checkValidity()) {
        handleExport(e)
    }
}

function handleExport(e) {
    e.preventDefault()
    let verticesCoords = []
    let edgesVertices = []
    let edgesAssignment = []
    let JSONObj = {}

    let fileTitle = document.querySelector('#fileTitle').value
    let fileAuthor = document.querySelector('#fileAuthor').value
    let fileCreator = document.querySelector('#fileCreator').value
    let fileSpec = document.querySelector('#fileSpec').value
    let fileClassesGrp = document.querySelector('#fileClasses')
    let fileClasses = []
    for (let radioBtn of fileClassesGrp.querySelectorAll('input')) {
        if (radioBtn.checked) {
            fileClasses.push(radioBtn.value)
        }
    }
    generateMaps()

    JSONObj['file_spec'] = fileSpec 
    JSONObj['file_creator'] = fileCreator 
    JSONObj['file_author'] = fileAuthor 
    JSONObj['file_title'] = fileTitle 
    JSONObj['file_classes'] = fileClasses 
    JSONObj['vertices_coords'] = verticesCoords
    JSONObj['edges_vertices'] = edgesVertices
    JSONObj['edges_assignment'] = edgesAssignment
    JSONObj = FOLD.convert.edges_vertices_to_faces_vertices(JSONObj)
    
    let data = JSON.stringify(JSONObj)
    download(data, `${fileTitle}.fold`, 'application/json');

    function generateMaps() {
        //maps vertexId to index in verticesCoords
        let vIdMap = {} 
        for (let [id, vertex] of Object.entries(vertexObj)) {
            vIdMap[id]= verticesCoords.push(vertex) - 1
        }
    
        for (let [id, pair] of Object.entries(edgeObj)) {
            edgesVertices.push([vIdMap[pair[0]], vIdMap[pair[1]]])
            edgesAssignment.push(assignObj[id])
        }
    }
    
    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
}



export { initialiseExportForm, openExportForm, closeExportForm }