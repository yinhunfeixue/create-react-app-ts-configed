import moment from 'moment'

moment.defineLocale('zh-cn', {
    relativeTime: {
        future: '%s内',
        past: '%s前',
        s: '几秒',
        m: '1分钟',
        mm: '%d分钟',
        h: '1小时',
        hh: '%d小时',
        d: '1天',
        dd: '%d天',
        M: '1个月',
        MM: '%d个月',
        y: '1年',
        yy: '%d年',
    },
})

/* 
  1、当日：
    a: 1小时内： xx分钟前
    b: 超过1小时：xx小时前
  2、前一天
    昨天
  3、2天前
    xx月xx日
  4、去年
    xx年xx月xx日

*/

function formatTimeDetail(currentTime: moment.MomentInput) {
    //  今天
    const isToday = moment(currentTime).isSame(moment(), 'day')
    if (isToday) {
        const diffHours = moment(currentTime).diff(moment(), 'hours') * -1
        const diffMinues = moment(currentTime).diff(moment(), 'minutes') * -1
        const diffSeconds = moment(currentTime).diff(moment(), 'seconds') * -1
        // 由小到达
        if (diffSeconds < 60) {
            return `${diffSeconds === 0 ? 1 : diffSeconds}秒前`
        }
        if (diffMinues < 60) {
            return `${diffMinues === 0 ? 1 : diffMinues}分钟前`
        }
        return `${diffHours === 0 ? 1 : diffHours}小时前`
    }
    // 昨天
    const isYesterday = moment(currentTime).isSame(moment().subtract(1, 'day'), 'day')
    if (isYesterday) {
        return `昨天 ${moment(currentTime).format('HH:mm')}`
    }
    // 2天前到今天内: 前面的都是精确捕捉，这里只要是今年内的就行
    const beforeYesterday = moment(currentTime).isSame(moment(), 'year')
    if (beforeYesterday) {
        return moment(currentTime).format('MM月DD日 HH:mm')
    }

    // 其它情况，年-月-日
    return moment(currentTime).format('YYYY年MM月DD日 HH:mm')
}

export default {
    formatTimeDetail,
}
