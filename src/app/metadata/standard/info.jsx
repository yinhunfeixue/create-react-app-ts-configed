import AutoTip from '@/component/AutoTip'
import IconFont from '@/component/IconFont'
import RichTableLayout from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import SearchTree, { defaultTitleRender } from '@/components/trees/SearchTree'
import { Input, Tooltip, Tree } from 'antd'
import { getStandardList } from 'app_api/standardApi'
import { getSourcePathStr, getStandardTree } from 'app_api/systemManage'
import React, { Component } from 'react'

export default class StandardIndex extends Component {
    constructor(props) {
        super(props)

        this.state = {
            treeData: [], // 树数据
            treeDataList: [],
            defaultTreeSelectedKeys: [], // 树默认选中项
            currentKey: '1',
            defaultExpandAll: false,
            searchParams: {},
            treeSearchKey: '',
            standardLevel: null,
            contextPath: null,
        }

        this.firstInit = false

        //表格项
        this.columns = [
            {
                title: '标准编码',
                dataIndex: 'entityId',
                key: 'entityId',
                width: '18%',
                render: (_, record) => <a onClick={() => this.onView(record)} dangerouslySetInnerHTML={{ __html: `<Tooltip title=${_}>${record.entityId ? record.entityId : _}</Tooltip>` }} />,
            },
            {
                title: '标准英文名',
                dataIndex: 'entityName',
                key: 'entityName',
                width: '18%',
                render: (_, record) => <AutoTip content={record.entityNameHL ? record.entityNameHL : _} />,
            },
            {
                title: '标准中文名',
                dataIndex: 'entityDesc',
                key: 'entityDesc',
                width: '18%',
                render: (_, record) => <AutoTip content={record.entityDescHL ? record.entityDescHL : _} />,
            },
            {
                title: '业务定义',
                dataIndex: 'businessDefinition',
                key: 'businessDefinition',
                render: (_, record) => <AutoTip content={record.businessDefinitionHL ? record.businessDefinitionHL : _} />,
            },
            {
                title: '数据域',
                dataIndex: 'entityDomainId',
                key: 'entityDomainId',
                width: 120,
                render: (_, record) => <AutoTip content={record.entityDomainId ? record.entityDomainId : _} />,
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
                    if (text.length > 2) {
                        text = text.substring(2)
                    }
                    return <AutoTip content={text} />
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
    }

    onView = (params) => {
        this.props.addTab('标准详情', params, true)
    }

    highFunctionClick = (title) => {
        this.tabsCom.add(title)
    }
    componentDidMount() {
        let treeId = ''
        getStandardTree({ code: 'ZT002', status: 1 }).then((res) => {
            if (res.code == 200) {
                treeId = res.data.id

                // 指标数据加载完成，默认添加：指标列表-基础的tab
                // this.tabsCom.add('标准列表', { name: treeId, selectedKeys: [treeId] })
                this.setState(
                    {
                        treeData: [res.data],
                        treeDataList: this.modifyTreeDataList(res.data.children),
                        defaultTreeSelectedKeys: [treeId.toString()],
                        currentSelectedKey: treeId,
                    },
                    () => {
                        this.onTreeSelect([this.state.treeDataList[0].id])
                    }
                )
            }
        })
    }

    modifyTreeDataList = (arr) => {
        arr.forEach((child) => {
            ;(child.key = child.id), (child.title = child.name)
            child.children = this.modifyTreeDataList(child.children)
        })
        return arr
    }

    onTreeSelect = async (selectedKeys, info) => {
        console.log('info', info)
        if (!selectedKeys[0]) {
            return
        }
        this.currentSelectedKey = selectedKeys[0]
        let searchParams = {}
        searchParams = { treeNodeId: selectedKeys[0], entityName: '', entityType: '', entityCategory: '' }
        const res = await getSourcePathStr({ classId: selectedKeys[0] })
        if (res.code === 200) {
            this.setState({ contextPath: res.data.join(' / ') })
        }
        this.setState({ searchParams }, () => this.reset())
    }

    commonSearch = (data) => {
        this.tabsCom.add('全局搜索-搜索结果', { keyword: data })
    }

    searchInputChange = (event) => {
        this.setState({ inputValue: event.target.value })
    }

    renderTreeNode(treeData) {
        if (!treeData) {
            return []
        }

        const { treeSearchKey } = this.state
        return treeData.map((item) => {
            /**
             * @type {string}
             */
            let title = item.name
            let beforeStr = ''
            let afterStr = ''
            if (treeSearchKey) {
                const index = title.indexOf(treeSearchKey)
                if (index >= 0) {
                    beforeStr = title.substring(0, index)
                    afterStr = title.substring(index + treeSearchKey.length)
                    title = `<span style="color:red">${treeSearchKey}</span>`
                }
            }

            const effectTitle = `${beforeStr}${title}${afterStr}`
            return (
                <Tree.TreeNode
                    title={
                        <Tooltip title={item.name}>
                            <span dangerouslySetInnerHTML={{ __html: effectTitle }} />
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
        const { inputValue, searchParams } = this.state
        let res = await getStandardList({
            ...searchParams,
            page,
            page_size: pageSize,
            entityName: inputValue,
            paginationDisplay: 'none',
            entityStatus: '已发布',
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

    reset = () => {
        this.setState({ inputValue: '' }, () => this.search())
    }

    setSourceCount = (num) => {
        if (num >= 1000) {
            num = (num / 1000).toFixed(1) + 'k'
        }
        return num
    }

    render() {
        const { defaultTreeSelectedKeys, currentSelectedKey, treeSearchKey, treeData, inputValue, treeKey, defaultExpandAll, treeDataList, standardLevel, contextPath } = this.state
        // 默认展开树的第一层
        return (
            <SliderLayout
                style={{ height: '100%' }}
                sliderBodyStyle={{ padding: 0 }}
                renderSliderHeader={() => {
                    return (
                        <div className='HControlGroup' style={{ width: '100%' }}>
                            <span style={{ flex: 1 }}>
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
                                标准目录
                            </span>
                        </div>
                    )
                }}
                renderSliderBody={() => {
                    return treeDataList && treeDataList.length ? (
                        <SearchTree
                            ref={(target) => (this.tree = target)}
                            // key={defaultExpandAll}
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
                                                    <span className='iconfont icon-shujuyu'></span>
                                                ) : data.level === 1 ? (
                                                    <img style={{ width: 16, height: 16, borderRadius: 1 }} src={data.description} />
                                                ) : (
                                                    <span className='iconfont icon-fenlei'></span>
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
                                // defaultExpandedKeys: defaultExpandAll ? undefined : treeDataList.map((item) => item.id),
                                // defaultExpandAll: defaultExpandAll,
                                onSelect: this.onTreeSelect,
                            }}
                        />
                    ) : null
                }}
                renderContentHeader={() => {
                    return contextPath || '标准列表'
                }}
                renderContentBody={() => {
                    return (
                        <RichTableLayout
                            disabledDefaultFooter
                            smallLayout
                            renderSearch={(controller) => {
                                this.controller = controller
                                return <Input.Search allowClear onSearch={() => this.search()} value={inputValue} onChange={this.searchInputChange} placeholder='请输入标准编码/名称' />
                            }}
                            editColumnProps={{
                                hidden: true,
                            }}
                            tableProps={{
                                columns: standardLevel === '基础标准' ? this.columns : this.codeColumns,
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
