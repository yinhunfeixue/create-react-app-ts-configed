import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import LevelTag from '@/component/LevelTag'
import ModuleTitle from '@/component/module/ModuleTitle'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Cascader, Divider, Form, message, Popconfirm, Select, Table, Tooltip } from 'antd'
import { columnConfirmAudit, eigenList, getTableData, securityTree } from 'app_api/dataSecurity'
import SvgIcon from 'app_component_main/SvgIcon/index.tsx'
import React, { Component } from 'react'
import _ from 'underscore'
import '../index.less'
import PreviewModal from './previewModal'

export default class TraitRecomandDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
                eigenSelectedInfo: {},
                eigenVoList: [],
            },
            addType: 1,
            categoryTreeData: [],
            traitList: [],
            btnLoading: false,
            columnData: [],
            showEditInput: false,

            tableListData: [],
            selectId: '',
            selectData: {},
        }
        this.columns = [
            {
                title: '字段名',
                dataIndex: 'columnName',
                key: 'columnName',
                width: 160,
                ellipsis: true,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>
                                {text}
                                <span onClick={this.openPreviewModal.bind(this, record)} style={{ marginLeft: 8, cursor: 'pointer', color: '#5B7FA3' }} className='iconfont icon-yangli'></span>
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '字段中文名',
                dataIndex: 'columnNameDesc',
                key: 'columnNameDesc',
                width: 150,
                ellipsis: true,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '表名',
                dataIndex: 'tableName',
                key: 'tableName',
                width: 200,
                ellipsis: true,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '路径',
                dataIndex: 'databaseName',
                key: 'databaseName',
                width: 200,
                ellipsis: true,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={record.datasourceName + '/' + record.databaseName}>
                            <span>
                                {record.datasourceName}/{record.databaseName}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '分级',
                dataIndex: 'level',
                key: 'level',
                width: 100,
                render: (text, record) => {
                    console.log('record', record, this.state.selectData)
                    return <LevelTag value={record.polymer === 0 ? this.state.selectData.level : this.state.selectData.polymerLevel} />
                },
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 80,
                render: (text, record, index) => {
                    return (
                        <Popconfirm
                            title={
                                <div style={{ width: 200 }}>
                                    <div>是否移除字段关联</div>
                                    {/*移除字是否包含该字段的下游血缘*/}
                                    {/*<Radio.Group onChange={this.changeRadio.bind(this, index)} value={record.isCheck}>*/}
                                    {/*<Radio value={1}>包含</Radio>*/}
                                    {/*<Radio value={2}>不含</Radio>*/}
                                    {/*</Radio.Group>*/}
                                </div>
                            }
                            placement='leftTop'
                            onConfirm={() => {
                                this.deleteView(index)
                            }}
                            okText='移除'
                            cancelText='取消'
                        >
                            <a>移除</a>
                        </Popconfirm>
                    )
                },
            },
        ]
    }
    openModal = (data, type, value) => {
        let { columnData, selectId } = this.state
        console.log('openModal', data, type, value)
        columnData = []
        if (type == 2 && !value) {
            console.log(data.columnFromLineagesMap, 'columnFromLineagesMap')
            {
                _.map(data.columnFromLineagesMap, (item, index) => {
                    if (data.eigenSelectedInfo.id == index) {
                        columnData = item
                    }
                })
            }
        }
        console.log('columnData', columnData)
        this.setState({
            modalVisible: true,
            detailInfo: JSON.parse(JSON.stringify(data)),
            addType: type,
            showEditInput: value,
            traitList: [],
            columnData: columnData.concat(),
        })
        this.getTreeData()
        if (value) {
            this.getTraitList()
        }
        if (!selectId) {
            this.setState(
                {
                    selectId: ((data.eigenVoList || [])[0] || {}).id,
                    selectData: (data.eigenVoList || [])[0] || {},
                },
                () => {
                    this.getTableListData()
                }
            )
        }
    }
    getTableListData = async () => {
        const { detailInfo, selectId } = this.state
        const res = await getTableData({
            columnId: detailInfo.columnId,
            //eigenId: selectId,
        })
        if (res.code == 200) {
            this.setState({
                tableListData: res.data || [],
            })
        }
    }
    getTreeData = async () => {
        let res = await securityTree()
        if (res.code == 200) {
            this.setState({
                categoryTreeData: res.data.children,
            })
        }
    }
    changeRadio = (index, e) => {
        let { columnData } = this.state
        columnData[index].isCheck = e.target.value
        this.setState({
            columnData,
        })
    }
    openPreviewModal = (data) => {
        this.previewModal && this.previewModal.openModal(data)
    }
    deleteView = (index) => {
        let { columnData, tableListData } = this.state
        columnData.splice(index, 1)
        tableListData.splice(index, 1)
        this.setState({
            columnData: columnData.concat(),
            tableListData: tableListData.concat(),
        })
    }
    cancel = () => {
        // 取消重置selectId
        this.setState({
            modalVisible: false,
            selectId: '',
        })
    }
    changeType = async (name, e, node) => {
        let { detailInfo } = this.state
        detailInfo.eigenSelectedInfo[name] = e
        if (name == 'id') {
            detailInfo.eigenSelectedInfo.eigenName = node.props.item.eigenName
            detailInfo.eigenSelectedInfo.classPath = node.props.item.classPath
            detailInfo.eigenSelectedInfo.level = node.props.item.level
            detailInfo.eigenSelectedInfo.tagName = node.props.item.tagName
            detailInfo.eigenSelectedInfo.score = undefined // 显示自定义
        } else {
            detailInfo.eigenSelectedInfo.id = undefined
        }
        await this.setState({
            detailInfo,
        })
        if (name == 'classIdList') {
            this.getTraitList()
        }
    }
    getTraitList = async () => {
        let { detailInfo } = this.state
        let res = await eigenList({ classId: detailInfo.eigenSelectedInfo.classIdList[detailInfo.eigenSelectedInfo.classIdList.length - 1] })
        if (res.code == 200) {
            this.setState({
                traitList: res.data,
            })
        }
    }
    deleteTrait = () => {
        let { detailInfo } = this.state
        detailInfo.hasTrait = false
        this.setState({
            detailInfo,
        })
    }
    addTrait = () => {
        let { detailInfo } = this.state
        detailInfo.hasTrait = true
        this.setState({
            detailInfo,
        })
    }
    selectItem = (data) => {
        let { detailInfo, columnData } = this.state
        detailInfo.eigenSelectedInfo = {}
        for (let k in data) {
            detailInfo.eigenSelectedInfo[k] = data[k]
        }
        columnData = []
        console.log(data, 'selectItem++++')
        {
            _.map(detailInfo.columnFromLineagesMap, (item, index) => {
                if (data.id == index) {
                    columnData = item
                }
            })
        }
        this.setState({
            detailInfo,
            columnData: columnData.concat(),
            selectId: data.id,
            selectData: { ...data },
        })
    }
    changeAddType = (value) => {
        let { detailInfo } = this.state
        if (value) {
            detailInfo.eigenSelectedInfo.classIdList = []
            detailInfo.eigenSelectedInfo.id = undefined
            this.setState({
                detailInfo,
                traitList: [],
            })
        } else {
            this.selectItem(detailInfo.eigenVoList[0])
        }
        this.setState({
            showEditInput: value,
        })
    }
    postData = async () => {
        let { addType, detailInfo, columnData, showEditInput, tableListData } = this.state
        console.log('postData', this.state)
        if (addType == 2) {
            let query = {
                columnId: detailInfo.columnId,
                eigenId: detailInfo.eigenSelectedInfo.id,
                lineageColumnIdsWithLvl: [],
            }
            if (!showEditInput) {
                tableListData.map((item) => {
                    query.lineageColumnIdsWithLvl.push({
                        level: item.polymer === 0 ? this.state.selectData.level : this.state.selectData.polymerLevel,
                        lineageColumnId: item.columnId,
                    })
                })
            }
            let res = await columnConfirmAudit(query)
            if (res.code == 200) {
                message.success('操作成功')
                this.cancel()
                this.props.refresh()
            }
        } else {
            this.cancel()
            this.props.getNewTableData(detailInfo)
        }
    }
    render() {
        const { modalVisible, detailInfo, categoryTreeData, traitList, addType, btnLoading, columnData, showEditInput, tableListData, selectData } = this.state
        const filter = (inputValue, path) => path.some((option) => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
        console.log('state', this.state)
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'traitDetailDrawer',
                    title: addType == 2 ? '详情' : '推荐特征',
                    width: 960,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!detailInfo.eigenSelectedInfo.id} loading={btnLoading} onClick={this.postData} type='primary'>
                                {addType == 2 ? '通过' : '确定'}
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div className='titleValue'>
                            <span style={{ marginRight: 8 }} className='iconfont icon-ziduan1'></span>
                            {detailInfo.columnName}
                        </div>
                        <div>
                            <span className='path' style={{ marginRight: 32 }}>
                                来源表：{detailInfo.tableName || <EmptyLabel />}
                            </span>
                            <span className='path'>系统路径：{detailInfo.path || <EmptyLabel />}</span>
                        </div>
                        <Divider />
                        <div>
                            {!showEditInput ? (
                                <div>
                                    <ModuleTitle title='系统推荐' />
                                    <div className='traitArea Grid3'>
                                        {detailInfo.eigenVoList.map((item) => {
                                            return (
                                                <div onClick={this.selectItem.bind(this, item)} className={detailInfo.eigenSelectedInfo.id == item.id ? 'traitItem traitItemSelected' : 'traitItem'}>
                                                    {detailInfo.eigenSelectedInfo.id == item.id ? <SvgIcon name='icon_tag_top' /> : null}
                                                    <div className='traitTitle'>
                                                        <span className='traitIndex'>{item.score ? (item.score * 100).toFixed(0) + '%' : ''}</span>
                                                        <span className='traitName'>{item.eigenName}</span>
                                                    </div>
                                                    <Form className='EditMiniForm Grid1' layout='inline' style={{ rowGap: '4px' }}>
                                                        {RenderUtil.renderFormItems([
                                                            {
                                                                label: '分类',
                                                                content: item.classPath,
                                                            },
                                                            {
                                                                label: '安全等级',
                                                                content: <LevelTag value={item.level} />,
                                                            },
                                                            {
                                                                label: '敏感标签',
                                                                content: item.tagName,
                                                            },
                                                        ])}
                                                    </Form>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div>
                                        以上推荐都不准确，<a onClick={this.changeAddType.bind(this, true)}>自定义编辑</a>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className='backTitle'>
                                        <a onClick={this.changeAddType.bind(this, false)}>
                                            <span className='iconfont icon-zuo'></span>系统推荐
                                        </a>
                                    </div>
                                    <Form className='EditMiniForm Grid1'>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: '分类路径',
                                                required: true,
                                                content: (
                                                    <Cascader
                                                        allowClear={false}
                                                        showSearch={{ filter }}
                                                        expandTrigger='hover'
                                                        fieldNames={{ label: 'name', value: 'id' }}
                                                        value={detailInfo.eigenSelectedInfo.classIdList}
                                                        options={categoryTreeData}
                                                        style={{ width: '100%' }}
                                                        onChange={this.changeType.bind(this, 'classIdList')}
                                                        popupClassName='searchCascader'
                                                        placeholder='请选择'
                                                    />
                                                ),
                                            },
                                            {
                                                label: '特征选择',
                                                required: true,
                                                content: (
                                                    <div>
                                                        <Select onChange={this.changeType.bind(this, 'id')} value={detailInfo.eigenSelectedInfo.id} placeholder='请选择'>
                                                            {traitList.map((item) => {
                                                                return (
                                                                    <Select.Option item={item} title={item.eigenName} key={item.id} value={item.id}>
                                                                        {item.eigenName}
                                                                    </Select.Option>
                                                                )
                                                            })}
                                                        </Select>
                                                        {detailInfo.eigenSelectedInfo.id ? (
                                                            <div style={{ marginTop: 4, color: '#606366' }}>
                                                                <span style={{ marginRight: 24 }}>
                                                                    安全等级：
                                                                    <LevelTag type='text' value={detailInfo.eigenSelectedInfo.level} />
                                                                </span>
                                                                <span>敏感标签：{detailInfo.eigenSelectedInfo.tagName || <EmptyLabel />}</span>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                ),
                                            },
                                        ])}
                                    </Form>
                                </div>
                            )}
                        </div>
                        {addType == 2 && !showEditInput ? (
                            <div>
                                <Divider style={{ margin: '24px 0' }} />
                                <ModuleTitle style={{ display: 'inline-block' }} title={<div>关联字段（{tableListData.length}）</div>} />
                                <span style={{ marginLeft: 12, color: '#5E6266' }}>通过将包括以下关联字段</span>
                                <div className='tableArea'>
                                    <Table
                                        key={`${selectData.level}_${selectData.polymerLevel}`}
                                        rowKey='id'
                                        columns={this.columns}
                                        dataSource={tableListData}
                                        pagination={false}
                                        scroll={{ y: 500 }}
                                    />
                                </div>
                            </div>
                        ) : null}
                        <PreviewModal ref={(dom) => (this.previewModal = dom)} />
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
