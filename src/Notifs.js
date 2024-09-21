import { removeListeners, toggleElemVisibility } from "./helper.js"

function setToast(type, message) {
    const toast = document.querySelector('#toast')
    const toastIcon = document.querySelector('#toastIcon')
    const toastText = document.querySelector('#toastText')
    const toastClose = document.querySelector('#toastClose')

    switch(type) {
        case 'success':
            toastIcon.setAttribute('src','./public/success.svg')
            toastIcon.setAttribute('alt','success icon')
            toast.classList.remove('error')
            toast.classList.add('success')
            break
        case 'error':
            toastIcon.setAttribute('src','./public/error.svg')
            toastIcon.setAttribute('alt','error icon')
            toast.classList.remove('success')
            toast.classList.add('error')
            break
    }
    toastText.innerHTML = message

    toast.classList.remove('disappear')
    const timeoutId = setTimeout(() => {
        toast.classList.add('disappear')
    }, 5000);
    toastClose.addEventListener('click', () => {
        toast.classList.add('disappear')
        clearTimeout(timeoutId)
    })
}

function setDialogue(title, text, leftBtn, rightBtn, leftHandler, rightHandler) {
    const overlay = document.querySelector('#overlay')
    let dialogue = document.querySelector('#dialogue')
    removeListeners(dialogue)
    dialogue = document.querySelector('#dialogue')
    const dialogueTitle = document.querySelector('#dialogue-title')
    const dialogueClose = document.querySelector('#dialogue-close')
    const dialogueText = document.querySelector('#dialogue-text')
    const dialogueLeft = document.querySelector('#dialogue-btn-left')
    const dialogueRight = document.querySelector('#dialogue-btn-right')
    
    dialogueTitle.innerHTML = title
    dialogueClose.addEventListener('click', closeDialogue)
    dialogueText.innerHTML = text
    dialogueLeft.innerHTML = leftBtn
    dialogueLeft.addEventListener('click', handleLeftDialogueClick)
    dialogueRight.innerHTML = rightBtn
    dialogueRight.addEventListener('click', handleRightDialogueClick)
    toggleElemVisibility(overlay, true)
    toggleElemVisibility(dialogue, true)
    
    function closeDialogue() {
        toggleElemVisibility(overlay, false)
        toggleElemVisibility(dialogue, false)
    }

    function handleLeftDialogueClick(e) {
        e.preventDefault()
        closeDialogue()
        leftHandler(e)
    }

    function handleRightDialogueClick(e) {
        e.preventDefault()
        closeDialogue()
        rightHandler(e)
    }
}

function initialiseHelp() {
    const helpToggle = document.querySelector('#helpToggle')
    helpToggle.addEventListener('click', handleHelpCloseClick)
    setHelp()

    const toolsElem = document.querySelector('#tools')
    const drawTool = document.querySelector('#draw')
    const bisectTool = document.querySelector('#bisect')
    const cutTool = document.querySelector('#cut')
    const deleteTool = document.querySelector('#delete')
    const suggestTool = document.querySelector('#suggest')
    const edgeTypeBtn = document.querySelector('#currEdgeType')

    setHelpOnHover(drawTool, 'Draw tool', 
        `Draw edges along vertices, edges or gridlines. Supports free hand drawing<br>
        <br>
        &#x2022; Click start and end points to draw edges<br>
        &#x2022; Snaps onto gridlines, edges or vertices<br>
        <br>
        &#x2022; Right click on any edge to toggle between mountain and valley fold`
    )
    setHelpOnHover(bisectTool, 'Bisect tool',
        `Draw angle bisectors<br>
        <br>
        &#x2022; Click on 3 points (a,b,c) to define an angle bisector along point b<br>
        &#x2022; Then, click on an end point to draw line<br>
        <br>
        &#x2022; Click on 4 points (a,b,c,d) to define angle bisectors of lines ab and cd<br>
        &#x2022; Then, click on a start and end point to draw line<br>
        <br>
        &#x2022; Right click on any edge to toggle between mountain and valley fold`
    )
    setHelpOnHover(cutTool, 'Cut tool', 
        `Draw perpendicular bisectors and line bisectors<br>
        <br>
        &#x2022; Click on 2 points (a,b) to define reference line ab<br>
        &#x2022; Click on a third point c to define perpendicular bisector from c passing through ab<br>
        &#x2022; Click on a fourth point d to define a line passing through point d that folds point c onto reference line<br>
        <br>
        &#x2022; Right click on any edge to toggle between mountain and valley fold`
    )
    setHelpOnHover(deleteTool, 'Delete tool', 
        `Click on edges to delete them`
    )
    setHelpOnHover(suggestTool, 'Suggest tool', 
        `Click on vertices to add edges that satisfy local flat foldability<br>
        <br>
        &#x2022; Right click on any edge to toggle between mountain and valley fold`
    )
    setHelpOnHover(edgeTypeBtn, 'Change edge type',
        `Click to select between a variety of edge types<br>
        <br>
        &#x2022; Mountain (M): mark a crease that folds the paper away from the plane<br>
        &#x2022; Valley (V): mark a crease that folds the paper out of the plane<br>
        &#x2022; Unassigned (U): mark a crease that is yet to be assigned<br>
        &#x2022; Flat (F): mark a crease that is not be folded<br>
        &#x2022; Border (B): mark an edge of the origami paper`
    )
    edgeTypeBtn.addEventListener('mouseleave', setHelp)
    toolsElem.addEventListener('mouseleave', setHelp)
}

function handleHelpCloseClick() {
    const helpToggle = document.querySelector('#helpToggle')
    const helpWindow = document.querySelector('#helpWindow')
    helpToggle.setAttribute('src', './public/help.svg')
    helpToggle.removeEventListener('click', handleHelpCloseClick)
    helpToggle.addEventListener('click', handleHelpOpenClick)
    toggleElemVisibility(helpWindow, false)
}

function handleHelpOpenClick() {
    const helpToggle = document.querySelector('#helpToggle')
    const helpWindow = document.querySelector('#helpWindow')
    helpToggle.setAttribute('src', './public/help-close.svg')
    helpToggle.removeEventListener('click', handleHelpOpenClick)
    helpToggle.addEventListener('click', handleHelpCloseClick)
    toggleElemVisibility(helpWindow, true)
}

function setHelp(title='', desc='') {
    const DEFAULT_HELP_TITLE = 'Help window'
    const DEFAULT_HELP_DESC = `
    Open menu: click icon on top left<br>
    Tools help: hover over tools at the bottom<br>
    <br>
    &#x2022; Zoom: scroll<br>
    &#x2022; Pan: middle mouse + drag<br>
    &#x2022; Undo: ctrl + Z<br>
    &#x2022; Redo: ctrl + Y`
    
    const helpTitle = document.querySelector('#helpTitle')
    const helpDesc = document.querySelector('#helpDesc')
    if (title && desc) {
        helpTitle.innerHTML = title
        helpDesc.innerHTML = desc
    } else {
        helpTitle.innerHTML = DEFAULT_HELP_TITLE
        helpDesc.innerHTML = DEFAULT_HELP_DESC
    }
}

function setHelpOnHover(elem, title, desc) {
    elem.addEventListener('mouseover', ()=>setHelp(title, desc))
}

export { setToast, setDialogue, initialiseHelp, setHelp}