import React, {Component} from 'react'
import moment from 'moment';
import {Cascader, DatePicker, Select} from 'antd';

const {MonthPicker,RangePicker} = DatePicker;

const Option = Select.Option;

/*

 */

const quarterList = [
	{
	    value: '1',
	    label: '一季度'
	},
	{
	    value: '2',
	    label: '二季度'
	},
	{
	    value: '3',
	    label: '三季度'
	},
	{
	    value: '4',
	    label: '四季度'
	}
]

const halfyearList = [
	{
	    value: '1',
	    label: '上半年'
	},
	{
	    value: '2',
	    label: '下半年'
	}
]

export default class DQRankPicker extends Component{

	constructor(props){
		super(props);

		//bind event
		this.yearSelectChange = this.yearSelectChange.bind(this);
		this.quarterSelectChange = this.quarterSelectChange.bind(this);
		this.selectChange = this.selectChange.bind(this);

		this.state = {
			dateValue:{startDate:'',endDate:''},
			quarterList:this.props.quarterList != undefined ? this.props.quarterList : quarterList,
			halfyearList:this.props.halfyearList != undefined ? this.props.halfyearList : halfyearList,
		}
	}

	selectChange(type,selection){
		console.log(selection);
		this.setState({
			dateValue:{...this.state.dateValue,[`${type}Date`]:selection}
		})
		//console.log('1213232');

		if (this.props.QDSelectChange) {
			this.props.QDSelectChange({[`${type}Date`]:selection});
		}
	}

	yearSelectChange(type,selection){
		this.setState({
			dateValue:{...this.state.dateValue,[`${type}Date`]:selection}
		})
		//console.log('1213232');

		if (this.props.QDSelectChange) {
			this.props.QDSelectChange({[`${type}Date`]:selection});
		}
	}

	quarterSelectChange(type,selection){
		this.setState({
			dateValue:{...this.state.dateValue,[`${type}Date`]:selection}
		})
		if (this.props.QDSelectChange) {
			this.props.QDSelectChange({[`${type}Date`]:selection});
		}
	}

	getQuarterChildOption(type,dis=undefined){
		const addDisabled = this.state.quarterList.map(q=>{
			return {...q,disabled:dis?type==='start'?Number(dis)<Number(q.value):Number(dis)>Number(q.value):false}
		})

		return addDisabled
	}

	getHalfyearChildOption(type,dis=undefined){
		const addDisabled = this.state.halfyearList.map(q=>{
			return {...q,disabled:dis?type==='start'?Number(dis)<Number(q.value):Number(dis)>Number(q.value):false}
		})

		return addDisabled
	}

	getQuarterOption(type){
		const __value = this.state.dateValue[`${type==='start'?'end':'start'}Date`];
		return this.props.dateList.map(date=>({
			value:date,
			label:date,
			disabled:__value?type==='start'?Number(__value[0])<Number(date):Number(__value[0])>Number(date):false,
			children:this.getQuarterChildOption(type,__value?__value[0]===date?__value[1]:undefined:undefined)
		}))
	}

	getYearOption(type){
		const currentValue = this.state.dateValue[`${type==='start'?'end':'start'}Date`];

        return this.props.dateList.map(year=>{
    		return <Option
				key={year}
				disabled={currentValue?type==='start'?Number(currentValue)<Number(year):Number(currentValue)>Number(year):false}
				value={year}
			>
				{year}年
			</Option>
    	})
	}

	getHalfyearOption(type){
		const __value = this.state.dateValue[`${type==='start'?'end':'start'}Date`];
		return this.props.dateList.map(date=>({
			value:date,
			label:date,
			disabled:__value?type==='start'?Number(__value[0])<Number(date):Number(__value[0])>Number(date):false,
			children:this.getHalfyearChildOption(type,__value?__value[0]===date?__value[1]:undefined:undefined)
		}))
	}

	componentWillReceiveProps(nextProps){

		let endDate = '';
		let startDate = '';

		if( nextProps.defaultValue != undefined ){

			if( nextProps.defaultValue.endDate != undefined ){
				endDate = nextProps.defaultValue.endDate;
			}

			if( nextProps.defaultValue.startDate != undefined ){
				startDate = nextProps.defaultValue.startDate;
			}

			if (nextProps.selectType === 'Q' ) {

				startDate = [startDate.substring(0,4),startDate.substring(4)];

				endDate = [endDate.substring(0,4),endDate.substring(4)];

			}else if( nextProps.selectType === 'H' ){

				startDate = [startDate.substring(0,4),startDate.substring(4)];

				endDate = [endDate.substring(0,4),endDate.substring(4)];

			}else if( nextProps.selectType === 'M' ){

				if( !(startDate instanceof  moment) ){
					startDate = moment(startDate,'YYYY-MM');
				}

				if( !(endDate instanceof  moment) ){
					endDate = moment(endDate,'YYYY-MM');
				}
			}
		}

		this.setState({
			dateValue:{startDate,endDate}
		})
	}

	getBody(type){
		console.log(this.state.dateValue);
		if (type==='Q') {
			return (
				<div>
					<Cascader
					    options={this.getQuarterOption('start')}
					    expandTrigger="hover"
					    value={this.state.dateValue.startDate}
						displayRender={e=>e.join('年')}
					    onChange={e=>{this.quarterSelectChange('start',e)}}
					    allowClear={false}
					/>至
					<Cascader
					    options={this.getQuarterOption('end')}
					    expandTrigger="hover"
					    value={this.state.dateValue.endDate}
					    displayRender={e=>e.join('年')}
					    onChange={e=>{this.quarterSelectChange('end',e)}}
					    allowClear={false}
					/>
				</div>
			)
		}else if(type==='M'){
			//console.log('1111111111111');
			return(
				<div>
					<MonthPicker
	                allowClear={false}
					value={this.state.dateValue.startDate}
					onChange={e=>{this.selectChange('start',e)}}
	                />
					至
					<MonthPicker
	                allowClear={false}
					value={this.state.dateValue.endDate}
					onChange={e=>{this.selectChange('end',e)}}
	                />
				</div>
			)
		}else if(type==='D'){

		}else if(type==='H'){
			return (
				<div>
					<Cascader
					    options={this.getHalfyearOption('start')}
					    expandTrigger="hover"
					    value={this.state.dateValue.startDate}
						displayRender={e=>e.join('年')}
					    onChange={e=>{this.selectChange('start',e)}}
					    allowClear={false}
					/>至
					<Cascader
					    options={this.getHalfyearOption('end')}
					    expandTrigger="hover"
					    value={this.state.dateValue.endDate}
					    displayRender={e=>e.join('年')}
					    onChange={e=>{this.selectChange('end',e)}}
					    allowClear={false}
					/>
				</div>
			)
		}else{
			return(
				<div>
	                <Select value={this.state.dateValue.startDate} onChange={e=>{this.yearSelectChange('start',e)}}>
	                	{
	                    	this.getYearOption('start')
	                	}
	                </Select>至
	                <Select value={this.state.dateValue.endDate} onChange={e=>{this.yearSelectChange('end',e)}}>
	                	{
	                    	this.getYearOption('end')
	                	}
	                </Select>
				</div>
			)
		}
	}

	render(){
		const {selectType} = this.props;
		return(
			<div className={this.props.className}>
				{this.getBody(selectType)}
			</div>
		)
	}
}
