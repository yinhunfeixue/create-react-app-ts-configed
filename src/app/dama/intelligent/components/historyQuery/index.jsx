import _ from 'underscore'
import { CacheService } from 'app_utils/cache'
const Cache = CacheService.getFactory('localStorage')

/**
 * 历史问句相关处理
 * 存储 store
 * 匹配 match
 */
class HistoryQuery {
    constructor() {
        this.historyQueryMax = 30 // 历史问句保留最多最新条数
    }

    // 保留最新的5个历史query
    store = (query, type) => {
        let historyQueryList = {}
        if (_.isEmpty(query)) {
            return
        }
        if (Cache.get('historyQueryList')) {
            historyQueryList = Cache.get('historyQueryList')
        }

        if (!(historyQueryList instanceof Object)) {
            historyQueryList = {}
        }

        if (historyQueryList[type] === undefined) {
            historyQueryList[type] = []
        }

        if (historyQueryList[type].length > this.historyQueryMax) {
            historyQueryList[type] = historyQueryList[type].slice(-this.historyQueryMax)
        }

        if (_.indexOf(historyQueryList[type], query) === -1) {
            historyQueryList[type].push(query)
        }
        console.log(historyQueryList, '---historyQueryListhistoryQueryList--')
        Cache.set('historyQueryList', historyQueryList)
    }

    // 历史问句匹配,返回最多5条匹配的字符串
    match = (query, type) => {
        let historyQueryList = Cache.get('historyQueryList')
        let matchQuerys = []

        if (historyQueryList && historyQueryList[type]) {
            if (_.isEmpty(query)) {
                if (historyQueryList[type].length <= 5) {
                    matchQuerys = historyQueryList[type]
                } else {
                    matchQuerys = historyQueryList[type].slice(-5)
                }
            } else {
                _.map(historyQueryList[type], (item, index) => {
                    if (!_.isEmpty(item) && item.includes(query) && matchQuerys.length <= 5) {
                        matchQuerys.push(item)
                        // let itemStr = item.replace('/' + query + '/', "<span class='highlight'>" + query + '</span>')
                        // matchQuerys.push(itemStr)
                    }
                })
            }
        }
        console.log(matchQuerys, '----matchQuerysmatchQuerys-----')
        return matchQuerys
    }
}

export default new HistoryQuery()
