// import Config from '../../config'
import _ from 'lodash'
import Base from '../Base'
class Pie extends Base {
    constructor(chartType = 'Pie', data) {
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

        this.legends = false

        this.items = [
            {
                name: '类别',
                id: 'category',
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
                id: 'color',
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
     *     接受输入：维度
     *     接受数量：1
     *  Y轴
     *      接受输入：度量
     *      接受数量：小于等于2
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
            selectedValues.category && _.map(selectedValues.category, (element, lKey) => {
                tooltip['title'] = element.name
            })
        }
        if (!_.isEmpty(tooltip)) {
            containerOption.options.tooltip = tooltip
        }

        return containerOption
    }

    handleChartOptions = (option, data) => {
        _.map(option.geoms, (element, key) => {
            let eleTooltip = []
            // if (element.color) {
            //     eleTooltip.push(element.color)
            // }
            if (element.position) {
                eleTooltip.push(element.position)
            }

            option.geoms[key]['tooltip'] = eleTooltip.join('*')
        })

        return option
    }

    handleOptionsGeoms = (geoms) => {
        let cGeoms = [...geoms]

        _.map(cGeoms, (element, key) => {
            element.label = {
                field: element.color,
                cfg: {
                    formatter: function formatter(val, item) {
                        // console.log(val, item, '-----val, item-----')
                        if (item['point']['percent']) {
                            return item['point'][element.color] + '：' + item['point']['percent'] + '%'
                        } else {
                            return item['point'][element.color] + '：' + item['point'][element.position]
                        }
                    }
                }
            }
        })
        console.log(cGeoms, '------pie----cGeoms----')

        return cGeoms
    }
}

export default Pie
