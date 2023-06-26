import DrawerLayout from '@/component/layout/DrawerLayout'
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { Alert, Form, Input, Radio, Select, Upload } from 'antd'
import { observer } from 'mobx-react'
import {} from '@ant-design/icons'
import React from 'react'
import _ from 'underscore'
// import './style.less'
import store from './store'
import { downloadExeclTemplate } from 'app_api/standardApi'
import { Button } from 'lz_antd'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

//key值对应文件目录name 需要对应修改
const fileTplMap = {
    basicsStandardNew: '01_基础数据标准模板',
    targetStandard: '02_指标数据标准模板',
    codeStandardNew: '03_标准代码项采集模板',
    standardFieldMapping: '04_标准-字段映射关系采集模板',
    standardMapping: '05_标准-指标映射关系采集模板',
    codeStandardMapping: '06_源系统代码值和标准代码值映射模板',
}
const strategyMap = {
    // "1":"全量",
    // "2":"激进全量",
    3: '增量',
}
@observer
class SearchTool extends React.Component {
    constructor() {
        super()
        this.handleSubmit = _.debounce(this.handleSubmit, 300)
        this.state = {
            fileTplValue: null,
        }
    }
    componentDidMount() {
        // To disabled submit button at the beginning.
    }
    // 上传
    normFile = (e) => {
        console.log('Upload event:', e)
        if (Array.isArray(e)) {
            return e
        }
        return e && e.fileList
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.form.validateFields().then((values) => {
            console.log("valuesvaluesvalues", values)
            store.addForm({ ...values, area: 'standard' }).then(() => {
                this.props.onSuccess()
            })
        })
    }
    // 取消方法
    onCancel = () => {
        this.setState({fileTplValue: null})
        store.addTask()
        store.onRemove()
    }
    // 文件选中
    onFileSelected = (params) => {
        store.onFileSelected(params)
    }

    fileTplChange = (value) => {
        this.setState({ fileTplValue: value })
    }

    onDownLoad = () => {
        const { fileTplValue } = this.state
        if (['basicsStandardNew', 'codeStandardNew'].indexOf(fileTplValue) > -1) {
            downloadExeclTemplate({ metaModel: fileTplValue === 'basicsStandardNew' ? 1 : 2 })
        } else {
            const url = `../../../../../resources/template/standardAcquisitionTemplates/${fileTplValue}.xlsx`
            const eleLink = document.createElement('a');
            eleLink.style.display = 'none';
            eleLink.href = url;
            eleLink.download = fileTplMap[fileTplValue]
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
        }
    }

    render() {
        const { visible } = this.props
        const { fileTplValue } = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        }
        return (
            <DrawerLayout
                drawerProps={{
                    visible,
                    width: 480,
                    title: '新增标准采集',
                    onClose: this.onCancel,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button type='primary' onClick={this.handleSubmit}>
                                确定
                            </Button>
                            <Button onClick={this.onCancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                <Alert showIcon message='入库策略说明：增量，仅仅insert和update文档中的数据' type='warning' />
                <Form
                    ref={(target) => (this.form = target)}
                    className='EditMiniForm Grid1'
                    initialValues={{
                        strategy: '3',
                    }}
                >
                    <FormItem label='任务名称' message name='jobName' rules={[{ required: true, message: '请输入任务名称!' }]}>
                        <Input placeholder='输入名称' autoComplete='off' maxLength={32} />
                    </FormItem>

                    <FormItem label='文件模板' message name='fileTpl' rules={[{ required: true, message: '请选择基础数据采集模板!' }]}>
                        <Select onChange={this.fileTplChange} placeholder='请选择文件模板' style={{ width: '100%' }}>
                            {_.map(fileTplMap, (item, key) => {
                                return (
                                    <Option key={key} value={key}>
                                        {item}
                                    </Option>
                                )
                            })}
                        </Select>
                    </FormItem>
                    {fileTplValue && (
                        <Button authId='template:download' style={{ width: 110 }} icon={<DownloadOutlined />} onClick={this.onDownLoad} type='primary' ghost>
                            模板下载
                        </Button>
                    )}

                    <FormItem message label='入库策略' name='strategy' rules={[{ required: true, message: '请选择入库策略!' }]}>
                        <RadioGroup>
                            {_.map(strategyMap, (item, key) => {
                                return (
                                    <Radio key={key} value={key}>
                                        {item}
                                    </Radio>
                                )
                            })}
                        </RadioGroup>
                    </FormItem>

                    <FormItem message label='选择文件' name='uploadfile' valuePropName='fileListValue' getValueFromEvent={this.normFile}>
                        <div className='dropbox'>
                            <Upload.Dragger name='file' listType='text' customRequest={this.onFileSelected} {...store.uploadprops}>
                                <p className='ant-upload-drag-icon'>
                                    <UploadOutlined />
                                </p>
                                <p className='ant-upload-text'>请点击或拖拽进行上传！</p>
                            </Upload.Dragger>
                        </div>
                    </FormItem>
                </Form>
            </DrawerLayout>
        )
    }
}

export default SearchTool
