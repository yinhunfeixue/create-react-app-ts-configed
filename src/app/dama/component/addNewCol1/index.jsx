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
        }
    }
    componentDidMount = async () => {
        // store.setBusinessId(this.props.businessId)
        // store.clearParams()
        const { formulaContent, cname, id } = this.props
        if (this.props.isEdit) {
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
                    store.setAggregation(formulaContent)
                    break
                case '5':
                    store.setCumulative(formulaContent)
                    break
                case '6':
                    store.setAssignment(formulaContent)
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
        const { category, columnType, formula, timeDiff, getTimeParam, businessId, aggregation, cumulative, assignment, isAdd, editId } = store
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
            }
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
        }
        if (this.state.colName.length === 0) {
            message.warning('列名不能为空')
        } else {
            let res = await addFormula(params)
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
        const { colName, formulaList } = this.state
        const { scope, createETL, ifProcess, etlProcessId } = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <Form layout='inline'>
                <div className='addNewCol'>
                    <div className='newColTopic'>
                        <Form.Item label='新增列名' colon={false}>
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
                            </Menu>
                        </div>
                        <div className='rightContent'>
                            {category === '1' && <Formula createETL={createETL} scope={scope} formulaList={formulaList} />}
                            {category === '2' && <TimeDiff />}
                            {category === '3' && <GetTime />}
                            {category === '4' && <Aggregation />}
                            {category === '5' && <Cumulative />}
                            {category === '6' && (
                                <Assignment
                                    form={this.props.form}
                                    wrappedComponentRef={(refs) => {
                                        this.assign = refs
                                    }}
                                />
                            )}
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
                        <Button type='primary' onClick={this.addMethod}>
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
