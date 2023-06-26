import React, { Component } from 'react'
import { Button, Checkbox, message, Table, Tooltip } from 'antd'
import IconFont from '@/component/IconFont'
import ProjectUtil from '@/utils/ProjectUtil'
import { getUserTaskAuth, getResource, setResourceAuth } from '@/api/systemApi'
import _ from 'lodash'
import './index.less'
import Item from '@/components/select/tableSelect/cps/item'

export default class SystemPermisstionTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newKey: 1,
            currentRecord: {},
            dataSource: [],
            dataSourceCopy: [],
            resourceData: {},
        }

        this.columns = [
            {
                dataIndex: 'authName',
                render: (text, record) => {
                    const icon = <IconFont type='icon-xitong' />
                    return (
                        <span>
                            <span style={{ marginRight: 8 }}>{icon}</span>

                            {text || '~'}
                        </span>
                    )
                },
            },
            // {
            //     dataIndex: 'edit',
            //     key: 'edit',
            //     render: (_, record, index) => {
            //         const { authRwType } = record
            //         if (record.hasOwnProperty('authRwType')) {
            //             return (
            //                 <Checkbox
            //                     onChange={(event) => {
            //                         const { checked } = event.target
            //                         if (checked) {
            //                             this.selectColumn('edit', record.authID)
            //                         } else {
            //                             this.unSelectColumn('edit', record.authID)
            //                         }
            //                     }}
            //                     checked={authRwType === 2}
            //                 >
            //                     任务调度
            //                 </Checkbox>
            //             )
            //         }
            //     },
            // },
            {
                render: (_, record, index) => {
                    const { authRwType } = record
                    if (record.hasOwnProperty('authRwType')) {
                        return (
                            <Checkbox
                                onChange={(event) => {
                                    const { checked } = event.target
                                    if (checked) {
                                        this.selectColumn('view', record.authID)
                                    } else {
                                        this.unSelectColumn('view', record.authID)
                                    }
                                }}
                                checked={[1, 2].indexOf(authRwType) > -1}
                            >
                                任务管理
                            </Checkbox>
                        )
                    }
                },
            },
        ]
    }

    componentWillReceiveProps = (nextProps) => {
        const { currentRecord } = nextProps
        if (!currentRecord.id) return
        this.setState({ currentRecord: currentRecord }, () => {
            this.getUserTaskAuth()
        })
    }

    componentDidMount = async () => {
        const { currentRecord } = this.props
        if (!currentRecord.id) return
        await this.setState({ currentRecord: currentRecord }, () => {
            this.getUserTaskAuth()
        })
        const res = await getResource()
        if (res.data.resourceList) {
            this.setState({ resourceData: res.data.resourceList.find((target) => target.resourceId === 2) })
        }
    }

    getUserTaskAuth = async () => {
        const { id } = this.state.currentRecord
        const res = await getUserTaskAuth({ id })
        if (res.code !== 200) {
            return
        }
        const { data } = res
        let authID = 1
        const newData = data.map((task) => {
            task.authName = task.taskGroupName
            task.authRwType = task.authRwType === null ? 3 : task.authRwType
            task.authID = authID
            authID++
            return task
        })
        this.setState({
            dataSource: newData,
            dataSourceCopy: newData,
        })
    }

    selectColumn = (type, id) => {
        const arr = _.cloneDeep(this.state.dataSource)
        const element = this.findElement(arr, id)
        element.authRwType = type === 'view' ? 1 : 2
        this.setState({ dataSource: arr })
    }
    findElement = (arr, id) => {
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index]
            if (element.authID === id) {
                return element
            }
        }
    }
    unSelectColumn = (type, id) => {
        const arr = _.cloneDeep(this.state.dataSource)
        const element = this.findElement(arr, id)
        element.authRwType = type === 'view' ? 3 : 3
        this.setState({ dataSource: arr })
    }

    submit = async () => {
        const { dataSource, resourceData } = this.state
        const { id } = this.state.currentRecord
        const arr = []
        dataSource.forEach((item) => {
            const obj = { ...item, ...resourceData }
            obj.entityId = id
            obj.entityType = 1
            obj.appId = 1
            obj.resourceValue = item.taskGroupId
            arr.push(obj)
        })
        const res = await setResourceAuth({ entityResourceAuthList: arr })
        if (res.code === 200) {
            this.getUserTaskAuth()
            message.success('更新成功')
        } else {
            message.error(res.msg || '获取权限错误')
        }
    }

    render() {
        const { dataSource, dataSourceCopy, newKey, expandedRowKeys } = this.state
        return (
            <div className='permisstionTable'>
                <div>任务权限</div>
                <Table rowKey='authID' key={newKey} columns={this.columns} dataSource={dataSource} showHeader={false} pagination={false} />
                {!ProjectUtil.equalArrayDeep(dataSource, dataSourceCopy) && (
                    <div style={{ marginTop: 12 }}>
                        <Button type='primary' onClick={this.submit}>
                            更新权限
                        </Button>

                        <Button onClick={() => this.setState({ dataSource: dataSourceCopy })} style={{ marginTop: 12, marginLeft: 8 }}>
                            撤销修改
                        </Button>
                    </div>
                )}
            </div>
        )
    }
}
