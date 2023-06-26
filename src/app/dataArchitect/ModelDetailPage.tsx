import DataArchitectApi from '@/api/DataArchitectApi'
import ModelEr from '@/app/dataArchitect/component/modelDetail/ModelEr'
import ModelHistoryList from '@/app/dataArchitect/component/modelDetail/ModelHistoryList'
import ModelTableList from '@/app/dataArchitect/component/modelDetail/ModelTableList'
import ModelEdit from '@/app/dataArchitect/component/ModelEdit'
import ModelStatus from '@/app/dataArchitect/enum/ModelStatus'
import ModelType from '@/app/dataArchitect/enum/ModelType'
import IModel from '@/app/dataArchitect/interface/IModel'
import IconFont from '@/component/IconFont'
import PageFooter from '@/component/layout/PageFooter'
import ProjectUtil from '@/utils/ProjectUtil'
import { Alert, Button, Modal, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './ModelDetailPage.module.less'

interface IModelDetailPageProps {}
/**
 * 模型详情页
 */
const ModelDetailPage: React.FC<IModelDetailPageProps> = (props) => {
    const modelId = ProjectUtil.getPageParam(props).id
    const [modelData, setModelData] = useState<IModel>()
    const [btnPublishLoading, setBtnPublishLoading] = useState(false)
    const [visibleEdit, setVisibleEdit] = useState(false)
    const [offlineMsg, setOfflineMsg] = useState('')

    useEffect(() => {
        requestModelData()
        requestOfflineMsg()
    }, [modelId])

    const requestModelData = async () => {
        const res = await DataArchitectApi.requestModelDetail(modelId)
        setModelData(res.data || {})
    }

    const requestOfflineMsg = () => {
        DataArchitectApi.requestModelOfflinMsg(modelId).then((res) => {
            setOfflineMsg(res.msg)
        })
    }

    const renderHeader = () => {
        if (!modelData) {
            return
        }

        const { modelEnglishName, modelChineseName, modelType, modelStatus, modelPath } = modelData

        const online = modelStatus === ModelStatus.PUBLISHED

        return (
            <header>
                <div className={styles.TitleContainer}>
                    <h4>
                        <IconFont
                            type='e738'
                            useCss
                            style={{ color: 'white', width: 18, height: 18, fontSize: 12, textAlign: 'center', lineHeight: '18px', borderRadius: 1, background: 'rgba(104, 110, 226, 1)' }}
                        />
                        <span className={styles.Title}>
                            {modelChineseName} {modelEnglishName ? `[${modelEnglishName}]` : ''}
                        </span>
                        <div className={styles.TypeTag}>{ModelType.toString(modelType)}</div>
                        <div className={styles.Status} style={{ color: ModelStatus.toColor(modelStatus), marginRight: 3 }}>
                            <IconFont type='e736' useCss />
                            {ModelStatus.toString(modelStatus)}
                        </div>
                    </h4>
                    <div className='HControlGroup'>
                        {!online && (
                            <Button type='primary' ghost icon={<IconFont type='e684' useCss />} onClick={() => setVisibleEdit(true)}>
                                编辑
                            </Button>
                        )}
                        <Button
                            loading={btnPublishLoading}
                            type='primary'
                            ghost={online}
                            icon={<IconFont type='e737' useCss />}
                            onClick={() => {
                                const onOk = (promise: Promise<any>) => {
                                    setBtnPublishLoading(true)
                                    promise
                                        .then(() => {
                                            requestModelData()
                                        })
                                        .finally(() => {
                                            setBtnPublishLoading(false)
                                        })
                                }

                                if (online) {
                                    Modal.confirm({
                                        title: '下线模型',
                                        okButtonProps: {
                                            danger: true,
                                        },
                                        okText: '下线',
                                        content: '模型下线后，将从“资产目录”中移除。',
                                        onOk: () => onOk(DataArchitectApi.offlineModel(modelId)),
                                    })
                                } else {
                                    Modal.confirm({
                                        title: '发布模型',
                                        okText: '发布',
                                        cancelText: '取消',
                                        content: '模型发布后，将在“资产目录”中展示该资源。',
                                        onOk: () => onOk(DataArchitectApi.publishModel(modelId)),
                                    })
                                }
                            }}
                        >
                            {online ? '下线' : '发布'}
                        </Button>
                    </div>
                </div>
                <div className={styles.Info}>
                    <IconFont type='e6c4' useCss />
                    <span>路径：{modelPath}</span>
                </div>
            </header>
        )
    }
    return (
        <div className={styles.ModelDetailPage}>
            {offlineMsg && <Alert type='warning' message={offlineMsg} showIcon />}
            {renderHeader()}
            <main>
                <Tabs defaultActiveKey='table' className='FlexTabs' style={{ height: '100%' }}>
                    {[
                        {
                            key: 'table',
                            label: '表列表',
                            content: modelData ? <ModelTableList modelId={modelId} model={modelData} /> : null,
                        },
                        {
                            key: 'er',
                            label: 'ER关系',
                            content: modelData ? <ModelEr model={modelData} /> : null,
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
            </main>
            <PageFooter style={{ marginTop: 20 }} />
            {modelData && (
                <ModelEdit
                    visible={visibleEdit}
                    onClose={() => setVisibleEdit(false)}
                    target={modelData}
                    onSuccess={() => {
                        setVisibleEdit(false)
                        requestModelData()
                    }}
                />
            )}
        </div>
    )
}
export default ModelDetailPage
