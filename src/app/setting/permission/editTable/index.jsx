import { getAllAuth, getResource } from '@/api/systemApi'
import Module from '@/component/Module'
import TreeControl from '@/utils/TreeControl'
import { Spin, Table } from 'antd'
import React, { Component } from 'react'
import EditDrawer from './editDrawer'
import './index.less'

export default class EditTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            resourceData: {},
            allList: {},
            loading: false,
            sortType: undefined,
            authsData: undefined,
        }
        this.columns = [
            {
                title: '指定对象',
                dataIndex: 'datasourceName',
                key: 'datasourceName',
                sorter: true,
                sortDirections: ['descend'],
                width: '70%',
                render: (_, record) => {
                    let title, color, icon
                    if (record.hasOwnProperty('deptName')) {
                        icon = <span className=' iconfont icon-zuzhi'></span>
                        title = record.deptName
                        color = 'linear-gradient(312deg, #7550FF 0%, #5746FF 100%)'
                    } else if (record.hasOwnProperty('roleName')) {
                        icon = <span className=' iconfont icon-gangwei'></span>
                        title = record.roleName
                        color = 'linear-gradient(312deg, #FF6D50 0%, #FFA035 100%)'
                    } else if (record.hasOwnProperty('userName')) {
                        icon = record.userName ? record.userName.substring(0, 1) : '-'
                        title = record.userName
                        color = 'linear-gradient(312deg, #506FFF 0%, #4691FF 100%)'
                    }
                    return (
                        <div className='item_header'>
                            <div className='item_left'>
                                <span className='item_icon' style={{ background: color }}>
                                    {icon}
                                </span>
                            </div>
                            <div className='item_content'>
                                <div>
                                    <span className='title'>{`${title + (record.hasOwnProperty('roleNames') ? ` (${record.account})` : '') || ''}`}</span>
                                    {record.hasOwnProperty('roleNames') && record.roleNames.split(',').length > 0 && (
                                        <span className='user_tag_wrap'>
                                            {record.roleNames.split(',').map((role) => (
                                                <span className='user_tag'>{role}</span>
                                            ))}
                                        </span>
                                    )}
                                </div>
                                {record.hasOwnProperty('basicDeptName') && record.basicDeptName && <div className='bottom'>所属部门: {record.basicDeptName}</div>}
                                {record.hasOwnProperty('deptNames') && record.deptNames && <div className='bottom'>所属部门: {record.deptNames}</div>}
                            </div>
                        </div>
                    )
                },
            },
        ]
        if (!props.hideEdit) {
            this.columns = this.columns.concat([
                {
                    title: props.editTitle || '',
                    width: '15%',
                    render: (_, record) => {
                        return record.authRwType === 2 ? (
                            <span style={{ color: '#2AC75E' }} className='iconfont icon-gou'>
                                {' '}
                            </span>
                        ) : (
                            '-'
                        )
                    },
                },
            ])
        }
        this.columns = this.columns.concat([
            {
                title: props.viewTitle || '',
                width: '15%',
                render: (_, record) => {
                    return [1, 2].indexOf(record.authRwType) > -1 ? (
                        <span style={{ color: '#2AC75E' }} className='iconfont icon-gou'>
                            {' '}
                        </span>
                    ) : (
                        '-'
                    )
                },
            },
        ])
    }

    componentDidMount = async () => {
        const { currentRecord } = this.props
        if (!currentRecord.id) return
        await this.setState({ currentRecord: currentRecord })
        const res = await getResource()
        if (res.data.resourceList) {
            this.setState({ resourceData: res.data.resourceList.find((target) => target.resourceId === (this.props.type === 'task' ? 2 : 1)) }, () => {
                const { getResourceType } = this.props
                getResourceType && getResourceType(this.state.resourceData.resourceType)
                this.getAllAuth()
            })
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.currentRecord.id !== this.props.currentRecord.id) {
            this.getAllAuth()
        }
    }

    getAllAuth = async () => {
        this.setState({ loading: true })
        const res = await getAllAuth({ ...this.state.resourceData, resourceValue: this.props.currentRecord.id })
        this.setState({ loading: false })
        if (res.code === 200) {
            this.setState({ allList: res.data, authsData: res.data })
        }
    }

    getAuthDataSource() {
        const { sortType, authsData } = this.state
        if (!authsData) {
            return []
        }

        let { resourceDeptAuths, resourceRoleAuths, resourceUserAuths } = authsData
        const treeControl = new TreeControl(undefined, 'childDeptResourceAuths')
        const allDeptAuths = []
        treeControl.forEach(resourceDeptAuths, (node) => {
            allDeptAuths.push(node)
        })
        // 合并数组，顺序为：部门/角色/用户
        let result = [...allDeptAuths, ...resourceRoleAuths, ...resourceUserAuths]

        //  如果sortType无值，则按时间排序
        if (sortType) {
            result.sort((a, b) => {
                return a.time - b.time
            })
        }
        return result.filter((item) => item.authRwType !== null)
    }

    expendResourceDeptAuths = (list, result, deptName) => {
        for (let index = 0; index < list.length; index++) {
            const element = list[index]
            element.basicDeptName = deptName
            result.push(element)
            if (element.childDeptResourceAuths && element.childDeptResourceAuths.length > 0) {
                this.expendResourceDeptAuths(element.childDeptResourceAuths, result, (deptName || '') + (deptName ? ' / ' : '') + element.deptName)
            }
        }
        return result
    }

    openEditModal = () => {
        this.editDrawerRef.openModal(this.props.currentRecord)
    }

    render() {
        const { allList, resourceData, loading } = this.state
        return (
            <Spin spinning={loading}>
                <div className='editTable'>
                    <Module
                        title='关联对象'
                        renderHeaderExtra={() => (
                            <React.Fragment>
                                <EditDrawer hideEdit={this.props.hideEdit} resourceData={resourceData} getAllAuth={this.getAllAuth} allList={allList} ref={(dom) => (this.editDrawerRef = dom)} />
                                <span onClick={this.openEditModal} style={{ color: '#4D73FF', cursor: 'pointer' }}>
                                    <span className='iconfont icon-shezhi' style={{ marginRight: 4 }}></span>
                                    授权管理
                                </span>
                            </React.Fragment>
                        )}
                    >
                        <Table
                            dataSource={this.getAuthDataSource()}
                            pagination={false}
                            scroll={false}
                            columns={this.columns}
                            onChange={(page, filter, sorter) => {
                                this.setState({ sortType: sorter.order })
                            }}
                        />
                    </Module>
                </div>
            </Spin>
        )
    }
}
