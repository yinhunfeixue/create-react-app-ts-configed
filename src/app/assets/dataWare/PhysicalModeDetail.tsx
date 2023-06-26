import DataArchitectApi from '@/api/DataArchitectApi'
import ModelTableList from '@/app/assets/dataWare/component/ModelTableList'
import ModelEr from '@/app/dataArchitect/component/modelDetail/ModelEr'
import ModelHistoryList from '@/app/dataArchitect/component/modelDetail/ModelHistoryList'
import IModel from '@/app/dataArchitect/interface/IModel'
import MetaDataType from '@/app/metadataCenter/enum/MetaDataType'
import IconFont from '@/component/IconFont'
import SliderLayout2 from '@/component/layout/SliderLayout2'
import PageHeader from '@/component/PageHeader'
import ListHorizontal from '@/components/listHorizontal'
import ProjectUtil from '@/utils/ProjectUtil'
import { Collapse, Tabs } from 'antd'
import classNames from 'classnames'
import _ from 'lodash'
import React, { ReactNode, useEffect, useState } from 'react'
import styles from './PhysicalModeDetail.module.less'

interface IPhysicalModeDetailProps {}
/**
 * PhysicalModeDetail
 */
const PhysicalModeDetail: React.FC<IPhysicalModeDetailProps> = (props) => {
    const { id } = ProjectUtil.getPageParam(props)

    const [data, setData] = useState<IModel>()
    const [info, setInfo] = useState()

    useEffect(() => {
        requestData()
    }, [id])

    const requestData = () => {
        if (id) {
            DataArchitectApi.requestModelInfo(id).then((res) => {
                setInfo(res.data)
            })

            DataArchitectApi.requestModelDetail(id).then((res) => {
                if (res.code === 200) {
                    setData(res.data)
                }
            })
        }
    }

    const renderDetailList = (list: any[]) => {
        const hasInfo = Boolean(list.find((item) => Boolean(item.content)))
        return hasInfo ? (
            <ListHorizontal.Wrap className='listHorizontal'>
                {list.map((v, index) => (
                    <ListHorizontal labelWidth={90} toolTipWidth={144} valueToolTip style={{ marginBottom: index === list.length - 1 ? 0 : 16 }} key={v.label} {...v} />
                ))}
            </ListHorizontal.Wrap>
        ) : null
    }

    const renderBaseInfo = () => {
        const list = [
            {
                label: '所属系统',
                content: _.get(info, 'systemName', ''),
            },
            {
                label: '数据源',
                content: _.get(info, 'datasourceName', ''),
            },
            {
                label: '数据库',
                content: _.get(info, 'databaseName', ''),
            },
            {
                label: '数据库类型',
                content: _.get(info, 'product', ''),
            },
            {
                label: '模型类别',
                content: _.get(info, 'modelTypeDesc', ''),
            },
            {
                label: '主题域',
                content: _.get(info, 'topic', ''),
            },
            {
                label: '主实体',
                content: _.get(info, 'mainEntityName', ''),
            },
        ]
        return renderDetailList(list)
    }

    const renderTechInfo = () => {
        const list = [
            {
                label: '最新变更时间',
                content: _.get(info, 'updateTime', ''),
            },
            {
                label: '创建时间',
                content: _.get(info, 'createTime', ''),
            },
        ]
        return renderDetailList(list)
    }

    const renderTags = () => {
        const list: string[] = info ? (info as any).tagList : []
        return list && list.length ? (
            <div className={styles.TagGroup}>
                {list.map((item, index) => (
                    <div key={index} className={styles.TagItem}>
                        {item}
                    </div>
                ))}
            </div>
        ) : null
    }

    const renderSliderContent = () => {
        const panelList: {
            title: string
            icon: string
            content?: ReactNode
            disabled?: boolean
            emptyLabel: ReactNode
        }[] = [
            {
                title: '基本信息',
                emptyLabel: '暂无信息',
                icon: 'icon-xinxi',
                content: renderBaseInfo(),
            },
            {
                title: '技术信息',
                emptyLabel: '暂无信息',
                icon: 'icon-jishu',
                content: renderTechInfo(),
            },
            {
                title: '标签信息',
                emptyLabel: '暂无信息',
                icon: 'icon-biaoqian',
                content: renderTags(),
            },
        ]

        return (
            <Collapse ghost defaultActiveKey='0' style={{ marginTop: 8 }}>
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

    const renderContent = () => {
        const modelId = id

        return (
            <Tabs defaultActiveKey='table' className={classNames('FlexTabs', styles.Tabs)} style={{ height: '100%' }}>
                {[
                    {
                        key: 'table',
                        label: '表列表',
                        content: data ? <ModelTableList modelId={modelId} /> : null,
                    },
                    {
                        key: 'er',
                        label: 'ER关系',
                        content: data ? <ModelEr model={data} /> : null,
                    },
                    {
                        key: 'history',
                        label: '历史版本',
                        content: <ModelHistoryList modelId={modelId} />,
                    },
                ].map((item, index) => {
                    return (
                        <Tabs.TabPane key={item.key} tab={item.label}>
                            {item.content}
                        </Tabs.TabPane>
                    )
                })}
            </Tabs>
        )
    }

    return (
        <div className={styles.PhysicalModeDetail}>
            <PageHeader
                title={
                    <span className='HControlGroup'>
                        <IconFont type={MetaDataType.icon(MetaDataType.PHYSICAL_TABLE)} style={{ fontSize: 26, marginRight: 12 }} />
                        {data && (
                            <span>
                                {data.modelChineseName}
                                {data.modelEnglishName ? `[${data.modelEnglishName}]` : ''}
                            </span>
                        )}
                    </span>
                }
            />
            <SliderLayout2
                className={styles.Body}
                renderSlider={() => {
                    return renderSliderContent()
                }}
                renderContent={() => {
                    return renderContent()
                }}
            />
        </div>
    )
}
export default PhysicalModeDetail
