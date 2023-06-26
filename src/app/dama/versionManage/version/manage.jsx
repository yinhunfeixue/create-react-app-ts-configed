import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import PermissionWrap from '@/component/PermissionWrap'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Input, message, Select, Spin, Tabs, Tooltip } from 'antd'
import { latestDiffDetail, latestDiffDetailFilters, latestDiffStatistic, latestDiffTree, latestVersionList } from 'app_api/autoManage'
import React from 'react'
import ChangeDetailDrawer from '../change/component/changeDetailDrawer'
import VersionDrawer from './component/versionDrawer'
import './index.less'

const TabPane = Tabs.TabPane
let firstChild = {}
export default class Manage extends React.Component {
    constructor() {
        super()
        this.state = {
            selectedTagCategory: {},
            treeData: [],
            taskDetail: [],
            staticsList: [{ name: '表' }, { name: '字段' }, { name: '代码项' }, { name: '代码值' }],
            isDataWarehouse: false,
            tableData: [],
            queryInfo: {
                keyword: '',
            },
            userList: [],
            tabValue: '1',
            version: undefined,
            tag: '',
            versionList: [{ id: 1, name: '123' }],
            spinning: false,
            versionFilters: [],
            statusFilters: [],
            databaseFilters: [],
            treeQueryInfo: {},
            treeKey: 1,
        }
        this.selectedRows = []
        this.columns = [
            {
                title: '表名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据库',
                dataIndex: 'databaseName',
                key: 'databaseName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '变更状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record) => (text ? <span className='LineClamp'>{this.getStatusName(text)}</span> : <EmptyLabel />),
            },
            {
                title: '变更说明',
                dataIndex: 'desc',
                key: 'desc',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '字段更新数量',
                dataIndex: 'subItemAlterCount',
                key: 'subItemAlterCount',
                render: (text, record) => text,
            },
            {
                title: '所属系统版本号',
                dataIndex: 'version',
                key: 'version',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
        this.codeItemColumns = [
            {
                title: '代码项',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据库',
                dataIndex: 'databaseName',
                key: 'databaseName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '变更状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record) => (text ? <span className='LineClamp'>{this.getStatusName(text)}</span> : <EmptyLabel />),
            },
            {
                title: '变更说明',
                dataIndex: 'desc',
                key: 'desc',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '代码值更新数量',
                dataIndex: 'subItemAlterCount',
                key: 'subItemAlterCount',
                render: (text, record) => text,
            },
            {
                title: '所属系统版本号',
                dataIndex: 'version',
                key: 'version',
                render: (text, record) =>
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
    getVersionList = async () => {
        this.setState({ version: undefined })
        let { version, selectedTagCategory, tag } = this.state
        this.setState({ spinning: true })
        console.log('selectedTagCategory.id ', selectedTagCategory.id)
        let res = await latestVersionList({ datasourceId: selectedTagCategory.id })
        this.setState({ spinning: false })
        if (res.code == 200) {
            if (res.data.length) {
                res.data.map((item) => {
                    if (item.latest) {
                        version = item.version
                        tag: item.tag
                    }
                })
                await this.setState({
                    versionList: res.data,
                    version,
                    tag,
                })
                this.getStaticData()
                this.search()
                this.getFilters()
            } else {
                this.setState({
                    version: undefined,
                    tag: '',
                    versionList: [],
                })
                message.info('该系统暂无版本')
            }
        }
    }
    getStaticData = async () => {
        let { version, selectedTagCategory, staticsList } = this.state
        let query = {
            version,
            datasourceId: selectedTagCategory.id,
        }
        this.setState({ spinning: true })
        let res = await latestDiffStatistic(query)
        this.setState({ spinning: false })
        if (res.code == 200) {
            res.data.map((item) => {
                item.name = item.type == 'table' ? '表' : item.type == 'column' ? '字段' : item.type == 'code' ? '代码项' : '代码值'
            })
            staticsList = [{ name: '表' }, { name: '字段' }, { name: '代码项' }, { name: '代码值' }]
            staticsList.map((node, index) => {
                res.data.map((item) => {
                    if (item.name == node.name) {
                        node.created = item.created
                        node.deleted = item.deleted
                        node.updated = item.updated
                    }
                })
            })
            this.setState({
                taskDetail: res.data,
                staticsList,
            })
        }
    }
    getFilters = async () => {
        let { version, selectedTagCategory, tabValue } = this.state
        let query = {
            version,
            domain: tabValue == '1' ? 'table' : 'code',
            datasourceId: selectedTagCategory.id,
        }
        let res = await latestDiffDetailFilters(query)
        if (res.code == 200) {
            this.setState({
                databaseFilters: res.data.databaseFilters,
                statusFilters: res.data.statusFilters,
                versionFilters: res.data.versionFilters,
            })
        }
    }
    getTreeData = async () => {
        let res = await latestDiffTree()
        if (res.code == 200) {
            await this.setState({
                treeData: res.data,
                treeKey: this.state.treeKey + 1,
            })
            if (res.data[0]) {
                console.log('res.data[0].children', res.data)
                await this.getFirstChild(res.data[0].children)
                //this.systemTree && this.systemTree.getTreeData(this.state.treeData, [this.state.selectedTagCategory.id], true)
                this.getVersionList()
            }
        }
    }
    getFirstChild = async (val) => {
        //遍历数组
        for (let i = 0; i < val.length; i++) {
            //如果当前的isleaf是true,说明是叶子节点，把当前对象赋值给res,并return，终止循环
            if (val[i].type == 1) {
                firstChild = val[i]
                await this.setState({
                    selectedTagCategory: firstChild.children[0],
                    isDataWarehouse: firstChild.dataWarehouse,
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
        // if (JSON.stringify(firstChild) != '{}') {
        //     return //如果res不再是空对象，退出递归
        // } else {
        // }
    }
    onSelect = async (selectedKeys, e) => {
        console.log('adsasd', this.treeNode)
        let { queryInfo } = this.state
        console.log(selectedKeys, e)
        this.setState({ selectedTagCategory: {} })
        let { selectedTagCategory, isDataWarehouse } = this.state
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
        await this.getVersionList()
    }
    getTableList = async (params = {}) => {
        let { queryInfo, tabValue, version, selectedTagCategory } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            domain: tabValue == '1' ? 'table' : 'code',
            version,
            datasourceId: selectedTagCategory.id,
        }
        let res = await latestDiffDetail(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                treeQueryInfo: query,
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
        let { treeQueryInfo, selectedTagCategory, databaseFilters, statusFilters, versionFilters } = this.state
        let drawerTitle = '变更详情' + '（' + selectedTagCategory.name + '）'
        let filterInfo = {
            databaseFilters,
            statusFilters,
            versionFilters,
        }
        this.changeDetailDrawer && this.changeDetailDrawer.openModal(data, treeQueryInfo, drawerTitle, filterInfo, 'latestDiffDetail')
    }
    changeTab = async (e) => {
        await this.setState({
            tabValue: e,
        })
        this.reset()
        this.getFilters()
    }
    changeVersion = async (e) => {
        await this.setState({
            version: e,
        })
        this.getStaticData()
        this.search()
        this.getFilters()
    }
    openVersionModal = () => {
        let { version, versionList, selectedTagCategory } = this.state
        this.versionDrawer && this.versionDrawer.openModal(selectedTagCategory, version, versionList)
    }
    setVersion = () => {
        this.getTreeData()
    }
    openSubscribePage = () => {
        this.props.addTab('变更订阅')
    }
    getStatusName = (value) => {
        let { statusFilters } = this.state
        if (value) {
            for (let i = 0; i < statusFilters.length; i++) {
                if (statusFilters[i].id == value) {
                    return statusFilters[i].name
                }
            }
        } else {
            return ''
        }
    }
    render() {
        const { selectedTagCategory, queryInfo, tabValue, staticsList, version, versionList, spinning, versionFilters, statusFilters, databaseFilters, treeData, tableData, treeKey } = this.state
        console.log('selectedTagCategory', selectedTagCategory)
        return (
            <div className='versionCompareResult'>
                {treeData.length ? (
                    <SliderLayout
                        style={{ height: '100%' }}
                        renderSliderHeader={() => {
                            return '系统更新目录'
                        }}
                        sliderBodyStyle={{ padding: 0 }}
                        renderContentHeader={() => {
                            return <div style={{ width: '100%', lineHeight: '32px' }}>{selectedTagCategory.name}更新报告</div>
                        }}
                        renderContentHeaderExtra={() => {
                            return (
                                <div className='versionSelect'>
                                    <span>系统版本：</span>
                                    <Select
                                        showSearch
                                        style={{ width: 240, marginRight: 8 }}
                                        optionFilterProp='title'
                                        onChange={this.changeVersion}
                                        value={version}
                                        dropdownClassName='versionSelectDropdown'
                                        placeholder='请选择'
                                    >
                                        {versionList.map((item) => {
                                            return (
                                                <Select.Option title={item.version} key={item.version} value={item.version}>
                                                    {item.latest ? <span className='newTag'>最新</span> : null}
                                                    {item.version}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                    <PermissionWrap funcCode='/md/version/manage/openVersion'>
                                        <Button onClick={this.openVersionModal} type='primary'>
                                            定版
                                        </Button>
                                    </PermissionWrap>
                                </div>
                            )
                        }}
                        renderSliderBody={() => ProjectUtil.renderSystemTree(treeData, this.onSelect, { treeKey })}
                        renderContentBody={() => {
                            return (
                                <div>
                                    <div>
                                        <ModuleTitle style={{ marginBottom: 15 }} title='更新统计' />
                                        <Spin spinning={spinning}>
                                            <div className='resultStatics Grid2'>
                                                {staticsList.map((item, index) => {
                                                    return (
                                                        <div className='staticsItem'>
                                                            <div className='staticsItemTitle'>
                                                                {item.name == '表' ? <img src={require('app_images/dataCompare/table.png')} /> : null}
                                                                {item.name == '字段' ? <img src={require('app_images/dataCompare/column.png')} /> : null}
                                                                {item.name == '代码项' ? <img src={require('app_images/dataCompare/codeItem.png')} /> : null}
                                                                {item.name == '代码值' ? <img src={require('app_images/dataCompare/codeValue.png')} /> : null}
                                                                {item.name}
                                                            </div>
                                                            {item.created || item.deleted || item.updated ? (
                                                                <div style={{ marginLeft: 28 }}>
                                                                    <div className='Grid3'>
                                                                        <div>
                                                                            <div className='titleName'>新增</div>
                                                                            <div className='value'>
                                                                                {ProjectUtil.numberFormat(item.created)}
                                                                                {item.created > 9999 ? <span style={{ fontSize: '14px' }}>万</span> : null}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div className='titleName'>删除</div>
                                                                            <div className='value'>
                                                                                {ProjectUtil.numberFormat(item.deleted)}
                                                                                {item.deleted > 9999 ? <span style={{ fontSize: '14px' }}>万</span> : null}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div className='titleName'>修改</div>
                                                                            <div className='value'>
                                                                                {ProjectUtil.numberFormat(item.updated)}
                                                                                {item.updated > 9999 ? <span style={{ fontSize: '14px' }}>万</span> : null}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className='emptyText'>- 暂无更新内容 -</div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </Spin>
                                        <ModuleTitle style={{ marginBottom: 15, marginTop: 40 }} title='更新详情' />
                                        {version ? (
                                            <RichTableLayout
                                                className='tableResult'
                                                disabledDefaultFooter
                                                renderDetail={() => {
                                                    return (
                                                        <Tabs animated={false} onChange={this.changeTab} activeKey={tabValue}>
                                                            <TabPane tab='表' key='1'></TabPane>
                                                            <TabPane tab='代码项' key='2'></TabPane>
                                                        </Tabs>
                                                    )
                                                }}
                                                editColumnProps={{
                                                    width: 120,
                                                    createEditColumnElements: (_, record) => {
                                                        return [
                                                            <a onClick={this.openDetailPage.bind(this, record)} key='detail'>
                                                                变更详情
                                                            </a>,
                                                        ]
                                                    },
                                                }}
                                                tableProps={{
                                                    columns: tabValue == '1' ? this.columns : this.codeItemColumns,
                                                    key: 'id',
                                                    extraTableProps: {
                                                        key: tabValue,
                                                    },
                                                }}
                                                renderSearch={(controller) => {
                                                    this.controller = controller
                                                    return (
                                                        <React.Fragment>
                                                            <Input.Search
                                                                value={queryInfo.keyword}
                                                                onChange={this.changeKeyword}
                                                                onSearch={this.search}
                                                                placeholder={tabValue == '1' ? '请输入表名' : '请输入代码项'}
                                                            />
                                                            <Select
                                                                allowClear
                                                                showSearch
                                                                optionFilterProp='title'
                                                                onChange={this.changeStatus.bind(this, 'filterDbId')}
                                                                value={queryInfo.filterDbId}
                                                                placeholder='数据库'
                                                            >
                                                                {databaseFilters.map((item) => {
                                                                    return (
                                                                        <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                            {item.name}
                                                                        </Select.Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                            <Select
                                                                allowClear
                                                                showSearch
                                                                optionFilterProp='title'
                                                                onChange={this.changeStatus.bind(this, 'status')}
                                                                value={queryInfo.status}
                                                                placeholder='变更类型'
                                                            >
                                                                {statusFilters.map((item) => {
                                                                    return (
                                                                        <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                            {item.name}
                                                                        </Select.Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                            <Select
                                                                allowClear
                                                                showSearch
                                                                optionFilterProp='title'
                                                                onChange={this.changeStatus.bind(this, 'filterVersion')}
                                                                value={queryInfo.filterVersion}
                                                                placeholder='系统版本'
                                                            >
                                                                {versionFilters.map((item) => {
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
                                    <VersionDrawer setVersion={this.setVersion} ref={(dom) => (this.versionDrawer = dom)} />
                                    <ChangeDetailDrawer showSlider={true} from='version' ref={(dom) => (this.changeDetailDrawer = dom)} />
                                </div>
                            )
                        }}
                    />
                ) : (
                    <Spin spinning={spinning}>
                        <div className='emptyIcon'>
                            <img src={require('app_images/dataCompare/empty_icon.png')} />
                            <div className='titleName'>暂无系统更新</div>
                            <div style={{ margin: '8px 0 24px 0' }}>若有你关注的数据源，你可以开启数据源订阅功能。将不再错过数据源最新情况</div>
                            <PermissionWrap funcCode='/md/version/manage/subscribe'>
                                <Button type='primary' onClick={this.openSubscribePage}>
                                    订阅管理
                                </Button>
                            </PermissionWrap>
                        </div>
                    </Spin>
                )}
            </div>
        )
    }
}
