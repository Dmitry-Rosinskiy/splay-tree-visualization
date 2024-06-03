import {
    drawCircle,
    drawText,
    drawLine,
    drawRightCurvedArrow,
    drawLeftCurvedArrow,
    clearTree,
    clearLeftTextArea,
    clearRightTextArea
} from '../utils/draw_functions.js'

const canvas = document.getElementById('canvas')
const speed = document.getElementById('speed')

// Параметры изображения splay-дерева
const rootLevel = 120
const textLevel = 50
const rootCenter = canvas.width / 2
const nodeSize = 20
const levelHeight = 80

// Параметры изображения текста на холсте
const xLeftText1 = canvas.width * 1 / 6
const xLeftText2 = canvas.width * 2 / 6
const xRightText1 = canvas.width * 4 / 6
const xRightText2 = canvas.width * 5 / 6

const infinity = 1000000000

// Текст сообщений
const foundMessage = 'найдено'
const notFoundMessage = 'не найдено'
const insertedMessage = 'вставлено'
const notInsertedMessage = 'не вставлено'
const deletedMessage = 'удалено'
const notDeletedMessage = 'не удалено'

// Цвета визуализации
const nodeColor = 'light-blue'
const seekColor = 'green'
const splayColor = 'blue'
const zigColor = 'purple'
const zigzigColor = 'purple'
const zigzagColor = 'purple'
const arrowColor = 'purple'
const foundColor = 'green'
const notFoundColor = 'red'
const newNodeColor = 'blue'
const insertedColor = 'green'
const mergeColor = 'pink'
const newRootColor = 'blue'
const deleteNodeColor = 'red'
const deletedColor = 'green'
const notDeletedColor = 'red'

// Прототип splay-дерева для визуализации
export default class SplayTreeAnimation  {
constructor() {
    this.root = null
    this.height = 0
    this.animationOn = true
    this.isPaused = false
}

// Задержка
async delay() {
    while (this.isPaused) {
        await new Promise(resolve => {setTimeout(() => resolve(''), 100)})
    }
    if (this.animationOn) {
        return new Promise(resolve => {setTimeout(() => resolve(''), -speed.value * 20)})
    }
    
    return
}

// Правый поворот
rotateRight(node) {
    if (node.parent !== null) {

        node.left.parent = node.parent
        node.parent = node.left
        node.left = node.parent.right

        if (node.left !== null) {
            node.left.parent = node
        }

        node.parent.right = node

        if (node.parent.parent.left === node) {
            node.parent.parent.left = node.parent
        } else if (node.parent.parent.right === node) {
            node.parent.parent.right = node.parent
        }

    } else {

        this.root = node.left
        node.left = this.root.right

        if (node.left !== null) {
            node.left.parent = node
        }

        this.root.right = node
        node.parent = this.root
        this.root.parent = null

    }
}

// Левый поворот
rotateLeft(node) {
    if (node.parent !== null) {

        node.right.parent = node.parent
        node.parent = node.right
        node.right = node.parent.left

        if (node.right !== null) {
            node.right.parent = node
        }

        node.parent.left = node

        if (node.parent.parent.left === node) {
            node.parent.parent.left = node.parent
        } else if (node.parent.parent.right === node) {
            node.parent.parent.right = node.parent
        }

    } else {

        this.root = node.right
        node.right = this.root.left

        if (node.right !== null) {
            node.right.parent = node
        }

        this.root.left = node
        node.parent = this.root
        this.root.parent = null
        
    }
}

// Проверка, является ли вершина левым ребёнком
isLeftChild(node) {
    return node.parent.left === node
}

// Проверка, является ли вершина правым ребёнком
isRightChild(node) {
    return node.parent.right === node
}

// Поиск ключа как в обычном дереве поиска
async seek(value, startNode = this.root) {
    if (startNode === null) {
        return {found: false, node: null}
    }

    let seekInfo
    let node = startNode
    this.markedColor = seekColor

    while (true) {
        this.markedNode = node
        let comparisonSign = value < node.value ? '<' : (value > node.value ? '>' : '=')
        if (value !== infinity) {
            this.rightText1 = `${value} ${comparisonSign} ${node.value}`
        } else {
            this.rightText1 = `+∞ ${comparisonSign} ${node.value}`
        }
        
        delete this.rightText1Color
        this.drawAll()
        await this.delay()

        if (value == node.value) {
            delete this.rightText1
            this.drawAll()
            await this.delay()
            seekInfo = {found: true, node: node}
            break
        } else if (value < node.value) {
            if (node.left !== null) {
                node = node.left
            } else {
                delete this.rightText1
                this.drawAll()
                await this.delay()
                seekInfo = {found: false, node: node}
                break
            }
        } else if (value > node.value) {
            if (node.right !== null) {
                node = node.right
            } else {
                delete this.rightText1
                this.drawAll()
                await this.delay()
                seekInfo =  {found: false, node: node}
                break
            }
        }
    }

    delete this.rightText1
    this.drawAll()
    await this.delay()
    delete this.markedColor
    return seekInfo
}

// Zig-операция
async zig(node) {
    if (node === this.root) {
        return
    }

    if (this.isLeftChild(node)) {
        this.rightText2 = 'Zig right(' + node.value + ')'
        this.rightText2Color = zigColor
        this.hasRightArrow1 = node
        this.drawAll()
        await this.delay()
        delete this.hasRightArrow1
        this.rotateRight(node.parent)
        this.drawAll()
        await this.delay()
        
    } else if (this.isRightChild(node)) {
        this.rightText2 = 'Zig left(' + node.value + ')'
        this.rightText2Color = zigColor
        this.hasLeftArrow1 = node
        this.drawAll()
        await this.delay()
        delete this.hasLeftArrow1
        this.rotateLeft(node.parent)
        this.drawAll()
        await this.delay()
    }

    delete this.rightText2
    this.drawAll()
}

// Zig-zig операция
async zigzig(node) {
    if (node === this.root || node.parent === this.root) {
        return
    }

    if (this.isLeftChild(node) && this.isLeftChild(node.parent)) {
        this.rightText2 = 'Zig-zig right(' + node.value + ')'
        this.rightText2Color = zigzigColor
        this.hasRightArrow1 = node.parent
        this.hasRightArrow2 = node
        this.drawAll()
        await this.delay()
        delete this.hasRightArrow2
        this.drawAll()
        await this.delay()
        delete this.hasRightArrow1
        this.rotateRight(node.parent.parent)
        this.drawAll()
        await this.delay()
        this.hasRightArrow2 = node
        this.drawAll()
        await this.delay()
        delete this.hasRightArrow2
        this.rotateRight(node.parent)
        this.drawAll()
        await this.delay()
        
    } else if (this.isRightChild(node) && this.isRightChild(node.parent)) {
        this.rightText2 = 'Zig-zig left(' + node.value + ')'
        this.rightText2Color = zigzigColor
        this.hasLeftArrow1 = node.parent
        this.hasLeftArrow2 = node
        this.drawAll()
        await this.delay()
        delete this.hasLeftArrow2
        this.drawAll()
        await this.delay()
        delete this.hasLeftArrow1
        this.rotateLeft(node.parent.parent)
        this.drawAll()
        await this.delay()
        this.hasLeftArrow2 = node
        this.drawAll()
        await this.delay()
        delete this.hasLeftArrow2
        this.rotateLeft(node.parent)
        this.drawAll()
        await this.delay()
    }

    delete this.rightText2
    this.drawAll()
}

// Zig-zag операция
async zigzag(node) {
    if (node === this.root || node.parent === this.root) {
        return
    }

    if (this.isRightChild(node) && this.isLeftChild(node.parent)) {
        this.rightText2 = 'Zig-zag right(' + node.value + ')'
        this.rightText2Color = zigzagColor
        this.hasLeftArrow1 = node
        this.hasRightArrow2 = node.parent
        this.drawAll()
        await this.delay()
        delete this.hasRightArrow2
        this.drawAll()
        await this.delay()
        delete this.hasLeftArrow1
        this.rotateLeft(node.parent)
        this.drawAll()
        await this.delay()
        this.hasRightArrow2 = node
        this.drawAll()
        await this.delay()
        delete this.hasRightArrow2
        this.rotateRight(node.parent)
        this.drawAll()
        await this.delay()
    } else if (this.isLeftChild(node) && this.isRightChild(node.parent)) {
        this.rightText2 = 'Zig-zag left(' + node.value + ')'
        this.rightText2Color = zigzagColor
        this.hasRightArrow1 = node
        this.hasLeftArrow2 = node.parent
        this.drawAll()
        await this.delay()
        delete this.hasLeftArrow2
        this.drawAll()
        await this.delay()
        delete this.hasRightArrow1
        this.rotateRight(node.parent)
        this.drawAll()
        await this.delay()
        this.hasLeftArrow2 = node
        this.drawAll()
        await this.delay()
        delete this.hasLeftArrow2
        this.rotateLeft(node.parent)
        this.drawAll()
        await this.delay()
        
    }

    delete this.rightText2
    this.drawAll()
}

// Splay-операция
async splay(node) {
    this.markedNode = node
    this.markedColor = splayColor
    this.rightText1 = 'Splay(' + node.value + ')'
    this.rightText1Color = splayColor
    this.drawAll()
    await this.delay()

    while (node !== this.root && node.parent.value !== null) {
        this.markedNode = node
        this.drawAll()
        await this.delay()
        if (node.parent === this.root || node.parent.parent.value === null) {
            await this.zig(node)
        } else if (node.parent.parent.value !== null && ((this.isLeftChild(node) && this.isLeftChild(node.parent)) || (this.isRightChild(node) && this.isRightChild(node.parent)))) {
            await this.zigzig(node)
        } else if (node.parent.parent.value !== null && ((this.isLeftChild(node) && this.isRightChild(node.parent)) || (this.isRightChild(node) && this.isLeftChild(node.parent)))) {
            await this.zigzag(node)
        }
    }
    
   delete this.markedNode
   delete this.rightText1
   this.drawAll()
}

// Слияние двух splay-деревьев
async merge(tree1, tree2) {
    this.leftText2 = 'Merge'
    this.leftText2Color = mergeColor
    this.drawAll()
    await this.delay()

    if (tree1 === null) {
        if (tree2 !== null) {
            this.markedNode = tree2
            this.markedColor = newRootColor
            this.drawAll()
            await this.delay()
        }
        
        this.root = tree2
        if (tree2 !== null) {
            tree2.parent = null
        }
        this.markedNode = this.root
        this.markedColor = newRootColor
        this.drawAll()
        await this.delay()

        delete this.markedNode
        delete this.leftText2
        this.drawAll()
        return
    }

    const seekInfo = await this.seek(infinity, tree1)
    await this.splay(seekInfo.node)
    this.markedNode = seekInfo.node
    this.markedColor = newRootColor
    this.drawAll()
    await this.delay()

    const newRoot = this.root.left
    newRoot.parent = null
    newRoot.right = tree2
    if (tree2 !== null) {
        tree2.parent = newRoot
    }
    this.root = newRoot
    this.markedNode = newRoot
    this.drawAll()
    await this.delay()

    delete this.markedNode
    delete this.leftText2
    this.drawAll()
}

// Вставка ключа
async insert(value) {
    this.leftText1 = 'Insert (' + value + ')'
    delete this.leftText1Color
    this.drawAll()
    if (!this.root) {
        this.root = {
            value: value,
            left: null,
            right: null,
            parent: null
        }
        this.markedNode = this.root
        this.markedColor = newNodeColor
        this.drawAll()
        await this.delay()

        await this.splay(this.root)
        this.leftText1 = value + ' ' + insertedMessage
        this.leftText1Color = insertedColor
        this.drawAll()
        await this.delay()

        delete this.leftText1
        this.drawAll()
        return
    }

    const seekInfo = await this.seek(value)
    const prev = seekInfo.node

    const node = {
        value: value,
        left: null,
        right: null,
        parent: prev
    }

    if (value <= prev.value) {
        prev.left = node
    } else if (value > prev.value) {
        prev.right = node
    }

    this.markedNode = node
    this.markedColor = newNodeColor
    this.drawAll()
    await this.delay()

    await this.splay(node)
    this.leftText1 = value + ' ' + insertedMessage
    this.leftText1Color = insertedColor
    this.drawAll()
    await this.delay()

    delete this.leftText1
    this.drawAll()
}

// Поиск ключа
async find(value) {
    this.leftText1 = 'Find' + '(' + value + ')'
    delete this.leftText1Color
    this.drawAll()
    await this.delay()

    if (this.root === null) {
        this.markedNode = this.root
        this.markedColor = notFoundColor
        this.leftText1 = value + ' ' + notFoundMessage
        this.leftText1Color = notFoundColor
        this.drawAll()
        await this.delay()

        delete this.markedNode
        delete this.leftText1
        this.drawAll()
        return
    }

    const seekInfo = await this.seek(value)
    await this.splay(seekInfo.node)
    if (!seekInfo.found) {
        this.markedNode = this.root
        this.markedColor = notFoundColor
        this.leftText1 = value + ' ' + notFoundMessage
        this.leftText1Color = notFoundColor
        this.drawAll()
        await this.delay()
    } else {
        this.markedNode = this.root
        this.markedColor = foundColor
        this.leftText1 = value + ' ' + foundMessage
        this.leftText1Color = foundColor
        this.drawAll()
        await this.delay()
    }

    delete this.markedNode
    delete this.leftText1
    this.drawAll()
}

// Удаление ключа
async delete(value) {
    this.leftText1 = 'Delete' + '(' + value + ')'
    delete this.leftText1Color
    this.drawAll()
    await this.delay()

    if (this.root === null) {
        this.markedNode = this.root
        this.markedColor = notFoundColor
        this.leftText1 = value + ' ' + notDeletedMessage
        this.leftText1Color = notFoundColor
        this.drawAll()
        await this.delay()

        delete this.markedNode
        delete this.leftText1
        this.drawAll()
        return
    }

    const seekInfo = await this.seek(value)
    await this.splay(seekInfo.node)
    if (!seekInfo.found) {
        this.markedNode = this.root
        this.markedColor = notDeletedColor
        this.leftText1 = value + ' ' + notDeletedMessage
        this.leftText1Color = notDeletedColor
        this.drawAll()
        await this.delay()

        delete this.markedNode
        delete this.leftText1
        this.drawAll()
    } else {
        await this.splay(seekInfo.node)

        this.markedNode = this.root
        this.markedColor = deleteNodeColor
        this.drawAll()
        await this.delay()

        this.root.value = null
        this.drawAll()
        await this.delay()

        if (this.root.left === null && this.root.right === null) {
            this.root = null
            this.leftText1 = value + ' ' + deletedMessage
            this.leftText1Color = deletedColor
            this.drawAll()
            await this.delay()
        } else {
            await this.merge(this.root.left, this.root.right)
            this.leftText1 = value + ' ' + deletedMessage
            this.leftText1Color = deletedColor
            this.drawAll()
            await this.delay()
        }
    }

    delete this.markedNode
    delete this.leftText1
    this.drawAll()
}

// Создание splay-дерева
async create() {
    const minNodeCount = 10
    const maxNodeCount = 20
    const minValue = 0
    const maxValue = 999

    const hadAnimation = this.animationOn

    this.clear()
    this.animationOn = false
    const nodeCount = Math.floor(Math.random() * (maxNodeCount - minNodeCount + 1)) + minNodeCount
    for (let i = 0; i < nodeCount; ++i) {
        const value = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
        await this.insert(value)
    }

    this.animationOn = hadAnimation
    this.drawAll()
}

// Получение информации о номере вершины при обходе splay-дерева
order(node, orderInfo, startNode = this.root) {
    if (startNode.left !== null) {
        this.order(node, orderInfo, startNode.left, )
        if (orderInfo.found) {
            return
        }
    }
    orderInfo.order += 1
    if (startNode === node) {
        orderInfo.found = true
        return
    }
    if (startNode.right !== null) {
        this.order(node, orderInfo, startNode.right,)
        if (orderInfo.found) {
            return
        }
    }
}

// Рисование splay-дерева
drawTree(node = this.root, y = rootLevel) {
    if (node === this.root) {
        clearTree()
    }
    if (!node) {
        return
    }

    const orderInfo = {found: false, order: 0}
    this.order(node, orderInfo)
    const orderInfoRoot = {found: false, order: 0}
    this.order(this.root, orderInfoRoot)
    const offset = orderInfoRoot.order;
    const x = (orderInfo.order - offset) * (2 * nodeSize + 20) + rootCenter
    if (node.parent !== null && node.parent.value !== null) {
        const orderInfoParent = {found: false, order: 0}
        this.order(node.parent, orderInfoParent)
        const xParent = (orderInfoParent.order - offset) * (2 * nodeSize + 20) + rootCenter
        drawLine(xParent, y - levelHeight, x, y)
    }
    
    if (node.left !== null) {
        this.drawTree(node.left, y + levelHeight)
    }
    if (node.right !== null) {
        this.drawTree(node.right, y + levelHeight)
    }

    if (node.value !== null) {
        if (node !== this.markedNode) {
            drawCircle(x, y, nodeSize, nodeColor)
        } else if (this.markedNode !== undefined) {
            drawCircle(x, y, nodeSize, this.markedColor)
        }
        drawText(node.value, x, y + 5)
    }

    if (this.hasRightArrow1 === node) {
        drawRightCurvedArrow(x, y - 50, arrowColor)
        if (this.hasRightArrow2 !== undefined || this.hasLeftArrow2 !== undefined) {
            drawText('1', x, y - 75)
        }
    }
    if (this.hasLeftArrow1 === node) {
        drawLeftCurvedArrow(x, y - 50, arrowColor)
        if (this.hasRightArrow2 !== undefined || this.hasLeftArrow2 !== undefined) {
            drawText('1', x, y - 75)
        }
    }
    if (this.hasRightArrow2 === node) {
        drawRightCurvedArrow(x, y - 50, arrowColor)
        if (this.hasRightArrow1 !== undefined || this.hasLeftArrow1 !== undefined) {
            drawText('2', x, y - 75)
        }
    }
    if (this.hasLeftArrow2 === node) {
        drawLeftCurvedArrow(x, y - 50, arrowColor)
        if (this.hasRightArrow1 !== undefined || this.hasLeftArrow1 !== undefined) {
            drawText('2', x, y - 75)
        }
    }
}

// Рисование вспомогательного текста для операций
drawTexts() {
    clearLeftTextArea()
    clearRightTextArea()
    if (this.leftText1 !== undefined) {
        drawText(this.leftText1, xLeftText1, textLevel, this.leftText1Color)
    }
    if (this.leftText2 !== undefined) {
        drawText(this.leftText2, xLeftText2, textLevel, this.leftText2Color)
    }
    if (this.rightText1 !== undefined) {
        drawText(this.rightText1, xRightText1, textLevel, this.rightText1Color)
    }
    if (this.rightText2 !== undefined) {
        drawText(this.rightText2, xRightText2, textLevel, this.rightText2Color)
    }
}

// Рисование splay-дерева и вспомогательного текста для операций
drawAll() {
    this.drawTree()
    this.drawTexts()
}

clear() {
    this.root = null
}
}