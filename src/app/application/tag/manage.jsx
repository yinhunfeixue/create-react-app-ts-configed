import SliderLayout from '@/component/layout/SliderLayout'
import TableLayout from '@/component/layout/TableLayout'
import PermissionWrap from '@/component/PermissionWrap'
import { SearchTree } from '@/components'
import { defaultTitleRender } from '@/components/trees/SearchTree'
import TreeControl from '@/utils/TreeControl'
import { DownOutlined, ExclamationCircleFilled, PlusOutlined, UpOutlined } from '@ant-design/icons'
import { Button, Input, Layout, message, Modal, Select, Table, Tabs, Tag, TreeSelect } from 'antd'
import { getMetadataTree } from 'app_api/metadataApi'
import { allTagValue, bizObjectRecord, getTagTypeAppliableScene, untaggle } from 'app_api/tagManageApi'
import { Tooltip } from 'lz_antd'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import _ from 'underscore'
import AddTag from './addTag'
import './manage.less'

const { Header, Footer, Sider, Content } = Layout

const { TreeNode } = TreeSelect
const { Option } = Select
const confirm = Modal.confirm
const { TabPane } = Tabs

@observer
export default class TagManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchValue: '',
            treeData: [],
            loading: false,
            selectedRowKeys: [],
            addModalVisible: false,
            modalType: '',
            isSelectAll: false, // 勾选当页或勾选所有
            excludedTableIds: [], // 排除选项
            tableData: [],
            selectedDataIds: [], // 选中IDs
            isSingle: false, // 是否单选
            total: 0,
            paginationDisplay: 'none',
            selectedRows: [],
            tagList: [], // 筛选框标签
            hasTagList: [], // 单条数据添加标签时，本身已有的标签
            modalTitle: '',
            queryInfo: {
                page: 1,
                pageSize: 20,
                respField: ['TAG'],
                containedTagValueIds: [],
                queryBizDomain: 'MAIN',
                scope: 'SINGLE',
                searchText: '',
                objectId: '',
                objectType: '',
                resultType: '',
                resultTypeName: '',
            },
            typeName: '',
            sceneOption: [],
            isSearch: false,
            searchText: '',
        }
        this.pageSizeOptions = ['20', '30', '40', '50']
        this.columns = []

        this.treeControl = new TreeControl()
    }

    componentDidMount = async () => {
        await this.getAppliableScene()
        this.getData()
    }
    getAppliableScene = async () => {
        const { queryInfo } = this.state
        let res = await getTagTypeAppliableScene()
        if (res.code == 200) {
            if (res.data.length) {
                queryInfo.resultType = res.data[0].contextString
                queryInfo.resultTypeName = res.data[0].showName
                this.getColumns(queryInfo.resultType)
            }
            console.log('getAppliableScene', res)
            this.setState({ sceneOption: res.data, queryInfo })
        }
    }
    getTagSearchlist = async () => {
        let { tagList, queryInfo } = this.state
        let params = {
            bizObjectType: queryInfo.resultType,
        }
        let res = await allTagValue(params)
        if (res.code == 200) {
            this.setState({ tagList: res.data })
        }
    }

    // 给数据加上序号
    filteredProjects = (data) => {
        const { page, pageSize } = this.state.queryInfo
        let orderNumber = ((page || 1) - 1) * (pageSize || 10)
        let newData = []
        _.map(data, (node) => {
            node.key = ++orderNumber
            newData.push(node)
        })
        this.setState({
            tableData: newData,
        })
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        this.setState({ selectedRowKeys })
    }

    closeTag = async (event, tableId, tagId, index) => {
        event.preventDefault()
        Modal.confirm({
            title: '警告',
            content: '此操作不可恢复，请确认是否继续？',
            okText: '确认',
            cancelText: '取消',
            icon: <ExclamationCircleFilled />,
            onOk: async () => {
                let { tableData, queryInfo } = this.state
                let params = {
                    isSelectAll: false,
                    objectIds: [tableId],
                    tagValueIdList: [tagId],
                    resultType: queryInfo.resultType,
                }
                params.queryParam = this.state.queryInfo
                console.log(params)
                let res = await untaggle(params)
                if (res.code == 200) {
                    message.success('操作成功')
                    await this.getTagList()
                    const { tagList } = this.state
                    let hasTag = false
                    tagList.map((item) => {
                        item.tagValueList.map((item1) => {
                            if (item1.tagValueId == tagId) {
                                hasTag = true
                            }
                        })
                    })
                    if (!hasTag && queryInfo.containedTagValueIds.includes(tagId)) {
                        let index = queryInfo.containedTagValueIds.indexOf(tagId)
                        queryInfo.containedTagValueIds.splice(index, 1)
                    }

                    this.onTagSearchChange(queryInfo.containedTagValueIds)
                }
            },
        })
    }

    openAddTagModal = async (ids, type, tagList, name) => {
        if (this.state.addModalVisible) {
            this.setState({ addModalVisible: false })
            return
        }
        await this.setState({
            modalType: type == 'addSingle' ? 'add' : type,
            selectedDataIds: ids,
            isSingle: type == 'addSingle' ? true : false,
            hasTagList: tagList ? tagList : [],
            modalTitle: type == 'addSingle' ? `为${name}添加标签` : '',
        })

        let { isSingle, total, excludedTableIds, selectedDataIds, modalType, isSelectAll } = this.state
        if (!this.state.queryInfo.objectId || this.state.queryInfo.objectId == '10c9bff4311a48a5964831a5a497bccb') {
            let selectDataLength = 0
            isSelectAll = isSingle ? false : isSelectAll
            let tableIds = isSelectAll ? null : selectedDataIds
            selectDataLength = isSelectAll ? total - excludedTableIds.length : tableIds.length
            if (isSelectAll && selectDataLength == total) {
                let confirmTitle = (
                    <span style={{ fontSize: '14px', fontWeight: '400' }}>
                        将为<span style={{ color: '#F23F30' }}>全量资源（{selectDataLength}）项</span>
                        {modalType == 'add' ? '添加' : '删除'}标签，请谨慎操作
                    </span>
                )
                let that = this
                confirm({
                    title: confirmTitle,
                    okText: '继续操作',
                    cancelText: '返回重选',
                    onOk() {
                        console.log(ids)
                        that.setState({
                            addModalVisible: true,
                        })
                    },
                })
            } else {
                this.setState({
                    addModalVisible: true,
                })
            }
        } else {
            this.setState({
                addModalVisible: true,
            })
        }
    }

    changeModalType = (value) => {
        this.setState({ modalType: value })
        console.log(value)
    }

    changeTypeSelect = (value) => {
        let { selectedRowKeys, tableData } = this.state
        selectedRowKeys = []
        tableData.map((item) => {
            selectedRowKeys.push(item.targetId)
        })
        this.setState({
            isSelectAll: value,
            selectedRowKeys,
            excludedTableIds: [],
        })
    }

    // 树相关
    getNode = async (id, type, name) => {
        if (id.length) {
            this.state.queryInfo.objectId = id[0]
            this.state.queryInfo.objectType = type
            this.state.queryInfo.searchText = ''
            this.state.queryInfo.containedTagValueIds = []
            this.state.queryInfo.page = 1
            await this.setState({
                queryInfo: this.state.queryInfo,
                typeName: name,
            })
            this.clearSelectedRows()
            this.getTagList()
        }
    }
    getData = async () => {
        let res = await getMetadataTree({ code: 'XT001' })
        if (res.code == 200) {
            res.data.level = 0
            const { data } = res
            this.setState({ treeData: [data] })
            if (data) {
                this.getNode([data.id], data.type, data.name)
            }
            // this.getTagSearchlist()
            this.getTagList()
        }
    }
    // 重置
    resetSearch = async () => {
        let { queryInfo, isSearch } = this.state
        isSearch = false
        queryInfo.searchText = ''
        queryInfo.containedTagValueIds = []
        queryInfo.page = 1
        await this.setState({
            queryInfo,
            isSearch,
            searchValue: '',
        })
        this.getTagList()
    }

    getTableList = async () => {
        this.setState({
            tableData: [],
            loading: true,
        })
        this.state.queryInfo.queryBizDomain = 'MAIN'
        let params = {
            ...this.state.queryInfo,
        }
        let res
        console.log(params, 'params')
        if (!this.state.queryInfo.objectId || this.state.queryInfo.objectId == '10c9bff4311a48a5964831a5a497bccb') {
            delete params.respField
            delete params.objectId
            delete params.objectType
            res = await bizObjectRecord(params)
        } else {
            res = await bizObjectRecord(params)
        }
        if (res.code == 200) {
            res.data.map((item) => {
                switch (this.state.queryInfo.resultType) {
                    case 'md_datasource':
                        item.objectName = item.datasourceName
                        break
                    case 'md_database':
                        item.objectName = item.databaseName
                        break
                    case 'md_table':
                        item.objectName = item.tableName
                        break
                    case 'md_model':
                    case 'md_column':
                        item.objectName = item.columnName
                        break
                }
            })
            this.setState(
                {
                    tableData: res.data,
                    total: res.total,
                },
                () => {
                    this.filteredProjects(res.data)
                    this.selectAll()
                    this.setState(
                        {
                            loading: false,
                        },
                        () => {
                            // this.showWrap()
                        }
                    )
                }
            )
        } else {
            this.setState({
                loading: false,
            })
        }
    }

    getTagList = async (type) => {
        this.state.queryInfo.queryBizDomain = 'TAG_ENUM'
        let params = {
            ...this.state.queryInfo,
        }
        delete params.containedTagValueIds
        delete params.searchText
        let res
        if (!this.state.queryInfo.objectId || this.state.queryInfo.objectId == '10c9bff4311a48a5964831a5a497bccb') {
            res = await bizObjectRecord(params)
        } else {
            res = await bizObjectRecord(params)
        }
        if (res.code == 200) {
            if (res.data.length) {
                this.setState({
                    tagList: res.data[0].tagTypeInfoList,
                })
            }
        }
        if (type !== 'refresh') {
            this.getTableList()
        }
    }

    changeInput = async (e) => {
        console.log(e.target.value)
        let { queryInfo } = this.state
        queryInfo.searchText = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    onTagSearchChange = async (data) => {
        console.log(data)
        let { queryInfo } = this.state
        queryInfo.containedTagValueIds = [...data]
        await this.setState({
            queryInfo,
        })
        this.search()
    }

    // 展示多少页
    showTotal = (total) => {
        const totalPageNum = Math.ceil(total / this.state.queryInfo.pageSize)
        return `共${totalPageNum}页，${total}条数据`
    }

    // 页码改变
    changePagination = async (page) => {
        const { queryInfo } = this.state
        queryInfo.page = page
        await this.setState({ queryInfo })
        this.getTableList()
        // this.selectAll()
    }
    // 一页显示尺寸改变
    onShowSizeChange = async (current, page_size) => {
        const { queryInfo } = this.state
        queryInfo.pageSize = page_size
        await this.setState({ queryInfo })
        this.getTableList()
        // this.selectAll()
    }

    openMoreTag = (index) => {
        const { tableData } = this.state
        tableData[index].showMoreTag = !tableData[index].showMoreTag
        this.setState({
            tableData,
        })
    }

    expandedRowRender = (record, index) => {
        return (
            <PermissionWrap funcCode='/md/tags/mapping/expandEdit'>
                <div className='HControlGroup' style={{ paddingLeft: 28, maxHeight: record.showMoreTag ? '27px' : '84px', overflowY: record.showMoreTag ? 'hidden' : 'auto' }}>
                    {record.tagValueInfoList.length
                        ? record.tagValueInfoList.map((item) => {
                              return (
                                  <Tag
                                      closable
                                      className={item.tagTypeName == '入湖' ? 'closeTag' : 'closeTag geekBlueTag'}
                                      onClose={(event) => this.closeTag(event, record.targetId, item.tagValueId, index)}
                                  >
                                      <Tooltip title={item.tagValueName}>{item.tagValueName}</Tooltip>
                                  </Tag>
                              )
                          })
                        : null}
                    {
                        <Tag onClick={this.openAddTagModal.bind(this, [record.targetId], 'addSingle', record.tagValueInfoList, record.objectName)}>
                            <PlusOutlined />
                        </Tag>
                    }
                    {record.showMore ? (
                        <span className='showMore'>
                            {record.showMoreTag ? (
                                <span onClick={this.openMoreTag.bind(this, index)}>
                                    更多
                                    <DownOutlined />
                                </span>
                            ) : (
                                <span onClick={this.openMoreTag.bind(this, index)}>
                                    收起
                                    <UpOutlined />
                                </span>
                            )}
                        </span>
                    ) : null}
                </div>
            </PermissionWrap>
        )
    }

    clearSelectedRows = () => {
        this.setState({
            selectedRowKeys: [],
            selectedDataIds: [],
            excludedTableIds: [],
            isSelectAll: false,
        })
    }
    onSelect = (record, selected, selectedRows) => {
        console.log(record, 'onSelect')
        console.log(selected)
        console.log(selectedRows)
        const { excludedTableIds, isSelectAll } = this.state
        if (isSelectAll) {
            if (!selected) {
                excludedTableIds.push(record.targetId)
            } else {
                if (excludedTableIds.includes(record.targetId)) {
                    excludedTableIds.splice(excludedTableIds.indexOf(record.targetId), 1)
                }
            }
        }
    }
    // 全选当页
    selectAll = () => {
        let { tableData, selectedRowKeys, isSelectAll, excludedTableIds } = this.state
        if (isSelectAll) {
            selectedRowKeys = []
            tableData.map((item) => {
                if (!excludedTableIds.includes(item.targetId)) {
                    selectedRowKeys.push(item.targetId)
                }
            })
        }
        this.setState({
            selectedRowKeys,
        })
        console.log(selectedRowKeys, 'selectAlls')
    }
    // 取消全选
    onSelectAllData = (selected) => {
        if (!selected && this.state.isSelectAll) {
            this.setState({ isSelectAll: false })
        }
    }
    //  显示展开或收起
    showWrap = () => {
        let ele = document.querySelector('.tagManageTable')
        let tableWidth = parseInt(window.getComputedStyle(ele).width) - 70
        let tagList = document.querySelectorAll('.tagContent')
        const { tableData } = this.state
        tableData.map((item, index) => {
            item.showMore = false
            item.showMoreTag = true
            if (item.tagValueInfoList.length) {
                if (parseInt(window.getComputedStyle(tagList[index]).width) > tableWidth) {
                    item.showMore = true
                }
            }
        })
        console.log(tableWidth)
        this.setState({ tableData })
    }
    search = async () => {
        let { queryInfo, isSearch } = this.state
        isSearch = true
        queryInfo.page = 1
        await this.setState({
            queryInfo,
            isSearch,
            searchText: queryInfo.searchText,
        })
        this.getTableList()
    }
    onChangeTab = async (e) => {
        let { sceneOption, queryInfo, isSearch } = this.state
        sceneOption.map((item) => {
            if (item.contextString == e) {
                queryInfo.resultTypeName = item.showName
            }
        })
        queryInfo.searchText = ''
        queryInfo.containedTagValueIds = []
        isSearch = false
        queryInfo.resultType = e
        await this.setState({
            queryInfo,
            isSearch,
            searchValue: '',
        })
        this.getColumns(e)
        this.clearSelectedRows()
        this.getTagList()
    }
    getColumns = (value) => {
        if (value == 'md_datasource') {
            this.columns = [
                {
                    dataIndex: 'datasourceName',
                    key: 'datasourceName',
                    title: '源英文名',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'datasourceStandardName',
                    key: 'datasourceStandardName',
                    title: '源中文名',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                // {
                //     dataIndex: 'action',
                //     key: 'action',
                //     title: '操作',
                //     width: 68,
                //     render: (text, record, index) => {
                //         return (
                //             <a authId='tag:add' onClick={this.openAddTagModal.bind(this, [record.targetId], 'addSingle', record.tagValueInfoList, record.objectName)}>
                //                 添加
                //             </a>
                //         )
                //     },
                // },
            ]
        } else if (value == 'md_database') {
            this.columns = [
                {
                    dataIndex: 'databaseName',
                    key: 'databaseName',
                    title: '库英文名',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'databaseStandardName',
                    key: 'databaseStandardName',
                    title: '库中文名',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'datasourceName',
                    key: 'datasourceName',
                    title: '源英文名',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'datasourceStandardName',
                    key: 'datasourceStandardName',
                    title: '源中文名',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
            ]
        } else if (value == 'md_table') {
            this.columns = [
                {
                    dataIndex: 'tableName',
                    key: 'tableName',
                    title: '表英文名',
                    width: '20%',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'tableStandardName',
                    key: 'tableStandardName',
                    title: '表中文名',
                    width: '18%',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'databaseName',
                    key: 'databaseName',
                    title: '库英文名',
                    width: '16%',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'databaseStandardName',
                    key: 'databaseStandardName',
                    title: '库中文名',
                    width: '16%',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'datasourceName',
                    key: 'datasourceName',
                    title: '源英文名',
                    width: '16%',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'datasourceStandardName',
                    key: 'datasourceStandardName',
                    title: '源中文名',
                    width: '14%',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                // {
                //     dataIndex: 'action',
                //     key: 'action',
                //     title: '操作',
                //     width: 68,
                //     render: (text, record, index) => {
                //         return (
                //             <Tooltip authId='tag:add' title='添加标签'>
                //                 <Icon className='editIcon' onClick={this.openAddTagModal.bind(this, [record.targetId], 'addSingle', record.tagValueInfoList, record.objectName)} type='plus' />
                //             </Tooltip>
                //         )
                //     },
                // },
            ]
        } else {
            this.columns = [
                {
                    dataIndex: 'columnName',
                    key: 'columnName',
                    title: '字段英文名',
                    width: '16%',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'columnStandardName',
                    key: 'columnStandardName',
                    title: '字段中文名',
                    width: '16%',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'tableName',
                    key: 'tableName',
                    title: '表英文名',
                    width: '20%',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'tableStandardName',
                    key: 'tableStandardName',
                    title: '表中文名',
                    width: '16%',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'databaseName',
                    key: 'databaseName',
                    title: '库英文名',
                    width: '16%',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                {
                    dataIndex: 'datasourceName',
                    key: 'datasourceName',
                    title: '源英文名',
                    width: '16%',
                    render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                },
                // {
                //     dataIndex: 'action',
                //     key: 'action',
                //     title: '操作',
                //     width: 68,
                //     render: (text, record, index) => {
                //         return (
                //             <Tooltip authId='tag:add' title='添加标签'>
                //                 <Icon className='editIcon' onClick={this.openAddTagModal.bind(this, [record.targetId], 'addSingle', record.tagValueInfoList, record.objectName)} type='plus' />
                //             </Tooltip>
                //         )
                //     },
                // },
            ]
        }
    }
    changeSearchValue = (value) => {
        this.setState({ searchValue: value })
    }

    renderPath() {
        const { queryInfo, treeData } = this.state
        if (!queryInfo) {
            return null
        }
        const id = queryInfo.objectId

        const chain = this.treeControl.searchChain(treeData, (node) => {
            return node.id === id
        })

        if (!chain) {
            return null
        }

        const text = `当前位置：
        ${chain
            .map((item) => {
                return item.name
            })
            .join(' / ')}`

        return (
            <Tooltip title={text}>
                <div style={{ color: '#606366', fontWeight: 'normal' }}>{text}</div>
            </Tooltip>
        )
    }

    render() {
        let {
            selectedRowKeys,
            addModalVisible,
            modalType,
            isSelectAll,
            queryInfo,
            tagList,
            total,
            paginationDisplay,
            tableData,
            excludedTableIds,
            selectedDataIds,
            isSingle,
            loading,
            treeData,
            hasTagList,
            modalTitle,
            typeName,
            sceneOption,
            isSearch,
            searchText,
            searchValue,
        } = this.state
        const rowSelection = {
            columnWidth: 28,
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: this.onSelect,
            onSelectAll: this.onSelectAllData,
            type: 'checkbox',
        }
        paginationDisplay = total > queryInfo.pageSize ? true : false

        let params = {
            isSelectAll: isSingle ? false : isSelectAll,
            excludedTableIds,
            allSelectedObjectId: queryInfo.objectId,
            allSelectedObjectDomain: queryInfo.objectType,
        }
        params.objectIds = params.isSelectAll ? null : selectedDataIds

        let selectDataLength = 0
        selectDataLength = params.isSelectAll ? total - params.excludedTableIds.length : params.objectIds.length
        let typeTitle = queryInfo.resultTypeName

        modalTitle = isSingle ? modalTitle : `为多个（${selectDataLength}个）${typeTitle}添加标签`

        console.log('tree', treeData)
        return (
            <SliderLayout
                style={{
                    height: '100%',
                }}
                renderSliderHeader={() => {
                    return '数据资源目录'
                }}
                sliderBodyStyle={{ padding: 0 }}
                renderSliderBody={() => {
                    if (!treeData || !treeData.length) {
                        return
                    }
                    return (
                        <SearchTree
                            treeTitleRender={(node, searchKey) => {
                                return defaultTitleRender(
                                    node,
                                    (data) => {
                                        return {
                                            extra: data.sourceCount.toString(),
                                            title: data.name,
                                        }
                                    },
                                    searchKey
                                )
                            }}
                            treeProps={{
                                treeData,
                                fieldNames: { key: 'id', title: 'name' },
                                defaultExpandedKeys: [treeData[0].id],
                                defaultSelectedKeys: [treeData[0].id],
                                onSelect: (keys, info) => {
                                    const node = info.node
                                    this.getNode(keys, info.node.type, info.node.name)
                                },
                            }}
                            inputProps={{
                                placeholder: '分类、系统搜索',
                            }}
                        />
                    )
                }}
                renderContentHeaderExtra={() => {
                    return this.renderPath()
                }}
                renderContentHeader={() => {
                    return (
                        <Tabs style={{ marginBottom: -21, width: '100%' }} animated={false} onChange={this.onChangeTab} activeKey={queryInfo.resultType}>
                            {sceneOption.map((item) => {
                                return <TabPane tab={item.showName} key={item.contextString}></TabPane>
                            })}
                        </Tabs>
                    )
                }}
                renderContentBody={() => {
                    return (
                        <React.Fragment>
                            <div className='HControlGroup' style={{ marginBottom: 16 }}>
                                <Input.Search
                                    value={queryInfo.searchText}
                                    onChange={this.changeInput}
                                    onSearch={this.search}
                                    style={{ width: 280 }}
                                    placeholder={`请输入${queryInfo.resultTypeName || ''}中/英文名`}
                                    allowClear
                                />
                                <TreeSelect
                                    showSearch
                                    value={queryInfo.containedTagValueIds}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    allowClear
                                    multiple
                                    treeDefaultExpandAll
                                    treeNodeFilterProp='title'
                                    onChange={this.onTagSearchChange}
                                    searchValue={searchValue}
                                    onSearch={this.changeSearchValue}
                                    placeholder='请选择标签'
                                >
                                    {tagList.map((item) => {
                                        return (
                                            <TreeNode selectable={false} value={item.tagTypeId} title={item.tagTypeName} key={item.tagTypeId}>
                                                {item.tagValueList
                                                    ? item.tagValueList.map((tag) => {
                                                          return <TreeNode value={tag.tagValueId} title={tag.tagValueName} key={tag.tagValueId} />
                                                      })
                                                    : null}
                                            </TreeNode>
                                        )
                                    })}
                                </TreeSelect>

                                <Button onClick={this.resetSearch}>重置</Button>
                            </div>
                            {isSearch && searchText ? (
                                <div className='TagSearchTip'>
                                    为您找到包含
                                    <span style={{ color: '#F23F30' }}>{searchText}</span>
                                    <span style={{ display: queryInfo.resultType == 'md_table' ? 'inline-block' : 'none' }}>的</span>表
                                    <span style={{ display: queryInfo.resultType == 'md_column' ? 'inline-block' : 'none' }}>中</span>
                                    <span style={{ display: queryInfo.resultType == 'md_table' ? 'none' : 'inline-block' }}>的{queryInfo.resultTypeName}</span>
                                    {total}个
                                </div>
                            ) : null}
                            {tableData && tableData.length ? (
                                <TableLayout
                                    smallLayout
                                    renderTable={() => {
                                        return (
                                            <Table
                                                ref={(node) => {
                                                    this.table = node
                                                }}
                                                loading={loading}
                                                className='tagManageTable'
                                                columns={this.columns}
                                                rowSelection={rowSelection}
                                                dataSource={tableData}
                                                expandIconAsCell={false}
                                                expandIconColumnIndex={-1}
                                                rowKey='targetId'
                                                expandedRowRender={this.expandedRowRender}
                                                defaultExpandAllRows={true}
                                                pagination={
                                                    !paginationDisplay
                                                        ? false
                                                        : {
                                                              total: total,
                                                              pageSize: queryInfo.pageSize,
                                                              current: queryInfo.page,
                                                              showSizeChanger: true,
                                                              showQuickJumper: true,
                                                              onChange: this.changePagination,
                                                              onShowSizeChange: this.onShowSizeChange,
                                                              pageSizeOptions: this.pageSizeOptions,
                                                              showTotal: this.showTotal,
                                                          }
                                                }
                                            />
                                        )
                                    }}
                                    showFooterControl={Boolean(selectedRowKeys.length)}
                                    renderFooter={() => {
                                        return (
                                            <React.Fragment>
                                                已选{isSelectAll ? total - excludedTableIds.length : selectedRowKeys.length}项
                                                <PermissionWrap funcCode='/md/tags/mapping/add'>
                                                    <Button
                                                        authId='tag:add'
                                                        style={{ marginRight: '8px', marginLeft: '10px' }}
                                                        onClick={this.openAddTagModal.bind(this, selectedRowKeys, 'add')}
                                                        className='changeBtn'
                                                    >
                                                        添加标签
                                                    </Button>
                                                </PermissionWrap>
                                                <PermissionWrap funcCode='/md/tags/mapping/delete'>
                                                    <Button
                                                        authId='tag:delete'
                                                        style={{ marginRight: '8px' }}
                                                        onClick={this.openAddTagModal.bind(this, selectedRowKeys, 'delete')}
                                                        className='changeBtn'
                                                    >
                                                        删除标签
                                                    </Button>
                                                </PermissionWrap>
                                            </React.Fragment>
                                        )
                                    }}
                                />
                            ) : null}
                            {!tableData.length ? (
                                <Table loading={loading} className='tagManageTable' columns={this.columns} rowSelection={rowSelection} dataSource={tableData} pagination={false} />
                            ) : null}
                            {addModalVisible ? (
                                <AddTag
                                    title={modalType == 'add' ? modalTitle : modalType == 'create' ? '新建标签' : '请选择需要批量删除的标签'}
                                    visible={addModalVisible}
                                    onCancel={this.openAddTagModal.bind(this)}
                                    modalType={modalType}
                                    setModalType={this.changeModalType}
                                    refreshTable={this.getTagList}
                                    closeModal={this.openAddTagModal.bind(this)}
                                    params={params}
                                    queryInfo={queryInfo}
                                    clearSelectedRows={this.clearSelectedRows}
                                    selectDataLength={selectDataLength}
                                    hasTagList={hasTagList}
                                    changeTagFilter={this.onTagSearchChange}
                                    resetSearch={this.resetSearch}
                                />
                            ) : null}
                        </React.Fragment>
                    )
                }}
            />
        )
    }
}
