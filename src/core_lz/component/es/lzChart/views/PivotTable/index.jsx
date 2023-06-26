// import Config from '../../config'
import _ from 'lodash'
import Base from '../Base'

class PivotTable extends Base {
    constructor(chartType = 'PivotTable', data) {
        super(chartType, data)
        // console.log('Column chartTypechartType')
        this.chartType = chartType

        this.renderType = 'PivotTable'

        this.items = [
            {
                name: '行',
                id: 'rows',
                inputInfo: {
                    'type': 'select',
                    'required': true,
                    'SelectedCount': 3,
                    'attr': {
                        'mode': 'multiple'
                    }
                }
            },
            {
                name: '列',
                id: 'columns',
                inputInfo: {
                    'type': 'select',
                    // 'required': true,
                    'SelectedCount': 3,
                    'attr': {
                        'mode': 'multiple'
                    }
                }
            },
            {
                name: '计算列',
                id: 'measures',
                inputInfo: {
                    'type': 'select',
                    'required': true,
                    // 'SelectedCount': 3,
                    'attr': {
                        'mode': 'multiple'
                    }
                }
            },
            {
                name: '百分比计算列',
                id: 'pivotTablePercentType',
                inputInfo: {
                    'type': 'select',
                    // 'required': true,
                    // 'SelectedCount': 3,
                    'attr': {
                        // 'mode': 'multiple'
                    }
                }
            },
            {
                name: '展示总列',
                id: 'pivotTableIsSummary',
                inputInfo: {
                    'type': 'checkbox',
                    // 'required': true,
                    // 'SelectedCount': 3,
                    'attr': {
                        // 'mode': 'multiple'
                        'checked': false
                    }
                }
            }
        ]
    }

    /**
     *  行
     *     接受输入：维度
     *     接受数量：最多三个
     *  列
     *      接受输入：度量
     *      接受数量：最多三个
     *  汇总
     *     接受输入：度量、维度
     *     接受数量：必选，可多选
     *
     */
    validateItemSetting = (item, itemSettings) => {
        // if ((!itemSettings['rows'] || itemSettings['rows'].length < 1) && (!itemSettings['columns'] || itemSettings['columns'].length < 1)) {
        //     return [
        //         {
        //             validateStatus: 'error',
        //             errorMsg: `行列必选其一！`,
        //         }
        //     ]
        // }
        let requiredMsg = this.validateRequired(item, itemSettings)

        if (requiredMsg) {
            return requiredMsg
        }

        return true
    }

    headerCallBack = (data) => {

    }

    eachHeader = (data, headCfg) => {
        let headerData = [...data]
        _.map(headerData, (element, k) => {
            element = {
                ...element,
                ...headCfg
            }

            if (headCfg.filterDropdown) {
                element.filterDropdown = (ele) => {
                    ele.selectedKeys.length < 1 && ele.selectedKeys.push(element.title)
                    return headCfg.filterDropdown(ele, { key: element.key, dataIndex: element.dataIndex, title: element.title }, this.headerCallBack)
                }
            }

            headerData[k] = element

            if (!element.width) {
                element.width = (element.columnType && element.columnType === 1) ? 100 : 100
            }
            if (element.children && element.children.length > 0) {
                headerData[k]['children'] = this.eachHeader(element.children, headCfg)
            } else {
                headerData[k] = element
            }
        })
        return headerData
    }

    handleTableHeade = (data, headCfg = {}) => {
        // return this.eachHeader(data, headCfg)
        return data
    }

    handleTableBody = (data) => {
        return data
    }
}

export default PivotTable
