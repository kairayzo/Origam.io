export function svg(width, height) {
    const NS = 'http://www.w3.org/2000/svg'
        
    const svgElem = document.createElementNS(NS,'svg')
    svgElem.setAttribute('width',width)
    svgElem.setAttribute('height',height)

    return svgElem
}