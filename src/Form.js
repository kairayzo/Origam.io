import { vertexObj, edgeObj, assignObj, envVar } from "./index.js"
import { generateId } from "./helper.js"
import { generateGrid, toggleGrid } from "./Grid.js"
import { generatePlane, resetScreen, setBisectorTool, setDrawTool } from "./Plane.js"

function initialiseForm() {
    const segInput = document.querySelector('#segment')
    const strInput = document.querySelector('#stroke')
    const gridInput = document.querySelector('#gridline')
    const fileInput = document.querySelector('#file')
    const clearFileBtn = document.querySelector('#clearfile')
    const drawToolBtn = document.querySelector('#draw')
    const bisectorToolBtn = document.querySelector('#bisector')
    
    segInput.value = envVar.segment
    strInput.value = envVar.strokeWidth
    fileInput.value = envVar.file
    
    segInput.addEventListener('change', render)
    strInput.addEventListener('change', render)
    gridInput.addEventListener('change', render)
    fileInput.addEventListener('change', (e)=>handleSubmit(e))
    clearFileBtn.addEventListener('click', (e)=>clearFile(e))
    segInput.addEventListener('invalid', (e)=>invalidSegment(e))
    strInput.addEventListener('invalid', (e)=>invalidStroke(e))
    drawToolBtn.addEventListener('click', handleDrawSelect)
    bisectorToolBtn.addEventListener('click', handleBisectorSelect)
}

function clearFile(e) {
    e.preventDefault()
    const fileInput = document.querySelector('#file')
    fileInput.value = null
    envVar.file = ''
    handleSubmit(e)
}

async function render() {
    const segInput = document.querySelector('#segment')
    const strInput = document.querySelector('#stroke')
    const toggleGridInput = document.querySelector('#gridline')
    if (segInput.checkValidity()) {
        envVar.segment = segInput.value
    }
    if (strInput.checkValidity()) {
        envVar.strokeWidth = strInput.value
    }
    envVar.gridlines = toggleGridInput.checked
    
    generateGrid()
    toggleGrid()
    resetScreen()
    generatePlane()
    setDrawTool()
}

async function handleSubmit(e) {
    e.preventDefault()
    const fileInput = document.querySelector('#file')
    clearObj()
    const file = fileInput.files[0]
    envVar.file = file
    if (file) {
        await loadFile(file)
    }
    render()
}

function invalidSegment(e) {
    e.target.value = envVar.segment
    window.alert('Invalid input: must be a number')
}

function invalidStroke(e) {
    e.target.value = envVar.strokeWidth
    window.alert('Invalid input: must be a number')
}

function handleDrawSelect() {
    const drawToolBtn = document.querySelector('#draw')
    const bisectorToolBtn = document.querySelector('#bisector')
    drawToolBtn.disabled = true
    bisectorToolBtn.disabled = false
    resetScreen()
    setDrawTool()
}

function handleBisectorSelect() {
    const drawToolBtn = document.querySelector('#draw')
    const bisectorToolBtn = document.querySelector('#bisector')
    bisectorToolBtn.disabled = true
    drawToolBtn.disabled = false
    resetScreen()
    setBisectorTool()
}

function clearObj() {
    for (let obj of [vertexObj, edgeObj, assignObj]) {
        for (let id in obj) delete obj[id];
    }
}

async function loadFile(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (e) => onReaderLoad(e, resolve);
        reader.readAsText(file);
    })

    function onReaderLoad(event, resolve){
        let obj = JSON.parse(event.target.result);
        processData(obj)
        resolve()
    }
}

function processData(data) {
    let vList = data.vertices_coords
    let eList = data.edges_vertices
    let aList = data.edges_assignment

    const vIdMap = {}
    const eIdMap = {}

    for (let [idx, v] of vList.entries()) {
        let vId =generateId(vertexObj);        
        vIdMap[idx] = vId
        vertexObj[vId] = v
    }

    for (let [idx, e] of eList.entries()) {
        let eId =generateId(edgeObj)
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


export { initialiseForm }