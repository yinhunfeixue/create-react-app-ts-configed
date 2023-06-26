import Base from './base'
class SessionStorageCache extends Base {
    constructor(driver) {
        super(driver)
        this.driver = driver
    }

    set = (key, item) => {
        item = JSON.stringify(item)
        window.sessionStorage.setItem(key, item)
    }

    get = (key) => {
        if (window.sessionStorage.getItem(key)) {
            return JSON.parse(window.sessionStorage.getItem(key))
        }
        return null
    }

    remove = (key) => {
        window.sessionStorage.removeItem(key)
    }

    clear = () => {
        window.sessionStorage.clear()
    }
}

export default new SessionStorageCache()
