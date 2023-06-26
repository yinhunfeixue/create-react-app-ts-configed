import DataDissectApi from '@/api/DataDissectApi'
import DataDissectSettingItem from '@/app/dataDissect/component/DataDissectSettingItem'
import DetailItem from '@/app/dataDissect/component/DetailItem'
import OverviewItem from '@/app/dataDissect/component/OverviewItem'
import DataDissectEdit from '@/app/dataDissect/DataDissectEdit'
import DissectStatus from '@/app/dataDissect/enum/DissectStatus'
import DissectType from '@/app/dataDissect/enum/DissectType'
import FieldType from '@/app/dataDissect/enum/FieldType'
import IAnalysisResult from '@/app/dataDissect/interface/IAnalysisResult'
import EmptyIcon from '@/component/EmptyIcon'
import IconFont from '@/component/IconFont'
import PageHeader from '@/component/PageHeader'
import PageUtil from '@/utils/PageUtil'
import ProjectUtil from '@/utils/ProjectUtil'
import { Divider, Input, Modal, Select, Spin } from 'antd'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import styles from './DataDissectDetailPage.module.less'

interface IDataDissectDetailPageProps {}

/**
 * 剖析结果详情
 */
const DataDissectDetailPage: React.FC<IDataDissectDetailPageProps> = (props) => {
    const defaultId = ProjectUtil.getPageParam(props).id
    const [visibleOverview, setVisibleOverview] = useState(true)
    const [detailData, setDetailData] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [selectItem, setSelectItem] = useState<IAnalysisResult>()
    const [selecteDetailIndex, setSelecteDetailIndex] = useState<number>()

    const [searchParams, setSearchParams] = useState<{ keywords?: string; valueType?: FieldType }>({})

    // 全部剖析设置列表
    const [settingList, setSettingList] = useState<IAnalysisResult[]>([])
    const [visibleSettingList, setVisibleSettingList] = useState(false)
    const [visibleEdit, setVisibleEdit] = useState(false)

    const updateSearchParams = (value: Partial<typeof searchParams>) => {
        setSearchParams({
            ...searchParams,
            ...value,
        })
    }

    const requestDetail = async () => {
        if (!selectItem) {
            return
        }
        setLoading(true)
        DataDissectApi.requestResultDetail({ tableId: selectItem.tableId, columnName: searchParams.keywords, columnTransformType: searchParams.valueType })
            .then((res) => {
                if (res.code === 200) {
                    setDetailData(res.data)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const requestSettingList = () => {
        DataDissectApi.requestResultList({ page: 1, pageSize: 9999 }).then((res) => {
            if (res.code === 200) {
                const list: IAnalysisResult[] = res.data || []
                setSettingList(list)

                // 获取列表后，将选中项设置为默认值
                if (defaultId) {
                    setSelectItem(list.find((item) => item.tableId === defaultId))
                }
            }
        })
    }

    useEffect(() => {
        requestSettingList()
    }, [])

    useEffect(() => {
        if (selectItem && selectItem.analysisStatus === DissectStatus.SUCCESS) {
            requestDetail()
        }
    }, [selectItem, searchParams])

    const renderHeader = () => {
        const title = selectItem ? selectItem.tableName : ''
        return (
            <React.Fragment>
                <span>数据剖析</span>
                <Divider type='vertical' />
                <IconFont type='icon-wulibiao' style={{ fontSize: 16, marginRight: 8 }} />
                <span onClick={() => setVisibleSettingList(!visibleSettingList)}>
                    {title} <IconFont type={visibleSettingList ? 'icon-shang' : 'icon-xiangxia'} />
                </span>
            </React.Fragment>
        )
    }

    const renderSettingList = () => {
        return (
            <div className={classNames(styles.SettingListWrap, visibleSettingList ? styles.SettingListWrapShow : '')} onClick={() => setVisibleSettingList(false)}>
                <div className={classNames('commonScroll', styles.SettingList, visibleSettingList ? styles.SettingListShow : '')}>
                    {settingList.map((item, index) => {
                        const selected = selectItem && selectItem.tableId === item.tableId
                        return (
                            <DataDissectSettingItem
                                className={classNames(styles.ItemWrap, selected ? styles.ItemWrapSelected : '')}
                                data={item}
                                key={index}
                                onClick={() => {
                                    setSelectItem(item)
                                    setVisibleSettingList(false)
                                }}
                            >
                                <IconFont type='icon-icon_tag_top' className={classNames(styles.ItemIcon, selected ? styles.ItemIconShow : '')} />
                            </DataDissectSettingItem>
                        )
                    })}
                </div>
            </div>
        )
    }

    if (!selectItem) {
        return null
    }

    const {
        totalDataNum,
        columnNum,
        relatedTableNum,
        upperBloodTableNum = 0,
        lowerBloodTableNum = 0,
        bloodColumnNum,
        nullColumnNum,
        nullColumnPercent,
        emptyColumnNum,
        emptyColumnPercent,
        uniqueColumnNum,
        uniqueColumnPercent,
        columnResultList = [],
    } = detailData

    const renderPath = () => {
        const { datasourceName, databaseName, tableName, analysisType, analysisStatus } = selectItem
        return (
            <div className={styles.Path}>
                <span>
                    来源路径：{datasourceName}/{databaseName}/{tableName}
                </span>
                <div className={styles.Type}>{DissectType.toFullString(analysisType)}</div>
                <div className={styles.Status} style={{ borderColor: DissectStatus.toBorderColor(analysisStatus), color: DissectStatus.toColor(analysisStatus) }}>
                    {DissectStatus.toString(analysisStatus)}
                </div>
            </div>
        )
    }

    const renderProgress = () => {
        return (
            <div className={styles.OverviewModule}>
                {renderPath()}
                <EmptyIcon title='剖析中...' style={{ marginTop: 150 }} description='数据剖析将消耗一定计算资源，运算的时间较长' icon={<Spin spinning size='large' />} />
            </div>
        )
    }

    const renderError = () => {
        return (
            <div className={styles.OverviewModule}>
                {renderPath()}
                <EmptyIcon
                    title='剖析结果已失效'
                    style={{ marginTop: 150 }}
                    description={
                        <span>
                            由于表数据变更导致结果失效，建议<a onClick={() => setVisibleEdit(true)}>修改设置</a>
                        </span>
                    }
                    iconSize={90}
                    type='icon-kongshuju'
                />
            </div>
        )
    }

    const renderExpire = () => {
        return (
            <div className={styles.OverviewModule}>
                {renderPath()}
                <EmptyIcon
                    title='剖析结果已过期'
                    style={{ marginTop: 150 }}
                    type='icon-kongshuju'
                    iconSize={90}
                    description={
                        <span>
                            超过30天数据过期，为保证数据的真实情况，建议<a onClick={() => setVisibleEdit(true)}>修改设置</a>
                        </span>
                    }
                />
            </div>
        )
    }

    const renderSuccess = () => {
        return (
            <Spin spinning={loading} wrapperClassName={styles.SuccessContainer}>
                <div className={styles.OverviewModule}>
                    {/* 路径和状态 */}
                    {renderPath()}
                    {/* 概况 */}
                    <div className={classNames(styles.Overview, !visibleOverview ? styles.OverviewHide : '')}>
                        {[
                            {
                                title: '基本信息',
                                content: [
                                    {
                                        title: '总数据量',
                                        icon: require('app_images/dataDissect/iconTotal.png'),
                                        content: (
                                            <span>
                                                <b>{ProjectUtil.formatBigNumber(totalDataNum)}</b>条
                                            </span>
                                        ),
                                    },
                                    {
                                        title: '字段数',
                                        icon: require('app_images/dataDissect/iconField.png'),
                                        content: (
                                            <span>
                                                <b>{columnNum}</b>个
                                            </span>
                                        ),
                                    },
                                    {
                                        title: '关联表数',
                                        icon: require('app_images/dataDissect/iconTable.png'),
                                        content: (
                                            <span>
                                                <b>{relatedTableNum}</b>张
                                            </span>
                                        ),
                                    },
                                    {
                                        title: '血缘表数',
                                        icon: require('app_images/dataDissect/iconBloodTable.png'),
                                        content: (
                                            <span>
                                                上游 <b>{upperBloodTableNum}</b> / 下游 <b>{lowerBloodTableNum}</b>
                                            </span>
                                        ),
                                    },
                                    {
                                        title: '血缘字段数',
                                        icon: require('app_images/dataDissect/iconBloodTable.png'),
                                        content: (
                                            <span>
                                                <b>{ProjectUtil.formatBigNumber(bloodColumnNum)}</b>条
                                            </span>
                                        ),
                                        showTag: true,
                                    },
                                ].map((item) => {
                                    return <OverviewItem data={item} />
                                }),
                            },
                            {
                                title: '质量特征',
                                content: [
                                    {
                                        title: '空值字段数',
                                        icon: require('app_images/dataDissect/iconQuality.png'),
                                        content: (
                                            <span>
                                                <b>{ProjectUtil.formatBigNumber(nullColumnNum)}</b>条 {ProjectUtil.fixedNumber(nullColumnPercent, 4)}%
                                            </span>
                                        ),
                                    },
                                    {
                                        title: '空白值字段数',
                                        icon: require('app_images/dataDissect/iconQuality.png'),
                                        content: (
                                            <span>
                                                <b>{ProjectUtil.formatBigNumber(emptyColumnNum)}</b>条 {ProjectUtil.fixedNumber(emptyColumnPercent, 4)}%
                                            </span>
                                        ),
                                    },
                                    {
                                        title: '单一值字段数',
                                        icon: require('app_images/dataDissect/iconQuality.png'),
                                        content: (
                                            <span>
                                                <b>{ProjectUtil.formatBigNumber(uniqueColumnNum)}</b>条 {ProjectUtil.fixedNumber(uniqueColumnPercent, 4)}%
                                            </span>
                                        ),
                                    },
                                ].map((item) => {
                                    return <OverviewItem data={item} />
                                }),
                            },
                        ].map((item) => {
                            return (
                                <div className={styles.OverviewGroup}>
                                    <h3>{item.title}</h3>
                                    <main>{item.content}</main>
                                </div>
                            )
                        })}
                    </div>
                </div>
                {/* 收回按钮 */}
                <div className={styles.BtnSwitchOverview} onClick={() => setVisibleOverview(!visibleOverview)}>
                    <IconFont className={classNames(styles.Icon, !visibleOverview ? styles.IconHide : '')} type='icon-shang' />
                </div>
                {/* 图表 */}
                {columnResultList && columnResultList.length ? (
                    <div className={classNames(styles.ChartGroup)}>
                        {columnResultList.map((item: any, index: number) => {
                            const selected = index === selecteDetailIndex
                            return <DetailItem key={index} data={item} className={selected ? styles.DetailItemSelected : ''} onClick={() => setSelecteDetailIndex(index)} />
                        })}
                    </div>
                ) : (
                    <EmptyIcon />
                )}
            </Spin>
        )
    }

    const renderBody = () => {
        switch (selectItem.analysisStatus) {
            case DissectStatus.DOING:
                return renderProgress()
            case DissectStatus.INVALID:
                return renderError()
            case DissectStatus.EXPIRE:
                return renderExpire()
            default:
                return renderSuccess()
        }
    }

    const renderHeaderExtra = () => {
        const searchEnable = selectItem.analysisStatus === DissectStatus.SUCCESS
        if (searchEnable) {
            return (
                <React.Fragment>
                    <Input.Search loading={loading} placeholder='字段搜索' style={{ width: 200 }} onSearch={(value) => updateSearchParams({ keywords: value })} />
                    <Select
                        allowClear
                        loading={loading}
                        placeholder='值类型'
                        style={{ width: 120 }}
                        options={FieldType.ALL.map((item) => {
                            return {
                                value: item,
                                label: FieldType.toString(item),
                            }
                        })}
                        value={searchParams.valueType}
                        onChange={(value) => updateSearchParams({ valueType: value })}
                    />
                    <Divider type='vertical' />
                    <IconFont type='icon-shezhi' className={styles.IconSetting} onClick={() => setVisibleEdit(true)} />
                </React.Fragment>
            )
        }
        return null
    }

    return (
        <div className={styles.DataDissectDetailPage}>
            {/* 页头 */}
            <PageHeader title={renderHeader()} extra={renderHeaderExtra()} />
            <main className='commonScroll'>
                {renderSettingList()}
                {renderBody()}
            </main>

            {/* 编辑 */}
            <DataDissectEdit
                visible={visibleEdit}
                onSuccess={() => {
                    setVisibleEdit(false)
                    Modal.success({
                        title: '设置成功',
                        content: `数据剖析需要一定时间，请耐心等候`,
                        okText: '返回列表页',
                        onOk: () => {
                            ProjectUtil.historyBack().catch(() => PageUtil.addTab('dataDissect'))
                        },
                    })
                }}
                data={selectItem}
                onClose={() => {
                    setVisibleEdit(false)
                }}
            />
        </div>
    )
}
export default DataDissectDetailPage
