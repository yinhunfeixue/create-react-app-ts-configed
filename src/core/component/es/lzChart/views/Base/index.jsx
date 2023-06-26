import _ from 'lodash'
import Config from '../../config'
const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 12 },
}

class TypeDataHandleCls {
    /**
     * 时间字段的处理、antv会自动识别时间格式，会导致分组等情况渲染效果的问题
     * @param { OBJECT } ele
     * @param { OBJECT } scales
     */
    static getDatetime(ele, scales) {
        if (scales[ele.name]) {
            scales[ele.name]['type'] = 'cat'
        } else {
            scales[ele.name] = {
                'type': 'cat'
            }
        }

        return scales
    }

    static formAxiosNumber(number: number): string {
        console.log(number, '----number----')
        number = parseFloat(number)
        if (number <= 1) {
            return number.toFixed(2)
        } else if (number <= 999) {
            return number.toFixed(2)
        } else if (number <= 9499) {
            return `${(number / 1000).toFixed(2)}千`
        } else if (number <= 994999) {
            return `${(number / 10000).toFixed(2)}万`
        } else if (number <= 9499999) {
            return `${(number / 1000000).toFixed(2)}百万`
        } else if (number <= 94999999) {
            return `${(number / 10000000).toFixed(2)}千万`
        }
        return `${(number / 100000000).toFixed(2)}亿`
    }

    // static formAxiosNumber(number) {
    //     let numberString = number.toString()
    //     let posStart = numberString.search(/0+$/i)
    //     let patternStrLen = numberString.length - posStart
    //     console.log(patternStrLen, '--------patternStrLen--------')
    //     if (patternStrLen <= 2) {
    //         return number
    //     } else if (patternStrLen <= 3) {
    //         return `${number / 1000}千`
    //     } else if (patternStrLen <= 5) {
    //         return `${number / 1000}万`
    //     } else if (patternStrLen <= 6) {
    //         return `${number / 1000000}百万`
    //     } else if (patternStrLen <= 7) {
    //         return `${number / 10000000}千万`
    //     } else {
    //         return `${number / 100000000}亿`
    //     }
    //     // return `${Math.ceil(number / 100000000).toFixed(2)}亿`
    // }

    static axiosNumber(number) {
        let data = []
        if (number <= 1) {
            data.push(number)
            data.push(number.toFixed(2))
        } else if (number <= 999) {
            data.push(number)
            data.push(number.toFixed(0))
        } else if (number <= 9499) {
            data.push(Math.ceil(number / 1000) * 1000)
            data.push(`${Math.ceil(number / 1000).toFixed(0)}千`)
        } else if (number <= 994999) {
            data.push(Math.ceil(number / 10000) * 10000)
            data.push(`${Math.ceil(number / 10000).toFixed(0)}万`)
        } else if (number <= 9499999) {
            data.push(Math.ceil(number / 1000000) * 1000000)
            data.push(`${Math.ceil(number / 1000000).toFixed(0)}百万`)
        } else if (number <= 94999999) {
            data.push(Math.ceil(number / 10000000) * 10000000)
            data.push(`${Math.ceil(number / 10000000).toFixed(0)}千万`)
        } else {
            data.push(Math.ceil(number / 100000000) * 100000000)
            data.push(`${Math.ceil(number / 100000000).toFixed(0)}亿`)
        }
        return data
    }

    static getAttribute(ele, option) {
        let scales = option.scales ? option.scales : {}
        let axes = option.axes ? option.axes : {}

        let axesConfig = {
            // title: {
            //     position: 'start'
            // },
            label: {
                formatter: (name) => {
                    console.log(name, '----name---')
                    if (!name) return ''
                    if (name.length > 10) {
                        name = name.slice(0, 10) + '...'
                    }
                    return name
                }
            }
        }

        if (axes[ele.name]) {
            axes[ele.name] = _.merge({}, axes[ele.name], axesConfig)
        } else {
            axes[ele.name] = axesConfig
        }

        option.axes = axes

        if (ele.fieldType === 'datatime') {
            scales = this.getDatetime(ele, scales)
        } else if (ele.fieldType === 'time') {
            scales = this.getDatetime(ele, scales)
        }

        option.scales = scales

        return option
    }

    static getMeasure(ele, option) {
        let axes = option.axes ? option.axes : {}
        let scales = option.scales ? option.scales : {}
        let axesConfig = {
            // title: {
            //     position: 'start'
            // },
            label: {
                formatter: (val) => {
                    let showVal = this.formAxiosNumber(val)
                    return showVal
                },
            }
        }

        if (axes[ele.name]) {
            axes[ele.name] = _.merge({}, axes[ele.name], axesConfig)
        } else {
            axes[ele.name] = axesConfig
        }

        option.axes = axes

        // let max = this.axiosNumber(ele.max)
        // let min = this.axiosNumber(ele.min)
        // let scaCfg = {
        //     'min': ele.min > 0 ? min[0] : -min[0],
        //     'max': ele.max > 0 ? max[0] : -max[0],

        //     'tickInterval': Math.ceil(max[0] / 5)
        // }

        let scaCfg = {
            'min': ele.min,
            'max': ele.max
        }

        if (scales[ele.name]) {
            scales[ele.name] = _.merge({}, scales[ele.name], scaCfg)
        } else {
            scales[ele.name] = scaCfg
        }

        option.scales = scales
        return option
    }
}

class Base {
    constructor(chartType) {
        // this.chartType = chartType
        // console.log(chartType, '--BaseBase-- chartTypechartType')
        this.CONFIG = Config
        this.containerOption = {

        }
        this.renderType = 'geom' //  图形展示的时候，类型为 geom
        this.baseOptions = {
        }
        this.geoms = {
        }
        this.options = {}

        this.legends = true

        this.items = []

        this.itemSettings = {}

        this.COLOR_PLATE_8 = [
            '#1890FF',
            '#2FC25B',
            '#FACC14',
            '#223273',
            '#8543E0',
            '#13C2C2',
            '#3436C7',
            '#F04864'
        ]

        this.COLOR_PLATE_16 = [
            '#1890FF',
            '#41D9C7',
            '#2FC25B',
            '#FACC14',
            '#E6965C',
            '#223273',
            '#7564CC',
            '#8543E0',
            '#5C8EE6',
            '#13C2C2',
            '#5CA3E6',
            '#3436C7',
            '#B381E6',
            '#F04864',
            '#D598D9'
        ]
    }

    handleOptionsGeoms = (geoms) => {
        return geoms
    }

    handleChartOptions = (option, data) => {
        return option
    }

    /**
     * 
     * @param {*} containerOption | hideDefaultHtmlContent : 默认tooltip设计的显示所有字段，true：不使用默认情况
     * @param {*} data 
     */
    handleContainerOptions = (containerOption, data) => {

        let toolTipDefault = {}

        if (!data.hideDefaultHtmlContent) {
            toolTipDefault = {
                options: {
                    'tooltip': {
                        useHtml: true,
                        htmlContent: function (title, items) {
                            console.log(title, items, items[0]['point']['_origin'], '------htmlContent------')
                            let liString = ''
                            let color = items[0]['color']
                            _.map(items[0]['point']['_origin'], (value, name) => {
                                if (name != 'type') {
                                    liString += `<li data-index='0' style="margin: 0px 0px 4px; list-style-type: none; padding: 0px;" >` +
                                        `<span style="background-color:${color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>` +
                                        `${name}：<span class="g2-tooltip-value">${value}</span>` +
                                        `</li>`
                                }
                            })

                            return `<div class="g2-tooltip" 
                                        style='
                                            max-height: 100%;
                                            overflow-y: auto;
                                            position: absolute;
                                            z-index: 8;
                                            transition: visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;
                                            background-color: rgba(255, 255, 255, 0.9);
                                            box-shadow: rgb(174, 174, 174) 0px 0px 10px;
                                            border-radius: 3px;
                                            color: rgb(87, 87, 87);
                                            font-size: 12px;
                                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
                                            line-height: 20px;
                                            padding: 10px 10px 6px;
                                            border: 1px solid ${color};
                                        '
                                    >` +
                                `<div class="g2-tooltip-title" style="margin-bottom: 4px;"> ${title} </div>` +
                                `<ul class="g2-tooltip-list" style="margin: 0px; list-style-type: none; padding: 0px;" >${liString}</ul>` +
                                `</div>`
                        }
                    }
                }
            }
        }
        containerOption = _.merge({}, toolTipDefault, containerOption, data.containerOption || {})
        return containerOption
    }

    // 计算最大值、最小值，多轴的时候，分割线对齐问题处理
    setyAxisMaxMin = (item) => {
        if (item.max !== undefined && item.min !== undefined) {
            let minV = Math.abs(item.min)
            let maxV = Math.abs(item.max)
            let axisV = maxV > minV ? maxV : minV

            item.max = axisV
            item.min = -axisV
        }
        return item
    }

    // yAxis xAxis 多轴 min max 处理
    handleXYaxis = (selectedValues) => {
        if (selectedValues.yAxis && selectedValues.yAxis.length > 1) {
            let yAxis = selectedValues.yAxis
            let isMinus = false
            _.map(yAxis, (element, key) => {
                if (element.min < 0 || element.max < 0) {
                    isMinus = true
                }
            })

            if (isMinus) {
                _.map(yAxis, (element, key) => {
                    yAxis[key] = this.setyAxisMaxMin(element)
                })
            } else {
                _.map(yAxis, (element, key) => {
                    if (element.min !== undefined) {
                        yAxis[key]['min'] = 0
                        // yAxis[key]['type'] = 'linear'
                    }
                })
            }

            selectedValues.yAxis = yAxis
        }

        if (selectedValues.xAxis && selectedValues.xAxis.length > 1) {
            let xAxis = selectedValues.xAxis
            let isMinus = false
            _.map(xAxis, (element, key) => {
                if (element.min < 0 || element.max < 0) {
                    isMinus = true
                }
            })

            if (isMinus) {
                _.map(xAxis, (element, key) => {
                    xAxis[key] = this.setyAxisMaxMin(element)
                })
            } else {
                _.map(xAxis, (element, key) => {
                    if (element.min !== undefined) {
                        xAxis[key]['min'] = 0
                    }
                })
            }

            selectedValues.xAxis = xAxis
        }

        return selectedValues
    }

    /**
     * 
     * @param {
     *   padding: [] // 图表边距
     * } data 
     */
    handleOptions = (data) => {
        this.options = {}
        let option = data.options
        let containerOption = {}

        if (data.settings && data.settings.selectedValues) {
            let selectedValues = data.settings.selectedValues
            data.settings.selectedValues = this.handleXYaxis(selectedValues)
        }

        if (option.geoms) {
            _.map(option.geoms, (element, key) => {
                option.geoms[key] = _.merge({}, element, this.geoms)
            })

            // handleOptionsGeoms 各个类型图下面可以自行处理
            option.geoms = this.handleOptionsGeoms(option.geoms)
        }

        if (Config['lzChart'][this.chartType] && Config['lzChart'][this.chartType]['base']) {
            option = _.merge({}, Config['lzChart'][this.chartType]['base'], option)
        }

        option = _.merge({}, this.baseOption, option)

        // legends 配置处理，优先使用实际配置的，如果没有配置，则走=默认处理逻辑
        if (!option.legends) {
            if (this.legends) {
                containerOption = {
                    options: {
                        legends: {
                            // offsetX: '20px',
                            itemFormatter: (name) => {
                                if (!name) return ''
                                if (name.length > 8) {
                                    name = name.slice(0, 5) + '...'
                                }
                                return name
                            },
                            // itemWidth: 20,
                        },
                    },
                }

                let { legends, padding } = this.handleLegend(data)
                padding = data.padding || padding
                containerOption.options.legends = { ...containerOption.options.legends, ...legends }
                if (padding.length > 0) {
                    containerOption.padding = padding
                }
            } else {
                // if (this.containerOption.legends) {
                containerOption = {
                    options: {
                        legends: false
                    }
                }
                // }
            }

            option.legends = containerOption.options.legends
        }

        option = this.handleChartOptions(option, data)
        containerOption = this.handleContainerOptions(containerOption, data)
        containerOption = _.merge({}, this.containerOption, containerOption)

        if (Config['lzChart'][this.chartType] && Config['lzChart'][this.chartType]['containerOption']) {
            containerOption = _.merge({}, { 'options': Config['lzChart'][this.chartType]['containerOption'] }, containerOption)
        }

        if (data.settings && data.settings.selectedValues) {
            let selectedValues = data.settings.selectedValues

            _.map(selectedValues, (element, key) => {
                _.map(element, (ele, k) => {
                    switch (ele.columnType) {
                        case 'attribute':
                            option = TypeDataHandleCls.getAttribute(ele, option)
                            break

                        case 'measure':
                            option = TypeDataHandleCls.getMeasure(ele, option)
                            break

                        default:
                            break
                    }
                })
                console.log(option, element.length, '---------element.length-----------')
                if (key === 'yAxis' && element.length > 1) {
                    // if (option.axes) {
                    //     option.axes[selectedValues.yAxis[element.length - 1].name]['grid'] = false
                    // }
                    if (!option.axes) {
                        option.axes = {
                            [selectedValues.yAxis[element.length - 1].name]: {
                                grid: false
                            }
                        }
                    } else {
                        option.axes[selectedValues.yAxis[element.length - 1].name]['grid'] = false
                    }
                }
            })
            // if (!_.isEmpty(scales)) {
            //     option.scales = scales
            // }
        }

        this.options = {
            'containerOption': containerOption,
            'options': option
        }

        console.log(this.options, '---Config----this.optionsthis.options-----')
        return this.options
    }

    handleLegend = (data) => {
        let legendSize = data.legendSize || 0
        // let legends = {}
        let padding = ['auto', 'auto', 48, 'auto']
        let legends = {
            flipPage: false,
            useHtml: true,
            // position: 'top',
            // containerTpl: '<div class="g2-legend" style="width:auto;max-height:100%">' +
            //                     '<h4 class="g2-legend-title"></h4>' +
            //                     '<ul class="g2-legend-list" style="list-style-type:none;margin-bottom:0;padding:0;"></ul>' +
            //                     '</div>',
            itemTpl: '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
                '<i class="g2-legend-marker" style="width:10px;height:10px;display:inline-block;margin-right:10px;background-color:{color};"></i>' +
                '<span class="g2-legend-text" title="{originValue}">{value}</span></li>'
        }

        if (legendSize && legendSize > 4) {
            legends = {
                ...legends,
                containerTpl: '<div class="g2-legend" style="width:auto;max-height:100%">' +
                    '<h4 class="g2-legend-title"></h4>' +
                    '<ul class="g2-legend-list" style="list-style-type:none;margin-bottom:0;padding:0;"></ul>' +
                    '</div>',
                position: 'right-center',
            }
            padding = ['auto', 130, 'auto', 'auto']
        }

        return {
            legends,
            padding
        }
    }

    getOptions = (options) => {
        return this.options
    }

    validateRequired = (item, itemSettings) => {
        let msg = []

        _.map(this.items, (val, index) => {
            // 不为空校验
            if (val.inputInfo && val.inputInfo.required && (!itemSettings[val.id] || itemSettings[val.id].length < 1)) {
                msg.push({
                    validateStatus: 'error',
                    errorMsg: `${val.name}不能为空！`,
                })
            }

            // 选择个数限制校验
            if (val.inputInfo && val.inputInfo.SelectedCount > 1 && itemSettings[val.id] && itemSettings[val.id].length > val.inputInfo.SelectedCount) {
                msg.push({
                    validateStatus: 'error',
                    errorMsg: `${val.name}最多只能选择${item.inputInfo.SelectedCount}个选项！`,
                })
            }
        })

        console.log(msg, '--------msg------')
        if (!_.isEmpty(msg)) {
            return msg
        }

        return false
    }

    validateItemSetting = (item, itemSettings) => {

    }

    handleSettingChange = (id, value) => {
        // console.log(value, id, '----value, id----')
        this.validateItemSetting()
    }

    setItemSetting = () => {

    }

    getItems = (settings) => {
        return this.items
    }
}

export default Base
