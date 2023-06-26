import React, { Component } from 'react'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { Tabs, Tooltip, Form, Divider } from 'antd'
import { SelectOutlined, CheckCircleFilled } from '@ant-design/icons'
import StandardCheck from './standard'
import SensitiveTagCheck from './sensitiveTag'
import RuleCheck from './rule'
import SecurityLevelCheck from './securityLevel'
import CategoryCheck from './category'
import CodeItemCheck from './codeItem'
import '../../index.less'

const TabPane = Tabs.TabPane
export default class CheckDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {},
            tabValue: '0',
        }
    }
    getData = (data) => {
        let tabValue = '0'
        if (data.lvlCount) {
            tabValue = '5'
        }
        if (data.codeCount) {
            tabValue = '4'
        }
        if (data.clzCount) {
            tabValue = '3'
        }
        if (data.senCount) {
            tabValue = '2'
        }
        if (data.qltCount) {
            tabValue = '1'
        }
        if (data.stdCount) {
            tabValue = '0'
        }
        this.setState({
            detailInfo: {...data},
            tabValue
        })
    }
    openModal = (data) => {
        this.setState({
            modalVisible: true,
        })
        this.getData(data)
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
        this.props.reload()
    }
    changeTab = (e) => {
        this.setState({
            tabValue: e,
        })
    }
    getTotal = (name, total) => {
        let { detailInfo } = this.state
        detailInfo[name] = total
        console.log(total, detailInfo, 'reload')
        if (total) {
            this.setState({
                detailInfo
            })
        } else {
            this.getData(detailInfo)
        }
    }
    reload = () => {
        // this.props.reload()
    }
    openTableDetail = (id) => {
        this.props.addTab('sysDetail', { id: id }, true)
    }
    render() {
        const {
            modalVisible,
            detailInfo,
            tabValue
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'checkDrawer',
                    title: '审核',
                    width: 960,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        {
                            detailInfo.stdCount || detailInfo.qltCount || detailInfo.senCount || detailInfo.clzCount || detailInfo.codeCount || detailInfo.lvlCount ?
                                <div>
                                    <div className='OverView'>
                                        <div className='OverViewTitle'>
                                            <Tooltip placement="topLeft" title={detailInfo.tableName}>{detailInfo.tableName}</Tooltip>
                                            <Tooltip title='表详情'><SelectOutlined onClick={this.openTableDetail.bind(this, detailInfo.tableId)} style={{ fontSize: '14px', cursor: 'pointer', color: '#4D73FF', marginLeft: 8 }} /></Tooltip>
                                        </div>
                                        <Form className='MiniForm'>
                                            <div className='HControlGroup'>
                                                {[
                                                    {
                                                        label: '中文名',
                                                        content: detailInfo.tableNameCn,
                                                    },
                                                    {
                                                        label: '来源库',
                                                        content: detailInfo.dataBaseName,
                                                    },
                                                    {
                                                        label: '数据源',
                                                        content: detailInfo.datasourceName,
                                                    },
                                                ].map((item) => {
                                                    return (
                                                        <div key={item.label} className='detailInfo'>
                                                            <label>{item.label}</label>
                                                            <span>{item.content}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </Form>
                                    </div>
                                    <Divider style={{ margin: '0 24px 8px 24px' }}/>
                                    <Tabs activeKey={tabValue} onChange={this.changeTab}>
                                        {
                                            detailInfo.stdCount ?
                                                <TabPane tab={'数据标准（' + detailInfo.stdCount + '）'} key='0'>
                                                    {
                                                        tabValue == '0' ? <StandardCheck addTab={this.props.addTab} reload={this.reload} getTotal={this.getTotal} detailInfo={detailInfo}/> : null
                                                    }
                                                </TabPane>
                                                : null
                                        }
                                        {
                                            detailInfo.qltCount ?
                                                <TabPane tab={'质量规则（' + detailInfo.qltCount + '）'} key='1'>
                                                    {
                                                        tabValue == '1' ? <RuleCheck addTab={this.props.addTab} reload={this.reload} getTotal={this.getTotal} detailInfo={detailInfo}/> : null
                                                    }
                                                </TabPane>
                                                : null
                                        }
                                        {/* {
                                            detailInfo.senCount ?
                                                <TabPane tab={'敏感数据（' + detailInfo.senCount + '）'} key='2'>
                                                    {
                                                        tabValue == '2' ? <SensitiveTagCheck addTab={this.props.addTab} reload={this.reload} getTotal={this.getTotal} detailInfo={detailInfo}/> : null
                                                    }
                                                </TabPane>
                                                : null
                                        } */}
                                        {
                                            detailInfo.clzCount ?
                                                <TabPane tab={'数据分类（' + detailInfo.clzCount + '）'} key='3'>
                                                    {
                                                        tabValue == '3' ? <CategoryCheck addTab={this.props.addTab} reload={this.reload} getTotal={this.getTotal} detailInfo={detailInfo}/> : null
                                                    }
                                                </TabPane>
                                                : null
                                        }
                                        {
                                            detailInfo.codeCount ?
                                                <TabPane tab={'代码项（' + detailInfo.codeCount + '）'} key='4'>
                                                    {
                                                        tabValue == '4' ? <CodeItemCheck addTab={this.props.addTab} reload={this.reload} getTotal={this.getTotal} detailInfo={detailInfo}/> : null
                                                    }
                                                </TabPane>
                                                : null
                                        }
                                        {
                                            detailInfo.lvlCount ?
                                                <TabPane tab={'安全分类分级（' + detailInfo.lvlCount + '）'} key='5'>
                                                    {
                                                        tabValue == '5' ? <SecurityLevelCheck addTab={this.props.addTab} reload={this.reload} getTotal={this.getTotal} detailInfo={detailInfo}/> : null
                                                    }
                                                </TabPane>
                                                : null
                                        }
                                    </Tabs>
                                </div>
                                :
                                <div style={{ textAlign: 'center', paddingTop: 80 }}>
                                    <CheckCircleFilled style={{ color: '#28AE52', fontSize: '50px' }} />
                                    <div style={{ fontSize: '24px', margin: '24px 0 8px 0' }}>审核完成</div>
                                    <div style={{ fontSize: '16px', color: '#5E6266' }}>审核信息在审核记录页查看</div>
                                </div>
                        }

                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}