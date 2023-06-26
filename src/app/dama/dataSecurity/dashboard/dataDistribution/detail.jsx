// 数据分布详情
import EmptyLabel from '@/component/EmptyLabel';
import RichTableLayout from '@/component/layout/RichTableLayout';
import LevelTag from '@/component/LevelTag';
import ModuleTitle from '@/component/module/ModuleTitle';
import ProjectUtil from '@/utils/ProjectUtil';
import { Input, Select, Tooltip } from 'antd';
import { listColumnByTableId } from 'app_api/dataSecurity';
import { dataDistributionDetail } from 'app_api/metadataApi';
import React, { Component } from 'react';
import Pie from '../component/pie';
import PreviewModal from '../component/previewModal';
import TableDrawer from '../component/tableDrawer';
import TraitDetailDrawer from '../component/traitDetailDrawer';
import '../index.less';

const { Option } = Select
export default class DataDictionary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: ''
            },
            selectedTable: this.pageParams,
            tableData: [],
            datasourceIds: [],
            databaseList: [],
            total: 0,
            chartOptions: {},
        }
        this.columns = [
            {
                title: '字段名',
                dataIndex: 'columnName',
                key: 'columnName',
                width: 160,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span><span className="iconfont icon-ziduan1 tableIcon"></span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '分类信息',
                dataIndex: 'classPath',
                key: 'classPath',
                width: 200,
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
                title: '分类特征',
                dataIndex: 'eigenName',
                key: 'eigenName',
                width: 120,
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
                title: '安全等级',
                dataIndex: 'level',
                key: 'level',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <LevelTag value={text}/>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '敏感标签',
                dataIndex: 'senName',
                key: 'senName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                        <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentDidMount = () => {
        this.onSelect(this.pageParams);
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    getDetail = async (id) => {
        const res = await dataDistributionDetail({ tableId: id })
        const options = this.getOptions(res);
        this.setState({ chartOptions: options });
    }
    getOptions = (detail) => {
        const arr = [
            {
                name: '一级', value: detail.lvlOneCount || 0,
            }, {
                name: '二级', value: detail.lvlTwoCount || 0,
            }, {
                name: '三级', value: detail.lvlThreeCount || 0,
            }, {
                name: '四级', value: detail.lvlFourCount || 0,
            }, {
                name: '五级', value: detail.lvlFiveCount || 0,
            }
        ]
        const total = arr.reduce((cal,cur) => cal+= cur.value, 0);
        return {
            legend: {
                show: true,
                bottom: '0%',
                // right: '10%',
                icon: 'circle',
                textStyle: {
                    // 文字的样式
                    fontSize: 24, // 可控制每个legend项的间距
                    color: "#5E6266",
                    width: 80,
                    backgroundColor:'transparent',  //这个必须加，不然width不生效
                    rich: {
                        one: {
                            width: 28,
                            color: "#5E6266",
                            fontSize: 14,
                        },
                        two: {
                            width: 50,
                            color: "#2D3033",
                            fontSize: 14,
                            // padding: [0,20,0,0],
                        },
                    },
                },
                itemGap: 20,
                itemWidth: 6,
                orient: 'horizontal',
                formatter: (name) => {
                    const value = (arr.filter(v => v.name == name)[0].value)/total;
                    const res = total === 0 ? 0 : value;
                    return `{one|${name}}  {two|${ ((res.toFixed(2))*100).toFixed(0) }%}`;
                },
            },
            series: [
                {
                    type: 'pie',
                    radius: ['47%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {                   
                            show: false,                    
                            position: 'center'                
                        }, 
                        emphasis: {                    
                            show: true,                    
                            formatter:function(params, ticket, callback) {                    
                                var name = params.data.name;                    
                                var arr = name.split(":");                    
                                var percent = params.percent;    
                                var str = (percent*1).toFixed(0)+'%'+'\n'+ arr[0];              
                                return str;                    
                            },         
                            textStyle: {                        
                                fontSize: '15',                        
                                fontWeight: 'bold' ,
                                color:'#1A1A1A'
                            }               
                        }         
                    },
                    labelLine: {
                        show: true
                    },
                    itemStyle: {
                        borderRadius: 2,
                        borderColor: '#fff',
                        borderWidth: 1
                    },
                    data: arr,
                    center: ['50%', '30%']
                }
            ]
        }
    }
    onSelect = (data) => {
        this.onSelectedTable(data)
    }
    onSelectedTable = async (data) => {
        await this.setState({
            selectedTable: {...data}
        })
        this.reset()
        this.tablePieChart&&this.tablePieChart.initChart()
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
            this.controller.reset();
            const { selectedTable } = this.state;
            // rest时更新图标数据
            this.getDetail((selectedTable || this.pageParams || {}).tableId)
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo, selectedTable } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            tableId: selectedTable.tableId,
        }
        let res = await listColumnByTableId(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data.list,
                total: res.data.total
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
    openEditPage = (data) => {
        let { selectedTable } = this.state
        data.path = selectedTable.datasourceName + '/' + selectedTable.databaseName + '/' + selectedTable.tableName
        this.traitDetailDrawer&&this.traitDetailDrawer.openModal(data)
    }
    openTableDrawer = () => {
        this.tableDrawer&&this.tableDrawer.openModal(this.state.selectedTable, this.pageParams.datasourceId)
    }
    openPreviewPage = (data) => {
        this.previewModal&&this.previewModal.openModal(data)
    }
    render() {
        const {
            queryInfo,
            tableData,
            selectedTable,
            databaseList,
            chartOptions,
        } = this.state
        let configInfo = {
            legendInfo: {
                show: true,
                bottom: '0%',
                // right: '10%',
                icon: 'circle',
                textStyle: {
                    // 文字的样式
                    fontSize: 24, // 可控制每个legend项的间距
                    color: "#5E6266",
                    rich: {
                        one: {
                            width: 28,
                            color: "#5E6266",
                            fontSize: 14,
                        },
                        two: {
                            width: 50,
                            color: "#2D3033",
                            fontSize: 14,
                            // padding: [0,20,0,0],
                        },
                    },
                },
                itemGap: 20,
                itemWidth: 6,
                orient: 'horizontal',
                formatter: (name) => {
                    var target; // 遍历拿到数据
                    for (var i = 0; i < selectedTable.pieData.length; i++) {
                        if (selectedTable.pieData[i].name == name) {
                            target = selectedTable.pieData[i].value;
                        }
                    }
                    return `{one|${name}}  {two|${target}%}`;
                },
            },
            seriesInfo: [
                {
                    // name: "占比",
                    type: 'pie',
                    radius: ['47%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: false,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: true
                    },
                    data: selectedTable.pieData,
                    center: ['50%', '35%']
                }
            ]
        }

        return (
            <div className='dataDistributionDetail'>
                <div className='sliderLayout'>
                    <div className='slider'>
                        <div className='leftHeader'>
                            <div className='headerTitle'>
                                <span>{selectedTable.tableName} {selectedTable.tableNameDesc}</span>
                                <span onClick={this.openTableDrawer} className="iconfont icon-botton_down"></span>
                            </div>
                            <div className="desc">系统路径：{selectedTable.datasourceName}／{selectedTable.databaseName}</div>
                        </div>
                        <div className="dataArea HideScroll">
                            <ModuleTitle style={{ marginBottom: 20 }} title='数据' />
                            <div className="staticsArea Grid3">
                                <div>
                                    <div className="value">{selectedTable.columnCount}</div>
                                    <div className="label">字段数量</div>
                                </div>
                                <div>
                                    <div className="value">{selectedTable.senColumnCountRate}<span>%</span></div>
                                    <div className="label">敏感字段</div>
                                </div>
                                <div>
                                    <div className="value">{selectedTable.lvlColumnCountRate}<span>%</span></div>
                                    <div className="label">受控字段</div>
                                </div>
                            </div>
                            <ModuleTitle style={{ marginBottom: 20 }} title='分级分布' />
                            <div className="pieChartContainer">
                                <Pie height={300} elementId='pieChartField2' options={chartOptions} />
                            </div>
                        </div>
                        <TableDrawer getSelectedData={this.onSelect} ref={(dom) => this.tableDrawer = dom} />
                    </div>
                    <main>
                        <div className='ContentContainer'>
                            <div className='tableContent commonScroll'>
                            
                                <ModuleTitle style={{ marginBottom: 24 }} title='字段详情' />
                                <RichTableLayout
                                    disabledDefaultFooter
                                    smallLayout
                                    editColumnProps={{
                                        width: 120,
                                        createEditColumnElements: (_, record) => {
                                            return RichTableLayout.renderEditElements([
                                                {
                                                    label: '分类',
                                                    onClick: this.openEditPage.bind(
                                                        this,
                                                        record
                                                    ),
                                                    key: 'edit',
                                                    funcCode: '/dama/dataSecurity/dataDistribution/detail/confirm'
                                                },
                                                {
                                                    label: '样例',
                                                    onClick: this.openPreviewPage.bind(
                                                        this,
                                                        record
                                                    ),
                                                    key: 'edit'
                                                }
                                            ])
                                        },
                                    }}
                                    tableProps={{
                                        columns: this.columns,
                                        key: 'columnId',
                                        dataSource: tableData,
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
                                                <Input.Search
                                                    allowClear
                                                    value={queryInfo.keyword}
                                                    onChange={this.changeKeyword}
                                                    onSearch={this.search}
                                                    placeholder='搜索字段'
                                                />
                                            </React.Fragment>
                                        )
                                    }}
                                    requestListFunction={(page, pageSize, filter, sorter) => {
                                        return this.getTableList({
                                            pagination: {
                                                page,
                                                page_size: pageSize,
                                            },
                                            sorter: sorter || {}
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </main>
                </div>
                <TraitDetailDrawer search={this.search} ref={(dom) => this.traitDetailDrawer = dom} />
                <PreviewModal ref={(dom) => this.previewModal = dom} />
            </div>
        )
    }

}