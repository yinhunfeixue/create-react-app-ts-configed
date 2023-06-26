import React, {Component} from 'react'
import { CloseCircleOutlined } from '@ant-design/icons';
import { Input } from 'antd';

import "./style.less"
// handleInputChange 输入框值改变回调

export default class InputClose extends Component {
    constructor(props) {
        super(props)

        this.state = {
            inputValue: ""
        }
    }

    emitEmpty = () => {
        this.inputRef.focus()
        this.setState({ inputValue: '' })
        if(this.props.handleInputChange){
            this.props.handleInputChange("",true)
        }
        this.props.onClear&&this.props.onClear()
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps.value, 'closeInput')
        this.state = {
            inputValue: nextProps.value?nextProps.value:''
        }
    }

    inputChange = (e) => {
        const {value} = e.target
        this.setState({ inputValue: value?value:'' })
        if(this.props.handleInputChange){
            this.props.handleInputChange(value?value:'')
        }
    }

    render() {
        const {inputValue} = this.state

        const suffix = inputValue ? <CloseCircleOutlined onClick={this.emitEmpty} /> : <span />

        return (<Input
            style={this.props.style}
            placeholder={this.props.placeholder?this.props.placeholder:"请输入搜索条件"}
            prefix={this.props.prefix?this.props.prefix:null}
            suffix={suffix}
            className={this.props.className}
            value={inputValue}
            onChange={this.inputChange}
            ref={node => this.inputRef = node}
            onPressEnter={this.props.onPressEnter}
        />)
    }
}
