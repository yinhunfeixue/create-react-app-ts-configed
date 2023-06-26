import {Select} from "antd";
import React from "react";
import _ from "underscore";
import {getStandardCodeValue} from "app_api/standardApi";


const Option = Select.Option;
let timeout;
let currentValue;

export default class CodeValueSelect extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {
            codeValueSelectOption:[],
            value:this.props.value||{key:"",label:""}
        };
    }

    componentDidMount(){
        this.getCodeValueData()
    }

    componentWillReceiveProps(nextProps) {

    }

    getCodeValueData = async (param)=>{
        let res = await getStandardCodeValue({...param,standard:this.props.standardId})
        if (res.code==200){
            this.setState({
                codeValueSelectOption:res.data
            })
        }
    }

    handleChange=(value)=>{
        this.triggerChange(value)
        this.setState({value})
    }

    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        console.log(changedValue)
        onChange&&onChange(changedValue);
    }

    onCodeValueSearch = (value)=>{
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = value
        timeout = setTimeout(()=>this.searchCodeValue(value), 300);
        const {onSearch}=this.props
        onSearch&&onSearch(value)
    }

    searchCodeValue = async (value)=>{
        this.getCodeValueData({name:value})
    }

    render() {
        const {codeValueSelectOption,value} = this.state
        const {onChange,...restProps} = this.props // 未使用的元素勿删除
        return (
            <Select
                placeholder="默认显示10条，支持搜索"
                showSearch
                filterOption={false}
                labelInValue
                mode={"multiple"}
                onChange={this.handleChange}
                {...restProps}
                onSearch={this.onCodeValueSearch}
            >
                {
                    _.map(codeValueSelectOption.slice(), (node) => {
                        return (<Option key={node.id} value={node.id} >{node.name}</Option>);
                    })
                }
            </Select>
        );
    }
}
