import SplayTreeAnimation from '../trees/splay_tree_anim.js'

// Прототип менеджера splay-дерева
export default class SplayTreeManager {
    constructor() {
        this.tree = new SplayTreeAnimation()
    }

    // Вставка ключа в splay-дерево
    async insert(value) {
        await this.tree.insert(value)
    }

    // Поиск ключа в splay-дереве
    async find(value) {
        await this.tree.find(value)
    }

    // Удаление ключа в splay-дереве
    async delete(value) {
        await this.tree.delete(value)
    }

    // Очистка (удаление) splay-дерева
    clear() {
        this.tree.clear()
    }

    // Создание splay-дерева
    create() {
        this.tree.create()
    }

    // Включение/Выключение анимации
    toggleAnimation() {
        this.tree.animationOn = !this.tree.animationOn
    }

    // Проверяет, включена ли анимация
    isAnimationOn() {
        return this.tree.animationOn
    }

    // Ставит на паузу/Продолжает визуализацию
    toggleAnimationPause() {
        this.tree.isPaused = !this.tree.isPaused
    }

    // Проверяет, стоит ли визуализация на паузе
    isAnimationPaused() {
        return this.tree.isPaused
    }

    // Рисование splay-дерева
    drawAll() {
        this.tree.drawAll()
    }

    // Splay-операция
    async splay(value) {
        const hadAnimation = this.tree.animationOn
        this.tree.animationOn = false
        const seekInfo = await this.tree.seek(value)
        this.tree.animationOn = hadAnimation
        if (seekInfo.node !== null) {
            await this.tree.splay(seekInfo.node)
        }
    }

    // Zig-поворот
    async zig(value) {
        const hadAnimation = this.tree.animationOn
        this.tree.animationOn = false
        const seekInfo = await this.tree.seek(value)
        this.tree.animationOn = hadAnimation
        if (seekInfo.node !== null) {
            this.tree.markedColor = 'purple'
            await this.tree.zig(seekInfo.node)
            delete this.tree.markedNode
            this.tree.drawAll()
        }
    }

    // Zig-zig поворот
    async zigzig(value) {
        const hadAnimation = this.tree.animationOn
        this.tree.animationOn = false
        const seekInfo = await this.tree.seek(value)
        this.tree.animationOn = hadAnimation
        if (seekInfo.node !== null) {
            this.tree.markedColor = 'purple'
            await this.tree.zigzig(seekInfo.node)
            delete this.tree.markedNode
            this.tree.drawAll()
        }
    }

    // Zig-zag поворот
    async zigzag(value) {
        const hadAnimation = this.tree.animationOn
        this.tree.animationOn = false
        const seekInfo = await this.tree.seek(value)
        this.tree.animationOn = hadAnimation
        if (seekInfo.node !== null) {
            this.tree.markedColor = 'purple'
            await this.tree.zigzag(seekInfo.node)
            delete this.tree.markedNode
            this.tree.drawAll()
        }
    }
}