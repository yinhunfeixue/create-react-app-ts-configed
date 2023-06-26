import DataArchitectApi from '@/api/DataArchitectApi'
import ModelStatus from '@/app/dataArchitect/enum/ModelStatus'
import ModelType from '@/app/dataArchitect/enum/ModelType'
import IModel from '@/app/dataArchitect/interface/IModel'
import IconFont from '@/component/IconFont'
import PageUtil from '@/utils/PageUtil'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Dropdown, Menu, Modal, Spin, Tooltip } from 'antd'
import { MenuInfo } from 'rc-menu/lib/interface'
import React, { useState } from 'react'
import styles from './ModelItem.module.less'

interface IModelItemProps {
    data: IModel
    onUpdate: () => void
}
/**
 * ModelItem
 */
const ModelItem: React.FC<IModelItemProps> = (props) => {
    const { onUpdate, data } = props
    const { modelEnglishName, mainEntityName, entityCount, tableCount, modelStatus, modelType, hasUpdate, modelId } = data
    const [loading, setLoading] = useState(false)

    const update = (promise: Promise<any>) => {
        setLoading(true)
        promise
            .then((res) => {
                if (res.code === 200) {
                    onUpdate()
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const gotoDetail = () => {
        PageUtil.addTab('dataArchitectModel', {
            id: modelId,
        })
    }

    return (
        <div className={styles.ModelItem} onClick={() => gotoDetail()}>
            <header>
                <IconFont type='icon-moxingfill' />
                <span>{modelEnglishName}</span>
            </header>
            <main>
                {[
                    {
                        icon: 'icon-zhushiti',
                        label: '主实体',
                        content: mainEntityName,
                    },
                    {
                        icon: 'icon-shiti',
                        label: '实体数',
                        content: entityCount,
                    },
                    {
                        icon: 'icon-biaodanzujian-biaoge',
                        label: '表数量',
                        content: tableCount,
                    },
                ].map((item) => {
                    return (
                        <div>
                            <IconFont type={item.icon} />
                            <span>
                                {item.label}：{item.content}
                            </span>
                        </div>
                    )
                })}
            </main>
            <footer>
                <div className={styles.TypeTag}>{ModelType.toString(modelType)}</div>
                <Dropdown
                    trigger={['hover']}
                    overlay={
                        <Menu
                            style={{ width: 120 }}
                            items={[
                                {
                                    label: '发布',
                                    key: 'publish',
                                    disabled: modelStatus === ModelStatus.PUBLISHED,
                                    onClick: (event: MenuInfo) => {
                                        event.domEvent.stopPropagation()
                                        Modal.confirm({
                                            title: '发布模型',
                                            okText: '发布',
                                            cancelText: '取消',
                                            content: '模型发布后，将在“资产目录”中展示该资源。',
                                            onOk: () => update(DataArchitectApi.publishModel(modelId)),
                                        })
                                    },
                                },
                                {
                                    label: '下线',
                                    key: 'offline',
                                    disabled: modelStatus === ModelStatus.DRAFT,
                                    onClick: (event: MenuInfo) => {
                                        event.domEvent.stopPropagation()

                                        Modal.confirm({
                                            title: '下线模型',
                                            okButtonProps: {
                                                danger: true,
                                            },
                                            okText: '下线',
                                            content: '模型下线后，将从“资产目录”中移除。',
                                            onOk: () => update(DataArchitectApi.offlineModel(modelId)),
                                        })
                                    },
                                },
                            ].filter((item) => item.disabled !== true)}
                        ></Menu>
                    }
                >
                    <Spin spinning={loading}>
                        <IconFont type='icon-more' className='IconButton' onClick={(event) => event.stopPropagation()} />
                    </Spin>
                </Dropdown>
            </footer>
            <div className={styles.StatusBar}>
                {hasUpdate && (
                    <Tooltip title='版本更新'>
                        <ExclamationCircleFilled style={{ color: 'rgba(245, 75, 69, 1)' }} />
                    </Tooltip>
                )}
                <Tooltip title={ModelStatus.toString(modelStatus)}>
                    <IconFont type='e736' useCss className={styles.IconStatus} style={{ backgroundColor: ModelStatus.toColor(modelStatus) }} />
                </Tooltip>
            </div>
        </div>
    )
}
export default ModelItem
