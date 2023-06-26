import { Button, message, Select } from 'antd'
// import TreeSelectComponent from "app_page/dama/metadata/components/treeSelect";
import { fieldSearch, metadataTree } from 'app_api/metadataApi'
import React, { Component } from 'react'

const Option = Select.Option

export default class ThreeLinkageTree extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableList: [],
            fieldList: [],
            activeField: undefined,
            activeFieldId: '',
            activeTable: undefined,
            activeTableId: '',
        }
        this.dataSourceId = undefined
    }

    componentDidMount() {}

    dbChanged = (e) => {
        if (e.triggerNode.props.isLeaf) {
            this.dataSourceId = e.triggerValue.split('_').pop()
            this.getDB_TableData()
        } else {
            this.dataSourceId = undefined
        }
    }
    tbChanged = (value, opt) => {
        this.setState({ activeTable: value, activeTableId: opt.key }, this.getTB_FieldData)
    }
    fdChanged = (value, opt) => {
        this.setState({ activeField: value, activeFieldId: opt.key })
    }

    onSearch = () => {
        if (!this.state.activeFieldId) {
            message.warning('请选择字段')
            return
        }
        this.props.onSearch(this.state.activeFieldId)
    }

    getDB_TableData = async () => {
        if (this.dataSourceId) {
            const dbTableData = await metadataTree({ datasourceId: this.dataSourceId })
            this.setState({ tableList: dbTableData.data, activeTable: '', activeField: '' })
        }
    }

    getTB_FieldData = async () => {
        const { activeTableId } = this.state
        if (activeTableId) {
            const fieldData = await fieldSearch({ table_id: activeTableId })
            this.setState({ fieldList: fieldData.data })
        }
    }

    render() {
        const { tableList, fieldList, activeField, activeTable } = this.state
        return (
            <div style={{ padding: '20px 32px 0px' }}>
                {/*<TreeSelectComponent type='selectDataSource' placehodler="请选择数据源" width={240} margin="0 20px 0 0" treeSelect={this.dbChanged}/>*/}
                <Select placeholder='请选择数据表' showSearch value={activeTable} style={{ width: 120, 'margin-right': '20px' }} onChange={this.tbChanged}>
                    {tableList.map((tb) => (
                        <Option key={tb.id} value={tb.name}>
                            {tb.name}
                        </Option>
                    ))}
                </Select>
                <Select placeholder='请选择字段' showSearch style={{ width: 120, 'margin-right': '20px' }} value={activeField} onChange={this.fdChanged}>
                    {fieldList.map((fd) => (
                        <Option key={fd.id} value={fd.physical_field}>
                            {fd.physical_field}
                        </Option>
                    ))}
                </Select>
                <Button type='primary' onClick={this.onSearch}>
                    查看
                </Button>
            </div>
        )
    }
}
