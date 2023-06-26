import DrawerLayout from '@/component/layout/DrawerLayout';
import RenderUtil from '@/utils/RenderUtil';
import { Button, Checkbox, Form, message, Select } from 'antd';
import { sensitiveTagRule } from 'app_api/dataModeling';
import { dataSecurityLevelList, desensitiseTag } from 'app_api/dataSecurity';
import { bizRuleSearch } from 'app_api/examinationApi';
import React, { Component } from 'react';
import CodeItemModal from '../../ddl/codeItemModal';
import '../../index.less';
import ForeignKeyColumnDrawer from './foreignKeyColumnDrawer';
import StandardMapDrawer from './standardMapDrawer';

export default class ColumnCheckDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
                foreignDatabaseId: '',
                databaseName: '',
                foreignTableId: '',
                tableName: '',
                foreignColumnId: '',
                foreignColumnName: '',
                qaRuleIdList: [],
                standardId: undefined,
                refCodeItemId: '',
                codeItemName: '',
                codeItemCode: '',
                qaRuleNameList: []
            },
            levelList: [],
            tagList: [],
            dataMaskList: [],
            ruleList: [],
            tableSecurityLevel: 0,
        }
    }
    openModal = async (data, securityLevel) => {
        console.log(data,'columnCheckDrawer++++')
        data.qaRuleNameList = data.qaRuleNameList ? data.qaRuleNameList : []
        await this.setState({
            modalVisible: true,
            dataMaskList: [],
            detailInfo: {...data},
            tableSecurityLevel: securityLevel
        })
        this.getDataSecurityLevelList()
        this.getTagList()
        this.getSensitiveTagRule()
        this.getRuleList()
    }
    getDataSecurityLevelList = async () => {
        let res = await dataSecurityLevelList()
        if (res.code == 200) {
            this.setState({
                levelList: res.data
            })
        }
    }
    getTagList = async () => {
        let res = await desensitiseTag({needAll: true})
        if (res.code == 200) {
            this.setState({
                tagList: res.data
            })
        }
    }
    getSensitiveTagRule = async () => {
        if (this.state.detailInfo.desensitiseTagId == undefined) {
            return
        }
        let res = await sensitiveTagRule({id: this.state.detailInfo.desensitiseTagId})
        if (res.code == 200) {
            this.setState({
                dataMaskList: res.data
            })
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    changeSelect = async (name , e, node) => {
        let { detailInfo, ruleList, tableSecurityLevel } = this.state
        if (name == 'primaryKey') {
            detailInfo[name] = e.target.checked
        } else if (name == 'foreignKey') {
            if (e.target.checked && !detailInfo.foreignColumnId) {
                this.openForeignKeyModal()
            } else {
                detailInfo[name] = e.target.checked
            }
        } else if (name == 'securityLevel') {
            if (e < tableSecurityLevel) {
                message.info('字段安全等级不能小于表安全等级')
                return
            }
            detailInfo[name] = e
            detailInfo.securityLevelName = node.props.children
        } else {
            detailInfo[name] = e
            if (name == 'desensitiseTagId') {
                detailInfo.sensitivityLevelName = node.props.title
                detailInfo.desensitiseRuleId = node.props.ruleId
                detailInfo.desensitiseTagName = node.props.children
                await this.setState({
                    detailInfo,
                })
                this.getSensitiveTagRule()
            }
            if (name == 'qaRuleIdList') {
                detailInfo.qaRuleNameList = []
                ruleList.map((item) => {
                    e.map((id) => {
                        if (item.id == id) {
                            detailInfo.qaRuleNameList.push(item)
                        }
                    })
                })
            }
        }
        this.setState({
            detailInfo,
        })
    }
    handleSearch = (value) => {
        this.getRuleList(value)
    }
    getRuleList = async (value) => {
        let query = {
            needAll: true,
            keyword: value
        }
        let res = await bizRuleSearch(query)
        if (res.code == 200) {
            this.setState({
                ruleList: res.data
            })
        }
    }
    deleteMapColumn = () => {
        let { detailInfo } = this.state
        detailInfo.standardId = undefined
        detailInfo.standardName = ''
        this.setState({
            detailInfo
        })
    }
    openColumnMapModal = () => {
        this.standardMapDrawer&&this.standardMapDrawer.openModal()
    }
    deleteCodeItem = () => {
        let { detailInfo } = this.state
        detailInfo.codeItemName = ''
        detailInfo.refCodeItemId = ''
        detailInfo.codeItemCode = ''
        this.setState({
            detailInfo
        })
    }
    openCodeItemModal = () => {
        this.codeItemModal&&this.codeItemModal.showModal()
    }
    getCodeItem = (data) => {
        let { detailInfo } = this.state
        detailInfo.codeItemName = data.codeItemName
        detailInfo.refCodeItemId = data.refCodeItemId
        detailInfo.codeItemCode = data.codeItemCode
        this.setState({
            detailInfo,
        })
    }
    getColumnMapData = (data) => {
        let { detailInfo } = this.state
        detailInfo.standardId = data.id
        detailInfo.standardName = data.name
        this.setState({
            detailInfo,
        })
    }
    openForeignKeyModal = () => {
        let { detailInfo } = this.state
        let data = []
        if (detailInfo.foreignColumnId) {
            data = [detailInfo.foreignDatabaseId, detailInfo.foreignTableId, detailInfo.foreignColumnId]
        }
        this.foreignKeyColumnDrawer&&this.foreignKeyColumnDrawer.openModal(data, detailInfo.datasourceId)
    }
    getForeignKeyData = (data) => {
        let { detailInfo } = this.state
        detailInfo.foreignDatabaseId = data[0].id
        // detailInfo.databaseName = data[0].name
        detailInfo.foreignTableId = data[1].id
        // detailInfo.tableName = data[1].name
        detailInfo.foreignColumnId = data[2].id
        detailInfo.foreignColumnName = data[0].name + '/' + data[1].name + '/' + data[2].name
        detailInfo.foreignColumnType = data[2].type // 字段类型
        detailInfo.foreignKey = true
        this.setState({
            detailInfo,
        })
    }
    postData = () => {
        let { detailInfo } = this.state
        this.props.getColumnCheckData(detailInfo)
        this.cancel()
    }
    render() {
        const {
            modalVisible,
            detailInfo,
            levelList,
            tagList,
            ruleList,
            dataMaskList,
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'columnCheckDrawer rootCheckModal',
                    title: '新增治理信息',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button onClick={this.postData} type='primary'>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Form className='EditMiniForm Grid1'>
                            {RenderUtil.renderFormItems(
                                [
                                    {
                                        label: '关系模型',
                                        content: <div>
                                            <Checkbox checked={detailInfo.primaryKey} onChange={this.changeSelect.bind(this, 'primaryKey')}>主键</Checkbox>
                                            <Checkbox checked={detailInfo.foreignKey} onChange={this.changeSelect.bind(this, 'foreignKey')}>外键</Checkbox>
                                            {
                                                detailInfo.foreignKey ? <span onClick={this.openForeignKeyModal} className='columnLink'>{detailInfo.foreignColumnName}</span> : null
                                            }
                                        </div>,
                                    },
                                    // {
                                    //     label: '字段安全等级',
                                    //     content: <Select
                                    //         value={detailInfo.securityLevel}
                                    //         onChange={this.changeSelect.bind(this, 'securityLevel')}
                                    //         placeholder='请选择'
                                    //         getPopupContainer={triggerNode => triggerNode.parentNode}
                                    //     >
                                    //         {levelList.map((item) => {
                                    //             return (
                                    //                 <Select.Option key={item.id} value={item.id}>
                                    //                     {item.name}
                                    //                 </Select.Option>
                                    //             )
                                    //         })}
                                    //     </Select>,
                                    // },
                                    // {
                                    //     label: '敏感标签',
                                    //     content: <div className='Grid2' style={{ columnGap: 8, rowGap: 8 }}>
                                    //         <div>
                                    //             <Select
                                    //                 value={detailInfo.desensitiseTagId}
                                    //                 onChange={this.changeSelect.bind(this, 'desensitiseTagId')}
                                    //                 placeholder='敏感标签'
                                    //                 getPopupContainer={triggerNode => triggerNode.parentNode}
                                    //             >
                                    //                 {tagList.map((item) => {
                                    //                     return (
                                    //                         <Select.Option ruleId={item.defaultRuleId} title={item.sensitivityLevelName} key={item.id} value={item.id}>
                                    //                             {item.name}
                                    //                         </Select.Option>
                                    //                     )
                                    //                 })}
                                    //             </Select>
                                    //         </div>
                                    //         <Select
                                    //             value={detailInfo.desensitiseRuleId}
                                    //             onChange={this.changeSelect.bind(this, 'desensitiseRuleId')}
                                    //             placeholder='脱敏规则'
                                    //             getPopupContainer={triggerNode => triggerNode.parentNode}
                                    //         >
                                    //             {dataMaskList.map((item) => {
                                    //                 return (
                                    //                     <Select.Option key={item.id} value={item.id}>
                                    //                         {item.name}
                                    //                     </Select.Option>
                                    //                 )
                                    //             })}
                                    //         </Select>
                                    //         {
                                    //             detailInfo.desensitiseTagId ?
                                    //                 <Form className='MiniForm formDetailInline'>
                                    //                     {RenderUtil.renderFormItems(
                                    //                         [
                                    //                             {
                                    //                                 label: '敏感等级：',
                                    //                                 content: detailInfo.sensitivityLevelName,
                                    //                             },
                                    //                         ],
                                    //                     )}
                                    //                 </Form>
                                    //                 : null
                                    //         }
                                    //     </div>,
                                    // },
                                    {
                                        label: '质量规则',
                                        content: <div>
                                            <Select
                                                mode="multiple"
                                                showSearch
                                                filterOption={false}
                                                onSearch={this.handleSearch}
                                                onChange={this.changeSelect.bind(this, 'qaRuleIdList')}
                                                value={detailInfo.qaRuleIdList}
                                                placeholder='请输入选择'
                                                dropdownClassName='highlightArea'
                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                            >
                                                {
                                                    ruleList.map((item) => {
                                                        return (<Option title={item.ruleName} dataRef={item} key={item.id} value={item.id}><div dangerouslySetInnerHTML={{ __html: item.ruleName }}></div></Option>)
                                                    })
                                                }
                                            </Select>
                                            {
                                                detailInfo.qaRuleNameList.map((item, index) => {
                                                    return (
                                                        <Form className='MiniForm formDetailInline' style={{ marginTop: 8 }}>
                                                            {RenderUtil.renderFormItems(
                                                                [
                                                                    {
                                                                        label: index + 1 + '. 规则编码：',
                                                                        content: item.ruleCode,
                                                                    },
                                                                    {
                                                                        label: '规则类型：',
                                                                        content: item.ruleTypeName,
                                                                    },
                                                                ],
                                                            )}
                                                        </Form>
                                                    )
                                                })
                                            }
                                        </div>,
                                    },
                                    {
                                        label: '标准映射',
                                        content: <div>
                                            {
                                                detailInfo.standardId ?
                                                    <span>
                                                        <a onClick={this.openColumnMapModal}>{detailInfo.standardName}</a>
                                                        <span onClick={this.deleteMapColumn} className="iconfont icon-lajitong"></span>
                                                    </span>
                                                    :
                                                    <a onClick={this.openColumnMapModal}>配置<span className="iconfont icon-you"></span></a>
                                            }
                                        </div>,
                                    },
                                    {
                                        label: '引用代码',
                                        content: <div>
                                            {
                                                detailInfo.refCodeItemId ?
                                                    <span>
                                                        <a onClick={this.openCodeItemModal}>{detailInfo.codeItemCode} {detailInfo.codeItemName}</a>
                                                        <span onClick={this.deleteCodeItem} className="iconfont icon-lajitong"></span>
                                                    </span>
                                                    :
                                                    <a onClick={this.openCodeItemModal}>配置<span className="iconfont icon-you"></span></a>
                                            }
                                        </div>,
                                    },
                                ]
                            )}
                        </Form>
                        <StandardMapDrawer getColumnMapData={this.getColumnMapData} ref={(dom) => this.standardMapDrawer = dom} />
                        <ForeignKeyColumnDrawer getForeignKeyData={this.getForeignKeyData} ref={(dom) => this.foreignKeyColumnDrawer = dom} />
                        <CodeItemModal
                            ref={(dom) => {
                                this.codeItemModal = dom
                            }}
                            getCodeItem={this.getCodeItem}
                        />
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}