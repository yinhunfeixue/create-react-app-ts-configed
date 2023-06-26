import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Input, InputNumber, message, Radio, Select } from 'antd'
import { periodExample, saveStatisticalperiod } from 'app_api/metadataApi'
import React, { Component } from 'react'
// import '../index.less'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input

export default class eastUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rootInfo: {
                granularity: 4,
                periodType: 0,
                granularityNum: 0,
            },
            sampleInfo: {},
            loading: false,
            showShadow: false,
        }
    }
    componentDidMount = () => {
        this.getSample()
    }
    changeDesc = async (name, e) => {
        const { rootInfo } = this.state
        rootInfo[name] = e.target.value
        if (name == 'granularity' && e.target.value == 0) {
            rootInfo.periodType = 0
        }
        await this.setState({
            rootInfo,
        })
        this.getSample()
    }
    getSample = async () => {
        let res = await periodExample(this.state.rootInfo)
        if (res.code == 200) {
            this.setState({
                sampleInfo: res.data,
            })
        }
    }
    changeNumber = async (e) => {
        const { rootInfo } = this.state
        rootInfo.granularityNum = e
        await this.setState({
            rootInfo,
        })
        this.getSample()
    }
    postData = async () => {
        const { rootInfo } = this.state
        const { onSuccess } = this.props
        let query = {
            ...rootInfo,
        }
        this.setState({ loading: true })
        let res = await saveStatisticalperiod(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            onSuccess()
        }
    }

    render() {
        const { rootInfo, loading, showShadow, sampleInfo } = this.state
        const { visible, onClose } = this.props
        return (
            <DrawerLayout
                drawerProps={{
                    visible,
                    onClose,
                    title: '定义统计周期',
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!rootInfo.chineseName || !rootInfo.englishName || !rootInfo.englishNameAbbr} type='primary' loading={loading} onClick={this.postData}>
                                保存
                            </Button>
                            <Button onClick={() => onClose()}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                <div className='EditMiniForm Grid1'>
                    {RenderUtil.renderFormItems([
                        {
                            label: '统计周期名称',
                            required: true,
                            content: (
                                <Input
                                    maxLength={64}
                                    suffix={<span style={{ color: '#B3B3B3' }}>{rootInfo.chineseName ? rootInfo.chineseName.length : 0}/64</span>}
                                    value={rootInfo.chineseName}
                                    onChange={this.changeDesc.bind(this, 'chineseName')}
                                    placeholder='请输入中文名称'
                                />
                            ),
                        },
                        {
                            label: '统计周期英文名',
                            required: true,
                            content: (
                                <Input
                                    maxLength={64}
                                    suffix={<span style={{ color: '#B3B3B3' }}>{rootInfo.englishName ? rootInfo.englishName.length : 0}/64</span>}
                                    value={rootInfo.englishName}
                                    onChange={this.changeDesc.bind(this, 'englishName')}
                                    placeholder='请输入英文名称'
                                />
                            ),
                        },
                        {
                            label: '英文缩写',
                            required: true,
                            content: (
                                <Input
                                    maxLength={16}
                                    suffix={<span style={{ color: '#B3B3B3' }}>{rootInfo.englishNameAbbr ? rootInfo.englishNameAbbr.length : 0}/16</span>}
                                    value={rootInfo.englishNameAbbr}
                                    onChange={this.changeDesc.bind(this, 'englishNameAbbr')}
                                    placeholder='请输入英文缩写，英文缩写将加入词根且无法修改'
                                />
                            ),
                        },
                        {
                            label: '周期粒度',
                            content: (
                                <Radio.Group onChange={this.changeDesc.bind(this, 'granularity')} value={rootInfo.granularity}>
                                    <Radio value={4}>年</Radio>
                                    <Radio value={3}>季度</Radio>
                                    <Radio value={1}>月</Radio>
                                    <Radio value={2}>周</Radio>
                                    <Radio value={0}>日</Radio>
                                </Radio.Group>
                            ),
                        },
                        {
                            label: '周期类型',
                            content: (
                                <Radio.Group onChange={this.changeDesc.bind(this, 'periodType')} value={rootInfo.periodType}>
                                    <Radio value={0}>自然周期</Radio>
                                    <Radio disabled={rootInfo.granularity == 0} value={1}>
                                        相对周期
                                    </Radio>
                                </Radio.Group>
                            ),
                        },
                        {
                            label: '计算逻辑',
                            content: (
                                <div className='HControlGroup'>
                                    <InputNumber style={{ width: 88 }} onChange={this.changeNumber} value={rootInfo.granularityNum} min={rootInfo.periodType} defaultValue={rootInfo.periodType} />
                                    <span>{rootInfo.granularity == 0 ? '日' : rootInfo.granularity == 1 ? '月' : rootInfo.granularity == 2 ? '周' : rootInfo.granularity == 3 ? '季度' : '年'}前</span>
                                </div>
                            ),
                        },
                        {
                            label: '业务描述',
                            content: (
                                <div style={{ position: 'relative' }}>
                                    <TextArea
                                        onChange={this.changeDesc.bind(this, 'description')}
                                        value={rootInfo.description}
                                        maxLength={128}
                                        style={{ marginTop: 5, height: 52 }}
                                        placeholder='请输入业务描述信息'
                                    />
                                    <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: 8 }}>{rootInfo.description ? rootInfo.description.length : 0}/128</span>
                                </div>
                            ),
                        },
                    ])}
                </div>
                <div className='DetailPart'>
                    <div>统计周期会根据业务输入的时间而变化</div>
                    <div>当前业务时间：{sampleInfo.currentDate || <EmptyLabel />}</div>
                    <div>根据配置生成的统计周期：{sampleInfo.periodTime || <EmptyLabel />}</div>
                </div>
            </DrawerLayout>
        )
    }
}
