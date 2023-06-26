/*
 * @LastEditTime: 2020-08-04 17:18:23
 * @LastEditors: Please set LastEditors
 * @Description: 血缘脚本文件上传页面
 */
import DrawerLayout from '@/component/layout/DrawerLayout'
import TipLabel from '@/component/tipLabel/TipLabel'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Radio, Select, Spin, TreeSelect, Upload } from 'antd'
import { getUserList } from 'app_api/manageApi'
import { getMetadataTree, postLineageExtractjob } from 'app_api/metadataApi'
import CONSTANTS from 'app_constants'
import React, { Component } from 'react'
import _ from 'underscore'

const Dragger = Upload.Dragger
const FormItem = Form.Item
const RadioGroup = Radio.Group
const { TextArea } = Input

const TreeNode = TreeSelect.TreeNode

const strategyObj = [
    // {
    //     value: 0,
    //     text: '删除',
    //     desc: '通过检测sql去把曾经建立的关系删掉。'
    // },
    {
        value: 1,
        text: '保守全量',
        desc: '保留曾经修改过的血缘关系，删除未修改过的血缘关系，全量更新sql文件中的血缘关系。',
    },
    {
        value: 2,
        text: '激进全量',
        desc: '删除所有修改过或未修改的血缘关系，全量更新sql文件中的血缘关系。',
    },
    {
        value: 3,
        text: '增量更新',
        desc: '保留曾经修改过和未修改过的血缘关系，增加新的关系。',
    },
    {
        value: 4,
        text: '替换',
        desc: '将sql文件中insert的表中所有历史关系删除，然后替换为本次sql文件中的关系。',
    },
]

const fielFormatList = [
    {
        value: 'SQLScript',
        name: 'SQLScript',
        desc: 'select aa, b, c from x join y on x.aa = y.b；\n 其中，hive和impala不支持多条SQL',
    },
    // {
    //     value: 'SQLBatch',
    //     name: 'SQLBatch',
    //     desc: '{\n "storageType":"hive",\n "defaultSchema": "schemaname",\n "tableSqlList":[\n { \n "table":"table1", \n "sql":"select aa, b, c from x join y on x.aa = y.b"\n },\n { \n "table":null,\n "sql":"insert into table aaa(aa, bb) select aa, b from table1"\n  } \n ]\n }'
    // }
]

const typeList = [
    {
        value: 'HiveSQL',
        name: 'HiveSQL',
    },
    {
        value: 'PLSQL',
        name: 'PLSQL',
    },
    {
        value: 'impala',
        name: 'impala',
    },
    {
        value: 'DB2',
        name: 'DB2',
    },
    {
        value: 'MySQL',
        name: 'MySQL',
    },
    {
        value: 'Kettle',
        name: 'Kettle',
    },
    {
        value: 'DataStage',
        name: 'DataStage',
    },
    {
        value: 'GP',
        name: 'GP',
    },
    {
        value: 'teradata',
        name: 'teradata',
    },
    {
        value: 'ODPS',
        name: 'ODPS',
    },
]

const suffixStyle = {
    position: 'relative',
    bottom: '20px',
    //userSelect:'none',
    left: '-40px',
}

class BloodUpdateForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            treeSelectValue: '',
            fileList: [], // 上传的文件
            loading: false,
            descText: '',
            nameText: '',
            treeData: [],
            userList: [],
        }

        this.fileList = []

        this.uploadprops = {
            multiple: true,
            customRequest: this.onFileSelected.bind(this),
            onRemove: this.onRemove.bind(this),
            accept: '.zip,.7z,.tar,.json,.txt',
            fileList: [],
        }
        this.isOnComposition = false
        this.emittedInput = true
    }

    componentDidMount() {
        this.getMetadataTree()
        this.getUserData()
    }
    getUserData = async () => {
        let res = await getUserList({ page: 1, page_size: 99999, brief: false })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }

    getMetadataTree = () => {
        getMetadataTree({ code: 'XT001' }).then((res) => {
            if (res.code == '200') {
                this.setState({
                    treeData: [res.data],
                })
            }
        })
    }

    onFileSelected(params) {
        let files = params.file
        if (files.size > 1024 * 1024 * 5) {
            message.info('上传的文件不能大于5M')
            return
        }
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
        // let fname = files.name.split('.')
        // // console.log(files, '--------filesfiles-------')
        // if( fname[0].length > 100 ){
        //     files['status'] = 'error'
        //     files['response'] = '文件名称超过100个字符'
        // }

        this.uploadprops.fileList.push(files)
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

    handleSubmit = (e) => {
        e.preventDefault()
        this.form.validateFields().then((values) => {
            if (this.state.treeSelectValue === '') {
                message.warning('请选择数据源！')
                return
            }

            if (this.state.fileList.length < 1) {
                message.warning('请选择文件！')
                return
            }

            this.setState({
                loading: true,
            })
            if (!values.description || values.description == '') {
                values.description = ''
            }
            let req = values
            req.uploadfile = this.state.fileList
            req.datasource = this.state.treeSelectValue
            req.jobType = 1
            req.owner = req.owner ? req.owner : ''
            postLineageExtractjob(req).then((res) => {
                if (res.code == '200') {
                    message.success('上传成功！')
                    this.close()
                } else {
                    message.error(this.renderMessage(res.msg))
                }
                this.setState({
                    loading: false,
                })
            })
        })
    }

    close() {
        const { onClose } = this.props
        if (onClose) {
            onClose()
        }
    }

    renderMessage = (msg) => {
        return <div dangerouslySetInnerHTML={{ __html: msg }} style={{ width: '300px' }}></div>
    }

    parentTreeIdChange = (e) => {
        if (e.triggerNode && (e.triggerNode.props.path == 1 || e.triggerNode.props.path == 2)) {
            message.warning('请选择最后一层的数据源!')
            this.setState({
                treeSelectValue: '',
            })
        } else {
            this.setState({
                treeSelectValue: e.triggerNode ? e.triggerNode.props.value : '',
            })
        }
    }

    chengeType = (e) => {
        const { value } = e.target
        this.form.setFieldsValue({
            fileFormat: 'SQLScript',
        })
    }

    handleChange = (field, e) => {
        if (!this.isOnComposition) {
            this.emittedInput = true
        } else {
            this.emittedInput = false
            return
        }

        this.setState({ [field]: e.target.value })
    }

    handleComposition = (field, e) => {
        if (e.type === 'compositionend') {
            this.isOnComposition = false
            if (!this.emittedInput) {
                this.handleChange(field, e)
            }
        } else {
            this.emittedInput = false
            this.isOnComposition = true
        }
    }
    branchValueChange = (value, name, e) => {
        if (e.triggerNode) {
            if (e.triggerNode.props.dataRef.type === 3) {
                this.setState({
                    treeSelectValue: e.triggerNode ? e.triggerNode.props.value : '',
                })
                this.preTreeValue = e.triggerNode ? e.triggerNode.props.value : ''
            } else {
                message.warning('请选择数据源层！')
            }
        } else {
            this.setState({
                treeSelectValue: undefined,
            })
        }
    }
    render() {
        const { treeSelectValue, loading, treeData, userList } = this.state
        const { visible } = this.props
        console.log('treeData', treeData)
        const loop = (data) =>
            data.map((item) => {
                if (item.children && item.children.length) {
                    if (item.type == 3) {
                        return <TreeNode key={item.id} dataRef={item} isLeaf value={item.id} title={item.name} label={item.name} />
                    } else {
                        return (
                            <TreeNode disabled={item.type !== 3} key={item.id} dataRef={item} value={item.id} title={item.name} label={item.name}>
                                {loop(item.children)}
                            </TreeNode>
                        )
                    }
                } else {
                    return <TreeNode disabled={item.type !== 3} key={item.id} dataRef={item} isLeaf value={item.id} title={item.name} label={item.name} />
                }
            })

        return (
            <DrawerLayout
                drawerProps={{
                    title: '文件采集',
                    visible,
                    width: 480,
                    onClose: () => this.close(),
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button type='primary' onClick={_.debounce(this.handleSubmit.bind(this), CONSTANTS.TIME_OUT)}>
                                确定
                            </Button>
                            <Button onClick={() => this.close()}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                <Spin spinning={loading} tip='上传中...'>
                    <Form style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 20 }} className='EditMiniForm' ref={(target) => (this.form = target)}>
                        <FormItem
                            label='名称'
                            name='name'
                            rules={[
                                {
                                    required: true,
                                    message: '请输入名称!',
                                },
                                {
                                    max: 100,
                                    message: '名称不能超过100个字符!',
                                },
                            ]}
                        >
                            <Input
                                placeholder='请输入名称'
                                onChange={this.handleChange.bind(this, 'nameText')}
                                suffix={<span style={{ color: this.state.nameText.length > 90 ? 'red' : '#D3D3D3' }}>{this.state.nameText.length}/100</span>}
                                onCompositionStart={this.handleComposition.bind(this, 'nameText')}
                                onCompositionEnd={this.handleComposition.bind(this, 'nameText')}
                            />
                        </FormItem>
                        <FormItem
                            label='描述'
                            className='descFormItem'
                            name='description'
                            rules={[
                                {
                                    max: 100,
                                    message: '名称不能超过100个字符!',
                                },
                            ]}
                        >
                            <div style={{ position: 'relative' }}>
                                <TextArea
                                    style={{ height: 52 }}
                                    placeholder='请输入描述'
                                    onChange={this.handleChange.bind(this, 'descText')}
                                    onCompositionStart={this.handleComposition.bind(this, 'descText')}
                                    onCompositionEnd={this.handleComposition.bind(this, 'descText')}
                                />
                                <span style={{ position: 'absolute', lineHeight: 1, bottom: 12, right: 12, color: this.state.descText.length > 90 ? 'red' : '#D3D3D3' }}>
                                    {this.state.descText.length}/100
                                </span>
                            </div>
                        </FormItem>
                        <FormItem
                            required
                            label={
                                <TipLabel
                                    label='上传文件'
                                    tip={
                                        <pre>
                                            1、仅支持zip、7z、tar、json、
                                            <br />
                                            txt格式。
                                            <br />
                                            2.txt格式建议转为UTF-8统一编码
                                            <br />
                                            格式
                                            <br />
                                            3、按住ctrl 可选择多个文件。
                                            <br />
                                            4、上传的文件名长度不能超过100
                                            <br />
                                            个字符。
                                            <br />
                                        </pre>
                                    }
                                />
                            }
                        >
                            <Dragger {...this.uploadprops}>
                                <p className='ant-upload-drag-icon'>
                                    <UploadOutlined />
                                </p>
                                <p className='ant-upload-text'>点击或将文件拖拽到此处上传！</p>
                                <p className='ant-upload-text'>支持上传最大文件大小为：5MB</p>
                            </Dragger>
                        </FormItem>
                        <FormItem
                            label='SQL类型'
                            name='type'
                            rules={[
                                {
                                    required: true,
                                    message: '请选择类型!',
                                },
                            ]}
                        >
                            <Select placeholder='请选择'>
                                {_.map(typeList, (item, index) => {
                                    return (
                                        <Select.Option value={item.value} key={item.value}>
                                            {item.name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </FormItem>

                        <FormItem required label='数据源'>
                            <TreeSelect
                                value={treeSelectValue}
                                dropdownStyle={{
                                    maxHeight: 300,
                                    overflow: 'auto',
                                }}
                                showSearch
                                placeholder='请选择数据源'
                                allowClear
                                treeDefaultExpandAll
                                treeNodeFilterProp='label'
                                onChange={this.branchValueChange}
                            >
                                {treeData.length > 0 ? loop(treeData) : null}
                            </TreeSelect>
                        </FormItem>
                        <FormItem
                            label='更新方式'
                            name='strategy'
                            rules={[
                                {
                                    required: true,
                                    message: '请选择更新方式!',
                                },
                            ]}
                        >
                            <RadioGroup>
                                {strategyObj.map((item) => {
                                    return (
                                        <Radio value={item.value} key={item.value}>
                                            <TipLabel label={item.text} tip={item.desc} />
                                        </Radio>
                                    )
                                })}
                            </RadioGroup>
                        </FormItem>
                        <FormItem label='责任人' name='owner' rules={[]}>
                            <Select placeholder='请选择责任人'>
                                {userList.map((item) => {
                                    return (
                                        <Option value={item.username} key={item.id}>
                                            {item.username}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </FormItem>
                    </Form>
                </Spin>
            </DrawerLayout>
        )
    }
}
export default BloodUpdateForm
