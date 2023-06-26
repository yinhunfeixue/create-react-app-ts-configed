import IconFont from '@/component/IconFont'
import { SearchTree } from '@/components'
import { defaultTitleRender, searchTreeDisableNodeSelectIfHasChildren, searchTreeMarkWord } from '@/components/trees/SearchTree'
import { message } from 'antd'
import moment from 'moment'
import qs from 'qs'
class ProjectUtil {
    static checkRes(res, successHandler, finaly = null) {
        const { code, msg, data } = res.data
        if (code !== 200) {
            message.error(msg)
        } else {
            successHandler(data)
        }

        if (finaly) {
            finaly()
        }
    }

    static sleep(interval = 1000) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), interval)
        })
    }

    static formNumber(value) {
        if (!value) {
            return value
        }
        return new Intl.NumberFormat('en-US').format(value)
        // return value.toString().replace(/(?<!\.\d*)(\d)(?=(\d{3})+($|\.))/g, '$1,')  //该写法不兼容safari
    }
    static numberFormat(value) {
        if (!value) {
            return value
        }
        if (value > 10000 || value == 10000) {
            return (value / 10000).toFixed(1)
        }
        return new Intl.NumberFormat('en-US').format(value)
        // return value.toString().replace(/(?<!\.\d*)(\d)(?=(\d{3})+($|\.))/g, '$1,') //该写法不兼容safari
    }
    static formDate(value) {
        if (!value) {
            return value
        }
        if (moment().subtract(1, 'hours') < moment(value)) {
            return moment().diff(moment(value), 'm') + '分钟前'
        } else if (moment().subtract(1, 'hours') > moment(value) && moment().date() == moment(value).date() && moment().month() == moment(value).month() && moment().year() == moment(value).year()) {
            return moment().diff(moment(value), 'h') + '小时前'
        } else if (
            moment().subtract(1, 'days').date() == moment(value).date() &&
            moment().subtract(1, 'days').month() == moment(value).month() &&
            moment().subtract(1, 'days').year() == moment(value).year()
        ) {
            return '昨天 ' + moment(value).format('HH:mm')
        } else {
            return moment(value).format('YYYY年MM月DD日 HH:mm')
        }
    }
    static numberFormatWithK(num) {
        if (num) {
            if (num < 1000) {
                return num
            } else if (num >= 1000 && num < 1000000) {
                return (num / 1000).toFixed(1) + 'K'
            } else if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M'
            }
        } else {
            return '0'
        }
    }

    static getPageParam(props) {
        return props.location.state || qs.parse(props.location.search, { ignoreQueryPrefix: true })
    }

    static setDocumentTitle(title) {
        const mainTitle = '量之数据运营平台 DOP'
        let renderTitle = (value) => {
            let theConvertDiv = document.createElement('div')
            theConvertDiv.innerHTML = value
            return theConvertDiv.innerText
        }
        if (title && title.indexOf('首页') < 0) {
            document.title = renderTitle(title + '-' + mainTitle)
        } else {
            document.title = mainTitle
        }
    }

    static historyBack() {
        if (history.length > 1) {
            history.back()
            return Promise.resolve()
        } else {
            return Promise.reject()
        }
    }

    /**
     *
     * @param {any[]} a
     * @param {any[]} b
     */
    static equalArray(a, b, sort = false) {
        if (!Array.isArray(a) || !Array.isArray(b)) {
            return false
        }
        const useA = sort ? a.sort() : a
        const useB = sort ? b.sort() : b
        return useA.length === useB.length && useA.every((item, index) => useB[index] === item)
    }

    static equalArrayDeep(a, b) {
        return JSON.stringify(a) === JSON.stringify(b)
    }

    static isEmptyArray(array) {
        return !array || !array.length
    }

    static formatBigNumber(value) {
        if (!value) {
            return 0
        }
        // 格式为化万、亿、兆格式
        const wan = 10000
        const yi = wan * 10000
        const zhao = yi * 10000

        const list = [
            {
                unit: '兆',
                value: zhao,
            },
            {
                unit: '亿',
                value: yi,
            },
            {
                unit: '万',
                value: wan,
            },
        ]

        let unit = ''
        for (let i = 0; i < list.length; i++) {
            const item = list[i]
            if (value > item.value) {
                value /= item.value
                unit = item.unit
                break
            }
        }

        value = Math.round(value * 100) / 100
        return `${this.formNumber(value)}${unit}`
    }
    static formatBigNumberFixed1(value) {
        if (!value) {
            return 0
        }
        // 格式为化万、亿、兆格式
        const wan = 10000
        const yi = wan * 10000
        const zhao = yi * 10000

        const list = [
            {
                unit: '兆',
                value: zhao,
            },
            {
                unit: '亿',
                value: yi,
            },
            {
                unit: '万',
                value: wan,
            },
        ]

        let unit = ''
        for (let i = 0; i < list.length; i++) {
            const item = list[i]
            if (value > item.value) {
                value /= item.value
                unit = item.unit
                break
            }
        }

        value = this.fixedNumber(Math.round(value * 100) / 100, 1)
        return `${this.formNumber(value)}${unit}`
    }

    /**
     * 保留数字的指定位小数，和toFixed不同
     *
     * 1. 此函数返回值仍是数字
     * 2. 此函数返回值，会去掉无用的0，例如 0.103，toFixed(2)=0.10，此函数=0.1
     * @param {*} value
     * @param {*} fractionDigits
     * @returns
     */
    static fixedNumber(value, fractionDigits = 2) {
        value = Number(value)
        if (!value) {
            return 0
        }
        const result = Math.round(value * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits)
        return result
    }

    /**
     * 获取树结点的图标
     * @param {*} type  0=文件夹  2=数据源  3=icon图片
     * @param {*} icon
     */
    static getTreeNodeIcon(type, icon) {
        if (icon) {
            return <img src={icon} style={{ width: 14, height: 14, objectFit: 'contain' }} />
        }

        const icons = {
            0: <IconFont type='icon-wenjian1' />,
            1: <IconFont type='e6da' useCss />,
            2: <IconFont type='e6c7' useCss />,
        }
        return icons[type]
    }

    /**
     *
     * @param {any[]} treeData
     * @param {Function} onSelect
     * @param {{
     * fieldNames?:{key:string, title:string, children:string},
     * disableNodeSelect?: (node) => boolean
     * defaultSelectedEqual?:(node) => boolean
     * }} params
     * @returns
     */
    static renderSystemTree(treeData, onSelect, params = undefined) {
        // { key: 'id', title: 'name' } 是本项目中常用值 ，{ key: 'key', title: 'title' } 是antd默认值；fieldNames不设置，使用项目默认值；设置为空使用antd默认值
        let {
            fieldNames = { key: 'key', title: 'title' },
            disableNodeSelect,
            defaultSelectedEqual,
            treeKey,
        } = {
            ...{ fieldNames: { key: 'id', title: 'name' }, disableNodeSelect: searchTreeDisableNodeSelectIfHasChildren, defaultSelectedEqual: (node) => node.leaf },
            ...params,
        }

        console.log('treeKeytreeKeytreeKeytreeKeytreeKeytreeKey', treeKey)

        return (
            <SearchTree
                key={treeKey}
                style={{ height: '100%' }}
                treeProps={{
                    treeData,
                    fieldNames,
                    onSelect,
                }}
                treeTitleRender={(node, searchKey) => {
                    return defaultTitleRender(
                        node,
                        (node) => {
                            return {
                                icon: ProjectUtil.getTreeNodeIcon(node.type, node.icon),
                                title: (
                                    <span>
                                        {node.dataWarehouse ? (
                                            <span
                                                style={{
                                                    maxWidth: 40,
                                                    height: 16,
                                                    background: '#95A9BD',
                                                    borderRadius: '2px',
                                                    color: '#fff',
                                                    fontSize: '9px',
                                                    padding: '0 3px',
                                                    display: 'inline-block',
                                                    lineHeight: '16px',
                                                    overflowX: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    float: 'left',
                                                    margin: '11px 8px 0 0',
                                                }}
                                            >
                                                DW
                                            </span>
                                        ) : null}
                                        {searchTreeMarkWord(node[fieldNames.title], searchKey)}
                                    </span>
                                ),
                                extra: node.count,
                            }
                        },
                        searchKey
                    )
                }}
                disableNodeSelect={disableNodeSelect}
                defaultSelectedEqual={defaultSelectedEqual}
            />
        )
    }
}

export default ProjectUtil
