
import IconFont from '@/component/IconFont'
import SliderLayout2 from '@/component/layout/SliderLayout2'
import ModuleTitle from '@/component/module/ModuleTitle'
import PageHeader from '@/component/PageHeader'
import PageUtil from '@/utils/PageUtil'
import ProjectUtil from '@/utils/ProjectUtil'
import { Collapse, Input, Tabs } from 'antd'
import { getRecord, getSqlBasic, getSqlLineage } from 'app_api/dataAssetApi'
import { Empty, ListHorizontal, LzTable } from 'cps'
import _ from 'lodash'
import React, { Component, ReactNode } from 'react'
import './SqlDetailPage.less'
import EmptyLabel from '@/component/EmptyLabel'
import MetaDataType from '@/app/metadataCenter/enum/MetaDataType'

import SqlFlow from '@/app/lineage/sqlFlow/index'

import { format } from 'sql-formatter';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface ISysDetailPageSate {
    basicInfo: any
    loading: boolean
    fieldList: any[]
    fieldInput: string
    fieldPage: {
        pageSize: number
        total: number
    }
    partitionFieldList: any[]
    tabValue: string
    tableId: string
    usedValue: string
    bloodValue: string
    partitionLoading: boolean
    bloodScriptList: any[]
    bloodHotList: any[]
    relationsList: any[]
    bloodScriptPage: {
        pageSize: number
        total: number
    }
    relationsPage: {
        pageSize: number
        total: number
    }
    columnId: string

    queryInfo: {
        keyword: string
    }
    scrolled: boolean
    showScrollBtn: boolean
    ddlVisible: boolean
    graphLoading: boolean
    graphWidth: number
    fileLineage: any[]
}

/**
 * 表详情页
 */
class SysDetailPage extends Component<any, ISysDetailPageSate> {

    private recordColumns = [
      {
        title: '血缘脚本',
        dataIndex: 'fileName',
      }, {
        title: '关联表',
        dataIndex: 'tableName',
        render: (text: any, record: any) => {
            return text ? <a onClick={() => this.linkToDetail(record)}>{text}</a> : <EmptyLabel/>
        }
      }, {
        title: '所属库',
        dataIndex: 'databaseName'
      }, {
        title: '数仓层级',
        dataIndex: 'dwLevelName'
      }, {
        title: '类型',
        dataIndex: 'type'
      }
    ]

    private ChildTable: any = {}

    constructor(props: any) {
        super(props)
        this.state = {
            basicInfo: {},
            loading: false,
            fieldList: [],
            fieldInput: '',
            fieldPage: {
                pageSize: 20,
                total: 0,
            },
            tabValue: this.pageParam.tabValue || 'field',
            partitionFieldList: [],
            tableId: this.dataId,

            usedValue: '1',
            bloodValue: '1',
            partitionLoading: false,

            bloodScriptList: [],
            bloodHotList: [],
            relationsList: [],
            bloodScriptPage: {
                pageSize: 20,
                total: 0,
            },
            relationsPage: {
                pageSize: 20,
                total: 0,
            },
            columnId: '',

            queryInfo: {
                keyword: '',
            },
            showScrollBtn: false,
            scrolled: false,
            ddlVisible: false,
            graphLoading: false,
            graphWidth: 0,
            fileLineage: []
        }
    }

    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    get dataId() {
        const params = ProjectUtil.getPageParam(this.props)
        return params.id || params.data.id
    }

    componentDidMount() {
        this.getBasicInfo()
    }

    private linkToDetail = (data: any) => {
        console.log('link');
        this.props.addTab('sysDetail', { id: data.tableId }, true)
    }

    private bloodScriptList = async (params = {}) => {
        let query = {
            id: this.dataId,
            page: _.get(params, 'current', 1),
            pageSize: _.get(params, 'pageSize', 20),
        }
        let res = await getBloodScript(query)
        if ((res.code = 200)) {
            this.setState({
                bloodScriptList: this.addNum(res.data, _.get(params, 'current', 1), _.get(params, 'pageSize', 20)),
                bloodScriptPage: {
                    pageSize: _.get(params, 'pageSize', 20),
                    total: res.total,
                },
            })
        }
    }

    private renderBaseDetail() {
        const { basicInfo } = this.state
        if (!basicInfo) {
            return null
        }

        const list = [
            {
                label: '所属系统',
                content: _.get(basicInfo, 'belongSystem', ''),
            },
            {
                label: '数据源',
                content: _.get(basicInfo, 'datasourceName', ''),
            },
            {
                label: '脚本类型',
                content: _.get(basicInfo, 'datasourceType', ''),
            }
        ]
        console.log('baseDetail', list);
        return this.renderDetailList(list)
    }

    private renderManageDetail() {
        const { basicInfo } = this.state
        const list = [
            {
                label: '技术归属部门',
                content: _.get(basicInfo, 'techniqueManagerDeptName', ''),
            },
            {
                label: '技术负责人',
                content: _.get(basicInfo, 'techniqueManager', ''),
            }
        ]

        return this.renderDetailList(list)
    }

    private renderDetailList(list: any[]) {
        const hasInfo = Boolean(list.find((item) => Boolean(item.content)))
        /* return hasInfo ? <div className='MiniForm Grid1 FormPart '>{RenderUtil.renderFormItems(list)}</div> : null */
        return hasInfo ? <ListHorizontal.Wrap className="listHorizontal">{ list.map((v, index) => <ListHorizontal toolTipWidth={144} valueToolTip style={{ marginBottom: index === list.length - 1 ? 0 : 16 }} key={v.label} {...v} />) }</ListHorizontal.Wrap> : null;
    }

    private renderTechDetail() {
        const { basicInfo } = this.state

        const list = [
            {
                label: '最新变更时间',
                content: _.get(basicInfo, 'lastUpdateTime', ''),
            },
            {
                label: '创建时间',
                content: _.get(basicInfo, 'createTime', ''),
            },
        ]
        return this.renderDetailList(list)
    }

    getBasicInfo = async () => {
      this.setState({
          loading: true,
      })
      let res = await getSqlBasic({ id: this.dataId })
      if ((res.code = 200)) {
          this.setState({
              basicInfo: res.data,
          })
      }
      this.setState({
          loading: false,
      })
    }

    getLineage = async () => {
        this.setState({
            graphLoading: true,
        })
        let query = {
            id: this.dataId,
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

    private toSql = (item: any) => {
        PageUtil.addTab(
            'sqlDetail',
            {
                id: _.get(item, 'fileId'),
            },
            true
        )
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

    openTableDetail = (data: any) => {
        PageUtil.addTab('sysDetail', { id: data.relationTableId }, true)
    }

    private renderSliderContent() {
        const panelList: {
            title: string
            icon: string
            content?: ReactNode
            visible?: boolean
            emptyLabel: ReactNode
        }[] = [
            {
                title: '基本信息',
                emptyLabel: '暂无信息',
                icon: 'icon-xinxi',
                content: this.renderBaseDetail(),
            },
            {
                title: '管理信息',
                emptyLabel: '暂无信息',
                icon: 'icon-geren',
                content: this.renderManageDetail(),
            },
            {
                title: '技术信息',
                emptyLabel: '暂无信息',
                icon: 'icon-jishu',
                content: this.renderTechDetail(),
            },
        ]

        return (
            <Collapse ghost defaultActiveKey={'0'} style={{ marginTop: 8 }}>
                {panelList.map((item, index) => {
                    const { title, content } = item
                    return (
                        <Collapse.Panel
                            showArrow={false}
                            collapsible={content ? undefined : 'disabled'}
                            key={index.toString()}
                            extra={content ? <IconFont type='icon-you' className='CollapseItemHeaderArrow' /> : <span style={{ color: '#C4C8CC' }}>{item.emptyLabel}</span>}
                            header={
                                <span className='CollapseItemHeader'>
                                    <IconFont className='CollapseItemHeaderIcon' type={item.icon} />
                                    {title}
                                </span>
                            }
                        >
                            {content}
                        </Collapse.Panel>
                    )
                })}
            </Collapse>
        )
    }

    private addNum = (data: any, current: number, pageSize: number) => {
        const list: any[] = []
        data.forEach((item: any, index: number) => {
            const basic = pageSize * (current - 1)
            const obj = {
                ...item,
                num: basic + index + 1,
            }
            list.push(obj)
        })

        return list
    }

    private renderUseRecordContent() {
        return (
            <>
              <div className='ContentWrap'>
                <ModuleTitle title="使用记录" />
                <LzTable
                    rowKey={'id'}
                    columns={this.recordColumns}
                    request={async (params = {}) => {
                        console.log('params', params);
                        const res = await getRecord({
                            id: this.dataId,
                            page: params.current,
                            pageSize: params.pageSize,
                        })
                        return {
                            data: res.data,
                            total: res.total
                        }
                    }}
                />
              </div>
            </>
        )
    }

    toSqlData = () => {
        this.props.addTab('sqlFlow', this.state.basicInfo)
    }

    private renderSqlContent() {
        const { basicInfo } = this.state;
        return (
            (
                <div className="sqlVisible">
                    {/* <a className='link' onClick={this.toSqlData} type='primary'>
                        SQLFLOW可视化 <span className="iconfont icon-you"></span>
                    </a> */}
                    <SyntaxHighlighter language="sql" style={docco} showLineNumbers>
                        {
                            format(_.get(basicInfo, 'sql', '-'), {

                            })
                        }
                    </SyntaxHighlighter>
                    {/* <Input.TextArea rows={15} style={{ border: 'none', color: '#5E6266' }} disabled value={_.get(basicInfo, 'sql', '-')} /> */}
                </div>
            )
        )
    }

    private renderBloodVisible() {
        return  (
            <>
                <SqlFlow fileId={this.dataId} />
            </>
        )
    }

    private renderContent() {
        const { tableId, tabValue } = this.state
        const fields = this.pageParam.fields
        const list: {
            label: string
            key: string
            content?: ReactNode
            visible?: boolean
        }[] = [
            {
                label: '脚本内容',
                key: 'field',
                content: this.renderSqlContent(),
            },
            {
                label: '血缘可视化',
                key: 'graph',
                content: this.renderBloodVisible(),
            },
            {
                label: '使用记录',
                key: 'useRecord',
                content: this.renderUseRecordContent(),
            },
        ]
        return (
            <Tabs className='SysDetailPageTabs' animated={false} onChange={this.tabKeyChange} activeKey={tabValue}>
                {list.map((item, index) => {
                    return (
                        <Tabs.TabPane key={item.key} tab={item.label}>
                            {item.content}
                        </Tabs.TabPane>
                    )
                })}
            </Tabs>
        )
    }

    tabKeyChange = (key: string | number) => {
        this.setState({
            tabValue: key as string,
        })
        if (key === 'graph') {
            if (_.isEmpty(this.state.fileLineage)) {
                this.getLineage()
            }
        }
    }

    render() {
        const { basicInfo } = this.state;
        console.log('basicInfo',basicInfo);
        
        return (
            <div className='SysDetailPage'>
                <PageHeader title={<span className="titleIcon"><IconFont type={MetaDataType.icon(MetaDataType.SQL)} style={{ fontSize: 26 }} />{(basicInfo || {}).name}</span>} />
                <SliderLayout2
                    className='SysDetailPageContent'
                    renderSlider={() => {
                        return this.renderSliderContent()
                    }}
                    renderContent={() => {
                        return this.renderContent()
                    }}
                />
            </div>
        )
    }
}

export default SysDetailPage
