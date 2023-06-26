import { requestRoleList } from '@/api/systemApi'
import SliderLayout from '@/component/layout/SliderLayout'
import SearchTree, { defaultTitleRender } from '@/components/trees/SearchTree'
import { Empty } from 'antd'
import React from 'react'
import FuncPermisstionTable from '../funcPermisstionTable/index'
import InfoCard from '../infoCard/index'
import './index.less'

class PermissionIndex extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dataList: [],
            useTotal: 0,
            loading: false,
            loadingList: false,
            defaultExpandAll: false,
            currentRecord: {},
            entityType: 1,
            page: 1,
            pageSize: 99999,
        }
    }

    componentDidMount() {
        this.requestdataList(1, true)
    }

    requestdataList(page, reset) {
        const { dataList } = this.state
        this.setState({ loadingList: true })
        return requestRoleList({
            page,
            page_size: 9999999,
        })
            .then((res) => {
                if (res.code === 200) {
                    this.setState({ dataList: reset ? res.data : dataList.concat(res.data), useTotal: res.total }, () => {
                        this.onSelect([res.data[0].id])
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
        const target = dataList.find((data) => data.id === ids[0])
        this.setState({ currentRecord: target })
    }

    render() {
        const { loadingList, dataList, defaultExpandAll, searchKey, currentRecord, loading } = this.state
        return (
            <SliderLayout
                className='functionPermission'
                style={{ height: '100%' }}
                sliderBodyStyle={{ padding: 0 }}
                renderSliderBody={() => {
                    return dataList && dataList.length ? (
                        <SearchTree
                            style={{ height: '100%' }}
                            key={defaultExpandAll}
                            treeTitleRender={(node, searchValue) => {
                                return defaultTitleRender(
                                    node,
                                    (data) => {
                                        return {
                                            icon:
                                                data.level === 2 ? (
                                                    <span className='iconfont icon-shujuyu'> </span>
                                                ) : data.level === 1 ? (
                                                    <img style={{ width: 16, height: 16, borderRadius: 1 }} src={data.description} />
                                                ) : (
                                                    <span className='iconfont icon-gangwei'> </span>
                                                ),
                                            title: `${data.roleName}`,
                                        }
                                    },
                                    searchValue
                                )
                            }}
                            treeProps={{
                                treeData: dataList,
                                defaultExpandedKeys: defaultExpandAll ? undefined : dataList.map((item) => item.id),
                                fieldNames: { key: 'id', title: 'roleName' },
                                defaultSelectedKeys: [dataList[0].id],
                                defaultExpandAll: defaultExpandAll,
                                onSelect: this.onSelect,
                            }}
                        />
                    ) : null
                }}
                renderSliderHeader={() => {
                    return '角色列表'
                }}
                renderContentHeader={() => {
                    return '角色权限'
                }}
                renderContentBody={() => {
                    const { remark, roleName } = currentRecord
                    return currentRecord.toString() !== '{}' ? (
                        <div className='functionPermission_wrap'>
                            <InfoCard type='role' record={{ cnName: roleName, remark }} />
                            <div className='tab_wrap'>
                                <FuncPermisstionTable type='role' requestdataList={this.onSelect} currentRecord={currentRecord} />
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

export default PermissionIndex
