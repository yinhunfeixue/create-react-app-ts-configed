// 定版记录
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import { Alert, Button, Input, message, Select, Tag, Tooltip } from 'antd'
import { fixedVersionList, fixedVersionTree, submitter } from 'app_api/autoManage'
import React from 'react'
import './index.less'

let firstChild = {}
export default class Catalog extends React.Component {
    constructor() {
        super()
        this.state = {
            selectedTagCategory: {},
            treeData: [],
            isDataWarehouse: false,
            tableData: [],
            queryInfo: {
                keyword: '',
            },
            userList: [],
        }
        this.selectedRows = []
        this.columns = [
            {
                title: '版本名称',
                dataIndex: 'tag',
                key: 'tag',
                fixed: 'left',
                width: 220,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span style={{ maxWidth: 200 }} className='LineClamp'>
                                {text}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '表',
                dataIndex: 'tableCount',
                key: 'tableCount',
                width: 80,
                render: (text, record) => <span>{record.metaCount ? record.metaCount.tableCount : 0}</span>,
            },
            {
                title: '字段',
                dataIndex: 'columnCount',
                key: 'columnCount',
                width: 80,
                render: (text, record) => <span>{record.metaCount ? record.metaCount.columnCount : 0}</span>,
            },
            {
                title: '代码项',
                dataIndex: 'codeCount',
                key: 'codeCount',
                width: 100,
                render: (text, record) => <span>{record.codeCount ? record.codeCount.codeCount : 0}</span>,
            },
            {
                title: '代码值',
                dataIndex: 'valueCount',
                key: 'valueCount',
                width: 100,
                render: (text, record) => <span>{record.codeCount ? record.codeCount.valueCount : 0}</span>,
            },
            {
                title: '定版时间',
                dataIndex: 'date',
                key: 'date',
                width: 150,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '定版人',
                dataIndex: 'submitter',
                key: 'submitter',
                width: 150,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '版本描述',
                dataIndex: 'desc',
                key: 'desc',
                width: 150,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentDidMount = () => {
        this.getTreeData()
    }
    getUserList = async () => {
        let { selectedTagCategory } = this.state
        let res = await submitter({ datasourceId: selectedTagCategory.id })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    getTreeData = async () => {
        let res = await fixedVersionTree()
        if (res.code == 200) {
            await this.setState({
                treeData: res.data,
            })
            await this.getFirstChild(res.data[0].children)
            this.systemTree && this.systemTree.getTreeData(this.state.treeData, [this.state.selectedTagCategory.id], true)
            this.search()
            this.getUserList()
        }
    }
    getFirstChild(val) {
        if (JSON.stringify(firstChild) != '{}') {
            return //如果res不再是空对象，退出递归
        } else {
            //遍历数组
            for (let i = 0; i < val.length; i++) {
                //如果当前的isleaf是true,说明是叶子节点，把当前对象赋值给res,并return，终止循环
                if (val[i].type == 1) {
                    firstChild = val[i]
                    this.setState({
                        selectedTagCategory: val[i],
                        isDataWarehouse: val[i].dataWarehouse,
                    })
                    return
                } else if (!val[i].children) {
                    //如果chidren为空，则停止这次循环
                    break
                } else {
                    //否则的话，递归当前节点的children
                    this.getFirstChild(val[i].children)
                }
            }
        }
    }
    onSelect = async (selectedKeys, e) => {
        console.log(selectedKeys, e)
        let { queryInfo } = this.state
        let { isDataWarehouse } = this.state
        let selectedTagCategory = {}
        if (e.selectedNodes.length > 0) {
            let selectedNode = e.selectedNodes[0]
            selectedTagCategory = selectedNode
            isDataWarehouse = selectedNode.dataWarehouse
        }
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            selectedTagCategory,
            isDataWarehouse,
            queryInfo,
        })
        this.selectController.updateSelectedKeys([])
        this.search()
        this.getUserList()
    }
    getTableList = async (params = {}) => {
        let { queryInfo, selectedTagCategory } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            datasourceId: selectedTagCategory.id,
        }
        let res = await fixedVersionList(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
            })
            return {
                total: res.total,
                dataSource: res.data,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
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
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    openDetailPage = (data) => {
        let query = {
            name: data.tag,
            id: data.hash,
            type: 'diffVersionHashs',
            value: data.hash,
        }
        this.props.addTab('元数据搜索', { query: JSON.stringify(query) }, true)
    }
    openResultPage = () => {
        console.log(this.selectedRows, 'openResultPage')
        let { selectedTagCategory } = this.state
        if (this.selectedRows.length < 2) {
            message.info('需勾选2项版本')
            return
        }
        let query = {
            datasourceId: selectedTagCategory.id,
            datasourceName: selectedTagCategory.name,
            selectedRows: JSON.stringify(this.selectedRows),
            from: 'version',
        }
        this.props.addTab('版本对比结果', query, true)
    }
    cancelSelected = (index) => {
        this.selectedRows.splice(index, 1)
        let data = []
        this.selectedRows.map((item) => {
            data.push(item.version)
        })
        this.selectController.updateSelectedKeys(data)
    }
    render() {
        const { selectedTagCategory, isDataWarehouse, tableData, queryInfo, userList, treeData } = this.state
        return (
            <SliderLayout
                className='versionManage'
                style={{ height: '100%' }}
                sliderBodyStyle={{ padding: 0 }}
                renderSliderHeader={() => {
                    return '系统目录'
                }}
                renderContentHeader={() => {
                    return <div>定版记录</div>
                }}
                renderSliderBody={() => {
                    return ProjectUtil.renderSystemTree(treeData, this.onSelect)
                }}
                renderContentBody={() => {
                    return (
                        <div>
                            <Alert message='选择表格前复选框，可进行版本对比' showIcon />
                            {selectedTagCategory.id ? (
                                <RichTableLayout
                                    disabledDefaultFooter
                                    editColumnProps={{
                                        width: 80,
                                        createEditColumnElements: (_, record) => {
                                            return [
                                                <a onClick={this.openDetailPage.bind(this, record)} key='detail'>
                                                    详情
                                                </a>,
                                            ]
                                        },
                                    }}
                                    tableProps={{
                                        columns: this.columns,
                                        key: 'version',
                                        selectedEnable: true,
                                        extraTableProps: {
                                            scroll: {
                                                x: 1300,
                                            },
                                        },
                                        getCheckboxProps: (record) => ({
                                            disabled: this.selectedRows.length == 2 && record.version !== this.selectedRows[0].version && record.version !== this.selectedRows[1].version,
                                        }),
                                    }}
                                    renderSearch={(controller) => {
                                        this.controller = controller
                                        return (
                                            <React.Fragment>
                                                <Input.Search value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入版本名称' />
                                                <Select
                                                    allowClear
                                                    showSearch
                                                    optionFilterProp='title'
                                                    onChange={this.changeStatus.bind(this, 'submitter')}
                                                    value={queryInfo.submitter}
                                                    placeholder='定版人'
                                                >
                                                    {userList.map((item) => {
                                                        return (
                                                            <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                {item.name}
                                                            </Select.Option>
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
                                    renderFooter={(controller, defaultRender) => {
                                        let { selectedRows, selectedKeys } = controller
                                        this.selectController = controller
                                        //当前选择行和之前的合并
                                        this.selectedRows = this.selectedRows.concat(selectedRows)
                                        let obj = new Set(selectedKeys)
                                        //在这里去重
                                        var result = []
                                        for (var i = 0; i < this.selectedRows.length; i++) {
                                            //rowKey表格行 key 的取值（唯一,每行不同）
                                            if (obj.has(this.selectedRows[i].version)) {
                                                result.push(this.selectedRows[i])
                                                obj.delete(this.selectedRows[i].version)
                                            }
                                        }
                                        //根据selectedRowseKeys去选出对应的selectedRows
                                        let rows = []
                                        result.map((v) => {
                                            selectedKeys.map((m) => {
                                                if (m && m == v.version) {
                                                    rows.push(v)
                                                }
                                            })
                                        })
                                        if (rows.length == 2) {
                                            if (rows[0].date < rows[1].date) {
                                                rows.reverse()
                                            }
                                        }
                                        this.selectedRows = rows
                                        console.log(rows, 'rows++++')
                                        return (
                                            <div style={{ width: '100%' }}>
                                                <Button type='primary' onClick={this.openResultPage.bind(this, rows)}>
                                                    开始对比
                                                </Button>
                                                <div className='selectedRowArea'>
                                                    {rows[0] ? (
                                                        <Tag closable={true} onClose={this.cancelSelected.bind(this, 0)}>
                                                            {rows[0].tag}
                                                        </Tag>
                                                    ) : (
                                                        <span>待选择</span>
                                                    )}
                                                    <span style={{ margin: '0 8px' }}>／</span>
                                                    {rows[1] ? (
                                                        <Tag closable={true} onClose={this.cancelSelected.bind(this, 1)}>
                                                            {rows[1].tag}
                                                        </Tag>
                                                    ) : (
                                                        <span>待选择</span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }}
                                />
                            ) : null}
                        </div>
                    )
                }}
            />
        )
    }
}
