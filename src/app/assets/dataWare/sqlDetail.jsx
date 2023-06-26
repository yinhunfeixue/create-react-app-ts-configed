import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Card, Input, Spin, Table, Tabs, Tag, Tooltip, TreeSelect, Typography } from 'antd'
import { getRecord, getSqlBasic, getSqlLineage } from 'app_api/dataAssetApi'
import Graph from 'app_page/dama/component/g6Graph'
import _ from 'lodash'
import React, { Component } from 'react'
import './sysDetail.less'

const { Paragraph } = Typography
const { TabPane } = Tabs
const { TextArea } = Input
const TreeNode = TreeSelect.TreeNode
const { CheckableTag } = Tag

export default class SqlDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            basicInfo: {},
            loading: false,
            partitionLoading: false,
            tabValue: '1',
            usedValue: '1',
            bloodValue: '1',

            recordList: [],
            fileLineage: [],

            recordPage: {
                pageSize: 20,
                total: 0,
            },
            graphLoading: false,
            graphWidth: 0,
        }
        this.recordColumns = [
            {
                dataIndex: 'fileId',
                key: 'fileId',
                title: '序号',
                width: '60px',
                render: (text, record, index) => index + 1,
            },
            {
                dataIndex: 'fileName',
                key: 'fileName',
                title: '血缘脚本',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : '-'),
            },
            {
                dataIndex: 'tableName',
                key: 'tableName',
                title: '关联表',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : '-'),
            },
            {
                dataIndex: 'databaseName',
                key: 'databaseName',
                title: '所属库',
                width: '100px',
                render: (text) => text || '-',
            },
            {
                dataIndex: 'dwLevelName',
                key: 'dwLevelName',
                title: '数仓层次',
                width: '100px',
                render: (text) => text || '-',
            },
            {
                dataIndex: 'type',
                key: 'type',
                title: '目标表',
                width: '100px',
                render: (text) => text || '-',
            },
        ]

        this.myBox = React.createRef()
    }
    componentWillMount = async () => {}
    componentDidMount = async () => {
        this.getBasicInfo()
        // this.getLineage()

        this.setState({
            graphWidth: this.myBox.current.offsetWidth - 10,
        })
    }

    // 获取基础信息
    getBasicInfo = async () => {
        this.setState({
            loading: true,
        })
        let res = await getSqlBasic({ id: this.propsParam.id })
        if ((res.code = 200)) {
            this.setState({
                basicInfo: res.data,
            })
        }
        this.setState({
            loading: false,
        })
    }

    searchTableData = () => {}

    getLineage = async () => {
        this.setState({
            graphLoading: true,
        })
        let query = {
            id: this.propsParam.id,
        }
        let res = await getSqlLineage(query)
        if ((res.code = 200)) {
            this.setState({
                fileLineage: res.data,
            })
        }

        this.setState({
            graphLoading: false,
        })
    }

    bloodScriptList = async () => {
        let query = {
            id: this.propsParam.id,
        }
        let res = await getBloodScript(query)
        if ((res.code = 200)) {
            this.setState({
                bloodScriptList: res.data,
            })
        }
    }

    getSqlRecordList = async (params = {}) => {
        this.setState({
            loading: true,
        })
        let query = {
            id: this.propsParam.id,
            page: _.get(params, 'current', 1),
            pageSize: _.get(params, 'pageSize', 20),
        }

        let res = await getRecord(query)
        if ((res.code = 200)) {
            this.setState({
                recordList: res.data,
                recordPage: {
                    pageSize: _.get(params, 'pageSize', 20),
                    total: res.total,
                },
            })
        }
        this.setState({
            loading: false,
        })
    }

    tabKeyChange = (e) => {
        this.setState({
            tabValue: e,
        })
        if (+e === 1) {
            this.getBasicInfo()
        } else if (+e === 2) {
            if (_.isEmpty(this.state.fileLineage)) {
                this.getLineage()
            }
        } else if (+e === 3) {
            this.getSqlRecordList({})
        }
    }

    bloodChange = (e) => {
        this.setState({
            bloodValue: e,
        })
    }

    toSqlData = () => {
        this.props.addTab('sqlFlow', this.state.basicInfo)
    }

    toTable = (item) => {
        this.props.addTab(
            'sysDetail',
            {
                id: item.tableId,
            },
            true
        )
    }

    toSearch = () => {
        this.props.addTab('元数据搜索', {
            data: {
                techniqueManagerId: _.get(this.state.basicInfo, 'techniqueManagerId'),
            },
        })
    }

    refresh = () => {
        this.ChildTable.refresh()
    }

    small = () => {
        this.ChildTable.small()
    }

    large = () => {
        this.ChildTable.large()
    }

    get propsParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    render() {
        const { propsParam } = this
        const { basicInfo, recordList, loading, tabValue, bloodValue, fileLineage, recordPage, graphLoading, graphWidth } = this.state
        return (
            <div className='sysDetail'>
                <header ref={this.myBox}>
                    <img src={require('app_images/dataAsset/code.png')} />
                    <div>
                        <h2>{_.get(basicInfo, 'name')}</h2>
                        <div>
                            {RenderUtil.renderSplitList(
                                [
                                    {
                                        label: '脚本类型：',
                                        content: _.get(basicInfo, 'datasourceType'),
                                    },
                                    {
                                        label: '负责人：',
                                        content: _.get(basicInfo, 'techniqueManager'),
                                    },
                                ],
                                'atomLabel'
                            )}
                        </div>
                    </div>
                </header>
                <main>
                    <Tabs className='assetTab' animated={false} onChange={this.tabKeyChange} activeKey={tabValue}>
                        <TabPane tab='详情' key='1'>
                            <Module title='基础信息'>
                                <div className='MiniForm Grid4'>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '脚本名称',
                                            content: _.get(basicInfo, 'name'),
                                        },
                                        {
                                            label: '技术负责人',
                                            content: _.get(basicInfo, 'techniqueManager'),
                                        },
                                        {
                                            label: '脚本类型',
                                            content: _.get(basicInfo, 'datasourceType'),
                                        },
                                        {
                                            label: '目标表',
                                            content: _.get(basicInfo, 'targetTableInfo')
                                                ? _.get(basicInfo, 'targetTableInfo').map((item) => {
                                                      return (
                                                          <div>
                                                              <a href='javascript:;' style={{ fontSize: '14px' }} onClick={() => this.toTable(item)}>
                                                                  {_.get(item, 'tableEname')}
                                                              </a>
                                                          </div>
                                                      )
                                                  })
                                                : null,
                                        },
                                        {
                                            label: '标签',
                                            content: !_.isEmpty(_.get(basicInfo, 'tagList'))
                                                ? _.get(basicInfo, 'tagList').map((tag) => {
                                                      return <Tag color='purple'>{tag.tagValueName}</Tag>
                                                  })
                                                : null,
                                        },
                                    ])}
                                </div>
                            </Module>
                            <Module
                                renderHeaderExtra={() => {
                                    return (
                                        <Button onClick={this.toSqlData} type='primary' ghost>
                                            SQLFLOW可视化
                                        </Button>
                                    )
                                }}
                                title='脚本内容'
                            >
                                <Input.TextArea rows={15} style={{ height: '400px', border: 'none', color: '#5E6266' }} disabled value={_.get(basicInfo, 'sql', '-')} />
                            </Module>
                        </TabPane>
                        <TabPane tab='血缘信息' key='2'>
                            <Card
                                size='large'
                                extra={
                                    <div className='graph_action_icon'>
                                        <Tooltip title='重置'>
                                            <img onClick={this.refresh} style={{ marginRight: '13px', width: '16px', cursor: 'pointer' }} src={require('app_images/dataAsset/chongzhi.png')} />
                                        </Tooltip>
                                        <Tooltip title='放大'>
                                            <img onClick={this.large} style={{ marginRight: '13px', width: '16px', cursor: 'pointer' }} src={require('app_images/dataAsset/large.png')} />
                                        </Tooltip>
                                        <Tooltip title='缩小'>
                                            <img onClick={this.small} style={{ marginRight: '13px', width: '16px', cursor: 'pointer' }} src={require('app_images/dataAsset/small.png')} />
                                        </Tooltip>
                                    </div>
                                }
                                style={{ marginTop: '16px', minHeight: '650px' }}
                                title={
                                    <div className='link_box_title'>
                                        上游 <div className='link_box' style={{ backgroundColor: '#FF9933' }}></div>
                                        下游 <div className='link_box' style={{ backgroundColor: '#2E8AE6' }}></div>
                                        当前 <div className='link_box' style={{ backgroundColor: '#41BFD9' }}></div>
                                    </div>
                                }
                            >
                                <Spin spinning={graphLoading}>
                                    <Graph onRef={(c) => (this.ChildTable = c)} height={500} width={graphWidth} type='sql' data={fileLineage} id={propsParam.id} />
                                </Spin>
                            </Card>
                        </TabPane>
                        <TabPane tab='使用记录' key='3'>
                            <Table
                                className='dataTable'
                                rowKey='id'
                                loading={loading}
                                columns={this.recordColumns}
                                dataSource={recordList}
                                onChange={this.getSqlRecordList}
                                pagination={
                                    _.get(recordPage, 'total', 0) <= 20
                                        ? false
                                        : {
                                              showQuickJumper: true,
                                              showSizeChanger: true,
                                              pageSizeOptions: ['20', '30', '40', '50'],
                                              pageSize: _.get(recordPage, 'pageSize'),
                                              total: _.get(recordPage, 'total'),
                                              showTotal: () => `共${Math.ceil(_.get(recordPage, 'total') / _.get(recordPage, 'pageSize'))}页, ${_.get(recordPage, 'total')}条数据 `,
                                          }
                                }
                            />
                        </TabPane>
                    </Tabs>
                </main>
            </div>
        )
    }
}
