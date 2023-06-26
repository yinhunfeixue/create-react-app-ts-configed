import { Base64 } from 'js-base64'
import moment from 'moment'

require('es6-promise').polyfill()

const Tools = {}

const base64Secret = ''

/**
 * 页面默认时间获取方法
 * @param args | {date,formart,addType,addVal}
 * @return moment数据
 */
function getStartDefaultDate(args = {}) {
    if (args.date) {
        if (args.addType && args.addVal) {
            return moment(args.date, args.formart ? args.formart : 'YYYY-MM-DD')
                .add(args.addVal, args.addType)
                .format(args.formart ? args.formart : 'YYYY-MM-DD')
        } else {
            return moment(args.date, args.formart ? args.formart : 'YYYY-MM-DD')
        }
    } else {
        if (args.addType && args.addVal) {
            return moment()
                .add(args.addVal, args.addType)
                .format(args.formart ? args.formart : 'YYYY-MM-DD')
        } else {
            return moment().format(args.formart ? args.formart : 'YYYY-MM-DD')
        }
    }
}

/**
 * 年份选择框数据列表
 * @param args | {date 日期, size 长度}
 * @return yearOptions | [{label:‘2018年’,value:2018},{label:‘2018年’,value:2018}]
 */
function getYearOptions(args = {}) {
    let baseYear = ''
    if (args.date != undefined) {
        baseYear = moment(args.date).format('YYYY')
    } else {
        baseYear = moment().format('YYYY')
    }

    let size = args.size != undefined ? Math.abs(args.size) : 10
    let yearOptions = []
    let lastUpdateTime = Number(baseYear)

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < size; i++) {
        yearOptions.push({
            label: `${lastUpdateTime}年`,
            value: lastUpdateTime + '',
        })

        if (args.size == undefined || args.size >= 0) {
            lastUpdateTime = --lastUpdateTime
        } else {
            lastUpdateTime = ++lastUpdateTime
        }
    }

    return yearOptions
}

/**
 * 年份选择框数据列表
 * @param args | {date 日期, size 长度}
 * @return yearOptions | ['2018','2017'}]
 */
function getYearOptionsArray(args = {}) {
    let baseYear = ''
    if (args.date != undefined) {
        baseYear = moment(args.date).format('YYYY')
    } else {
        baseYear = moment().format('YYYY')
    }

    let size = args.size != undefined ? Math.abs(args.size) : 10
    let yearOptions = []
    let lastUpdateTime = Number(baseYear)

    for (let i = 0; i < size; i++) {
        yearOptions.push(lastUpdateTime)

        if (args.size == undefined || args.size >= 0) {
            lastUpdateTime = --lastUpdateTime
        } else {
            lastUpdateTime = ++lastUpdateTime
        }
    }

    return yearOptions
}

/**
 * [getRandom description]
 * @return {string} [description]
 */
function getRandom() {
    let Num = ''
    for (let i = 0; i < 10; i++) {
        Num += Math.floor(Math.random() * 10)
    }

    return new Date().getTime() + '_' + Num * Math.random()
}

/**
 * 年份选择框数据列表
 * @param date 日期 (moment格式)
 * @return yearOptions | 2018-07-08
 */
function dateToYYYYMMDD(date = {}) {
    let formatDate = ''
    if (date != undefined) {
        formatDate = moment(date).format('YYYYMMDD')
        formatDate = formatDate.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
    } else {
        formatDate = moment().format('YYYYMMDD')
    }
    return formatDate
}

/**
 * 年份选择框数据列表
 * @param date 日期 (moment格式)
 * @return yearOptions | 2018-07-08 00:00:00
 */
function dateToAll(date = {}) {
    let formatDate = ''
    if (date != undefined) {
        formatDate = moment(date).format('YYYY-MM-DD hh:mm:ss')
        // formatDate = formatDate.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
    } else {
        formatDate = moment().format('YYYY-MM-DD hh:mm:ss')
    }
    return formatDate
}

/**
 * 年份选择框数据列表
 * @param date 日期 （Sat, 08 Sep 2018 00:00:00 GMT）
 * @return yearOptions | 20180708
 */
function dateToYYYYMMDDByBack(date = {}, sign = '-') {
    let formatDate = ''
    if (date != undefined && date != '') {
        let d = new Date(date)
        let month = d.getMonth() + 1
        if (month < 10) {
            month = '0' + month
        }
        let day = d.getMonth()
        if (day < 10) {
            day = '0' + day
        }
        formatDate = d.getFullYear() + sign + month + sign + day
    } else {
        formatDate = ''
    }

    return formatDate
}

/**
 * 将小数转化为百分比（支持保留几位小数）
 * @param
    1、小数                0.2134、
    2、小数点后保留几位小数  1
 * @return 12.3%
 */

function pointToPercent(point, number) {
    if (point) {
        let str = Number(point * 100).toFixed(number)
        str += '%'
        return str
    } else {
        return '0'
    }
}

/**
 * 获取当前时间
 * @param type 格式 "MMYY-DD"
 * @return MMYY-DD
 */
function dateFtt(fmt, date) {
    //author: meizz
    let o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }
    return fmt
}

function crtTimeFtt(type = 'yyyy-MM') {
    let crtTime = new Date()
    return dateFtt(type, crtTime) //直接调用公共JS里面的时间类处理的办法
}

/**
 * 统计一个特定字符在 一个字符串中出现的次数
 * @param string 格式 "assdsadsfdf"
 * @param special 格式 "a"
 * @return 2
 */
function mapStringTimes(string, special) {
    let regex = new RegExp(special, 'g') // 使用g表示整个字符串都要匹配
    let result = string.match(regex)
    let count = !result ? 0 : result.length
    return count
    // console.log(c + " 的数量为 " + count)
}
/**
 *   四合五入保留3位小数
 *   @paranm x 格式：" 0.31299999 "
 *   @return   0.313
 * **/

function changeThreeDecimal(x) {
    let f_x = parseFloat(x)
    if (isNaN(f_x)) {
        // alert('function:changeThreeDecimal->parameter error')
        return false
    }
    f_x = Math.round(f_x * 1000) / 1000

    return f_x
}

/**
 *   将location的search按=截取 返回JSON对象
 *   @paranm ?page=look&from=m&id=550
 *   @return   {page:look,from:m,id:500}
 * **/
function searchToJson(url) {
    let result = {}
    let query = url.split('?')[1]
    if (query && query.length > 0) {
        let queryArr = query.split('&')
        queryArr.forEach(function (item) {
            let value = item.split('=')[1]
            let key = item.split('=')[0]
            result[key] = value
        })
    }
    return result
}

/**
 *   base64加密
 *   @paranm string 要加密的字符串
 *   @return 加密后的字符串
 * **/
function encrypt(string) {
    return Base64.encode(base64Secret + string)
}

/**
 *   base64解密
 *   @paranm string 要解密的字符串
 *   @return 解密后的字符串
 * **/
function decode(string) {
    const str = Base64.decode(string)
    return str.substring(base64Secret.length)
}

/**
 *  将时间戳转为 时间
 *   @paranm string //时间戳为10位需*1000，时间戳为13位的话不需乘1000
 *   @return 转换后的时间
 * **/
function timestampToTime(timestamp) {
    let date = ''
    if (timestamp.length === 10) {
        date = new Date(timestamp * 1000)
    } else {
        date = new Date(timestamp)
    }

    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = date.getDate() + ' '
    let h = date.getHours() + ':'
    let m = date.getMinutes() + ':'
    let s = date.getSeconds()
    return Y + M + D + h + m + s
}

/**
 * 存储空间换算处理
 *
 * @paranm int 以MB为基础的数据
 */
function storeSpaceDataConvert(size) {
    let unit = 'MB'
    let x = 1024
    if (size >= Math.pow(x, 1) && size < Math.pow(x, 2)) {
        size = size / Math.pow(x, 1)
        unit = 'GB'
    } else if (size >= Math.pow(x, 2) && size < Math.pow(x, 3)) {
        size = size / Math.pow(x, 2)
        unit = 'TB'
    } else if (size >= Math.pow(x, 3) && size < Math.pow(x, 4)) {
        size = size / Math.pow(x, 3)
        unit = 'PB'
    } else if (size >= Math.pow(x, 4) && size < Math.pow(x, 5)) {
        size = size / Math.pow(x, 4)
        unit = 'EB'
    } else if (size >= Math.pow(x, 5) && size < Math.pow(x, 6)) {
        size = size / Math.pow(x, 5)
        unit = 'ZB'
    } else if (size >= Math.pow(x, 6)) {
        size = size / Math.pow(x, 6)
        unit = 'YB'
    }

    size = (size > 0 ? parseFloat(size.toFixed(3)) : size) || 0
    return size + unit
}
function getSpaceSize(size) {
    let x = 1024
    if (size >= Math.pow(x, 1) && size < Math.pow(x, 2)) {
        size = size / Math.pow(x, 1)
    } else if (size >= Math.pow(x, 2) && size < Math.pow(x, 3)) {
        size = size / Math.pow(x, 2)
    } else if (size >= Math.pow(x, 3) && size < Math.pow(x, 4)) {
        size = size / Math.pow(x, 3)
    } else if (size >= Math.pow(x, 4) && size < Math.pow(x, 5)) {
        size = size / Math.pow(x, 4)
    } else if (size >= Math.pow(x, 5) && size < Math.pow(x, 6)) {
        size = size / Math.pow(x, 5)
    } else if (size >= Math.pow(x, 6)) {
        size = size / Math.pow(x, 6)
    }
    size = (size > 0 ? parseFloat(size.toFixed(3)) : size) || 0
    return size
}
function getSpaceUnit(size) {
    let unit = 'MB'
    let x = 1024
    if (size >= Math.pow(x, 1) && size < Math.pow(x, 2)) {
        unit = 'GB'
    } else if (size >= Math.pow(x, 2) && size < Math.pow(x, 3)) {
        unit = 'TB'
    } else if (size >= Math.pow(x, 3) && size < Math.pow(x, 4)) {
        unit = 'PB'
    } else if (size >= Math.pow(x, 4) && size < Math.pow(x, 5)) {
        unit = 'EB'
    } else if (size >= Math.pow(x, 5) && size < Math.pow(x, 6)) {
        unit = 'ZB'
    } else if (size >= Math.pow(x, 6)) {
        unit = 'YB'
    }
    return unit
}

Tools.getStartDefaultDate = getStartDefaultDate
Tools.getYearOptions = getYearOptions
Tools.getYearOptionsArray = getYearOptionsArray
Tools.getRandom = getRandom
Tools.dateToYYYYMMDD = dateToYYYYMMDD
Tools.dateToAll = dateToAll
Tools.dateToYYYYMMDDByBack = dateToYYYYMMDDByBack
Tools.pointToPercent = pointToPercent
Tools.crtTimeFtt = crtTimeFtt
Tools.mapStringTimes = mapStringTimes
Tools.changeThreeDecimal = changeThreeDecimal
Tools.searchToJson = searchToJson
Tools.encrypt = encrypt
Tools.decode = decode
Tools.timestampToTime = timestampToTime
Tools.storeSpaceDataConvert = storeSpaceDataConvert
Tools.getSpaceSize = getSpaceSize
Tools.getSpaceUnit = getSpaceUnit
export default Tools
