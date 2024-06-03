import BinarySearchTree from "./binary_search_tree.js"

const infinity = 1000000000

// Прототип splay-дерева
export default class SplayTree extends BinarySearchTree {
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

    // Поиск ключа как в обычном дереве поиска
    seek(value, startNode = this.root) {
        if (startNode === null) {
            return {found: false, node: null}
        }

        let seekInfo
        let node = startNode

        while (true) {
            if (value === node.value) {
                seekInfo = {found: true, node: node}
                break
            } else if (value < node.value) {
                if (node.left !== null) {
                    node = node.left
                } else {
                    seekInfo = {found: false, node: node}
                    break
                }
            } else if (value > node.value) {
                if (node.right !== null) {
                    node = node.right
                } else {
                    seekInfo =  {found: false, node: node}
                    break
                }
            }
        }

        return seekInfo
    }

    // Zig-операция
    zig(node) {
        if (node === this.root) {
            return
        }

        if (this.isLeftChild(node)) {
            this.rotateRight(node.parent)
            
        } else if (this.isRightChild(node)) {
            this.rotateLeft(node.parent)
        }
    }

    // Zig-zig операция
    zigzig(node) {
        if (node === this.root || node.parent === this.root) {
            return
        }

        if (this.isLeftChild(node) && this.isLeftChild(node.parent)) {
            this.rotateRight(node.parent.parent)
            this.rotateRight(node.parent)
        } else if (this.isRightChild(node) && this.isRightChild(node.parent)) {
            this.rotateLeft(node.parent.parent)
            this.rotateLeft(node.parent)
        }
    }

    // Zig-zag операция
    zigzag(node) {
        if (node === this.root || node.parent === this.root) {
            return
        }

        if (this.isRightChild(node) && this.isLeftChild(node.parent)) {
            this.rotateLeft(node.parent)
            this.rotateRight(node.parent)
        } else if (this.isLeftChild(node) && this.isRightChild(node.parent)) {
            this.rotateRight(node.parent)
            this.rotateLeft(node.parent)
        }
    }

    // Splay-операция
    splay(node) {
        while (node !== this.root && node.parent.value !== null) {
            if (node.parent === this.root || node.parent.parent.value === null) {
                this.zig(node)
            } else if (node.parent.parent.value !== null && ((this.isLeftChild(node) && this.isLeftChild(node.parent)) || (this.isRightChild(node) && this.isRightChild(node.parent)))) {
                this.zigzig(node)
            } else if (node.parent.parent.value !== null && ((this.isLeftChild(node) && this.isRightChild(node.parent)) || (this.isRightChild(node) && this.isLeftChild(node.parent)))) {
                this.zigzag(node)
            }
        }
    }

    // Слияние двух splay-деревьев
    merge(tree1, tree2) {
        if (tree1 === null) {
            this.root = tree2
            if (tree2 !== null) {
                tree2.parent = null
            }
            return
        }

        const seekInfo = this.seek(infinity, tree1)
        this.splay(seekInfo.node)

        const newRoot = this.root.left
        newRoot.parent = null
        newRoot.right = tree2
        if (tree2 !== null) {
            tree2.parent = newRoot
        }
        this.root = newRoot
    }

    // Вставка ключа
    insert(value) {
        if (!this.root) {
            this.root = {
                value: value,
                left: null,
                right: null,
                parent: null
            }

            this.splay(this.root)
            return
        }

        const seekInfo = this.seek(value)
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

        this.splay(node)
    }

    // Поиск ключа
    find(value) {
        if (this.root === null) {
            return false
        }

        const seekInfo = this.seek(value)
        this.splay(seekInfo.node)
        return seekInfo.found
    }

    // Удаление ключа
    delete(value) {
        if (this.root === null) {
            return
        }

        const seekInfo = this.seek(value)
        this.splay(seekInfo.node)
        if (!seekInfo.found) {
            return
        } else {
            this.splay(seekInfo.node)

            this.root.value = null

            if (this.root.left === null && this.root.right === null) {
                this.root = null
            } else {
                this.merge(this.root.left, this.root.right)
            }
        }
    }

    // Создание splay-дерева
    create() {
        const minNodeCount = 10
        const maxNodeCount = 20
        const minValue = 0
        const maxValue = 999

        this.clear()
        const nodeCount = Math.floor(Math.random() * (maxNodeCount - minNodeCount + 1)) + minNodeCount
        for (let i = 0; i < nodeCount; ++i) {
            const value = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
            this.insert(value)
        }
    }
}