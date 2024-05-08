import { envVar, vertexObj } from "./index.js";

export function generateId(obj) {
    let id = crypto.randomUUID();
    while (Object.keys(obj).includes(id)) {
        id = crypto.randomUUID();
    }
    return id;
}

// checks if value exists in object
export function exists(obj, val) {
    return Object.values(obj).filter(v => JSON.stringify(v) == JSON.stringify(val)).length != 0
}

// find id of coord in vertexObj. 
// If doesn't exist, insert coord into vertexObj and generate an id
export function getCoordId(coord) {
    for (let [id, val] of Object.entries(vertexObj)) {
        if (equalCoords(val, coord)) {
            return id
        }
    }
    let newId = generateId(vertexObj)
    vertexObj[newId] = coord
    return newId
}

export function getKey(obj, val) {
    return Object.keys(obj).find(key => JSON.stringify(obj[key]) === JSON.stringify(val));
}

// Gets input string with length units (px, rem .etc) and returns a float
export function parseLength(str) {
    let parsedStr = str.replace(/\D\-/g, "")
    return parseFloat(parsedStr)
}
 // Empty out the children of an element
export function clearElem(elem) {
    elem.innerHTML = ''
    let newElem = elem.cloneNode(true)
    elem.parentNode.replaceChild(newElem, elem)
}

//removes all event listeners from element
export function cloneElem(elem) {
    let newElem = elem.cloneNode(true)
    elem.parentNode.replaceChild(newElem, elem)
}

/*
Math functions
*/

export const dot = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n)
export const minus = (a, b) => [a[0] - b[0], a[1] - b[1]]
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)
export const times = (fac, a) => [a[0] * fac, a[1] * fac]
export const plus = (a, b) => [a[0] + b[0], a[1] + b[1]]
export const grad = (x1, y1, x2, y2) => (y2 - y1)/(x2 - x1)
export const within = (a, x, y) => x < y ? (a > x && a < y) : (a > y && a < x)
export const ontop = (a, x, y) => x < y ? (a >= x && a <= y) : (a >= y && a <= x)
/*
Geometry functions
*/

// closest point from coord on line
export function closest(x1, y1, x2, y2, coord) {
    let a = [x1, y1]
    let b = [x2, y2]
    let c = coord
    let ab = minus(b, a)

    let t = dot(minus(c, a), ab) / dot(ab, ab)
    t = clamp(t, 0, 1)

    return plus(a, times(t, ab))
}
 // calculate distance between two coords
 export function distTo(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
}

// find the center point between points a and b
export function centerPt(a, b) {
    let x = a[0] + (b[0] - a[0]) / 2
    let y = a[1] + (b[1] - a[1]) / 2
    return [x, y]
}

// determines if coord is on line
export function onLine(x1, y1, x2, y2, coord) {
    let gradient = grad(x1, y1, x2, y2)
    if  (gradient == Infinity) {
        return equalDist(x1, coord[0])
    } else if (gradient == 0) {
        return equalDist(y1, coord[1])
    } else {
        return equalDist((coord[0] - x1) * grad(x1, y1, x2, y2) + y1, coord[1])
    }
}

export function intersect(line1, line2) {
    if (equalLine(line1, line2)) {
        return
    }
    let gradient1 = grad(line1[0][0], line1[0][1], line1[1][0], line1[1][1])
    let gradient2 = grad(line2[0][0], line2[0][1], line2[1][0], line2[1][1])
    if (Math.abs(gradient1 - gradient2) == 0) {
        return
    }
    if (gradient1 == Infinity || gradient1 == -Infinity) {
        let x = line1[0][0]
        let y = line2[0][1] + gradient2 * (x - line2[0][0])
        return [x, y]
    }
    if (gradient2 == Infinity || gradient2 == -Infinity) {
        let x = line2[0][0]
        let y = line1[0][1] + gradient1 * (x - line1[0][0])
        return [x, y]
    }
    let yIntercept1 = line1[0][1] - gradient1 * line1[0][0]
    let yIntercept2 = line2[0][1] - gradient2 * line2[0][0]
    let x = (yIntercept2 - yIntercept1) / (gradient1 - gradient2)
    let y = gradient1 * x + yIntercept1
    return [x, y]
}

// determine if two values are equal with threshold difference
export function equalDist(x1, x2) {
    return Math.abs(x1 - x2) <= 0.01
}

// determine if two coords are equal with threshold difference
export function equalCoords(coord1, coord2) {
    return distTo(coord1, coord2) <= 0.01;
}

// determine if two lines are equal
export function equalLine(l1, l2) {
    return (equalCoords(l1[0], l2[0]) && equalCoords(l1[1], l2[1])) || 
    (equalCoords(l1[0], l2[1]) && equalCoords(l1[1], l2[0]))
}

// find line passing through a with a gradient
export function lineGrad(a, gradient) {
    if  (gradient == Infinity || gradient == -Infinity) {
        return [[a[0], 0], [a[0], envVar.height]]
    } else if (gradient == 0) {
        return [[0, a[1]], [envVar.width, a[1]]]
    } else {
        let yIntercept = a[1] - gradient * a[0]
        let xIntercept = - yIntercept / gradient
        let rightIntercept = yIntercept + envVar.width * gradient
        let topIntercept = xIntercept + envVar.height / gradient
        // console.log(yIntercept, xIntercept, rightIntercept, topIntercept)
        let intercepts = [[0, yIntercept], [xIntercept, 0], [envVar.width, rightIntercept], [topIntercept, envVar.height]]
        let coords = []
        for (let i of intercepts) {
            if (!exists(coords,i) && 0 <= i[0] && i[0] <= envVar.width && 0 <= i[1] && i[1] <= envVar.height) {
                coords.push(i)
            }
        }
        return [coords[0], coords[1]]
    }
}

// return line passing through points a & b
export function acrossPts(a, b) {
    let gradient = grad(a[0], a[1], b[0], b[1])
    return lineGrad(a, gradient)
}

// find perpendicular line between points a & b
export function bisectPts(a, b) {
    let gradient = -1 / grad(a[0], a[1], b[0], b[1])
    let center = centerPt(a, b)
    return lineGrad(center, gradient)
}

//find angle bisector between lines ab and ac passing through point a
export function bisectAngle(a, b, c) {
    let gradient1 = grad(a[0], a[1], b[0], b[1])
    let gradient2 = grad(a[0], a[1], c[0], c[1])
    let resGradient = Math.tan((Math.atan(gradient1) + Math.atan(gradient2)) / 2)
    // console.log(gradient1, gradient2, resGradient)
    return lineGrad(a, resGradient)
}

export function bisectLines(a, b, c, d) {
    let gradient1 = grad(a[0], a[1], b[0], b[1])
    let gradient2 = grad(c[0], c[1], d[0], d[1])
    let resGradient1 = Math.tan((Math.atan(gradient1) + Math.atan(gradient2)) / 2)
    let resGradient2 = -1 / resGradient1
    // console.log(gradient1, gradient2, resGradient1, resGradient2)
    let pt = intersect([a,c],[b,d])
    return [lineGrad(pt, resGradient1), lineGrad(pt, resGradient2)]
}