import IComponentProps from '@/base/interfaces/IComponentProps'
import { message, Modal } from 'antd'
import { Select } from 'cps'
import React, { Component } from 'react'

interface ITableSelectModalState {
    selectedValues?: { [key: string]: any }[]
}
interface ITableSelectModalProps extends IComponentProps {
    visible: boolean
    onOk: (value: { [key: string]: any }) => void
    onCancel: () => void
    requestTableFun?: (param: { datasourceId: number; databaseId: number }) => Promise<{ data: any[]; code: number; msg: string }>
}

/**
 * TableSelectModal
 */
class TableSelectModal extends Component<ITableSelectModalProps, ITableSelectModalState> {
    constructor(props: ITableSelectModalProps) {
        super(props)
        this.state = {}
    }
    private reset() {
        this.setState({ selectedValues: undefined })
    }

    render() {
        const { visible, onOk, onCancel, requestTableFun } = this.props
        const { selectedValues } = this.state
        const disabled = !selectedValues || selectedValues.length < 3
        return (
            <Modal
                title='添加表'
                width={642}
                visible={visible}
                bodyStyle={{ paddingBottom: 0 }}
                onCancel={() => {
                    onCancel()
                    this.reset()
                }}
                okButtonProps={{
                    disabled,
                }}
                onOk={() => {
                    if (selectedValues && selectedValues[2]) {
                        console.log(selectedValues, 'selectedValues++++')
                        onOk({
                            database: {
                                id: selectedValues[1].id,
                                name: selectedValues[1].physicalDatabase,
                            },
                            datasource: {
                                id: selectedValues[0].id,
                                name: selectedValues[0].dsName,
                            },
                            ...selectedValues[2],
                        })
                        // this.reset()
                    } else {
                        message.warning('请选择数据表')
                    }
                }}
            >
                {visible && (
                    <Select.TableSelect
                        requestTableFun={requestTableFun}
                        onChange={(data) => {
                            console.log('data', data)

                            this.setState({ selectedValues: data })
                        }}
                    />
                )}
            </Modal>
        )
    }
}

export default TableSelectModal
