import LocalStorageCache from './component/localStorageCache'
import SessionStorageCache from './component/sessionStorageCache'

class CacheService {
    static getInstance(driver) { /* 单例*/
        if (!CacheService.instance) {
            CacheService.instance = CacheService.getFactory(driver)
        }
        return CacheService.instance
    }

    static getFactory(driver) {
        switch (driver) {
                case 'localStorage' :
                    return LocalStorageCache
                case 'sessionStorage' :
                    return SessionStorageCache
                default:
                    return SessionStorageCache
        }
    }
}

const Cache = CacheService.getFactory('localStorage')

export default Cache
export { CacheService }
