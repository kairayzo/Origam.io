import { vertexObj, edgeObj, assignObj, FOLD } from "./index.js"

function initialiseExportForm() {
    let verticesCoords = []
    let edgesVertices = []
    let edgesAssignment = []
    const exportBtn = document.querySelector('#export')
    const confirmExport = document.querySelector('#exportBtn')
    const closeBtn = document.querySelector('#close')
    exportBtn.addEventListener('click', (e) => openForm(e))
    closeBtn.addEventListener('click', (e) => closeForm(e))
    confirmExport.addEventListener('click', (e) => handleExport(e))

function openForm(e) {
    e.preventDefault()
    loadPreview()
    const overlay = document.querySelector('#overlay')
    overlay.classList.remove('hidden')
    overlay.classList.add('block')
}

function closeForm(e) {
    e.preventDefault()
    const overlay = document.querySelector('#overlay')
    overlay.classList.remove('block')
    overlay.classList.add('hidden')
}

function handleExport(e) {
    e.preventDefault()
    let JSONObj = {}
    let fileSpec = document.querySelector('#fileSpec').value
    let fileCreator = document.querySelector('#fileCreator').value
    let fileAuthor = document.querySelector('#fileAuthor').value
    let fileTitle = document.querySelector('#fileTitle').value
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
}

function loadPreview() {
    let previewElem = document.querySelector('#preview')
    let plane = document.querySelector('#plane')
    let previewSvg = plane.cloneNode(true)
    previewSvg.setAttribute('viewBox', '0 0 600 600')
    previewSvg.style = 'width: 300px; height: 300px'
    previewElem.innerHTML = ''
    previewElem.append(previewSvg)
}

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

export { initialiseExportForm }