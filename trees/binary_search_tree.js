// Прототип двоичного дерева поиска
export default class BinarySearchTree {
    constructor() {
        this.root = null
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

    // Возвращает количество детей вершины
    childrenCount(node) {
        if (node.left === null && node.right === null) {
            return 0
        } else if ((node.left !== null && node.right === null) || (node.left === null && node.right !== null)) {
            return 1
        } else {
            return 2
        }
    }

    // Возвращает сиблинга вершины
    sibling(node) {
        if (node.parent === null) {
            return null
        }
        if (node === node.parent.left) {
            return node.parent.right
        }
        if (node === node.parent.right) {
            return node.parent.left;
        }
        return null
    }

    // Возвращает следующую вершину
    successor(node) {
        if (this.childrenCount(node) === 0 || (this.childrenCount(node) === 1 && node.left !== null)) {
            if (node.parent === null) {
                return null
            }
            let current = node
            while (current.parent !== null && current !== current.parent.left) {
                current = current.parent
            }
            return current.parent
        } else {
            let current = node.right
            while (current.left !== null) {
                current = current.left
            }
            return current
        }
    }

    // Возвращает предыдущую вершину
    predecessor(node) {
        if (this.childrenCount(node) === 0 || (this.childrenCount(node) === 1 && node.right !== null)) {

            if (node.parent === null) {
                return null
            }

            let current = node
            while (current.parent !== null && current !== current.parent.right) {
                current = current.parent
            }
            return current.parent

        } else {

            let current = node.left
            while (current.right !== null) {
                current = current.right
            }
            return current
        }
    }

    // Вставка ключа
    insert(value) {
    }

    // Поиск ключа
    find(value) {
    }

    // Удаление ключа
    delete(value) {
    }

    // Очистка (удаление) всего дерева
    clear() {
        this.root = null
    }
}