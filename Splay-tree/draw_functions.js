const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

function getRGB(color) {
    switch(color) {
        case undefined:
            return 'rgb(0, 0, 0)'
        case 'red':
            return 'rgb(255, 45, 52)'
        case 'green':
            return 'rgb(0, 197, 37)'
        case 'blue':
            return 'rgb(0, 13, 248)'
        case 'light-blue':
            return 'rgb(0, 116, 250)'
        case 'purple':
            return 'rgb(172, 92, 250)'
        case 'pink':
            return 'rgb(255, 142, 144)'
        default:
            return 'rgb(0, 0, 0)'
    }
}

function drawRGBCircle(x, y, r, rgb) {
    ctx.beginPath()
    ctx.strokeStyle = rgb
    ctx.lineWidth = 5
    ctx.fillStyle = 'white'
    ctx.arc(x, y, r, 0, 2 * Math.PI) 
    ctx.stroke()
    ctx.fill()
}

function drawCircle(x, y, r, color) {
    const rgb = getRGB(color)
    drawRGBCircle(x, y, r, rgb)
}

function drawRGBText(text, x, y, rgb) {
    ctx.beginPath()
    ctx.fillStyle = rgb
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(text, x, y)
}

function drawText(text, x, y, color) {
    const rgb = getRGB(color)
    drawRGBText(text, x, y, rgb)
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

function drawRGBRightCurvedArrow(x, y, rgb) {
    const r = 40
    const arrowWidth = 10

    x += r / 2
    y += r / 2

    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'black'
    ctx.fillStyle = rgb
    ctx.arc(x, y, r + arrowWidth / 2, Math.PI, 3 * Math.PI / 2)
    ctx.lineTo(x, y - r - arrowWidth)
    ctx.lineTo(x + arrowWidth, y - r)
    ctx.lineTo(x, y - r + arrowWidth)
    ctx.lineTo(x, y - r + arrowWidth / 2)
    ctx.arc(x, y, r - arrowWidth / 2, Math.PI * 3 / 2, Math.PI, true)
    ctx.lineTo(x - r - arrowWidth / 2 - 1, y)
    ctx.stroke()
    ctx.fill()
}

function drawRightCurvedArrow(x, y, color) {
    const rgb = getRGB(color)
    drawRGBRightCurvedArrow(x, y, rgb)
}

function drawRGBLeftCurvedArrow(x, y, rgb) {
    const r = 40
    const arrowWidth = 10

    x -= r / 2
    y += r / 2

    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'black'
    ctx.fillStyle = rgb
    ctx.arc(x, y, r + arrowWidth / 2, 0, 3 * Math.PI / 2, true)
    ctx.lineTo(x, y - r - arrowWidth)
    ctx.lineTo(x - arrowWidth, y - r)
    ctx.lineTo(x, y - r + arrowWidth)
    ctx.lineTo(x, y - r + arrowWidth / 2)
    ctx.arc(x, y, r - arrowWidth / 2, Math.PI * 3 / 2, 0)
    ctx.lineTo(x + r + arrowWidth / 2 + 1, y)
    ctx.stroke()
    ctx.fill()
}

function drawLeftCurvedArrow(x, y, color) {
    const rgb = getRGB(color)
    drawRGBLeftCurvedArrow(x, y, rgb)
}

function clearCanvas() {
    ctx.clearRect(-1000000, -1000000, 2000000, 2000000)
}

function clearTree() {
    ctx.clearRect(-1000000, 90, 2000000, 2000000)
}

function clearRightTextArea() {
    ctx.clearRect(canvas.width * 1 / 2, 0, canvas.width * 1 / 2, 90)
}

function clearLeftTextArea() {
    ctx.clearRect(0, 0, canvas.width * 1 / 2, 90)
}

export {
        drawCircle,
        drawText,
        drawLine,
        drawRightCurvedArrow,
        drawLeftCurvedArrow,
        clearCanvas,
        clearTree,
        clearLeftTextArea,
        clearRightTextArea
        }