import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, Switch, Tooltip } from 'antd'
import { checkBusinessName } from 'app_api/intelligentApi'
import { modelTreeWithPaging } from 'app_api/metadataApi'
import { postBusiness } from 'app_api/modelApi'
import NotificationWrap from 'app_common/es/notificationWrap/notificationWrap'
import CommonTreeSelect from 'app_page/dama/component/commonTreeSelect'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import _ from 'underscore'

const TextArea = Input.TextArea

@Form.create()
@observer
class Step1 extends Component {
    constructor() {
        super()
        this.next = _.debounce(this.next, 300)
    }

    componentDidMount() {
        this.init()
    }

    init=() => {
        const { isEdit, store, isDetail } = this.props
        const { detail } = store.param
        console.log(store)
        if (isEdit || isDetail) {
            const { businessTypeName, description, isUseStandard, modelName, modelId, id, metaIndexStatus, indexStatus, latestIndexTime, latestMetaIndexTime, status } = detail
            store.metaIndexStatus = metaIndexStatus
            store.latestMetaIndexTime = latestMetaIndexTime
            store.indexStatus = indexStatus
            store.latestIndexTime = latestIndexTime
            store.businessId = id
            store.modelId = modelId
            store.status = status
            console.log(id)
            this.props.form.setFieldsValue({
                businessTypeName,
                description,
                isUseStandard: isUseStandard,
                modelId: { value: modelId, label: modelName }
            })
        }
    }

    getData = (params, treeNode) => {
        if (!treeNode) {
            return modelTreeWithPaging({ source: 'model' })
        }
        let req = {}
        if (treeNode.props.dataRef.type === 'datasource') {
            req.datasourceId = treeNode.props.dataRef.id.substr(treeNode.props.dataRef.id.lastIndexOf('_') + 1)
        } else if (treeNode.props.dataRef.type === 'system') {
            req.systemId = treeNode.props.dataRef.id.substr(treeNode.props.dataRef.id.lastIndexOf('_') + 1)
        } else if (treeNode.props.dataRef.type === 'database') {
            req.databaseId = treeNode.props.dataRef.id.substr(treeNode.props.dataRef.id.lastIndexOf('_') + 1)
        } else {
            return []
        }
        console.log(req)
        return modelTreeWithPaging({ ...req, page_size: 50, source: 'model' })
    }

    handleTreeSelect=(value, node) => {
        if (node.props.dataRef.type !== 'model') {
            NotificationWrap.warning('请选择最后一层模型层')
            return ({ assert: true })
        }
    }

    getValue = () => this.props.form.getFieldsValue()

    saveData=async () => {
        const { store } = this.props
        let param = this.props.form.getFieldsValue()
        param.modelId = param.modelId.value
        store.modelId = param.modelId
        store.param.detail = { ...store.param.detail, ...param }
        if (param.isUseStandard === undefined) { param.isUseStandard = false }
        if (store.param.detail.type) {
            param.type = store.param.detail.type
        }
        if (this.props.isEdit) { param.id = this.props.detail.id }
        return await postBusiness(param)
    }

    next = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const { store } = this.props
        if (this.props.isDetail) {
            this.props.onCancel && this.props.onCancel()
            this.props.next()
            return
        }
        this.props.form.validateFields(['businessTypeName', 'description', 'modelId'], { force: true }, async (err, value) => {
            console.log(value)
            if (err) {
                return
            }
            let res = await this.saveData()
            if (res.code != 200) {
                NotificationWrap.warning(res.msg)
                return
            }
            store.businessId = res.data
            NotificationWrap.success('操作成功！')
            this.props.onCancel && this.props.onCancel()
            this.props.callback && this.props.callback()
            this.props.next()
        })
    }

    onCancel=() => {
        const { isEdit, isDetail } = this.props
        if (isEdit) {
            // this.props.removeTab('编辑业务')
            this.props.addTab('设置')
        } else if (isDetail) {
            // this.props.removeTab('业务详情')
            this.props.addTab('设置')
        } else {
            // this.props.removeTab('添加业务')
            this.props.addTab('设置')
        }
    }

    nameCheck = async (rule, value, callback) => {
        if (this.props.isEdit) {
            return callback()
        }
        if (!value) {
            return callback()
        }
        let res = await checkBusinessName({ businessTypeName: value })
        if (res.data) {
            console.log(res.data)
            callback('业务名称已存在')
        } else {
            callback()
        }
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        }
        const { getFieldDecorator, getFieldValue } = this.props.form
        const { isDetail, isEdit } = this.props
        return (
            <div>
                <Form>
                    <Form.Item label='业务名称' {...formItemLayout} >
                        {getFieldDecorator('businessTypeName', {
                            rules: [
                                { required: true, message: '请填写业务名称!' },
                                { max: 10, message: '业务名称不得超过10个字符!' },
                                { validator: this.nameCheck }
                            ],
                        })(
                            <Input
                                disabled={isDetail}
                                placeholder='请填写业务名称，不超过10个字符'
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label='业务描述' {...formItemLayout}>
                        {getFieldDecorator('description', {
                            rules: [
                                { max: 100, message: '请填写业务描述与说明，不超过100个字符!' }
                            ],
                        })(
                            <TextArea autosize={{ minRows: 3, maxRows: 6 }}
                                disabled={isDetail}
                                placeholder='请填写业务描述与说明，不超过100个字符'
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label='选择模型' {...formItemLayout}>
                        {getFieldDecorator('modelId', {
                            rules: [
                                { transform: (value) => {
                                    if (value.value === undefined) {
                                        value = undefined
                                        return value
                                    } else {
                                        return value.value
                                    }
                                } },
                                { required: true, message: '请选择需要的模型!' },
                            ],
                        })(
                            <CommonTreeSelect
                                disabled={isDetail || isEdit}
                                getData={this.getData}
                                labelInValue
                                onSelect={this.handleTreeSelect}
                                dropdownStyle={{ height: 400, overflowY: 'scroll' }}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label='取数方式' {...formItemLayout}>
                        {getFieldDecorator('isUseStandard', { valuePropName: 'checked', initialValue: true })(<Switch disabled={isDetail} />)}
                        <span>{getFieldValue('isUseStandard') ? '支持标准项取数' : '不支持标准项取数'}</span>
                        <Tooltip title={
                            <ul>
                                <li>支持标准项取数：利用字段所关联的标准项的中文名组成问句进行取数</li>
                                <li>不支持标准项取数：利用字段在源系统中的中文名组成问句进行取数</li>
                            </ul>
                        } placement='bottom'
                        >
                        <InfoCircleOutlined />
                        </Tooltip>
                    </Form.Item>
                    <Form.Item label=' ' colon={false} {...formItemLayout}>
                        <br />
                        <Button type='primary' onClick={this.next}>
                            下一步
                        </Button>
                        <Button onClick={this.onCancel}>
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default Step1
