import DrawerLayout from '@/component/layout/DrawerLayout'
import TipLabel from '@/component/tipLabel/TipLabel'
import { UploadOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input, message, Radio, Select, Upload } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { addManualJob } from 'app_api/metadataApi'
import CONSTANTS from 'app_constants'
import React, { Component } from 'react'
import _ from 'underscore'

const RadioGroup = Radio.Group

const Dragger = Upload.Dragger

const fillModalMap = {
    metadata: '数据源采集模板',
    lineageRelation: '字段血缘关系采集模板',
    physicalCode: '源系统代码采集',
    relationData: '表间关系采集模板',
}
/**
 * editHandCollection
 */
class editHandCollection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList: [], // 上传的文件
            loading: false,
        }
        this.typeOpr = ''
        this.uploadprops = {
            customRequest: this.onFileSelected.bind(this),
            onRemove: this.onRemove.bind(this),
            accept: '.xlsx,.xls',
            fileList: [],
        }
    }

    componentWillMount() {
        // 判断是否为空对象，空对象代表新增，否则为代表修改
        if (JSON.stringify(this.param) === '{}') {
            this.typeOpr = 'add'
        }
    }

    onFileSelected(params) {
        this.file = params.file
        this.uploadprops.fileList = [params.file]
        this.setState({
            fileList: [params.file],
        })
    }

    onRemove() {
        this.setState(({ fileList }) => {
            return { fileList: [] }
        })
        this.uploadprops.fileList = []
    }
    onClose = () => {
        this.uploadprops.fileList = []
        this.setState({
            fileList: [],
        })
        this.props.onClose()
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { onSuccess } = this.props
        this.form.validateFields().then((values) => {
            if (this.state.fileList.length < 1) {
                message.warning('请选择文件！')
                return
            }
            this.setState({
                loading: true,
            })
            let req = values
            req.uploadfile = this.state.fileList[0]
            req.area = 'metadata'
            addManualJob(req).then((res) => {
                if (res.code == '200') {
                    message.success(res.msg ? res.msg : '添加成功')
                    onSuccess()
                } else {
                    message.error(res.msg ? res.msg : '添加失败')
                }
                this.setState({
                    loading: false,
                })
            })
        })
    }

    render() {
        const { loading } = this.state
        const { visible, onClose } = this.props
        return (
            <DrawerLayout
                drawerProps={{
                    title: '新增模板采集',
                    visible,
                    width: 480,
                    destroyOnClose: true,
                    onClose: this.onClose,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button type='primary' onClick={_.debounce(this.handleSubmit, CONSTANTS.TIME_OUT)} loading={loading}>
                                确定
                            </Button>
                            <Button onClick={this.onClose} disabled={loading}>
                                取消
                            </Button>
                        </React.Fragment>
                    )
                }}
            >
                <Alert showIcon type='warning' message='点击【完成】，系统将保存任务，并在资源空闲时执行。采集结果请在采集日志中查看。' />
                <Form className='EditMiniForm Grid1' autoComplete='off' ref={(target) => (this.form = target)}>
                    <FormItem
                        label='任务名称'
                        name='jobName'
                        rules={[
                            {
                                required: true,
                                message: '请输入任务名称!',
                            },
                        ]}
                    >
                        <Input placeholder='请输入任务名称' />
                    </FormItem>
                    <FormItem
                        label='文件模板'
                        name='fileTpl'
                        rules={[
                            {
                                required: true,
                                message: '请选择文件模板!',
                            },
                        ]}
                    >
                        <Select placeholder='请选择文件模板'>
                            {_.map(fillModalMap, (node, index) => {
                                return (
                                    <Option key={index} value={index}>
                                        {node}
                                    </Option>
                                )
                            })}
                        </Select>
                    </FormItem>

                    <FormItem
                        name='strategy'
                        rules={[
                            {
                                required: true,
                                message: '请选择入库策略!',
                            },
                        ]}
                        label={
                            <TipLabel
                                label='入库策略'
                                tip={
                                    <div>
                                        <div>◆ 增量：仅插入和更新文档中的数据;</div>
                                        <div>◆ 激进全量：删除所有的历史数据及其关系，然后将文档中的数据采集进系统;</div>
                                        <div>◆ 保守全量：删除所有的历史数据，但是不删除关系，然后将文档中的数据采集进系统</div>
                                    </div>
                                }
                            />
                        }
                    >
                        <RadioGroup>
                            <Radio value='1'>保守全量</Radio>
                            <Radio value='2'>激进全量</Radio>
                            <Radio value='3'>增量</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label='选择文件' required>
                        <div className='dropbox'>
                            <Dragger {...this.uploadprops}>
                                <p className='ant-upload-drag-icon'>
                                    <UploadOutlined />
                                </p>
                                <p className='ant-upload-text'>请点击或拖拽进行上传！</p>
                            </Dragger>
                        </div>
                    </FormItem>
                </Form>
            </DrawerLayout>
        )
    }
}

export default editHandCollection
