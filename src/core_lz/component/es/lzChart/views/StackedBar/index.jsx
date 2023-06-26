import _ from 'lodash'
import Base from '../Base'
class StackedBar extends Base {
    constructor(chartType = 'StackedBar', data) {
        super(chartType, data)
        // console.log('Column chartTypechartType')
        this.chartType = chartType
        // this.containerOption = {
        //     // forceFit: true,
        //     // // width: 600, // 指定图表宽度
        //     // height: 500, // 指定图表高度
        //     // padding: ['auto', 130, 'auto', 'auto'],
        // }
        this.baseOptions = {
        }
        this.geoms = {

        }
        this.options = {}

        this.items = [
            {
                name: 'X轴',
                id: 'xAxis',
                inputInfo: {
                    'type': 'select',
                    'required': true,
                    'attr': {
                        // 'mode': 'multiple'
                    }
                }
            },
            {
                name: 'Y轴',
                id: 'yAxis',
                inputInfo: {
                    'type': 'select',
                    'required': true,
                    'attr': {
                        // 'mode': 'multiple'
                    }
                }
            },
            {
                name: '颜色分组',
                id: 'legend',
                inputInfo: {
                    'type': 'select',
                    'SelectedCount': 1,
                    'attr': {
                        'mode': 'multiple'
                    }
                }
            },
        ]
    }

    /**
     *  X轴
     *     接受输入：维度
     *     接受数量：1
     *  Y轴
     *      接受输入：度量
     *      接受数量：1
     *  Legend
     *       接受输入：维度
     *       接受数量：1
     *   当存在分组时，Y轴不能添加新的度量
     */
    validateItemSetting = (item, itemSettings) => {
        let requiredMsg = this.validateRequired(item, itemSettings)
        if (requiredMsg) {
            return requiredMsg
        }

        let msg = []
        if (itemSettings['legend'] && itemSettings['legend'].length > 0 && itemSettings['xAxis'] && itemSettings['xAxis'].length > 1) {
            msg.push({
                validateStatus: 'error',
                errorMsg: `当存在分组时，X轴不能添加选项！`,
            })
        }

        if (!_.isEmpty(msg)) {
            return msg
        }

        return true
    }

    // handleContainerOptions = (containerOption, data) => {
    //     let tooltip = {}
    //     // 处理 axes
    //     if (data.settings && data.settings.selectedValues) {
    //         let selectedValues = data.settings.selectedValues
    //         selectedValues.label && _.map(selectedValues.label, (element, key) => {
    //             tooltip = {
    //                 title: element.name
    //             }
    //         })
    //     }
    //     if (!_.isEmpty(tooltip)) {
    //         containerOption.options.tooltip = tooltip
    //     }

    //     return containerOption
    // }

    handleChartOptions = (option, data) => {
        // _.map(option.geoms, (element, key) => {
        //     let eleTooltip = []
        //     if (element.color) {
        //         eleTooltip.push(element.color)
        //     }
        //     if (element.position) {
        //         eleTooltip.push(element.position)
        //     }
        //     if (element.size) {
        //         eleTooltip.push(element.size)
        //     }
        //     option.geoms[key]['tooltip'] = eleTooltip.join('*')
        // })

        // if (!_.isEmpty(scales)) {
        //     option.scales = scales
        // }

        let axes = {}
        let scales = {}
        // 处理 axes
        if (data.settings && data.settings.selectedValues) {
            let selectedValues = data.settings.selectedValues
            let xLength = selectedValues.xAxis.length

            // 多 X 轴对齐处理
            // _.map(selectedValues.xAxis, (element, key) => {
            //     let scaCfg = {
            //         'min': element.min,
            //         'max': element.max
            //     }

            //     scales[element.name] = scaCfg
            // })

            _.map(selectedValues.yAxis, (element, key) => {
                // axes[element.name] = {
                //     label: {
                //         formatter: (name) => {
                //             if (!name) return ''
                //             if (name.length > 10) {
                //                 name = name.slice(0, 10) + '...'
                //             }
                //             return name
                //         }
                //     }
                // }

                let scaCfg = {}
                // if ( xLength > 1 || lLength ){
                scaCfg['type'] = 'cat'
                // }

                if (element.distinct > 15) {
                    scaCfg['tickCount'] = 15
                }

                scales[element.name] = scaCfg
            })
        }

        // option.axes = axes
        if (!_.isEmpty(scales)) {
            option.scales = scales
        }

        return option
    }
}

export default StackedBar
