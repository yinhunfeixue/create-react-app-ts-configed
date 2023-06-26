import { Form } from '@ant-design/compatible'
import { Button, Input, Menu, message } from 'antd'
import { addFormula } from 'app_api/addNewColApi'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import Aggregation from './aggregation'
import Assignment from './assignment'
import Cumulative from './cumulative'
import Formula from './formula'
import GetTime from './getTime'
import './index.less'
import Sort from './sort'
import store from './store'
import TimeDiff from './timeDifference'

@observer
class addNewCol extends Component {
    constructor(props) {
        super(props)
        this.state = {
            colName: '',
            scope: this.props.scope || 2,
            formulaList: this.props.formulaList || [],
            btnLoading: false,
        }
    }
    componentDidMount = async () => {
        // store.setBusinessId(this.props.businessId)
        // store.clearParams()
        const { formulaContent, cname, id } = this.props
        if (this.props.isEdit) {
            console.log(formulaContent, 'formulaContent+++')
            switch (formulaContent.category) {
                case '1':
                    store.setColumnType(formulaContent.columnType)
                    store.setSearchItem([{ content: formulaContent.formula }], true)
                    break
                case '2':
                    store.setTimeDiff(formulaContent)
                    break
                case '3':
                    store.setGetTime(formulaContent)
                    break
                case '4':
                    store.setAggregationEditData(formulaContent)
                    break
                case '5':
                    store.setCumulative(formulaContent)
                    break
                case '6':
                    store.setAssignment(formulaContent)
                    break
                case '7':
                    store.setSortInfo(formulaContent)
                    break
            }
            store.setIsAdd(false)
            store.setCategory(formulaContent.category + '')
            store.setEditId(id)
            this.setState({
                colName: cname,
            })
        }
    }

    static getDerivedStateFromProps = (props) => {
        if (props.ifProcess) {
            store.setEtlProgess(props.ifProcess, props.etlProcessId)
        } else {
            store.setEtlProgess(false)
        }
        store.setScope(props.scope)
        if (props.scope === 2) {
            if (props.relatedBusinessIds) {
                store.setUsingBusinessIds(props.relatedBusinessIds)
            }
            store.setBusinessId(props.usableBusinessIds.slice().join(','))
        } else {
            store.setBusinessId(props.businessId)
        }
        store.setTempBusinessId(props.tempBusinessId)
        if (props.formulaList && props.formulaList.length > 0) {
            return {
                formulaList: props.formulaList,
            }
        }
        return null
    }
    // componentDidUpdate = (preprops, nextprops) => {
    //     if (preprops.businessId !== this.props.businessId) {
    //         store.setBusinessId(this.props.businessId)
    //     }
    // }

    onSelect = (item, key) => {
        store.setCategory(item.selectedKeys[0])
    }
    changeName = (e) => {
        this.setState({
            colName: e.target.value,
        })
    }
    // 添加新列方法
    addMethod = async (e) => {
        e.preventDefault()
        const { category, columnType, formula, timeDiff, getTimeParam, businessId, aggregation, cumulative, assignment, isAdd, editId, indexmaList, sortInfo } = store
        let tempBusinessId = store.tempBusinessId

        let params = {
            name: this.state.colName,
            scope: this.state.scope,
            category,
        }
        if (store.ifProcess) {
            params.etlProcessId = store.etlProcessId
        }
        if (this.props.scope === 1) {
            params.businessId = this.props.businessId
        } else {
            // if (category === '1') {
            params.useBusinessIds = store.usingBusinessIds
            // } else {
            //     params.useBusinessIds = store.businessId.split(',')
            // }
        }
        if (!isAdd) {
            params.id = editId
        }
        if (tempBusinessId) {
            params.tempBusinessId = tempBusinessId
        }
        if (category === '1') {
            params.content = {
                columnType: columnType,
                formula: formula,
                category,
            }
            if (store.errTip) {
                message.warning('错误公式类型，请修改')
                return
            }
            // if (this.props.scope === 2) {
            //     params.usingBusinessIds = store.usingBusinessIds
            // }
        } else if (category === '2') {
            params.content = {
                category,
                ...timeDiff,
            }
            if (this.props.scope === 2) {
                if (timeDiff.usingBusinessId2) {
                    params.useBusinessIds = [...new Set([timeDiff.usingBusinessId1, timeDiff.usingBusinessId2])]
                } else {
                    params.useBusinessIds = [...new Set([timeDiff.usingBusinessId1])]
                }
            }
        } else if (category === '3') {
            params.content = {
                category,
                ...getTimeParam,
            }
        } else if (category === '4') {
            params.content = {
                category,
                ...aggregation,
                advancedSetting: {},
            }
            indexmaList.map((item) => {
                params.content.advancedSetting[item.name] = {
                    id: item.selectValue.id,
                    businessId: item.selectValue.businessId,
                    timeType: item.selectValue.timeType,
                    interval: item.selectValue.interval,
                    special: item.selectValue.special,
                    timeTypeName: item.selectValue.timeTypeName,
                    specialName: item.selectValue.specialName,
                }
            })
            if (this.props.scope === 2) {
                if (aggregation.usingBusinessId2) {
                    params.useBusinessIds = [...new Set([aggregation.usingBusinessId1, ...aggregation.usingBusinessId2])]
                } else {
                    params.useBusinessIds = [...new Set([aggregation.usingBusinessId1])]
                }
            }
        } else if (category === '5') {
            params.content = {
                category,
                ...cumulative,
            }
            if (this.props.scope === 2) {
                if (cumulative.usingBusinessId2) {
                    params.useBusinessIds = [...new Set([cumulative.usingBusinessId1, ...cumulative.usingBusinessId2])]
                } else {
                    params.useBusinessIds = [...new Set([cumulative.usingBusinessId1])]
                }
            }
        } else if (category === '6') {
            let checked = await this.assign.getGroupList()
            if (!checked) {
                return
            }
            params.content = {
                category,
                ...assignment,
            }
        } else if (category === '7') {
            params.content = {
                category,
                ...sortInfo,
            }
            if (this.props.scope === 2) {
                if (sortInfo.usingBusinessId2) {
                    params.useBusinessIds = [...new Set([...sortInfo.usingBusinessId2])]
                } else {
                    params.useBusinessIds = []
                }
            }
        }
        if (this.state.colName.length === 0) {
            message.warning('列名不能为空')
        } else {
            if (this.props.addDimensionAsset || this.props.addFactAsset) {
                this.props.saveFormula(params)
                return
            }
            console.log(params, 'params++++')
            this.setState({ btnLoading: true })
            let res = await addFormula(params)
            this.setState({ btnLoading: false })
            if (res.code === 200) {
                store.clearParams()
                // store.setTempBusinessId(res.data)
                if (!isAdd) {
                    this.props.saveFormula(res.data, params)
                } else {
                    this.props.saveFormula(res.data)
                }
                this.props.handleCancel()
            }
        }
    }
    handleCancel = () => {
        this.props.handleCancel()
    }
    clearParams = () => {
        store.clearParams()
    }
    delFormula = () => {
        let params = {
            id: store.editId,
            tempBusinessId: store.tempBusinessId,
        }
        if (store.ifProcess) {
            params.etlProcessId = store.etlProcessId
        }
        this.props.delFormula(params)
        this.props.handleCancel()
    }
    render() {
        const { category } = store
        const { colName, formulaList, btnLoading } = this.state
        const { scope, createETL, ifProcess, etlProcessId, addDimensionAsset, addFactAsset, formTitle } = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <Form layout='inline'>
                <div className='addNewCol'>
                    <div className='newColTopic'>
                        <Form.Item label={formTitle ? formTitle : '新增列名'} colon={false}>
                            {getFieldDecorator('name', {
                                // rules: [{ required: false, message: '列名不能为空' }],
                                initialValue: colName || '',
                            })(
                                <Input
                                    onChange={this.changeName}
                                    className='topicInput'
                                    placeholder='请输入'
                                    style={{ width: '445px' }}
                                    // value={colName}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className='addNewContent'>
                        <div className='leftContent'>
                            <Menu selectedKeys={[category]} mode='inline' theme='light' onSelect={this.onSelect}>
                                <Menu.Item key='1'>
                                    <span>公式函数</span>
                                </Menu.Item>
                                <Menu.Item key='2'>
                                    <span>计算时间差</span>
                                </Menu.Item>
                                <Menu.Item key='3'>
                                    <span>获取时间</span>
                                </Menu.Item>
                                <Menu.Item key='4'>
                                    <span>分组聚合计算</span>
                                </Menu.Item>
                                <Menu.Item key='5'>
                                    <span>分组累计计算</span>
                                </Menu.Item>
                                <Menu.Item key='6'>
                                    <span>分组赋值计算</span>
                                </Menu.Item>
                                <Menu.Item key='7'>
                                    <span>分组排序</span>
                                </Menu.Item>
                            </Menu>
                        </div>
                        <div className='rightContent'>
                            {category === '1' && (
                                <Formula
                                    addDimensionAsset={addDimensionAsset}
                                    addFactAsset={addFactAsset}
                                    businessIds={this.props.businessIds}
                                    createETL={createETL}
                                    scope={scope}
                                    formulaList={formulaList}
                                    isEdit={this.props.isEdit}
                                />
                            )}
                            {category === '2' && <TimeDiff isEdit={this.props.isEdit} />}
                            {category === '3' && <GetTime isEdit={this.props.isEdit} />}
                            {category === '4' && <Aggregation tempBusinessId={this.props.tempBusinessId} isEdit={this.props.isEdit} />}
                            {category === '5' && <Cumulative tempBusinessId={this.props.tempBusinessId} isEdit={this.props.isEdit} />}
                            {category === '6' && (
                                <Assignment
                                    form={this.props.form}
                                    wrappedComponentRef={(refs) => {
                                        this.assign = refs
                                    }}
                                    isEdit={this.props.isEdit}
                                />
                            )}
                            {category === '7' && <Sort tempBusinessId={this.props.tempBusinessId} isEdit={this.props.isEdit} />}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', paddingTop: '20px' }}>
                        {this.props.isEdit && this.props.delFormula && (
                            <Button onClick={this.delFormula} style={{ float: 'left' }}>
                                删除公式
                            </Button>
                        )}
                        <Button onClick={this.handleCancel} style={{ marginRight: '20px' }}>
                            取消
                        </Button>
                        <Button type='primary' onClick={this.addMethod} loading={btnLoading}>
                            确定
                        </Button>
                    </div>
                </div>
            </Form>
        )
    }
}
const WrappedHorizon = Form.create()(addNewCol)
export default WrappedHorizon
