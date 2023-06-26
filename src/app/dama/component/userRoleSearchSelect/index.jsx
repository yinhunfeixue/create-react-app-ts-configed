import {Select} from "antd";
import React from "react";
import {getRolesList} from "app_api/manageApi";

const Option = Select.Option;
let timeout;
let currentValue;

export default class UserRoleSearchSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectOption:[],
            value:this.props.value||[]
        };
    }

    componentDidMount(){
        this.getData({page:1,page_size:50})
    }

    getData = async (param)=>{
        let res = await getRolesList(param)
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
        timeout = setTimeout(()=>this.search(value), 200)
        const {onSearch}=this.props
        onSearch&&onSearch(value)
    }

    search = async (value)=>{
        let res = await getRolesList({name:value,page:1,page_size:50})
        if (res.code==200&&currentValue===value) {
            this.setState({
                selectOption:res.data
            })
        }
    }

    render() {
        const {selectOption,value} = this.state
        const{onChange,onSearch,...restProps} = this.props
        return (
            <Select
                placeholder="默认显示50条，支持搜索"
                showSearch mode={this.props.mode||"multiple"}
                filterOption={false}
                value={value}
                onChange={this.handleChange}
                {...restProps}
                onSearch={this.onSearch}
            >
                {
                    selectOption.map(item=><Option  value={item.id}>{item.roleName}</Option>)
                }
            </Select>
        );
    }
}
