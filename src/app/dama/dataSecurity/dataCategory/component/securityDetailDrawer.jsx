import DrawerLayout from '@/component/layout/DrawerLayout'
import LevelTag from '@/component/LevelTag'
import TipLabel from '@/component/tipLabel/TipLabel'
import RenderUtil from '@/utils/RenderUtil'
import { Divider, Form } from 'antd'
import { dataSecurityLevelList } from 'app_api/dataSecurity'
import React, { Component } from 'react'
import '../index.less'

export default class SecurityDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {},
            levelList: [],
        }
    }
    openModal = (data) => {
        let detailInfo = JSON.parse(JSON.stringify(data))
        detailInfo.columnCnNames = detailInfo.columnCnNames && detailInfo.columnCnNames !== undefined ? detailInfo.columnCnNames.split(',') : []
        detailInfo.columnEnNames = detailInfo.columnEnNames && detailInfo.columnEnNames !== undefined ? detailInfo.columnEnNames.split(',') : []
        this.setState({
            modalVisible: true,
            detailInfo,
        })
        this.getDataSecurityLevelList()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    getDataSecurityLevelList = async () => {
        let res = await dataSecurityLevelList()
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = parseInt(item.id)
            })
            this.setState({
                levelList: res.data,
            })
        }
    }
    getLevelDesc = (value) => {
        let { levelList } = this.state
        for (let i = 0; i < levelList.length; i++) {
            if (levelList[i].id == value) {
                return levelList[i].name
            }
        }
    }
    render() {
        const { modalVisible, detailInfo } = this.state
        const formItemProps = {
            labelCol: { span: 6 },
        }
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'securityDetailDrawer',
                    title: detailInfo.businessTag !== 2 ? '分类详情' : '特征详情',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true,
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div className='titleArea'>
                            <div className='titleValue'>
                                {detailInfo.businessTag !== 2 ? <span style={{ color: '#F7B500', marginRight: 8 }} className='iconfont icon-wenjian1'></span> : null}
                                {detailInfo.name}
                            </div>
                            {detailInfo.description ? <div className='description'>{detailInfo.description}</div> : null}
                        </div>
                        {detailInfo.businessTag !== 2 && detailInfo.securityLevel ? (
                            <div>
                                <Divider style={{ marginTop: 16 }} />
                                <Form className='HMiniForm' colon={false}>
                                    <h3>基本信息</h3>
                                    {RenderUtil.renderFormItems(
                                        [
                                            {
                                                label: '安全等级',
                                                content: detailInfo.securityLevel ? <LevelTag value={detailInfo.securityLevel} /> : null,
                                            },
                                        ],
                                        { ...formItemProps }
                                    )}
                                </Form>
                            </div>
                        ) : null}
                        {detailInfo.businessTag == 2 ? (
                            <div>
                                <Divider style={{ marginTop: 16 }} />
                                <Form className='HMiniForm' colon={false}>
                                    <h3>基本信息</h3>
                                    {RenderUtil.renderFormItems(
                                        [
                                            {
                                                label: '状态',
                                                content: (
                                                    <div>
                                                        {detailInfo.status ? (
                                                            <div>
                                                                <span style={{ background: '#28AE52' }} className='statusDot'></span>启用
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <span className='statusDot' style={{ background: '#CC0000' }}></span>禁用
                                                            </div>
                                                        )}
                                                    </div>
                                                ),
                                            },
                                            {
                                                label: '安全等级（默认）',
                                                content: detailInfo.securityLevel ? <LevelTag value={detailInfo.securityLevel} /> : null,
                                            },
                                            {
                                                label: '安全等级（融合）',
                                                content: detailInfo.polymerLevel ? <LevelTag value={detailInfo.polymerLevel} /> : null,
                                            },
                                            {
                                                label: '敏感标签',
                                                content: detailInfo.tagName ? (
                                                    <div>
                                                        {detailInfo.tagName} 【敏感级别：{detailInfo.tagLvlName}】
                                                    </div>
                                                ) : null,
                                            },
                                        ],
                                        { ...formItemProps }
                                    )}
                                </Form>
                                <Divider />
                                <Form className='HMiniForm' colon={false}>
                                    <h3>识别规则（同时满足以下条件即命中规则）</h3>
                                    {RenderUtil.renderFormItems(
                                        [
                                            {
                                                label: <TipLabel label='字段中文名识别' tip='识别信息为中文名和字段注释信息' />,
                                                content: detailInfo.columnCnNames.length ? (
                                                    <div className='tagArea'>
                                                        {detailInfo.columnCnNames &&
                                                            detailInfo.columnCnNames.map((item) => {
                                                                return <span>{item}</span>
                                                            })}
                                                    </div>
                                                ) : (
                                                    ''
                                                ),
                                            },
                                            {
                                                label: '字段英文名识别',
                                                content: detailInfo.columnEnNames.length ? (
                                                    <div className='tagArea'>
                                                        {detailInfo.columnEnNames &&
                                                            detailInfo.columnEnNames.map((item) => {
                                                                return <span>{item}</span>
                                                            })}
                                                    </div>
                                                ) : (
                                                    ''
                                                ),
                                            },
                                            {
                                                label: '数据内容识别',
                                                content:
                                                    detailInfo.sampleVerifyType == 0 ? (
                                                        <span style={{ color: '#c4c8cc' }}>-</span>
                                                    ) : (
                                                        <React.Fragment>
                                                            <span style={{ lineHeight: '32px' }}>{detailInfo.sampleVerifyType == 1 ? '正则匹配' : '算法函数'}</span>
                                                            <div className='expArea'>
                                                                {detailInfo.sampleVerifyType == 1 ? <div>正则表达式：{detailInfo.regex}</div> : <div>算法函数：{detailInfo.algFuncName}</div>}
                                                                <span style={{ marginRight: 40 }}>扫描数据量：{detailInfo.sampleSize}</span>
                                                                <span>命中率： {detailInfo.hitRate}%</span>
                                                            </div>
                                                        </React.Fragment>
                                                    ),
                                            },
                                        ],
                                        { ...formItemProps }
                                    )}
                                </Form>
                            </div>
                        ) : null}
                        <Divider />
                        <Form className='HMiniForm' colon={false}>
                            <h3>其他信息</h3>
                            {RenderUtil.renderFormItems(
                                [
                                    {
                                        label: '创建人',
                                        content: detailInfo.createUser,
                                    },
                                    {
                                        label: '创建时间',
                                        content: detailInfo.createTime,
                                    },
                                ],
                                { ...formItemProps }
                            )}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
