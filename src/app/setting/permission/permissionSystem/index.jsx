import { getSystemDs, resourceReset } from '@/api/systemApi'
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
        return getSystemDs({
            page,
            page_size: 9999999,
            accountName: searchKey,
        })
            .then((res) => {
                if (res.code === 200) {
                    const arr = this.modifyTreeDataList(res.data)
                    this.setState({ dataList: reset ? arr : dataList.concat(arr), useTotal: res.total }, () => {
                        this.onSelect(0, { node: this.getInitSelect() })
                    })
                }
            })
            .finally(() => {
                this.setState({ loadingList: false })
            })
    }

    getInitSelect = () => {
        const { dataList } = this.state
        for (let index = 0; index < dataList.length; index++) {
            const element = dataList[index]
            if (element.children.length > 0) {
                return element.children[0]
            } else {
                continue
            }
        }
    }

    modifyTreeDataList = (arr) => {
        let key = 1
        arr.forEach((child) => {
            child.key = key
            key++
            child.title = child.systemName
            child.children = child.dsList
            child.children.forEach((item) => {
                item.key = key
                key++
                item.title = item.datasourceName
            })
        })
        return arr
    }

    onSelect = (_, e) => {
        console.log(e.node)
        this.setState({ currentRecord: e.node, newKey: this.state.newKey + 1 })
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
                const res = await resourceReset({ resourceType: this.resourceType, resourceValue: this.state.currentRecord.datasourceId })
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

        let defaultId = ''
        if (dataList && dataList.length) {
            defaultId = this.getInitSelect().datasourceId
        }
        return (
            <SliderLayout
                className='systemPermission'
                style={{ height: '100%' }}
                sliderBodyStyle={{ padding: 4 }}
                renderSliderBody={() => {
                    return dataList && dataList.length ? (
                        <SearchTree
                            key={defaultExpandAll}
                            style={{ height: '100%' }}
                            treeTitleRender={(node, searchValue) => {
                                return defaultTitleRender(
                                    node,
                                    (data) => {
                                        return {
                                            icon: data.hasOwnProperty('systemIcon') ? <img style={{ width: 14, height: 14 }} src={data.systemIcon} /> : <span className='iconfont icon-xitong'> </span>,
                                            title: `${data.title}`,
                                        }
                                    },
                                    searchValue
                                )
                            }}
                            treeProps={{
                                treeData: dataList,
                                defaultExpandedKeys: defaultExpandAll ? undefined : dataList.map((item) => item.systemId),
                                fieldNames: { key: 'key' },
                                defaultSelectedKeys: [ this.getInitSelect().key],
                                defaultExpandAll: defaultExpandAll,
                                onSelect: this.onSelect,
                            }}
                            disableNodeSelect={(node) => !node.hasOwnProperty('datasourceId')}
                        />
                    ) : null
                }}
                renderSliderHeader={() => {
                    return '系统列表'
                }}
                renderContentHeader={() => {
                    return '系统名称'
                }}
                renderContentBody={() => {
                    const { datasourceId, datasourceName } = currentRecord
                    return currentRecord.hasOwnProperty('datasourceId') ? (
                        <div className='systemPermission_wrap' key={datasourceId}>
                            <Alert
                                message='默认权限规则'
                                icon={<span className='iconfont icon-xinxitishi'></span>}
                                description={
                                    <div style={{ lineHeight: '26px' }}>
                                        1. 数据源的创建者和数据源的技术负责人，可以进行数据源连接管理，并查看该数据源
                                        <br /> 2. 数据所属系统的归属业务部门的业务人员，可以查看元数据信息 <br />
                                        3. 治理人员，可以对数据源进行数据管理&治理、查看元数据信息
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
                                    type='system'
                                    editTitle='连接管理'
                                    getResourceType={this.getResourceType}
                                    currentRecord={{ id: datasourceId.toString(), name: datasourceName }}
                                />
                            </div>
                        </div>
                    ) : (
                        <Empty style={{ marginTop: 30 }} description='请在左侧选择一项数据源' />
                    )
                }}
            />
        )
    }
}

export default PermissionTask
