import { Button, Select, Input, Switch, message, Modal, Spin } from 'antd'
import React, { Component } from 'react'
import './index.less'
import { ContentLayout, Empty } from 'cps'
import ProjectUtil from '@/utils/ProjectUtil'
import AutoTip from '@/component/AutoTip'
import RichTableLayout from '@/component/layout/RichTableLayout'
import PermissionWrap from '@/component/PermissionWrap'
import { changeEnableStatus, sortMetaModelDetail, deleteMetaModelDetail, metaModelDetailRelationCount } from 'app_api/metaModelApi'
import IconFont from '@/component/IconFont'
import Lodash from 'lodash'
import AddModelDetailDrawer from './addModelDetailDrawer'
import ModelDetailDrawer from './modelDetailDrawer'
import { sourceList, typeList, statusList } from './enumType'
const Option = Select.Option

export default class MetaModelDetailList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            metaModelDetailList: Lodash.cloneDeep(props.metaModel.metaModelDetailList),
            keyWord: '',
            sourceValue: null,
            typeValue: null,
            statusValue: null,
            loading: false,
        }
        this.columns = [
            {
                dataIndex: 'nameCn',
                key: 'nameCn',
                title: '属性名称',
                width: 160,
                render: (text, record) => (
                    <AutoTip
                        title={text}
                        content={
                            <span className='LineClamp1'>
                                <IconFont type='icon-tuozhuai' style={{ marginRight: 12 }} />
                                {record.source === 1 ? <span className='detailTag insideTag'>内置</span> : <span className='detailTag customTag'>自定义</span>}
                                <span style={{ marginLeft: 6 }}>{text}</span>
                            </span>
                        }
                    />
                ),
            },
            {
                dataIndex: 'nameEn',
                key: 'nameEn',
                title: '属性英文名',
                width: 120,
                render: (text) => <AutoTip content={text} />,
            },
            {
                dataIndex: 'typeName',
                key: 'typeName',
                title: '类型',
                width: 120,
                render: (text) => <span className='LineClamp1'>{text}</span>,
            },
            {
                dataIndex: 'isRequiredField',
                key: 'isRequiredField',
                title: '是否必填',
                width: 60,
                render: (text) => <span className='LineClamp1'>{text ? '是' : '否'}</span>,
            },
            {
                dataIndex: 'createUser',
                key: 'createUser',
                title: '创建人',
                width: 120,
                render: (text, record) => <AutoTip content={record.source === 1 ? `${text}` : `${text} (${record.createUserAccount})`} />,
            },
            {
                dataIndex: 'isEnable',
                key: 'isEnable',
                title: '状态',
                width: 120,
                render: (text, record, index) => {
                    // const systemCode = record.businessId.toString()
                    return (
                        <PermissionWrap funcCode='/md/meta_model/attribute/switch'>
                            <span onClick={(e) => e.stopPropagation()} className='tableActiveStatus'>
                                <span onClick={() => this.onSwitchChange(record)}>
                                    <Switch className='tableSwitch' checked={text} disabled={!record.isCanClose && text} checkedChildren='启用' unCheckedChildren='禁用' />
                                </span>
                            </span>
                        </PermissionWrap>
                    )
                },
            },
        ]
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({ metaModelDetailList: nextProps.metaModel.metaModelDetailList }, () => this.filterDataList())
    }

    shouldComponentUpdate = (nextProps) => {
        if (nextProps.currentEnterIndex !== this.props.currentEnterIndex) {
            return false
        }
        return true
    }

    onSwitchChange = async (record) => {
        if (!record.isCanClose && record.isEnable) return
        let res = await changeEnableStatus({ metaModelDetailId: record.id, enableStatus: !record.isEnable })
        if (res.code === 200) {
            this.props.queryMetaModelDetailListById()
        }
    }

    getDragSortData = async (res) => {
        const { dragRow, hoverRow, newList } = res
        let arr = []
        newList.forEach((item) => {
            if ([dragRow.id, hoverRow.id].indexOf(item.id) > -1) {
                arr.push(item.id)
            }
        })

        await sortMetaModelDetail({ appBaseConfigId: this.props.metaModel.appBaseConfigId, moveItemId: dragRow.id, upItemId: arr[0], downItemId: arr[1] })
        this.setState({ metaModelDetailList: newList }, () => {
            this.props.queryMetaModelDetailListById()
        })
    }

    searchSelectChange = (type, val) => {
        switch (type) {
            case 'source':
                this.setState({ sourceValue: val || null, loading: true }, () => this.filterDataList())
                break
            case 'type':
                this.setState({ typeValue: val || null, loading: true }, () => this.filterDataList())
                break
            case 'status':
                if (val === undefined) val = null
                this.setState({ statusValue: val, loading: true }, () => this.filterDataList())
                break
            default:
                break
        }
    }

    filterDataList = () => {
        const { keyWord, sourceValue, typeValue, statusValue } = this.state
        const arr = this.props.metaModel.metaModelDetailList.filter((meta) => {
            return (
                (meta.nameCn.indexOf(keyWord) > -1 || meta.nameEn.indexOf(keyWord) > -1) &&
                (!sourceValue || sourceValue === meta.source) &&
                (!typeValue || typeValue === meta.type) &&
                (statusValue === null || statusValue === meta.isEnable)
            )
        })
        this.setState({ metaModelDetailList: arr }, () => {
            setTimeout(() => {
                this.setState({ loading: false })
            }, 100)
        })
    }

    resetCondition = () => {
        this.setState(
            {
                keyWord: '',
                sourceValue: null,
                typeValue: null,
                statusValue: null,
                loading: true,
            },
            () => {
                this.filterDataList()
            }
        )
    }

    deleteData = async (data) => {
        let res = await metaModelDetailRelationCount({ metaModelDetailId: data.id })
        if (res.code === 200) {
            let that = this
            Modal.confirm({
                title: '删除属性',
                content: `该属性上已有${res.data}条关联数据，是否确认删除。`,
                okText: '删除',
                okType: 'danger',
                okButtonProps: { type: 'primary' },
                cancelText: '取消',
                onOk() {
                    deleteMetaModelDetail({ id: data.id }).then((res) => {
                        if (res.code == 200) {
                            message.success('删除成功')
                            that.search()
                        }
                    })
                },
            })
        }
    }

    search = () => {
        this.props.queryMetaModelDetailListById()
    }

    openEditPage = (data) => {
        this.addNameRuleDrawer && this.addNameRuleDrawer.openEditModal(Lodash.cloneDeep(data))
    }
    openAddPage = () => {
        this.addNameRuleDrawer && this.addNameRuleDrawer.openAddModal({ appBaseConfigId: this.props.metaModel.appBaseConfigId })
    }

    openDetailModal = (data) => {
        data.appBaseConfigGroup = this.props.metaModel.appBaseConfigGroup
        this.bizRuleDetailDrawer && this.bizRuleDetailDrawer.openModal(data)
    }

    render() {
        const { metaModelDetailList, keyWord, sourceValue, typeValue, statusValue, loading } = this.state
        return (
            <React.Fragment>
                <AddModelDetailDrawer modelId={this.props.modelId} metaModelList={this.props.metaModelList} search={this.search} ref={(dom) => (this.addNameRuleDrawer = dom)} />
                <ModelDetailDrawer ref={(dom) => (this.bizRuleDetailDrawer = dom)} />
                <Spin spinning={loading}>
                    <RichTableLayout
                        enableDrag
                        enableDragSort
                        loading={this.props.loading}
                        smallLayout
                        disabledDefaultFooter
                        showFooterControl={false}
                        renderSearch={() => {
                            return (
                                <React.Fragment>
                                    <Input.Search
                                        allowClear
                                        style={{ width: 280, marginRight: 8 }}
                                        value={keyWord}
                                        onChange={(e) => this.setState({ keyWord: e.target.value })}
                                        onSearch={(val) => this.setState({ keyWord: val, loading: true }, () => this.filterDataList())}
                                        placeholder='属性搜索'
                                    />
                                    <Select onChange={this.searchSelectChange.bind(null, 'source')} value={sourceValue} allowClear className='datasourceSelect' placeholder='来源'>
                                        {sourceList.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Select onChange={this.searchSelectChange.bind(null, 'type')} value={typeValue} allowClear className='datasourceSelect' placeholder='类型'>
                                        {typeList.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Select onChange={this.searchSelectChange.bind(null, 'status')} value={statusValue} allowClear className='datasourceSelect' placeholder='状态'>
                                        {statusList.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Button onClick={this.resetCondition}>重置</Button>
                                </React.Fragment>
                            )
                        }}
                        editColumnProps={{
                            width: 120,
                            createEditColumnElements: (_, record) => {
                                return record.source === 1
                                    ? [
                                          <a onClick={this.openDetailModal.bind(this, record)} key='edit'>
                                              详情
                                          </a>,
                                      ]
                                    : [
                                          <a onClick={this.openDetailModal.bind(this, record)} key='edit'>
                                              详情
                                          </a>,
                                          <PermissionWrap funcCode='/md/meta_model/attribute/edit'>
                                              <a onClick={this.openEditPage.bind(this, record)} key='edit'>
                                                  编辑
                                              </a>
                                          </PermissionWrap>,
                                          <PermissionWrap funcCode='/md/meta_model/attribute/delete'>
                                              <a onClick={this.deleteData.bind(this, record)} key='edit'>
                                                  删除
                                              </a>
                                          </PermissionWrap>,
                                      ]
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'appBaseConfigId',
                            extraTableProps: {
                                dataSource: metaModelDetailList,
                                footer: () => (
                                    <PermissionWrap funcCode='/md/meta_model/attribute/add'>
                                        <div style={{ backgroundColor: 'white', textAlign: 'center' }}>
                                            <span onClick={this.openAddPage} style={{ color: '#4D73FF', cursor: 'pointer' }}>
                                                {' '}
                                                + 新增属性
                                            </span>
                                        </div>
                                    </PermissionWrap>
                                ),
                                getDragSortData: this.getDragSortData,
                            },
                        }}
                    />
                </Spin>
            </React.Fragment>
        )
    }
}
