export function line(x1, y1, x2, y2, style, id='') {

    const NS = 'http://www.w3.org/2000/svg'

    const lineElem = document.createElementNS(NS,'line')
    lineElem.setAttribute('x1',x1)
    lineElem.setAttribute('y1',y1)
    lineElem.setAttribute('x2',x2)
    lineElem.setAttribute('y2',y2)
    lineElem.setAttribute('style',style)
    if (id) {
        lineElem.id = id
    }
    return lineElem
}