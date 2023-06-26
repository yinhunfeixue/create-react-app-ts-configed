import { Button, message, Modal, Tooltip, Table, ConfigProvider } from 'antd'
import { deleteStandardCodeValue, getStandardCodeValue } from 'app_api/standardApi'
import { GeneralTable } from 'app_component'
import moment from 'moment'
import React, { Component } from 'react'
import EmptyIcon from '@/component/EmptyIcon'
import _ from 'underscore'
import StandardForm from './standardForm'
import './index.less'

export default class StandardCodeValue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tablePagination: {
                total: '',
                page: 1,
                page_size: 1000,
                paginationDisplay: 'none',
            },
            tableData: [],
            modalVisible: false,
            modalType: '',
            editItemId: undefined,
        }

        this.columns = [
            {
                dataIndex: 'value',
                key: 'value',
                title: '代码值',
            },
            {
                dataIndex: 'name',
                key: 'name',
                title: '代码值名称',
                ellipsis: true,
            },
        ]

        this.editFilter = {
            addBtnOption: {
                show: true,
                clickFunction: this.addBtn,
            },
            editBtnOption: {
                show: true,
                clickFunction: this.editBtn,
            },
            cancelBtnOption: {
                show: true,
                clickFunction: this.delBtn,
            },
            otherBtn: (
                <Button onClick={this.lookBtn} className='editBtn'>
                    {' '}
                    查看映射
                </Button>
            ),
        }
        this.lookFilter = {
            otherBtn: (
                <Button onClick={this.lookBtn} className='editBtn' style={{ marginLeft: '0px' }}>
                    {' '}
                    查看映射
                </Button>
            ),
        }
    }

    componentDidMount() {
        console.log('this.props', this.props)
        this.getTableData({ standard: (this.props.location.state || this.props.param).id })
    }

    addBtn = (selectedRowKeys, selectedRows) => {
        this.setState(
            {
                modalVisible: true,
                modalType: 'add',
            },
            () => {
                let obj = {}
                obj.value = ''
                obj.name = ''
                obj.comment = ''
                obj.standardId = (this.props.location.state || {}).entityId
                obj.standard = (this.props.location.state || {}).id
                obj.standardName = (this.props.location.state || {}).entityDesc ? (this.props.location.state || {}).entityDesc : (this.props.location.state || {}).entityName

                this.formRef.setFieldsValue(obj)
            }
        )
    }

    editBtn = (selectedRowKeys, selectedRows) => {
        this.setState(
            {
                modalVisible: true,
                modalType: 'edit',
                editItemId: selectedRows[0].id,
            },
            () => {
                let obj = {}
                obj.value = selectedRows[0].value
                obj.name = selectedRows[0].name
                obj.comment = selectedRows[0].comment
                obj.standardId = (this.props.location.state || {}).entityId
                obj.standard = (this.props.location.state || {}).id
                obj.standardName = (this.props.location.state || {}).entityDesc ? (this.props.location.state || {}).entityDesc : (this.props.location.state || {}).entityName
                this.formRef.setFieldsValue(obj)
            }
        )
    }

    delBtn = (selectedRowKeys, selectedRows) => {
        let ids = []
        _.map(selectedRows, (item, key) => {
            ids.push(item.id)
        })
        deleteStandardCodeValue(ids).then((res) => {
            if (res.code == '200') {
                message.success(res.msg ? res.msg : 'success！')
                this.getTableData({ page: 1 })
                this.formRef.resetTableInfo()
            } else {
                message.error(res.msg ? res.msg : '删除失败！')
            }
        })
    }

    lookBtn = () => {
        console.log('lookBtn')
        this.props.addTab('标准-代码值映射', { ...(this.props.location.state || {}), total: this.state.tablePagination.total, operateFrom: 'standard' })
    }

    hideModal = () => {
        this.setState({
            modalVisible: false,
        })
    }

    getTableData = (param) => {
        this.paramOption = { ...this.state.tablePagination, ...param }
        getStandardCodeValue(this.paramOption).then((res) => {
            if (res.code == '200') {
                this.setState({
                    tableData: res.data,
                    tablePagination: { ...this.paramOption, paginationDisplay: 'block', total: res.total },
                })
            } else {
                message.error(res.msg ? res.msg : '请求列表失败')
            }
        })
    }

    render() {
        const { modalVisible, modalType, tableData, tablePagination, editItemId } = this.state

        return (
            <div className='standardCodetitleNo'>
                <ConfigProvider
                    renderEmpty={() => {
                        return <EmptyIcon />
                    }}
                >
                    <Table
                        //filter={(this.props.location.state || {}).operate === 'edit' ? this.editFilter : null /* this.lookFilter */}
                        dataSource={tableData}
                        columns={this.columns}
                        size='small'
                        scroll={{ y: 480 }}
                        pagination={false}
                    />
                </ConfigProvider>
            </div>
        )
    }
}
