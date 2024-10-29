import * as backend from "../backend/backend.js"

const interf = document.querySelector('#interface')
const pointerDisplay = document.querySelector('#pointerDisplay')
const pointerX = pointerDisplay.querySelector('#pointerX')
const pointerY = pointerDisplay.querySelector('#pointerY')
const pointer = document.querySelector('#pointer')

export default function trackCoords() {
    interf.addEventListener('mousemove', e=>track(e))
    interf.addEventListener('mouseenter',e=>showDisplay(e))
    interf.addEventListener('mouseleave', e=>hideDisplay(e))
 }

 function track(e) {
    e.preventDefault()
    let pointerPosition = backend.draw.getPointFromEvent(e)
    let x = Math.round(pointerPosition.x * 100)/100
    let y = Math.round((backend.data.envVar.height - pointerPosition.y) * 100)/100
    pointerX.innerHTML = `x: ${x}`
    pointerY.innerHTML = `y: ${y}`
}

function showDisplay(e) {
    e.preventDefault()
    pointerDisplay.style.display = 'flex'
}

function hideDisplay(e) {
    e.preventDefault()
    pointerDisplay.style.display = 'none'
}

export { trackCoords }