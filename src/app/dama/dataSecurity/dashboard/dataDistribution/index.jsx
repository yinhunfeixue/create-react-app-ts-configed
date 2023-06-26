// 分布总览
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import LevelTag from '@/component/LevelTag'
import ModuleTitle from '@/component/module/ModuleTitle'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Input, Select, Spin, Tooltip, Tree } from 'antd'
import { dsSysTree, levelListTableByDs, levelStatistic } from 'app_api/dataSecurity'
import { databaseList } from 'app_api/examinationApi'
import Cache from 'app_utils/cache'
import React from 'react'
import Pie from '../component/pie'
import '../index.less'

const { TreeNode } = Tree
let firstChild = {}
export default class DataDistribution extends React.Component {
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
            treeKeyword: '',
            databaseList: [],
            dataPathList: [],
            treeLoading: false,
            selectedKeys: [],
            statisticInfo: {
                tablePieData: [],
                columnPieData: [],
            },
            staticLoading: false,
        }
        this.selectedRows = []
        this.columns = [
            {
                title: '表名称',
                dataIndex: 'tableName',
                key: 'tableName',
                width: 160,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <div className='LineClamp1'>
                                <span className='iconfont icon-biaodanzujian-biaoge tableIcon'></span>
                                {text}
                            </div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '所属库',
                dataIndex: 'databaseName',
                key: 'databaseName',
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
                title: '字段数',
                dataIndex: 'columnCount',
                key: 'columnCount',
                width: 100,
                sorter: true,
                render: (text) => <span>{ProjectUtil.numberFormatWithK(text || 0)}</span>,
            },
            {
                title: '分级字段',
                dataIndex: 'lvlColumnCount',
                key: 'lvlColumnCount',
                width: 120,
                sorter: true,
                render: (text) => <span>{ProjectUtil.numberFormatWithK(text || 0)}</span>,
            },
            {
                title: '敏感字段',
                dataIndex: 'senColumnCount',
                key: 'senColumnCount',
                width: 120,
                sorter: true,
                render: (text) => <span>{ProjectUtil.numberFormatWithK(text || 0)}</span>,
            },
            {
                title: '最高等级',
                dataIndex: 'lvlUpper',
                key: 'lvlUpper',
                width: 120,
                render: (text) => (text ? <LevelTag value={text} /> : <EmptyLabel />),
            },
            {
                title: '最低等级',
                dataIndex: 'lvlLower',
                key: 'lvlLower',
                width: 120,
                render: (text) => (text ? <LevelTag value={text} /> : <EmptyLabel />),
            },
        ]
    }
    componentDidMount = () => {
        this.getTreeData()
    }
    getRightSearchCondition = async () => {
        const { selectedTagCategory } = this.state
        let res = await databaseList({ datasourceId: selectedTagCategory.id, page: 1, page_size: 999999 })
        if (res.code == 200) {
            this.setState({
                databaseList: res.data,
            })
        }
    }
    getTreeData = async () => {
        let { treeKeyword, selectedTagCategory } = this.state
        this.setState({ treeLoading: true })
        let res = await dsSysTree({ keyword: treeKeyword })
        this.setState({ treeLoading: false })
        if (res.code == 200) {
            await this.setState({
                treeData: res.data,
            })
            if (Cache.get('dataDistributionSelected')) {
                await this.setState({
                    selectedTagCategory: Cache.get('dataDistributionSelected'),
                    selectedKeys: [Cache.get('dataDistributionSelected').id],
                })
            } else {
                firstChild = {}
                await this.getFirstChild(res.data[0].children)
            }
            this.reset()
            this.getStaticsInfo()
            this.getRightSearchCondition()
        }
    }
    changeTreeKeyword = async (e) => {
        console.log('value', e.target.value)
        /*  await this.setState({
            treeKeyword: e.target.value
        })
        if (!e.target.value) {
            this.getTreeData()
        } */
    }
    getFirstChild(val) {
        if (JSON.stringify(firstChild) != '{}') {
            return //如果res不再是空对象，退出递归
        } else {
            //遍历数组
            for (let i = 0; i < val.length; i++) {
                //如果当前的isleaf是true,说明是叶子节点，把当前对象赋值给res,并return，终止循环
                if (val[i].children == undefined) {
                    firstChild = val[i]
                    this.setState({
                        selectedTagCategory: val[i],
                        selectedKeys: [val[i].id],
                    })
                    Cache.set('dataDistributionSelected', val[i])
                    return
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
            selectedTagCategory = selectedNode
        }
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            selectedTagCategory,
            queryInfo,
            selectedKeys,
        })
        Cache.set('dataDistributionSelected', selectedTagCategory)
        this.getStaticsInfo()
        this.reset()
        this.getRightSearchCondition()
    }
    getStaticsInfo = async () => {
        let { selectedTagCategory } = this.state
        this.setState({ staticLoading: true })
        let res = await levelStatistic({ datasourceId: selectedTagCategory.id })
        this.setState({ staticLoading: false })
        if (res.code == 200) {
            let tableData = [
                this.numberFloat(res.data.tableLvlOne),
                this.numberFloat(res.data.tableLvlTwo),
                this.numberFloat(res.data.tableLvlThree),
                this.numberFloat(res.data.tableLvlFour),
                this.numberFloat(res.data.tableLvlFive),
            ]
            let columnData = [
                this.numberFloat(res.data.columnLvlOne),
                this.numberFloat(res.data.columnLvlTwo),
                this.numberFloat(res.data.columnLvlThree),
                this.numberFloat(res.data.columnLvlFour),
                this.numberFloat(res.data.columnLvlFive),
            ]
            res.data.tablePieData = this.getPieData(tableData)
            res.data.columnPieData = this.getPieData(columnData)
            await this.setState({
                statisticInfo: res.data,
            })
            this.tablePieChart && this.tablePieChart.initChart()
            this.columnPieChart && this.columnPieChart.initChart()
        }
    }
    getPieData(data) {
        let pieData = [
            { value: data[0], name: ' 一级' },
            { value: data[1], name: ' 二级' },
            { value: data[2], name: ' 三级' },
            { value: data[3], name: ' 四级' },
            { value: data[4], name: ' 五级' },
        ]
        return pieData
    }
    numberFloat(value) {
        if (value) {
            return parseFloat(value.split('%')[0])
        } else {
            return 0
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo, selectedTagCategory } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            datasourceId: selectedTagCategory.id,
            columnCountOrderBy: params.sorter.field == 'columnCount' ? (params.sorter.order == 'ascend' ? 0 : params.sorter.order == 'descend' ? 1 : undefined) : undefined,
            lvlColumnCountOrderBy: params.sorter.field == 'lvlColumnCount' ? (params.sorter.order == 'ascend' ? 0 : params.sorter.order == 'descend' ? 1 : undefined) : undefined,
            senColumnCountOrderBy: params.sorter.field == 'senColumnCount' ? (params.sorter.order == 'ascend' ? 0 : params.sorter.order == 'descend' ? 1 : undefined) : undefined,
        }
        let res = await levelListTableByDs(query)
        if (res.code == 200) {
            res.data.list.map((item) => {
                item.senColumnCountRate = ((item.senColumnCount / item.columnCount) * 100).toFixed(2)
                item.lvlColumnCountRate = ((item.lvlColumnCount / item.columnCount) * 100).toFixed(2)
                let tableData = this.getPercent([item.lvlOneCount, item.lvlTwoCount, item.lvlThreeCount, item.lvlFourCount, item.lvlFiveCount], item.lvlColumnCount)
                item.pieData = this.getPieData(tableData)
            })
            this.setState({
                tableData: res.data.list,
            })
            return {
                total: res.data.total,
                dataSource: res.data.list,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    getPercent(data, total) {
        let array = []
        data.map((item) => {
            let value = total > 0 ? ((item / total) * 100).toFixed(2) : 0
            array.push(value)
        })
        return array
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
    openEditModal = (data) => {
        let { selectedTagCategory } = this.state
        console.log('详情', data)
        data.datasourceId = selectedTagCategory.id
        this.props.addTab('数据分布详情', { ...data })
    }
    render() {
        const { selectedTagCategory, queryInfo, databaseList, dataPathList, treeLoading, treeKeyword, treeData, selectedKeys, statisticInfo, staticLoading } = this.state
        const tableArr = statisticInfo.tablePieData || []
        const tableTotal = tableArr.reduce((cal, cur) => (cal += cur.value), 0)

        const columnArr = statisticInfo.columnPieData || []
        const columnTotal = columnArr.reduce((cal, cur) => (cal += cur.value), 0)

        let tableConfigInfo = {
            legendInfo: {
                show: false,
            },
            seriesInfo: [
                {
                    type: 'pie',
                    radius: ['83%', '90%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                        },
                        emphasis: {
                            show: true,
                            formatter: function (params, ticket, callback) {
                                var name = params.data.name
                                var arr = name.split(':')
                                var percent = params.percent
                                var str = (percent * 1).toFixed(2) + '%' + '\n' + arr[0]
                                return str
                            },
                            textStyle: {
                                fontSize: '15',
                                fontWeight: 'bold',
                                color: '#1A1A1A',
                            },
                        },
                    },
                    emphasis: {
                        scale: true,
                        scaleSize: 3,
                    },
                    labelLine: {
                        show: true,
                    },
                    data: statisticInfo.tablePieData,
                    center: ['50%', '50%'],
                },
            ],
        }
        let columnConfigInfo = {
            legendInfo: { show: false },
            seriesInfo: [
                {
                    type: 'pie',
                    radius: ['83%', '90%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                        },
                        emphasis: {
                            show: true,
                            formatter: function (params, ticket, callback) {
                                var name = params.data.name
                                var arr = name.split(':')
                                var percent = params.percent
                                var str = (percent * 1).toFixed(2) + '%' + '\n' + arr[0]
                                return str
                            },
                            textStyle: {
                                fontSize: '12',
                                fontWeight: 'bold',
                                color: '#1A1A1A',
                            },
                        },
                    },
                    emphasis: {
                        scale: true,
                        scaleSize: 3,
                    },
                    labelLine: {
                        show: true,
                    },
                    data: statisticInfo.columnPieData,
                    center: ['50%', '50%'],
                },
            ],
        }
        return (
            <SliderLayout
                className='dataDashboard dataDistribution'
                style={{ height: '100%' }}
                sliderBodyStyle={{ padding: 0 }}
                renderSliderHeader={() => {
                    return '数据源目录'
                }}
                renderContentHeader={() => {
                    return <div>{selectedTagCategory ? selectedTagCategory.name : ''}</div>
                }}
                renderSliderBody={() => {
                    return ProjectUtil.renderSystemTree(treeData, this.onSelect)
                }}
                renderContentBody={() => {
                    return (
                        <Spin spinning={treeLoading}>
                            {selectedTagCategory.id ? (
                                <Spin spinning={staticLoading}>
                                    <div className='dashboardStatics'>
                                        <div style={{ display: 'flex' }}>
                                            <span className='fieldArea fieldAreaFlex'>
                                                <div style={{ display: 'inline-block' }}>
                                                    <div className='fieldValue'>{statisticInfo.tableControlledPercentage}</div>
                                                    <div className='fieldLabel'>受控表</div>
                                                </div>
                                                <div className='pieChartContainer'>
                                                    {statisticInfo.tablePieData.length ? (
                                                        <Pie height={80} configInfo={tableConfigInfo} elementId='pieChartTable' data={statisticInfo.tablePieData} />
                                                    ) : null}
                                                </div>
                                            </span>
                                            <span className='fieldArea fieldAreaFlex'>
                                                <div style={{ display: 'inline-block' }}>
                                                    <div className='fieldValue'>{statisticInfo.columnControlledPercentage}</div>
                                                    <div className='fieldLabel'>受控字段</div>
                                                </div>
                                                <div className='pieChartContainer'>
                                                    {statisticInfo.columnPieData.length ? (
                                                        <Pie height={80} configInfo={columnConfigInfo} elementId='pieChartField' data={statisticInfo.columnPieData} />
                                                    ) : null}
                                                </div>
                                            </span>
                                            <span className='fieldArea'>
                                                <div className='fieldValue'>{statisticInfo.tableSenPercentage}</div>
                                                <div className='fieldLabel'>敏感表</div>
                                            </span>
                                            <span className='fieldArea'>
                                                <div className='fieldValue'>{statisticInfo.columnSenPercentage}</div>
                                                <div className='fieldLabel'>敏感字段</div>
                                            </span>
                                            <span className='fieldArea'>
                                                <div className='fieldValue'>{ProjectUtil.formNumber(statisticInfo.tableNum || 0)}</div>
                                                <div className='fieldLabel'>表数量</div>
                                            </span>
                                            <span className='fieldArea' style={{ borderRight: 'none' }}>
                                                <div className='fieldValue'>{ProjectUtil.formNumber(statisticInfo.columnNum || 0)}</div>
                                                <div className='fieldLabel'>字段数量</div>
                                            </span>
                                        </div>
                                    </div>
                                </Spin>
                            ) : null}
                            <ModuleTitle title='表列表' />
                            {selectedTagCategory.id ? (
                                <RichTableLayout
                                    disabledDefaultFooter
                                    editColumnProps={{
                                        width: 80,
                                        createEditColumnElements: (index, record) => {
                                            return RichTableLayout.renderEditElements([
                                                {
                                                    label: '详情',
                                                    onClick: this.openEditModal.bind(this, record),
                                                },
                                            ])
                                        },
                                    }}
                                    tableProps={{
                                        columns: this.columns,
                                        key: 'tableId',
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
                                                <Input.Search value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='搜索表' />
                                                <Select
                                                    allowClear
                                                    showSearch
                                                    optionFilterProp='title'
                                                    onChange={this.changeStatus.bind(this, 'databaseId')}
                                                    value={queryInfo.databaseId}
                                                    placeholder='所属库'
                                                >
                                                    {databaseList.map((item) => {
                                                        return (
                                                            <Select.Option title={item.physicalDatabase} value={item.id} key={item.id}>
                                                                {item.physicalDatabase}
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
                                            sorter: sorter || {},
                                        })
                                    }}
                                />
                            ) : null}
                        </Spin>
                    )
                }}
            />
        )
    }
}
