import { svg } from "./SVG.js";
import { circle } from "./Circle.js";

export function vertex(radius, style) {
    const vertex = svg(radius*2, radius*2)
    const circleElem = circle(radius, radius, radius, style)
    vertex.classList.add(...['opacity-0', 'transition', 'hover:opacity-100', 'vertex'])
    vertex.append(circleElem)

    return vertex
}