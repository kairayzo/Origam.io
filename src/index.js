import { generateGrid, toggleGrid} from "./Grid.js"
import { generatePlane, setDrawTool } from "./Plane.js"

const DEFAULT_SEGMENT = 8
const DEFAULT_STROKE = 2
export let vertexObj = {}
export let edgeObj = {}
export let assignObj = {}
const FOLD = require('fold')

const form = document.querySelector('#menu')
const segInput = document.querySelector('#segment')
const strInput = document.querySelector('#stroke')
segInput.value = DEFAULT_SEGMENT
strInput.value = DEFAULT_STROKE
form.addEventListener('submit',(e) => handleSubmit(e))

function processData(data) {
    let vList = data.vertices_coords
    let eList = data.edges_vertices
    let aList = data.edges_assignment

    const vIdMap = {}
    const eIdMap = {}

    for (let [idx, v] of vList.entries()) {
        let vId = crypto.randomUUID()
        vIdMap[idx] = vId
        vertexObj[vId] = v
    }

    for (let [idx, e] of eList.entries()) {
        let eId = crypto.randomUUID()
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

async function handleSubmit(e) {
    e.preventDefault()

    const fileInput = document.querySelector('#file')
    
    clearObj()
    const file = fileInput.files[0]
    if (file) {
        await loadFile(file)
        fileInput.value = null
    }

    render()
}

function onReaderLoad(event, resolve){
    var obj = JSON.parse(event.target.result);
    processData(obj)
    resolve()
}

async function loadFile(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (e) => onReaderLoad(e, resolve);
        reader.readAsText(file);
    })
}

async function render() {
    const segInput = document.querySelector('#segment')
    const strInput = document.querySelector('#stroke')
    const toggleGridInput = document.querySelector('#gridline')
    
    const segment = segInput.value
    const stroke = strInput.value
    const gridOn = toggleGridInput.checked;
    console.log(segment, stroke, gridOn)
    
    generateGrid(segment)
    toggleGrid(gridOn)
    generatePlane(segment, stroke)
    setDrawTool(stroke)
}

function clearObj() {
    for (let obj of [vertexObj, edgeObj, assignObj]) {
        for (let id in obj) delete obj[id];
    }
}

generateGrid(DEFAULT_SEGMENT)
generatePlane(DEFAULT_SEGMENT, DEFAULT_STROKE)
setDrawTool(DEFAULT_STROKE)
