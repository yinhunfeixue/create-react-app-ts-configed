import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { PaperClipOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Radio, Select, Upload } from 'antd'
import { getReportList, getSourceList, reportUpload } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import '../index.less'

const { Option } = Select
const Dragger = Upload.Dragger
const tailFormItemLayout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
}

class ReportCollection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            addReportModal: false,
            addInfo: {
                name: '',
                updateType: 0,
            },
            sourceList: [],
            btnLoading: false,
            fileList: [],
            replaceIndex: 0,
        }
        this.columns = [
            {
                title: '任务名称',
                dataIndex: 'name',
                key: 'name',
                minWidth: 240,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '更新方式',
                dataIndex: 'updateType',
                key: 'updateType',
                width: 100,
                render: (text, record) => <span>{text ? '全量' : '增量'}</span>,
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 180,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '分析时长／秒',
                dataIndex: 'analysisTime',
                key: 'analysisTime',
                width: 120,
                render: (text, record) =>
                    text !== undefined ? (
                        <Tooltip placement='topLeft' title={text + 's'}>
                            {text + 's'}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '分析结果',
                dataIndex: 'status',
                key: 'status',
                width: 150,
                ellipsis: true,
                render: (text, record) =>
                    text !== undefined ? (
                        <div>
                            {text == 0 ? <StatusLabel type='loading' message={'分析中（' + record.successCount + '/' + record.allCount + '）'} /> : null}
                            {text == 1 ? <StatusLabel type='success' message={'分析完成（' + record.allCount + '）'} /> : null}
                            {text == 2 ? <StatusLabel type='error' message={'分析失败（' + record.successCount + '/' + record.allCount + '）'} /> : null}
                        </div>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '创建人',
                dataIndex: 'createUser',
                key: 'createUser',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
        this.uploadprops = {
            multiple: true,
            customRequest: this.onFileSelected.bind(this),
            onRemove: this.onRemove.bind(this),
            // accept: '.zip,.7z,.tar,.cpt',
            fileList: [],
        }
        this.replaceUploadprops = {
            multiple: false,
            customRequest: this.onReplaceFileSelected.bind(this),
        }
    }
    componentWillMount = () => {
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
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            pageNo: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
        }
        let res = await getReportList(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
            })
            return {
                total: res.total,
                dataSource: res.data,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo,
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    openDetailPage = (data) => {
        this.props.addTab('报表采集-详情', { ...data })
    }
    openAddPage = () => {
        this.setState({
            addReportModal: true,
            fileList: [],
        })
        this.uploadprops.fileList = []
    }
    cancel = () => {
        this.setState({
            addReportModal: false,
        })
    }
    handleInputChange = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e.target.value
        this.setState({
            addInfo,
        })
    }
    changeDatasource = (e) => {
        let { addInfo } = this.state
        addInfo.datasourceId = e
        this.setState({
            addInfo,
        })
    }
    onFileSelected(params) {
        let files = params.file
        console.log(files)
        this.uploadprops.fileList.push(files)
        this.setState({
            fileList: this.uploadprops.fileList,
        })
    }
    onReplaceFileSelected(params) {
        let { replaceIndex } = this.state
        let files = params.file
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
        this.form.validateFields().then((values) => {
            if (fileList.length < 1) {
                message.info('请选择文件！')
                return
            }
            let formData = new FormData()
            fileList.map((item) => {
                formData.append('file', item)
            })
            formData.append('name', addInfo.name)
            formData.append('updateType', addInfo.updateType)
            formData.append('datasourceId', addInfo.datasourceId)
            this.setState({ btnLoading: true })
            reportUpload(formData).then((res) => {
                this.setState({ btnLoading: false })
                if (res.code == '200') {
                    message.success('上传成功！')
                    this.cancel()
                    this.search()
                }
            })
        })
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
    render() {
        const { queryInfo, tableData, addReportModal, addInfo, sourceList, btnLoading, fileList } = this.state
        return (
            <React.Fragment>
                <div className='reportCollection'>
                    <RichTableLayout
                        title='报表采集'
                        renderHeaderExtra={() => {
                            return (
                                <Button type='primary' onClick={this.openAddPage}>
                                    新增采集
                                </Button>
                            )
                        }}
                        editColumnProps={{
                            width: 90,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a disabled={record.status == 0} onClick={this.openDetailPage.bind(this, record)} key='edit'>
                                        详情
                                    </a>,
                                ]
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                            dataSource: tableData,
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear style={{ width: 280 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入任务名称' />
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'updateType')} value={queryInfo.updateType} placeholder='更新方式' style={{ width: 160 }}>
                                        <Option value={0} key={0}>
                                            增量
                                        </Option>
                                        <Option value={1} key={1}>
                                            全量
                                        </Option>
                                    </Select>
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'status')} value={queryInfo.status} placeholder='分析结果' style={{ width: 160 }}>
                                        <Option key={0} value={0}>
                                            分析中
                                        </Option>
                                        <Option key={1} value={1}>
                                            分析完成
                                        </Option>
                                        <Option key={2} value={2}>
                                            分析失败
                                        </Option>
                                    </Select>
                                    <Button onClick={this.reset}>重置</Button>
                                </React.Fragment>
                            )
                        }}
                        requestListFunction={(page, pageSize, filter, sorter) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                        }}
                    />
                </div>
                <DrawerLayout
                    drawerProps={{
                        title: '新增采集',
                        className: 'addReportDrawer',
                        width: 480,
                        visible: addReportModal,
                        onClose: this.cancel,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button loading={btnLoading} onClick={this.postData} type='primary'>
                                    确定
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                >
                    {addReportModal && (
                        <React.Fragment>
                            <Form style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 24, paddingBottom: 30 }} className='EditMiniForm ruleForm' ref={(target) => (this.form = target)}>
                                <Form.Item
                                    label='任务名称'
                                    {...tailFormItemLayout}
                                    name='name'
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入任务名称!',
                                        },
                                        {
                                            max: 64,
                                            message: '名称不能超过64个字符!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='请输入'
                                        onChange={this.handleInputChange.bind(this, 'name')}
                                        suffix={<span style={{ color: addInfo.name.length > 64 ? 'red' : '#C4C8CC' }}>{addInfo.name.length}/64</span>}
                                    />
                                </Form.Item>
                                <Form.Item required label='更新方式' {...tailFormItemLayout}>
                                    <Radio.Group value={addInfo.updateType} onChange={this.handleInputChange.bind(this, 'updateType')}>
                                        <Radio value={0}>增量</Radio>
                                        <Radio value={1}>全量</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    label='数据源'
                                    {...tailFormItemLayout}
                                    name='datasourceId'
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入数据源!',
                                        },
                                    ]}
                                >
                                    <Select showSearch optionFilterProp='title' placeholder='数据源' onChange={this.changeDatasource}>
                                        {sourceList.map((item) => {
                                            return (
                                                <Select.Option title={item.identifier} key={item.id} value={item.id}>
                                                    {item.identifier}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item required label='选择文件' {...tailFormItemLayout}>
                                    <div className='dropbox commonUploadFile' style={{ height: 160 }}>
                                        <Dragger {...this.uploadprops}>
                                            <p className='ant-upload-drag-icon'>
                                                <UploadOutlined />
                                            </p>
                                            <p className='ant-upload-text'>点击或拖拽文件到此处上传</p>
                                            <p style={{ color: '#9EA3A8' }} className='ant-upload-text'>
                                                支持上传最大文件大小为：10MB
                                            </p>
                                            <p style={{ color: '#9EA3A8' }} className='ant-upload-text'>
                                                仅支持.cpt、.jrxml格式
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
                                </Form.Item>
                            </Form>
                        </React.Fragment>
                    )}
                </DrawerLayout>
            </React.Fragment>
        )
    }
}
export default ReportCollection
