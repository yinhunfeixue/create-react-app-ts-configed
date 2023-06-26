import _ from 'lodash'
import Base from '../Base'
class Scatter extends Base {
    constructor(chartType = 'Scatter', data) {
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
            shape: 'circle'
        }
        this.options = {}

        this.legends = false

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
            {
                name: 'label',
                id: 'label',
                inputInfo: {
                    'type': 'select',
                    'required': true,
                    'attr': {
                        // 'mode': 'multiple'
                    }
                }
            }
        ]
    }

    /**
     *  X轴
     *     接受输入：度量
     *     接受数量：1
     *  Y轴
     *      接受输入：度量
     *      接受数量：1
     *  Legend
     *       接受输入：维度
     *       接受数量：1
     *   Label
     *       接受输入：维度
     *       接受数量：1
     */
    validateItemSetting = (item, itemSettings) => {
        let requiredMsg = this.validateRequired(item, itemSettings)
        if (requiredMsg) {
            return requiredMsg
        }

        return true
    }

    handleContainerOptions = (containerOption, data) => {
        let tooltip = {}
        // 处理 axes
        if (data.settings && data.settings.selectedValues) {
            let selectedValues = data.settings.selectedValues
            selectedValues.label && _.map(selectedValues.label, (element, key) => {
                tooltip['title'] = element.name
            })
        }
        if (!_.isEmpty(tooltip)) {
            containerOption.options.tooltip = tooltip
        }

        return containerOption
    }

    handleChartOptions = (option, data) => {
        let title = ''
        let scales = {}
        let selectedValues = data.settings.selectedValues
        selectedValues.label && _.map(selectedValues.label, (element, key) => {
            title = element.name
        })

        _.map(option.geoms, (element, key) => {
            let eleTooltip = []
            if (element.color) {
                eleTooltip.push(element.color)
            }

            if (element.position) {
                eleTooltip.push(element.position)
            }

            if (!_.isEmpty(title)) {
                eleTooltip.push(title)
            }

            option.geoms[key]['tooltip'] = eleTooltip.join('*')
        })

        // _.map(selectedValues.yAxis, (element, key) => {
        //     let scaCfg = {}
        //     scaCfg['type'] = 'cat'

        //     // if (element.distinct > 15) {
        //     scaCfg['tickCount'] = 20
        //     // }

        //     scales[element.name] = scaCfg
        // })

        // if (!_.isEmpty(scales)) {
        //     option.scales = scales
        // }

        return option
    }
}

export default Scatter
