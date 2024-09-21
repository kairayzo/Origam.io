import { vertexObj, edgeObj, assignObj, editObjs } from "./index.js";
import { envVar } from "./index.js";
import { setBorder } from "./Plane.js";

let history

function initialiseHistory() {
    history = {
        filename: envVar.fileDetails.fileTitle,
        index: 0,
        objs: [{vertexObj: structuredClone(vertexObj), edgeObj: structuredClone(edgeObj), assignObj: structuredClone(assignObj)}]
    }
}

function overwriteFilename() {
    history.filename = envVar.fileDetails.fileTitle
}

function saveHistory() {
    console.log('history saved')
    localStorage.setItem('origami-editor', JSON.stringify(history))
}

function retrieveHistory() {
    history = JSON.parse(localStorage.getItem('origami-editor'))
    if (!history) {
        setBorder()
        initialiseHistory()
        saveHistory()
    }
    envVar.fileDetails.fileTitle = history.filename
    getHistory()
}

function deleteHistory() {
    localStorage.removeItem('origami-editor')
}

function overwriteHistory() {
    console.log('overwriteHistory')
    if (history.objs.length > history.index + 1) {
        while (history.objs.length > history.index + 1) {
            history.objs.pop()
        }
    }
    history.objs.push({vertexObj: structuredClone(vertexObj), edgeObj: structuredClone(edgeObj), assignObj: structuredClone(assignObj)})
    history.index += 1
}

function getHistory() {
    let currHistory = history.objs[history.index]
    editObjs(currHistory.vertexObj, currHistory.edgeObj, currHistory.assignObj)
}

function forwardHistory() {
    console.log('forwardHistory')
    if (history.objs[history.index + 1]) {
        history.index += 1
        getHistory()
    }
}

function backHistory() {
    console.log('backHistory')
    if (history.index != 0) {
        history.index -= 1;
        getHistory()
    }
}

export {history, initialiseHistory, overwriteFilename, saveHistory, retrieveHistory, deleteHistory, overwriteHistory, getHistory, forwardHistory, backHistory}