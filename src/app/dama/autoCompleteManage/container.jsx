import React, { Component } from 'react'
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Layout, Menu, Tabs } from 'antd';
import _ from 'underscore'
import { CommonTree } from 'app_component'
import './index.less'
import 'app_component_main/leftContainer/style.less'

import { getTree } from 'app_api/systemManage'


const TabPane = Tabs.TabPane
const { SubMenu } = Menu
const { Sider } = Layout
const plainOptions = ['Apple', 'Pear', 'Orange']
const defaultCheckedList = ['Apple', 'Orange']

export default class Containers extends Component {
    constructor(props) {
        super(props)
        // console.log(props)
        this.state = {
            inputValue: '',
            radioValue: '1',
            // checkedList: defaultCheckedList,
            // indeterminate: true,
            // checkAll: false,
            reviewInputValue: '',
            // treeData: [], // 树数据
            // defaultTreeSelectedKeys: [], // 左侧树默认选中项
            openKeys: [], // 高级搜索默认打开项
            current: [], // 高级功能 当前选中的key
        }
        this.defaultExpandAll = true // 是否默认展开所有树节点
        this.rootSubmenuKeys = ['sub1', 'sub2', 'sub4'] // 高级搜索根子菜单的key
    }

    // componentWillMount() {

    //  }

    componentDidMount = () => {
        const { chlidrenMenu } = this.props
        if (chlidrenMenu.length > 0) {
            let openKeys = [chlidrenMenu[0]['column_name']]
            let current = chlidrenMenu[0]['children'].length > 0 ? [chlidrenMenu[0]['children'][0]['column_name']] : [chlidrenMenu[0]['column_name']]
            let indexName = current.length > 0 ? current : openKeys
            this.setState({
                openKeys,
                current
            }, () => {
                if (indexName[0]) {
                    this.props.renderIndex(indexName[0])
                }
            })
        }
    }

    // onChange = (checkedList) => {
    //     this.setState({
    //         checkedList,
    //         indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
    //         checkAll: checkedList.length === plainOptions.length
    //     })
    // }

    // onCheckAllChange = (e) => {
    //     this.setState({
    //         checkedList: e.target.checked ? plainOptions : [],
    //         indeterminate: false,
    //         checkAll: e.target.checked
    //     })
    // }

    reviewInputChange = (e) => {
        console.log(e)
    }

    onTreeSelect = (selectedKeys, e) => {
        if (this.props.onTreeSelect) {
            this.props.onTreeSelect(selectedKeys[0])
        }
    }

    highFunctionClick = (e) => {
        // console.log(e,"highFunctionClick")
        this.setCurrentkey(e.key, this.props.highFunctionClick(e.key))
    }
    // tabs组件通过index.jxs文件，设置高级功能 当前选中项，
    setCurrentkey = (key, callback) => {
        this.setState({
            current: key
        }, () => {
            if (callback) {
                callback()
            }
        })
    }
    // 高级功能menu展开
    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find((key) => this.state.openKeys.indexOf(key) === -1)
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys })
        } else {
            this.setState({
                openKeys: latestOpenKey
                    ? [latestOpenKey]
                    : []
            })
        }
    }

    render() {
        const {
            inputValue,
            radioValue,
            reviewInputValue,
            openKeys,
            current
        } = this.state
        // console.log(current);
        const { chlidrenMenu } = this.props
        // console.log(chlidrenMenu)
        // console.log("chlidrenMenu")
        return (
            <Layout >
                <Sider width='100%' >
                    {/*<Tabs defaultActiveKey='1' >*/}
                        {/*<TabPane tab='高级功能' key='1' className='leftSenior'>*/}
                            <Menu mode='inline'
                                  openKeys={openKeys}
                                  onOpenChange={this.onOpenChange}
                                  selectedKeys={current}
                                  onClick={this.highFunctionClick}
                            >
                                {
                                    _.map(chlidrenMenu, (item, key) => {
                                        if (item.children.length > 0) {
                                            return (
                                                <SubMenu key={item.column_name} title={<span > <LegacyIcon type={item.column_class
                                                    ? item.column_class
                                                    : 'bank'}
                                                />
                                                    <span>{item.column_name}</span>
                                                </span>}
                                                >
                                                    {
                                                        _.map(item.children, (subItem, subKey) => {
                                                            return (<Menu.Item key={subItem.column_name}>{subItem.column_name}</Menu.Item>)
                                                        })
                                                    }
                                                </SubMenu>
                                            );
                                        } else {
                                            return (
                                                <Menu.Item key={item.column_name}><span > <LegacyIcon type={item.column_class
                                                    ? item.column_class
                                                    : 'bank'}
                                                />
                                                        <span>{item.column_name}</span>
                                                    </span></Menu.Item>
                                            );
                                        }
                                    })
                                }
                            </Menu>
                        {/*</TabPane>*/}
                    {/*</Tabs>*/}
                </Sider>
            </Layout>
        );
    }
}
