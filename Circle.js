export class Circle {
    constructor(r, cx, cy, style) {
        const NS = 'http://www.w3.org/2000/svg'

        // const svgElem = document.createElementNS(NS,'svg')
        // svgElem.setAttribute('width',width)
        // svgElem.setAttribute('height',height)

        const circleElem = document.createElementNS(NS,'circle')
        circleElem.setAttribute('r',r)
        circleElem.setAttribute('cx',cx)
        circleElem.setAttribute('cy',cy)
        circleElem.setAttribute('style',style)

        // svgElem.append(circleElem)
        
        return circleElem
    }
}