import SplayTree from "../trees/splay_tree.js"
import AVLTree from "../trees/avl_tree.js"
import RBTree from "../trees/rb_tree.js"
import Timer from "../utils/timer.js"

// Прототип менеджера для сравнения деревьев
export default class ComparisonManager {
    constructor() {
        this.splayTree = new SplayTree()
        this.AVLTree = new AVLTree()
        this.RBTree = new RBTree()
        this.minValue = -10000
        this.maxValue = 10000
    }

    // Установка количества операций во время сравнений
    setOperationCount(count) {
        this.operationCount = count
    }

    // Получить результаты сравнения splay-дерева с АВЛ-деревом
    async getComparisonResultsWithAVL() {
        const treesInfo = await this.compareTrees(this.splayTree, this.AVLTree)
        const comparisonInfo = {
            splayTreeTime: treesInfo.time1,
            AVLTreeTime: treesInfo.time2,
            splayTreeHeight: treesInfo.height1,
            AVLTreeHeight: treesInfo.height2
        }
        return comparisonInfo
    }

    // Получить результаты сравнения splay-дерева с КЧ-деревом
    async getComparisonResultsWithRB() {
        const treesInfo = await this.compareTrees(this.splayTree, this.RBTree)
        const comparisonInfo = {
            splayTreeTime: treesInfo.time1,
            RBTreeTime: treesInfo.time2,
            splayTreeHeight: treesInfo.height1,
            RBTreeHeight: treesInfo.height2
        }
        return comparisonInfo
    }

    // Сравнение двух двоичных деревьев поиска
    async compareTrees(tree1, tree2) {
        const operationList = await this.getOperations()
        const tree1Info = this.getTreeInfo(tree1, operationList)
        const tree2Info = this.getTreeInfo(tree2, operationList)

        const treeInfo = {
            height1: tree1Info.height,
            time1: tree1Info.time,
            height2: tree2Info.height,
            time2: tree2Info.time
        }
        return treeInfo
    }

    // Проведение операций над деревом и получение соответствующих результатов
    getTreeInfo(tree, operationList) {
        tree.clear()
        const timer = new Timer()
        timer.start()
        for (let i = 0; i < operationList.length; i++) {
            const {oper, value} = operationList[i]
            switch (oper) {
                case 0:
                    tree.insert(value)
                    break
                case 1:
                    tree.find(value)
                    break
                case 2:
                    tree.delete(value)
                    break
            }
        }
        timer.end()
        return {height: tree.getHeight(), time: timer.elapsed()}
    }

    // Генерация списка операций и его получение
    async getOperations() {
        this.treeValues = new Set()
        this.notTreeValues = new Set()
        for (let i = this.minValue; i <= this.maxValue; i++) {
            this.notTreeValues.add(i)
        }

        const operations = []
        let delayCount = 0
        for (let i = 0; i < this.operationCount; i++) {
            const operationNum = this.getOperation(0.7, 0.2, 0.1)
            let value
            switch (operationNum) {
                case 0:
                   value = this.getRandomValue(this.notTreeValues)
                   this.treeValues.add(value)
                   this.notTreeValues.delete(value)
                   break
                case 1:
                    value = this.getRandomValue(this.treeValues)
                    break
                case 2:
                    value = this.getRandomValue(this.treeValues)
                    this.treeValues.delete(value)
                    this.notTreeValues.add(value)
                    break
            }
            operations.push({oper: operationNum, value: value})
            if (delayCount === 1000) {
                await this.delay()
                delayCount = 0
            } else {
                delayCount++
            }
        }

        return operations
    }

    // Получение операции согласно заданной вероятности для каждого вида
    getOperation(insertProb, findProb, deleteProb) {
        if (this.isTreeFull()) {
            findProb /= 1 - insertProb
            deleteProb /= 1 - insertProb
            insertProb = 0
        } else if (this.isTreeEmpty()) {
            insertProb = 1
            findProb = 0
            deleteProb = 0
        }

        const randomValue = Math.random()
        if (randomValue <= insertProb) {
            return 0
        } else if (randomValue <= insertProb + findProb) {
            return 1
        } else {
            return 2
        }
    }

    // Получение случайного значения из множества
    getRandomValue(set) {
        const a = new Set()
        a.size
        const stopAt = Math.floor(Math.random() * set.size)
        let i = 0
        for (const value of set) {
            if (i === stopAt) {
                return value
            }
            i++
        }
        return undefined
    }

    // Проверяет, является ли текущее проверяемое дерево полным
    isTreeFull() {
        return this.notTreeValues.size === 0
    }

    // Проверяет, является ли текущее проверяемое дерево пустым
    isTreeEmpty() {
        return this.treeValues.size === 0
    }

    // Задержка (используется для того, чтобы UI не блокировался во время проведения сравнения)
    async delay() {
        return new Promise(resolve => {setTimeout(() => resolve(''), 1)})
    }
}