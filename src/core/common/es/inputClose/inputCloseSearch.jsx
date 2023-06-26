import React, { Component } from 'react'
import { CloseCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

import './style.less'
// handleInputChange 输入框值改变回调

export default class InputCloseSearch extends Component {
    constructor(props) {
        super(props)

        this.state = {
            inputValue: ''
        }
    }

    // 同样是调用handleInputChange方法 清空的时候有第二个参数 代表点了清空（差X）否则只是输入框值的改变 点差的时候重新请求
    emitEmpty = () => {
        this.inputRef.focus()
        this.setState({ inputValue: '' })
        if (this.props.handleInputChange) {
            this.props.handleInputChange('', true)
        }
    }

    inputChange = (e) => {
        this.setState({ inputValue: e.target.value })
        if (this.props.handleInputChange) {
            this.props.handleInputChange(e.target.value)
        }
    }
    // flag为true 代表刷新 相当于传空值
    handleSearch = (flag) => {
        console.log(flag, 'flagflagflag')
        if (this.props.handleSearch) {
            if (flag === '刷新') {
                this.setState({
                    inputValue: ''
                })
            }
            this.props.handleSearch(flag === '刷新' ? '' : this.state.inputValue)
        }
    }

    render() {
        const { inputValue } = this.state

        const suffix = inputValue ? <CloseCircleOutlined onClick={this.emitEmpty} /> : <span />

        return (
            <div className='inputCloseSearch'>
                <Input
                    size={this.props.size ? this.props.size : 'default'}
                    placeholder={this.props.placeholder ? this.props.placeholder : '请输入搜索条件'}
                    prefix={this.props.prefix ? this.props.prefix : null}
                    suffix={suffix}
                    value={inputValue}
                    onChange={this.inputChange}
                    onPressEnter={this.handleSearch}
                    ref={(node) => this.inputRef = node}
                />
                <SearchOutlined onClick={this.handleSearch} />
                <ReloadOutlined onClick={this.handleSearch.bind(this, '刷新')} />
            </div>
        );
    }
}
