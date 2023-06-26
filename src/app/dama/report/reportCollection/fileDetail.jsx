import CollapseLabel from '@/component/collapseLabel/CollapseLabel'
import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Cascader, Form, Input, message, Select, Spin, Tooltip } from 'antd'
import { departments, getUserList } from 'app_api/manageApi'
import { columnList, externalEdit, externalTypes, reportDetail, reportsLevel } from 'app_api/metadataApi'
import { getTree } from 'app_api/systemManage'
import React, { Component } from 'react'
import '../index.less'
import RelateColumn from './relateColumn'

const { TextArea } = Input

export default class ReportFileDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            externalInfo: this.props.location.state,
            externalData: {},
            columnData: [],
            total: 0,
            queryInfo: {
                keyword: '',
            },
            typeFilterList: [],
            typeList: [],
            levelList: [],
            categoryId: [],
            loading: false,
            taskDetail: {},
            columnModalVisible: false,
            departmentList: [],
            userList: [],
            relateColumnIndex: 0,
            columnInfo: {},
            detailLoading: false,
        }
        this.columns = [
            {
                title: '字段中文名',
                dataIndex: 'cname',
                key: 'cname',
                ellipsis: true,
                // fixed: 'left',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '字段英文名',
                dataIndex: 'ename',
                key: 'ename',
                ellipsis: true,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '映射字段',
                dataIndex: 'relateColumnEname',
                key: 'relateColumnEname',
                ellipsis: true,
                width: 180,
                render: (text, record, index) => {
                    return (
                        <div>
                            {text ? (
                                <Tooltip placement='topLeft' title={text}>
                                    <span className='ellipsisLabel'>{text}</span>
                                </Tooltip>
                            ) : (
                                <EmptyLabel />
                            )}
                            {this.state.externalInfo.pageType == 'edit' ? <div className='iconfont icon-bianji editIcon' onClick={this.openDrawer.bind(this, index)}></div> : null}
                        </div>
                    )
                },
            },
            {
                title: '字段来源（库／表）',
                dataIndex: 'relateDatabaseEname',
                key: 'relateDatabaseEname',
                ellipsis: true,
                width: 150,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={record.relateDatabaseEname + '/' + record.relateTableEname}>
                            {record.relateDatabaseEname + '/' + record.relateTableEname}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务描述',
                dataIndex: 'description',
                key: 'description',
                ellipsis: true,
                render: (text, record, index) => {
                    if (this.state.externalInfo.pageType == 'edit') {
                        return (
                            <div>
                                <Input style={{ width: '100%' }} placeholder='请输入' value={text} onChange={this.onChangeInput.bind(this, index)} maxLength={128} />
                            </div>
                        )
                    } else {
                        return (
                            <div>
                                {text ? (
                                    <Tooltip placement='topLeft' title={text}>
                                        {text}
                                    </Tooltip>
                                ) : (
                                    <EmptyLabel />
                                )}
                            </div>
                        )
                    }
                },
            },
            {
                title: '字段类型',
                dataIndex: 'columnType',
                key: 'columnType',
                ellipsis: true,
                render: (text, record, index) => {
                    if (this.state.externalInfo.pageType == 'edit') {
                        return (
                            <div>
                                <Select style={{ width: '100%' }} onChange={this.onChangeSelect.bind(this, index)} value={text} placeholder='字段类型'>
                                    {this.state.typeList.length &&
                                        this.state.typeList.map((item) => {
                                            return (
                                                <Option key={item.id} value={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })}
                                </Select>
                            </div>
                        )
                    } else {
                        return <div>{text ? <span>{text == 1 ? '指标' : text == 2 ? '维度' : '时间'}</span> : <EmptyLabel />}</div>
                    }
                },
            },
        ]
    }
    componentWillMount = async () => {
        await this.getExternalDetail()
        this.getTypes()
        this.getLevel()
        this.getTree()
        this.getUserData()
        this.getDepartment()
    }
    getExternalDetail = async () => {
        let { externalInfo, categoryId } = this.state
        this.setState({ detailLoading: true })
        let res = await reportDetail({ reportsId: externalInfo.id })
        this.setState({ detailLoading: false })
        if (res.data.parentCategoryId !== undefined) {
            categoryId = [res.data.parentCategoryId, res.data.categoryId]
        } else {
            categoryId = res.data.categoryId !== undefined ? [res.data.categoryId] : []
        }
        res.data.departmentId = res.data.departmentId ? parseInt(res.data.departmentId) : res.data.departmentId
        res.data.businessManagerId = res.data.businessManagerId ? parseInt(res.data.businessManagerId) : res.data.businessManagerId
        res.data.techniqueManagerId = res.data.techniqueManagerId ? parseInt(res.data.techniqueManagerId) : res.data.techniqueManagerId
        if (res.code == 200) {
            await this.setState({
                externalData: res.data,
                categoryId,
            })
            if (externalInfo.pageType == 'look') {
                this.collapseLabel && this.collapseLabel.getVisibleBtn()
                this.categoryPath && this.categoryPath.getVisibleBtn()
                this.fileName && this.fileName.getVisibleBtn()
            }
        }
    }
    getDepartment = async () => {
        let res = await departments({ page_size: 100000 })
        if (res.code == 200) {
            this.setState({
                departmentList: res.data,
            })
        }
    }
    getUserData = async () => {
        let res = await getUserList({ page: 1, page_size: 99999, brief: false })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    getLevel = async () => {
        let res = await reportsLevel({ isFilter: false })
        if (res.code == 200) {
            this.setState({
                levelList: res.data,
            })
        }
    }
    getTypes = async () => {
        let { externalInfo } = this.state
        let res = await externalTypes({ isFilter: true, reportsId: externalInfo.id })
        if (res.code == 200) {
            this.setState({
                typeFilterList: res.data,
            })
        }
        let resp = await externalTypes({ isFilter: false, reportsId: externalInfo.id })
        if (resp.code == 200) {
            resp.data.map((item) => {
                item.id = parseInt(item.id)
            })
            this.setState({
                typeList: resp.data,
            })
        }
    }
    onChangeInput = (index, e) => {
        let { columnData } = this.state
        columnData[index].description = e.target.value
        this.setState({
            columnData,
        })
    }
    onChangeSelect = (index, e) => {
        let { columnData } = this.state
        columnData[index].columnType = e
        this.setState({
            columnData,
        })
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo,
        })
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    getTableList = async (params = {}) => {
        console.log(params)
        let { queryInfo, externalInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 5,
            reportsIdList: externalInfo.id,
            needAll: externalInfo.pageType == 'look' ? false : true,
            ...queryInfo,
        }
        let res = await columnList(query)
        if (res.code == 200) {
            this.setState({
                total: res.total,
                columnData: res.data,
            })
            return {
                total: externalInfo.pageType == 'look' ? res.total : 0,
                dataSource: res.data,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    openDrawer = async (index) => {
        let { externalData } = this.state
        let data = {
            datasourceId: externalData.datasourceId,
            datasourceName: externalData.datasourceEname,
        }
        await this.setState({
            columnModalVisible: true,
            relateColumnIndex: index,
            columnInfo: data,
        })
        this.relateColumn && this.relateColumn.getRuleData(data)
    }
    cancel = () => {
        this.setState({
            columnModalVisible: false,
        })
    }
    getTree = async () => {
        let res = await getTree({ code: 'ZT005' })
        if (res.code == 200) {
            res.data.children.map((item) => {
                if (!item.children.length) {
                    item.disabled = true
                }
            })
            this.setState({
                categoryTreeData: this.deleteSubList(res.data.children),
            })
        }
    }
    deleteSubList = (data) => {
        data.map((item) => {
            if (!item.children.length) {
                delete item.children
            } else {
                this.deleteSubList(item.children)
            }
        })
        return data
    }
    openEditPage = async (value) => {
        let { externalInfo } = this.state
        externalInfo.pageType = value
        await this.setState({
            externalInfo,
        })
        this.search()
    }
    cancelEdit = () => {
        this.props.addTab('报表列表')
    }
    changeDetailInput = (name, e) => {
        let { externalData } = this.state
        externalData[name] = e.target.value
        this.setState({
            externalData,
        })
    }
    changeDetailSelect = (name, e) => {
        let { externalData } = this.state
        externalData[name] = e
        this.setState({
            externalData,
        })
    }
    changeType = async (value) => {
        console.log(value)
        let { externalData } = this.state
        externalData.categoryId = value.length ? value[value.length - 1] : ''
        externalData.parentCategoryId = value.length ? value[0] : ''
        this.setState({
            externalData,
            categoryId: value,
        })
    }
    getNewColumnInfo = (data) => {
        this.setState({
            columnInfo: data,
        })
    }
    postRelateColumn = () => {
        let { columnInfo, relateColumnIndex, columnData } = this.state
        if (!columnInfo.columnId) {
            message.info('请选择字段')
            return
        }
        columnData[relateColumnIndex].relateDatabaseEname = columnInfo.databaseName
        columnData[relateColumnIndex].relateDatabaseId = columnInfo.databaseId
        columnData[relateColumnIndex].relateTableEname = columnInfo.tableName
        columnData[relateColumnIndex].relateTableId = columnInfo.tableId
        columnData[relateColumnIndex].relateColumnId = columnInfo.columnId
        columnData[relateColumnIndex].relateColumnEname = columnInfo.columnName
        this.setState({
            columnData,
            columnModalVisible: false,
        })
    }
    postData = async () => {
        let { externalData, columnData } = this.state
        let query = {
            ...externalData,
            columnList: columnData,
        }
        if (!query.levelCode || query.cycle == undefined || !query.categoryId || !query.departmentId) {
            message.info('请填写必填项')
            return
        }
        let res = await externalEdit(query)
        if (res.code == 200) {
            message.success('保存成功')
            this.props.addTab('报表列表')
        }
    }
    renderDesc = (value, name) => {
        return <CollapseLabel ref={(dom) => (this[name] = dom)} value={value} />
    }
    render() {
        const {
            queryInfo,
            typeFilterList,
            total,
            loading,
            columnData,
            externalData,
            externalInfo,
            columnModalVisible,
            levelList,
            categoryId,
            categoryTreeData,
            departmentList,
            userList,
            detailLoading,
        } = this.state
        let { pageType } = externalInfo
        let { fileName, name, categoryPath, levelName, cycle, datasourceEname, department, businessManager, techniqueManager, updateTime, description } = externalData
        let cycleDesc = cycle == '0' ? '日' : cycle == '1' ? '月' : cycle == 2 ? '周' : cycle == 3 ? '季度' : ''
        return (
            <React.Fragment>
                <div className='reportCollectDetail'>
                    <TableLayout
                        title={name}
                        renderHeaderExtra={() => {
                            if (pageType == 'look') {
                                return (
                                    <Button type='primary' onClick={this.openEditPage.bind(this, 'edit')}>
                                        编辑
                                    </Button>
                                )
                            }
                        }}
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <Spin spinning={detailLoading}>
                                        <Module title='基本信息'>
                                            {pageType == 'look' ? (
                                                <div className='MiniForm Grid4' style={{ overflowY: 'hidden' }}>
                                                    {RenderUtil.renderFormItems([
                                                        {
                                                            label: '文件名称',
                                                            content: this.renderDesc(fileName, 'fileName'),
                                                        },
                                                        {
                                                            label: '报表分类',
                                                            content: this.renderDesc(categoryPath, 'categoryPath'),
                                                        },
                                                        {
                                                            label: '报表等级',
                                                            content: levelName,
                                                        },
                                                        {
                                                            label: '报表周期',
                                                            content: cycleDesc,
                                                        },
                                                        {
                                                            label: '数据源',
                                                            content: datasourceEname,
                                                        },
                                                        {
                                                            label: '归属部门',
                                                            content: department,
                                                        },
                                                        {
                                                            label: '业务负责人',
                                                            content: businessManager,
                                                        },
                                                        {
                                                            label: '技术负责人',
                                                            content: techniqueManager,
                                                        },
                                                        {
                                                            label: '更新时间',
                                                            content: updateTime,
                                                        },
                                                        {
                                                            label: '业务描述',
                                                            content: this.renderDesc(description, 'collapseLabel'),
                                                        },
                                                    ])}
                                                </div>
                                            ) : (
                                                <div className='EditMiniForm Grid3' style={{ overflowY: 'hidden' }}>
                                                    {RenderUtil.renderFormItems([
                                                        {
                                                            label: '文件名称',
                                                            required: true,
                                                            content: <Input disabled value={fileName} onChange={this.changeDetailInput.bind(this, 'fileName')} placeholder='请输入' />,
                                                        },
                                                        {
                                                            label: '报表等级',
                                                            required: true,
                                                            content: (
                                                                <Select
                                                                    style={{ width: '100%' }}
                                                                    onChange={this.changeDetailSelect.bind(this, 'levelCode')}
                                                                    value={externalData.levelCode}
                                                                    placeholder='请选择'
                                                                >
                                                                    {levelList.map((item) => {
                                                                        return (
                                                                            <Option key={item.id} value={item.id}>
                                                                                {item.name}
                                                                            </Option>
                                                                        )
                                                                    })}
                                                                </Select>
                                                            ),
                                                        },
                                                        {
                                                            label: '报表周期',
                                                            required: true,
                                                            content: (
                                                                <Select
                                                                    style={{ width: '100%' }}
                                                                    onChange={this.changeDetailSelect.bind(this, 'cycle')}
                                                                    value={externalData.cycle}
                                                                    placeholder='请选择'
                                                                >
                                                                    <Option key={0} value={0}>
                                                                        日
                                                                    </Option>
                                                                    <Option key={1} value={1}>
                                                                        月
                                                                    </Option>
                                                                    <Option key={2} value={2}>
                                                                        周
                                                                    </Option>
                                                                    <Option key={3} value={3}>
                                                                        季度
                                                                    </Option>
                                                                </Select>
                                                            ),
                                                        },
                                                        {
                                                            label: '报表分类',
                                                            required: true,
                                                            content: (
                                                                <Cascader
                                                                    allowClear={false}
                                                                    expandTrigger='hover'
                                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                                    value={categoryId}
                                                                    options={categoryTreeData}
                                                                    style={{ width: '100%' }}
                                                                    onChange={this.changeType}
                                                                    displayRender={(e) => e.join('-')}
                                                                    // displayRender={(label) => label[label.length - 1]}
                                                                    popupClassName='searchCascader'
                                                                    placeholder='报表分类'
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            label: '数据源',
                                                            required: true,
                                                            content: <Select disabled style={{ width: '100%' }} value={externalData.datasourceEname} placeholder='请选择'></Select>,
                                                        },
                                                        {
                                                            label: '归属部门',
                                                            required: true,
                                                            content: (
                                                                <Select
                                                                    style={{ width: '100%' }}
                                                                    onChange={this.changeDetailSelect.bind(this, 'departmentId')}
                                                                    value={externalData.departmentId}
                                                                    placeholder='请选择'
                                                                >
                                                                    {departmentList.map((item) => {
                                                                        return (
                                                                            <Option title={item.departName} key={item.id} value={item.id}>
                                                                                {item.departName}
                                                                            </Option>
                                                                        )
                                                                    })}
                                                                </Select>
                                                            ),
                                                        },
                                                        {
                                                            label: '业务负责人',
                                                            content: (
                                                                <Select
                                                                    style={{ width: '100%' }}
                                                                    onChange={this.changeDetailSelect.bind(this, 'businessManagerId')}
                                                                    value={externalData.businessManagerId}
                                                                    placeholder='请选择'
                                                                >
                                                                    {userList.map((item) => {
                                                                        return (
                                                                            <Option title={item.realname} key={item.id} value={item.id}>
                                                                                {item.realname}
                                                                            </Option>
                                                                        )
                                                                    })}
                                                                </Select>
                                                            ),
                                                        },
                                                        {
                                                            label: '技术负责人',
                                                            content: (
                                                                <Select
                                                                    style={{ width: '100%' }}
                                                                    onChange={this.changeDetailSelect.bind(this, 'techniqueManagerId')}
                                                                    value={externalData.techniqueManagerId}
                                                                    placeholder='请选择'
                                                                >
                                                                    {userList.map((item) => {
                                                                        return (
                                                                            <Option title={item.realname} key={item.id} value={item.id}>
                                                                                {item.realname}
                                                                            </Option>
                                                                        )
                                                                    })}
                                                                </Select>
                                                            ),
                                                        },
                                                        {
                                                            label: '业务描述',
                                                            content: (
                                                                <TextArea
                                                                    maxLength={128}
                                                                    value={externalData.description}
                                                                    placeholder='请输入'
                                                                    rows={2}
                                                                    onChange={this.changeDetailInput.bind(this, 'description')}
                                                                />
                                                            ),
                                                        },
                                                    ])}
                                                </div>
                                            )}
                                        </Module>
                                    </Spin>
                                </React.Fragment>
                            )
                        }}
                    />
                    <RichTableLayout
                        renderDetail={() => {
                            return <ModuleTitle style={{ marginBottom: 15 }} title={'报表字段（' + total + '）'} />
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                            dataSource: columnData,
                            pagination: false,
                        }}
                        showFooterControl={pageType == 'look' ? undefined : true}
                        renderFooter={() => {
                            // if (pageType == 'edit') {
                            return (
                                <React.Fragment>
                                    <Button loading={loading} type='primary' onClick={this.postData}>
                                        保存
                                    </Button>
                                    <Button onClick={this.cancelEdit}>取消</Button>
                                </React.Fragment>
                            )
                            // }
                        }}
                        editColumnProps={{
                            hidden: true,
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear style={{ width: 280 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入字段中文名' />
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'columnType')} value={queryInfo.columnType} placeholder='字段类型' style={{ width: 160 }}>
                                        {typeFilterList.map((item) => {
                                            return (
                                                <Option key={item.id} value={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Button onClick={this.reset}>重置</Button>
                                </React.Fragment>
                            )
                        }}
                        requestListFunction={(page, pageSize, filter, sorter) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                        }}
                    />
                </div>
                <DrawerLayout
                    drawerProps={{
                        className: 'logDrawer',
                        title: '修改映射字段',
                        width: 480,
                        visible: columnModalVisible,
                        onClose: this.cancel,
                        maskClosable: false,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button type='primary' onClick={this.postRelateColumn}>
                                    保存
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                >
                    {columnModalVisible && (
                        <React.Fragment>
                            <Form className='EditMiniForm Grid1 reportForm'>
                                <RelateColumn
                                    ref={(dom) => {
                                        this.relateColumn = dom
                                    }}
                                    getNewcolumnInfo={this.getNewColumnInfo}
                                />
                            </Form>
                        </React.Fragment>
                    )}
                </DrawerLayout>
            </React.Fragment>
        )
    }
}
