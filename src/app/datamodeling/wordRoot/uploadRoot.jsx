import DrawerLayout from '@/component/layout/DrawerLayout';
import RenderUtil from '@/utils/RenderUtil';
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, message, Modal, Radio, Select, Upload } from 'antd';
import { configCategory, rootUpload, templateDownload } from 'app_api/metadataApi';
import React, { Component } from 'react';


const { Dragger } = Upload
const { Option } = Select
const RadioGroup = Radio.Group
const confirm = Modal.confirm

export default class eastUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileInfo: {
                strategy: 0,
            },
            modalVisible: false,
            fileList: [],
            isError: false,
            errorMsg: '',
            loadingStatus: 1,
            categoryList: [],
        }
        this.uploadprops = {
            name: 'file',
            multiple: false,
            accept: '.csv, .txt, .xlsx',
            customRequest: this.onFileSelected.bind(this),
            onRemove: this.onRemove.bind(this),
            fileList: [],
        }
    }
    componentWillMount = () => {
        this.getConfigCategory()
    }
    changeName = (e) => {
        const { fileInfo } = this.state
        fileInfo.name = e.target.value
        this.setState({
            fileInfo,
        })
    }
    getConfigCategory = async () => {
        let res = await configCategory()
        if (res.code == 200) {
            this.setState({
                categoryList: res.data,
            })
        }
    }
    upload = async () => {
        if (!this.state.fileInfo.rootCategory) {
            message.error('请选择词根类别')
            return
        }
        if (!this.state.fileList.length) {
            message.error('请上传文件')
            return
        }
        let formData = new FormData()
        this.state.fileList.map((item) => {
            formData.append('files', item)
        })
        formData.append('category', this.state.fileInfo.rootCategory)
        formData.append('strategy', this.state.fileInfo.strategy)

        if (this.state.fileInfo.strategy == 1) {
            let that = this
            confirm({
                title: '注意：全量策略会导致系统内当前词根类别下的所有词根被清空，且不可恢复，请谨慎操作',
                content: '',
                okText: '确定',
                cancelText: '取消',
                async onOk() {
                    that.setState({
                        modalVisible: true,
                        loadingStatus: 1,
                    })
                    let res = await rootUpload(formData)
                    if (res.code == 200) {
                        that.state.fileInfo.rootCategory = undefined
                        that.setState({
                            // modalVisible: true,
                            isError: false,
                            loadingStatus: 2,
                            fileList: [],
                            fileInfo: that.state.fileInfo,
                            errorMsg: res.data,
                        })
                        that.uploadprops.fileList = []
                    } else {
                        that.setState({
                            isError: true,
                            loadingStatus: 3,
                            errorMsg: res.msg,
                        })
                    }
                },
            })
        } else {
            this.setState({
                modalVisible: true,
                loadingStatus: 1,
            })
            let res = await rootUpload(formData)
            if (res.code == 200) {
                this.state.fileInfo.rootCategory = undefined
                this.setState({
                    isError: false,
                    loadingStatus: 2,
                    fileList: [],
                    fileInfo: this.state.fileInfo,
                    errorMsg: res.data,
                })
                this.uploadprops.fileList = []
            } else {
                this.setState({
                    isError: true,
                    loadingStatus: 3,
                    errorMsg: res.msg,
                })
            }
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    onFileSelected = (params) => {
        console.log(params.file, 'onFileSelected')
        let isRepeated = false
        this.state.fileList.map((item) => {
            if (item.name == params.file.name) {
                isRepeated = true
            }
        })

        if (isRepeated) {
            message.info('文件重复')
            return
        }
        this.state.fileList = [params.file]
        this.uploadprops.fileList = this.state.fileList
        this.setState({
            fileList: this.state.fileList,
        })
        console.log(params.file)
    }
    onRemove = (file) => {
        const { fileList } = this.state
        this.uploadprops.fileList = []
        this.setState({
            fileList: [],
        })
    }
    changeType = (e, node) => {
        const { fileInfo } = this.state
        fileInfo.rootCategory = e
        fileInfo.rootCategoryName = node.props.name
        this.setState({
            fileInfo,
        })
    }
    onRadioChange = (e) => {
        const { fileInfo } = this.state
        fileInfo.strategy = e.target.value
        this.setState({
            fileInfo,
        })
    }
    download = async () => {
        let res = await templateDownload()
    }
    cancelPage = () => {
        this.props.remove('上传词根')
        this.props.addTab('词根库')
    }
    render() {
        const { fileInfo, modalVisible, isError, errorMsg, loadingStatus, categoryList } = this.state
        const { visible, onClose } = this.props
        return (
            <React.Fragment>
                <DrawerLayout
                    drawerProps={{
                        title: '上传词根',
                        visible,
                        onClose,
                    }}
                    renderFooter={() => {
                        return (
                            <Button onClick={this.upload} type='primary'>
                                开始上传
                            </Button>
                        )
                    }}
                >
                    <Form className='EditMiniForm Grid1'>
                        {RenderUtil.renderFormItems([
                            {
                                label: '词根类别',
                                required: true,
                                content: (
                                    <Select onChange={this.changeType} value={fileInfo.rootCategory} placeholder='词根类别'>
                                        {categoryList.map((item) => {
                                            return (
                                                <Option name={item.name} value={item.id} key={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                ),
                            },
                            {
                                label: '上传文件',
                                required: true,
                                content: (
                                    <div>
                                        <Dragger {...this.uploadprops}>
                                            <p className='ant-upload-drag-icon'>
                                                <UploadOutlined />
                                            </p>
                                            <p className='ant-upload-text'>点击或将文件拖拽到此处上传</p>
                                            <p className='ant-upload-text' style={{ fontSize: '14px', color: '#666' }}>
                                                支持上传最大文件大小为：5MB
                                            </p>
                                            <p className='ant-upload-text' style={{ fontSize: '14px', color: '#666' }}>
                                                仅支持xlsx、csv、txt格式
                                            </p>
                                            <p className='ant-upload-text' style={{ fontSize: '14px', color: '#666' }}>
                                                txt格式建议转为UTF-8统一编码格式
                                            </p>
                                        </Dragger>
                                    </div>
                                ),
                                extra: (
                                    <a onClick={this.download}>下载文件模板</a>
                                ),
                            },
                            {
                                label: '上传策略',
                                required: true,
                                content: (
                                    <div>
                                        <RadioGroup onChange={this.onRadioChange} value={fileInfo.strategy}>
                                            <Radio value={0}>增量更新</Radio>
                                            <Radio value={1}>全量</Radio>
                                        </RadioGroup>
                                    </div>
                                ),
                                extra: (
                                    <React.Fragment>
                                        {fileInfo.strategy == 0 ? (
                                            <div className='tip'>
                                                增量更新策略说明：
                                                <br />
                                                文档中存在的词根，如果系统已存在同样词根，则以文档内容为准进行更新
                                                <br />
                                                文档中存在的词根，但是系统中不存在的词根，采集进入系统
                                            </div>
                                        ) : (
                                            <div className='tip'>
                                                全量策略说明：
                                                <br />
                                                删除系统中当前选中词根类别下所有的词根后，以当前上传的文档为准，全量采集进入系统
                                                <br />
                                                <span style={{ color: '#FF5656' }}>注意：全量策略会导致系统内当前词根类别下的所有词根被清空，且不可恢复，请谨慎操作</span>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ),
                            },
                        ])}
                    </Form>
                </DrawerLayout>
                <Modal width={480} visible={modalVisible} className='modelModal' onCancel={this.cancel} footer={null}>
                    <div>
                        <div style={{ textAlign: 'center', margin: '20px 0' }}>
                            {loadingStatus == 1 ? <LoadingOutlined style={{ color: '#1890ff', fontSize: '56px' }} /> : null}
                            {loadingStatus == 2 ? <CheckCircleFilled style={{ color: '#AACC66', fontSize: '56px' }} /> : null}
                            {loadingStatus == 3 ? <CloseCircleFilled style={{ color: '#F26144', fontSize: '56px' }} /> : null}
                            {loadingStatus == 1 ? <div style={{ fontSize: '24px', color: '#333', marginTop: '20px' }}>上传中</div> : null}
                            {loadingStatus == 2 ? <div style={{ fontSize: '24px', color: '#333', marginTop: '20px' }}>上传成功</div> : null}
                            {loadingStatus == 3 ? <div style={{ fontSize: '24px', color: '#333', marginTop: '20px' }}>上传失败</div> : null}
                        </div>
                        <div style={{ color: '#b3b3b3', fontSize: '14px', textAlign: 'center' }}>{loadingStatus == 1 ? '正在上传，请等待' : errorMsg}</div>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}
