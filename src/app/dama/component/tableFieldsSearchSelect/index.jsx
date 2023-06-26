import {Select, Tooltip} from "antd";
import React from "react";
import {fieldSearch} from "app_api/metadataApi";

const Option = Select.Option;
let timeout;
let currentValue;

export default class TableFieldsSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectOption:[],
            value:this.props.value||[]
        };
    }

    componentDidMount(){
        this.getData({page:1,page_size:50,table_id:this.props.tableId})
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tableId===this.props.tableId)
            return false
        this.getData({page:1,page_size:50,table_id:nextProps.tableId})
    }

    getData = async (param)=>{
        if (!param.table_id)
            return
        let res = await fieldSearch(param)
        if (res.code==200){
            this.setState({
                selectOption:res.data
            })
        }
    }

    handleChange=(value)=>{
        this.triggerChange(value)
        this.setState({value})
    }

    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        onChange&&onChange(changedValue);
    }

    onSearch = (value)=>{
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = value
        timeout = setTimeout(()=>this.search(value), 300);
        const {onSearch}=this.props
        onSearch&&onSearch(value)
    }

    search = async (value)=>{
        let res = await fieldSearch({keywords:value,page:1,page_size:50,table_id:this.props.tableId})
        if (res.code==200&&currentValue===value) {
            this.setState({
                selectOption:res.data
            })
        }
    }

    render() {
        const {selectOption,value} = this.state
        const{onChange,onSearch,valueField,...restProps} = this.props
        return (
            <Select
                placeholder="默认显示50条，支持搜索"
                showSearch mode={this.props.mode||"multiple"}
                // filterOption={false}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                value={value}
                onChange={this.handleChange}
                {...restProps}
                onSearch={this.onSearch}
            >
                {
                    selectOption.map(item=><Option  value={item[valueField]}><Tooltip title={item.physical_field + (item.physical_field_desc?`(${item.physical_field_desc})`:"")}>{item.physical_field + (item.physical_field_desc?`(${item.physical_field_desc})`:"")}</Tooltip></Option>)
                }
            </Select>
        );
    }
}
