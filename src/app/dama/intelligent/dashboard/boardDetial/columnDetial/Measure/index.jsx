import { NotificationWrap } from 'app_common'
import React, { Component } from 'react'
import { Button, Input, Select} from 'antd'
import _ from 'underscore'
import './index.less'

const { Option } = Select
const InputGroup = Input.Group;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

export default class Measure extends Component {
    constructor(props) {
        super(props)
        this.state ={
            firstOption: [
                '大于','大于等于', '小于', '小于等于','等于', '不等于'
            ],
            secondOption1: [ '小于', '小于等于', '无限制' ],
            secondOption2: [ '大于', '大于等于', '无限制' ],
            secondOption3: [ '无限制' ],
            firstValue: this.props.firstValue || '',	
            secondValue:this.props.secondValue || '',
            firstMark: this.props.firstMark || '大于等于',
            secondMark: this.props.secondMark || '小于等于',
            minValue: this.props.minValue || '',
            maxValue: this.props.maxValue || ''
        }
        this.handleChange = this.handleChange.bind(this)
    }
     
    componentWillReceiveProps =(nextProps) => {
        this.setState({
            firstMark: nextProps.firstMark,	
            firstValue: nextProps.firstValue,	
            secondMark: nextProps.secondMark,	
            secondValue: nextProps.secondValue,
            minValue: nextProps.minValue,
            maxValue: nextProps.maxValue
        })
    }
    onCancel = () => {
        this.props.onCancel()
    }
    handleChange(value) {
        console.log(`selected ${value}`);
    }
    returnFilter = (value) => {
        const { secondOption1,  secondOption2,  secondOption3, secondMark} = this.state
        let Options = secondOption1
        if(value === '大于' || value === '大于等于') {
            Options = secondOption1
        } else if(value === '小于' || value === '小于等于') {
            Options = secondOption2
        } else{
            Options = secondOption3
        }
        return(
            < Select style={{width: '88px'}} value={secondMark} onSelect={this.changeSecondMark}>
                 {
                     Options.map((value,index) => {
                         return (
                             <Option value={value} key={index}>{value}</Option>
                         )
                     })
                 }
             </Select>
         ) 
    }
    // 更改第一个下拉框
    changeFirstMark = (value) => {
        if(value !== this.state.firstMark){
            this.setState({
                firstMark: value,
                secondMark: null,
                secondValue: ''
            })
        }
        if(value==='等于'||value==='不等于'){
            this.setState({
                secondMark: '无限制'
            })
        }

    }
    // 更改第二个下拉框
    changeSecondMark = (value) => {
        this.setState({
            secondMark: value
        })
    }
    onInput = (e) => {   
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.setState({
                firstValue: e.target.value
            })
        }
    }
    onInput1 = (e) => {
        const { value } = e.target
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.setState({
                secondValue: e.target.value
            })
        }
    }
    // 确定按钮方法
    changeInf =() =>{
        const {firstMark, firstValue, secondMark, secondValue} = this.state
        let params = {
            columnId: this.props.indexId,
            interval: {
                firstMark,
                firstValue,
                secondMark,
                secondValue,
            }
        }
        if(this.props.isAdd){
            this.props.addNewFilter(params)
        } else {
            this.props.updateFilter(params)
        }

    }
    
    render() {
        const { isAdd, indexName } = this.props
        const { 
                firstOption, secondOption1, secondOption2, secondOption3 ,
                firstMark, firstValue, secondMark, secondValue,
                minValue, maxValue
            } = this.state
        return (
            <div className='Measure' id="Measure">
                {
                    isAdd && <div className='filterTopic'>
                        请设置过滤组件默认过滤条件，如果没有设置默认过滤条件，系统将不使用“{indexName}”进行过滤
                    </div>
                }
                <div className='indexContent'>
                <InputGroup compact style={{marginBottom: '24px'}}>
                    <Select style={{width: '88px'}} value={firstMark} onSelect={this.changeFirstMark}>
                        {
                            firstOption.map((value,index) => {
                                return (
                                    <Option value={value} key={index}>{value}</Option>
                                )
                            })
                        }
                    </Select>
                    <Input style={{ width: '335px' }} onChange={this.onInput} value={firstValue} placeholder='输入数值' />
                </InputGroup>
                <InputGroup compact>
                    {
                        this.returnFilter(firstMark)
                    }
                    <Input style={{ width: '335px' }} onChange={this.onInput1} value={secondValue} placeholder='输入数值' disabled={firstMark==='等于'||firstMark==='不等于'|| secondMark ==='无限制' } />
                </InputGroup>
                </div>
                <div className='describe'>
                {indexName}的数值范围，{minValue} ~ {maxValue}
                </div>
                <div className='boardBottomBtn'>
                    <Button onClick={this.onCancel} style={{ marginRight: '10px' }}>取消</Button>
                    <Button type='primary' onClick={this.changeInf}>确定</Button>
                </div>
            </div>
        )
    }
}