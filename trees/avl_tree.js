import BinarySearchTree from './binary_search_tree.js'

// Прототип АВЛ-дерева
export default class AVLTree extends BinarySearchTree {
    constructor() {
        super()
    }

    // Получение высоты дерева
    getHeight() {
        if (this.root === null) {
            return 0
        }
        return this.root.height
    }

    // Левый поворот
    rotateLeft(node) {
        super.rotateLeft(node)
        this.updateHeight(node)
    }

    // Правый поворот
    rotateRight(node) {
        super.rotateRight(node)
        this.updateHeight(node)
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

    // Обновление высоты вершины
    updateHeight(node) {
        let leftHeight = 0
        let rightHeight = 0
        if (node.left !== null) {
            leftHeight = node.left.height
        }
        if (node.right !== null) {
            rightHeight = node.right.height
        }

        node.height = leftHeight > rightHeight ? leftHeight + 1 : rightHeight + 1
    }

    // Получение баланса вершины
    getFactorBalance(node) {
        let leftHeight = 0
        let rightHeight = 0
        if (node.left !== null) {
            leftHeight = node.left.height
        }
        if (node.right !== null) {
            rightHeight = node.right.height
        }
        return leftHeight - rightHeight
    }

    // Балансирование вершины
    balance(node) {
        this.updateHeight(node)
        const factorBalance = this.getFactorBalance(node)

        if (factorBalance === 2) {
            if (this.getFactorBalance(node.left) >= 0) {
                this.rotateRight(node)
            } else {
                this.rotateLeftRight(node)
            }
        } else if (factorBalance === -2) {
            if (this.getFactorBalance(node.right) <= 0) {
                this.rotateLeft(node)
            } else {
                this.rotateRightLeft(node)
            }
        }

        if (node.parent !== null) {
            this.balance(node.parent)
        }
    }

    // Вставка ключа
    insert(value) {
        if (this.root === null) {
            this.root = {
                value: value,
                height: 1,
                left: null,
                right: null,
                parent: null
            }
            return
        }

        let current = this.root
        let prev = null
        while (current !== null) {
            if (value <= current.value) {
                prev = current
                current = current.left
            } else if (value > current.value) {
                prev = current
                current = current.right
            }
        }

        const node = {
            value: value,
            height: 1,
            left: null,
            right: null,
            parent: prev
        }

        if (value <= prev.value) {
            prev.left = node
        } else if (value > prev.value) {
            prev.right = node
        }

        this.balance(prev)
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

            let prev = current.parent
            if (prev !== null) {
                if (current === prev.left) {
                    prev.left = null
                } else if (current === prev.right) {
                    prev.right = null
                }
            } else {
                this.root = null
            }
            current = null
            if (prev !== null) {
                this.balance(prev)
            }

        } else if (childrenCount === 1) {

            let child = null
            if (current.left !== null) {
                child = current.left
                current.left = null
            } else if (current.right !== null) {
                child = current.right
                current.right = null
            }

            let prev = current.parent
            if (prev !== null) {
                if (current === prev.left) {
                    prev.left = child
                } else if (current === prev.right) {
                    prev.right = child
                }
            } else {
                this.root = child
            }
            child.parent = prev
            current = null
            if (prev !== null) {
                this.balance(prev)
            }

        } else {
            const succ = this.successor(current)
            const newValue = succ.value
            this.delete(newValue)
            current.value = newValue
        }
    }
}