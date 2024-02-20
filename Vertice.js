import { SVG } from "./SVG.js";
import { Circle } from "./Circle.js";

export class Vertice{
    constructor(radius, style){
        const vertice = new SVG(radius*2, radius*2)
        const circleElem = new Circle(radius, radius, radius, style)
        vertice.classList.add(...['opacity-0', 'transition', 'hover:opacity-100', 'vertice'])
        vertice.append(circleElem)
        // vertice.addEventListener('click',(e) => clickHandler(e))

        function clickHandler(e) {
            e.preventDefault()
            if (e.target) {
                const vertice = e.target.closest('svg')
                console.log(vertice.style.left, vertice.style.top)
            }
        }
        return vertice
    }

    
}