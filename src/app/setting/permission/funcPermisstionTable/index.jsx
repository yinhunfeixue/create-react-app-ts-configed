import { requestRolePermissionList, requestUserPermissionList, saveRolePermissionList, saveUserPermissionList } from '@/api/systemApi'
import IconFont from '@/component/IconFont'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Checkbox, message, Spin, Tabs, Tooltip } from 'antd'
import React, { Component } from 'react'

import classNames from 'classnames'
import _ from 'lodash'
import './index.less'

const lockIcon = (
    <Tooltip
        title={
            <div className='LockTip'>
                <div>锁定该权限，不跟随部门、角色变化</div>
            </div>
        }
    >
        <IconFont type='icon-suo' />
    </Tooltip>
)

export default class FuncPermisstionTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentRecord: {},
            dataSource: [],
            dataSourceCopy: [],
            resourceData: {},
            checkedAll: false,
            checkedAllIndeter: false,
            newKey: 1,
            loading: false,
        }
    }

    componentWillReceiveProps = (nextProps) => {
        const { currentRecord, type } = nextProps
        if (!currentRecord.id) return
        this.setState({ currentRecord: currentRecord }, () => {
            this.requestPermissionList()
        })
    }

    componentDidMount = async () => {}

    requestPermissionList = async () => {
        const { id } = this.state.currentRecord
        const { type, getLoading } = this.props
        let res
        this.setState({ loading: true })
        if (type === 'user') {
            res = await requestUserPermissionList(id)
        } else if (type === 'role') {
            res = await requestRolePermissionList(id)
        } else {
            return message.error('请输入有效的查询类型')
        }
        this.setState({ loading: false })
        const { code, data, msg } = res
        if (code === 200) {
            this.setState({
                dataSource: _.cloneDeep(data.funcAuths),
                dataSourceCopy: _.cloneDeep(data.funcAuths),
            })
        } else {
            message.error(msg)
        }
    }

    renderTableList = (menuList, level, result) => {
        if (menuList.length === 0) return result

        level++
        for (let index = 0; index < menuList.length; index++) {
            const element = menuList[index]

            if (element.authType === 1 && element.children.length === 0) {
                result.push(this.renderRecord(null, element, level))
            } else if (element.authType === 1 && element.children.length > 0 && element.children[0].authType === 1) {
                result.push(this.renderRecord(null, element, level))
                this.renderTableList(element.children, level, result)
            } else if (element.authType === 1 && element.children.length > 0 && element.children[0].authType === 2) {
                result.push(
                    this.renderRecord(
                        element.children.map((child) => {
                            return (
                                <Checkbox className='button_box' onChange={this.selectMenu.bind(null, child.id, child.parentId)} checked={child.selected}>
                                    <span className='button_box_title'>{child.title}</span>
                                    {/* {child.islock && lockIcon} */}
                                </Checkbox>
                            )
                        }),
                        element,
                        level
                    )
                )
            }
        }
        return result
    }

    renderRecord = (children, element, level) => {
        return (
            <div className={`record_body`}>
                <div style={{ paddingLeft: `${(level - 1) * 40}px` }}>
                    <div className='record_title'>
                        <IconFont type='icon-wenjian2' /> {element.title}
                        {/* {element.islock && lockIcon} */}
                    </div>
                    <div className='check_box_wrap' style={{ paddingLeft: `${(3 - level) * 40}px` }}>
                        {children}
                    </div>
                    <div className='right_box'>
                        <Checkbox onChange={this.selectPage.bind(null, element.id, element.parentId)} indeterminate={this.someMenuSelect(element.children)} checked={element.selected}></Checkbox>
                    </div>
                </div>
            </div>
        )
    }

    allMenuSelect = (list) => {
        const selectIds = this.selectedIds(list, [])
        const ids = this.getChildrenIds(list, [])
        return selectIds.length === ids.length
    }

    someMenuSelect = (list) => {
        const selectIds = this.selectedIds(list, [])
        const ids = this.getChildrenIds(list, [])
        if (ids.length === 0) return false
        return !!selectIds.length && selectIds.length < ids.length
    }

    checkedAllChange = (childrenList, index, e) => {
        const { checked } = e.target
        let result
        if (checked) {
            result = this.selectAll(childrenList, true)
        } else {
            result = this.selectAll(childrenList, false)
        }
        const { dataSource } = this.state
        dataSource[index].selected = checked
        dataSource[index].children = childrenList
        this.setState({ dataSource })
    }

    selectAll = (list, value) => {
        for (let index = 0; index < list.length; index++) {
            const element = list[index]
            element.selected = value
            if (element.children.length > 0) {
                this.selectAll(element.children, value)
            }
        }
    }

    selectPage = (id, parentId, e) => {
        const { checked } = e.target
        const { dataSource } = this.state
        this.selectPageId(dataSource, id, checked)
        this.setParentsCheck(dataSource, parentId, checked)
        this.setState({ dataSource })
    }

    selectMenu = (id, parentId, e) => {
        const { checked } = e.target
        const { dataSource } = this.state
        this.selectMenuId(dataSource, id, checked)
        this.setParentsCheck(dataSource, parentId, checked)
        this.setState({ dataSource })
    }

    setParentsCheck = (list, id, value) => {
        if (!value) return
        for (let index = 0; index < list.length; index++) {
            const element = list[index]
            if (element.id === id) {
                element.selected = value
                return true
            }
            if (element.children.length !== 0 && this.setParentsCheck(element.children, id, value)) {
                element.selected = value
                return true
            }
        }
        return false
    }

    findElement = (arr, id) => {
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index]
            if (element.id === id) {
                return element
            } else if (element.children && element.children.length > 0) {
                const target = this.findElement(element.children, id)
                if (target) {
                    return target
                }
            }
        }
    }

    selectMenuId = (list, id, value) => {
        for (let index = 0; index < list.length; index++) {
            const element = list[index]
            if (element.id === id) {
                element.selected = value
            } else {
                this.selectMenuId(element.children, id, value)
            }
        }
    }

    selectPageId = (list, id, value) => {
        for (let index = 0; index < list.length; index++) {
            const element = list[index]
            if (element.id === id) {
                element.selected = value
                this.selectAll(element.children, value)
            } else {
                this.selectPageId(element.children, id, value)
            }
        }
    }

    selectedIds = (list, result) => {
        for (let index = 0; index < list.length; index++) {
            const element = list[index]
            if (element.selected) {
                result.push(element.id)
            }
            if (element.children.length > 0) {
                this.selectedIds(element.children, result)
            }
        }
        return result
    }

    getChildrenIds = (list, result) => {
        for (let index = 0; index < list.length; index++) {
            const element = list[index]
            result.push(element.id)
            if (element.children.length > 0) {
                this.getChildrenIds(element.children, result)
            }
        }
        return result
    }

    submit = async () => {
        const { id } = this.state.currentRecord
        const { type } = this.props
        const { dataSource } = this.state
        const dataSourceList = _.cloneDeep(dataSource)

        const funcAuths = this.getfuncAuthsList(dataSourceList)

        let res
        this.setState({ loading: true })
        if (type === 'user') {
            res = await saveUserPermissionList({ updateFlag: 1, userId: id, funcAuths, systemAuths: [] })
        } else {
            res = await saveRolePermissionList({ updateFlag: 1, roleId: id, funcAuths, systemAuths: [] })
        }
        if (res.code === 200) {
            message.success('更新成功')
            this.requestPermissionList()
        }
        this.setState({ loading: false })
    }

    getfuncAuthsList = (list) => {
        for (let index = 0; index < list.length; index++) {
            const element = list[index]
            if (!element.selected) {
                list.splice(index, 1)
                index--
                // console.log(list, index)
            }
            if (element.children.length > 0) {
                this.getfuncAuthsList(element.children)
            }
        }
        return list
    }

    reset = (index) => {
        const { dataSource, dataSourceCopy } = this.state
        dataSource[index] = _.cloneDeep(dataSourceCopy[index])
        this.setState({ dataSource })
    }

    render() {
        const { dataSource, dataSourceCopy, newKey, checkedAll, checkedAllIndeter, loading } = this.state
        const { currentRecord } = this.props

        return (
            <Spin spinning={loading}>
                <div className='funcPermisstionTable'>
                    <Tabs className='ant-tabs-buttonStyle FlexTabs' onChange={this.tabChange} animated={false}>
                        {dataSource.map((source, index) => {
                            const selectIds = this.selectedIds(source.children, [])
                            const changed = !ProjectUtil.equalArrayDeep(dataSource[index], dataSourceCopy[index])
                            return (
                                <Tabs.TabPane tab={source.title} key={index}>
                                    <div className={classNames('record_list_wrap', changed ? 'record_list_wrap_show_footer' : '')} key={currentRecord ? currentRecord.id : ''}>
                                        <div className='record_list_header'>
                                            <span className='record_list_title'>
                                                <IconFont style={{ marginRight: 6 }} type='icon-wenjian' />
                                                {source.title}
                                            </span>
                                            <span className='record_list_checkall'>
                                                <span style={{ marginRight: 4 }}>全选</span>
                                                <Checkbox
                                                    onChange={this.checkedAllChange.bind(null, source.children, index)}
                                                    checked={this.allMenuSelect(source.children)}
                                                    indeterminate={this.someMenuSelect(source.children)}
                                                ></Checkbox>
                                            </span>
                                        </div>
                                        {this.renderTableList(source.children, 0, [])}
                                        {changed && (
                                            <div className='record_footer HControlGroup'>
                                                <Button type='primary' disabled={loading} onClick={this.submit}>
                                                    更新权限
                                                </Button>
                                                <Button onClick={this.reset.bind(null, index)}>撤销修改</Button>
                                            </div>
                                        )}
                                    </div>
                                </Tabs.TabPane>
                            )
                        })}
                    </Tabs>
                </div>
            </Spin>
        )
    }
}
