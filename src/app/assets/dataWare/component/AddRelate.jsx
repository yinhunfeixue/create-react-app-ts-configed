import React, { Component } from 'react'
import { Modal, Select, message } from 'antd'
import RadioGroup from 'antd/lib/radio/group'
import RadioButton from 'antd/lib/radio/radioButton'
import './AddRelate.less'
import DataSourceServices from '../../../../services/DataSourceServices'
import DataManageServices from '../../../../services/DataManageServices'
import ProjectUtil from '../../../../utils/ProjectUtil'

/**
 * 添加关联关系
 */
class AddRelate extends Component {
    constructor(props) {
        super(props)
        this.state = this.getInitState()
    }

    getInitState() {
        const { orgData, record } = this.props
        const result = {
            visible: false,
            /**
             * 可用来关联的表格树
             */
            relateTableList: [],
            /**
             * 原始表下关联字段id
             */
            columnIdOriginal: null,
            /**
             * 选择的关联表
             */
            businessIdRelated: null,

            relateFieldList: [],
            /**
             * 关联表字段
             */
            columnIdRelated: null,

            /**
             * 源表的字段
             */
            orgData: null,

            sourceFieldList: null,

            relateType: '',

            loadingSave: false,
            connect: null,
            join: null,
            // 如果是编辑需要的id
            relationId: null
        }
        // 设置初始值
        if (orgData) {
            console.log(orgData)
            result.businessIdRelated = orgData.businessIdRelated
            result.columnIdOriginal = orgData.columnIdOriginal
            result.columnIdRelated = orgData.columnIdRelated
            result.connect = orgData.connect
            result.join = orgData.join
            result.relationId = orgData.relationId
        }
        return result
    }

    resetState() {
        this.setState(this.getInitState())
    }

    show() {
        this.resetState()
        this.setState({ visible: true })
        this.requestSourceFieldsInfo()
        this.requestRetaionTableList()
    }

    close() {
        this.setState({ visible: false })
    }

    submit() {
        console.log(this.props.relateList, '列表')
        if (!this.checkSubmitData()) {
            return
        }

        const {
            businessIdOriginal,
            columnIdRelated,
            businessIdRelated,
            columnIdOriginal,
            connect,
            join
        } = this.state

        const { record, orgData, relateList } = this.props
        // 如果列表已经存在提示'该关联关系已存在'
        if (relateList.length > 0) {
            // 是否重复
            let isRepeat = false
            relateList.map((value, index) => {
                if (
                    value.columnIdRelated === columnIdRelated &&
                    value.businessIdRelated === businessIdRelated &&
                    value.columnIdOriginal === columnIdOriginal &&
                    value.connect === connect &&
                    value.join === join
                ) {
                    isRepeat = true
                }
            })
            if (isRepeat) {
                message.warning('该关联关系已存在')
                return
            }
        }
        // console.log(orgData, columnIdRelated, columnIdOriginal, '--------------如果没用做改变 不走接口直接关闭弹窗---------------------')
        // 如果没用做改变 不走接口直接关闭弹窗
        if (orgData && columnIdRelated === orgData.columnIdRelated && columnIdOriginal === orgData.columnIdOriginal && businessIdRelated === orgData.businessIdRelated && connect === orgData.connect && join === orgData.join) {
            this.close()
            return
        }

        console.log('--------submitsubmitsubmitsubmit-----------------')

        // 如果是原始表指向关联表，则左侧的值是relTableId relColumnId，否则，左侧的值是columnId 和tableid
        let promise
        let businessId = record.businessId
        if (orgData && orgData.businessIdOriginal) {
            businessId = orgData.businessIdOriginal
        }
        if (this.state.relationId) {
            promise = DataManageServices.editRelation(
                businessId,
                businessIdRelated,
                columnIdOriginal,
                columnIdRelated,
                join,
                connect,
                this.state.relationId
            )
        } else {
            promise = DataManageServices.addRelation(
                businessId,
                businessIdRelated,
                columnIdOriginal,
                columnIdRelated,
                join,
                connect
            )
        }

        this.setState({ loadingSave: true })
        promise.then((res) => {
            ProjectUtil.checkRes(
                res,
                () => {
                    const { onSuccess } = this.props
                    this.close()
                    if (onSuccess) {
                        onSuccess()
                    }
                },
                () => {
                    this.setState({ loadingSave: false })
                }
            )
        })
    }

    requestSourceFieldsInfo() {
        const { orgData, record } = this.props
        this.setState({ loadingSourceField: true })
        let businessId = record.businessId
        if (orgData && orgData.businessIdOriginal) {
            businessId = orgData.businessIdOriginal
        }
        DataManageServices.getFieldList({ businessId }).then((res) => {
            ProjectUtil.checkRes(
                res,
                (data) => {
                    this.setState({ sourceFieldList: data })
                },
                () => {
                    this.setState({ loadingSourceField: false })
                }
            )
        })
    }

    checkSubmitData() {
        const {
            columnIdRelated,
            columnIdOriginal,
            businessIdRelated,
            connect,
            join
        } = this.state
        if (!columnIdOriginal) {
            message.error('请选择原始表-关联字段')
            return false
        }

        if (!businessIdRelated) {
            message.error('请选择关联表')
            return false
        }
        if (!columnIdRelated) {
            message.error('请选择关联字段')
            return false
        }
        // if (!connect && connect !== 0) {
        //     message.error('请选择连接基数')
        //     return false
        // }

        // if (!join && join !== 0) {
        //     message.error('请选择关联方式')
        //     return false
        // }
        return true
    }

    requestRetaionTableList() {
        const { record, orgData } = this.props
        this.setState({ loadingRetionTable: true })
        let businessId = record.businessId
        if (orgData && orgData.businessIdOriginal) {
            businessId = orgData.businessIdOriginal
        }
        DataManageServices.getCanRelationTableList(businessId).then(
            (res) => {
                ProjectUtil.checkRes(
                    res,
                    (data) => {
                        this.setState({ relateTableList: data }, () => {
                            // 如果有选中的表ID，获取表的字段
                            if (this.state.businessIdRelated) {
                                this.requestRetionFieldList()
                            }
                        })
                    },
                    () => {
                        this.setState({ loadingRetionTable: false })
                    }
                )
            }
        )
    }

    requestRetionFieldList() {
        const { businessIdRelated, columnIdOriginal } = this.state
        this.setState({ relateFieldList: [], loadingRetionField: true })
        let params = {}
        if (businessIdRelated) {
            params.businessId = businessIdRelated
        }
        if (columnIdOriginal) {
            params.columnId = columnIdOriginal
        }
        if (businessIdRelated) {
            DataManageServices.getFieldList(
                params,
            ).then((res) => {
                ProjectUtil.checkRes(
                    res,
                    (data) => {
                        this.setState({ relateFieldList: data })
                    },
                    () => {
                        this.setState({ loadingRetionField: false })
                    }
                )
            })
        }
    }
    render() {
        const {
            visible,
            sourceFieldList,
            columnIdOriginal,
            businessIdRelated,
            relateTableList,
            relateFieldList,
            columnIdRelated,
            loadingSave,
            loadingSourceField,
            loadingRetionField,
            loadingRetionTable,
            // 关联方式
            join,
            // 连接基数
            connect
        } = this.state
        const { record, orgData } = this.props
        return (
            <Modal
                width={650}
                visible={visible}
                title='设置关联关系'
                onCancel={() => this.close()}
                className='AddRelate'
                confirmLoading={loadingSave}
                onOk={() => {
                    this.submit()
                }}
                cancelButtonProps={{
                    disabled: loadingSave
                }}
            >
                <div className='RelateItem'>
                    <h3>原始表</h3>
                    <header>{orgData && orgData.businessOriginalName ? orgData.businessOriginalName : record.businessTypeName}</header>
                    <Select
                        loading={loadingSourceField}
                        placeholder='请选择关联字段'
                        dropdownMatchSelectWidth={false}
                        value={columnIdOriginal || undefined}
                        onChange={(value) => {
                            this.setState(
                                { columnIdOriginal: value, columnIdRelated: null },
                                () => this.requestRetionFieldList()
                            )
                        }}
                    >
                        {sourceFieldList &&
                            sourceFieldList.map((item) => {
                                return (
                                    <Select.Option
                                        key={item.columnId}
                                        value={item.columnId}
                                    >
                                        {item.cname || item.ename}
                                    </Select.Option>
                                )
                            })}
                    </Select>
                </div>
                {/*<div className='RelateItem'>*/}
                    {/*<h3>关联设置</h3>*/}
                    {/*<Select*/}
                        {/*placeholder='关联方式'*/}
                        {/*value={(join || join === 0) ? join : undefined}*/}
                        {/*dropdownMatchSelectWidth={false}*/}
                        {/*onChange={(value) => {*/}
                            {/*this.setState(*/}
                                {/*{ join: value },*/}
                                {/*//    () => this.requestRetionFieldList()*/}
                            {/*)*/}
                        {/*}}*/}
                    {/*>*/}
                        {/*<Select.Option value={0}>左连接</Select.Option>*/}
                        {/*<Select.Option value={1}>右连接</Select.Option>*/}
                        {/*<Select.Option value={2}>内连接</Select.Option>*/}
                        {/*<Select.Option value={3}>外连接</Select.Option>*/}
                    {/*</Select>*/}
                    {/*<Select*/}
                        {/*placeholder='连接基数'*/}
                        {/*value={(connect || connect === 0) ? connect : undefined}*/}
                        {/*dropdownMatchSelectWidth={false}*/}
                        {/*onChange={(value) => {*/}
                            {/*this.setState(*/}
                                {/*{ connect: value },*/}
                                {/*//    () => this.requestRetionFieldList()*/}
                            {/*)*/}
                        {/*}}*/}
                    {/*>*/}
                        {/*<Select.Option value={0}>一对一</Select.Option>*/}
                        {/*<Select.Option value={1}>多对一</Select.Option>*/}
                    {/*</Select>*/}
                {/*</div>*/}
                <div className='RelateItem'>
                    <h3>关联表</h3>
                    <Select
                        loading={loadingRetionTable}
                        placeholder='请选择关联表'
                        value={businessIdRelated || undefined}
                        dropdownMatchSelectWidth={false}
                        onChange={(value) => {
                            this.setState(
                                { businessIdRelated: value, columnIdRelated: null },
                                () => this.requestRetionFieldList()
                            )
                        }}
                    >
                        {relateTableList &&
                            relateTableList.map((item) => {
                                return (
                                    <Select.Option
                                        key={item.businessId}
                                        value={item.businessId}
                                    >
                                        {item.businessTypeName || item.businessId}
                                    </Select.Option>
                                )
                            })}
                    </Select>
                    <Select
                        loading={loadingRetionField}
                        placeholder='请选择关联字段'
                        value={columnIdRelated || undefined}
                        dropdownMatchSelectWidth={false}
                        onChange={(value) => {
                            this.setState({ columnIdRelated: value })
                        }}
                    >
                        {relateFieldList &&
                            relateFieldList.map((item) => {
                                return (
                                    <Select.Option
                                        key={item.columnId}
                                        value={item.columnId}
                                    >
                                        {item.cname || item.ename}
                                    </Select.Option>
                                )
                            })}
                    </Select>
                </div>
            </Modal>
        )
    }
}

export default AddRelate
