import { DownOutlined, InboxOutlined } from '@ant-design/icons';
import {
    Button,
    Checkbox,
    Col,
    DatePicker,
    Dropdown,
    Input,
    Menu,
    message,
    Radio,
    Row,
    Select,
    TreeSelect,
    Upload
} from 'antd';
import immutable from 'immutable';
import { debounce } from 'lodash';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React from 'react';
import _ from 'underscore';

const $ =  require('jquery');
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const {MonthPicker,RangePicker} = DatePicker;
moment.locale('zh-cn');
/*
一个数组为一行，一个object为一项
controllers:[
[{name,type,width,label}]
]
type:month/week/dataRange/day/button/input/select/treeSelect
具体配置见 renderController
onDataChange
*/
export default class FilterController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            controllerData:{},
            controllers:this.props.controllers||[[]],
            intervalDateEndValue:null,
            intervalDateStartValue:null,
            inputDisable:false,
            searchSelectData:[],
            inputSelectData:[]
        };

        this.onDataChange = this.onDataChange.bind(this);
        this.intervalDateOnChange = this.intervalDateOnChange.bind(this);
        this.handleTagSelect = this.handleTagSelect.bind(this);
        this.onSelectSearch = debounce(this.onSelectSearch, 500);
        // this.inputOnBlur = this.inputOnBlur.bind(this);
        this.customSelectOnChange = this.customSelectOnChange.bind(this);
        this.customSelectOnBlur = this.customSelectOnBlur.bind(this);
        this.inputOnDataChange = this.inputOnDataChange.bind(this);

        this.prevCustomSelectData = [];         //上一次填写的客户号，如果下一次onblur的值一样，不在发请求，防止重复渲染
        this.weekCurrentDate = '';

        this.isRankMonthCheck = {startMonth:undefined,endMonth:undefined};      //check月份选择disabled
    }

    componentWillReceiveProps(nextProps){
        this.setState({controllers:nextProps.controllers});
    }

    setSignControllerData(name,data){
        this.setState({
            controllerData:{...this.state.controllerData,[name]:data}
        })
    }

    delControllerData(name){
        let data = this.state.controllerData;
        if( data[name] != undefined ){
            delete data[name];
            this.setState({
                controllerData:data
            });
        }
        //return true;
    }

    setControllerData(data,isAdd=false){
        if (isAdd) {
            this.setState({
                controllerData:{...this.state.controllerData,...data}
            })
            return this.getControllerData({...this.state.controllerData,...data})
        }else {
            this.setState({
                controllerData:data
            })
            return this.getControllerData(data)
        }
    }

    getControllerData(list){
        let fromData = {};
        const copyDate = _.extend({},list!=undefined?list:this.state.controllerData);
        _.map(copyDate,(item,key)=>{
            if (['startDate','endDate','startDate1','endDate1'].indexOf(key) >= 0) {

                if( item instanceof moment ){
                    fromData[key] = item==null?'':item.format('YYYYMMDD');
                }else{
                    fromData[key] = item==null?'':item;
                }

            }else if(key == 'day'){
                fromData.startDate = item==null?'':item.format('YYYYMMDD');
                fromData.endDate = item==null?'':item.format('YYYYMMDD');
            }else if(key == 'week'){
                const copyWeek = item==null?'':item.format('YYYYMMDD');
                fromData.endDate = item==null?'':moment(copyWeek).endOf('week').subtract(2,"days").format('YYYYMMDD');
                fromData.startDate = item==null?'':moment(copyWeek).startOf('week').format('YYYYMMDD');
            }else if(['startMonth','endMonth'].indexOf(key) >= 0){
                // fromData.startDate = item==null?'':item.startOf('month').format('YYYYMMDD');
                if( item instanceof moment ){
                    fromData[key] = item==null?'':item.format('YYYYMM');
                }else{
                    fromData[key] = item==null?'':item;
                }
                //fromData[key] = item==null?'':item.format('YYYYMM');
            }else if('month' === key){
                // fromData.startDate = item==null?'':item.startOf('month').format('YYYYMMDD');
                fromData.endDate = item==null?'':item.format('YYYYMM');
            }else if(key == 'year'){
                // fromData.startDate = item==null?'':moment(item, 'YYYY').startOf('year').format('YYYYMMDD');
                fromData.endDate = item==null?'':item;
            }else if(['exchangeType','stockAccount','secuCode','customerNo','assetSection','prodCode','sexId'].indexOf(key) >= 0){
                //console.log(typeof(item));

                if( typeof item === 'string' ){
                    fromData[key] = item;
                }else{
                    fromData[key] = item.join(',');
                }

            }else {
                fromData[key] = item;
            }
        })
        return fromData
    }

    disabledStartDate = (startValue,index) => {
        const endValue = this.state.controllerData['endDate'+ index];
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue,index) => {
        const startValue = this.state.controllerData['startDate' + index];
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() < startValue.valueOf();
    }

    onDataChange(name,data){
        this.setState({controllerData:{...this.state.controllerData,[name]:data}});
        if (this.props.onDataChange) {
            this.props.onDataChange(name,data);
        }
    }

    intervalDateOnChange(name,value){
        let date = value==null?'':value.format("YYYYMMDD");
        this.onDataChange(name,value);
    }

    //tagselect event
    handleTagSelect(name,e,values){
        // if (true) {}
        this.setState({
            inputDisable:true
        })
    }

    //异步搜索下拉框
    onSelectSearch = (value) => {
        const _this = this;
        this.props.handleSearchSelect(value,(options)=>{
            _this.setState({searchSelectData:options})
        });
    }

    //重置异步搜索下拉框
    resetSelectSearch = () => {
        this.setState({searchSelectData:[]})
    }

    customSelectOnChange(name,data){
        const check_data = data.length==0?'00000000':data[data.length-1];
        const num_reg = /^\d{8}$/;
        const _this = this;
        if(num_reg.test(check_data)){
            this.onDataChange(name,data);
        }else{
            message.info('输入的客户号不正确，客户号位8位纯数字！');
        }
    }

    customSelectOnBlur(name,data){
        const _this = this;
        if (!immutable.is(immutable.fromJS(data),immutable.fromJS(this.prevCustomSelectData))) {
            this.props.customSelectOnChange(data,(res)=>{
                const __data = res.map(v=>v.stock_account);
                _this.setState({
                    inputSelectData:res,
                    controllerData:{..._this.state.controllerData,['stockAccount']:__data}
                })
                _this.prevCustomSelectData = data;
            })
        }
    }

    onRangMonthChange(name,data){
        this.isRankMonthCheck[name] = data.valueOf();
        // const copyDate = _.extend({},this.state.controllerData);
        // const startDate = copyDate.startMonth?copyDate.startMonth.format('YYYYMM'):'';
        // const endDate = copyDate.endMonth?copyDate.endMonth.format('YYYYMM'):'';

        if (this.props.onRangMonthChange) {
            this.props.onRangMonthChange({[name]:data.format('YYYYMM')});
        }
        this.setState({controllerData:{...this.state.controllerData,[name]:data}});
    }

    inputOnDataChange(e,name,index,checkInput){
        const { value } = e.target;
        if(!checkInput){
            this.setState({controllerData:{...this.state.controllerData,[name]:value}});
        }
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.setState({controllerData:{...this.state.controllerData,[name]:value}});
        }
        if(this.props.onDataChange){
            this.props.onDataChange(name,value);
        }
    }

    renderController(config){
        let controller = null;
        let name = config.name;
        let _this = this;
        switch (config.type) {
            //时间-日
            case 'day':
                controller = <DatePicker
                    value={this.state.controllerData[name]}
                    format="YYYY-MM-DD"
                    onChange={this.onDataChange.bind(this,name)}
                />
                break;
            //时间-月
            case 'month':
                controller = <MonthPicker
                allowClear={false}
                // disabledDate={current => current && current.valueOf() < Date.now()}
                locale="zh-cn"
                value={this.state.controllerData[name]}
                onChange={this.onDataChange.bind(this,name)}/>;
                break;
            case 'startMonth':
                const startMonthValue = this.state.controllerData[name];
                this.isRankMonthCheck[name] = startMonthValue?startMonthValue.valueOf():'';
                controller = <MonthPicker
                allowClear={false}
                disabledDate={current => {
                    return this.isRankMonthCheck.endMonth?current && this.isRankMonthCheck.endMonth < current.valueOf():false
                }}
                value={this.state.controllerData[name]}
                onChange={this.onRangMonthChange.bind(this,name)}/>;
                break;
            case 'endMonth':
                const endMonthValue = this.state.controllerData[name];
                this.isRankMonthCheck[name] = endMonthValue?endMonthValue.valueOf():'';
                controller = <MonthPicker
                allowClear={false}
                disabledDate={current => {
                    return this.isRankMonthCheck.startMonth?current && current.valueOf() < this.isRankMonthCheck.startMonth:false
                }}
                value={this.state.controllerData[name]}
                onChange={this.onRangMonthChange.bind(this,name)}/>;
                break;
            //时间-周
            case 'week':
                controller = <DatePicker
                    disabledDate={(currentDate)=>{
                        // if (!currentDate) {
                        //     currentDate = _this.weekCurrentDate;
                        // }else{
                        //     _this.weekCurrentDate = currentDate;
                        // }
                        return (currentDate.weekday()===5||currentDate.weekday()===6);
                    }}
                    allowClear={false}
                    value={this.state.controllerData[name]}
                    format="YYYY-MM-DD"
                    onChange={this.onDataChange.bind(this,name)}
                />
                break;
            //时间-区间
            case 'dateRange':
                controller = <RangePicker
                value={this.state.controllerData[name]}
                onChange={this.onDateRangeChange.bind(this,name)}
                />
                break;
            //日期选择
            case 'startDate':
                let startDateData = this.state.controllerData[name];
                if( startDateData == undefined ){
                    controller = <DatePicker
                        disabledDate={(e)=>{return this.disabledStartDate(e,config.disableIndex || '')}}
                        format="YYYY-MM-DD"
                        key={config.label}
                        style={{width:'100%'}}
                        // value={startDateData}
                        onChange={value=>{this.intervalDateOnChange(name,value)}}
                    />
                }else{
                    controller = <DatePicker
                        disabledDate={(e)=>{return this.disabledStartDate(e,config.disableIndex || '')}}
                        format="YYYY-MM-DD"
                        key={config.label}
                        style={{width:'100%'}}
                        value={startDateData}
                        onChange={value=>{this.intervalDateOnChange(name,value)}}
                    />
                }


                break;
            case 'endDate':
                let endDateData = this.state.controllerData[name];
                if( endDateData == undefined ){
                    controller = <DatePicker
                        disabledDate={(e)=>{return this.disabledEndDate(e,config.disableIndex || '')}}
                        format="YYYY-MM-DD"
                        key={config.label}
                        style={{width:'100%'}}
                        // value={endDateData}
                        onChange={value=>{this.intervalDateOnChange(name,value)}}
                    />
                }else{
                    controller = <DatePicker
                        disabledDate={(e)=>{return this.disabledEndDate(e,config.disableIndex || '')}}
                        format="YYYY-MM-DD"
                        key={config.label}
                        style={{width:'100%'}}
                        value={endDateData}
                        onChange={value=>{this.intervalDateOnChange(name,value)}}
                    />
                }

                break;
            //上传文件
            case 'upload':
                    controller = <Upload.Dragger {...config.uploadprops} >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">请上传内容</p>
              </Upload.Dragger>
            break;
            case 'button':
                controller = <Button className={config.className||''} style={config.style} onClick={config.onClickBtn} value={config.value} disabled={config.disabled||false}>{config.label}</Button>;
                break;
            case 'input':
                    controller =  <Input
                        onPressEnter={config.onClickBtn}
                        placeholder={config.placeholder}
                        onBlur={config.onInputBlur}
                        defaultValue={config.defaultValue}
                        value={this.state.controllerData[name]}
                        onChange={e=>{this.inputOnDataChange(e,name,config.name,config.checkInput)}}
                    />;
                break;
            case 'checkbox':
                    controller = <CheckboxGroup
                        options={config.options}
                        onChange={e=>{this.onDataChange(name,e)}}
                        value={this.state.controllerData[name]}
                    />
                break;
            case 'dropdown':
                const __menu = (
                    <Menu onClick={config.onClickBtn}>
                        {
                            config.dropList.map(item=><Menu.Item key={item.id}>{item.label}</Menu.Item>)
                        }
                    </Menu>
                )
                controller = <Dropdown overlay={__menu}>
                    <Button>
                       {config.label} <DownOutlined />
                    </Button>
                 </Dropdown>;
                break;
            case 'tagSelect':
                //mode="tags"初始值设置为空的话，不要为空字符串，要为空数组[]
                let tagSelectVal = this.state.controllerData[name];
                if( tagSelectVal == undefined || tagSelectVal == '' ){
                    tagSelectVal = [];
                }
                controller = <Select
                    mode="tags"
                    value={tagSelectVal}
                    placeholder={config.placeholder}
                    style={{width:'100%'}}
                    onChange={(e)=>{this.onDataChange(name,e)}}
                >
                    {_.map(config.options,function(option,index) {
                        return <Option value={option.value} key={index}>{option.label}</Option>;
                    })}
                </Select>
                break;
            case 'customSelect':
                //mode="tags"初始值设置为空的话，不要为空字符串，要为空数组[]
                let customSelectVal = this.state.controllerData[name];
                if( customSelectVal == undefined || customSelectVal == '' ){
                    customSelectVal = [];
                }
                controller = <Select
                    mode="tags"
                    value={customSelectVal}
                    placeholder={config.placeholder}
                    style={{width:'100%'}}
                    onChange={(e)=>{this.customSelectOnChange(name,e)}}
                    onBlur={e=>{this.customSelectOnBlur(name,e)}}
                >

                </Select>
                break;
            case 'searchSelect':
                controller = <Select
                    mode="multiple"
                    style={{width:'100%'}}
                    onSearch={e=>{this.onSelectSearch(e)}}
                    onChange={(e)=>{this.onDataChange(name,e)}}
                    filterOption={false}
                    optionLabelProp='text'
                    {...config}
                >
                    {this.state.searchSelectData.map(d => <Option key={d.value} value={d.value} text={d.noHighLight}>{d.text}</Option>)}
                </Select>
                break;
            // case 'input':
            //     controller = <Input
            //         placeholder={config.placeholder}
            //         value={this.state.controllerData[name]}
            //         style={{width:'100%'}}
            //         onChange={v=>{this.onDataChange(name,v.target.value)}}
            //         onBlur={v=>{this.inputOnBlur(v)}}
            //     />
            //     break;
            case 'inputSelect':
                //mode="tags"初始值设置为空的话，不要为空字符串，要为空数组[]
                let inputSelectVal = this.state.controllerData[name];
                if( inputSelectVal == undefined || inputSelectVal == '' ){
                    inputSelectVal = [];
                }
                controller = <Select
                    mode="tags"
                    value={inputSelectVal}
                    placeholder={config.placeholder}
                    style={{width:'100%'}}
                    onChange={(e)=>{this.onDataChange(name,e)}}
                >
                    {this.state.inputSelectData.map(d => <Option key={d.stock_account} value={d.stock_account}>{d.stock_account}</Option>)}
                </Select>
                break;
            case 'select':
                controller = <Select
                    showSearch
                    mode={config.multiple?"multiple":undefined}
                    onChange={(e)=>{this.onDataChange(name,e)}}
                    placeholder={config.placeholder}
                    value={this.state.controllerData[name]}
                    allowClear={config.allowClear}
                    style={{width:'100%'}}
                    optionFilterProp='children'
                >
                    {_.map(config.options,function(option,index) {
                        return <Option value={option.value}  key={index} disabled={option.disabled} title={option.label}>{option.label}</Option>;
                    })}
                </Select>;

                break;
                //树形选择，用于有层级关系的选择
            case 'treeSelect':
                controller = <TreeSelect
                    value={this.state.controllerData[name]}
                    onChange={(e)=>{this.onDataChange(name,e)}}
                    className={config.className||''}
                    placeholder={config.placeholder}
                    treeDefaultExpandAll={true}
                    showCheckedStrategy={SHOW_PARENT}
                    treeData={config.treeData}
                    treeCheckable
                    style={{width:'100%'}}
                    dropdownMatchSelectWidth={false}
                    treeNodeFilterProp='label'
                    dropdownClassName={'ant-select-dropdown-transaction'}
                />;
                break
            case 'radio':
            controller = <RadioGroup
                className={config.className||''}
                value={this.state.controllerData[name]}
                onChange={(e)=>{this.onDataChange(name,e.target.value)}}
                size='large'>
                {_.map(config.radioOptions,function(option,index) {
                    return <RadioButton value={option.value} key={index}>{option.label}</RadioButton>;
                })}
            </RadioGroup>;

            break;
            case 'radioGroup':
                controller = <RadioGroup
                    onChange={config.onChangBtn}
                    placeholder={config.placeholder}
                    className={config.className||''}
                    defaultValue={config.defaultValue}
                    size='large'>
                    {_.map(config.radioOptions,function(option,index) {
                        return <RadioButton value={option.value} key={index}>{option.label}</RadioButton>;
                    })}
                </RadioGroup>;

                break;
            default:;
        }
        return controller;
    }
    render(){
        const _this = this;
        return (<div>
            {_.map(this.state.controllers,(row,rowIndex)=> {
                return (<Row key={rowIndex} gutter={12} style={{marginBottom:rowIndex==this.state.controllers.length-1?0:10}}>
                    {_.map(row,function(item,index) {
                        let label = '';
                        if((item.type!=='button'&&item.type!=='dropdown')&&item.label){
                            label = item.label
                        }
                        let {width,labelCol,wrapperCol} = item;
                        return (
                            <Col key={index} span={width}>
                                <div
                                    style={
                                        {
                                            display:'inline-block',
                                            width:labelCol?labelCol:'42%',
                                            textAlign: 'left',
                                            float:'left',
                                            paddingTop: '4px'

                                        }
                                    }
                                >
                                    {label}
                                </div>
                                <div style={{float:'left',position: 'relative',display:'inline-block',width:wrapperCol?wrapperCol:'58%'}}>{_this.renderController(item)}</div>
                            </Col>
                        );
                    })}
                </Row>);
            })}
        </div>);
    }
}
