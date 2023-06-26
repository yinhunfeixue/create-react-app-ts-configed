import GraphTargetType from '@/app/graph/enum/GraphTargetType'
import TableGraphPage from '@/app/graph/TableGraphPage'
import MetaDataType from '@/app/metadataCenter/enum/MetaDataType'
import ErPage from '@/app/metadataCenter/ErPage'
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import SliderLayout2 from '@/component/layout/SliderLayout2'
import ModuleTitle from '@/component/module/ModuleTitle'
import PageHeader from '@/component/PageHeader'
import PageUtil from '@/utils/PageUtil'
import ProjectUtil from '@/utils/ProjectUtil'
import { Collapse, Popover, Tabs, Tooltip } from 'antd'
import { getBloodTable, getReportBasic } from 'app_api/dataAssetApi'
import { ListHorizontal, LzTable } from 'cps'
import _ from 'lodash'
import React, { Component, ReactNode } from 'react'
import './SysDetailPage.less'

const FOREIGN_KEY = (
    <svg viewBox='0 0 1609 1024' p-id='7166' width='25'>
        <path
            d='M0 0m59.780366 0l1195.60731 0q59.780366 0 59.780366 59.780366l0 717.364386q0 59.780366-59.780366 59.780366l-1195.60731 0q-59.780366 0-59.780366-59.780366l0-717.364386q0-59.780366 59.780366-59.780366Z'
            fill='#E9F6F4'
            p-id='7167'
        ></path>
        <path
            d='M267.816038 657.584021c6.57584-60.49773 11.956073-130.620099 16.140698-210.367106s6.994303-167.982827 8.369251-264.587898h324.726946l-4.184626 86.860871a2644.683371 2644.683371 0 0 0-50.992651-2.092313 1229.442998 1229.442998 0 0 0-33.775907-0.717364H394.669973a138.032864 138.032864 0 0 0-3.527041 19.249277c-0.956486 7.771448-1.853191 19.129717-2.809677 34.31393l-2.092313 46.270003h116.990175c17.037404 0 32.042276-0.239121 45.014615-0.717364a438.787883 438.787883 0 0 0 34.493271-2.391215l-3.527041 89.670548a549.740241 549.740241 0 0 0-26.243581-1.614069 1198.297427 1198.297427 0 0 0-41.308232-0.538024H382.7139l-3.825943 49.737264c-1.195607 18.711254-2.032532 36.585584-2.630336 53.802329-0.597804 17.156965-0.896705 34.015028-0.896706 50.57419 0 14.227727 0.05978 24.928412 0.179341 32.042276 0.119561 7.173644 0.298902 13.988606 0.538024 20.504665h-108.202462z m380.083564 0c6.57584-59.780366 11.956073-129.962515 16.140698-210.486667 4.184626-80.583933 6.994303-168.759972 8.369252-264.468337h107.544877c-2.809677 24.031707-4.782429 43.221204-5.978036 57.628272-1.195607 14.347288-2.092313 27.917431-2.809678 40.770209l-11.53761 222.38296c-1.374948 28.335893-2.510775 54.938156-3.347701 79.926349-0.777145 24.988193-1.315168 49.737264-1.554289 74.247214h-106.827513z m118.365123-249.045003l92.480226-117.70754c22.178516-28.455454 38.797457-50.514409 49.737264-66.176864 10.999587-15.662456 19.727521-29.651061 26.303361-42.025597h120.457436L881.162588 407.104289 1051.058387 657.584021h-125.718109c-4.005284-9.564858-8.967055-19.727521-14.945091-30.487987s-13.809264-23.553464-23.613245-38.498555l-120.517217-180.058461z'
            fill='#28A895'
            p-id='7168'
        ></path>
    </svg>
)
const PRIMARY_KEY = (
    <svg viewBox='0 0 1609 1024' p-id='7317' width='25'>
        <path
            d='M0 0m59.780366 0l1195.60731 0q59.780366 0 59.780366 59.780366l0 717.364386q0 59.780366-59.780366 59.780366l-1195.60731 0q-59.780366 0-59.780366-59.780366l0-717.364386q0-59.780366 59.780366-59.780366Z'
            fill='#E7F4FB'
            p-id='7318'
        ></path>
        <path
            d='M267.158454 657.584021c6.57584-59.780366 11.896293-129.962515 16.140698-210.486667 4.184626-80.583933 6.934522-168.759972 8.369251-264.468337h195.780698c24.988193 0 43.460326 0.836925 55.356618 2.630336 11.956073 1.733631 22.118735 4.722649 30.487986 8.907274 20.086203 10.043101 35.389976 24.50995 45.851541 43.280985 10.521344 18.771035 15.782017 41.128891 15.782016 67.07357 0 47.40583-15.064652 85.306582-45.193956 113.821816-30.129304 28.515234-70.540831 42.742961-121.174801 42.742961-6.336719 0-13.0919-0.478243-20.325324-1.434728a319.765175 319.765175 0 0 1-25.585997-4.543308l-19.249277-77.415574c9.564858 2.809677 18.711254 4.84221 27.319627 6.157378 8.668153 1.255388 17.336306 1.912972 25.944678 1.912972 24.50995 0 43.639667-6.396499 57.389151-19.249278 13.809264-12.852779 20.684006-30.607547 20.684007-53.204525 0-19.906862-5.738915-33.835687-17.336306-41.906036-11.537611-8.070349-32.161837-12.075634-61.812898-12.075634h-60.975973c-2.271654 24.988193-3.825943 41.846256-4.543308 50.633969a269.968131 269.968131 0 0 0-1.016266 18.352573L381.996536 512.556854c-0.478243 4.662869-1.076047 23.912146-1.793411 57.628272-0.657584 33.775907-1.374948 62.888945-2.092313 87.398895H267.218234z m397.53943 0c6.57584-59.780366 11.956073-129.962515 16.140699-210.486667 4.184626-80.583933 6.994303-168.759972 8.369251-264.468337h107.604658c-2.869458 24.031707-4.84221 43.221204-5.978036 57.628272-1.195607 14.347288-2.152093 27.917431-2.809678 40.770209l-11.59739 222.38296c-1.374948 28.335893-2.510775 54.938156-3.287921 79.926349-0.836925 24.988193-1.374948 49.737264-1.614069 74.247214H664.757665z m118.365124-249.045003l92.480226-117.70754c22.238296-28.455454 38.797457-50.514409 49.797044-66.176864 10.939807-15.662456 19.727521-29.651061 26.243581-42.025597h120.517217L897.90109 407.104289 1067.85667 657.584021H942.138561c-4.005284-9.564858-8.967055-19.727521-14.945092-30.487987-5.918256-10.760466-13.749484-23.553464-23.613244-38.498555L783.122789 408.539018z'
            fill='#1393DC'
            p-id='7319'
        ></path>
    </svg>
)

const BLOCK = (
    <svg viewBox='0 0 1024 1024' p-id='6873' width='25'>
        <path
            d='M0 186.181818m46.545455 0l930.90909 0q46.545455 0 46.545455 46.545455l0 558.545454q0 46.545455-46.545455 46.545455l-930.90909 0q-46.545455 0-46.545455-46.545455l0-558.545454q0-46.545455 46.545455-46.545455Z'
            fill='#FFEFE0'
            p-id='6874'
        ></path>
        <path
            d='M484.538182 577.163636V744.727273H209.454545V577.163636h275.083637z m330.007273 0V744.727273h-275.083637V577.163636h275.083637zM428.637091 633.018182H265.309091v55.854545h163.328V633.018182z m330.007273 0H595.316364v55.854545h163.328V633.018182zM732.020364 279.272727v167.563637H531.083636v77.637818l33.745455-33.698909 26.344727 26.344727-77.777454 77.730909-78.987637-78.941091 25.925818-25.925818 34.117819 34.117818-0.046546-77.265454h-202.472727V279.272727h440.087273z m-55.854546 55.854546H347.787636v55.854545h328.378182V335.127273z'
            fill='#FF9B43'
            p-id='6875'
        ></path>
    </svg>
)

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
}

/**
 * 表详情页
 */
class SysDetailPage extends Component<any, ISysDetailPageSate> {
    private bloodTableColumns = [
        {
            title: '表英文名',
            dataIndex: 'tableEnglishName',
        },
        {
            title: '表中文名',
            dataIndex: 'tableChineseName',
        },
        {
            title: '血缘字段数量',
            dataIndex: 'dependFieldCount',
        },
        {
            title: '数仓分层',
            dataIndex: 'dwLevel',
        },
        {
            title: '技术路径',
            dataIndex: 'dsName',
            render: (text: any, record: any) => {
                return record.dbName || text ? `${text || ''}/${record.dbName || ''}` : <EmptyLabel />
            },
        },
        {
            title: '分类信息',
            dataIndex: 'classPath',
        },
        {
            title: '质量任务',
            dataIndex: 'qaTableTask',
            render: (text: any, record: any = {}) => {
                return record.name ? <a>{record.name || ''}</a> : <EmptyLabel />
            },
        },
    ]

    private modelTableColumns = [
        {
            title: '报表名称',
            dataIndex: '',
        },
        {
            title: '报表目录',
            dataIndex: '',
        },
        {
            title: '最新采集时间',
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
                            {(record.isForeignKey || record.isPrimarykey) && <span className='keySvgWrap'>{record.isForeignKey ? FOREIGN_KEY : PRIMARY_KEY}</span>}
                            {record.partitionFlag && <span className='keySvgWrap block'>{BLOCK}</span>}
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
                            {(record.dataLength || record.dataPrecision) && `（${[record.dataLength, record.dataPrecision].filter((v) => v !== undefined && v !== null).join(',')}）`}
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
                    return <div>{this.state.basicInfo.securityLevel ? text : <EmptyLabel />}</div>
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
                    return <div>{this.state.basicInfo.securityClassPath ? text : <EmptyLabel />}</div>
                } else {
                    return <EmptyLabel />
                }
            },
        },
        {
            dataIndex: 'x',
            key: 'x',
            title: '其他信息',
            width: 180,
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
                label: '报表目录',
                content: _.get(basicInfo, 'reportCatalog', ''),
            },
            {
                label: '报表等级',
                content: _.get(basicInfo, 'reportLevel', ''),
            },
            {
                label: '报表周期',
                content: _.get(basicInfo, 'reportPeriodName', ''),
            },
        ]
        console.log('baseDetail', list)
        return this.renderDetailList(list)
    }

    private renderSafeDetail() {
        const { basicInfo } = this.state
        const list = [
            {
                label: '受控字段',
                content: basicInfo.levelConfirm ? _.get(basicInfo, 'securityLevel', '') : '',
            },
            {
                label: '最高安全等级',
                content: basicInfo.levelConfirm ? _.get(basicInfo, 'columnMaxSecLevel', '') : '',
            },
            {
                label: '最低安全等级',
                content: basicInfo.levelConfirm ? _.get(basicInfo, 'columnMinSecLevel', '') : '',
            },
            {
                label: '敏感字段',
                content: _.get(basicInfo, 'desensitiseColumnCount', ''),
            },
        ]
        return this.renderDetailList(list)
    }

    private renderManageDetail() {
        const { basicInfo } = this.state
        const list = [
            {
                label: '技术归属部门',
                content: _.get(basicInfo, 'technologyDept', ''),
            },
            {
                label: '技术负责人',
                content: _.get(basicInfo, 'technologyManager', ''),
            },
            {
                label: '业务归属部门',
                content: _.get(basicInfo, 'businessDept', ''),
            },
            {
                label: '业务负责人',
                content: _.get(basicInfo, 'businessManager', ''),
            },
        ]

        return this.renderDetailList(list)
    }

    private renderDetailList(list: any[]) {
        const hasInfo = Boolean(list.find((item) => Boolean(item.content)))
        /* return hasInfo ? <div className='MiniForm Grid1 FormPart '>{RenderUtil.renderFormItems(list)}</div> : null */
        return hasInfo ? (
            <ListHorizontal.Wrap className='listHorizontal'>
                {list.map((v, index) => (
                    <ListHorizontal toolTipWidth={144} valueToolTip style={{ marginBottom: index === list.length - 1 ? 0 : 16 }} key={v.label} {...v} />
                ))}
            </ListHorizontal.Wrap>
        ) : null
    }

    private renderTechDetail() {
        const { basicInfo } = this.state

        const list = [
            {
                label: '最新变更时间',
                content: _.get(basicInfo, 'updateTime', ''),
            },
            {
                label: '创建时间',
                content: _.get(basicInfo, 'createTime', ''),
            },
        ]
        return this.renderDetailList(list)
    }

    private onView(data: any) {
        let query = {
            entityId: data.columnStandardCode,
            id: data.entityId,
        }
        PageUtil.addTab('标准详情', query, true)
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
                            <span>{data.desensitiseTag.sensitivityLevelName}</span>
                        </div>
                        <div>
                            <span>脱敏规则：</span>
                            <span>{data.desensitiseTag.defaultRuleName}</span>
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

    getBasicInfo = async () => {
        this.setState({
            loading: true,
        })
        let res = await getReportBasic({ id: this.dataId })
        if ((res.code = 200)) {
            this.setState({
                basicInfo: res.data,
            })
        }
        this.setState({
            loading: false,
        })
    }

    openTableDetail = (data: any) => {
        PageUtil.addTab('sysDetail', { id: data.relationTableId }, true)
    }

    private expandedRowRender = (record: any) => {
        const subColumns = this.fieldColumns
        return (
            <LzTable
                scroll={{ y: 400 }}
                columns={subColumns}
                dataSource={record.columnList || []}
                pagination={false}
                //showHeader={false}
            />
        )
    }

    private setExpandedRowClassName = () => {
        return 'expandRow'
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
            /* {
                title: '安全信息',
                emptyLabel: '暂无信息',
                icon: 'icon-anquan',
                content: this.renderSafeDetail(),
            }, */
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

    private renderBloodTable() {
        return (
            <>
                <div className='ContentWrap'>
                    <ModuleTitle title='血缘表信息' />
                    <LzTable
                        rowKey={'id'}
                        columns={this.bloodTableColumns}
                        searchDataSource={[
                            {
                                type: 'inputSearch',
                                placeholder: '搜索表',
                                width: 360,
                                name: 'tableName',
                            },
                        ]}
                        request={async (params = {}) => {
                            const res = await getBloodTable({
                                tableName: params.tableName,
                                reportId: this.dataId,
                                page: params.current,
                                page_size: params.pageSize,
                                pageSize: params.pageSize,
                            })
                            // 造id
                            if (Array.isArray(res.data)) {
                                res.data.forEach((v: any, index: number) => {
                                    v.id = index
                                })
                            }
                            return {
                                data: res.data,
                                total: res.total,
                            }
                        }}
                        expandedRowRender={this.expandedRowRender}
                        showExpandIcon
                        expandedRowClassName={this.setExpandedRowClassName}
                    />
                </div>
            </>
        )
    }

    private renderModelTable() {
        return (
            <>
                <div className='ContentWrap'>
                    <ModuleTitle title='同模型报表' />
                    <LzTable
                        columns={this.modelTableColumns}
                        request={async () => {
                            return {
                                data: [{}, {}],
                                total: 2,
                            }
                        }}
                    />
                </div>
            </>
        )
    }

    private renderContent() {
        const { tabValue } = this.state
        const list: {
            label: string
            key: string
            content?: ReactNode
            visible?: boolean
        }[] = [
            {
                label: '血缘表信息',
                key: 'field',
                content: this.renderBloodTable(),
            },
            {
                label: '血缘信息',
                key: 'graph',
                content: <TableGraphPage targetId={this.dataId} targetType={GraphTargetType.REPORT} style={{ height: 600 }} />,
            },
            {
                label: 'ER关系',
                key: 'useRecord',
                content: <ErPage id={this.pageParam.id} type={MetaDataType.REPORT} />,
            },
            /* {
                label: '同模型报表',
                key: 'report',
                content: this.renderModelTable(),
            } */
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
    }

    render() {
        const { basicInfo } = this.state
        return (
            <div className='SysDetailPage'>
                <PageHeader
                    title={
                        <span className='titleIcon'>
                            <IconFont type={MetaDataType.icon(MetaDataType.REPORT)} style={{ fontSize: 26 }} />
                            {basicInfo.reportName || ''}
                        </span>
                    }
                />
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
