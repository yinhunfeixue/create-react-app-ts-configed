import NodeType from '@/app/graph/enum/NodeType'
import IReport from '@/app/graph/interface/IReport'
import ITable from '@/app/graph/interface/ITable'
import ITreeNodeData from '@/app/graph/interface/ITreeNodeData'
import IconFont from '@/component/IconFont'
import { Cascader, Checkbox, List, Modal, Tag } from 'antd'
import { CascaderOptionType } from 'antd/lib/cascader'
import classNames from 'classnames'
import React, { Component } from 'react'
import './TableSelectModal.less'

interface ITableSelectModalState {
    searchKey: string
    selectedDatabaseId?: string
    loading: boolean

    showReport: boolean
}
interface ITableSelectModalProps {
    visible: boolean
    onChange: (value: string) => void
    onClose: () => void
    dataSource: ITreeNodeData<ITable>[]
}

/**
 * TableSelectModal
 */
class TableSelectModal extends Component<ITableSelectModalProps, ITableSelectModalState> {
    constructor(props: ITableSelectModalProps) {
        super(props)
        this.state = {
            searchKey: '',
            loading: false,
            showReport: false,
        }
    }

    private getDisplayDataSource() {
        const { searchKey, selectedDatabaseId, showReport } = this.state
        const { dataSource } = this.props

        let result = [...dataSource]

        // 如果只显示报表，过滤出报表; 否则筛选物理表
        if (showReport) {
            result = result.filter((item) => item.nodeType === NodeType.report)
        } else {
            // 通过数据库筛选物理表
            if (selectedDatabaseId) {
                result = result.filter((item) => {
                    if (!item.extraData) {
                        return
                    }
                    return item.extraData.databaseId === selectedDatabaseId
                })
            }
        }

        // 通过关键词筛选
        if (searchKey) {
            result = result.filter((item) => {
                const { extraData } = item
                if (!extraData) {
                    return false
                }
                const { tableCName, tableEName, reportName } = extraData as IReport;
                const labelList = [tableCName, tableEName, reportName]
                for (let item of labelList) {
                    if (item && item.includes(searchKey)) {
                        return true
                    }
                }
                return false
            })
        }

        return result
    }

    private createFilterDataSource(): CascaderOptionType[] {
        const dic: { [key: string]: { label: string; children: { [key: string]: string } } } = {}
        let { dataSource } = this.props
        dataSource = dataSource.filter((item) => item.nodeType !== NodeType.report)
        // 生成字典，提高转换性能
        for (let item of dataSource) {
            if (item.extraData) {
                const { datasourceCName, datasourceId, databaseId, databaseEname } = item.extraData
                if (!dic[datasourceId]) {
                    dic[datasourceId] = {
                        label: datasourceCName,
                        children: {},
                    }
                }

                const { children } = dic[datasourceId]
                if (!children[databaseId]) {
                    children[databaseId] = databaseEname
                }
            }
        }
        // 字典转换为数组
        const result: CascaderOptionType[] = Object.keys(dic).map((dataSourceId) => {
            const dataSource = dic[dataSourceId]
            const { children } = dataSource
            return {
                label: dataSource.label,
                value: dataSourceId,
                children: Object.keys(children).map((item) => {
                    return {
                        value: item,
                        label: children[item],
                    }
                }),
            }
        })
        return result
    }

    private getNodeTitle(node: ITreeNodeData<ITable>) {
        if (!node || !node.extraData) {
            return ''
        }

        switch (node.nodeType) {
            case NodeType.report:
                const { reportName } = node.extraData as IReport
                return reportName
            default:
                const { tableCName, tableEName } = node.extraData
                return tableCName || tableEName
        }
    }

    private getNodeFooter(node: ITreeNodeData<ITable>) {
        if (!node || !node.extraData) {
            return ''
        }

        switch (node.nodeType) {
            case NodeType.report:
                const { belongSystem } = node.extraData as IReport
                return belongSystem
            default:
                const { datasourceCName, databaseEname } = node.extraData
                return `${datasourceCName}/${databaseEname}`
        }
    }

    render() {
        const { visible, onClose, onChange } = this.props
        const { loading, showReport } = this.state
        const dataSource = this.getDisplayDataSource()
        const filterDataSource = this.createFilterDataSource()
        return (
            <Modal
                visible={visible}
                width={500}
                title={
                    <div className='Header'>
                        <IconFont type='e6c8' className='IconSearch' useCss />
                        <div className='InputWrap'>
                            <input className='Input' placeholder='请输入表名' onChange={(event) => this.setState({ searchKey: event.target.value })} />
                        </div>
                    </div>
                }
                className='TableSelectModal'
                footer={null}
                onCancel={onClose}
            >
                <div className='HControlGroup FieldControlGroup'>
                    <label className='Label'>表数据：{dataSource.length}</label>
                    <Cascader
                        placeholder='数据表'
                        options={filterDataSource}
                        onChange={(value) => {
                            this.setState({ selectedDatabaseId: value ? (value[value.length - 1] as string) : undefined })
                        }}
                        disabled={showReport}
                    />
                    <Checkbox
                        checked={showReport}
                        onChange={(event) => {
                            this.setState({ showReport: event.target.checked })
                        }}
                    >
                        报表
                    </Checkbox>
                </div>
                {/* 数据列表 */}
                <List<ITreeNodeData<ITable>>
                    dataSource={dataSource}
                    loading={loading}
                    split={false}
                    className='FieldList'
                    renderItem={(item, index) => {
                        const { extraData, id } = item
                        if (!extraData) {
                            return
                        }
                        return (
                            <List.Item className={classNames('FieldItem')} key={index} onClick={() => onChange(id)}>
                                {this.getNodeTitle(item)}
                                <div className='FieldItemFooter'>
                                    {item.nodeType === NodeType.report && <Tag color='blue'>报表</Tag>}
                                    {this.getNodeFooter(item)}
                                </div>
                            </List.Item>
                        )
                    }}
                />
            </Modal>
        )
    }
}

export default TableSelectModal
