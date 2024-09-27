import { resetInterface } from "./Plane.js"
import { toggleElemVisibility } from "./helper.js"
import { envVar } from "./index.js"

function initialiseTools() {
    const toolbarElem = document.querySelector('#toolbar')
    const drawToolBtn = document.querySelector('#draw')
    const bisectorToolBtn = document.querySelector('#bisect')
    const cutToolBtn = document.querySelector('#cut')
    const deleteToolBtn = document.querySelector('#delete')
    const suggestToolBtn = document.querySelector('#suggest')
    const edgeTypeBtn = document.querySelector('#currEdgeType')
    const typesOptions = document.querySelector('#edgeTypeOptions')

    drawToolBtn.addEventListener('click', e => handleToolSelect(e))
    bisectorToolBtn.addEventListener('click', e=>handleToolSelect(e))
    cutToolBtn.addEventListener('click', e=> handleToolSelect(e))
    deleteToolBtn.addEventListener('click', e=>handleToolSelect(e))
    suggestToolBtn.addEventListener('click', e=>handleToolSelect(e))
    // edgeTypeBtn.addEventListener('click', toggleTypesMenu)
    for (let typeOption of Array.from(typesOptions.children)) {
        typeOption.addEventListener('click', handleTypeSelect)
    }
    

    function handleToolSelect(e) {
        const selectedTool = e.target.closest('.tool-button')
        const tools = Array.from(document.querySelector('#tools').children)

        tools.forEach((tool) => {
            // console.log(tool.id, selectedTool.id)
            if (tool.id == selectedTool.id) {
                tool.classList.add('selected')
            } else {
                tool.classList.remove('selected')

            }
        })

        switch(selectedTool) {
            case drawToolBtn: 
                envVar.activeTool = 'draw'
                break
            case bisectorToolBtn:
                envVar.activeTool = 'bisector'
                break
            case cutToolBtn:
                envVar.activeTool = 'cut'
                break
            case deleteToolBtn:
                envVar.activeTool = 'delete'
                break
            case suggestToolBtn:
                envVar.activeTool = 'suggest'
                break
        }
        resetInterface()
    }

    function toggleTypesMenu() {
        const typesOptions = document.querySelector('#edgeTypeOptions')
        toggleElemVisibility(typesOptions)
    }

    function typeToClass(type) {
        switch(type) {
            case 'M':
                return 'mountain'
            case 'V':
                return 'valley'
            case 'U':
                return 'unassigned'
            case 'F':
                return 'flat'
            case 'B':
                return 'border'
        }
    }

    function typeToColor(type) {
        switch(type) {
            case 'M':
                return 'red'
            case 'V':
                return 'blue'
            case 'U':
                return 'yellow'
            case 'F':
                return 'grey'
            case 'B':
                return 'black'
        }
    }

    function handleTypeSelect(e) {
        if (e.target) {
            const selectedTypeBtn = e.target.closest('g')
            const currTypeBtn = document.querySelector('#currEdgeType')
            const typesMenu = document.querySelector('#typesMenu')
            const edgeTypeOptions = document.querySelector('#edgeTypeOptions')
            
            // change style of current type button
            let selectedType = selectedTypeBtn.children[1].innerHTML
            let selectedTypeClass = typeToClass(selectedType)
            let currTypeClass = typeToClass(currTypeBtn.children[1].innerHTML)
            currTypeBtn.children[1].innerHTML = selectedType
            currTypeBtn.children[0].classList.remove(currTypeClass)
            currTypeBtn.children[0].classList.add(selectedTypeClass)

            // reference new type when drawing lines
            envVar.edgeType = selectedType

            // reassign styles to buttons in edge types menu
            let edgeTypes = ['M', 'V', 'U', 'F', 'B'] 
            let idx = 0
            edgeTypes.filter(edgeType => edgeType !== selectedType).forEach(edgeType => {
                const edgeTypeOption = edgeTypeOptions.children[idx]
                const currFillClass = edgeTypeOption.children[0].classList[0]
                edgeTypeOption.children[0].classList.remove(currFillClass)
                edgeTypeOption.children[0].classList.add(typeToClass(edgeType))
                edgeTypeOption.children[1].innerHTML = edgeType
                // console.log(idx, edgeType, typeToColor(edgeType))
                idx += 1
            })

            // change appearance in backend
            selectEdge(selectedType)

            // toggleElemVisibility(edgeTypeOptions, false)
        }
    }


    function closeEdgesElem() {
        const edgesElem = document.querySelector('#edges')
        if (edgesElem) {
            toggleElemVisibility(edgesElem, false)
        }
    }

    function selectEdge(edgeType) {
        
        let edgeColor = envVar.assignmentColor[edgeType]
        const pointer = document.querySelector('#pointer')
        pointer.style.fill = edgeColor
        let markers = document.querySelector('#markers')
        for (let marker of markers.children) {
            if (marker.tagName == 'circle') {
                marker.style.fill = edgeColor
            } else if (marker.tagName == 'line') {
                marker.style.stroke = edgeColor
            }
        }
    }
}

export { initialiseTools }