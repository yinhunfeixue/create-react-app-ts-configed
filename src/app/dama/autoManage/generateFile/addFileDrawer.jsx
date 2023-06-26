import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Alert, Button, Form, Input, message, Radio, Select } from 'antd'
import { addDgdlGen } from 'app_api/autoManage'
import { getSourceList } from 'app_api/metadataApi'
import React, { Component } from 'react'
import '../index.less'

export default class AddFileDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                isNormative: true,
            },
            sourceList: [],
            btnLoading: false,
        }
    }

    openModal = async () => {
        let { addInfo } = this.state
        addInfo = { isNormative: true, fileName: '' }
        this.setState({
            modalVisible: true,
            addInfo,
        })
        this.getSourceData()
    }
    getSourceData = async () => {
        let res = await getSourceList()
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    postData = async () => {
        let { addInfo } = this.state
        let query = {
            ...addInfo,
            fileTpl: 'dgdlGen',
            jobName: 'DGDL文件生成',
            // area: 'metadata',
            synchronously: true,
        }
        this.setState({ btnLoading: true })
        let res = await addDgdlGen(query)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.info('生成中，刷新列表查看')
            this.cancel()
            this.props.search()
        }
    }
    changeDatasource = (e) => {
        let { addInfo } = this.state
        addInfo.datasourceId = e
        this.setState({
            addInfo,
        })
    }
    handleInputChange = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e.target.value
        this.setState({
            addInfo,
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    render() {
        const { modalVisible, addInfo, sourceList, btnLoading } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    title: '文件生成',
                    className: 'addReportDrawer',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!addInfo.datasourceId || !addInfo.fileName} loading={btnLoading} onClick={this.postData} type='primary'>
                                生成
                            </Button>
                            <Button disabled={btnLoading} onClick={this.cancel}>
                                取消
                            </Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Alert style={{ marginBottom: 16 }} className='ErrorInfo' showIcon message='数据导出需要花费一些时间，申请导出后，请稍后在下载列表中下载导出的数据文件。' type='info' />
                        <Form className='MiniForm postForm Grid1' style={{ columnGap: 8 }}>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '文件名称',
                                    required: true,
                                    content: (
                                        <div>
                                            <Input
                                                placeholder='请输入'
                                                value={addInfo.fileName}
                                                onChange={this.handleInputChange.bind(this, 'fileName')}
                                                maxLength={16}
                                                suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.fileName ? addInfo.fileName.length : 0}/16</span>}
                                            />
                                            <div style={{ color: '#5E6266', lineHeight: '22px', marginTop: 8 }}>
                                                生成的文件名称：由输入的文件名称+导出范围（数据源英文名）+时间戳(yyyyMMddhhmmss）构成
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    label: '导出范围',
                                    required: true,
                                    content: (
                                        <Select showSearch value={addInfo.datasourceId} optionFilterProp='title' placeholder='请选择' onChange={this.changeDatasource}>
                                            {sourceList.map((item) => {
                                                return (
                                                    <Select.Option title={item.dsName} key={item.id} value={item.id}>
                                                        {item.dsName}
                                                    </Select.Option>
                                                )
                                            })}
                                        </Select>
                                    ),
                                },
                                {
                                    label: '规范化要求',
                                    required: true,
                                    content: (
                                        <div>
                                            <Radio.Group value={addInfo.isNormative} onChange={this.handleInputChange.bind(this, 'isNormative')}>
                                                <Radio value={true}>
                                                    规范化导出
                                                    <div style={{ color: '#5E6266', marginBottom: 8 }}>仅导出满足词根规范化检查要求的治理内容</div>
                                                </Radio>
                                                <Radio value={false}>
                                                    非规范化导出
                                                    <div style={{ color: '#5E6266' }}>所选导出范围内所有治理内容导出</div>
                                                </Radio>
                                            </Radio.Group>
                                        </div>
                                    ),
                                },
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
