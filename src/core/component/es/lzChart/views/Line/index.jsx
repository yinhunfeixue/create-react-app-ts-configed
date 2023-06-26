import _ from 'lodash'
import Base from '../Base'
class Line extends Base {
    constructor(chartType = 'Line', data) {
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
                    'SelectedCount': 1,
                    'attr': {
                        'mode': 'multiple'
                    }
                }
            },
            {
                name: 'Y轴',
                id: 'yAxis',
                inputInfo: {
                    'type': 'select',
                    'required': true,
                    'SelectedCount': 2,
                    'attr': {
                        'mode': 'multiple'
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

        this.distinct = 5
    }

    /**
     *  X轴
     *     接受输入：维度
     *     接受数量：1
     *  Y轴
     *      接受输入：度量
     *      接受数量：小于等于2
     *  Legend
     *       接受输入：维度
     *       接受数量：1
     *   当存在分组时，Y轴不能添加新的度量
     *   当Y轴有2个度量时，不能分组
     */
    validateItemSetting = (item, itemSettings) => {
        let requiredMsg = this.validateRequired(item, itemSettings)
        if (requiredMsg) {
            return requiredMsg
        }

        let msg = []
        if (itemSettings['legend'] && itemSettings['legend'].length > 0 && itemSettings['yAxis'] && itemSettings['yAxis'].length > 1) {
            msg.push({
                validateStatus: 'error',
                errorMsg: `当存在分组时，Y轴不能添加选项！`,
            })
        }

        if (itemSettings['yAxis'] && itemSettings['yAxis'].length === 2 && itemSettings['legend'] && itemSettings['legend'].length > 0) {
            msg.push({
                validateStatus: 'error',
                errorMsg: `当Y轴有2个选项的时，不能分组！`,
            })
        }

        if (!_.isEmpty(msg)) {
            return msg
        }

        return true
    }

    handleChartOptions = (option, data) => {
        let axes = {}
        let axesLength = 0
        let scales = {}
        let geoms = []
        // 处理 axes
        if (data.settings && data.settings.selectedValues) {
            let selectedValues = data.settings.selectedValues
            let yLength = selectedValues.yAxis.length
            // let lLength = false
            // if (selectedValues.legend && selectedValues.legend.length > 0) {
            //     lLength = true
            // }

            // 多Y轴对齐处理
            // _.map(selectedValues.yAxis, (element, key) => {
            //     let scaCfg = {
            //         'min': element.min,
            //         'max': element.max
            //     }

            //     scales[element.name] = scaCfg
            // })

            _.map(selectedValues.xAxis, (element, key) => {
                // let labelCfg = {
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
                // axesLength = element.distinct
                // if( element.distinct > this.distinct ){
                //     labelCfg['label']['rotate'] = 30
                // }

                // axes[element.name] = labelCfg
                // // if( element.distinct > 15 ){
                //     scales[element.name] = {
                //         tickCount: 15
                //     }
                // }

                let scaCfg = {}
                // if (yLength >= 1 || lLength) {
                scaCfg['type'] = 'cat'
                // scaCfg['min'] = -1000
                // scaCfg['max'] = 1000
                // }

                if (element.distinct > 15) {
                    scaCfg['tickCount'] = 15
                }

                scales[element.name] = scaCfg
            })

            // 多Y轴的时候一条y轴刻度线不显示
            // let yLength = selectedValues.yAxis.length
            if (selectedValues.yAxis && yLength > 1) {
                axes[selectedValues.yAxis[yLength - 1].name] = {
                    grid: false
                }
                // let xName = selectedValues.xAxis[0]['name']
                // _.map(selectedValues.yAxis, (el, k) => {
                //     let lineCfg = {
                //         type: 'line',
                //         position: `${xName}*${el.name}`,
                //         color: this.COLOR_PLATE_8[k]
                //     }

                //     let pointCfg = {
                //         type: 'point',
                //         position: `${xName}*${el.name}`,
                //         color: this.COLOR_PLATE_8[k]
                //     }

                //     geoms.push(lineCfg)
                //     geoms.push(pointCfg)

                // })
            }
        }
        // option.axes = axes

        if (!_.isEmpty(scales)) {
            option.scales = scales
        }

        if (geoms.length > 0) {
            option.geoms = geoms
        }

        if (axesLength < 5) {

        }

        return option
    }
}

export default Line
