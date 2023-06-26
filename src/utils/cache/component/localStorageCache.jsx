import Base from './base'
class LocalStorageCache extends Base {
    constructor(driver) {
        super(driver)
        this.driver = driver
    }

    set(key, item) {
        item = JSON.stringify(item)
        window.localStorage.setItem(key, item)
    }

    get(key) {
        if (window.localStorage.getItem(key)) {
            return JSON.parse(window.localStorage.getItem(key))
        }
        return null
    }

    remove(key) {
        window.localStorage.removeItem(key)
    }

    clear() {
        window.localStorage.clear()
    }
}

export default new LocalStorageCache()
