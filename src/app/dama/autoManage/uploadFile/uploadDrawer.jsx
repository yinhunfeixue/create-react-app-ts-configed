import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { PaperClipOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Form, message, Radio, Select, Upload } from 'antd'
import { addManualJob } from 'app_api/autoManage'
import { getSourceList } from 'app_api/metadataApi'
import React, { Component } from 'react'
import '../index.less'

const Dragger = Upload.Dragger

export default class UploadFileDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                strategy: 4,
            },
            sourceList: [],
            btnLoading: false,
            fileList: [],
            replaceIndex: 0,
        }
        this.uploadprops = {
            multiple: false,
            customRequest: this.onFileSelected.bind(this),
            onRemove: this.onRemove.bind(this),
            accept: '.txt,.sql',
            fileList: [],
        }
        this.replaceUploadprops = {
            multiple: false,
            accept: '.txt,.sql',
            customRequest: this.onReplaceFileSelected.bind(this),
        }
    }

    openModal = async () => {
        let { addInfo } = this.state
        addInfo = { strategy: 4 }
        this.setState({
            modalVisible: true,
            fileList: [],
            addInfo,
        })
        this.uploadprops.fileList = []
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
    onFileSelected(params) {
        let files = params.file
        console.log(files)
        if (files.size > 1024 * 1024 * 10) {
            message.info('上传的文件不能大于10M')
            return
        }
        this.uploadprops.fileList = [files]
        this.setState({
            fileList: this.uploadprops.fileList,
        })
    }
    onReplaceFileSelected(params) {
        let { replaceIndex } = this.state
        let files = params.file
        if (files.size > 1024 * 1024 * 10) {
            message.info('上传的文件不能大于10M')
            return
        }
        this.uploadprops.fileList[replaceIndex] = files
        this.setState({
            fileList: this.uploadprops.fileList,
        })
    }
    onRemove = (file) => {
        this.setState(({ fileList }) => {
            const index = fileList.indexOf(file)
            const newFileList = fileList.slice()
            newFileList.splice(index, 1)
            this.uploadprops.fileList = newFileList
            return {
                fileList: newFileList,
            }
        })
    }
    postData = async () => {
        let { addInfo, fileList } = this.state
        if (fileList.length < 1) {
            message.info('请选择文件！')
            return
        }
        let formData = new FormData()
        fileList.map((item) => {
            formData.append('file', item)
        })
        formData.append('strategy', addInfo.strategy)
        formData.append('datasourceId', addInfo.datasourceId)
        formData.append('area', 'metadata')
        formData.append('fileTpl', 'dgdl')
        formData.append('jobName', 'DGDL文件采集')
        formData.append('synchronously', true)
        this.setState({ btnLoading: true })
        let res = await addManualJob(formData)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.info('生成中，刷新列表查看')
            this.cancel()
            this.props.search()
        }
    }
    conver = (limit) => {
        var size = ''
        if (limit < 0.1 * 1024) {
            //如果小于0.1KB转化成B
            size = limit.toFixed(2) + 'B'
        } else if (limit < 0.1 * 1024 * 1024) {
            //如果小于0.1MB转化成KB
            size = (limit / 1024).toFixed(2) + 'KB'
        } else if (limit < 0.1 * 1024 * 1024 * 1024) {
            //如果小于0.1GB转化成MB
            size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
        } else {
            //其他转化成GB
            size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
        }

        var sizestr = size + ''
        var len = sizestr.indexOf('.')
        var dec = sizestr.substr(len + 1, 2)
        if (dec == '00') {
            //当小数点后为00时 去掉小数部分
            return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
        }
        return sizestr
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
        const { modalVisible, addInfo, sourceList, fileList, btnLoading } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    title: '文件上传',
                    className: 'addReportDrawer',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!addInfo.datasourceId} loading={btnLoading} onClick={this.postData} type='primary'>
                                上传
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Form className='MiniForm postForm Grid1' style={{ columnGap: 8 }}>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '对应数据源',
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
                                    label: '选择文件',
                                    required: true,
                                    content: (
                                        <div className='dropbox commonUploadFile'>
                                            <Dragger {...this.uploadprops}>
                                                <p className='ant-upload-drag-icon'>
                                                    <UploadOutlined />
                                                </p>
                                                <p className='ant-upload-text'>点击或拖拽文件到此处上传</p>
                                                <p style={{ color: '#9EA3A8' }} className='ant-upload-text'>
                                                    支持上传最大文件大小为：10MB
                                                </p>
                                                <p style={{ color: '#9EA3A8' }} className='ant-upload-text'>
                                                    仅支持sql、txt格式
                                                </p>
                                                <p style={{ color: '#9EA3A8' }} className='ant-upload-text'>
                                                    txt格式建议转为UTF-8统一编码格式
                                                </p>
                                            </Dragger>
                                            {fileList.map((item, index) => {
                                                return (
                                                    <div style={{ display: 'flex', marginTop: 8 }}>
                                                        <div className='fileContent'>
                                                            <PaperClipOutlined />
                                                            <span title={item.name} className='fileName'>
                                                                {item.name}
                                                            </span>
                                                            <span className='fileSize'>（{this.conver(item.size)}）</span>
                                                            <div className='iconfont icon-gou' style={{ fontSize: 16, color: '#339933' }}></div>
                                                        </div>
                                                        <div className='fileBtn'>
                                                            <Upload {...this.replaceUploadprops}>
                                                                <div
                                                                    onClick={() => this.setState({ replaceIndex: index })}
                                                                    className='iconfont icon-shuaxin'
                                                                    style={{ fontSize: 16, color: '#5E6266' }}
                                                                ></div>
                                                            </Upload>
                                                            <div onClick={this.onRemove} className='iconfont icon-lajitong' style={{ fontSize: 16, color: '#5E6266' }}></div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ),
                                },
                                {
                                    label: '上传策略',
                                    required: true,
                                    content: (
                                        <div>
                                            <Radio.Group style={{ marginBottom: 16 }} value={addInfo.strategy} onChange={this.handleInputChange.bind(this, 'strategy')}>
                                                <Radio value={4}>替换更新</Radio>
                                                <Radio value={5}>归并更新</Radio>
                                                <Radio value={2}>全量更新</Radio>
                                            </Radio.Group>
                                            {addInfo.strategy == 4 ? (
                                                <div className='DetailPart'>
                                                    <div style={{ lineHeight: '22px', color: '#5E6266' }}>
                                                        替换更新说明：
                                                        <br />
                                                        1. 系统已存在同样的治理内容，则以当前文档准进行更新
                                                        <br />
                                                        2. 系统中不存在的治理内容，采集进入系统
                                                    </div>
                                                </div>
                                            ) : null}
                                            {addInfo.strategy == 5 ? (
                                                <div className='DetailPart'>
                                                    <div style={{ lineHeight: '22px', color: '#5E6266' }}>
                                                        归并更新说明：
                                                        <br />
                                                        1. 当前治理文件的内容追加到所选数据源下，不影响该数据源中已存在的内容
                                                    </div>
                                                </div>
                                            ) : null}
                                            {addInfo.strategy == 2 ? (
                                                <div className='DetailPart'>
                                                    <div style={{ lineHeight: '22px', color: '#5E6266' }}>
                                                        全量更新说明：
                                                        <br />
                                                        清除掉当前所选系统中已存在的治理内容，以当前文档为准进行更新
                                                        <br />
                                                        <span style={{ color: '#CC0000' }}>注意：全量更新会导致当前数据源下已治理内容清空，且不可恢复，请谨慎操作</span>
                                                    </div>
                                                </div>
                                            ) : null}
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
