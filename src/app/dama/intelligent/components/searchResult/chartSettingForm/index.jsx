import { Form, Select, Row, Col, Checkbox } from 'antd'
import _ from 'lodash'
import './index.less'

class ChartSettingForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            validateMessage: true,
            selectedCollection: {},
            selectedValues: {}
        }

        this.itemSettings = {}
    }

    validateItemSetting = (id, value) => {

    }

    componentDidMount = () => {
        if (this.props.settings) {
            let selectedCollection = {}
            let selectedValues = {}
            selectedCollection = this.props.settings.selectedCollection
            selectedValues = this.props.settings.selectedValues

            let itemSettings = {}
            _.map(selectedValues, (element, key) => {
                if (Array.isArray(element)) {
                    itemSettings[key] = []
                    _.map(element, (val, k) => {
                        itemSettings[key].push(val.name)
                    })
                } else {
                    itemSettings[key] = element
                }
            })

            this.itemSettings = itemSettings

            this.setState({
                validateMessage: true,
                selectedCollection,
                selectedValues: itemSettings
            })
        }
    }

    handleSettingChange = (item, value) => {
        console.log(value, item, this.itemSettings, '----value, id--this.itemSettings--')
        let itemUniqueCheck = true
        let itemUniqueCheckMsg = []
        let itemSettings = {
            ...this.itemSettings
        }
        if (Array.isArray(value)) {
            itemSettings[item.id] = value
        } else {
            if (value && value.target) {
                itemSettings[item.id] = value.target.checked
            } else {
                if (value) {
                    itemSettings[item.id] = [value]
                } else {
                    if (itemSettings[item.id]) {
                        delete itemSettings[item.id]
                    }
                }
            }
        }

        // 遍历 itemSettings 判断是否有重复
        let itemSettingsList = []
        _.map(itemSettings, (element, key) => {
            _.map(element, (val, k) => {
                if (!itemSettingsList.includes(val)) {
                    itemSettingsList.push(val)
                } else {
                    itemUniqueCheck = false
                    itemUniqueCheckMsg.push(`“${val}” 已使用！`)
                }
            })
        })

        if (itemUniqueCheck) {
            if (this.props.validateItemSetting) {
                this.itemSettings = itemSettings
                let validateMessage = this.props.validateItemSetting(item, this.itemSettings)

                if (validateMessage === true) {
                    this.setState({
                        selectedValues: this.itemSettings,
                        validateMessage: true
                    })
                    // 验证通过触发接口调用
                    this.props.handleSwitchUserDefined && this.props.handleSwitchUserDefined(this.itemSettings)
                } else {
                    let validateMessageString = _.map(validateMessage, (msgValue, key) => {
                        return (
                            <div>{msgValue.errorMsg}</div>
                        )
                    })

                    this.setState({
                        selectedValues: itemSettings,
                        validateMessage: validateMessageString
                    })
                }
            }
        } else {
            let validateMessageString = _.map(itemUniqueCheckMsg, (msgValue, key) => {
                return (
                    <div>{msgValue}</div>
                )
            })

            this.setState({
                // selectedValues: this.itemSettings,
                validateMessage: validateMessageString
            })
        }
    }

    renderParams = (selectedCollection, defaultValues, item) => {
        if (item.inputInfo) {
            let kType = item.inputInfo.type
            switch (kType) {
                case 'select':
                    if (selectedCollection[item.id]) {
                        return (
                            <Select
                                {...item.inputInfo.attr}
                                value={defaultValues}
                                onChange={this.handleSettingChange.bind(this, item)}
                            >
                                {
                                    _.map(selectedCollection[item.id], (val, key) => {
                                        let keyName = `${item.id}_${key}`
                                        return (
                                            <Select.Option key={keyName} value={val}>{val}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        )
                    }
                    break

                case 'checkbox':
                    // if (selectedCollection[item.id]) {
                    return (
                        <Checkbox
                            onChange={this.handleSettingChange.bind(this, item)}
                            {...item.inputInfo.attr}
                            checked={defaultValues || false}
                        >
                            {item.name}
                        </Checkbox>
                    )
                    // }
                    break

                default:
                    return (
                        <Select value={defaultValues} {...item.inputInfo.attr} onChange={this.handleSettingChange.bind(this, item)} />
                    )
                    // eslint-disable-next-line no-unreachable
                    break
            }
        }
        return null
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 24 },
            wrapperCol: { span: 24 },
        }

        const { validateMessage, selectedCollection, selectedValues } = this.state
        const { svgChart, chartType } = this.props

        console.log(selectedCollection, selectedValues, '---selectedValuesselectedValues--ChartSettingForm-----')
        return (
            <div className='settingPannel' >
                <Row>
                    <Col span={24} className='chartSettingText' >
                        {
                            chartType && svgChart[chartType] ? <div><span>{svgChart[chartType]['img']}</span>{svgChart[chartType]['name']}</div> : null
                        }
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className='chartSettingFromList'>
                        <div>
                            <Form>
                                {
                                    _.map(this.props.chartItems, (item, index) => {
                                        let defaultValues = selectedValues[item.id] ? selectedValues[item.id] : []
                                        if (item.inputInfo.type === 'checkbox') {
                                            defaultValues = selectedValues[item.id] ? selectedValues[item.id] : false
                                        }
                                        // selectedValues[item.id] && _.map(selectedValues[item.id], (val, key) => {
                                        //     defaultValues.push(val['name'])
                                        // })
                                        // let OPTIONS = selectedCollection[item.id] ? selectedCollection[item.id] : []
                                        // let filteredOptions = OPTIONS.filter((o) => !defaultValues.includes(o))
                                        return (
                                            <Form.Item
                                                {...formItemLayout}
                                                label={item.name}
                                            // validateStatus={validateMessage[item.id] ? validateMessage[item.id]['validateStatus'] : 'success'}
                                            // help={validateMessage[item.id] ? validateMessage[item.id]['errorMsg'] : null}
                                            >
                                                {
                                                    this.renderParams(selectedCollection, defaultValues, item)
                                                }

                                            </Form.Item>
                                        )
                                    })
                                }

                            </Form>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} >
                        <div className='settingError' >
                            {
                                validateMessage === true ? null : validateMessage
                            }
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ChartSettingForm
