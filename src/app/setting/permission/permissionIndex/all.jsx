import { requestUserList } from '@/api/systemApi'
import SliderLayout from '@/component/layout/SliderLayout'
import SearchTree, { defaultTitleRender } from '@/components/trees/SearchTree'
import { Empty, Tabs } from 'antd'
import React from 'react'
import FuncPermisstionTable from '../funcPermisstionTable/index'
import InfoCard from '../infoCard/index'
import SystemPermisstionTable from '../systemPermisstionTable/index'
import TaskPermisstionTable from '../taskPermisstionTable/index'
import './index.less'

class PermissionIndex extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dataList: [],
            useTotal: 0,
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
        return requestUserList({
            page,
            page_size: 9999999,
        })
            .then((res) => {
                if (res.code === 200) {
                    // res.data.forEach((item) => {
                    //     item.name = `${item.name} (${item.account})`
                    // })
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

        // 重置内容区滚动条
        if (this.scroller) {
            this.scroller.scrollTo({ top: 0 })
        }
    }

    tabChange = () => {}

    render() {
        const { loadingList, dataList, defaultExpandAll, searchKey, currentRecord } = this.state
        return (
            <SliderLayout
                className='userPermission'
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
                                                    <span className='iconfont icon-user3'> </span>
                                                ),
                                            title: (
                                                <React.Fragment>
                                                    {data.name}
                                                    {data.account && <span className='UnImportText'> ({data.account})</span>}
                                                </React.Fragment>
                                            ),
                                        }
                                    },
                                    searchValue
                                )
                            }}
                            treeProps={{
                                treeData: dataList,
                                defaultExpandedKeys: defaultExpandAll ? undefined : dataList.map((item) => item.id),
                                fieldNames: { key: 'id', title: 'name' },
                                defaultSelectedKeys: [dataList[0].id],
                                defaultExpandAll: defaultExpandAll,
                                onSelect: this.onSelect,
                            }}
                        />
                    ) : null
                }}
                renderSliderHeader={() => {
                    return '用户列表'
                }}
                renderContentHeader={() => {
                    return '用户权限'
                }}
                renderContentBody={() => {
                    const { account, name, roleNames, deptNames } = currentRecord
                    const contents = [
                        { name: '角色', value: roleNames },
                        { name: '部门', value: deptNames },
                    ]
                    return currentRecord.toString() !== '{}' ? (
                        <div
                            className='userPermission_wrap'
                            ref={(target) => {
                                this.scroller = target
                            }}
                        >
                            <InfoCard record={{ cnName: name, enName: account, contents }} />
                            <div className='tab_wrap'>
                                <Tabs onChange={this.tabChange} animated={false} className='FlexTabs'>
                                    <Tabs.TabPane tab='功能权限' key={1}>
                                        <FuncPermisstionTable type='user' requestdataList={this.onSelect} currentRecord={currentRecord} />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab='系统权限' key={2}>
                                        <SystemPermisstionTable requestdataList={this.onSelect} currentRecord={currentRecord} />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab='任务权限' key={3}>
                                        <TaskPermisstionTable requestdataList={this.onSelect} currentRecord={currentRecord} />
                                    </Tabs.TabPane>
                                </Tabs>
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
