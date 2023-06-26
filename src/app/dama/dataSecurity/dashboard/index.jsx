// 分布总览
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import LevelTag from '@/component/LevelTag'
import ModuleTitle from '@/component/module/ModuleTitle'
import ProjectUtil from '@/utils/ProjectUtil'
import { DownOutlined } from '@ant-design/icons'
import { Button, Cascader, Col, Input, Popover, Row, Select, Spin, Tooltip, Tree } from 'antd'
import { dataSecurityLevelList, eigenFilters, levelColumnSearch, levelDatabaseFilter, levelDatasourceFilter, levelSecurityTree, levelTableFilter, statisticByClassIds } from 'app_api/dataSecurity'
import React from 'react'
import './index.less'

const { TreeNode } = Tree
let firstChild = {}
export default class DataDashboard extends React.Component {
    constructor() {
        super()
        this.state = {
            selectedTagCategory: {},
            treeData: [],
            backupTreeData: [],
            isDataWarehouse: false,
            tableData: [],
            queryInfo: {
                keyword: '',
                classifyIds: [],
                filterNodes: [],
            },
            treeKeyword: '',
            dataPathList: [],
            treeLoading: false,
            selectedKeys: [],
            traitList: [],
            levelList: [],
            staticInfo: {
                hotEigenName: [],
                eigenNonQuoted: [],
            },
            datasourceList: [],
        }
        this.selectedRows = []
        this.columns = [
            {
                dataIndex: 'ename',
                key: 'ename',
                title: '字段英文名',
                width: 200,
                fixed: 'left',
                render: (text, record) => (
                    <Tooltip
                        placement='topLeft'
                        title={
                            <span>
                                <span dangerouslySetInnerHTML={{ __html: text }}></span>
                                <br />
                                {record.parentEname}
                            </span>
                        }
                    >
                        <div className='tableLabel' style={{ maxWidth: 200 }}>
                            <span>
                                <span className=' tableIcon iconfont icon-ziduan1'></span>
                                <span dangerouslySetInnerHTML={{ __html: text }}></span>
                            </span>
                            <div style={{ color: '#9EA3A8' }}>
                                <span className=' tableIcon iconfont icon-biaodanzujian-biaoge'></span>
                                {record.parentEname}
                            </div>
                        </div>
                    </Tooltip>
                ),
            },
            {
                title: '路径',
                dataIndex: 'path',
                key: 'path',
                width: 130,
                render: (text, record) => {
                    if (!text) {
                        return <EmptyLabel />
                    }

                    const path = text.replace(`/${record.parentEname}`, '')
                    return (
                        <Tooltip placement='topLeft' title={path}>
                            <span>{path}</span>
                        </Tooltip>
                    )
                },
            },
            {
                dataIndex: 'eigenName',
                key: 'eigenName',
                title: '分类特征',
                width: 120,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '分类信息',
                dataIndex: 'classifyPath',
                key: 'classifyPath',
                width: 160,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '敏感标签',
                dataIndex: 'desensitizeTag',
                key: 'desensitizeTag',
                width: 120,
                render: (text, record) => {
                    const { desensitizeTag } = record
                    return desensitizeTag && desensitizeTag.id ? (
                        <Tooltip placement='topLeft' title={record.desensitizeTag.name}>
                            <span>{record.desensitizeTag.name}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    )
                },
            },
            {
                title: '分级',
                dataIndex: 'securityLevel',
                key: 'securityLevel',
                width: 100,
                render: (text) => (text ? <LevelTag value={text} type='text' /> : <EmptyLabel />),
            },
        ]
    }
    componentDidMount = () => {
        this.getTreeData()
        this.getDataSecurityLevelList()
        this.getDatasource()
    }
    getDataSecurityLevelList = async () => {
        let res = await dataSecurityLevelList()
        if (res.code == 200) {
            this.setState({
                levelList: res.data,
            })
        }
    }
    getDatasource = async () => {
        let res = await levelDatasourceFilter({ domain: 'COLUMN' })
        if (res.code == 200) {
            res.data.map((item) => {
                item.isLeaf = false
            })
            this.setState({
                datasourceList: res.data,
            })
        }
    }
    loadData = async (selectedOptions) => {
        // 延迟一下，因为change事件会修改queryInfo，要等change先处理完
        // 标准做法应该是，加载子结点不依赖于state的数据，只依赖于当前结点；但前人已经写完了逻辑，所以此处尽量不动

        await ProjectUtil.sleep(10)
        let { queryInfo } = this.state
        const targetOption = selectedOptions[selectedOptions.length - 1]
        if (targetOption.type == 'datasourceId') {
            targetOption.loading = true
            let res = await levelDatabaseFilter({ domain: 'COLUMN', datasourceId: queryInfo.classifyIds[0] })
            targetOption.loading = false
            if (res.code == 200) {
                res.data.map((item) => {
                    item.isLeaf = false
                })
                targetOption.children = res.data
            }
        } else {
            targetOption.loading = true
            let res = await levelTableFilter({ domain: 'COLUMN', datasourceId: queryInfo.classifyIds[0], databaseId: queryInfo.classifyIds[1] })
            targetOption.loading = false
            if (res.code == 200) {
                targetOption.children = res.data
            }
        }
        this.setState({
            datasourceList: [...this.state.datasourceList],
        })
    }
    getTreeData = async () => {
        let { treeKeyword, selectedTagCategory } = this.state
        let query = {
            domain: ['COLUMN'],
            keyword: treeKeyword,
        }
        this.setState({ treeLoading: true })
        let res = await levelSecurityTree(query)
        this.setState({ treeLoading: false })
        if (res.code == 200) {
            await this.setState({
                treeData: res.data,
                backupTreeData: res.data,
            })
            if (!selectedTagCategory.id) {
                this.setState({
                    selectedTagCategory: res.data[0],
                    selectedKeys: [res.data[0].id],
                })
                // await this.getFirstChild(res.data[0].children)
            }
            this.getStaticInfo()
            this.getTraitList()
            this.search()
        }
    }
    treeFilter = (value, treeData) => {
        if (value) {
            let newList = []
            treeData &&
                treeData.map((item) => {
                    if (item.name.indexOf(value) > -1) {
                        const Children = this.treeFilter(value, item.children)
                        const obj = {
                            ...item,
                            children: Children,
                        }
                        newList.push(obj)
                    } else {
                        if (item.children && item.children.length > 0) {
                            const Children = this.treeFilter(value, item.children)
                            const obj = {
                                ...item,
                                children: Children,
                            }
                            if (Children && Children.length > 0) {
                                newList.push(obj)
                            }
                        }
                    }
                })
            return newList
        } else {
            return treeData
        }
    }
    getPathIds(data, array) {
        if (data.children && data.children.length) {
            data.children.map((item) => {
                if (item.children && item.children.length) {
                    this.getPathIds(item, array)
                } else {
                    if (item.lastLevel) {
                        array.push(item.id)
                    }
                }
            })
        } else {
            if (data.lastLevel) {
                array.push(data.id)
            }
        }
        return array
    }
    getStaticInfo = async () => {
        let { selectedTagCategory } = this.state
        let query = {
            classId: selectedTagCategory.id,
        }
        // let array = []
        // if (selectedTagCategory.children) {
        //     array = this.getPathIds(selectedTagCategory, [])
        // } else {
        //     array = [selectedTagCategory.id]
        // }
        // query.classIds = array.join(',')
        // if (query.classIds.length) {
        let res = await statisticByClassIds(query)
        if (res.code == 200) {
            res.data.eigenNonQuoted = res.data.eigenNonQuoted ? res.data.eigenNonQuoted : []
            res.data.hotEigenName = res.data.hotEigenName ? res.data.hotEigenName : []
            res.data.eigenNonQuotedDesc = res.data.eigenNonQuoted.join('，')
            this.setState({
                staticInfo: res.data,
            })
        }
        // } else {
        //     this.setState({
        //         staticInfo: {
        //             eigenNonQuoted: [],
        //             eigenNonQuotedDesc: '',
        //             hotEigenName: []
        //         }
        //     })
        // }
    }
    getTraitList = async () => {
        let { queryInfo, selectedTagCategory } = this.state
        let query = {
            rootTreeId: selectedTagCategory.id,
        }
        let res = await eigenFilters(query)
        if (res.code == 200) {
            this.setState({
                traitList: res.data,
            })
        }
    }
    changeTreeKeyword = async (e) => {
        let { backupTreeData } = this.state
        await this.setState({
            treeKeyword: e.target.value,
            treeData: this.treeFilter(e.target.value, backupTreeData),
        })
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
                        selectedKeys: [val[i].id],
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
        if (!selectedKeys[0]) {
            return
        }
        console.log(selectedKeys, e)
        let { queryInfo } = this.state
        let selectedTagCategory = {}
        if (e.selectedNodes.length > 0) {
            let selectedNode = e.selectedNodes[0]
            selectedTagCategory = selectedNode.dataRef
        }
        queryInfo = {
            keyword: '',
            classifyIds: [],
            filterNodes: [],
        }
        await this.setState({
            selectedTagCategory,
            queryInfo,
            selectedKeys,
        })
        this.reset()
        this.getStaticInfo()
        this.getTraitList()
    }
    getTableList = async (params = {}) => {
        let { queryInfo, selectedTagCategory } = this.state
        // queryInfo.treeFilters = selectedTagCategory.id ? [selectedTagCategory] : []
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            rootTreeId: selectedTagCategory.id,
            datasourceId: queryInfo.classifyIds[0] ? queryInfo.classifyIds[0] : undefined,
            databaseId: queryInfo.classifyIds[1] ? queryInfo.classifyIds[1] : undefined,
            tableId: queryInfo.classifyIds[2] ? queryInfo.classifyIds[2] : undefined,
        }
        let res = await levelColumnSearch(query)
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
            classifyIds: [],
            filterNodes: [],
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeStatus = async (name, e, node) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        if (name === 'classifyIds') {
            if (!queryInfo[name]) {
                queryInfo[name] = []
            }
        }
        queryInfo.filterNodes = []
        if (queryInfo.securityLevelFilters) {
            queryInfo.filterNodes.push({ type: 'securityLevel_string', value: this.getLevelDesc(queryInfo.securityLevelFilters) })
        }
        if (queryInfo.classifyIds.length) {
            if (queryInfo.classifyIds[0]) {
                queryInfo.filterNodes.push({ type: 'datasourceId', value: queryInfo.classifyIds[0] })
            }
            if (queryInfo.classifyIds[1]) {
                queryInfo.filterNodes.push({ type: 'databaseId', value: queryInfo.classifyIds[1] })
            }
            if (queryInfo.classifyIds[2]) {
                queryInfo.filterNodes.push({ type: 'tableId', value: queryInfo.classifyIds[2] })
            }
        }
        // await this.setState({
        //     queryInfo,
        // })
        this.state.queryInfo = queryInfo;
        this.search()
    }
    getLevelDesc = (value) => {
        let { levelList } = this.state
        for (let i = 0; i < levelList.length; i++) {
            if (levelList[i].id == value) {
                return levelList[i].name
            }
        }
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

    
    render() {
        const { selectedTagCategory, queryInfo, dataPathList, treeLoading, treeKeyword, treeData, selectedKeys, traitList, levelList, staticInfo, datasourceList } = this.state
        const treeTitle = (data) => {
            return (
                <span>
                    <Tooltip title={data.name}>
                        <span
                            style={{
                                width: 'calc(100% - 60px)',
                                display: 'inline-block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {data.name}
                        </span>
                    </Tooltip>
                    <span className='treeTitleNumber' style={{ color: '#b3b3b3', float: 'right', marginLeft: 6 }}>
                        {ProjectUtil.numberFormatWithK(data.statistic || 0)}
                    </span>
                </span>
            )
        }
        console.log('datasourceList', datasourceList);
        const renderTreeNodes = (data, parentId) =>
            data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode icon={<DownOutlined />} title={treeTitle(item)} key={item.id} parentId={parentId} dataRef={item}>
                            {renderTreeNodes(item.children, item.id)}
                        </TreeNode>
                    )
                }
                return <TreeNode title={treeTitle(item)} key={item.id} parentId={parentId} dataRef={item} />
            })
        return (
            <SliderLayout
                className='dataDashboard'
                style={{ height: '100%' }}
                renderSliderHeader={() => {
                    return '分类目录'
                }}
                renderContentHeader={() => {
                    return <div>{selectedTagCategory.name}</div>
                }}
                renderSliderBody={() => {
                    return (
                        <div className='treeContent HideScroll'>
                            <Input.Search style={{ marginBottom: 8 }} value={treeKeyword} /* onSearch={this.getTreeData} */ onChange={this.changeTreeKeyword} placeholder='搜索分类' />
                            <div style={{ minHeight: 40 }}>
                                <Spin spinning={treeLoading}>
                                    {treeData.length ? (
                                        <Tree className='LineTree' blockNode selectedKeys={selectedKeys} defaultExpandAll={true} onSelect={this.onSelect}>
                                            {renderTreeNodes(treeData)}
                                        </Tree>
                                    ) : null}
                                </Spin>
                            </div>
                        </div>
                    )
                }}
                renderContentBody={() => {
                    return (
                        <div>
                            <div className='dashboardStatics'>
                                <Row>
                                    <Col span={8} style={{ display: 'flex' }}>
                                        <span className='fieldArea'>
                                            <div className='fieldValue'>{ProjectUtil.formNumber(staticInfo.columnNum || 0)}</div>
                                            <div className='fieldLabel'>字段数</div>
                                        </span>
                                        <span className='fieldArea'>
                                            <div className='fieldValue'>{ProjectUtil.formNumber(staticInfo.senNum || 0)}</div>
                                            <div className='fieldLabel'>敏感字段</div>
                                        </span>
                                    </Col>
                                    <Col span={16}>
                                        <Row className='staticsRight'>
                                            <Col span={4}>
                                                <span className='fieldValue'>{staticInfo.eigenTotalNum || 0}</span>
                                                <div className='fieldLabel'>特征词</div>
                                            </Col>
                                            <Col span={4}>
                                                <div className='fieldValue errorField'>
                                                    {staticInfo.eigenNonQuotedNum || 0}
                                                    <Popover trigger='click' content={staticInfo.eigenNonQuotedDesc} overlayStyle={{ maxWidth: '50%' }}>
                                                        <span className='iconfont icon-you'></span>
                                                    </Popover>
                                                </div>
                                                <div className='fieldLabel'>未引用</div>
                                            </Col>
                                            <Col span={16}>
                                                <div className='fieldRight'>
                                                    {staticInfo.hotEigenName.map((item, index) => {
                                                        return (
                                                            <div>
                                                                <span
                                                                    style={{
                                                                        color: index == 0 ? '#E8703F' : index == 1 ? '#EEB836' : '#3A9DFF',
                                                                        background: index == 0 ? 'rgba(232, 112, 63, 0.1)' : index == 2 ? 'rgba(58, 157, 255, 0.1)' : 'rgba(238, 184, 54, 0.1)',
                                                                    }}
                                                                    className='index'
                                                                >
                                                                    {index + 1}
                                                                </span>
                                                                <span className='value'>{item}</span>
                                                            </div>
                                                        )
                                                    })}
                                                    {!staticInfo.hotEigenName.length ? <EmptyLabel /> : null}
                                                </div>
                                                <div className='fieldLabel'>引用排行</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                            <ModuleTitle title='字段明细' />
                            {selectedTagCategory.id ? (
                                <RichTableLayout
                                    disabledDefaultFooter
                                    editColumnProps={{
                                        hidden: true,
                                    }}
                                    tableProps={{
                                        columns: this.columns,
                                        key: 'id',
                                        extraTableProps: {
                                            scroll: {
                                                x: 1300,
                                            },
                                        },
                                    }}
                                    renderSearch={(controller) => {
                                        this.controller = controller
                                        return (
                                            <React.Fragment>
                                                <Input.Search value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='搜索字段' />
                                                <Cascader
                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                    options={datasourceList}
                                                    value={queryInfo.classifyIds}
                                                    displayRender={(e) => e.join('-')}
                                                    onChange={this.changeStatus.bind(this, 'classifyIds')}
                                                    loadData={this.loadData}
                                                    changeOnSelect
                                                    popupClassName='searchCascader'
                                                    placeholder='路径'
                                                    // getPopupContainer={triggerNode => triggerNode.parentNode}
                                                />
                                                <Select
                                                    allowClear
                                                    showSearch
                                                    optionFilterProp='title'
                                                    onChange={this.changeStatus.bind(this, 'eigenId')}
                                                    value={queryInfo.eigenId}
                                                    placeholder='分类特征'
                                                >
                                                    {traitList.map((item) => {
                                                        return (
                                                            <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                {item.name}
                                                            </Select.Option>
                                                        )
                                                    })}
                                                </Select>
                                                <Select allowClear onChange={this.changeStatus.bind(this, 'isSensitive')} value={queryInfo.isSensitive} placeholder='是否敏感'>
                                                    <Select.Option key={1} value={1}>
                                                        是
                                                    </Select.Option>
                                                    <Select.Option key={0} value={0}>
                                                        否
                                                    </Select.Option>
                                                </Select>
                                                <Select
                                                    allowClear
                                                    showSearch
                                                    optionFilterProp='title'
                                                    onChange={this.changeStatus.bind(this, 'securityLevelFilters')}
                                                    value={queryInfo.securityLevelFilters}
                                                    placeholder='数据分级'
                                                >
                                                    {levelList.map((item) => {
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
                                />
                            ) : null}
                        </div>
                    )
                }}
            />
        )
    }
}
