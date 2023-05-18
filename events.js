import { clearCanvas } from './draw_functions.js'
import SplayTree from './tree.js'

document.getElementById('number').addEventListener('input', onInputNumber)

document.getElementById('insert').addEventListener('click', onClickInsertButton)
document.getElementById('find').addEventListener('click', onClickFindButton)
document.getElementById('delete').addEventListener('click', onClickDeleteButton)
document.getElementById('clear').addEventListener('click', onClickClearButton)
document.getElementById('create').addEventListener('click', onClickCreateButton)


document.getElementById('canvas').addEventListener('mousedown', onMouseDownCanvas)
document.getElementById('canvas').addEventListener('mouseup', onMouseUpCanvas)
document.getElementById('canvas').addEventListener('mousemove', onMouseMoveCanvas)

document.getElementById('animation').addEventListener('click', onClickAnimationButton)
document.getElementById('speed').addEventListener('input', onInputSpeedRange)
document.getElementById('scale').addEventListener('input', onInputScaleRange)
document.getElementById('show_extra').addEventListener('click', onClickShowExtraCheckbox)

document.getElementById('extra_number').addEventListener('input', onInputExtraNumber)

document.getElementById('splay').addEventListener('click', onClickSplayButton)
document.getElementById('zig').addEventListener('click', onClickZigButton)
document.getElementById('zigzig').addEventListener('click', onClickZigZigButton)
document.getElementById('zigzag').addEventListener('click', onClickZigZagButton)

const numberInput = document.getElementById('number')
const scale = document.getElementById('scale')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let scaleValue = 1

const extraNumberInput = document.getElementById('extra_number')

const tree = new SplayTree()

function disableAll() {
    document.getElementById('number').disabled = true
    document.getElementById('clear').disabled = true
    document.getElementById('insert').disabled = true
    document.getElementById('find').disabled = true
    document.getElementById('delete').disabled = true

    document.getElementById('splay').disabled = true
    document.getElementById('zig').disabled = true
    document.getElementById('zigzig').disabled = true
    document.getElementById('zigzag').disabled = true
}

function enableAll() {
    document.getElementById('number').disabled = false
    document.getElementById('clear').disabled = false
    document.getElementById('insert').disabled = false
    document.getElementById('find').disabled = false
    document.getElementById('delete').disabled = false

    document.getElementById('splay').disabled = false
    document.getElementById('zig').disabled = false
    document.getElementById('zigzig').disabled = false
    document.getElementById('zigzag').disabled = false
}

function onInputNumber() {
    const digitList = '01234567890'
    const value = numberInput.value

    let wrong_pos
    for (let i = 0; i < value.length; i++) {
        if (!digitList.includes(value[i])) {
            wrong_pos = i
            break
            
        }
    }

    if (wrong_pos !== undefined) {
        numberInput.value = value.slice(0, wrong_pos) + value.slice(wrong_pos + 1, value.length)
        numberInput.selectionStart = wrong_pos
        numberInput.selectionEnd = wrong_pos
    }
}

async function onClickInsertButton() {
    if (numberInput.value === '') {
        return
    }

    disableAll()
    const value = Number(numberInput.value)
    numberInput.value = ''
    await tree.insert(value)
    enableAll()
}

async function onClickFindButton() {
    if (numberInput.value === '') {
        return
    }
    disableAll()
    const value = Number(numberInput.value)
    numberInput.value = ''
    await tree.find(value)
    enableAll()
}

async function onClickDeleteButton() {
    if (numberInput.value === '') {
        return
    }

    disableAll()
    const value = Number(numberInput.value)
    numberInput.value = ''
    await tree.delete(value)
    enableAll()
}

function onClickClearButton() {
    clearCanvas()
    tree.clear()
}

function onClickCreateButton() {
    clearCanvas()
    tree.create()
}

let xPos = 0
let yPos = 0
let isMouseDown = false

function onMouseDownCanvas() {
    isMouseDown = true
}

function onMouseUpCanvas() {
    isMouseDown = false
}

function onMouseMoveCanvas(event) {
    xPos = event.clientX
    yPos = event.clientY
    if (isMouseDown) {
        setTimeout(() => {
            const dx = -(event.clientX - xPos) / 5
            const dy = -(event.clientY - yPos) / 5

            xPos = event.clientX
            yPos = event.clientY
            clearCanvas()
            ctx.translate(dx, dy)
            tree.drawAll()
        }, 50)
        
    }
}

function onClickAnimationButton() {
    tree.animationOn = !tree.animationOn

    if (tree.animationOn) {
        document.getElementById('animation').innerHTML = 'Выключить анимацию'
    } else {
        document.getElementById('animation').innerHTML = 'Включить анимацию'
    }
}

function onInputSpeedRange() {
}

function onInputScaleRange() {
    ctx.scale(scale.value / (scaleValue * 100), scale.value / (scaleValue * 100))
    scaleValue = scaleValue * (scale.value / (scaleValue * 100))
    tree.drawAll()
}

function onClickShowExtraCheckbox() {
    document.getElementById('operations_extra').style.visibility = document.getElementById('show_extra').checked ? 'visible' : 'hidden'
}

function onInputExtraNumber() {
    const digitList = '01234567890'
    const value = extraNumberInput.value

    let wrong_pos
    for (let i = 0; i < value.length; i++) {
        if (!digitList.includes(value[i])) {
            wrong_pos = i
            break
            
        }
    }

    if (wrong_pos !== undefined) {
        extraNumberInput.value = value.slice(0, wrong_pos) + value.slice(wrong_pos + 1, value.length)
        extraNumberInput.selectionStart = wrong_pos
        extraNumberInput.selectionEnd = wrong_pos
    }
}

async function onClickSplayButton() {
    if (extraNumberInput.value === '') {
        return
    }

    disableAll()
    const value = Number(extraNumberInput.value)
    extraNumberInput.value = ''
    const hadAnimation = tree.animationOn
    tree.animationOn = false
    const seekInfo = await tree.seek(value)
    tree.animationOn = hadAnimation
    if (seekInfo.node !== null) {
        await tree.splay(seekInfo.node)
    }
    enableAll()
}

async function onClickZigButton() {
    if (extraNumberInput.value === '') {
        return
    }

    disableAll()
    const value = Number(extraNumberInput.value)
    extraNumberInput.value = ''
    const hadAnimation = tree.animationOn
    tree.animationOn = false
    const seekInfo = await tree.seek(value)
    tree.animationOn = hadAnimation
    if (seekInfo.node !== null) {
        tree.markedColor = 'purple'
        await tree.zig(seekInfo.node)
        delete tree.markedNode
        tree.drawAll()
    }
    enableAll()
}

async function onClickZigZigButton() {
    if (extraNumberInput.value === '') {
        return
    }

    disableAll()
    const value = Number(extraNumberInput.value)
    extraNumberInput.value = ''
    const hadAnimation = tree.animationOn
    tree.animationOn = false
    const seekInfo = await tree.seek(value)
    tree.animationOn = hadAnimation
    if (seekInfo.node !== null) {
        tree.markedColor = 'purple'
        await tree.zigzig(seekInfo.node)
        delete tree.markedNode
        tree.drawAll()
    }
    enableAll()
}

async function onClickZigZagButton() {
    if (extraNumberInput.value === '') {
        return
    }

    disableAll()
    const value = Number(extraNumberInput.value)
    extraNumberInput.value = ''
    const hadAnimation = tree.animationOn
    tree.animationOn = false
    const seekInfo = await tree.seek(value)
    tree.animationOn = hadAnimation
    if (seekInfo.node !== null) {
        tree.markedColor = 'purple'
        await tree.zigzag(seekInfo.node)
        delete tree.markedNode
        tree.drawAll()
    }
    enableAll()
}
