import {Select, Tooltip} from "antd";
import React from "react";
import _ from "underscore";

const Option = Select.Option;
let timeout;
let currentValue;

export default class CommonSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SelectOption:this.props.selectOption||[],
            value:this.props.value||[]
        };
    }

    componentDidMount(){
        const {noFetch} = this.props
        if (!noFetch){
            this.getData()
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.selectOption) {
            this.setState({
                SelectOption:nextProps.selectOption.slice()
            });
        }
    }

    getData = async (param)=>{
        const {api} = this.props
        let res = await api(param)
        if (res.code==200){
            this.setState({
                SelectOption:res.data
            })
        }
    }

    handleChange=(value)=>{
        console.log(value)
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
        timeout = setTimeout(()=>this.searchData(value), 300);
        const {onSearch}=this.props
        onSearch&&onSearch(value)
    }

    searchData = async (value)=>{
        const {api} = this.props
        let res = await api({name:value})
        if (res.code==200&&currentValue===value) {
            const resData = res.data
            const data = []
            resData.forEach(item=>{
                data.push({
                    [this.props.name||"name"]:item [this.props.name||"name"],
                    [this.props.valueName||"id"]:item [this.props.valueName||"id"]
                })
            })
            this.setState({
                SelectOption:data
            })
        }
    }
    render() {
        const {SelectOption,value} = this.state
        const {onChange,...restProps} = this.props
        return (
            <Select
                placeholder="默认显示10条，支持搜索"
                showSearch
                filterOption={false}
                labelInValue
                onChange={this.handleChange}
                {...restProps}
                onSearch={this.onSearch}
            >
                {
                    _.map(SelectOption.slice(), (node) => {
                        return (<Option
                            key={node[this.props.valueName||"id"]}
                            value={node[this.props.valueName||"id"]}
                        >
                            <Tooltip title={node[this.props.name||"name"]}>
                                {node[this.props.name||"name"]}
                            </Tooltip>
                        </Option>);
                    })
                }
            </Select>
        );
    }
}
