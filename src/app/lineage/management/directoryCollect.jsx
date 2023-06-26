/*
 * @LastEditTime: 2020-08-04 17:18:23
 * @LastEditors: Please set LastEditors
 * @Description: 血缘脚本文件上传页面
 */
import DrawerLayout from '@/component/layout/DrawerLayout'
import { Alert, Button, Form, Input, message, Radio, Select, Switch, TreeSelect, Upload } from 'antd'
import { getUserList } from 'app_api/manageApi'
import { getJobById, getMetadataTree, postLineageExtractjob } from 'app_api/metadataApi'
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
    position: 'absolute',
    bottom: 8,
    right: 8,
}

class BloodCollectForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            treeSelectValue: undefined,
            fileList: [], // 上传的文件
            loading: false,
            description: '',
            nameText: '',
            directoryPath: '',
            treeData: [],
            autoExtract: true,
            userList: [],
        }

        this.fileList = []

        this.uploadprops = {
            multiple: true,
            customRequest: this.onFileSelected.bind(this),
            onRemove: this.onRemove.bind(this),
            // accept: '.zip,.7z,.tar,.json,.txt',
            fileList: [],
        }
        this.isOnComposition = false
        this.emittedInput = true
    }

    componentDidMount() {
        this.getMetadataTree()
        this.getUserData()
        this.form.setFieldsValue({ storageType: 2, type: 'HiveSQL' })
        if (this.props.location.state.title == '编辑目录采集') {
            this.getDetailInfo()
        }
    }

    getUserData = async () => {
        let res = await getUserList({ page: 1, page_size: 99999, brief: false })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    getDetailInfo = async () => {
        let res = await getJobById({ id: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                treeSelectValue: res.data.datasource,
                autoExtract: res.data.autoExtract == 1 ? true : false,
                description: res.data.description ? res.data.description : '',
                nameText: res.data.name,
                directoryPath: res.data.directoryPath,
            })
            this.form.setFieldsValue(res.data)
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
            if (!this.state.treeSelectValue) {
                message.warning('请选择数据源！')
                return
            }

            const { onSuccess } = this.props
            this.setState({
                loading: true,
            })
            if (!values.description || values.description == '') {
                values.description = ''
            }
            let req = values
            req.datasource = this.state.treeSelectValue
            req.autoExtract = this.state.autoExtract ? 1 : 0
            req.description = this.state.description
            req.owner = req.owner ? req.owner : ''
            req.jobType = 2
            req.strategy = 4
            req.id = this.props.location.state.id ? this.props.location.state.id : ''
            postLineageExtractjob(req).then((res) => {
                if (res.code == '200') {
                    message.success('操作成功！')
                    onSuccess()
                }
                this.setState({
                    loading: false,
                })
            })
        })
    }

    parentTreeIdChange = (e) => {
        if (e.triggerNode && (e.triggerNode.props.path == 1 || e.triggerNode.props.path == 2)) {
            message.warning('请选择最后一层的数据源!')
            this.setState({
                treeSelectValue: undefined,
            })
        } else {
            this.setState({
                treeSelectValue: e.triggerNode ? e.triggerNode.props.value : '',
            })
        }
    }

    chengeType = (value) => {
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
        console.log(field, e.type, '--field--e.type')
        if (e.type === 'compositionend') {
            // composition is end
            this.isOnComposition = false
            if (!this.emittedInput) {
                this.handleChange(field, e)
            }
        } else {
            // in composition
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
    changeAutoExract = (value) => {
        this.setState({
            autoExtract: value,
        })
    }
    handleChangeDesc = (e) => {
        this.setState({
            description: e.target.value,
        })
    }

    render() {
        const { treeSelectValue, loading, treeData, userList } = this.state
        const { visible, onClose, onSuccess, location } = this.props
        const { title } = location.state
        const loop = (data) =>
            data.map((item) => {
                if (item.children && item.children.length) {
                    if (item.type == 3) {
                        return <TreeNode key={item.id} dataRef={item} isLeaf value={item.id} title={item.name} />
                    } else {
                        return (
                            <TreeNode disabled={item.type !== 3} key={item.id} dataRef={item} value={item.id} title={item.name}>
                                {loop(item.children)}
                            </TreeNode>
                        )
                    }
                } else {
                    return <TreeNode disabled={item.type !== 3} key={item.id} dataRef={item} isLeaf value={item.id} title={item.name} />
                }
            })

        return (
            <DrawerLayout
                drawerProps={{
                    title: title || '目录采集',
                    visible,
                    onClose,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button type='primary' loading={loading} onClick={_.debounce(this.handleSubmit.bind(this), CONSTANTS.TIME_OUT)}>
                                完成
                            </Button>
                            <Button onClick={onClose}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                <Alert
                    type='warning'
                    showIcon
                    message={
                        <div>
                            <div>注意：</div>
                            <div>1、系统仅支持配置唯一1个目录采集任务。</div>
                            <div>2、目录采集时，将根据上传过的文件名称，进行对比和更新。对全部【文件采集】任务中，上传过的文件有效。</div>
                            <div>3、默认采集策略是【替换】</div>
                        </div>
                    }
                />
                <Form className='EditMiniForm Grid1' ref={(target) => (this.form = target)}>
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
                            disabled={this.props.location.state.title == '编辑目录采集'}
                            placeholder='请输入名称'
                            onChange={this.handleChange.bind(this, 'nameText')}
                            suffix={<span style={{ color: this.state.nameText.length > 90 ? 'red' : '#D3D3D3' }}>{this.state.nameText.length}/100</span>}
                            onCompositionStart={this.handleComposition.bind(this, 'nameText')}
                            onCompositionEnd={this.handleComposition.bind(this, 'nameText')}
                        />
                    </FormItem>
                    <FormItem label='描述'>
                        <div style={{ position: 'relative' }}>
                            <TextArea style={{ height: 52 }} placeholder='请输入描述' rows={4} maxLength={100} value={this.state.description} onChange={this.handleChangeDesc} />
                            <span style={{ ...suffixStyle, color: this.state.description.length > 90 ? 'red' : '#D3D3D3' }}>{this.state.description.length}/100</span>
                        </div>
                    </FormItem>
                    <FormItem
                        label='存储类型'
                        name='storageType'
                        rules={[
                            {
                                required: true,
                                message: '请选择类型!',
                            },
                        ]}
                    >
                        <RadioGroup disabled={this.props.location.state.title == '编辑目录采集'}>
                            <Radio value={1} key={1}>
                                HDFS
                            </Radio>
                            <Radio value={2} key={2}>
                                File
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        label='文件路径'
                        extra='示例：192.168.2.1:/folder1/folder2/folder3'
                        name='directoryPath'
                        rules={[
                            {
                                required: true,
                                message: '请输入文件路径!',
                            },
                            {
                                max: 100,
                                message: '文件路径不能超过100个字符!',
                            },
                        ]}
                    >
                        <Input
                            placeholder='请输入文件路径'
                            onChange={this.handleChange.bind(this, 'directoryPath')}
                            suffix={<span style={{ color: this.state.directoryPath.length > 90 ? 'red' : '#D3D3D3' }}>{this.state.directoryPath.length}/100</span>}
                            onCompositionStart={this.handleComposition.bind(this, 'directoryPath')}
                            onCompositionEnd={this.handleComposition.bind(this, 'directoryPath')}
                        />
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
                        <Select onChange={this.chengeType} disabled={this.props.location.state.title == '编辑目录采集'}>
                            {_.map(typeList, (item, index) => {
                                return (
                                    <Select.Option value={item.value} key={item.value}>
                                        {item.name}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </FormItem>

                    <FormItem label='数据源' required>
                        <TreeSelect
                            disabled={this.props.location.state.title == '编辑目录采集'}
                            value={treeSelectValue}
                            dropdownStyle={{
                                maxHeight: 300,
                                overflow: 'auto',
                            }}
                            showSearch
                            placeholder='请选择数据源'
                            allowClear
                            treeDefaultExpandAll
                            treeNodeFilterProp='title'
                            onChange={this.branchValueChange}
                        >
                            {treeData.length > 0 ? loop(treeData) : null}
                        </TreeSelect>
                    </FormItem>

                    <FormItem label='更新方式'>
                        <span style={{ fontSize: '14px' }}>替换</span>
                    </FormItem>
                    <FormItem label='自动采集' required>
                        <div className='HControlGroup'>
                            <Switch onChange={this.changeAutoExract} checked={this.state.autoExtract} style={{ height: '22px', marginRight: '8px' }} />
                            <span>关闭后，系统不再按照指定时间进行任务调度</span>
                        </div>
                    </FormItem>
                    <FormItem label='责任人' name='owner'>
                        <Select style={{ width: '400px' }} placeholder='请选择责任人'>
                            {userList.map((item) => {
                                return (
                                    <Select.Option value={item.username} key={item.id}>
                                        {item.username}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </FormItem>
                </Form>
            </DrawerLayout>
        )
    }
}
export default BloodCollectForm
