import {Select} from "antd";
import React from "react";
import _ from "underscore";
import {getTableSuggest} from "app_api/modelApi";

const Option = Select.Option;
let timeout;
let currentValue;

export default class TableSuggestSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectOption:[],
            value:this.props.value||[],
        };
        this.requestParams = {}
    }

    // componentDidMount(){
    //     console.log(this.props)
    //     this.requestParams = this.props.params
    //     this.getDimensionData()
    // }

    componentWillReceiveProps(nextProps) {
        //if( nextProps.params != this.props.params ){
            this.requestParams = nextProps.params
            this.getDimensionData(nextProps.params)
        //}
    }

    getDimensionData = async (param)=>{
        param = {...this.requestParams, ...param}
        let res = await getTableSuggest(param)
        if (res.code==200){
            this.setState({
                selectOption:res.data
            })
        }

    }

    handleChange=(value)=>{
        console.log('-------handleChange');
        if ( value == undefined ) {
            //value=''
        }
        this.triggerChange(value)
        this.setState({value})
    }

    triggerChange = (changedValue) => {
        console.log(changedValue,'---changedValue')
        const onChange = this.props.onChange;
        onChange&&onChange(changedValue)
    }

    onDimensionSearch = (value)=>{
        console.log('-------onDimensionSearch');
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
        let param = {...this.requestParams, fromTableName:value}
        let res = await getTableSuggest(param)
        if (res.code==200&&currentValue===value) {
            this.setState({
                selectOption:res.data
            })
        }
    }

    render() {
        const {selectOption,value} = this.state
        const {onChange,...restProps} = this.props
        return (
            <Select
                //placeholder="默认显示10条，支持搜索"
                showSearch
                filterOption={false}
                allowClear={true}
                value={value}
                labelInValue
                onChange={this.handleChange}
                {...restProps}
                onSearch={this.onDimensionSearch}
            >
                {
                    _.map(selectOption, (node) => {
                        return (<Option key={node.tableId} value={node.tableEnglishName} >{node.tableEnglishName}</Option>);
                    })
                }
            </Select>
        );
    }
}
