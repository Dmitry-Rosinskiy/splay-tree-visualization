import BinarySearchTree from './binary_search_tree.js'

// Цвета вершин
const Color = {
    RED: 0,
    BLACK: 1,
    DOUBLE_BLACK: 2
}

// Прототип КЧ-дерева
export default class RBTree extends BinarySearchTree {
    constructor() {
        super()
        this.height = 0
    }

    // Получение высоты дерева
    getHeight() {
        if (this.root === null) {
            return 0
        }
        this.updateHeight(this.root, 1)
        return this.height
    }

    // Используется для обновления высоты дерева (с помощью рекурсии)
    updateHeight(node, currentHeight) {
        if (node.left === null && node.right === null) {
            if (currentHeight > this.height) {
                this.height = currentHeight
            }
            return
        } else {
            if (node.left !== null) {
                this.updateHeight(node.left, currentHeight + 1)
            }
            if (node.right !== null) {
                this.updateHeight(node.right, currentHeight + 1)
            }
        }
    }

    // Большой правый поворот
    rotateLeftRight(node) {
        this.rotateLeft(node.left)
        this.rotateRight(node)
    }

    // Большой левый поворот
    rotateRightLeft(node) {
        this.rotateRight(node.right)
        this.rotateLeft(node)
    }

    // Смена цвета вершины
    changeColor(node) {
        if (node.color === Color.RED) {
            node.color = Color.BLACK
        } else if (node.color === Color.BLACK) {
            node.color = Color.RED
        }
    }

    // Возвращает сиблинга родительской вершины
    parentSibling(node) {
        const grandparent = node.parent.parent

        if (grandparent.left === node.parent) {
            return grandparent.right
        } else if (grandparent.right === node.parent) {
            return grandparent.left
        }

        return null
    }

    // Возвращает количество детей вершины с заданным цветом
    countChildrenColor(node, childColor) {
        let count = 0
        if (childColor === Color.RED) {
            if (node.left !== null && node.left.color === Color.RED) {
                ++count
            }
            if (node.right !== null && node.right.color === Color.RED) {
                ++count
            }
        } else {
            if (node.left === null || node.left.color === Color.BLACK) {
                ++count
            }
            if (node.right === null || node.right.color === Color.BLACK) {
                ++count
            }
        }

        return count
    }

    // Балансирование вершины
    balance(node) {
        if (node.parent === null) {
            this.changeColor(node)
            return
        }

        if (node.parent.color === Color.BLACK) {
            return
        }

        if (this.parentSibling(node) !== null && this.parentSibling(node).color === Color.RED) {
            this.changeColor(node.parent)
            this.changeColor(this.parentSibling(node))
            this.changeColor(node.parent.parent)
            this.balance(node.parent.parent)
        } else {
            if (this.isLeftChild(node.parent)) {
                if (this.isLeftChild(node)) {
                    this.changeColor(node.parent)
                    this.changeColor(node.parent.parent)
                    this.rotateRight(node.parent.parent)
                } else if (this.isRightChild(node)) {
                    this.changeColor(node)
                    this.changeColor(node.parent.parent)
                    this.rotateLeftRight(node.parent.parent)
                }
            } else if (this.isRightChild(node.parent)) {
                if (this.isRightChild(node)) {
                    this.changeColor(node.parent)
                    this.changeColor(node.parent.parent)
                    this.rotateLeft(node.parent.parent)
                } else if (this.isLeftChild(node)) {
                    this.changeColor(node)
                    this.changeColor(node.parent.parent)
                    this.rotateRightLeft(node.parent.parent)
                }
            }
        }
    }

    // Вставка ключа
    insert(value) {
        if (this.root === null) {
            this.root = {
                value: value,
                left: null,
                right: null,
                parent: null,
                color: Color.RED
            }
            this.changeColor(this.root)
            return
        }

        let current = this.root
        let parent = null

        while (current !== null) {
            if (value < current.value) {
                parent = current
                current = current.left
            } else if (current.value < value) {
                parent = current
                current = current.right
            } else {
                return
            }
        }

        current = {
            value: value,
            left: null,
            right: null,
            parent: null,
            color: Color.RED
        }

        if (value < parent.value) {
            parent.left = current
        } else if (parent.value < value) {
            parent.right = current
        }
        current.parent = parent

        this.balance(current)
    }

    // Поиск ключа
    find(value) {
        if (this.root === null) {
            return false
        }

        let current = this.root
        let prev = null
        while (current !== null) {
            if (value < current.value) {
                prev = current
                current = current.left
            } else if (value > current.value) {
                prev = current
                current = current.right
            } else {
                return true
            }
        }

        return false
    }

    // Удаление ключа
    delete(value) {
        let current = this.root
        while (current !== null && current.value !== value) {
            if (value < current.value) {
                current = current.left
            } else if (value > current.value) {
                current = current.right
            }
        }

        if (current === null) {
            return
        }

        const childrenCount = this.childrenCount(current)
        if (childrenCount === 0) {
            if (current.color === Color.RED) {
                const parent = current.parent
                if (parent !== null) {
                    if (current === parent.left) {
                        parent.left = null
                    } else if (current === parent.right) {
                        parent.right = null
                    }
                } else {
                    this.root = null
                }

                current = null
            } else {
                current.color = Color.DOUBLE_BLACK
                this.deleteFix(current, false)
            }

        } else if (childrenCount === 1) {
            const deleteColor = current.color

            let child = null

            if (current.left !== null) {
                child = current.left
                current.left = null
            } else if (current.right !== null) {
                child = current.right
                current.right = null
            }

            const parent = current.parent
            if (parent !== null) {
                if (current === parent.left) {
                    parent.left = child
                } else if (current === parent.right) {
                    parent.right = child
                }
            } else {
                this.root = child
            }
            child.parent = parent
            current = null

            if (deleteColor === Color.BLACK) {
                child.color = Color.BLACK
            }

        } else {
            const pred = this.predecessor(current)
            const newValue = pred.value
            this.delete(newValue)
            current.value = newValue
        }
    }

    // Используется для исправления первичного удаления вершины
    deleteFix(node, isReal) {
        if (node === this.root) {
            if (isReal) {
                node.color = Color.BLACK
            } else {
                this.root = null
            }
            return
        }

        const sibling = this.sibling(node)
        const parent = node.parent
        if (sibling.color === Color.BLACK) {
            if (this.countChildrenColor(sibling, Color.BLACK) === 2) {
                if (node.parent.color === Color.RED) {
                    sibling.color = Color.RED
                    node.color = Color.BLACK
                    parent.color = Color.BLACK
                } else {
                    sibling.color = Color.RED
                    parent.color = Color.DOUBLE_BLACK
                    node.color = Color.BLACK
                    this.deleteFix(parent, true)
                }

                if (!isReal) {
                    if (node === parent.left) {
                        parent.left = null
                    } else if (node === parent.right) {
                        parent.right = null
                    }
                    node = null
                }
            } else {
                if (parent.left === node && sibling.left !== null &&
                    sibling.left.color === Color.RED) {
                    this.changeColor(sibling)
                    this.changeColor(sibling.left)
                    this.rotateRight(sibling)
                    this.deleteFix(node, isReal)
                } else if (parent.right === node && sibling.right !== null &&
                           sibling.right.color === Color.RED) {
                    this.changeColor(sibling)
                    this.changeColor(sibling.right)
                    this.rotateLeft(sibling)
                    this.deleteFix(node, isReal)
                } else if (parent.left === node && sibling.right !== null &&
                           sibling.right.color === Color.RED) {
                    const parentColor = parent.color
                    parent.color = Color.BLACK
                    sibling.color = parentColor
                    this.rotateLeft(parent)
                    node.color = Color.BLACK
                    this.changeColor(this.parentSibling(node))
                    if (!isReal) {
                        parent.left = null
                        node = null
                    }
                } else if (parent.right === node && sibling.left !== null &&
                           sibling.left.color === Color.RED) {
                    const parentColor = parent.color
                    parent.color = Color.BLACK
                    sibling.color = parentColor
                    this.rotateRight(parent)
                    node.color = Color.BLACK
                    this.changeColor(this.parentSibling(node))
                    if (!isReal) {
                        parent.right = null
                        node = null
                    }
                }
            }
        } else {
            this.changeColor(sibling)
            this.changeColor(parent)
            if (node === parent.left) {
                this.rotateLeft(parent)
            } else if (node === parent.right) {
                this.rotateRight(parent)
            }
            this.deleteFix(node, isReal)
        }
    }
}