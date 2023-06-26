// 模型的表列表
import DataArchitectApi from '@/api/DataArchitectApi'
import EntitySelect from '@/app/dataArchitect/component/EntitySelect'
import AddTable from '@/app/dataArchitect/component/modelDetail/AddTable'
import ModelStatus from '@/app/dataArchitect/enum/ModelStatus'
import IModel from '@/app/dataArchitect/interface/IModel'
import IconFont from '@/component/IconFont'
import RichTableLayout, { IRichTableLayoutContoler } from '@/component/layout/RichTableLayout'
import { Button, Checkbox, Input, Modal, Popconfirm, Spin, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import React, { Key, useState } from 'react'
import styles from './ModelTableList.module.less'
interface IModelTableListProps {
    modelId: Key
    model: IModel

    disabledEdit?: boolean
}
/**
 * ModelTableList
 */
const ModelTableList: React.FC<IModelTableListProps> = (props) => {
    const { modelId, model, disabledEdit } = props
    const { modelTableList } = model
    const [keyword, setKeyword] = useState('')
    const [visibleAddTable, setVisibleAddTable] = useState(false)
    const [loadingSettingMainEntity, setLoadingSettingMainEntity] = useState(false)
    const [loadingRemove, setLoadingRemove] = useState(false)
    const [expandAll, setExpandAll] = useState(false)

    let tableController: IRichTableLayoutContoler<any>

    const online = model.modelStatus === ModelStatus.PUBLISHED
    const editEnable = !online && !disabledEdit

    const mainEntity = modelTableList ? modelTableList.find((item) => item.isMainEntity) : undefined

    const switchMainEntity = (record: any, mainEntityFlag: boolean) => {
        setLoadingSettingMainEntity(true)
        DataArchitectApi.setMainEntity({ modelId, entityId: record.mapEntityId, mainEntityFlag })
            .then((res) => {
                if (res.code === 200) {
                    tableController.reset()
                }
            })
            .finally(() => {
                setLoadingSettingMainEntity(false)
            })
    }

    const columns: ColumnProps<any>[] = [
        {
            title: '表英文名',
            dataIndex: 'tableEnglishName',
        },
        {
            title: '表中文名',
            dataIndex: 'tableChineseName',
        },
        {
            title: '映射实体',
            dataIndex: 'mapEntityName',
            render(value, record, index) {
                const { mapEntityId, mapEntityName } = record
                if (editEnable) {
                    return (
                        <EntitySelect
                            tableId={record.tableId}
                            value={
                                mapEntityId
                                    ? {
                                          entityId: mapEntityId,
                                          entityName: mapEntityName,
                                      }
                                    : undefined
                            }
                            onChange={() => {
                                tableController.reset()
                            }}
                        />
                    )
                }
                return record.mapEntityName
            },
        },
        {
            title: '主实体',
            width: 100,
            render(value, record) {
                const { isMainEntity, mapEntityId } = record
                // 已上线不可编辑
                if (editEnable) {
                    // 如果已有主实体且不是当前表，则点击时为“切换主实体”，需要二次确认
                    const isSwitchMode = Boolean(mainEntity) && mainEntity.mapEntityId !== mapEntityId
                    return isSwitchMode ? (
                        <Popconfirm title='是否切换为主实体' onConfirm={() => switchMainEntity(record, !isMainEntity)}>
                            <Spin spinning={loadingSettingMainEntity} wrapperClassName={styles.Spin} size='small'>
                                <Checkbox checked={isMainEntity} disabled={!mapEntityId} />
                            </Spin>
                        </Popconfirm>
                    ) : (
                        <Spin spinning={loadingSettingMainEntity} wrapperClassName={styles.Spin} size='small'>
                            <Checkbox checked={isMainEntity} disabled={!mapEntityId} onClick={() => switchMainEntity(record, !isMainEntity)} />
                        </Spin>
                    )
                }
                return isMainEntity ? <IconFont type='icon-gou1' /> : null
            },
        },
    ]

    return (
        <>
            <RichTableLayout<any>
                disabledDefaultFooter
                editColumnProps={{
                    hidden: !editEnable,
                    width: 80,
                    createEditColumnElements(index, item, defaultElement) {
                        const { isMainEntity } = item
                        return isMainEntity
                            ? []
                            : RichTableLayout.renderEditElements([
                                  {
                                      label: '移除',
                                      loading: loadingRemove,
                                      onClick: () => {
                                          // 请求提交消息
                                          DataArchitectApi.requestRemoveTableMessage({
                                              modelId,
                                              tableId: item.tableId,
                                          }).then((res) => {
                                              const { effectTableList } = res.data
                                              const message = effectTableList ? `此操作会同时移除：${effectTableList.map((item: any) => item.tableName).join('、')}` : ''
                                              Modal.confirm({
                                                  title: `移除表${item.tableEnglishName}`,
                                                  content: message,
                                                  okText: '移除',
                                                  cancelText: '取消',
                                                  okButtonProps: {
                                                      danger: true,
                                                  },
                                                  onOk: () => {
                                                      setLoadingRemove(true)
                                                      DataArchitectApi.removeTableFromModel({
                                                          modelId,
                                                          tableId: item.tableId,
                                                      })
                                                          .then(() => {
                                                              tableController.refresh()
                                                          })
                                                          .finally(() => {
                                                              setLoadingRemove(false)
                                                          })
                                                  },
                                              })
                                          })
                                      },
                                  },
                              ])
                    },
                }}
                smallLayout
                renderSearch={(controller) => {
                    tableController = controller
                    return (
                        <div className='HControlGroup' style={{ justifyContent: 'space-between', width: '100%' }}>
                            <Input.Search
                                placeholder='表名'
                                style={{ width: 400 }}
                                onSearch={(value) => {
                                    setKeyword(value)
                                    tableController.reset()
                                }}
                            />
                            {editEnable ? (
                                <Button type='primary' ghost onClick={() => setVisibleAddTable(true)}>
                                    添加表
                                </Button>
                            ) : (
                                <span />
                            )}
                        </div>
                    )
                }}
                requestListFunction={async () => {
                    const res = await DataArchitectApi.requestModelDetail(modelId, { tableName: keyword })
                    const modelTableList = res.data.modelTableList || []
                    // 异表请求字段列表
                    for (const item of modelTableList) {
                        const { tableId } = item
                        item.fieldList = []
                        DataArchitectApi.requestFieldList(tableId).then((fieldListRes) => {
                            item.fieldList = fieldListRes.data
                        })
                    }
                    return {
                        total: modelTableList.length,
                        dataSource: modelTableList,
                    }
                }}
                tableProps={{
                    key: 'tableId',
                    columns,
                    extraTableProps: {
                        key: expandAll,
                        expandable: {
                            defaultExpandAllRows: expandAll,
                            columnTitle: <IconFont type={expandAll ? 'icon-zhankai3' : 'icon-shouqi3'} onClick={() => setExpandAll(!expandAll)} />,
                            rowExpandable: (record) => Boolean(record.fieldList),
                            expandedRowRender: (record) => {
                                const { fieldList } = record
                                return (
                                    <Table
                                        rowKey='columnId'
                                        dataSource={fieldList}
                                        pagination={false}
                                        columns={[
                                            {
                                                title: '字段英文名',
                                                dataIndex: 'columnEnglishName',
                                            },
                                            {
                                                title: '字段中文名',
                                                dataIndex: 'columnChineseName',
                                            },
                                            {
                                                title: '规范化命名',
                                                render(value, record, index) {
                                                    return <div dangerouslySetInnerHTML={{ __html: record.specsEnglishName }} />
                                                },
                                            },
                                            {
                                                title: '字段类型',
                                                dataIndex: 'columnType',
                                            },
                                        ]}
                                    />
                                )
                            },
                        },
                    },
                }}
            />
            <AddTable
                modelId={modelId}
                visible={visibleAddTable}
                onSuccess={() => {
                    setVisibleAddTable(false)
                    tableController.reset()
                }}
                onCancel={() => setVisibleAddTable(false)}
            />
        </>
    )
}
export default ModelTableList
