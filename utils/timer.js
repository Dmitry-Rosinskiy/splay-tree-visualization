// Прототип таймера
export default class Timer {
    constructor() {
        this.startTime = undefined
        this.endTime = undefined
    }

    // Запуск таймера
    start() {
        this.startTime = Date.now()
    }

    // Остановка таймера
    end() {
        this.endTime = Date.now()
    }

    // Возвращает количество пройденных мс
    elapsed() {
        return this.endTime - this.startTime
    }
}