import DataDissectApi from '@/api/DataDissectApi'
import TableSelectModal from '@/app/dama/examination/component/TableSelectModal'
import FieldValueTypeSelect from '@/app/dataDissect/component/FieldValueTypeSelect'
import DissectStatus from '@/app/dataDissect/enum/DissectStatus'
import DissectType from '@/app/dataDissect/enum/DissectType'
import FieldType from '@/app/dataDissect/enum/FieldType'
import SpotCheckType from '@/app/dataDissect/enum/SpotCheckType'
import IAnalysisResult from '@/app/dataDissect/interface/IAnalysisResult'
import IDissectSetting from '@/app/dataDissect/interface/IDissectSetting'
import IField from '@/app/dataDissect/interface/IField'
import IconFont from '@/component/IconFont'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, InputNumber, message, Radio, Table } from 'antd'
import L from 'lodash'
import React, { ReactNode, useEffect, useState } from 'react'
import styles from './DataDissectEdit.module.less'

interface IDataDissectEditProps {
    data?: IAnalysisResult
    visible: boolean
    onSuccess: () => void
    onClose: () => void
}

/**
 * 数据剖析编辑
 */
const DataDissectEdit: React.FC<IDataDissectEditProps> = (props) => {
    const { data, onClose, visible, onSuccess } = props

    const defaultFormData: Partial<IDissectSetting> = {
        analysisType: DissectType.ALL,
        samplingType: SpotCheckType.CONTINUOUS,
    }

    const [lastFormData, setLastFormData] = useState<Partial<IDissectSetting>>()
    const [formData, setFormData] = useState<Partial<IDissectSetting>>({ ...defaultFormData })
    const [visibleTableModal, setVisibleTableModal] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)

    useEffect(() => {
        // 如果是新建，或者编辑的对象是失败状态，则获取字段列表
        if (!data || data.analysisStatus === DissectStatus.INVALID) {
            requestFieldList()
        }
    }, [formData.target])

    useEffect(() => {
        if (visible) {
            reset()
            requestConfigData()
        }
    }, [data, visible])

    // 是否编辑模式
    const isEdit = Boolean(data)
    const [loading, setLoading] = useState(false)

    // 是否显示字段列表
    const [showFields, setShowFields] = useState(true)

    const reset = () => {
        setFormData({ ...defaultFormData })
    }

    const requestSave = async () => {
        if (!validateFormData()) {
            return
        }
        setLoading(true)
        DataDissectApi.saveDissectSetting(formData as IDissectSetting, Boolean(data))
            .then((res) => {
                if (res.code === 200) {
                    message.success(`保存成功。数据剖析将消耗一定计算资源，运算的时间较长`)
                    onSuccess()
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const validateFormData = () => {
        const { target, analysisType, samplingType, spotNumber, spotSql } = formData
        // 剖析对象：必填
        if (!target) {
            playError(`请选择剖析对象`, 'targetErrorElement')
            return false
        }

        // 如果剖析方式是抽样，检查抽样参数
        if (analysisType === DissectType.SPOTCHECK) {
            // 如果是连续抽样，数量必填
            // 如果是过滤抽样，sql必填
            switch (samplingType) {
                case SpotCheckType.CONTINUOUS:
                    if (!spotNumber) {
                        playError(`请设置抽样数量`, 'spotNumberErrorElement')
                        return false
                    }
                    break
                case SpotCheckType.FILTER:
                    if (!spotSql) {
                        playError(`请补充抽样方式`, 'spotSqlErrorElement')
                        return false
                    }
                    break
            }
        }

        return true
    }

    const playError = (msg: ReactNode, elementId: string) => {
        message.warning(msg)

        if (elementId) {
            const element = document.getElementById(elementId)
            if (element) {
                const name = 'erroringElement'
                element.classList.add(name)
                element.addEventListener(
                    'animationend',
                    () => {
                        element.classList.remove(name)
                    },
                    { once: true }
                )
            }
        }
    }

    const updateFormData = (value: Partial<IDissectSetting>) => {
        setFormData({ ...formData, ...value })
    }

    // 查询表格所有字段
    const requestFieldList = () => {
        if (formData.target && formData.target.tableId) {
            const { tableId } = formData.target
            setTableLoading(true)
            DataDissectApi.requestFieldList(tableId)
                .then((res) => {
                    if (res.code === 200) {
                        const list: IField[] = res.data || []
                        updateFormData({
                            columnConfigList: list,
                        })
                    }
                })
                .finally(() => {
                    setTableLoading(false)
                })
        }
    }

    const requestConfigData = () => {
        if (data) {
            DataDissectApi.requestConfigData(data.tableId).then((res) => {
                if (res.code === 200) {
                    const data = res.data
                    const formData = {
                        target: {
                            databaseId: data.databaseId,
                            databaseName: data.databaseName,
                            datasourceId: data.datasourceId,
                            datasourceName: data.datasourceName,
                            tableId: data.tableId,
                            tableName: data.tableName,
                            product: data.product,
                        },
                        analysisType: data.analysisType,
                        columnConfigList: data.columnConfigList,
                        samplingType: data.samplingType,
                        spotNumber: data.samplingType === SpotCheckType.CONTINUOUS ? data.samplingConfig : undefined,
                        spotSql: data.samplingType === SpotCheckType.FILTER ? data.samplingConfig : undefined,
                    }
                    updateFormData(formData)
                    setLastFormData(L.cloneDeep(formData))
                }
            })
        }
    }

    // 剖析对象
    const { target, analysisType, samplingType, spotNumber, spotSql } = formData

    const renderTarget = () => {
        const enableEdit = !isEdit
        if (!target) {
            return (
                <a id='targetErrorElement' style={{ display: 'inline-block' }} onClick={() => setVisibleTableModal(true)}>
                    选择对象 {'>'}
                </a>
            )
        }
        return (
            <div>
                {enableEdit ? (
                    <a onClick={() => setVisibleTableModal(true)}>
                        {target.tableName} <IconFont type='e684' useCss />
                    </a>
                ) : (
                    <span>{target.tableName}</span>
                )}

                <div className='unImportText'>
                    路径：{target.datasourceName}/{target.databaseName}
                </div>
            </div>
        )
    }

    const renderSetting = () => {
        return (
            <React.Fragment>
                {[
                    {
                        title: '2.1 剖析方式',
                        content: (
                            <Radio.Group
                                disabled={isEdit}
                                className={styles.StepSecondContentGroup}
                                value={analysisType}
                                onChange={(event) => {
                                    updateFormData({
                                        analysisType: event.target.value,
                                    })
                                }}
                            >
                                {[DissectType.ALL, DissectType.SPOTCHECK].map((item) => {
                                    return (
                                        <Radio key={item} value={item}>
                                            {DissectType.toString(item)}
                                        </Radio>
                                    )
                                })}
                            </Radio.Group>
                        ),
                    },
                    {
                        title: '2.2 抽样方式',
                        disabled: analysisType !== DissectType.SPOTCHECK,
                        content: (
                            <Radio.Group
                                className={styles.StepSecondContentGroup}
                                value={samplingType}
                                onChange={(event) => {
                                    updateFormData({
                                        samplingType: event.target.value,
                                    })
                                }}
                            >
                                <div className='HControlGroup'>
                                    <Radio value={SpotCheckType.CONTINUOUS}>{SpotCheckType.toString(SpotCheckType.CONTINUOUS)}</Radio>
                                    {samplingType === SpotCheckType.CONTINUOUS && (
                                        <React.Fragment>
                                            <span id='spotNumberErrorElement'>
                                                <InputNumber
                                                    value={spotNumber}
                                                    min={1}
                                                    max={5000}
                                                    onChange={(value) => {
                                                        updateFormData({ spotNumber: value || 0 })
                                                    }}
                                                />
                                            </span>
                                            <span className='unImportText'>（抽样数量，最大支持5000）</span>
                                        </React.Fragment>
                                    )}
                                </div>
                                <div>
                                    <Radio value={SpotCheckType.FILTER} style={{ marginBottom: 8 }}>
                                        {SpotCheckType.toString(SpotCheckType.FILTER)}
                                    </Radio>
                                    {samplingType === SpotCheckType.FILTER && (
                                        <Input.TextArea
                                            id='spotSqlErrorElement'
                                            style={{ height: 76 }}
                                            placeholder='支持输入语法逻辑与SQL一致的条件语句，如type=‘***’，无需输入‘where’'
                                            value={spotSql}
                                            onChange={(event) => {
                                                updateFormData({
                                                    spotSql: event.target.value,
                                                })
                                            }}
                                        />
                                    )}
                                </div>
                            </Radio.Group>
                        ),
                    },
                ]
                    .filter((item) => item.disabled !== true)
                    .map((item, index) => {
                        return (
                            <div className={styles.StepSecondItem}>
                                <h4>{item.title}</h4>
                                {item.content}
                            </div>
                        )
                    })}
            </React.Fragment>
        )
    }

    const fieldList = formData.columnConfigList || []

    const existFieldTypeList = Array.from(new Set(fieldList.map((item) => item.columnType).filter((item) => Boolean(item))))
    const existValueTypeList = Array.from(new Set(fieldList.map((item) => item.columnTransformType).filter((item) => item) as FieldType[]))

    const stepList: {
        label: ReactNode
        content: React.ReactNode
    }[] = [
        {
            label: '选择剖析对象',
            content: renderTarget(),
        },
        {
            label: '剖析设置',
            content: renderSetting(),
        },
        {
            label: (
                <div>
                    剖析字段预览
                    <a onClick={() => setShowFields(!showFields)} style={{ marginLeft: 16 }}>
                        {showFields ? '收起' : '展开'}
                    </a>
                </div>
            ),
            content: showFields ? (
                <Table
                    id='fieldErrorElement'
                    dataSource={fieldList}
                    loading={tableLoading}
                    columns={[
                        {
                            title: '字段名',
                            dataIndex: 'columnName',
                            onFilter: (value, record) => {
                                return record.columnName.toLocaleLowerCase().includes(value.toString().toLocaleLowerCase())
                            },
                            filterIcon: <SearchOutlined />,
                            filterDropdown: ({ confirm, setSelectedKeys, selectedKeys }) => {
                                return (
                                    <div>
                                        <Input
                                            value={selectedKeys[0] || ''}
                                            style={{ margin: `6px 12px`, width: 'unset' }}
                                            onChange={(event) => {
                                                const value = event.target.value
                                                setSelectedKeys(value ? [value] : [])
                                            }}
                                        />
                                        <div className='ant-table-filter-dropdown-btns'>
                                            <Button
                                                type='link'
                                                size='small'
                                                onClick={() => {
                                                    setSelectedKeys([])
                                                    confirm({ closeDropdown: true })
                                                }}
                                            >
                                                重置
                                            </Button>
                                            <Button
                                                type='primary'
                                                size='small'
                                                onClick={() => {
                                                    confirm({
                                                        closeDropdown: true,
                                                    })
                                                }}
                                            >
                                                确定
                                            </Button>
                                        </div>
                                    </div>
                                )
                            },
                        },
                        {
                            title: '字段类型',
                            dataIndex: 'columnType',
                            filters: existFieldTypeList.map((item) => {
                                return {
                                    value: item,
                                    text: item,
                                }
                            }),

                            onFilter: (value, record) => {
                                return record.columnType === value
                            },
                        },
                        {
                            title: '值类型',
                            filters: existValueTypeList.map((item) => {
                                return {
                                    value: item,
                                    text: FieldType.toString(item),
                                }
                            }),
                            onFilter: (value, record) => {
                                return record.columnTransformType === value
                            },
                            render: (_, record) => {
                                const type = record.columnTransformType as FieldType
                                const params = record.transformTypeConfig
                                return (
                                    <FieldValueTypeSelect
                                        key={record.columnId}
                                        defaultValue={{ type, params }}
                                        onChange={(value) => {
                                            record.columnTransformType = value.type
                                            record.transformTypeConfig = value.params
                                            if (record.transformTypeConfig === undefined) {
                                                delete record.transformTypeConfig
                                            }
                                            updateFormData({
                                                columnConfigList: formData.columnConfigList ? [...formData.columnConfigList] : undefined,
                                            })
                                        }}
                                    />
                                )
                            },
                        },
                    ]}
                    pagination={false}
                />
            ) : null,
        },
    ]

    let enableSave = false
    if (data) {
        const changed = !L.isEqualWith(formData, lastFormData)
        // “失效、过期状态"或者"有改动"，则可保存
        enableSave = [DissectStatus.EXPIRE, DissectStatus.INVALID].includes(data.analysisStatus) || changed
    } else {
        enableSave = true
    }

    return (
        <>
            <DrawerLayout
                drawerProps={{
                    title: `配置剖析-${isEdit ? '编辑' : '新增'}`,
                    onClose: () => {
                        onClose()
                    },
                    visible,
                    width: 590,
                    className: styles.DataDissectEdit,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!enableSave} loading={loading} type='primary' onClick={requestSave}>
                                保存并剖析
                            </Button>
                            <Button disabled={loading} onClick={onClose}>
                                取消
                            </Button>
                        </React.Fragment>
                    )
                }}
            >
                <div className={styles.Steps}>
                    {stepList.map((item, index) => {
                        return (
                            <div key={index} className={styles.StepItem}>
                                <header>
                                    <div className={styles.StepIcon}>{index + 1}</div>
                                    <h4>{item.label}</h4>
                                </header>
                                <main>
                                    <div className={styles.Line} />
                                    <div className={styles.Body}>{item.content}</div>
                                </main>
                            </div>
                        )
                    })}
                </div>
            </DrawerLayout>
            {visible && (
                <TableSelectModal
                    requestTableFun={(param) => DataDissectApi.requestDissectTableList(param.databaseId)}
                    visible={visibleTableModal}
                    onOk={(value: { [key: string]: any }) => {
                        const { id, database, datasource, product, physicalTable } = value
                        updateFormData({
                            target: {
                                tableId: id,
                                tableName: physicalTable,
                                databaseId: database.id,
                                databaseName: database.name,
                                datasourceId: datasource.id,
                                datasourceName: datasource.name,
                                product,
                            },
                        })
                        setVisibleTableModal(false)
                    }}
                    onCancel={() => setVisibleTableModal(false)}
                />
            )}
        </>
    )
}
export default DataDissectEdit
