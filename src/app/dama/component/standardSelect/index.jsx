import {Select} from "antd";
import React from "react";
import _ from "underscore";
import {getStandardDomain} from "app_api/dimensionApi";

const Option = Select.Option;
let timeout;
let currentValue;

export default class StandardSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dimensionSelectOption:[],
            value:this.props.value||[]
        };
    }

    componentDidMount(){
        console.log(this.props)
        this.getData({page:1,page_size:50,categoryId:this.props.categoryId})
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps)
    //     this.getData({page:1,page_size:50,categoryId:nextProps.categoryId})
    // }
    getData = async (param)=>{
        let res = await getStandardDomain(param)
        if (res.code==200){
            this.setState({
                dimensionSelectOption:res.data
            })
        }

    }

    handleChange=(value)=>{
        this.triggerChange(value)
        this.setState({value})
    }

    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        onChange&&onChange([changedValue]);
    }

    onDimensionSearch = (value)=>{
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = value
        timeout = setTimeout(()=>this.searchDimension(value), 300)
        const {onSearch}=this.props
        onSearch&&onSearch(value)
    }

    searchDimension = async (value)=>{
        let res = await getStandardDomain({name:value,page:1,page_size:50})
        if (res.code==200&&currentValue===value) {
            const resData = res.data
            const data = []
            resData.forEach(item=>{
                data.push({
                    name:item.name,
                    id:item.id
                })
            })
            this.setState({
                dimensionSelectOption:data
            })
        }
    }

    render() {
        const {dimensionSelectOption,value} = this.state
        const{onChange,...restProps} = this.props
        return (
            <Select
                placeholder="默认显示10条，支持搜索"
                showSearch mode={this.props.mode||"multiple"}
                filterOption={false}
                value={value}
                labelInValue
                onChange={this.handleChange}
                {...restProps}
                onSearch={this.onDimensionSearch}
            >
                {
                    _.map(dimensionSelectOption.slice(), (node) => {
                        return (<Option key={node.id} value={node.id} >{node.name}</Option>);
                    })
                }
            </Select>
        );
    }
}
