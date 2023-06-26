import SliderLayout from '@/component/layout/SliderLayout'
import RenderUtil from '@/utils/RenderUtil'
import Module from '@/component/Module'
import { Divider, Tag } from 'antd'
import EditTree from 'app_page/dama/component/EditTree'
import BizDetailEditDrawer from './bizDetailEditDrawer'
import CatalogSystem from './system'
import SystemTree from './systemTree'
import React, { Component } from 'react'
import './index.less'
import { catalogSystemTree, systemCatalog } from 'app_api/dataSecurity'

let firstChild = {}
export default class Catalog extends React.Component {
    constructor() {
        super()
        this.state = {
            selectedTagCategory: {},
            treeData: [],
            defaultTreeSelectedKeys: [],
            systemDetail: {
                businessOtherDepartmentNames: []
            },
            isDataWarehouse: false
        }
    }
    componentDidMount = () => {
        this.getTreeData()
    }
    getTreeData = async () => {
        let res = await catalogSystemTree()
        if (res.code == 200) {
            await this.setState({
                treeData: res.data,
            })
            await this.getFirstChild(res.data[0].children)
            this.systemTree&&this.systemTree.getTreeData(this.state.treeData, [this.state.selectedTagCategory.id], true)
            this.catalogSystem&&this.catalogSystem.getSystemId(this.state.selectedTagCategory.id, this.state.isDataWarehouse)
            this.getSystemCatalog()
        }
    }
    reload = () => {
        this.getSystemCatalog()
        this.catalogSystem&&this.catalogSystem.getCatalogNondwTableFilter()
        this.catalogSystem&&this.catalogSystem.getCatalogNondwBizTree()
        this.catalogSystem&&this.catalogSystem.search()
    }
    getFirstChild(val) {
        if (JSON.stringify(firstChild) != "{}") {
            return;//如果res不再是空对象，退出递归
        } else {
            //遍历数组
            for (let i = 0; i < val.length; i++) {
                //如果当前的isleaf是true,说明是叶子节点，把当前对象赋值给res,并return，终止循环
                if (val[i].type == 1) {
                    firstChild = val[i];
                    this.setState({
                        selectedTagCategory: val[i],
                        isDataWarehouse: val[i].dataWarehouse
                    })
                    return;
                } else if (!val[i].children) {//如果chidren为空，则停止这次循环
                    break;
                } else {//否则的话，递归当前节点的children
                    this.getFirstChild(val[i].children);
                }
            }
        }
    }
    getSystemCatalog = async () => {
        let { selectedTagCategory } = this.state
        let res = await systemCatalog({id: selectedTagCategory.id})
        if (res.code == 200) {
            this.setState({
                systemDetail: res.data,
            })
        }
    }
    onSelect = async (selectedKeys, e) => {
        console.log(selectedKeys, e)
        let { isDataWarehouse } = this.state
        let selectedTagCategory = {}
        if (e.selectedNodes.length > 0) {
            let selectedNode = e.selectedNodes[0]
            selectedTagCategory = selectedNode.dataRef
            isDataWarehouse = selectedNode.dataRef.dataWarehouse
        }
        await this.setState({
            selectedTagCategory,
            isDataWarehouse
        })
        this.getSystemCatalog()
        await this.catalogSystem&&this.catalogSystem.clearSelectRow()
        await this.catalogSystem&&this.catalogSystem.getSystemId(this.state.selectedTagCategory.id, this.state.isDataWarehouse)
        this.catalogSystem&&this.catalogSystem.search()
    }
    openBizEditDrawer = () => {
        this.bizDetailEditDrawer&&this.bizDetailEditDrawer.openModal(this.state.systemDetail, this.state.isDataWarehouse)
    }
    renderTitle = () => {
        return (
            <div>
                业务信息
                <a onClick={this.openBizEditDrawer} className='titleEdit'>
                    编辑
                    <span className="iconfont icon-bianjifill" />
                </a>
            </div>
        )
    }
    render() {
        const {
            selectedTagCategory,
            systemDetail,
            isDataWarehouse
        } = this.state
        return (
            <SliderLayout
                className='catalog'
                style={{ height: '99%' }}
                renderSliderHeader={() => {
                    return '目录'
                }}
                renderContentHeader={() => {
                    return (
                        <div>
                            {selectedTagCategory.name}
                        </div>
                    )
                }}
                renderSliderBody={() => {
                    return (
                        <SystemTree
                            ref={(dom) => this.systemTree = dom}
                            onTreeSelect={this.onSelect}
                            selectedKeys={selectedTagCategory.id}
                            selectType={1}
                            itemKey='id'
                            itemTitle='name'
                        />
                    )
                }}
                renderContentBody={() => {
                    return (
                        <div>
                            <Module title='基本信息'>
                                <div className='MiniForm Grid4'>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '系统类型',
                                            content: systemDetail.product,
                                        },
                                        {
                                            label: '系统分类',
                                            content: systemDetail.sysClassifyName,
                                        },
                                        {
                                            label: '系统安全等级',
                                            content: systemDetail.securityLevel ? <Tag color={systemDetail.securityLevel == 1 ? 'blue' : (systemDetail.securityLevel == 2 ? 'geekblue' : (systemDetail.securityLevel == 3 ? 'purple' : (systemDetail.securityLevel == 4 ? 'orange' : 'red')))}>
                                                {systemDetail.securityLevelName}
                                            </Tag> : '',
                                        },
                                        {
                                            label: '技术归属部门',
                                            content: systemDetail.techniqueDepartmentName,
                                        },
                                        {
                                            label: '技术负责人',
                                            content: systemDetail.techniqueManagerName,
                                        },
                                        {
                                            label: '业务权威归属部门',
                                            content: systemDetail.businessMainDepartmentName,
                                        },
                                        {
                                            label: '业务负责人',
                                            content: systemDetail.businessManagerName,
                                        },
                                        {
                                            label: '其他业务使用部门',
                                            content: systemDetail.businessOtherDepartmentNames&&systemDetail.businessOtherDepartmentNames.length ? <div>
                                                {
                                                    systemDetail.businessOtherDepartmentNames.map((item) => {
                                                        return (<span>{item} </span>)
                                                    })
                                                }
                                            </div> : '',
                                        }
                                    ])}
                                </div>
                            </Module>
                            <Divider/>
                            <Module title={this.renderTitle()}>
                                <div className='MiniForm Grid4'>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '业务分类',
                                            hide: isDataWarehouse,
                                            content: systemDetail.bizClassifyName,
                                        },
                                        {
                                            label: '业务归属部门',
                                            content: systemDetail.classifyBizDeptName,
                                        },
                                        {
                                            label: '业务负责人',
                                            content: systemDetail.classifyBizManagerName,
                                        }
                                    ])}
                                </div>
                            </Module>
                            <Divider/>
                            <CatalogSystem {...this.props} ref={(dom) => this.catalogSystem = dom}/>
                            <BizDetailEditDrawer reload={this.reload} ref={(dom) => this.bizDetailEditDrawer = dom}/>
                        </div>
                    )
                }}
            />
        )
    }
}