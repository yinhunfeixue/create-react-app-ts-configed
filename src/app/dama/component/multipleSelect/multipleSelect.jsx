import React, { Component } from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';
import immutable from 'immutable'

import Cache from 'app_utils/cache'
import './style.less'

const CheckboxGroup = Checkbox.Group

export default class MultipleSelect extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            checkAll: false,
            indeterminate: true,
            checkedList: [],
            selectOptionData: [],
            checkDisplay: false
        }
        this.prevData = {}
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps,'componentWillReceiveProps')
        // 注意 这里要用immutable！！！！！！
        if (!immutable.is(immutable.fromJS(nextProps), immutable.fromJS(this.prevData))) {
            if (Cache.get('globalSearchCondition') && Cache.get('globalSearchCondition').area && Cache.get('globalSearchCondition').area.length > 0) {
                this.setState({
                    title: `已选${Cache.get('globalSearchCondition').area.length}项`
                })
            } else {
                this.setState({
                    title: this.props.title
                })
            }
            this.setState({
                checkedList: nextProps.checkedList,
                selectOptionData: nextProps.selectOptionData
            }, () => {
                if (Cache.get('globalSearchCondition') && Cache.get('globalSearchCondition').area && Cache.get('globalSearchCondition').area.length === 7) {
                    this.setState({
                        checkAll: true
                    })
                } else {
                    this.setState({
                        checkAll: false
                    })
                }
            })
            this.prevData = nextProps
        }
    }

    componentDidMount() {
        document.body.addEventListener('click', this.hideSelect);
    }

    componentWillUnmount() {
        document.body.removeEventListener('click', this.hideSelect);
    }

    hideSelect = () => {
        this.setState({
            checkDisplay: false
        })
    }

    onCheckAllChange = (e) => {
        let plainOptionsNew = []
        _.map(this.state.selectOptionData, (item, key) => {
            plainOptionsNew.push(item.value)
        })

        this.setState({
            checkedList: e.target.checked
                ? plainOptionsNew
                : [],
            indeterminate: false,
            checkAll: e.target.checked,
            title: e.target.checked ? `已选${plainOptionsNew.length}项` : `已选0项`,
            checkDisplay: true
        }, () => {
            let condition = {
                keyword: Cache.get('globalSearchCondition').keyword,
                area: this.state.checkedList
            }
            Cache.set('globalSearchCondition', condition)

            this.props.changeSelect && this.props.changeSelect(this.state.checkedList)
        })
    }

    onChange = (checkedList) => {
        let condition = {
            keyword: Cache.get('globalSearchCondition').keyword,
            area: checkedList
        }
        Cache.set('globalSearchCondition', condition)
        this.setState({
            title: `已选${checkedList.length}项`,
            checkedList,
            checkDisplay: true,
            indeterminate: !!checkedList.length && (checkedList.length < this.state.selectOptionData.length),
            checkAll: checkedList.length === this.state.selectOptionData.length
        }, () => {
            this.props.changeSelect && this.props.changeSelect(checkedList)
        })
    }

    titleClick = () => {
        this.setState({
            checkDisplay: !this.state.checkDisplay
        })
    }

    initSelectOptionData = (selectOptionData, checkedList) => {
        this.setState({
            selectOptionData,
            checkedList,
            title: `已选${checkedList.length}项`,
            checkDisplay: false,
            checkAll: checkedList.length === selectOptionData.length
        })
    }

    getSelectValue = () => {
        return this.state.checkedList
    }

    render() {
        const {
            selectOptionData,
            indeterminate,
            checkedList,
            checkAll,
            title,
            checkDisplay
        } = this.state
        const {
            multiple_select_top,
            multiple_select_bottom,
            multiple_select_right,
            multiple_select_left
        } = this.props

        console.log(selectOptionData, '------------')
        return (
            <span className='multiple_select_container' ref='multipleSelect'>
                <span className="multiple_select_title" onClick={this.titleClick}>
                    {title}
                    <DownOutlined />
                </span>

                <span className='multiple_select' style={{ display: checkDisplay ? 'block' : 'none', top: multiple_select_top, bottom: multiple_select_bottom, right: multiple_select_right, left: multiple_select_left }}>
                    <Checkbox
                        // indeterminate={indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={checkAll}
                    >全选</Checkbox>
                    <CheckboxGroup options={selectOptionData} value={checkedList} onChange={this.onChange} />
                </span>
            </span>
        );
    }
}
