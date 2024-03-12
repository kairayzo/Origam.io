import { assignObj, edgeObj, vertexObj } from './index.js'

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
            const svgElem = e.target.parentElement
            const lineId = svgElem.id

            let strokeColor = lineElem.style.stroke
            switch(strokeColor) {
                case 'black':
                    lineElem.style = `stroke:red`
                    assignObj[lineId] = 'M'
                    break
                case 'red':
                    lineElem.style = `stroke:blue`
                    assignObj[lineId] = 'V'
                    break
                case 'blue':
                    lineElem.style = `stroke:red`
                    assignObj[lineId] = 'M'
                    break
            }

            console.log(assignObj)
        }
    }

    function handleDelete(e) {
        e.preventDefault()
        if (e.target) {
            const lineElem = e.target 
            const svgElem = lineElem.parentElement
            
            let lineId = svgElem.id
            let startId = edgeObj[lineId][0]
            let endId = edgeObj[lineId][1]
            delete edgeObj[lineId]
            delete vertexObj[startId]
            delete vertexObj[endId]

            svgElem.remove()

            console.log(vertexObj)
            console.log(edgeObj)
        }
    }

    // function findIdx(coord) {
    //     return Object.keys(vertexObj).find(key => vertexObj[key] === coord);
    // }
}