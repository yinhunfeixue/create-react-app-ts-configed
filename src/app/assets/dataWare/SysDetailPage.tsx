
import TableGraphPage from '@/app/graph/TableGraphPage'
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import { IRichTableLayoutContoler } from '@/component/layout/RichTableLayout'
import SliderLayout2 from '@/component/layout/SliderLayout2'
import PageHeader from '@/component/PageHeader'

import PageUtil from '@/utils/PageUtil'
import ProjectUtil from '@/utils/ProjectUtil'

import GraphTargetType from '@/app/graph/enum/GraphTargetType'
import MetaDataType from '@/app/metadataCenter/enum/MetaDataType'
import ErPage from '@/app/metadataCenter/ErPage'
import ModuleTitle from '@/component/module/ModuleTitle'
import { Modal as AntdModal, Button, Collapse, message, Popover, Radio, Spin, Tabs, Tooltip } from 'antd'
import { tableVersionList } from 'app_api/autoManage'
import { foreignRelation, getBloodHot, getBloodScript, getRelation, getRelationTable, getSysBasic, getSysBasicOverview, getSysColumn, getSysPartitionColumn } from 'app_api/dataAssetApi'
import { ListHorizontal, LzTable } from 'cps'
import _ from 'lodash'
import React, { Component, ReactNode } from 'react'
import { format } from 'sql-formatter'
import './SysDetailPage.less'

import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

interface ISysDetailPageSate {
    basicInfo: any
    basicOverviewInfo: any
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
    basicInfoLoading: boolean
    recordRadioValue: '1' | '2'
}

/**
 * 表详情页
 */
class SysDetailPage extends Component<any, ISysDetailPageSate> {
    private partionColumns = [
        {
            dataIndex: 'physicalField',
            key: 'physicalField',
            title: '字段英文名',
            render: (text: string) =>
                text ? (
                    <Tooltip placement='topLeft' title={text}>
                        <span>{text}</span>
                    </Tooltip>
                ) : (
                    <EmptyLabel />
                ),
        },
        {
            dataIndex: 'physicalFieldDesc',
            key: 'physicalFieldDesc',
            title: '字段中文名',
            render: (text: string) =>
                text ? (
                    <Tooltip placement='topLeft' title={text}>
                        <span className='LineClamp'>{text}</span>
                    </Tooltip>
                ) : (
                    <EmptyLabel />
                ),
        },
        {
            dataIndex: 'columnStandardCname',
            key: 'columnStandardCname',
            title: '数据标准',
            render: (text: string, record: any) =>
                text ? (
                    <Tooltip placement='topLeft' title={text}>
                        <a onClick={this.onView.bind(this, record)} className='LineClamp'>
                            {text}
                        </a>
                    </Tooltip>
                ) : (
                    <EmptyLabel />
                ),
        },
        {
            dataIndex: 'securityLevel',
            key: 'securityLevel',
            title: '安全等级',
            render: (text: string) => {
                if (text) {
                    return <div>{text ? text : <EmptyLabel />}</div>
                } else {
                    return <EmptyLabel />
                }
            },
        },
        {
            dataIndex: 'dataType',
            key: 'dataType',
            title: '类型',
            render: (text: string) => text || <EmptyLabel />,
        },
        {
            dataIndex: 'dataLength',
            key: 'dataLength',
            title: '长度',
            render: (text: string) => text || <EmptyLabel />,
        },
        {
            dataIndex: 'partitionFormat',
            key: 'partitionFormat',
            title: '分区格式',
            render: (text: string) => text || <EmptyLabel />,
        },
        {
            dataIndex: 'x',
            key: 'x',
            title: '其他信息',
            render: (_: string, record: any) => {
                return (
                    <div className='otherInfo'>
                        {record.desensitiseTag ? (
                            <Popover trigger='click' placement='topLeft' content={this.renderPopover(record, 1)}>
                                <div className='otherInfoItem otherInfoItemSelected'>敏感</div>
                            </Popover>
                        ) : (
                            <div className='otherInfoItem'>敏感</div>
                        )}
                        {record.qaRuleList ? (
                            <Popover trigger='click' placement='topLeft' content={this.renderPopover(record, 2)}>
                                <div className='otherInfoItem otherInfoItemSelected'>质量</div>
                            </Popover>
                        ) : (
                            <div className='otherInfoItem'>质量</div>
                        )}
                        {record.codeItem ? (
                            <Popover trigger='click' placement='topLeft' content={this.renderPopover(record, 3)}>
                                <div className='otherInfoItem otherInfoItemSelected'>代码项</div>
                            </Popover>
                        ) : (
                            <div className='otherInfoItem'>代码项</div>
                        )}
                    </div>
                )
            },
        },
    ]

    private fieldColumns = [
        {
            dataIndex: 'physicalField',
            key: 'physicalField',
            title: '字段英文名',
            render: (text: string, record: any) =>
                text ? (
                    <Tooltip placement='topLeft' title={record.partitionFlag ? '分区' : text}>
                        <span className='LineClamp'>
                            {
                                (record.isForeignKey || record.isPrimarykey) && (
                                    <IconFont className="keySvgWrap" type={record.isForeignKey?'icon-waijian2':'icon-zhujian2' } />
                                )
                            }
                            {
                                record.partitionFlag && (
                                    <IconFont className="keySvgWrap" type='icon-fenqu2'/>
                                )
                            }
                            {text}
                        </span>
                    </Tooltip>
                ) : (
                    <EmptyLabel />
                ),
        },
        {
            dataIndex: 'physicalFieldDesc',
            key: 'physicalFieldDesc',
            title: '字段中文名',
            render: (text: string) =>
                text ? (
                    <Tooltip placement='topLeft' title={text}>
                        <span className='LineClamp'>{text}</span>
                    </Tooltip>
                ) : (
                    <EmptyLabel />
                ),
        },
        {
            dataIndex: 'dataType',
            key: 'dataType',
            title: '字段类型',
            render: (text: string, record: any) =>
                text ? (
                    <Tooltip placement='topLeft' title={text}>
                        <span className='LineClamp'>
                            {text}
                            {
                                (record.dataLength || record.dataPrecision) && `（${[record.dataLength, record.dataPrecision].filter(v => (v !== undefined && v!== null)).join(',')}）`
                            }
                        </span>
                    </Tooltip>
                ) : (
                    <EmptyLabel />
                ),
        },
        {
            dataIndex: 'columnStandardCname',
            key: 'columnStandardCname',
            title: '数据标准',
            render: (text: string, record: any) =>
                text ? (
                    <Tooltip placement='topLeft' title={text}>
                        <a onClick={this.onView.bind(this, record)} className='LineClamp'>
                            {text}
                        </a>
                    </Tooltip>
                ) : (
                    <EmptyLabel />
                ),
        },
        {
            dataIndex: 'securityLevel',
            key: 'securityLevel',
            title: '安全等级',
            render: (text: string) => {
                if (text) {
                    return <div>{text ? text : <EmptyLabel />}</div>
                } else {
                    return <EmptyLabel />
                }
            },
        },
        {
            dataIndex: 'securityClassPath',
            key: 'securityClassPath',
            title: '安全分类',
            render: (text: string) => {
                if (text) {
                    return <div>{text ? text : <EmptyLabel />}</div>
                } else {
                    return <EmptyLabel />
                }
            },
        },
        {
            dataIndex: 'x',
            key: 'x',
            title: '其他信息',
            render: (text: string, record: any) => {
                return (
                    <div className='otherInfo'>
                        {record.desensitiseTag ? (
                            <Popover trigger='click' placement='topLeft' content={this.renderPopover(record, 1)}>
                                <div className='otherInfoItem otherInfoItemSelected'>敏感</div>
                            </Popover>
                        ) : (
                            <div className='otherInfoItem'>敏感</div>
                        )}
                        {record.qaRuleList ? (
                            <Popover trigger='click' placement='topLeft' content={this.renderPopover(record, 2)}>
                                <div className='otherInfoItem otherInfoItemSelected'>质量</div>
                            </Popover>
                        ) : (
                            <div className='otherInfoItem'>质量</div>
                        )}
                        {record.codeItem ? (
                            <Popover trigger='click' placement='topLeft' content={this.renderPopover(record, 3)}>
                                <div className='otherInfoItem otherInfoItemSelected'>代码项</div>
                            </Popover>
                        ) : (
                            <div className='otherInfoItem'>代码项</div>
                        )}
                    </div>
                )
            },
        },
    ]

    private bloodScriptColumns = [
        {
            dataIndex: 'tableName',
            key: 'tableName',
            title: '表名称',
            width: '200px',
        },
        {
            dataIndex: 'fileName',
            key: 'fileName',
            title: '关联脚本',
            render: (text: string, record: any) =>
                text ? (
                    <Button onClick={() => this.toSql(record)} type='link'>
                        {text}
                    </Button>
                ) : (
                    <EmptyLabel />
                ),
        },
        {
            dataIndex: 'relationWithTable',
            key: 'relationWithTable',
            title: '与脚本关系',
            width: '160px',
            render: (text: string) => text || <EmptyLabel />,
        },
    ]

    private relationsColumns = [
        {
            dataIndex: 'relateTableName',
            key: 'relateTableName',
            title: '关联表名称',
            render: (text: string) => text || <EmptyLabel />,
        },
        {
            dataIndex: 'relateColumnExpression',
            key: 'relateColumnExpression',
            title: '关联字段',
            render: (text: string) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
        },
        {
            dataIndex: 'fileName',
            key: 'fileName',
            title: '关系来源脚本',
            render: (text: string, record: any) => (text ? <a onClick={() => this.toSql(record)}>{text}</a> : <EmptyLabel />),
        },
    ]

    private bloodHotColumns = [
        {
            dataIndex: 'ename',
            key: 'ename',
            title: '字段名称',
            render: (text: string) =>
                text ? (
                    <Tooltip placement='topLeft' title={text}>
                        {text}
                    </Tooltip>
                ) : (
                    <EmptyLabel />
                ),
        },
        {
            dataIndex: 'cname',
            key: 'cname',
            title: '中文名',
            render: (text: string) =>
                text ? (
                    <Tooltip placement='topLeft' title={text}>
                        {text}
                    </Tooltip>
                ) : (
                    <EmptyLabel />
                ),
        },
        {
            dataIndex: 'totalUse',
            key: 'totalUse',
            title: '使用总次数',
            align: 'right',
            render: (text: string, record: any) => {
                return (
                    <div>
                        <Popover
                            placement='topLeft'
                            content={
                                <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                    <div style={{ marginBottom: 8, color: '#333' }}>使用详情</div>
                                    <div>
                                        <span>SELECT次数：</span>
                                        <span className='atomTooltip'>{record.numberOfSelect}</span>
                                    </div>
                                    <div>
                                        <span>JOIN次数：</span>
                                        <span className='atomTooltip'>{record.numberOfJoin}</span>
                                    </div>
                                    <div>
                                        <span>WHERE次数：</span>
                                        <span className='atomTooltip'>{record.numberOfWhere}</span>
                                    </div>
                                    <div>
                                        <span>GROUPBY次数：</span>
                                        <span className='atomTooltip'>{record.numberOfGroupBy}</span>
                                    </div>
                                </div>
                            }
                        >
                            <span>{text}</span>
                        </Popover>
                    </div>
                )
            },
        },
        {
            dataIndex: 'bizAttribute',
            key: 'bizAttribute',
            title: '业务属性',
            render: (text: string, record: any) => {
                return (
                    <Tooltip placement='topLeft' title={text}>
                        <span onClick={this.openRelatedTable.bind(this, record)} style={{ color: record.bizAttributeNum == 1 ? '#1890ff' : '', cursor: record.bizAttributeNum == 1 ? 'pointer' : '' }}>
                            {text || <EmptyLabel />}
                        </span>
                    </Tooltip>
                )
            },
        },
        {
            dataIndex: 'remarks',
            key: 'remarks',
            title: '备注信息',
            render: (text: string) =>
                text ? (
                    <Tooltip placement='topLeft' title={text}>
                        {text}
                    </Tooltip>
                ) : (
                    <EmptyLabel />
                ),
        },
    ]

    private historyColumns = [
        {
            title: '版本名称',
            dataIndex: 'tag',
            key: 'tag',
            width: 200,
            render: (text: string) =>
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
            width: 200,
            render: (text: string) =>
                text ? (
                    <Tooltip placement='topLeft' title={text}>
                        <span className='LineClamp'>{text}</span>
                    </Tooltip>
                ) : (
                    <EmptyLabel />
                ),
        },
        {
            title: '定版时间',
            dataIndex: 'date',
            width: 180,
            key: 'date',
            render: (text: string) =>
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
            width: 140,
            render: (text: string) =>
                text ? (
                    <Tooltip placement='topLeft' title={text}>
                        <span className='LineClamp'>{text}</span>
                    </Tooltip>
                ) : (
                    <EmptyLabel />
                ),
        },
    ]

    private reportColumns = [
        {
            title: '报表名称',
            dataIndex: 'reportName',
            render: (text: string, record: any) => {
                return <a href={`/reportNew/detail/${record.reportId}`} target="_blank">{text}</a>
            }
        }, {
            title: '报表目录',
            dataIndex: 'reportPath',
        }, {
            title: '报表等级',
            dataIndex: 'reportLevel',
        }, {
            title: '报表周期',
            dataIndex: 'reportPeriodName',
        }, {
            title: '最新采集时间',
            dataIndex: 'collectTime'
        }
    ]

    private controller!: IRichTableLayoutContoler<any>

    private tableInfo: HTMLDivElement | null = null;
    private scrollRef: HTMLDivElement | null = null;

    constructor(props: any) {
        super(props)
        this.state = {
            basicInfo: {},
            basicOverviewInfo: {},
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
            basicInfoLoading: true,
            recordRadioValue: '1',
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
        this.getBasicOverview()
        this.getPartitionTableList()
        this.initScroll();
    }

    private openRelatedTable = async (data: any) => {
        if (data.bizAttributeNum !== 1) {
            return
        }
        await this.setState({
            usedValue: '2',
            columnId: data.columnId,
        })
        this.getRelateList()
    }

    private getRelateList = async (params = {}) => {
        let query = {
            id: this.dataId,
            page: _.get(params, 'current', 1),
            pageSize: _.get(params, 'pageSize', 20),
            columnId: this.state.columnId,
        }
        let res = await getRelation(query)
        if ((res.code = 200)) {
            this.setState({
                relationsList: this.addNum(res.data, _.get(params, 'current', 1), _.get(params, 'pageSize', 20)),
                relationsPage: {
                    pageSize: _.get(params, 'pageSize', 20),
                    total: res.total,
                },
            })
        }
    }

    private renderPopover(data: any, type: number) {
        return (
            <div style={{ color: '#5E6266', maxWidth: 250, lineHeight: '22px', maxHeight: 320 }}>
                <h4>{type == 1 ? '敏感标签' : type == 2 ? '质量规则（' + data.qaRuleList.length + '）' : '引用代码项'}</h4>
                {type == 1 ? (
                    <div>
                        <div style={{ margin: '12px 0 4px 0', color: '#2D3033' }}>{data.desensitiseTag.name}</div>
                        <div>
                            <span>敏感等级：</span>
                            <span>{data.desensitiseTag.englishName}</span>
                        </div>
                        <div>
                            <span>脱敏规则：</span>
                            <span>{data.desensitiseTag.sensitivityLevel}</span>
                        </div>
                    </div>
                ) : null}
                {type == 2 ? (
                    <div>
                        {data.qaRuleList.map((item: any) => {
                            return (
                                <div>
                                    <div style={{ margin: '12px 0 4px 0', color: '#2D3033' }}>{item.name}</div>
                                    <div>
                                        <span>规则编码：</span>
                                        <span>{item.ruleCode}</span>
                                    </div>
                                    <div>
                                        <span>规则类型：</span>
                                        <span>{item.ruleTypePath}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : null}
                {type == 3 ? (
                    <div style={{ color: '#2D3033' }}>
                        {data.codeItem.code} {data.codeItem.name}
                    </div>
                ) : null}
            </div>
        )
    }

    private renderBaseDetail() {
        const { basicInfo } = this.state
        if (!basicInfo) {
            return null
        }

        let list = [
            {
                label: '所属系统',
                content: _.get(basicInfo, 'belongSystem', ''),
            },
            {
                label: '数据源',
                content: _.get(basicInfo, 'datasourceName', ''),
            },
            {
                label: '数据库',
                content: _.get(basicInfo, 'physicalDb', ''),
            },
            {
                label: '数据库类型',
                content: _.get(basicInfo, 'datasourceType', ''),
            },
            // 数仓类型才显示
            {
                label: '数仓层级',
                content: _.get(basicInfo, 'dwLevelPath', ''),
                hide: !basicInfo.isDataWarehouse
            },
            {
                label: '存储信息',
                content: basicInfo.tableUsedSpace ? `${_.get(basicInfo, 'tableUsedSpace', '')}MB` : '' 
            },
            {
                label: '表中文名',
                content: _.get(basicInfo, 'tableName', ''),
            },
            {
                label: '业务分类',
                content: _.get(basicInfo, 'classPath', ''),
                hide: !(!basicInfo.isDataWarehouse || (basicInfo.isDataWarehouse && basicInfo.dwLevelId == 'ods'))
            },
            {
                label: '主题域',
                content: _.get(basicInfo, 'topicArea', ''),
                hide: !(basicInfo.isDataWarehouse && (basicInfo.dwLevelId == 'dw' || basicInfo.dwLevelId == 'app'))
            },
        ]
        list = list.filter(v => !v.hide);
        return this.renderDetailList(list)
    }

    private renderManageDetail() {
        const { basicInfo } = this.state
        const list = [
            {
                label: '技术归属部门',
                content: _.get(basicInfo, 'technicalDepartName', ''),
            },
            {
                label: '技术负责人',
                content: _.get(basicInfo, 'technicalManagerName', ''),
            },
            {
                label: '业务归属部门',
                content: _.get(basicInfo, 'businessDepartName', ''),
            },
            {
                label: '业务负责人',
                content: _.get(basicInfo, 'businessManagerName', ''),
            },
        ]

        return this.renderDetailList(list)
    }

    private renderDetailList(list: any[]) {
        const hasInfo = Boolean(list.find((item) => Boolean(item.content)))
        return hasInfo ? <ListHorizontal.Wrap className="listHorizontal">{ list.map((v, index) => <ListHorizontal toolTipWidth={144} valueToolTip style={{ marginBottom: index === list.length - 1 ? 0 : 16 }} key={v.label} {...v} />) }</ListHorizontal.Wrap> : null;
    }

    private renderSafeDetail() {
        const { basicInfo } = this.state
        const list = [
            {
                label: '受控字段',
                content: _.get(basicInfo, 'controlColumnCount', '')
            },
            {
                label: '最高安全等级',
                content: _.get(basicInfo, 'columnMaxSecLevel', '')
            },
            {
                label: '最低安全等级',
                content: _.get(basicInfo, 'columnMinSecLevel', '')
            },
            {
                label: '敏感字段',
                content: _.get(basicInfo, 'desensitiseColumnCount', ''),
            },
            /* {
                label: '安全等级',
                content: basicInfo.levelConfirm ? _.get(basicInfo, 'securityLevel', '') : '',
            },
            {
                label: '字段最高安全等级',
                content: basicInfo.levelConfirm ? _.get(basicInfo, 'columnMaxSecLevel', '') : '',
            },
            {
                label: '字段最低安全等级',
                content: basicInfo.levelConfirm ? _.get(basicInfo, 'columnMinSecLevel', '') : '',
            },
            {
                label: '敏感字段个数',
                content: _.get(basicInfo, 'desensitiseColumnCount', ''),
            }, */
        ]
        return this.renderDetailList(list)
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
            /* {
                label: 'DDL信息',
                content: _.get(basicInfo, 'ddl') ? <TextMore>{_.get(basicInfo, 'ddl')}</TextMore> : undefined,
            },
            {
                label: '关联血缘脚本',
                content: !_.isEmpty(_.get(basicInfo, 'lineageFileInfos'))
                    ? _.get(basicInfo, 'lineageFileInfos').map((item: any) => (
                          <div className='sql_box'>
                              <a href='javascript:;' style={{ fontSize: '14px' }} onClick={() => this.toSql(item)}>
                                  {_.get(item, 'fileName')}
                              </a>
                              ({_.get(item, 'relationWithTable')})
                          </div>
                      ))
                    : undefined,
            }, */
        ]
        return this.renderDetailList(list)
    }

    private async getBasicInfo() {
        this.setState({ basicInfoLoading: true });
        let res = await getSysBasic({ id: this.dataId })
        this.setState({ basicInfoLoading: false })
        if ((res.code = 200)) {
            if(!res.data) res.data = {};    // 兼容下面一行代码
            res.data.qaTaskInfo = res.data.qaTaskInfo || {}
            const basicInfo = _.pickBy(res.data)
            await this.setState({
                basicInfo,
            })
            ProjectUtil.setDocumentTitle(_.get(basicInfo, 'physicalTable', ''))
        }
    }

    private async getBasicOverview() {
        let res = await getSysBasicOverview({ id: this.dataId })
        if ((res.code = 200)) {
            const data = res.data || {};
            await this.setState({
                basicOverviewInfo: {...data},
            })
        }
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

    openTableDetail = (data: any) => {
        PageUtil.addTab('sysDetail', { id: data.relationTableId }, true)
    }

    private onView(data: any) {
        let query = {
            entityId: data.columnStandardCode,
            id: data.columnStandardCode,
        }
        PageUtil.addTab('标准详情', query, true)
    }

    private changeKeyword = async (e: any) => {
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

    private renderHistoryContent() {
        return (
            <div className='ContentWrap'>
                <ModuleTitle title="历史版本" />
                <LzTable
                    rowKey={'version'}
                    columns={this.historyColumns}
                    searchDataSource={[
                        {
                            type: 'inputSearch',
                            placeholder: '请输入版本名称',
                            name: 'keyword',
                            width: 380
                        }
                    ]}
                    request={async (params = {}) => {
                        const res = await tableVersionList({
                            page: params.current,
                            pageSize: params.pageSize,
                            id: this.dataId,
                            keyword: params.keyword,
                        })
                        return {
                            data: res.data,
                            total: res.total
                        }
                    }}
                />
            </div>
        )
    }

    private renderReportTable() {
        return (
            <div className='ContentWrap'>
            <ModuleTitle title="关联报表" />
            <LzTable
                columns={this.reportColumns}
                searchDataSource={[
                    {
                        type: 'inputSearch',
                        placeholder: '请输入报表名称',
                        name: 'reportName',
                        width: 360
                    }
                ]}
                request={async (params = {}) => {
                    const res = await getRelationTable({
                        reportName: params.reportName,
                        id: this.dataId,
                        page: params.current,
                        pageSize: params.pageSize
                    })
                    return {
                        data: res.data,
                        total: res.total,
                    }
                }}
            />
        </div>
        )
    }

    private renderTagDetail() {
        const { basicInfo } = this.state
        return (basicInfo.tagList || []).length > 0 ? (
            <div className='sysDetailPageTag'>
                {
                    (basicInfo.tagList || []).map((v: any) => <span>{v.tagValueName}</span>)
                }
            </div>
        ) : ''
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
                title: '安全信息',
                emptyLabel: '暂无信息',
                icon: 'icon-anquan',
                content: this.renderSafeDetail(),
            },
            {
                title: '技术信息',
                emptyLabel: '暂无信息',
                icon: 'icon-jishu',
                content: this.renderTechDetail(),
            },
            {
                title: '标签信息',
                emptyLabel: '暂无信息',
                icon: 'icon-biaoqian',
                content: this.renderTagDetail(),
            }
        ].filter((item) =>  item.visible !== false)

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

    private async getPartitionTableList() {
        let query = {
            tableId: this.dataId,
        }

        let res = await getSysPartitionColumn(query)
        if ((res.code = 200)) {
            res.data.map((item: any) => {
                item.samples = item.samples ? item.samples : []
                item.samplesDec = item.samples.join('，')
            })
            this.setState({
                partitionFieldList: res.data,
            })
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        return {
            dataSource: [],
            total: 0,
        }
    }

    private scrollRight = (canScroll, value) => {
        if (canScroll) {
            this.setState({
                scrolled: value
            })
            if (value) {
                (this.scrollRef as HTMLDivElement).scrollLeft = 1000
            } else {
                (this.scrollRef as HTMLDivElement).scrollLeft = 0
            }
        }
    }

    private onScrollEvent = async () => {
        if ((this.scrollRef as HTMLDivElement).scrollLeft == 0) {
            this.setState({
                scrolled: false
            })
        } else {
            this.setState({
                scrolled: true
            })
        }

    }

    private initScroll = () => {
        if (!this.tableInfo) {
            return;
        }
        if ((this.tableInfo as HTMLDivElement).clientWidth < 1300) {
            this.setState({
                showScrollBtn: true
            })
        }
    }

    private copy = (str: string) => {
        console.log('copy');
        const textArea = document.getElementById('ddlCopy') as HTMLInputElement;
        textArea.innerText = str;
        textArea.select();
        document.execCommand('copy');
        message.success('复制成功');
    }

    private download = () => {
        console.log('download');
    }

    private renderFieldContent() {
        const { partitionFieldList, basicInfo, basicOverviewInfo, showScrollBtn, scrolled, ddlVisible } = this.state
        const that = this;
        const List: React.FC<{ label: string, icon: string, value: number }> = React.memo((props) => (
            <div>
                <span style={{ transform: `scale(${ props.icon === 'icon-mingan1' ? '1.1' : '1' })` }} className={`iconfont ${props.icon}`}></span>
                <span className="label">{props.label}</span>
                <span className="value">{props.value || <EmptyLabel />}</span>
            </div>
        ))
        return (
            <>
                <div className='ContentWrap'>
                    <div className='tableInfo' ref={dom => this.tableInfo = dom} style={{ marginTop: 0 }}>
                        <ModuleTitle title='数据概览' suffix={<span className='updateTime'>数据更新时间：{basicOverviewInfo.dataUpdateTime || ''}</span>} />
                        {
                            showScrollBtn ?
                                <div className='scrollBtn'>
                                    <span onClick={this.scrollRight.bind(this, scrolled, false)} style={{ color: !scrolled ? '#C4C8CC' : '#5E6266', marginRight: 20 }} className='iconfont icon-zuo'></span>
                                    <span onClick={this.scrollRight.bind(this, !scrolled, true)} style={{ color: scrolled ? '#C4C8CC' : '#5E6266' }} className='iconfont icon-you'></span>
                                </div>
                                : null
                        }
                        <div className="statics HideScroll" ref={dom => this.scrollRef = dom} onScrollCapture={this.onScrollEvent}>
                            <List icon="icon-ziduan2" label="字段数" value={basicOverviewInfo.fieldCount} />
                            <List icon="icon-zhujian1" label="主键数" value={basicOverviewInfo.pkCount} />
                            <List icon="icon-waijian1" label="外键数" value={basicOverviewInfo.fkCount} />
                            <List icon="icon-fenqu" label="分区数" value={basicOverviewInfo.partitionCount} />
                            <List icon="icon-zhongwenming" label="中文完整度" value={basicOverviewInfo.cNameCompleteRate} />
                            <List icon="icon-ziduan2" label="对标字段" value={basicOverviewInfo.benchmarkFieldCount} />
                            <List icon="icon-mingan1" label="敏感字段" value={basicOverviewInfo.desensitiseFieldCount} />
                            <List icon="icon-shoukong" label="受控字段" value={basicOverviewInfo.controlFieldCount} />
                            <List icon="icon-jianhe1" label="检核字段" value={basicOverviewInfo.checkFieldCount} />
                        </div>
                    </div> 
                </div>
                <div className='ContentWrap'>
                    <ModuleTitle
                        title='字段列表'
                        renderHeaderExtra={
                            () => {
                                return basicInfo.ddl ? <span onClick={() => { that.setState({ ddlVisible: true }) }} className="ddlSuffix">查看DDL <span style={{ color: '#4D73FF' }} className='iconfont icon-you'></span></span> : null
                            }
                        }
                    />
                    <LzTable
                        rowKey='id'
                        columns={this.fieldColumns}
                        searchDataSource={[
                            {
                                type: 'inputSearch',
                                placeholder: '搜索字段',
                                name: 'keyword',
                                width: 360
                            }
                        ]}
                        request={async (params = {}) => {
                            const res = await getSysColumn({
                                keyword: params.keyword,
                                tableId: this.dataId,
                                page: params.current,
                                pageSize: params.pageSize
                            })
                            return {
                                data: res.data,
                                total: res.total
                            }
                        }}
                    />
                    <AntdModal
                        wrapClassName="sysDetailPageDdlModal"
                        visible={ddlVisible}
                        title="DDL信息"
                        onCancel={() => that.setState({ ddlVisible: false })}
                        width={600}
                        style={{ width: 600, height: 500 }}
                        footer={[
                            <Button key="copy" onClick={() => { this.copy(basicInfo.ddl || '') }}>复制</Button>
                        ]}
                    >
                        <div className='modalContent'>
                            <textarea id="ddlCopy" style={{ opacity: 0 }} />
                            <SyntaxHighlighter language="sql" style={docco}>
                                {
                                    format(basicInfo.ddl || '', {

                                    })
                                }
                            </SyntaxHighlighter>
                        </div>
                    </AntdModal>
                </div>
                {
                    partitionFieldList.length > 0 && (
                        <div className='ContentWrap'>
                            <ModuleTitle title='分区字段信息'/>
                            <div style={{ color: '#5E6266', marginBottom: '16px' }}>分区类型：{partitionFieldList[0] ? partitionFieldList[0].partitionType : ''}</div>
                            <LzTable
                                rowKey="id"
                                columns={this.partionColumns}
                                pagination={false}
                                expandedRowRender={(record: any) =>  <div className='expandArea'>分区值：{(record.samples || []).join('，')}</div>}
                                request={async (params = {}) => {
                                    const res = await getSysPartitionColumn({ tableId: this.dataId })
                                    return {
                                        data: res.data,
                                    }
                                }}
                                showExpandIcon
                            />
                        </div>
                    )
                }
            </>
            
        )
    }

    private getErTableList = async (params: {
        pagination: {
            page: number
            page_size: number
        }
    }) => {
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            id: this.dataId,
        }
        let res = await foreignRelation(query)
        if (res.code == 200) {
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

    private renderErContent() {
        return <ErPage id={this.pageParam.id} type={MetaDataType.PHYSICAL_TABLE} />
    }

    private renderUseRecordContent() {
        console.log('recordRadioValue', this.state.recordRadioValue);
        return (
            <>
                <Radio.Group style={{ marginBottom: 16 }} onChange={(e) => { this.setState({ recordRadioValue: e.target.value }) }} defaultValue={"1"}>
                    <Radio.Button value="1">血缘脚本</Radio.Button>
                    <Radio.Button value="2">字段热度</Radio.Button>
                </Radio.Group>
                {
                    this.state.recordRadioValue === '1' && (
                        <LzTable
                            rowKey={(record, index) => `${index}_${record.fileId}`}
                            columns={this.bloodScriptColumns}
                            request={async (params = {}) => {
                                let res = await getBloodScript({
                                    id: this.dataId,
                                    page: params.current,
                                    pageSize: params.pageSize,
                                });
                                console.log('res', res)
                                return {
                                    data: res.data,
                                    total: res.total,
                                }
                            }}
                        />
                    )
                }
                {
                    this.state.recordRadioValue === '2' && (
                        <LzTable
                            rowKey={'id'}
                            columns={this.bloodHotColumns}
                            request={async (params = {}) => {
                                const res = await getBloodHot({
                                    page: params.current,
                                    pageSize: params.pageSize,
                                    tableId: this.dataId
                                })
                                console.log('res2', res);
                                if(res.code !== 200) {
                                    message.error(res.msg || '获取列表异常');
                                }
                                return {
                                    data: res.data || [],
                                    total: res.total
                                }
                            }}
                        />
                    )
                }
            </>
        )
    }

    private renderContent() {
        const { tableId, tabValue, basicInfo, basicInfoLoading } = this.state
        const fields = this.pageParam.fields
        let list: {
            label: string
            key: string
            content?: ReactNode
            visible?: boolean
            hide?: boolean
            className?:string
        }[] = [
            {
                label: '字段信息',
                key: 'field',
                content: this.renderFieldContent(),
            },
            {
                label: '血缘信息',
                key: 'graph',
                className:'GraphTabPanel',
                content: (
                    <TableGraphPage
                        targetId={tableId}
                        targetType={GraphTargetType.TABLE}
                        style={{ height: '100%' }}
                        defaultToFieldGraphParams={
                            fields
                                ? {
                                      middleTableId: tableId,
                                      analyzeFieldIdList: fields.split(','),
                                      isSuccessors: false,
                                  }
                                : undefined
                        }
                    />
                ),
            },
            {
                label: 'ER关系',
                key: 'er',
                content: this.renderErContent(),
            },
            {
                label: '使用记录',
                key: 'useRecord',
                content: this.renderUseRecordContent(),
                hide: !basicInfo.isDataWarehouse,
            },
            {
                label: '历史版本',
                key: 'historyVersion',
                content: this.renderHistoryContent(),
            },
            {
                label: '关联报表',
                key: 'associatedApps',
                content: this.renderReportTable(),
            },
        ]
        list = list.filter(v => !v.hide)
        return (
            <Spin spinning={basicInfoLoading}>
                <Tabs className='SysDetailPageTabs' animated={false} onChange={this.tabKeyChange} activeKey={tabValue}>
                    {list.map((item, index) => {
                        return (
                            <Tabs.TabPane className={item.className || ''} key={item.key} tab={item.label}>
                                {item.content}
                            </Tabs.TabPane>
                        )
                    })}
                </Tabs>
            </Spin>
        )
    }

    tabKeyChange = (key: string | number) => {
        this.setState({
            tabValue: key as string,
        })
        if (key === 'field') {
            this.getPartitionTableList()
        } else if (key === 'useRecord') {
            this.getRelateList()
        }
    }

    render() {
        const { basicInfo } = this.state;
        return (
            <div className='SysDetailPage'>
                <PageHeader title={<span className="titleIcon"><IconFont type={MetaDataType.icon(MetaDataType.PHYSICAL_TABLE)} style={{ fontSize: 26 }} />{basicInfo.physicalTable} {basicInfo.tableName?`[${basicInfo.tableName}]`:'' }</span>} />
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
