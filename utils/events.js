import { clearCanvas } from './draw_functions.js'
import SplayTreeManager from '../managers/splay_tree_manager.js'
import ComparisonManager from '../managers/comparison_manager.js'

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
document.getElementById('pause').addEventListener('click', onClickPauseButton)
document.getElementById('speed').addEventListener('input', onInputSpeedRange)
document.getElementById('scale').addEventListener('input', onInputScaleRange)
document.getElementById('show_extra').addEventListener('click', onClickShowExtraCheckbox)

document.getElementById('extra_number').addEventListener('input', onInputExtraNumber)

document.getElementById('splay').addEventListener('click', onClickSplayButton)
document.getElementById('zig').addEventListener('click', onClickZigButton)
document.getElementById('zigzig').addEventListener('click', onClickZigZigButton)
document.getElementById('zigzag').addEventListener('click', onClickZigZagButton)

document.getElementById('comparison_number_AVL').addEventListener('input', onInputAVLNumber)
document.getElementById('AVL').addEventListener('click', onClickAVLButton)
document.getElementById('comparison_number_RB').addEventListener('input', onInputRBNumber)
document.getElementById('RB').addEventListener('click', onClickRBButton)
//

const numberInput = document.getElementById('number')
const scale = document.getElementById('scale')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const numberAVLInput = document.getElementById('comparison_number_AVL')
const numberRBInput = document.getElementById('comparison_number_RB')

// Фактор масштаба холста
let scaleValue = 1

const extraNumberInput = document.getElementById('extra_number')

// Объект splay-дерева
const treeManager = new SplayTreeManager()
// Объект менеджера сравнений деревьев
const comparisonManager = new ComparisonManager()

// Дезактивация всех кнопок формы
function disableAll() {
    document.getElementById('number').disabled = true
    document.getElementById('clear').disabled = true
    document.getElementById('insert').disabled = true
    document.getElementById('find').disabled = true
    document.getElementById('delete').disabled = true
    document.getElementById('create').disabled = true

    document.getElementById('extra_number').disabled = true
    document.getElementById('splay').disabled = true
    document.getElementById('zig').disabled = true
    document.getElementById('zigzig').disabled = true
    document.getElementById('zigzag').disabled = true

    document.getElementById('comparison_number_AVL').disabled = true
    document.getElementById('AVL').disabled = true
    document.getElementById('comparison_number_RB').disabled = true
    document.getElementById('RB').disabled = true
}

// Активация всех кнопок формы
function enableAll() {
    document.getElementById('number').disabled = false
    document.getElementById('clear').disabled = false
    document.getElementById('insert').disabled = false
    document.getElementById('find').disabled = false
    document.getElementById('delete').disabled = false
    document.getElementById('create').disabled = false

    document.getElementById('extra_number').disabled = false
    document.getElementById('splay').disabled = false
    document.getElementById('zig').disabled = false
    document.getElementById('zigzig').disabled = false
    document.getElementById('zigzag').disabled = false

    document.getElementById('comparison_number_AVL').disabled = false
    document.getElementById('AVL').disabled = false
    document.getElementById('comparison_number_RB').disabled = false
    document.getElementById('RB').disabled = false
}

// Обработчик ввода в текстовое поле для основных операций
function onInputNumber() {
    const digitList = '0123456789'
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
    await treeManager.insert(value)
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
    await treeManager.find(value)
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
    await treeManager.delete(value)
    enableAll()
}

// Обработчик нажатия кнопки для очищения
function onClickClearButton() {
    clearCanvas()
    treeManager.clear()
}

// Обработчик нажатия кнопки для создания
function onClickCreateButton() {
    clearCanvas()
    treeManager.create()
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
            treeManager.drawAll()
        }, 50)
    }
}

// Обработчик нажатия кнопки для включения / выключения анимации
function onClickAnimationButton() {
    treeManager.toggleAnimation()

    if (treeManager.isAnimationOn()) {
        document.getElementById('animation').innerHTML = 'Выключить анимацию'
    } else {
        document.getElementById('animation').innerHTML = 'Включить анимацию'
    }
}

// Обработчик нажатия кнопки для паузы / продолжения анимации
function onClickPauseButton() {
    treeManager.toggleAnimationPause()

    if (treeManager.isAnimationPaused()) {
        document.getElementById('pause').innerHTML = '⏵'
    } else {
        document.getElementById('pause').innerHTML = '⏸'
    }
}

// Обработчик перемещения ползунка слайдера для масштаба
function onInputScaleRange() {
    ctx.scale(scale.value / (scaleValue * 100), scale.value / (scaleValue * 100))
    scaleValue = scaleValue * (scale.value / (scaleValue * 100))
    treeManager.drawAll()
}

// Обработчик нажатия флажка для показа / скрытия дополнительной панели
function onClickShowExtraCheckbox() {
    document.getElementById('operations_extra').style.visibility = document.getElementById('show_extra').checked ? 'visible' : 'hidden'
    document.getElementById('comparison_AVL').style.visibility = document.getElementById('show_extra').checked ? 'visible' : 'hidden'
    document.getElementById('comparison_RB').style.visibility = document.getElementById('show_extra').checked ? 'visible' : 'hidden'
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
    await treeManager.splay(value)
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
    await treeManager.zig(value)
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
    await treeManager.zigzig(value)
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
    await treeManager.zigzag(value)
    enableAll()
}

// Обработчик ввода в текстовое поле для сравнения с AVL-деревом
function onInputAVLNumber() {
    const digitList = '0123456789'
    const value = numberAVLInput.value

    let wrong_pos
    for (let i = 0; i < value.length; i++) {
        if (!digitList.includes(value[i])) {
            wrong_pos = i
            break
            
        }
    }

    if (wrong_pos !== undefined) {
        numberAVLInput.value = value.slice(0, wrong_pos) + value.slice(wrong_pos + 1, value.length)
        numberAVLInput.selectionStart = wrong_pos
        numberAVLInput.selectionEnd = wrong_pos
    }
}

// Обработчик нажатия кнопки для сравнения с АВЛ-деревом
async function onClickAVLButton() {
    if (numberAVLInput.value === '') {
        return
    }

    disableAll()

    const value = Number(numberAVLInput.value)
    numberAVLInput.value = ''
    document.getElementById('header_AVL').innerHTML = "Показатели (" +  value + " операций)"
    document.getElementById('time_splay_AVL').innerHTML = "ожидание..."
    document.getElementById('time_AVL').innerHTML = "ожидание..."
    document.getElementById('height_splay_AVL').innerHTML = "ожидание..."
    document.getElementById('height_AVL').innerHTML = "ожидание..."
    comparisonManager.setOperationCount(value)

    const info = await comparisonManager.getComparisonResultsWithAVL()

    document.getElementById('time_splay_AVL').innerHTML = info.splayTreeTime
    document.getElementById('time_AVL').innerHTML = info.AVLTreeTime
    document.getElementById('height_splay_AVL').innerHTML = info.splayTreeHeight
    document.getElementById('height_AVL').innerHTML = info.AVLTreeHeight

    enableAll()
}

// Обработчик ввода в текстовое поле для сравнения с КЧ-деревом
function onInputRBNumber() {
    const digitList = '0123456789'
    const value = numberRBInput.value

    let wrong_pos
    for (let i = 0; i < value.length; i++) {
        if (!digitList.includes(value[i])) {
            wrong_pos = i
            break
            
        }
    }

    if (wrong_pos !== undefined) {
        numberRBInput.value = value.slice(0, wrong_pos) + value.slice(wrong_pos + 1, value.length)
        numberRBInput.selectionStart = wrong_pos
        numberRBInput.selectionEnd = wrong_pos
    }
}

// Обработчик нажатия кнопки для сравнения с КЧ-деревом
async function onClickRBButton() {
    if (numberRBInput.value === '') {
        return
    }

    disableAll()

    const value = Number(numberRBInput.value)
    numberRBInput.value = ''
    document.getElementById('header_RB').innerHTML = "Показатели (" +  value + " операций)"
    document.getElementById('time_splay_RB').innerHTML = "ожидание..."
    document.getElementById('time_RB').innerHTML = "ожидание..."
    document.getElementById('height_splay_RB').innerHTML = "ожидание..."
    document.getElementById('height_RB').innerHTML = "ожидание..."
    comparisonManager.setOperationCount(value)

    const info = await comparisonManager.getComparisonResultsWithRB()

    document.getElementById('time_splay_RB').innerHTML = info.splayTreeTime
    document.getElementById('time_RB').innerHTML = info.RBTreeTime
    document.getElementById('height_splay_RB').innerHTML = info.splayTreeHeight
    document.getElementById('height_RB').innerHTML = info.RBTreeHeight

    enableAll()
}