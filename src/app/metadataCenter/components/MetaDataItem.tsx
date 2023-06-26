import MetaDataType from '@/app/metadataCenter/enum/MetaDataType'
import IMetaData from '@/app/metadataCenter/interface/IMetaData'
import IComponentProps from '@/base/interfaces/IComponentProps'
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import PageUtil from '@/utils/PageUtil'
import { Divider, Tag, Tooltip } from 'antd'
import classNames from 'classnames'
import React, { Component, ReactNode } from 'react'
import './MetaDataItem.less'

interface IMetaDataItemState {}
interface IMetaDataItemProps extends IComponentProps {
    data: IMetaData
}

/**
 * MetaDataItem
 */
class MetaDataItem extends Component<IMetaDataItemProps, IMetaDataItemState> {
    private renderTitle() {
        const { data } = this.props
        const {
            columnEnName,
            columnChnName,
            lineageName,
            lineageId,
            reportId,
            isCredible,
            isSensitive,
            tableEnName,
            tableChnName,
            isControlled,
            domain,
            reportName,
            tableId,
            modelChineseName,
            modelEnglishName,
            modelId,
        } = data
        let dimList: { label: string; enable?: boolean; icon: string }[] = []

        let title = ''
        let id = ''
        switch (domain) {
            case MetaDataType.PHYSICAL_TABLE:
                title = `${tableEnName || ''}${tableChnName ? ` [${tableChnName}]` : ''}`
                id = tableId
                dimList = [
                    {
                        label: '已认证',
                        enable: isCredible,
                        icon: 'icon-renzheng',
                    },
                    {
                        label: '敏感数据',
                        enable: isSensitive,
                        icon: 'icon-mingan',
                    },
                    {
                        label: '受控数据',
                        enable: isControlled,
                        icon: 'icon-shoukongziduan',
                    },
                ]
                break
            case MetaDataType.SQL:
                title = lineageName
                id = lineageId
                break
            case MetaDataType.REPORT:
                title = reportName
                id = reportId
                break
            case MetaDataType.FIELD:
                title = `${columnEnName || ''} ${columnChnName || ''}`
                id = tableId
                dimList = [
                    {
                        label: '主键',
                        enable: data.isPrimaryKey,
                        icon: 'icon-zhujian2',
                    },
                    {
                        label: '外键',
                        enable: data.isForeignKey,
                        icon: 'icon-waijian2',
                    },
                ]
                break
            case MetaDataType.PHYSICAL_MODEL:
                title = `${modelChineseName} [${modelEnglishName}]`
                id = modelId
                break
            default:
                break
        }

        return (
            <div
                className='MetaDataItemTitle'
                onClick={() => {
                    switch (domain) {
                        case MetaDataType.PHYSICAL_TABLE:
                            PageUtil.addTab('sysDetail', { id }, true)
                            break
                        case MetaDataType.SQL:
                            PageUtil.addTab('sqlDetail', { id }, true)
                            break
                        case MetaDataType.REPORT:
                            PageUtil.addTab('rptDetail', { id }, true)
                            break
                        case MetaDataType.PHYSICAL_MODEL:
                            PageUtil.addTab('physicalModelDetail', { id }, true)
                            break
                        default:
                            PageUtil.addTab('sysDetail', { id }, true)
                            break
                    }
                }}
            >
                <IconFont type={MetaDataType.icon(domain)} style={{ fontSize: 26 }} />
                <a className='Title ellipsisText' dangerouslySetInnerHTML={{ __html: title }} />
                <div className='DimGroup'>
                    {dimList
                        .filter((item) => item.enable)
                        .map((item, index) => {
                            return (
                                <Tooltip key={index} title={item.label}>
                                    <div className='DimItem'>
                                        <IconFont key={item.label} type={item.icon} />
                                    </div>
                                </Tooltip>
                            )
                        })}
                </div>
            </div>
        )
    }

    private renderTech() {
        const { data } = this.props
        let list: { label: string; content: string | number; disabled?: boolean }[] = []

        switch (data.domain) {
            case MetaDataType.PHYSICAL_TABLE:
                list = [
                    {
                        label: '所属系统',
                        content: data.systemName,
                    },
                    {
                        label: '数据源',
                        content: data.datasourceName,
                    },
                    {
                        label: '数据库',
                        content: data.databaseName,
                    },
                    {
                        label: '库类型',
                        content: data.datasourceType,
                    },
                    {
                        label: '数仓层级',
                        content: data.warehouseLevel,
                        disabled: !Boolean(data.warehouseLevel),
                    },
                    {
                        label: '分类',
                        content: data.warehouseClassify,
                    },
                    {
                        label: '技术负责人',
                        content: data.techManager,
                    },
                ]
                break
            case MetaDataType.REPORT:
                list = [
                    {
                        label: '所属系统',
                        content: data.systemName,
                    },
                    {
                        label: '报表目录',
                        content: data.reportMenu,
                    },
                    {
                        label: '技术负责人',
                        content: data.techManager,
                    },
                    {
                        label: '业务负责人',
                        content: data.businessManager,
                    },
                    {
                        label: '报表等级',
                        content: data.reportLevel,
                    },
                    {
                        label: '更新周期',
                        content: data.updatePeriod,
                    },
                ]
                break
            case MetaDataType.SQL:
                list = [
                    {
                        label: '所属系统',
                        content: data.systemName,
                    },
                    {
                        label: '数据源',
                        content: data.datasourceName,
                    },
                    {
                        label: '目标表',
                        content: data.tableEnName,
                    },
                    {
                        label: '脚本类型',
                        content: data.sqlType,
                    },
                    {
                        label: '技术负责人',
                        content: data.techManager,
                    },
                    {
                        label: '更新时间',
                        content: data.dataUpdateTime,
                    },
                ]
                break
            case MetaDataType.FIELD:
                list = [
                    {
                        label: '所属系统',
                        content: data.systemName,
                    },
                    {
                        label: '数据源',
                        content: data.datasourceName,
                    },
                    {
                        label: '数据库',
                        content: data.databaseName,
                    },
                    {
                        label: '数仓层级',
                        content: data.warehouseLevel,
                        disabled: !Boolean(data.warehouseLevel),
                    },
                    {
                        label: '所属表',
                        content: data.tableEnName,
                    },
                    {
                        label: '字段类型',
                        content: data.columnType,
                    },
                ]
                break
            case MetaDataType.PHYSICAL_MODEL:
                list = [
                    {
                        label: '所属系统',
                        content: data.systemName,
                    },
                    {
                        label: '数据源',
                        content: data.datasourceName,
                    },
                    {
                        label: '数据库',
                        content: data.databaseName,
                    },
                    {
                        label: '数据库类型',
                        content: data.product,
                    },
                    {
                        label: '模型类型',
                        content: data.modelTypeDesc,
                    },
                    {
                        label: '主题域',
                        content: data.topic,
                    },
                ]
                break
            default:
                break
        }

        return (
            <div className='TechGroup'>
                {list
                    .filter((item) => !item.disabled)
                    .map((item, index, array) => {
                        const isEmpty = item.content || item.content === 0
                        return (
                            <>
                                <span className='TechItem' key={index}>
                                    <label>{item.label}: </label>
                                    {isEmpty ? <span dangerouslySetInnerHTML={{ __html: item.content.toString() }} /> : <EmptyLabel />}
                                </span>
                                {index < array.length - 1 && <Divider type='vertical' />}
                            </>
                        )
                    })}
            </div>
        )
    }

    private renderFields() {
        const { data } = this.props
        let list: { label: string; content: ReactNode; itemClass?: string }[][] = []

        switch (data.domain) {
            case MetaDataType.PHYSICAL_TABLE:
                list = [
                    [
                        {
                            label: '中文完整度',
                            content: data.chnCompleteRatio,
                        },
                        {
                            label: '对标率',
                            content: data.columnMarkRatio,
                        },
                        {
                            label: '敏感字段',
                            content: data.sensitiveColumnNum,
                        },
                        {
                            label: '受控字段',
                            content: data.controlledColumnNum,
                        },
                        {
                            label: 'ER关系表',
                            content: data.relationTableNum,
                        },
                        {
                            label: '血缘关系表',
                            content: data.bloodTableNum,
                        },
                        {
                            label: '下游应用数量',
                            content: data.relationAppNum,
                        },
                    ],
                    [
                        {
                            label: `字段信息 (${data.columnEnNameList.length})`,
                            itemClass: 'ellipsisText',
                            content: data.columnEnNameList.map((item, index, array) => {
                                return (
                                    <span key={index} className='ColumnText'>
                                        {item.isPrimaryKey ? <IconFont type='icon-zhujian2' style={{ fontSize: 22 }} /> : null}
                                        {item.isForeignKey ? <IconFont type='icon-waijian2' style={{ fontSize: 22 }} /> : null}
                                        <span dangerouslySetInnerHTML={{ __html: item.name }} />
                                        {index < array.length - 1 ? '，' : ''}
                                    </span>
                                )
                            }),
                        },
                    ],
                ]
                break
            case MetaDataType.SQL:
                list = []
                break
            case MetaDataType.REPORT:
                list = [
                    [
                        {
                            label: '全链血缘表',
                            content: data.allChainRelationNum,
                        },
                        {
                            label: '源头表质量覆盖度',
                            content: data.sourceQualityRatio,
                        },
                        {
                            label: 'ER关系数',
                            content: data.relationTableNum,
                        },
                    ],
                ]
                break
            case MetaDataType.FIELD:
                list = [
                    [
                        {
                            label: '映射标准',
                            content: data.allChainRelationNum,
                        },
                        {
                            label: '检核规则',
                            content: data.checkRule,
                        },
                        {
                            label: '安全等级',
                            content: data.securityLevel,
                        },
                        {
                            label: '安全分类',
                            content: data.securityClassify,
                        },
                        {
                            label: '敏感标签',
                            content: data.sensitiveLabel as unknown as string,
                        },
                    ],
                ]
                break

            case MetaDataType.PHYSICAL_MODEL:
                list = [
                    [
                        {
                            label: '表数量',
                            content: data.tableCount,
                        },
                        {
                            label: '中文完整度',
                            content: data.chnCompleteRatio,
                        },
                        {
                            label: '对标率',
                            content: data.columnMarkRatio,
                        },
                    ],
                    [
                        {
                            label: `实体信息（${(data.modelEntityList || []).length}）`,
                            content: (
                                <>
                                    {(data.modelEntityList || []).map((item, index, array) => {
                                        const { entityName, mainEntityFlag } = item
                                        const needSplit = index < array.length - 1
                                        const content = `${entityName}${needSplit ? '，' : ''}`

                                        if (mainEntityFlag) {
                                            return (
                                                <Tooltip title='主实体'>
                                                    <span style={{ backgroundColor: 'rgba(255, 233, 201, 1)' }}>{content}</span>
                                                </Tooltip>
                                            )
                                        }
                                        return content
                                    })}
                                </>
                            ),
                        },
                    ],
                ]
                break
            default:
                break
        }
        if (!list.length) {
            return null
        }
        return (
            <div className='FieldsGroup'>
                {list.map((listItem) => {
                    return (
                        <div className='FieldRow'>
                            {listItem.map((item) => {
                                return (
                                    <span className={classNames('FieldItem', item.itemClass || '')}>
                                        <label>{item.label}: </label>
                                        <span>{item.content || item.content === 0 ? item.content : <EmptyLabel />}</span>
                                    </span>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }

    private renderTags() {
        const { data } = this.props
        const { sensitiveLabel, otherLabel } = data
        const tagGroupList = [
            {
                color: 'orange',
                list: sensitiveLabel instanceof Array ? sensitiveLabel : [],
            },
            {
                color: 'blue',
                list: otherLabel,
            },
        ].filter((item) => item.list && item.list.length)

        if (!tagGroupList.length) {
            return null
        }

        return (
            <div className='TagGroup'>
                {tagGroupList.map((groupItem) => {
                    return (
                        <div>
                            {groupItem.list.map((item, index) => {
                                return (
                                    <Tag key={index} color={groupItem.color}>
                                        <span dangerouslySetInnerHTML={{ __html: item.tagName }} />
                                    </Tag>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        return (
            <div className='MetaDataItem'>
                {/* 标题 */}
                {this.renderTitle()}
                {/* 技术信息  */}
                {this.renderTech()}
                {/* 统计信息 */}
                {this.renderFields()}
                {/* 标签  */}
                {this.renderTags()}
            </div>
        )
    }
}

export default MetaDataItem
