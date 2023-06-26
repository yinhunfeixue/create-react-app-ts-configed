import SearchPanel from '@/app/graph/component/SearchPanel'
import NodeType from '@/app/graph/enum/NodeType'
import IReport from '@/app/graph/interface/IReport'
import ITable from '@/app/graph/interface/ITable'
import ITreeNodeData from '@/app/graph/interface/ITreeNodeData'
import IComponentProps from '@/base/interfaces/IComponentProps'
import AutoTip from '@/component/AutoTip'
import SimpleEmpty from '@/component/empty/SimpleEmpty'
import TreeControl from '@/utils/TreeControl'
import { Radio, Tag } from 'antd'
import React, { Component } from 'react'
import './TableSearcher.less'

interface ITableSearcherState {
    searchKey: string
    selectedTab: number

    allTableList: ITreeNodeData<ITable>[]
    parentTableList: ITreeNodeData<ITable>[]
    endTableList: ITreeNodeData<ITable>[]
    selectedTableId: any
}
interface ITableSearcherProps extends IComponentProps {
    onSelected?: (id: any, item: any) => void
    centerTable: ITreeNodeData<ITable>
    parentTree?: ITreeNodeData<ITable>[]
    childTree?: ITreeNodeData<ITable>[]
    visible: boolean
    onVisibleChange: (visible: boolean) => void

    disableEndTable?: boolean
}

/**
 * TableSearcher
 */
class TableSearcher extends Component<ITableSearcherProps, ITableSearcherState> {
    constructor(props: ITableSearcherProps) {
        super(props)
        this.state = {
            searchKey: '',
            selectedTab: 0,
            allTableList: [],
            parentTableList: [],
            endTableList: [],
            selectedTableId: 0,
        }
    }

    componentDidMount() {
        this.filter()
    }

    private filter() {
        const { parentTree, childTree, centerTable } = this.props

        const parentNodeList = this.searchNodeList(parentTree)
        const childNodeList = this.searchNodeList(childTree)
        const centerNodeList = this.searchNodeList([
            {
                ...centerTable,
                children: [],
            },
        ])

        const allTableList = parentNodeList.concat(childNodeList).concat(centerNodeList)
        const parentTableList = parentNodeList.filter((item) => !item.children || !item.children.length)
        const endTableList = childNodeList.filter((item) => !item.children || !item.children.length)
        this.setState({
            allTableList,
            parentTableList,
            endTableList,
        })
    }

    private searchNodeList(dataSource?: ITreeNodeData<ITable>[]) {
        const treeControl = new TreeControl<ITreeNodeData<ITable>>()
        const { searchKey } = this.state
        const result: ITreeNodeData<ITable>[] = []
        if (dataSource) {
            treeControl.forEach(dataSource, (node) => {
                const { label } = node
                if (!searchKey || (label && label.includes(searchKey))) {
                    result.push(node)
                }
            })
        }
        return result
    }

    private renderList() {
        const { disableEndTable } = this.props
        const tabList = [
            {
                label: '全部表',
                value: 0,
            },
            {
                label: '源头表',
                value: 1,
            },
            {
                label: '未端表',
                value: 2,
                disable: disableEndTable,
            },
        ].filter((item) => !item.disable)

        const tableList = this.getTableList()

        const { selectedTab } = this.state

        return (
            <div className='TableSearcher'>
                <Radio.Group
                    className='Tabs'
                    optionType='button'
                    options={tabList}
                    value={selectedTab}
                    onChange={(event) => {
                        const value = event.target.value || 0
                        this.setState({ selectedTab: value })
                    }}
                />
                {/* 数据表列表 */}
                {tableList.length ? (
                    tableList.map((item) => {
                        return this.renderTableItem(item)
                    })
                ) : (
                    <SimpleEmpty />
                )}
            </div>
        )
    }

    private getTableList() {
        const { selectedTab, allTableList, parentTableList, endTableList } = this.state
        return [allTableList, parentTableList, endTableList][selectedTab]
    }

    private renderTableItem(item: ITreeNodeData<ITable>) {
        const { onSelected } = this.props
        const { extraData } = item
        if (!extraData) {
            return null
        }

        const isReport = item.nodeType === NodeType.report
        const { tableEName, datasourceCName, databaseEname, reportName, belongSystem } = extraData as IReport
        const title = isReport ? reportName : tableEName
        const footer = isReport ? belongSystem : `${datasourceCName} / ${databaseEname}`
        return (
            <div
                className='TableItem'
                key={item.id}
                onClick={() => {
                    this.setState({ selectedTableId: item.id })
                    if (onSelected) {
                        onSelected(item.id, item)
                    }
                }}
            >
                <h4>{title}</h4>
                <footer>
                    {item.nodeType === NodeType.report && <Tag color='blue'>报表</Tag>}
                    <AutoTip className='TableItemFooter' content={footer} />
                </footer>
            </div>
        )
    }

    render() {
        const { placeholder, visible, onVisibleChange } = this.props
        return (
            <SearchPanel
                visible={visible}
                onVisibleChange={onVisibleChange}
                placeholder={placeholder}
                onSearch={async (value) => {
                    this.setState({ searchKey: value }, () => this.filter())
                }}
                className='TableSearcher'
            >
                {this.renderList()}
            </SearchPanel>
        )
    }
}

export default TableSearcher
