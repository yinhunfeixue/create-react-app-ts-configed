// 样例预览
import EmptyLabel from '@/component/EmptyLabel'
import { Form, message, Modal, Spin } from 'antd'
import { columnSampling } from 'app_api/dataSecurity'
import React, { Component } from 'react'
import './previewModal.less'

export default class PreviewModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            previewModalVisible: false,
            previewLoading: false,
            previewInfo: {},
            previewList: [],
            ruleName: '',
        }
    }
    openModal = async (data) => {
        await this.setState({
            previewModalVisible: true,
            previewInfo: { ...data },
        })
        this.getPreviewData(data)
    }
    cancel = () => {
        this.setState({
            previewModalVisible: false,
        })
    }
    getPreviewData = async (data) => {
        let query = {
            columnIdList: [data.columnId],
            planCount: 100,
            sampleReasonCode: 'DATA_PREVIEW',
        }
        this.setState({ previewLoading: true })
        let res = await columnSampling(query)
        this.setState({ previewLoading: false })
        if (res.code == 200) {
            this.setState({
                previewList: res.data ? res.data[0].columnSample : [],
                ruleName: res.data ? res.data[0].ruleName : '',
            })
        }
    }
    render() {
        const { previewModalVisible, previewLoading, previewInfo, previewList, ruleName } = this.state
        return (
            <Modal title='样例预览' className='dataMaskPreviewModal' visible={previewModalVisible} onCancel={this.cancel} footer={null}>
                {previewModalVisible && (
                    <React.Fragment>
                        <h4 style={{ color: '#2D3033', fontWeight: '400', marginBottom: 12 }}>敏感标签：{ruleName || <EmptyLabel />}</h4>
                        <Spin spinning={previewLoading}>
                            <Form className='MiniForm DetailPart FormPart' layout='inline'>
                                {previewList.map((item, index) => {
                                    return (
                                        <div className='previewItem'>
                                            <span className='LbOrder'>{index + 1}</span>
                                            <span>{item}</span>
                                        </div>
                                    )
                                })}
                                {!previewList.length ? <div style={{ color: '#9EA3A8', textAlign: 'center', height: 100, lineHeight: '100px' }}>暂无数据</div> : null}
                            </Form>
                        </Spin>
                    </React.Fragment>
                )}
            </Modal>
        )
    }
}
