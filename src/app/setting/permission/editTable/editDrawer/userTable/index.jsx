import React, { Component } from 'react'
import { Button, Checkbox, message, Table, Tooltip } from 'antd'
import IconFont from '@/component/IconFont'
import ProjectUtil from '@/utils/ProjectUtil'
import { getUserTaskAuth, getResource, setResourceAuth } from '@/api/systemApi'
import _ from 'lodash'
import './index.less'
import Item from '@/components/select/tableSelect/cps/item'

export default class RoleTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newKey: 1,
            currentRecord: {},
            dataSource: [],
            dataSourceCopy: [],
        }

        this.columns = [
            {
                title: '用户',
                dataIndex: 'userName',
                render: (text, record) => {
                    return <span>{text || '~'}</span>
                },
            },
        ]
        if (!props.hideEdit) {
            this.columns = this.columns.concat([
                {
                    title: '连接管理',
                    dataIndex: 'edit',
                    key: 'edit',
                    render: (_, record, index) => {
                        const { authRwType } = record
                        if (record.hasOwnProperty('authRwType')) {
                            return (
                                <Checkbox
                                    onChange={(event) => {
                                        const { checked } = event.target
                                        if (checked) {
                                            this.selectColumn('edit', record.authID)
                                        } else {
                                            this.unSelectColumn('edit', record.authID)
                                        }
                                    }}
                                    checked={authRwType === 2}
                                ></Checkbox>
                            )
                        }
                    },
                },
            ])
        }
        this.columns = this.columns.concat([
            {
                title: '查看',
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
                            ></Checkbox>
                        )
                    }
                },
            },
        ])
    }

    componentDidMount = async () => {
        const { currentRecord, dataSourceList } = this.props
        await this.setState({ currentRecord, dataSourceList }, () => {
            this.getUserTaskAuth()
        })
    }

    getUserTaskAuth = async () => {
        const { dataSourceList } = this.state
        let authID = 1
        const newData = dataSourceList.map((task) => {
            task.authName = task.userName
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
        const { dataSource, currentRecord } = this.state
        const { id } = currentRecord
        const arr = []
        dataSource.forEach((item) => {
            const obj = { ...item, ...this.props.resourceData }
            obj.entityId = item.userId
            obj.entityType = 1
            obj.appId = 1
            obj.resourceValue = id
            arr.push(obj)
        })
        this.setState({ loading: true })
        const res = await setResourceAuth({ entityResourceAuthList: arr })
        this.setState({ loading: false })
        if (res.code === 200) {
            this.props.reFresh()
            message.success('更新成功')
        } else {
            message.error(res.msg || '获取权限错误')
        }
    }

    render() {
        const { dataSource, dataSourceCopy, newKey, expandedRowKeys, loading } = this.state
        return (
            <div className='permisstionTable'>
                <Table rowKey='authID' key={newKey} columns={this.columns} dataSource={dataSource} pagination={false} />
                {!ProjectUtil.equalArrayDeep(dataSource, dataSourceCopy) && (
                    <div style={{ marginTop: 12 }}>
                        <Button type='primary' disabled={loading} onClick={this.submit}>
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
