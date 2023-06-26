import { requestFieldList } from '@/api/graphApi'
import IField from '@/app/graph/interface/IField'
import IconFont from '@/component/IconFont'
import { Button, CheckboxOptionType, List, Modal, Tag } from 'antd'
import classNames from 'classnames'
import React, { Component } from 'react'
import './FieldSelectModal.less'

interface IFieldSelectModalState {
    selectedValues: any[]
    searchKey: string
    dataSource: CheckboxOptionType[]
    loading: boolean
}
interface IFieldSelectModalProps {
    visible: boolean
    onChange: (value: CheckboxOptionType[]) => void
    tableId: string
    onClose: () => void
}

/**
 * FieldSelectModal
 */
class FieldSelectModal extends Component<IFieldSelectModalProps, IFieldSelectModalState> {
    constructor(props: IFieldSelectModalProps) {
        super(props)
        this.state = {
            selectedValues: [],
            searchKey: '',
            dataSource: [],
            loading: false,
        }
    }

    componentDidMount() {
        this.requestFieldList()
    }

    private requestFieldList() {
        const { tableId } = this.props
        this.setState({ loading: true })
        requestFieldList(tableId)
            .then((res) => {
                const data: IField[] = res.data || []
                this.setState({
                    dataSource: data.map((item) => {
                        const { id, physicalField } = item
                        return {
                            value: id,
                            label: physicalField,
                        }
                    }),
                })
            })
            .finally(() => {
                this.setState({ loading: false })
            })
    }

    private selected(value: any) {
        const { selectedValues } = this.state
        return selectedValues.includes(value)
    }

    private getItem(value: any) {
        const { dataSource } = this.state
        return dataSource.find((item) => item.value === value)
    }

    private unselect(value: any) {
        const { selectedValues } = this.state
        const index = selectedValues.findIndex((item) => item === value)
        if (index >= 0) {
            selectedValues.splice(index, 1)
            this.forceUpdate()
        }
    }

    private select(value: any) {
        const { selectedValues } = this.state
        if (!this.selected(value)) {
            selectedValues.push(value)
            this.forceUpdate()
        }
    }

    private switchValue(value: any) {
        if (this.selected(value)) {
            this.unselect(value)
        } else {
            this.select(value)
        }
    }

    private getDisplayDataSource() {
        const { searchKey, dataSource } = this.state
        if (!searchKey) {
            return dataSource
        }
        return dataSource.filter((item) => item.label && item.label.toString().includes(searchKey))
    }

    render() {
        const { visible, onClose, onChange } = this.props
        const { selectedValues, loading } = this.state
        const dataSource = this.getDisplayDataSource()
        return (
            <Modal
                visible={visible}
                width={500}
                title={
                    <div className='Header'>
                        <IconFont type='e6c8' className='IconSearch' useCss />
                        <div className='InputWrap'>
                            {selectedValues.map((value) => {
                                const item = this.getItem(value)
                                if (item) {
                                    return (
                                        <Tag closable onClose={() => this.unselect(value)} key={value}>
                                            {item.label}
                                        </Tag>
                                    )
                                }
                                return null
                            })}
                            <input className='Input' placeholder='请输入字段名' onChange={(event) => this.setState({ searchKey: event.target.value })} />
                        </div>
                    </div>
                }
                className='FieldSelectModal'
                footer={
                    <div className='FooterContainer'>
                        <Button onClick={() => onClose()}>取消</Button>
                        <Button disabled={!selectedValues.length} type='primary' onClick={() => onChange(selectedValues)}>
                            确定
                        </Button>
                    </div>
                }
                onCancel={onClose}
            >
                <List<CheckboxOptionType>
                    dataSource={dataSource}
                    loading={loading}
                    split={false}
                    renderItem={(item, index) => {
                        const { value, label } = item
                        const selected = this.selected(value)
                        return (
                            <List.Item
                                className={classNames('FieldItem', selected ? 'ItemSelected' : '')}
                                key={index}
                                extra={selected ? <IconFont type='e679' useCss style={{ color: `rgba(77, 115, 255, 1)` }} /> : null}
                                onClick={() => this.switchValue(value)}
                            >
                                {label}
                            </List.Item>
                        )
                    }}
                />
            </Modal>
        )
    }
}

export default FieldSelectModal
