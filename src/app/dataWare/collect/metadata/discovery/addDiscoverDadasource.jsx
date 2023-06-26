import './index.less'
import React, { Component } from 'react'
import { Form, Switch, Button, Row, Col, Checkbox, Radio,Tooltip, DatePicker, Pagination, Input, Menu, Table, message, Modal, Select, Tabs } from 'antd';
import { discoverDefault, getSourceTaskList, saveDataCollection, connectDataSource, updateTaskJobByBusiness, addSourceNew, datasourceDefine, getDataSourcedDatabase, getSourceList } from 'app_api/metadataApi'
import RenderUtil from '@/utils/RenderUtil'
import { Tools } from 'app_common'
import moment from 'moment'

let extraDriverTypeList = []
let extraServerModeList = []
let dataSourceInfo = {}
let productSelectList = {}


const portReg = /^\+?[1-9][0-9]*$/

let connectWaySelect = []

export default class AddDatasource extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {},
            btnLoading: false,
            passwordType: 'text',
            targetKeys: [],
            taskList: []
        }
        this.oracleType = 'SID'
    }
    openModal = async (data) => {
        this.setState({
            modalVisible: true,
            targetKeys: []
        })
        await this.getDatasourceDefineList()
        let res = await discoverDefault({id: data.id})
        if (res.code == 200) {
            let host = ''
            res.data = {
                ...res.data,
                dsName: res.data.dsName,
                dsType: 'JDBC',
                hostAddress: data.ip,
                port: data.port,
                host,
                product: data.dataType,
                network: 'OFFICE',
                username: '',
                password: '',
                // identifier: 'test'
            }
            await this.setState({
                addInfo: res.data
            })
            host = this.getHostReplaceStr(data.ip, 'hostAddress')
            if (portReg.test(data.port)) {
                host = this.getHostReplaceStr(data.port, 'port')
            }
            res.data.host = host
            this.setState({
                addInfo: res.data
            })
            console.log(res.data,'openModal')
        }
    }
    getTaskList = async (id) => {
        let { addInfo } = this.state
        this.setState({btnLoading: true})
        let res = await getSourceTaskList({key: id})
        this.setState({btnLoading: false})
        if (res.code == 200) {
            res.data.taskList.map((item) => {
                item.everyDayTimeValue = '00:00:00'
                item.weekTimeValue = '00:00:00'
                item.monthTimeValue = '00:00:00'
                item.weekChecboxValue = ''
                item.monthChecboxValue = ''
                item.startDateValue = ''
                item.endDateValue = ''
                item.startOrEndDisabled = ''
                item.time = '00:00:00'
                item.frequency = 0
                if (item.timePeriod == undefined) {
                    item.timePeriod = {
                        type: 1,
                        allSet: {
                            endTime: '当日02:00',
                            executeMinute: 120,
                            startTime: '',
                        },
                        working: {
                            endTime: '当日02:00',
                            executeMinute: 120,
                            startTime: '',
                        },
                        weekend: {
                            endTime: '当日04:00',
                            executeMinute: 240,
                            startTime: '',
                        },
                    }
                }
                item.disabled = false
                item.status = 0
                if (item.taskSubType == '101') {
                    item.status = 1
                }
            })
            this.setState({btnLoading: true})
            saveDataCollection({
                datasourceData: {id: id, name: addInfo.dsName},
                taskList: res.data.taskList,
                network: addInfo.network
            }).then((node) => {
                this.setState({btnLoading: false})
                if (node.code ==200) {
                    this.cancel()
                    message.success('创建成功')
                    this.props.reload()
                }
            })
            // this.setState({
            //     taskList: res.data.taskList
            // })
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    postData = () => {
        let { addInfo, taskList } = this.state
        if (!addInfo.dsName) {
            message.warning('请填写数据源中文名')
            return
        }
        if (!addInfo.username) {
            // 用户名不存在，不调用数据库连接
            message.warning('请填写账号密码')
            return
        }
        let req = {
            dsType: addInfo.dsType,
            host: addInfo.host,
            hostAddress: addInfo.hostAddress,
            network: addInfo.network,
            password: Tools.encrypt(addInfo.password),
            product: addInfo.product,
            username: addInfo.username,
        }
        this.setState({btnLoading: true})
        connectDataSource(req).then(response => {
            this.setState({btnLoading: false})
            if (response.code == 200) {
                this.setState({btnLoading: true})
                getDataSourcedDatabase(req).then((res) => {
                    this.setState({btnLoading: false})
                    if (res.code == '200') {
                        let targetKeys = [],
                            schemaData = []
                        _.map(res.data, (item, key) => {
                            let obj = {}
                            obj.key = item.physicalDatabase
                            obj.title = item.physicalDatabase
                            obj.description = item.physicalDatabase
                            obj.selected = item.selected
                            targetKeys.push(obj.key)
                            schemaData.push(obj)
                        })
                        this.setState({
                            schemaData,
                            targetKeys,
                        })
                        let query = {
                            ...addInfo,
                            databases: targetKeys,
                            password: Tools.encrypt(addInfo.password)
                        }
                        console.log(query, 'query+++')
                        this.setState({btnLoading: true})
                        addSourceNew(query).then(res1 => {
                            this.setState({btnLoading: false})
                            if (res1.code == 200) {
                                updateTaskJobByBusiness({ businessType: 1001, businessName: query.dsName, businessId: res1.data.id, network: query.network }).then((res2) => {})
                                this.getTaskList(res1.data.id)
                            } else {
                                // message.error(res1.msg)
                            }
                        })
                    } else {
                        // message.error(res.msg ? res.msg : '获取schema数据库失败！')
                    }
                })
            }
        })
    }
    changeInput = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e.target.value
        if (name == 'password') {
            this.setState({
                passwordType: 'password',
            })
        }
        this.setState({
           addInfo
        })
    }
    onBlur = (param) => {
        let { form } = this
        let val = form.getFieldValue(param)
        if (val !== '' && val !== undefined) {
            let req = {}
            req[param] = val
            if ((this.dsName !== val && param === 'dsName')) {
                getSourceList(req).then((res) => {
                    if (res.code == 200) {
                        if (res.data.length > 0) {
                            let errorsMsg = ''
                            if (param === 'dsName') {
                                errorsMsg = '系统名称重复，请重新输入！'
                            } else if (param === 'identifier') {
                                errorsMsg = '数据源英文名重复，请重新输入！'
                            }
                            form.setFields([
                                {
                                    name: param,
                                    value: val,
                                    errors: [errorsMsg],
                                },
                            ])
                        }
                    }
                })
            }
        }
    }
    getDatasourceDefineList = async () => {
        let res = await datasourceDefine()
        if (res.code == 200) {
            connectWaySelect = []
            let allTypeList = []
            res.data.map((item) => {
                connectWaySelect.push({
                    id: item.joinTypeCode,
                    name: item.joinTypeText,
                })
                item.typeList = []
                productSelectList[item.joinTypeCode] = {}
                item.appDatasourceDefineConfigList.map((config) => {
                    item.typeList.push({
                        id: config.dbName,
                        name: config.dbViewName,
                    })
                    allTypeList.push(config)
                })
                productSelectList[item.joinTypeCode].list = item.typeList
                productSelectList[item.joinTypeCode].default = item.typeList.length ? item.typeList[0].id : ''
                productSelectList[item.joinTypeCode].defaultType = item.joinTypeCode == 'DICT' ? '2' : item.joinTypeCode == 'REPORT' ? '3' : '1'
            })
            allTypeList.map((item) => {
                if (item.extraDriverTypeList) {
                    item.extraDriverTypeList.map((type) => {
                        type.key = parseInt(type.key)
                    })
                }
                item.pDriverJdbcPatternArr = item.pDriverJdbcPatternArr ? item.pDriverJdbcPatternArr : []
                dataSourceInfo[item.dbName] = {}
                dataSourceInfo[item.dbName].port = item.dbPort
                dataSourceInfo[item.dbName].host = item.pDriverJdbcPrefixArr[0]
                dataSourceInfo[item.dbName].simHost = item.pDriverJdbcPrefixArr[1]
                dataSourceInfo[item.dbName].reg = item.pDriverJdbcPatternArr[0] // eval(item.frontReg)
                dataSourceInfo[item.dbName].simReg = item.pDriverJdbcPatternArr[1] ? item.pDriverJdbcPatternArr[1] : ''
                dataSourceInfo[item.dbName].dbInputShow = item.pShowDatabaseInput ? true : false
                dataSourceInfo[item.dbName].extraDriverTypeList = item.extraDriverTypeList ? item.extraDriverTypeList : []
                dataSourceInfo[item.dbName].extraServerModeList = item.extraServerModeList ? item.extraServerModeList : []
                console.log(extraServerModeList, 'this.product == ORACLE')
            })
            console.log(productSelectList, 'productSelectList+++')
        }
    }
    getHostReplaceStr = (value, type) => {
        let { addInfo } = this.state
        const preHostvalue = addInfo.host
        let port = addInfo.port ? addInfo.port : ''
        let database = addInfo.database ? addInfo.database : ''
        let hostAddress = addInfo.hostAddress ? addInfo.hostAddress : ''
        let SID = addInfo.sid ? addInfo.sid : ''

        let dbInputShow = false
        let currentReg = ''
        console.log(dataSourceInfo,'dataSourceInfo')
        if (dataSourceInfo[addInfo.product] && dataSourceInfo[addInfo.product]['reg']) {
            if (this.oracleType === 'SID') {
                currentReg = dataSourceInfo[addInfo.product]['reg']
            } else {
                currentReg = dataSourceInfo[addInfo.product]['simReg']
            }
            dbInputShow = dataSourceInfo[addInfo.product]['dbInputShow']
        }
        if (type === 'hostAddress') {
            hostAddress = value
        } else if (type === 'database') {
            database = value
        } else if (type === 'port') {
            port = value
        } else if (type == 'SID') {
            SID = value
        }
        console.log(currentReg.replace('${host}', hostAddress).replace('${port}', port).replace('${database}', database),'1111111')
        if (addInfo.product === 'ORACLE') {
            if (this.oracleType === 'SID') {
                return currentReg.replace('${host}', hostAddress).replace('${port}', port).replace(':${database}', database) + ':' + SID
            } else {
                return currentReg.replace('${host}', hostAddress).replace('${port}', port).replace(':${database}', database) + '/' + SID
            }
        } else {
            return currentReg.replace('${host}', hostAddress).replace('${port}', port).replace('${database}', database)
        }
    }
    render() {
        let {
            btnLoading,
            passwordType,
            addInfo,
            modalVisible
        } = this.state
        return (
            <Modal
                className="standardMapDrawer"
                title='创建数据源'
                width={480}
                visible={modalVisible}
                onCancel={this.cancel}
                maskClosable={false}
                footer={[
                    <Button onClick={this.cancel}>
                        取消
                    </Button>,
                    <Button
                        onClick={this.postData} type='primary' loading={btnLoading}>
                        创建
                    </Button>,
                ]}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Form ref={(target) => {
                            this.form = target
                        }}
                              className='EditMiniForm Grid1 timePeriodArea'>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '数据源中文名',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入中文名！',
                                        },
                                        {
                                            max: 40,
                                            message: '中文名最大长度为40!',
                                        },
                                    ],
                                    content: <Input value={addInfo.dsName} onChange={this.changeInput.bind(this, 'dsName')} maxLength={40} showCount onBlur={this.onBlur.bind(this, 'dsName')} placeholder='请输入' />,
                                },
                                {
                                    label: '账号',
                                    // rules: [
                                    //     {
                                    //         max: 40,
                                    //         message: '账号最大长度为40!',
                                    //     },
                                    // ],
                                    content: <Input type='text' value={addInfo.username} onChange={this.changeInput.bind(this, 'username')}  placeholder='请输入账号' />,
                                },
                                {
                                    label: '密码',
                                    // rules: [
                                    //     {
                                    //         max: 40,
                                    //         message: '密码最大长度为40!',
                                    //     },
                                    // ],
                                    content: <Input type={passwordType} value={addInfo.password} placeholder='请输入密码' onChange={this.changeInput.bind(this, 'password')} />,
                                },
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </Modal>
        )
    }
}