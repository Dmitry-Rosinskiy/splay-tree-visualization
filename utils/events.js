import { clearCanvas } from '../utils/draw_functions.js'
import SplayTree from '../trees/splay_tree.js'

// Привязка элементов интерфейса к обработчикам их событий
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
//

const numberInput = document.getElementById('number')
const scale = document.getElementById('scale')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// Фактор масштаба холста
let scaleValue = 1

const extraNumberInput = document.getElementById('extra_number')

// Объект splay-дерева
const tree = new SplayTree()

// Дезактивация всех кнопок формы
function disableAll() {
    document.getElementById('number').disabled = true
    document.getElementById('clear').disabled = true
    document.getElementById('insert').disabled = true
    document.getElementById('find').disabled = true
    document.getElementById('delete').disabled = true
    document.getElementById('create').disabled = true

    document.getElementById('splay').disabled = true
    document.getElementById('zig').disabled = true
    document.getElementById('zigzig').disabled = true
    document.getElementById('zigzag').disabled = true
}

// Активация всех кнопок формы
function enableAll() {
    document.getElementById('number').disabled = false
    document.getElementById('clear').disabled = false
    document.getElementById('insert').disabled = false
    document.getElementById('find').disabled = false
    document.getElementById('delete').disabled = false
    document.getElementById('create').disabled = false

    document.getElementById('splay').disabled = false
    document.getElementById('zig').disabled = false
    document.getElementById('zigzig').disabled = false
    document.getElementById('zigzag').disabled = false
}

// Обработчик ввода в текстовое поле для основных операций
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

// Обработчик нажатия кнопки для вставки
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

// Обработчик нажатия кнопки для поиска
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

// Обработчик нажатия кнопки для удаления
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

// Обработчик нажатия кнопки для очищения
function onClickClearButton() {
    clearCanvas()
    tree.clear()
}

// Обработчик нажатия кнопки для создания
function onClickCreateButton() {
    clearCanvas()
    tree.create()
}

// Начальная позиция холста
let xPos = 0
let yPos = 0
// Состояние нажатия левой кнопки мыши
let isMouseDown = false

// Обработчик нажатия левой кнопки мыши по холсту
function onMouseDownCanvas() {
    isMouseDown = true
}

// Обработчик отпускания левой кнопки мыши от холста
function onMouseUpCanvas() {
    isMouseDown = false
}

// Обработчик перемещения мыши по холсту
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

// Обработчик нажатия кнопки для включения / выключения анимации
function onClickAnimationButton() {
    tree.animationOn = !tree.animationOn

    if (tree.animationOn) {
        document.getElementById('animation').innerHTML = 'Выключить анимацию'
    } else {
        document.getElementById('animation').innerHTML = 'Включить анимацию'
    }
}

// Обработчик перемщения ползунка слайдера для скорости
function onInputSpeedRange() {
}

// Обработчик перемещения ползунка слайдера для масштаба
function onInputScaleRange() {
    ctx.scale(scale.value / (scaleValue * 100), scale.value / (scaleValue * 100))
    scaleValue = scaleValue * (scale.value / (scaleValue * 100))
    tree.drawAll()
}

// Обработчик нажатия флажка для показа / скрытия дополнительной панели
function onClickShowExtraCheckbox() {
    document.getElementById('operations_extra').style.visibility = document.getElementById('show_extra').checked ? 'visible' : 'hidden'
}

// Обработчик ввода в текстовое поле для дополнительных операций
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

// Обработчик нажатия кнопки splay-операции
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

// Обработчик нажатия кнопки zig-операции
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

// Обработчик нажатия кнопки zig-zig-операции
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

// Обработчик нажатия кнопки zig-zag-операции
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