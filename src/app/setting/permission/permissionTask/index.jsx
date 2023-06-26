import { getTaskDs, resourceReset } from '@/api/systemApi'
import SliderLayout from '@/component/layout/SliderLayout'
import SearchTree, { defaultTitleRender } from '@/components/trees/SearchTree'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Alert, Empty, Modal } from 'antd'
import React from 'react'
import EditTable from '../editTable/index'

import './index.less'

class PermissionTask extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            searchKey: '',
            dataList: [],
            useTotal: 0,
            loadingList: false,
            defaultExpandAll: false,
            currentRecord: {},
            entityType: 1,
            page: 1,
            pageSize: 99999,
            newKey: 1,
        }
    }

    componentDidMount() {
        this.requestdataList(1, true)
    }

    requestdataList(page, reset) {
        const { searchKey, dataList } = this.state
        this.setState({ loadingList: true })
        return getTaskDs({
            page,
            page_size: 9999999,
            accountName: searchKey,
        })
            .then((res) => {
                if (res.code === 200) {
                    this.setState({ dataList: reset ? res.data : dataList.concat(res.data), useTotal: res.total }, () => {
                        this.onSelect(res.data[0] ? [res.data[0].taskGroupId] : [])
                    })
                }
            })
            .finally(() => {
                this.setState({ loadingList: false })
            })
    }

    onSelect = (ids) => {
        const { dataList } = this.state
        if (dataList.length === 0) return
        const target = dataList.find((data) => data.taskGroupId === ids[0])
        this.setState({ currentRecord: target, newKey: this.state.newKey + 1 })
    }

    tabChange = () => {}

    resetPermission = async () => {
        Modal.confirm({
            title: '恢复默认设置',
            icon: <ExclamationCircleFilled />,
            content: '该操作将移除自定义添加的关联人员',
            okText: '恢复',
            cancelText: '取消',
            onOk: async () => {
                const res = await resourceReset({ resourceType: this.resourceType, resourceValue: this.state.currentRecord.taskGroupId })
                if (res.code === 200) {
                    this.requestdataList(1, true)
                }
            },
        })
    }

    getResourceType = (getResourceType) => {
        this.resourceType = getResourceType
    }

    render() {
        const { loadingList, dataList, defaultExpandAll, searchKey, currentRecord, newKey } = this.state
        return (
            <SliderLayout
                className='taskPermission'
                style={{ height: '100%' }}
                sliderBodyStyle={{ padding: 0 }}
                renderSliderBody={() => {
                    return dataList && dataList.length ? (
                        <SearchTree
                            style={{ height: '100%' }}
                            key={defaultExpandAll}
                            equalNode={(value, node) => Boolean(value && node.title && node.title.toString().includes(searchKey))}
                            treeTitleRender={(node, searchValue) => {
                                return defaultTitleRender(
                                    node,
                                    (data) => {
                                        return {
                                            icon: <span className='iconfont icon-fenlei'> </span>,
                                            title: `${data.taskGroupName}`,
                                        }
                                    },
                                    searchValue
                                )
                            }}
                            treeProps={{
                                treeData: dataList,
                                defaultExpandedKeys: defaultExpandAll ? undefined : dataList.map((item) => item.taskGroupId),
                                fieldNames: { key: 'taskGroupId', title: 'taskGroupName' },
                                defaultSelectedKeys: [dataList[0].taskGroupId],
                                defaultExpandAll: defaultExpandAll,
                                onSelect: this.onSelect,
                            }}
                        />
                    ) : null
                }}
                renderSliderHeader={() => {
                    return '任务列表'
                }}
                renderContentHeader={() => {
                    return '任务名称'
                }}
                renderContentBody={() => {
                    const { taskGroupId, taskGroupName } = currentRecord
                    return taskGroupId ? (
                        <div className='taskPermission_wrap' key={taskGroupId}>
                            <Alert
                                message='默认权限规则'
                                icon={<span className='iconfont icon-xinxitishi'></span>}
                                description={
                                    <div style={{ lineHeight: '26px' }}>
                                        1. 任务的创建者和负责人，可以对任务进行调度和管理
                                        <br /> 2. 所有治理人员可以对任务进行管理
                                        <div className='reset_btn' onClick={this.resetPermission}>
                                            <span className='iconfont icon-shuaxin1'></span>恢复默认设置
                                        </div>
                                    </div>
                                }
                                type='info'
                                showIcon
                            />
                            <div className='tab_wrap'>
                                <EditTable
                                    viewTitle='查看'
                                    key={newKey}
                                    editTitle='连接管理'
                                    getResourceType={this.getResourceType}
                                    type='task'
                                    hideEdit={true}
                                    currentRecord={{ id: taskGroupId.toString(), name: taskGroupName }}
                                />
                            </div>
                        </div>
                    ) : (
                        <Empty style={{ marginTop: 30 }} description='请在左侧选择一项' />
                    )
                }}
            />
        )
    }
}

export default PermissionTask
