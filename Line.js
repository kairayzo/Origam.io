import { vertexList } from './index.js'

export function line(x1, y1, x2, y2, style) {
    const NS = 'http://www.w3.org/2000/svg'

    const lineElem = document.createElementNS(NS,'line')
    lineElem.setAttribute('x1',x1)
    lineElem.setAttribute('y1',y1)
    lineElem.setAttribute('x2',x2)
    lineElem.setAttribute('y2',y2)
    lineElem.setAttribute('style',style)
    lineElem.addEventListener('click', (e)=>handleClick(e))
    lineElem.addEventListener('contextmenu',(e)=>handleDelete(e))

    return lineElem

    function handleClick(e) {
        e.preventDefault()
        if (e.target) {
            const lineElem = e.target
            let strokeColor = lineElem.style.stroke
            lineElem.style = `stroke:${
                strokeColor == 'black' ? 'red' :
                strokeColor == 'red' ? 'blue' :
                'red'}`
        }
    }

    function handleDelete(e) {
        e.preventDefault()
        if (e.target) {
            const lineElem = e.target 
            const svgElem = e.target.parentElement
            let x1 = lineElem.x1.baseVal.value
            let y1 = lineElem.y1.baseVal.value
            let x2 = lineElem.x2.baseVal.value
            let y2 = lineElem.y2.baseVal.value
            let left = parseInt(svgElem.style.left.replace('px',''))
            let top = parseInt(svgElem.style.top.replace('px',''))
            let c1 = [left + x1, top + y1]
            let c2 = [left + x2, top + y2]
            let coords = c1[0] < c2[0] ? [c1, c2] : [c2, c1]
            
            svgElem.remove()

            let vertexIdx = vertexList.indexOf(coords)
            vertexList.splice(vertexIdx, 1)
        }
    }
}