import { Tabs, Button, Select, message } from 'antd'
import React, { Component } from 'react'
import './index.less'
import { ContentLayout, Empty } from 'cps'
import { queryMetaModelDetailList, sortGroup } from 'app_api/metaModelApi'
import { Time } from 'utils'
import ProjectUtil from '@/utils/ProjectUtil'
import RichTableLayout from '@/component/layout/RichTableLayout'
import PermissionWrap from '@/component/PermissionWrap'
import DraggableTabs from './draggableTabs'
import TableLayout from '@/component/layout/TableLayout'
import update from 'immutability-helper'
import MetaModelDetailList from './metaModelDetailList'
import IconFont from '@/component/IconFont'
import { inputTypeList } from './enumType'
import AddModelDetailDrawer from './addModelDetailDrawer'

const Option = Select.Option
const { TabPane } = Tabs

export default class MetaModel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            metaModelList: [],
            dataSourceTypeMap: [],
        }
    }

    componentDidMount = () => {
        this.getParam()
    }

    getParam = () => {
        let param = ProjectUtil.getPageParam(this.props)
        const { id, name } = param
        this.setState({ modelId: id, pageTitle: name }, () => {
            this.queryMetaModelDetailListById()
        })
    }

    queryMetaModelDetailListById = async () => {
        const { modelId } = this.state
        this.setState({ loading: true })
        let res = await queryMetaModelDetailList({ metaModelId: modelId })
        this.setState({ loading: false })
        if (res.code === 200) {
            this.setState({ metaModelList: this.modifyMetaModeList(res.data) })
        }
    }

    modifyMetaModeList = (arr) => {
        for (let index = 0; index < arr.length; index++) {
            for (let j = 0; j < arr[index].metaModelDetailList.length; j++) {
                const element = arr[index].metaModelDetailList[j]
                if (element.type === 1) {
                    const typeId = parseInt(element.subTypeList[0])
                    const target = inputTypeList.find((input) => input.id === typeId)
                    element.typeName = `${element.typeName} (${target ? target.name : null})`
                }
            }
        }
        return arr
    }

    getNewOrder = async (newOrder) => {
        let res = await sortGroup(newOrder.map((id) => id))
        if (res.code === 200) {
            message.success('修改成功！')
        }
    }

    onTabHover = (index) => {
        this.setState({ currentEnterIndex: index })
    }

    openAddPage = () => {
        this.addNameRuleDrawer && this.addNameRuleDrawer.openAddModal({ appBaseConfigId: null })
    }

    render() {
        const { pageTitle, metaModelList, dataSourceTypeMap, modelId, currentEnterIndex, loading } = this.state
        return (
            <React.Fragment>
                <AddModelDetailDrawer modelId={modelId} metaModelList={metaModelList} search={() => this.queryMetaModelDetailListById()} ref={(dom) => (this.addNameRuleDrawer = dom)} />
                <TableLayout
                    className='model_attribute'
                    title={pageTitle}
                    renderHeaderExtra={() => {
                        return (
                            <PermissionWrap funcCode='/md/meta_model/attribute/add'>
                                <Button type='primary' onClick={this.openAddPage}>
                                    新增属性
                                </Button>
                            </PermissionWrap>
                        )
                    }}
                    renderDetail={() => {
                        return (
                            <DraggableTabs getNewOrder={this.getNewOrder}>
                                {metaModelList.map((record, i) => (
                                    <TabPane
                                        tab={
                                            <div
                                                style={{ width: 120, textAlign: 'center', position: 'relative' }}
                                                onMouseEnter={this.onTabHover.bind(null, i)}
                                                onMouseLeave={() => this.setState({ currentEnterIndex: null })}
                                            >
                                                <span style={{ position: 'absolute', left: 0 }}>{currentEnterIndex === i && <IconFont type='icon-tuozhuai' />}</span>{' '}
                                                {`${record.appBaseConfigGroup} (${record.count})`}
                                            </div>
                                        }
                                        key={record.appBaseConfigId}
                                    >
                                        <MetaModelDetailList
                                            currentEnterIndex={currentEnterIndex}
                                            loading={loading}
                                            modelId={modelId}
                                            queryMetaModelDetailListById={this.queryMetaModelDetailListById}
                                            metaModelList={metaModelList}
                                            metaModel={record}
                                        />
                                    </TabPane>
                                ))}
                            </DraggableTabs>
                        )
                    }}
                ></TableLayout>
            </React.Fragment>
        )
    }
}
