// 标准维护
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import RichTableLayout from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import PermissionWrap from '@/component/PermissionWrap'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import SearchTree, { defaultTitleRender } from '@/components/trees/SearchTree'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Divider, Input, message, Modal, Select, Tooltip, Tree } from 'antd'
import { changeStandardStatus, getStandardList } from 'app_api/standardApi'
import { getStandardTree } from 'app_api/systemManage'
import React, { Component } from 'react'

export default class StandardIndex extends Component {
    constructor(props) {
        super(props)

        this.state = {
            treeData: [], // 树数据
            defaultTreeSelectedKeys: [], // 树默认选中项
            currentKey: '1',
            defaultExpandAll: false,
            searchParams: {},
            queryInfo: {
                entityName: '',
            },
            treeDataList: [],
            standardLevel: null,
        }
        this.firstInit = false
        //表格项
        this.columns = [
            {
                title: '标准编码',
                dataIndex: 'entityId',
                key: 'entityId',
                fixed: 'left',
                render: (_, record) => <a onClick={() => this.onView(record)} dangerouslySetInnerHTML={{ __html: `<Tooltip title=${_}>${record.entityId ? record.entityId : _}</Tooltip>` }} />,
                width: 160,
            },
            {
                title: '标准英文名',
                dataIndex: 'entityName',
                key: 'entityName',
                width: 120,
                fixed: 'left',
                render: (_, record) => (
                    <Tooltip title={_} placement='topLeft'>
                        <span dangerouslySetInnerHTML={{ __html: record.entityNameHL ? record.entityNameHL : _ }} />
                    </Tooltip>
                ),
            },
            {
                title: '标准中文名',
                dataIndex: 'entityDesc',
                key: 'entityDesc',
                width: 120,
                render: (_, record) => (
                    <Tooltip title={_} placement='topLeft'>
                        <span dangerouslySetInnerHTML={{ __html: record.entityDescHL ? record.entityDescHL : _ }} />
                    </Tooltip>
                ),
            },
            {
                title: '业务定义',
                dataIndex: 'businessDefinition',
                key: 'businessDefinition',
                width: 150,
                render: (_, record) => (
                    <Tooltip title={_} placement='topLeft'>
                        <span className='LineClamp1' dangerouslySetInnerHTML={{ __html: record.businessDefinitionHL ? record.businessDefinitionHL : _ }} />
                    </Tooltip>
                ),
            },
            {
                title: '数据域',
                dataIndex: 'entityDomainId',
                key: 'entityDomainId',
                width: 90,
            },
            {
                title: '业务条线',
                dataIndex: 'entityDomainId',
                key: 'entityDomainId',
                width: 240,
                render: (_, record) => {
                    let text = ''
                    if (record.levelOneName) {
                        text += `/ ${record.levelOneName}`
                    }
                    if (record.levelTwoName) {
                        text += ` / ${record.levelTwoName}`
                    }
                    if (record.levelThreeName) {
                        text += ` / ${record.levelThreeName}`
                    }
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
        ]

        this.codeColumns = [
            {
                title: '标准编码',
                dataIndex: 'entityId',
                key: 'entityId',
                render: (_, record) => <a onClick={() => this.onView(record)} dangerouslySetInnerHTML={{ __html: `<Tooltip title=${_}>${record.entityId ? record.entityId : _}</Tooltip>` }} />,
            },
            {
                title: '标准中文名',
                dataIndex: 'entityDesc',
                key: 'entityDesc',
                render: (_, record) => (
                    <Tooltip title={_}>
                        <span dangerouslySetInnerHTML={{ __html: record.entityDescHL ? record.entityDescHL : _ }} />
                    </Tooltip>
                ),
            },
            {
                title: '业务定义',
                dataIndex: 'businessDefinition',
                key: 'businessDefinition',
                render: (_, record) => (
                    <Tooltip title={_}>
                        <span className='LineClamp1' dangerouslySetInnerHTML={{ __html: record.businessDefinitionHL ? record.businessDefinitionHL : _ }} />
                    </Tooltip>
                ),
            },
            {
                title: '代码值数量',
                dataIndex: 'codeValuesNum',
                key: 'codeValuesNum',
            },
        ]

        this.columnsCommon = [
            {
                title: '状态',
                dataIndex: 'entityStatus',
                key: 'entityStatus',
                fixed: 'right',
                width: 100,
                render: (text, record) => {
                    if (text == '已发布') {
                        return <StatusLabel type='success' message='已发布' />
                    } else if (text == '未发布') {
                        return <StatusLabel type='originWarning' message='未发布' />
                    } else if (text == '废弃') {
                        return <StatusLabel type='greyWarning2' message='废弃' />
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                fixed: 'right',
                width: 154,
                render: (text, record, index) => {
                    return (
                        <div>
                            {record.entityStatus == '已发布' ? (
                                <PermissionWrap funcCode='/dtstd/management/list/offline'>
                                    <a onClick={this.changeTableStatus.bind(this, record.id, '未发布')}>下线</a>
                                </PermissionWrap>
                            ) : null}
                            {record.entityStatus == '未发布' ? (
                                <div>
                                    <PermissionWrap funcCode='/dtstd/management/list/release'>
                                        <React.Fragment>
                                            <a onClick={this.changeTableStatus.bind(this, record.id, '已发布')}>发布</a>
                                            <Divider style={{ margin: '0 8px' }} type='vertical' />
                                        </React.Fragment>
                                    </PermissionWrap>
                                    <PermissionWrap funcCode='/dtstd/management/list/edit'>
                                        <React.Fragment>
                                            <a onClick={this.openEditPage.bind(this, record)}>编辑</a>
                                            <Divider style={{ margin: '0 8px' }} type='vertical' />
                                        </React.Fragment>
                                    </PermissionWrap>
                                    <PermissionWrap funcCode='/dtstd/management/list/discard'>
                                        <a onClick={this.changeTableStatus.bind(this, record.id, '废弃')}>废弃</a>
                                    </PermissionWrap>
                                </div>
                            ) : null}
                        </div>
                    )
                },
            },
        ]
    }

    onView = (params) => {
        console.log('params', params)
        this.props.addTab('标准维护-标准详情', params, true)
    }
    changeTableStatus = async (id, status) => {
        let query = {
            standardId: id,
            entityStatus: status,
        }
        const map = {
            未发布: {
                title: '下线标准',
                content: '是否确定下线？',
                okText: '下线',
                okType: 'danger',
                okButtonProps: { type: 'primary' },
                icon: <ExclamationCircleOutlined style={{ color: '#FF9900' }} />,
            },
            废弃: {
                title: '废弃标准',
                content: '废弃标准将不可继续使用，且取消字段映射。',
                okText: '废弃',
                okType: 'danger',
                okButtonProps: { type: 'primary' },
                icon: <ExclamationCircleOutlined style={{ color: '#FF9900' }} />,
            },
            已发布: {
                title: '发布标准',
                content: '是否确定发布标准',
                okText: '发布',
                okButtonProps: { type: 'primary' },
                icon: <ExclamationCircleOutlined style={{ color: '#FF9900' }} />,
            },
        }

        const requestFun = async () => {
            let res = await changeStandardStatus(query)
            if (res.code == 200) {
                message.success('操作成功')
                this.search()
            }
        }
        Modal.confirm({
            ...map[status],
            onOk: () => requestFun(),
        })
    }
    openEditPage = (data) => {
        this.props.addTab('编辑标准', { ...data })
    }
    componentDidMount() {
        let treeId = ''
        getStandardTree({ code: 'ZT002', status: 0 }).then((res) => {
            if (res.code == 200) {
                treeId = res.data.id

                // 指标数据加载完成，默认添加：指标列表-基础的tab
                // this.tabsCom.add('标准列表', { name: treeId, selectedKeys: [treeId] })

                this.setState(
                    {
                        treeData: [res.data],
                        defaultTreeSelectedKeys: [treeId.toString()],
                        treeDataList: this.modifyTreeDataList(res.data.children),
                        currentSelectedKey: treeId,
                    },
                    () => {
                        this.onTreeSelect([this.state.treeDataList[0].id])
                    }
                )
            }
        })
    }

    onTreeSelect = (selectedKeys, e) => {
        if (!selectedKeys[0]) {
            return
        }
        this.currentSelectedKey = selectedKeys[0]
        let searchParams = {}
        if (!/^[0-9]*$/.test(selectedKeys[0])) {
            //如果不是数字
            if (selectedKeys[0] === '基础' || selectedKeys[0] === '衍生') {
                //如果点击的是切换数据类型那一级
                this.entityType = selectedKeys[0]
                searchParams = { entityType: this.entityType, entityName: '', treeNodeId: '', entityCategory: '' }
            } else {
                //如果点击的是主题那一级
                this.treeNodeId = selectedKeys[0] == '5394c2b7fe794702bc54fcf5f3323235' ? '' : selectedKeys[0]
                searchParams = { treeNodeId: this.treeNodeId, entityName: '', entityType: '', entityCategory: '' }
            }
        } else {
            this.entityCategory = selectedKeys[0]
            searchParams = { entityCategory: this.entityCategory, entityName: '', entityType: '', treeNodeId: '' }
        }

        this.setState({ searchParams }, () => this.reset())
    }
    renderTreeNode(treeData) {
        if (!treeData) {
            return []
        }

        return treeData.map((item) => {
            return (
                <Tree.TreeNode
                    title={
                        <Tooltip title={item.name}>
                            <span>{item.name}</span>
                        </Tooltip>
                    }
                    key={item.id}
                >
                    {this.renderTreeNode(item.children)}
                </Tree.TreeNode>
            )
        })
    }

    requestTableData = async (page, pageSize) => {
        const { queryInfo, searchParams } = this.state
        let res = await getStandardList({
            ...searchParams,
            page,
            page_size: pageSize,
            ...queryInfo,
        })

        if (res.data[0]) {
            await this.setState({ standardLevel: res.data[0].standardLevel })
        }
        return {
            dataSource: res.data,
            total: res.total,
        }
    }

    search() {
        this.controller.reset()
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
        queryInfo.entityName = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
        }
    }

    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            entityName: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }

    modifyTreeDataList = (arr) => {
        arr.forEach((child) => {
            ;(child.key = child.id), (child.title = child.name)
            child.children = this.modifyTreeDataList(child.children)
        })
        return arr
    }

    setSourceCount = (num) => {
        if (num >= 1000) {
            num = (num / 1000).toFixed(1) + 'k'
        }
        return num
    }

    render() {
        const { queryInfo, defaultTreeSelectedKeys, currentSelectedKey, treeData, defaultExpandAll, treeDataList, standardLevel } = this.state
        return (
            <SliderLayout
                style={{ height: '100%' }}
                sliderBodyStyle={{ padding: 0 }}
                renderSliderHeader={() => {
                    return (
                        <div className='HControlGroup'>
                            <Tooltip title={defaultExpandAll ? '收起' : '展开'}>
                                <IconFont
                                    type={defaultExpandAll ? 'icon-zhankai3' : 'icon-shouqi3'}
                                    className='IconFold'
                                    style={{ margin: '0px 6px' }}
                                    onClick={() => {
                                        if (defaultExpandAll) {
                                            this.tree.expand([])
                                        } else {
                                            this.tree.expandAll()
                                        }
                                        this.setState({ defaultExpandAll: !defaultExpandAll })
                                    }}
                                />
                            </Tooltip>
                            <span>标准目录</span>
                        </div>
                    )
                }}
                renderSliderBody={() => {
                    return treeData && treeData.length ? (
                        <SearchTree
                            ref={(target) => (this.tree = target)}
                            style={{ height: '100%' }}
                            equalNode={(searchKey, node) => Boolean(searchKey && node.title && node.title.toString().includes(searchKey))}
                            defaultSelectedEqual={(node) => node.id === treeDataList[0].id}
                            treeTitleRender={(node, searchKey) => {
                                return defaultTitleRender(
                                    node,
                                    (data) => {
                                        return {
                                            icon:
                                                data.level === 2 ? (
                                                    <IconFont type='icon-shujuyu' />
                                                ) : data.level === 1 ? (
                                                    <img style={{ width: 16, height: 16, borderRadius: 1 }} src={data.description} />
                                                ) : (
                                                    <IconFont type='icon-fenlei' />
                                                ),
                                            title: data.title,
                                            extra: this.setSourceCount(data.directSourceCount),
                                        }
                                    },
                                    searchKey
                                )
                            }}
                            treeProps={{
                                treeData: treeDataList,
                                onSelect: this.onTreeSelect,
                            }}
                        />
                    ) : null
                }}
                renderContentHeader={() => {
                    return '标准列表'
                }}
                renderContentBody={() => {
                    return (
                        <RichTableLayout
                            disabledDefaultFooter
                            smallLayout
                            renderSearch={(controller) => {
                                this.controller = controller
                                return (
                                    <React.Fragment>
                                        <Input.Search allowClear onSearch={() => this.search()} value={queryInfo.entityName} onChange={this.changeKeyword} placeholder='输入标准编码/标准中英文名' />
                                        <Select allowClear onChange={this.changeStatus.bind(this, 'entityStatus')} value={queryInfo.entityStatus} placeholder='状态'>
                                            <Select.Option value='废弃' key={0}>
                                                废弃
                                            </Select.Option>
                                            <Select.Option value='已发布' key={1}>
                                                已发布
                                            </Select.Option>
                                            <Select.Option value='未发布' key={2}>
                                                未发布
                                            </Select.Option>
                                        </Select>
                                        <Button onClick={this.reset}>重置</Button>
                                    </React.Fragment>
                                )
                            }}
                            editColumnProps={{
                                hidden: true,
                            }}
                            tableProps={{
                                columns: (standardLevel === '基础标准' ? this.columns : this.codeColumns).concat(this.columnsCommon),
                                extraTableProps: {
                                    scroll: {
                                        x: false,
                                    },
                                },
                            }}
                            requestListFunction={async (page, pageSize) => {
                                if (!this.firstInit) {
                                    this.firstInit = true
                                } else {
                                    return this.requestTableData(page, pageSize)
                                }
                            }}
                        />
                    )
                }}
            />
        )
    }
}
