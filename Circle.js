export function circle(r, cx, cy, style) {
    const NS = 'http://www.w3.org/2000/svg'

    const circleElem = document.createElementNS(NS,'circle')
    circleElem.setAttribute('r',r)
    circleElem.setAttribute('cx',cx)
    circleElem.setAttribute('cy',cy)
    circleElem.setAttribute('style',style)
        
    return circleElem
}