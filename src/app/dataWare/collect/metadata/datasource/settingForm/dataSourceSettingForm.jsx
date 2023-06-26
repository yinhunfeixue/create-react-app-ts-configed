import RichSelect from '@/component/lzAntd/RichSelect'
import Module from '@/component/Module'
import TextItem from '@/component/TextItem'
import TipLabel from '@/component/tipLabel/TipLabel'
import RenderUtil from '@/utils/RenderUtil'
import { Alert, Button, Tag, Form, Input, message, Radio, Select, Spin, Transfer } from 'antd'
import { dataSecurityLevelList } from 'app_api/dataSecurity'
import { departments, getUserList } from 'app_api/manageApi'
import { datasourceDefine, getCollectNetwork, getDictSys, getSourceList, getSysDatabase } from 'app_api/metadataApi'
import { Tools } from 'app_common'
import classNames from 'classnames'
import React, { Component } from 'react'
import _ from 'underscore'
import './dataSourceSettingForm.less'
import TreeSelectComponent from './treeSelect'
import SvgIcon from 'app_component_main/SvgIcon/index.tsx'
import { PlusOutlined } from '@ant-design/icons';
import DatabaseDrawer from './database'



const FormItem = Form.Item
const Option = Select.Option

let extraDriverTypeList = []
let extraServerModeList = []
let dataSourceInfo = {}

const portReg = /^\+?[1-9][0-9]*$/

let connectWaySelect = []

const fieldStyle = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 12,
    },
}

const fieldStylelj = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
}

// defaultType: 1代表 JDBC 2代表中间库数据字典采集
let productSelectList = {}
export default class DataSourceSettingForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            techniqueDepartmentName: '',
            techniqueManagerName: '',
            count: 0,
            dataSourceVisible: false,
            itemDisabled: props.param.type === 'look',
            treeNodeIds: '',
            mountNodeId: undefined, // 数据源下拉框
            passwordType: 'text', // 密码输入框 当触发onchange事件的时候再变回password，为了新增的时候 不自动添加浏览器里保存的账号密码
            // 原来是大小写混合 但是采集上来的 有可能有些字母大小写的位置不一样，下面统一转换成小写
            productSelect: [],
            dictSys: [],
            sysSchemaData: [],
            sysSchemaLoding: true,
            dbInputShow: false,
            // userList: []
            network: 'OFFICE',
            networkList: [],
            driverOption: 0,
            impalaHostChange: false,
            datasourceDefineList: [],
            SIDValue: 'oradb', // SID初始值
            levelList: [],
            departmentList: [],
            otherDepartmentList: [],
            bizUserList: [],
            techUserList: [],
            businessMainDepartmentId: '',
        }
        this.collectMethod = '1'
        this.dsName = this.props.param.dsName // 这里将原来的数据源中文名保存下来
        this.identifier = this.props.param.identifier // 这里将原来的数据源英文名保存下来
        this.isLeaf = false
        this.product = 'HIVE'
        this.oracleType = 'SID'
        this.simOracleType = 'SID'
        this.hasSim = false
        this.connectWay = 'JDBC'
    }

    componentDidMount = async () => {
        this.product = this.props.param.product ? this.props.param.product : (this.props.param.dataType ? this.props.param.dataType : 'HIVE')
        this.getNetworkList()
        this.getLevelList()
        await this.getDepartment()
        await this.getDatasourceDefineList()
        console.log(this.product,'this.product+++')
        extraDriverTypeList = dataSourceInfo[this.product].extraDriverTypeList
        extraServerModeList = dataSourceInfo[this.product].extraServerModeList
        const { param } = this.props

        if (param.type === 'look') {
            this.setState({ itemDisabled: true })
        } else {
            this.setState({ itemDisabled: false })
        }

        if (param && param.type !== 'add') {
            this.resetFiledData(param)
        } else {
            this.form.setFieldsValue({
                username: '',
                password: '',
                securityLevel: '2',
                port: this.props.param.port,
                hostAddress: this.props.param.ip,
            })
            // await this.getDatasourceDefineList()
            // extraDriverTypeList = dataSourceInfo[this.product].extraDriverTypeList
            // extraServerModeList = dataSourceInfo[this.product].extraServerModeList
        }
        this.productChange(this.product)
        this.form.setFieldsValue({
            hostAddress: this.props.param.ip,
        })
        let host = this.getHostReplaceStr(this.props.param.ip, 'hostAddress')
        if (portReg.test(this.props.param.port)) {
            host = this.getHostReplaceStr(this.props.param.port, 'port')
        }
        this.form.setFieldsValue({
            host,
        })
    }
    openDataSourceModal = () => {
        let { count } = this.state
        let { schemaData, targetKeys } = this.props
        count = count + 1
        this.setState({
            count,
            dataSourceVisible: true
        })
        schemaData.map((item) => {
            item.selected = false
            if (targetKeys.includes(item.title)) {
                item.selected = true
            }
        })
        this.databaseDrawer.openModal(schemaData, targetKeys)
    }
    closeDataSourceModal = () => {
        this.setState({
            dataSourceVisible: false
        })
    }
    getBizUserList = async () => {
        let query = {
            page: 1,
            page_size: 99999,
            brief: false,
            departmentId: this.form.getFieldsValue().businessMainDepartmentId,
        }
        let res = await getUserList(query)
        if (res.code == 200) {
            this.setState({
                bizUserList: res.data,
            })
        }
    }
    getTechUserList = async () => {
        let query = {
            page: 1,
            page_size: 99999,
            brief: false,
            departmentId: this.form.getFieldsValue().techniqueDepartmentId,
        }
        let res = await getUserList(query)
        if (res.code == 200) {
            this.setState({
                techUserList: res.data,
            })
        }
    }
    getLevelList = async () => {
        let res = await dataSecurityLevelList()
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = item.id.toString()
            })
            this.setState({
                levelList: res.data,
            })
        }
    }
    getDatasourceDefineList = async () => {
        let res = await datasourceDefine()
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
        if (res.code == 200) {
            this.setState({
                datasourceDefineList: res.data,
                productSelect: productSelectList['JDBC']['list'],
            })
        }
    }

    getNetworkList = async () => {
        let res = await getCollectNetwork()
        if (res.code == 200) {
            this.setState({
                networkList: res.data,
            })
        }
    }
    datasourceValueChange = (e, value) => {
        this.isLeaf = true
        this.setState({
            treeNodeIds: value ? value : '',
        })
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        })
    }

    async resetFiledData(dataSource) {
        let { otherDepartmentList, departmentList } = this.state
        this.isLeaf = true
        if (Object.keys(dataSource).length !== 0) {
            this.collectMethod = dataSource.collectMethod.toString()
            this.product = dataSource.product ? dataSource.product : ''
            this.hasSim = dataSource.hasSim
            this.connectWay = dataSource.dsType

            if (dataSourceInfo[this.product]) {
                this.setState({
                    dbInputShow: dataSourceInfo[this.product]['dbInputShow'],
                })
            }

            if (dataSource.dsType == 'DICT' && dataSource.product == 'ORACLE') {
                await this.props.changeSteps(2)
            } else {
                await this.props.changeSteps(1)
            }
            // 这是因为 上面 setFielsvalue也需要时间的  否则 类型是 SID还是 Server Name的单选框还没出来是 设置不了值的
            //  setTimeout(()=>{
            console.log(dataSource, 'dataSourcez++++++jjjjj++')
            await this.form.setFieldsValue({
                dsName: dataSource.dsName,
                host: dataSource.host,
                hostAddress: dataSource.hostAddress,
                port: dataSource.port,
                sid: dataSource.sid,
                database: dataSource.database,
                username: dataSource.username,
                password: dataSource.username ? '.....' : '',
                hasSim: dataSource.hasSim ? dataSource.hasSim : false,
                dsType: dataSource.dsType,
                identifier: dataSource.identifier,
                collectMethod: dataSource.collectMethod.toString(),
                systemIdent: dataSource.systemIdent,
                product: dataSource.product ? dataSource.product : '',
                businessManagerId: dataSource.businessManagerId,
                techniqueManagerId: dataSource.techniqueManagerId,
                contactPersonId: dataSource.contactPersonId,
                techniqueDepartmentId: dataSource.techniqueDepartmentId,
                dataWarehouse: dataSource.dataWarehouse,
                securityLevel: dataSource.securityLevel ? dataSource.securityLevel.toString() : '2',
                businessMainDepartmentId: dataSource.businessMainDepartmentId,
                businessOtherDepartmentIds: dataSource.businessOtherDepartmentIds ? dataSource.businessOtherDepartmentIds : [],
            })
            otherDepartmentList = []
            departmentList.map((item) => {
                if (item.id !== dataSource.businessMainDepartmentId) {
                    otherDepartmentList.push(item)
                }
            })
            this.setState({
                otherDepartmentList,
                businessMainDepartmentId: dataSource.businessMainDepartmentId,
                techniqueManagerName: dataSource.techniqueManager,
                techniqueDepartmentName: dataSource.techniqueDepartment
            })
            this.getBizUserList()
            this.getTechUserList()

            if (this.product == 'HIVE') {
                this.setState({
                    driverOption: dataSource.driverOption,
                })
                this.form.setFieldsValue({
                    driverOption: dataSource.driverOption,
                })
            }
            if (dataSource.collectMethod == 1 && dataSource.product == 'ORACLE') {
                if (dataSource.host && dataSource.host.indexOf('@//') > 0) {
                    this.form.setFieldsValue({
                        oracleType: 'Service Name',
                    })
                    this.oracleType = 'Service Name'
                } else {
                    this.form.setFieldsValue({
                        oracleType: 'SID',
                    })
                    this.oracleType = 'SID'
                }

                if (dataSource.simHost && dataSource.simHost.indexOf('@//') > 0) {
                    this.form.setFieldsValue({
                        simOracleType: 'Service Name',
                    })
                    this.simOracleType = 'Service Name'
                } else {
                    this.form.setFieldsValue({
                        simOracleType: 'SID',
                    })
                    this.simOracleType = 'SID'
                }
            }
            // },0)
            if (this.hasSim) {
                // setTimeout(()=>{
                this.form.setFieldsValue({
                    simHost: dataSource.simHost,
                    simUsername: dataSource.simUsername,
                    simPassword: '.....',
                })
                this.simHostChangeFun(dataSource.simHost)
                // },0)
            }
            // this.hostChangeFun(dataSource.host)

            // let nodeId = []
            // dataSource.treeNodeIds.map((item) => {
            //     if (item) {
            //         nodeId.push(item)
            //     }
            // })

            await this.setStateAsync({
                passwordType: dataSource.username ? 'password' : 'text',
                treeNodeIds: dataSource.treeNodeIds ? dataSource.treeNodeIds[0] : '',
                network: dataSource.network,
            })

            // await this.getDictSysList()

            if (dataSource.dsType == 'DICT' && dataSource.systemIdent) {
                await this.getDictSysList()
                await this.form.setFieldsValue({
                    systemIdent: dataSource.systemIdent,
                })

                // this.sysSelectChange(dataSource.systemIdent)
            }
            if (dataSource.collectMethod == 1) {
                this.connected({ id: dataSource.id })
            }
        }
        // this.onHostAddressBlur()
    }

    // 检测数据源名字 或者标识唯一性 如果返回的 data不为空数组，说明能查出来 就重复了
    // 这里要判断一下用户改没改名称，用户可能只是点了一下输入框，并没有修改，这时候不要去检测名称是否重复
    onBlur = (param) => {
        let { form } = this
        let val = form.getFieldValue(param)
        if (val !== '' && val !== undefined) {
            let req = {}
            req[param] = val
            if ((this.dsName !== val && param === 'dsName') || (this.identifier !== val && param === 'identifier')) {
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

    getDictSysList = async () => {
        const { param } = this.props
        let req = this.getConnectInfo()
        let databases = param.databases
        req.databases = this.props.targetKeys.length > 0 ? this.props.targetKeys : databases
        req.id = param.id

        let res = await getDictSys(req)
        if (res.code == 200) {
            if (res.data) {
                if (res.data.length > 0) {
                    await this.setStateAsync({
                        dictSys: res.data,
                    })
                    // if( targetKeys ){
                    //     await this.setStateAsync({
                    //         sysSchemaData:[]
                    //     })
                    // }
                } else {
                    await this.setStateAsync({
                        dictSys: [],
                        sysSchemaData: [],
                    })
                    if (param.dsType == 'DICT') {
                        message.warning('您选择的数据库没有对应要采集的系统，请重新选择')
                    }
                }
            } else {
                await this.setStateAsync({
                    dictSys: [],
                    sysSchemaData: [],
                })
                if (param.dsType == 'DICT') {
                    message.warning('您选择的数据库没有对应要采集的系统，请重新选择')
                }
            }
        } else {
            await this.setStateAsync({
                dictSys: [],
                sysSchemaData: [],
            })
            message.error(res.msg ? res.msg : '获取schema数据库失败！')
        }
    }

    onSystemIdentBlur = () => {
        let { form } = this.props
        let val = form.getFieldValue('systemIdent')
    }

    // 获取全部form表单信息
    handleSubmit() {
        return this.form
            .validateFields()
            .then((values) => {
                if (this.state.treeNodeIds.length) {
                    if (!this.isLeaf) {
                        this.wholeInfo = undefined
                        message.warning('请选择路径的最后一层！')
                    } else {
                        let value = values

                        if (this.form.getFieldValue('businessManagerId') == undefined) {
                            value.businessManagerId = ''
                        }

                        if (this.form.getFieldValue('techniqueManagerId') == undefined) {
                            value.techniqueManagerId = ''
                        }

                        if (this.form.getFieldValue('contactPersonId') == undefined) {
                            value.contactPersonId = ''
                        }

                        if (!this.form.getFieldValue('password') || this.form.getFieldValue('password') == '.....') {
                            delete value.password
                        } else {
                            value.password = Tools.encrypt(values.password)
                        }
                        if (!this.form.getFieldValue('simPassword') || this.form.getFieldValue('simPassword') == '.....') {
                            delete value.simPassword
                        } else {
                            value.simPassword = Tools.encrypt(values.simPassword)
                        }
                        value.treeNodeIds = [this.state.treeNodeIds]
                        value.network = this.state.network
                        value.techniqueDepartmentName = this.state.techniqueDepartmentName
                        value.techniqueManagerName = this.state.techniqueManagerName
                        this.wholeInfo = values
                    }
                } else {
                    this.wholeInfo = undefined
                    message.warning('请选择路径！')
                }
            })
            .catch(() => {})
    }

    getWholeInfo = async () => {
        await this.handleSubmit()
        this.wholeInfo.techniqueDepartmentName = this.state.techniqueDepartmentName
        this.wholeInfo.techniqueManagerName = this.state.techniqueManagerName
        console.log(this.wholeInfo, 'wholeInfo++++')
        return this.wholeInfo
    }

    // 手动采集参数
    getHandelInfoData() {
        return this.form
            .validateFields()
            .then((values) => {
                if (this.state.treeNodeIds.length) {
                    if (!this.isLeaf) {
                        this.handelInfo = undefined
                        message.warning('请选择路径的最后一层！')
                    } else {
                        let value = values

                        if (this.form.getFieldValue('businessManagerId') == undefined) {
                            value.businessManagerId = ''
                        }

                        if (this.form.getFieldValue('techniqueManagerId') == undefined) {
                            value.techniqueManagerId = ''
                        }

                        if (this.form.getFieldValue('contactPersonId') == undefined) {
                            value.contactPersonId = ''
                        }

                        value.treeNodeIds = [this.state.treeNodeIds]
                        value.network = this.state.network
                        console.log(values, 'values++++')
                        this.handelInfo = values
                    }
                } else {
                    this.handelInfo = undefined
                    message.warning('请选择路径！')
                }
            })
            .catch(() => {})
    }

    getHandelInfo = async () => {
        await this.getHandelInfoData()
        this.handelInfo.techniqueDepartmentName = this.state.techniqueDepartmentName
        this.handelInfo.techniqueManagerName = this.state.techniqueManagerName
        return this.handelInfo
    }

    filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1

    handleChange = async (targetKeys) => {
        if (targetKeys.length < 1) {
            await this.setStateAsync({
                dictSys: [],
                sysSchemaData: [],
            })
        }
        this.props.changeTargetKeys(targetKeys)
    }

    handleDictChange = (dictDatabases) => {
        this.props.changeDictDatabase(dictDatabases)
    }

    handleSearch = (dir, value) => {
        console.log('search:', dir, value)
    }

    // 获取连接JDBC需要的参数
    getConnectInfoFun = () => {
        return this.form
            .validateFields(['dsType', 'hostAddress', 'host', 'username', 'password'])
            .then((values) => {
                let value = values
                value.username = values.username
                if (this.form.getFieldValue('password') == '.....') {
                    delete value.password
                } else {
                    value.password = Tools.encrypt(values.password)
                }

                this.connectInfo = value
                this.connectInfo.product = this.product
            })
            .catch(() => {
                this.connectInfo = undefined
            })
    }
    // 不这样 不能直接返回 values
    getConnectInfo = async () => {
        const { param } = this.props
        await this.getConnectInfoFun()
        if (param.id) {
            this.connectInfo.id = param.id
        }
        this.connectInfo.network = this.state.network
        return this.connectInfo
    }

    // 获取仿真环境连接JDBC需要的参数
    getSimConnectInfoFun = () => {
        this.form
            .validateFields(['dsType', 'simHost', 'simUsername', 'simPassword'])
            .then((values) => {
                let value = values
                value.host = values.simHost
                value.username = values.simUsername
                if (this.form.getFieldValue('simPassword') == '.....') {
                    delete value.simPassword
                } else {
                    value.password = Tools.encrypt(values.simPassword)
                }
                delete value.simHost
                delete value.simPassword
                delete value.simUsername
                this.simConnectInfo = value
            })
            .catch(() => {
                this.simConnectInfo = undefined
            })
    }
    // 不这样 不能直接返回 values
    getSimConnectInfo = () => {
        this.getSimConnectInfoFun()
        return this.simConnectInfo
    }

    editSystermTree = () => {
        this.props.addTab('资源目录配置', { callback: this.reloadRout })
    }

    reloadRout = () => {
        console.log('reloadRout')
        this.routTree.getMetadataTree()
    }

    passwordChange = () => {
        this.setState({
            passwordType: 'password',
        })
    }

    collectMethodChange = (e) => {
        if (this.itemDisabled) {
            return
        }
        if (this.props.param.collectMethod == 2) {
            this.form.resetFields()
            this.form.setFieldsValue({
                dsName: this.props.param.dsName,
                identifier: this.props.param.identifier,
            })
        }
        this.collectMethod = e
        this.props.changeCollectionWay(e)
    }

    hasSimChange = (e) => {
        const { value } = e.target
        this.hasSim = value

        if (value) {
            setTimeout(() => {
                this.productChange(this.product, 'hasSimChange')
            }, 0)
        }
    }

    // hasSimChange里传 true  表示只改 仿真环境的
    productChange = (value, flag) => {
        this.product = value
        if (flag === 'hasSimChange') {
            // this.form.setFieldsValue({
            //     simHostAdress: undefined
            // })
            if (dataSourceInfo[value]) {
                this.form.setFieldsValue({
                    simHostPort: dataSourceInfo[value]['port'],
                    simHost: dataSourceInfo[value]['host'],
                })
            }
        } else {
            this.form.setFieldsValue({
                hostAddress: undefined,
                // simHostAdress: undefined
            })

            if (dataSourceInfo[value]) {
                this.form.setFieldsValue({
                    port: dataSourceInfo[value]['port'],
                    host: dataSourceInfo[value]['host'],
                    simHostPort: dataSourceInfo[value]['port'],
                    simHost: dataSourceInfo[value]['host'],
                })
            }
        }

        if (dataSourceInfo[value]) {
            this.setState({
                dbInputShow: dataSourceInfo[value]['dbInputShow'],
            })
        }

        extraDriverTypeList = dataSourceInfo[value].extraDriverTypeList
        extraServerModeList = dataSourceInfo[value].extraServerModeList
    }

    connected = async (params = {}) => {
        this.setState({ loadingConnect: true })
        await this.props.connected(params)
        this.setState({ loadingConnect: false })
    }

    hostChange = (e) => {
        // const { value } = e.target
        // this.hostChangeFun(value)
    }

    hostChangeFun = (value) => {
        console.log(value, '-------hostChangeFunhostChangeFun--------')
        if (!value) {
            return
        }

        let arr = []
        if (dataSourceInfo[this.product] && dataSourceInfo[this.product]['reg']) {
            arr = value.match(dataSourceInfo[this.product]['reg'])
        }
        console.log(arr, 'arrrrrr')
        if (arr) {
            this.form.setFieldsValue({
                hostAddress: arr[2],
                port: arr[3] ? arr[3].split(':')[1] : '',
            })

            if (this.product === 'ORACLE') {
                if (this.oracleType === 'SID') {
                    this.form.setFieldsValue({
                        SID: arr[4] ? arr[4].split(':')[1] : '',
                    })
                } else {
                    this.form.setFieldsValue({
                        SID: arr[4] ? arr[4].split('/')[1] : '',
                    })
                }
            }

            console.log(this.product, 'this.productthis.product')
            if (this.product === 'DB2') {
                setTimeout(() => {
                    this.form.setFieldsValue({
                        database: arr[4] ? arr[4].split('/')[1] : '',
                    })
                })
            }
        } else {
            this.form.setFields([
                {
                    name: 'host',
                    value: value,
                    errors: [new Error('请输入合法的JDBC  URL')],
                },
            ])
        }
    }
    getHostReplaceStr = (value, type) => {
        const preHostvalue = this.form.getFieldValue('host')
        let port = this.form.getFieldValue('port') ? this.form.getFieldValue('port') : ''
        let database = this.form.getFieldValue('database') ? this.form.getFieldValue('database') : ''
        let hostAddress = this.form.getFieldValue('hostAddress') ? this.form.getFieldValue('hostAddress') : ''
        let SID = this.form.getFieldValue('sid') ? this.form.getFieldValue('sid') : ''

        let dbInputShow = false
        let currentReg = ''
        if (dataSourceInfo[this.product] && dataSourceInfo[this.product]['reg']) {
            if (this.oracleType === 'SID') {
                currentReg = dataSourceInfo[this.product]['reg']
            } else {
                currentReg = dataSourceInfo[this.product]['simReg']
            }
            dbInputShow = dataSourceInfo[this.product]['dbInputShow']
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
        if (this.product === 'ORACLE') {
            if (this.oracleType === 'SID') {
                return currentReg.replace('${host}', hostAddress).replace('${port}', port).replace(':${database}', database) + ':' + SID
            } else {
                return currentReg.replace('${host}', hostAddress).replace('${port}', port).replace(':${database}', database) + '/' + SID
            }
        } else {
            return currentReg.replace('${host}', hostAddress).replace('${port}', port).replace('${database}', database)
        }
    }

    hostAdressChange = (e) => {
        let host = this.getHostReplaceStr(e.target.value, 'hostAddress')
        this.form.setFieldsValue({
            host,
        })
    }

    hostPortChange = (e) => {
        const { value } = e.target
        if (portReg.test(value)) {
            this.form.setFieldsValue({
                host: this.getHostReplaceStr(value, 'port'),
            })
        }
    }

    SIDChange = (e) => {
        this.form.setFieldsValue({
            host: this.getHostReplaceStr(e.target.value, 'SID'),
        })
    }

    databaseChange = (e) => {
        this.form.setFieldsValue({
            host: this.getHostReplaceStr(e.target.value, 'database'),
        })
    }

    simHostChangeFun = (value) => {
        let arr = []
        if (dataSourceInfo[this.product] && dataSourceInfo[this.product]['reg']) {
            arr = value.match(dataSourceInfo[this.product]['reg'])
        }

        if (arr) {
            this.form.setFieldsValue({
                simHostAdress: arr[2],
                simHostPort: arr[3] ? arr[3].split(':')[1] : '',
            })

            if (this.product === 'ORACLE') {
                if (this.simOracleType === 'SID') {
                    this.form.setFieldsValue({
                        simSID: arr[4] ? arr[4].split(':')[1] : '',
                    })
                } else {
                    this.form.setFieldsValue({
                        simSID: arr[4] ? arr[4].split('/')[1] : '',
                    })
                }
            }

            if (this.product === 'Db2') {
                this.form.setFieldsValue({
                    simDatabase: arr[4] ? arr[4].split('/')[1] : '',
                })
            }
        } else {
            this.form.setFields([
                {
                    name: 'simHost',
                    value: value,
                    errors: [new Error('请输入合法的JDBC  URL')],
                },
            ])
        }
    }

    getsimHostReplaceStr = (value, type) => {
        console.log(type, 'typeeee')
        const preHostvalue = this.form.getFieldValue('simHost')
        const hostPort = this.form.getFieldValue('simHostPort')

        let currentReg = ''

        if (dataSourceInfo[this.product] && dataSourceInfo[this.product]['reg']) {
            currentReg = dataSourceInfo[this.product]['reg']
        }
        console.log(currentReg, 'currentRegcurrentReg')

        console.log(type, 'typeeee')
        console.log(this.product, 'this.product')
        if (type === 'simHostAdress') {
            if (this.product === 'ORACLE') {
                const SID = this.form.getFieldValue('simSID')
                if (this.simOracleType === 'SID') {
                    return preHostvalue.replace(currentReg, `$1${value}:${hostPort}:${SID}`)
                } else {
                    return preHostvalue.replace(currentReg, `$1${value}:${hostPort}/${SID}`)
                }
            } else {
                return preHostvalue.replace(currentReg, `$1${value}:${hostPort}$4`)
            }
        } else if (type === 'simSID') {
            if (this.simOracleType === 'SID') {
                return preHostvalue.replace(currentReg, `$1$2$3:${value}`)
            } else {
                return preHostvalue.replace(currentReg, `$1$2$3/${value}`)
            }
        } else if (type === 'simDatabase') {
            return preHostvalue.replace(currentReg, `$1$2$3/${value}`)
        } else {
            return preHostvalue.replace(currentReg, `$1$2:${value}$4`)
        }
    }

    simHostAdressChange = (e) => {
        let simHost = this.getsimHostReplaceStr(e.target.value, 'simHostAdress')
        this.form.setFieldsValue({
            simHost,
        })
        // this.form.setFieldsValue({
        //     simHost: this.getsimHostReplaceStr(e.target.value, 'simHostAdress')
        // })
    }

    oracleTypeChange = (e) => {
        const { value } = e.target
        this.oracleType = value || ''
        extraServerModeList.map((item) => {
            if (item.key == value) {
                console.log(item.value, 'extraServerModeList')
                this.setState({
                    SIDValue: item.value,
                })
            }
        })
        this.oracalTypeChange(value)
    }

    // hasSimChange里传 true  表示只改 仿真环境的
    oracalTypeChange = (value, flag) => {
        if (flag === 'hasSimChange') {
            if (value === 'SID') {
                this.form.setFieldsValue({
                    simHost: dataSourceInfo['ORACLE']['host'],
                })
            } else {
                this.form.setFieldsValue({
                    simHost: dataSourceInfo['ORACLE']['simHost'],
                })
            }
            const val = this.form.getFieldValue('simHostAdress')
            this.simHostAdressChange({
                target: {
                    value: val || '',
                },
            })
        } else {
            if (value === 'SID') {
                this.form.setFieldsValue({
                    host: dataSourceInfo['ORACLE']['host'],
                })
            } else {
                this.form.setFieldsValue({
                    host: dataSourceInfo['ORACLE']['simHost'],
                })
            }
            const val = this.form.getFieldValue('hostAddress')
            this.hostAdressChange({
                target: {
                    value: val || '',
                },
            })
        }
    }

    connectWayChange = (value) => {
        console.log('value', productSelectList)
        this.connectWay = value
        this.setState({
            productSelect: productSelectList[value]['list'],
        })

        this.form.setFieldsValue({
            product: productSelectList[value]['default'],
        })
        this.productChange(productSelectList[value]['default'])
        this.productChange(productSelectList[value]['default'], 'hasSimChange')
        this.props.changeSteps(productSelectList[value]['defaultType'])
    }

    changeManager = async (field, value, node) => {
        let { otherDepartmentList, departmentList } = this.state
        await this.form.setFieldsValue({
            [field]: value,
        })
        console.log(node,'node+++')
        otherDepartmentList = []
        if (field == 'businessMainDepartmentId') {
            departmentList.map((item) => {
                if (item.id !== value) {
                    otherDepartmentList.push(item)
                }
            })
            this.form.setFieldsValue({
                businessOtherDepartmentIds: [],
                businessManagerId: undefined,
            })
            this.setState({
                otherDepartmentList,
                businessMainDepartmentId: value,
            })
            this.getBizUserList()
        } else if (field == 'techniqueDepartmentId') {
            this.form.setFieldsValue({
                techniqueManagerId: undefined,
            })
            this.setState({
                techniqueDepartmentName: node.title
            })
            this.getTechUserList()
        } else if (field == 'techniqueManagerId') {
            this.setState({
                techniqueManagerName: node.title
            })
        }
    }

    sysSelectChange = async (value) => {
        await this.setStateAsync({
            sysSchemaLoding: true,
        })
        const { param } = this.props
        let dictDatabases = [],
            sysSchemaData = []
        let req = this.getConnectInfo()
        let databases = param.databases
        req.databases = this.props.targetKeys.length > 0 ? this.props.targetKeys : databases
        req.systemIdent = value
        req.id = param.id
        let res = await getSysDatabase(req)
        if (res.code == 200) {
            _.map(res.data, (item, key) => {
                let obj = {}
                obj.key = item.title
                obj.title = item.title
                obj.description = item.title
                if (item.selected) {
                    dictDatabases.push(obj.key)
                }
                sysSchemaData.push(obj)
            })
        }

        await this.setStateAsync({
            sysSchemaData,
            sysSchemaLoding: false,
        })

        this.props.changeDictDatabase(dictDatabases)
    }

    changeNetwork = (value) => {
        let { network } = this.state
        network = value
        this.setState({ network })
    }
    driverChange = (value) => {
        this.setState({ driverOption: value })
    }
    onHostAddressBlur = () => {
        if (this.state.impalaHostChange) {
            return
        }
        this.setState({
            impalaHostChange: true,
        })
        if (this.product == 'IMPALA') {
            if (this.form.getFieldValue('host').indexOf(';AuthMech=3') == -1) {
                this.form.setFieldsValue({
                    host: this.form.getFieldValue('host') + ';AuthMech=3',
                })
            }
        }
    }
    getDepartment = async () => {
        let res = await departments({ page_size: 100000 })
        if (res.code == 200) {
            this.setState({
                departmentList: res.data,
            })
        }
    }
    tagClose = (name) => {
        let { schemaData } = this.props
        let array = this.props.targetKeys
        array = array.filter(arr => arr !== name);
        schemaData.map((item) => {
            if (item.title == name) {
                item.selected = false
            }
        })
        this.props.changeTargetKeys(array)
        this.props.changeSchemaData(schemaData)
    }
    getDatabase = (data) => {
        console.log(data,'getDatabase')
        this.props.changeTargetKeys(data)
    }
    render() {
        const {
            dataSourceVisible,
            count,
            itemDisabled,
            treeNodeIds,
            passwordType,
            productSelect,
            dictSys,
            sysSchemaData,
            sysSchemaLoding,
            network,
            networkList,
            SIDValue,
            dbInputShow,
            levelList,
            departmentList,
            otherDepartmentList,
            bizUserList,
            techUserList,
            businessMainDepartmentId,
        } = this.state

        const { param, connectMsg, connectStatus, connectSimStatus, schemaData, targetKeys, dictDatabases, loading, userList } = this.props

        let connectInfo = null
        if (connectStatus == 0) {
            connectInfo = null
        } else if (connectStatus == 1) {
            connectInfo = <span>{connectMsg}</span>
        } else if (connectStatus == 2) {
            connectInfo = <span>{connectMsg}</span>
        } else if (connectStatus == 3) {
            connectInfo = <span>{connectMsg}</span>
        }

        const isEdit = this.props.param.type !== 'look'
        const hasExtraServerMode = Boolean(extraServerModeList.length)

        const renderDataBase = () => {
            // 编辑模式，使用穿梭框；阅读默认使用tag
            console.log(schemaData,targetKeys,'schemaData')
            if (!itemDisabled) {
                return (
                    <div className='databaseTagArea'>
                        {/* <Tag>默认数据源</Tag> */}
                        {
                            targetKeys.map(v => (<Tag key={v} onClose={() => { this.tagClose(v) }} closable={true}>{v}</Tag>))
                        }
                        <Tag onClick={this.openDataSourceModal} className='addDatabaseBtn'><PlusOutlined />添加数据库</Tag>
                    </div>
                )
                // return (
                //     <Transfer
                //         className='dataSourceTransfer'
                //         dataSource={schemaData}
                //         showSearch={connectStatus == '2'}
                //         listStyle={{
                //             width: '100%',
                //             height: 400,
                //         }}
                //         titles={connectStatus != '2' ? ['', ''] : ['未选数据库', '已选数据库']}
                //         disabled={itemDisabled || connectStatus != '2'}
                //         locale={{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容' }}
                //         filterOption={this.filterOption}
                //         targetKeys={targetKeys}
                //         onChange={this.handleChange}
                //         onSearch={this.handleSearch}
                //         render={(item) => item.title}
                //     />
                // )
            }

            const items = schemaData.filter((item) => targetKeys.includes(item.key))
            console.log('schemaData', schemaData, targetKeys, items)
            return (
                <div className='DataBaseGroup'>
                    {items.map((item) => (
                        <span className='DataBaseItem'>{item.title}</span>
                    ))}
                </div>
            )
        }

        return (
            <React.Fragment>
                <Form
                    ref={(target) => {
                        this.form = target
                    }}
                    scrollToFirstError
                    layout='vertical'
                    className={classNames('dataSourceSettingForm', itemDisabled ? 'dataSourceSettingFormReadOnly' : '')}
                    initialValues={{
                        collectMethod: '1',
                        businessOtherDepartmentIds: [],
                        dsType: 'JDBC',
                        product: this.props.param.dataType || 'HIVE',
                        driverOption: 0,
                        port: this.props.param.port || 10000,
                        hostAddress: this.props.param.ip || '',
                        oracleType: 'SID',
                        initialValue: SIDValue,
                        host: 'jdbc:hive2://',
                    }}
                >
                    <Module title='基本信息'>
                        <div className={classNames(itemDisabled ? 'MiniForm Grid4' : 'EditMiniForm Grid1 width520')}>
                            {
                                !itemDisabled && !param.isDsMap ?
                                    <div className='tabBtn'>
                                        <div onClick={this.collectMethodChange.bind(this, '1')} className={this.collectMethod == '1' ? 'tabBtnItemSelected tabBtnItem' : 'tabBtnItem'}>
                                            {this.collectMethod == '1' ? <SvgIcon name='icon_tag_top' /> : null}
                                            <span>自动采集</span>
                                        </div>
                                        <div onClick={this.collectMethodChange.bind(this, '2')} className={this.collectMethod == '2' ? 'tabBtnItemSelected tabBtnItem' : 'tabBtnItem'}>
                                            {this.collectMethod == '2' ? <SvgIcon name='icon_tag_top' /> : null}
                                            <span>手动采集</span>
                                        </div>
                                    </div>
                                    : null
                            }
                            {RenderUtil.renderFormItems([
                                {
                                    label: '数据源中文名',
                                    name: 'dsName',
                                    rules: [
                                        {
                                            required: isEdit && !itemDisabled,
                                            message: '请输入中文名！',
                                        },
                                        {
                                            max: 40,
                                            message: '中文名最大长度为40!',
                                        },
                                    ],
                                    content: <Input maxLength={40} showCount onBlur={this.onBlur.bind(this, 'dsName')} disabled={itemDisabled} placeholder='请输入' />,
                                },
                                {
                                    label: <TipLabel label='数据源英文名' tip='系统内唯一标识，创建后不可修改(以英文或数字开头，由数字、英文字母和- _.组成，最大长度为40)' />,
                                    name: 'identifier',
                                    rules: [
                                        {
                                            required: isEdit && !itemDisabled,
                                            message: '请输入系统英文名！',
                                        },
                                        {
                                            pattern: /^[a-zA-Z0-9][0-9a-zA-Z\._\-]*$/,
                                            message: '系统英文名不符合要求：系统英文名以英文或数字开头，由数字、英文字母、[-]、[ _ ]、[.] 组成,不能带有空格!',
                                            whitespace: true,
                                        },
                                        {
                                            max: 40,
                                            message: '系统英文名最大长度为40!',
                                        },
                                    ],
                                    content: <Input maxLength={40} showCount onBlur={this.onBlur.bind(this, 'identifier')} disabled={this.props.param.type != 'add'} placeholder='创建后不可更改' />,
                                },
                                {
                                    label: '所属系统',
                                    required: isEdit,
                                    content: (
                                        <TreeSelectComponent
                                            type='addDataSource'
                                            multiple={false}
                                            disabled={itemDisabled}
                                            treeSelectValue={treeNodeIds}
                                            treeSelect={this.datasourceValueChange}
                                            noResource
                                            ref={(node) => {
                                                this.routTree = node
                                            }}
                                            placeholder={itemDisabled ? '-' : '请选择'}
                                        />
                                    ),
                                },
                                // {
                                //     label: '系统安全等级',
                                //     name: 'securityLevel',
                                //     rules: [
                                //         {
                                //             required: isEdit && !itemDisabled,
                                //             message: '请选择系统安全等级!',
                                //         },
                                //     ],
                                //     content: (
                                //         <Select onChange={this.changeManager.bind(this, 'securityLevel')} disabled={!!(this.props.param.type == 'look')} placeholder='请选择'>
                                //             {levelList &&
                                //                 levelList.length > 0 &&
                                //                 levelList.map((item, index) => {
                                //                     return (
                                //                         <Option key={`securityLevel${item.id}`} value={item.id}>
                                //                             {item.name}
                                //                         </Option>
                                //                     )
                                //                 })}
                                //         </Select>
                                //     ),
                                // },
                                {
                                    label: '数仓标识',
                                    name: 'dataWarehouse',
                                    rules: [
                                        {
                                            required: isEdit && !itemDisabled,
                                            message: '请选择是否数仓标识!',
                                        },
                                    ],
                                    content: itemDisabled ? (
                                        <TextItem
                                            render={(value) => {
                                                if (value) {
                                                    return '是'
                                                } else {
                                                    return '否'
                                                }
                                            }}
                                        />
                                    ) : (
                                        <Radio.Group disabled={!(this.props.param.type == 'add' || (this.props.param.type == 'edit' && this.props.param.collectMethod == 2))}>
                                            <Radio value={true}>是</Radio>
                                            <Radio value={false}>否</Radio>
                                        </Radio.Group>
                                    ),
                                },

                                {
                                    label: '采集方式',
                                    name: 'collectMethod',
                                    hide: !itemDisabled,
                                    rules: [
                                        {
                                            required: isEdit && !itemDisabled,
                                            message: '请选择是否采集码表!',
                                        },
                                    ],
                                    content: itemDisabled ? (
                                        <TextItem
                                            render={(value) => {
                                                switch (value) {
                                                    case '1':
                                                        return '采集任务'
                                                    default:
                                                        return '模板采集'
                                                }
                                            }}
                                        />
                                    ) : (
                                        <Radio.Group
                                            onChange={this.collectMethodChange}
                                            disabled={!(this.props.param.type == 'add' || (this.props.param.type == 'edit' && this.props.param.collectMethod == 2))}
                                        >
                                            <Radio value='1'>自动采集</Radio>
                                            <Radio value='2'>手动采集</Radio>
                                        </Radio.Group>
                                    ),
                                },
                                {
                                    label: '技术归属部门',
                                    name: 'techniqueDepartmentId',
                                    rules: [
                                        {
                                            required: isEdit && !itemDisabled,
                                            message: '请选择技术归属部门!',
                                        },
                                    ],
                                    hide: !itemDisabled,
                                    content: (
                                        <RichSelect
                                            placeholder='归属部门'
                                            dataSource={departmentList}
                                            dataKey='id'
                                            onChange={this.changeManager.bind(this, 'techniqueDepartmentId')}
                                            disabled={!!(this.props.param.type == 'look')}
                                        >
                                            {departmentList &&
                                            departmentList.length > 0 &&
                                            departmentList.map((item, index) => {
                                                return (
                                                    <Option key={`techniqueDepartmentId${item.id}`} value={item.id}>
                                                        {item.departName}
                                                    </Option>
                                                )
                                            })}
                                        </RichSelect>
                                    ),
                                },
                                {
                                    label: '技术负责人',
                                    name: 'techniqueManagerId',
                                    hide: !itemDisabled,
                                    rules: [
                                        {
                                            required: isEdit && !itemDisabled,
                                            message: '请选择技术负责人!',
                                        },
                                    ],
                                    content: (
                                        <RichSelect
                                            dataSource={techUserList}
                                            dataKey='id'
                                            showSearch
                                            optionFilterProp='title'
                                            onChange={this.changeManager.bind(this, 'techniqueManagerId')}
                                            disabled={!!(this.props.param.type == 'look')}
                                            placeholder='负责人'
                                        >
                                            {techUserList &&
                                            techUserList.length > 0 &&
                                            techUserList.map((item, index) => {
                                                return (
                                                    <Option title={item.realname + item.username} key={`techniqueManagerId${item.id}`} value={item.id}>
                                                        {item.realname}（{item.username}）
                                                    </Option>
                                                )
                                            })}
                                        </RichSelect>
                                    ),
                                },
                                {
                                    label: '业务权威属主',
                                    name: 'businessMainDepartmentId',
                                    hide: true,
                                    content: (
                                        <RichSelect
                                            dataSource={departmentList}
                                            dataKey='id'
                                            allowClear
                                            onChange={this.changeManager.bind(this, 'businessMainDepartmentId')}
                                            disabled={!!(this.props.param.type == 'look')}
                                        >
                                            {departmentList &&
                                                departmentList.length > 0 &&
                                                departmentList.map((item, index) => {
                                                    return (
                                                        <Option key={`businessMainDepartmentId${item.id}`} value={item.id}>
                                                            {item.departName}
                                                        </Option>
                                                    )
                                                })}
                                        </RichSelect>
                                    ),
                                },
                                {
                                    label: '业务负责人',
                                    name: 'businessManagerId',
                                    hide: true,
                                    content: (
                                        <RichSelect
                                            dataSource={bizUserList}
                                            dataKey='id'
                                            allowClear
                                            showSearch
                                            optionFilterProp='title'
                                            onChange={this.changeManager.bind(this, 'businessManagerId')}
                                            disabled={!!(this.props.param.type == 'look')}
                                        >
                                            {bizUserList &&
                                                bizUserList.length > 0 &&
                                                bizUserList.map((item, index) => {
                                                    return (
                                                        <Option title={item.realname + item.username} key={`businessManagerId${item.id}`} value={item.id}>
                                                            {item.realname}（{item.username}）
                                                        </Option>
                                                    )
                                                })}
                                        </RichSelect>
                                    ),
                                },
                                {
                                    label: '其他业务使用部门',
                                    name: 'businessOtherDepartmentIds',
                                    hide: true,
                                    content: (
                                        <RichSelect
                                            dataSource={otherDepartmentList}
                                            dataKey='id'
                                            mode='multiple'
                                            allowClear
                                            onChange={this.changeManager.bind(this, 'businessOtherDepartmentIds')}
                                            disabled={!!(this.props.param.type == 'look') || !businessMainDepartmentId}
                                        >
                                            {otherDepartmentList &&
                                                otherDepartmentList.length > 0 &&
                                                otherDepartmentList.map((item, index) => {
                                                    return (
                                                        <Option key={`businessOtherDepartmentIds${item.id}`} value={item.id}>
                                                            {item.departName}
                                                        </Option>
                                                    )
                                                })}
                                        </RichSelect>
                                    ),
                                },
                                {
                                    label: '联系人',
                                    name: 'contactPersonId',
                                    hide: true,
                                    content: (
                                        <RichSelect
                                            dataSource={userList}
                                            dataKey='id'
                                            allowClear
                                            showSearch
                                            optionFilterProp='title'
                                            onChange={this.changeManager.bind(this, 'contactPersonId')}
                                            disabled={!!(this.props.param.type == 'look')}
                                        >
                                            {userList &&
                                                userList.length > 0 &&
                                                userList.map((item, index) => {
                                                    return (
                                                        <Option title={item.realname + item.username} key={`contactPersonId${item.id}`} value={item.id}>
                                                            {item.realname}（{item.username}）
                                                        </Option>
                                                    )
                                                })}
                                        </RichSelect>
                                    ),
                                },
                            ])}
                        </div>
                        {
                            !itemDisabled && (
                                <div className={classNames(itemDisabled ? 'MiniForm' : 'EditMiniForm width520', 'Grid2')} style={{columnGap: 8}}>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '技术归属',
                                            name: 'techniqueDepartmentId',
                                            rules: [
                                                {
                                                    required: isEdit && !itemDisabled,
                                                    message: '请选择技术归属部门!',
                                                },
                                            ],
                                            //hide: true,
                                            content: (
                                                <RichSelect
                                                    placeholder='归属部门'
                                                    dataSource={departmentList}
                                                    dataKey='id'
                                                    onChange={this.changeManager.bind(this, 'techniqueDepartmentId')}
                                                    disabled={!!(this.props.param.type == 'look')}
                                                >
                                                    {departmentList &&
                                                    departmentList.length > 0 &&
                                                    departmentList.map((item, index) => {
                                                        return (
                                                            <Option title={item.departName} key={`techniqueDepartmentId${item.id}`} value={item.id}>
                                                                {item.departName}
                                                            </Option>
                                                        )
                                                    })}
                                                </RichSelect>
                                            ),
                                        },
                                        {
                                            label: '',
                                            name: 'techniqueManagerId',
                                            //hide: true,
                                            rules: [
                                                {
                                                    required: isEdit && !itemDisabled,
                                                    message: '请选择技术负责人!',
                                                },
                                            ],
                                            content: (
                                                <RichSelect
                                                    style={{ marginTop: 29 }}
                                                    dataSource={techUserList}
                                                    dataKey='id'
                                                    showSearch
                                                    optionFilterProp='title'
                                                    onChange={this.changeManager.bind(this, 'techniqueManagerId')}
                                                    disabled={!!(this.props.param.type == 'look')}
                                                    placeholder='负责人'
                                                >
                                                    {techUserList &&
                                                    techUserList.length > 0 &&
                                                    techUserList.map((item, index) => {
                                                        return (
                                                            <Option title={item.realname + item.username} key={`techniqueManagerId${item.id}`} value={item.id}>
                                                                {item.realname}（{item.username}）
                                                            </Option>
                                                        )
                                                    })}
                                                </RichSelect>
                                            ),
                                        },
                                    ])}
                                </div>
                            )
                        }
                    </Module>
                    {
                        this.collectMethod === '1' ?
                            <Module title='技术信息'>
                                {isEdit && <Alert showIcon closable message='请填写DRIVER URL、账号、密码，成功连接数据库后，选择数据库。' type='info' />}
                                <div className={classNames(itemDisabled ? 'MiniForm' : 'EditMiniForm', 'Grid4 columnGap8')}>
                                    {RenderUtil.renderFormItems(
                                        [
                                            {
                                                label: '网段',
                                                required: isEdit,
                                                content: (
                                                    <Select disabled value={network} onChange={this.changeNetwork}>
                                                        {networkList &&
                                                        networkList.length > 0 &&
                                                        networkList.map((item, index) => {
                                                            return (
                                                                <Option key={item.key} value={item.key}>
                                                                    {item.value}
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                ),
                                            },
                                        ].concat(
                                            this.collectMethod === '1'
                                                ? [
                                                {
                                                    label: '连接方式',
                                                    name: 'dsType',
                                                    rules: [
                                                        {
                                                            required: isEdit && !itemDisabled && this.collectMethod === '1',
                                                            message: '请选择连接方式！',
                                                        },
                                                    ],
                                                    content: (
                                                        <Select
                                                            onChange={this.connectWayChange}
                                                            disabled={!!(this.props.param.type == 'look' || (this.props.param.type == 'edit' && this.props.param.collectMethod != 2))}
                                                        >
                                                            {connectWaySelect.map((item, index) => {
                                                                return (
                                                                    <Option key={item.id} value={item.id}>
                                                                        {item.name}
                                                                    </Option>
                                                                )
                                                            })}
                                                        </Select>
                                                    ),
                                                },
                                                {
                                                    label: '数据源类型',
                                                    name: 'product',
                                                    rules: [
                                                        {
                                                            required: isEdit && !itemDisabled && this.collectMethod === '1',
                                                            message: '请选择数据源类型！',
                                                        },
                                                    ],
                                                    content: (
                                                        <Select
                                                            disabled={!!(this.props.param.type == 'look' || (this.props.param.type == 'edit' && this.props.param.collectMethod != 2))}
                                                            onChange={this.productChange}
                                                        >
                                                            {productSelect.map((item, index) => {
                                                                return (
                                                                    <Option key={item.id} value={item.id}>
                                                                        {item.name}
                                                                    </Option>
                                                                )
                                                            })}
                                                        </Select>
                                                    ),
                                                },
                                                {
                                                    label: '主机地址',
                                                    name: 'hostAddress',
                                                    hide: this.collectMethod !== '1' || !itemDisabled,
                                                    rules: [
                                                        {
                                                            max: 128,
                                                            message: '主机地址最大长度为128!',
                                                        },
                                                    ],
                                                    content: <Input onBlur={this.onHostAddressBlur} disabled={itemDisabled} onChange={this.hostAdressChange} placeholder='192.168.1.1' />,
                                                },
                                                {
                                                    label: '端口号',
                                                    name: 'port',
                                                    hide: this.collectMethod !== '1' || !itemDisabled,
                                                    rules: [
                                                        {
                                                            pattern: portReg,
                                                            message: '请输入正整数!',
                                                        },
                                                    ],
                                                    content: <Input maxLength={5} disabled={itemDisabled} onChange={this.hostPortChange} placeholder='10000' />,
                                                },
                                                {
                                                    label: 'SID 或 Service Name',
                                                    hide: !hasExtraServerMode || this.collectMethod !== '1' || !itemDisabled,
                                                    name: 'oracleType',
                                                    rules: [
                                                        {
                                                            required: isEdit && !itemDisabled,
                                                            message: '请选择SID 或 Service Name!',
                                                        },
                                                    ],
                                                    content: hasExtraServerMode ? (
                                                        <Radio.Group onChange={this.oracleTypeChange} disabled={this.props.param.type == 'look'}>
                                                            {extraServerModeList.map((item) => {
                                                                return <Radio value={item.key}>{item.key}</Radio>
                                                            })}
                                                        </Radio.Group>
                                                    ) : null,
                                                },
                                                {
                                                    label: 'SID 或 Service Name 名称',
                                                    hide: !hasExtraServerMode || this.collectMethod !== '1' || !itemDisabled,
                                                    name: 'sid',
                                                    rules: [
                                                        {
                                                            required: isEdit && !itemDisabled && this.collectMethod === '1',
                                                            message: '请输入SID 或 Service Name！',
                                                        },
                                                        {
                                                            max: 16,
                                                            message: 'SID 或 Service Name最大长度为16!',
                                                        },
                                                    ],
                                                    content: hasExtraServerMode ? (
                                                        <Input disabled={itemDisabled} onChange={this.SIDChange} className='datasourinput' placeholder='请输入Service Name' />
                                                    ) : null,
                                                },
                                                {
                                                    label: '驱动类型',
                                                    hide: !extraDriverTypeList.length || this.collectMethod !== '1' || !itemDisabled,
                                                    name: 'driverOption',
                                                    content: extraDriverTypeList.length ? (
                                                        <Select disabled={this.props.param.type == 'look'} onChange={this.driverChange}>
                                                            {extraDriverTypeList.map((item) => {
                                                                return (
                                                                    <Option key={item.key} value={item.key}>
                                                                        {item.value}
                                                                    </Option>
                                                                )
                                                            })}
                                                        </Select>
                                                    ) : null,
                                                },
                                                {
                                                    label: '数据库',
                                                    hide: !dbInputShow || this.collectMethod !== '1' || !itemDisabled,
                                                    name: 'database',
                                                    rules: [
                                                        {
                                                            required: isEdit && this.state.dbInputShow,
                                                            message: '请输入数据库!',
                                                        },
                                                        {
                                                            max: 32,
                                                            message: '数据库最大长度为32!',
                                                        },
                                                    ],
                                                    content: dbInputShow ? <Input disabled={itemDisabled} onChange={this.databaseChange} placeholder='请输入数据库' /> : null,
                                                },
                                                {
                                                    label: 'DRIVER URL',
                                                    name: 'host',
                                                    hide: this.collectMethod !== '1' || !itemDisabled,
                                                    rules: [
                                                        {
                                                            required: isEdit && !itemDisabled && this.collectMethod === '1' || !itemDisabled,
                                                            message: '请输入DRIVER URL！',
                                                        },
                                                        {
                                                            max: 200,
                                                            message: 'DRIVER URL最大长度为200!',
                                                        },
                                                    ],
                                                    content: <Input onChange={this.hostChange} disabled={itemDisabled} placeholder='请输入JDBC URL(DRIVER URL最大长度为200)' />,
                                                },
                                                {
                                                    label: '账号',
                                                    name: 'username',
                                                    hide: this.collectMethod !== '1' || !itemDisabled,
                                                    // rules: [
                                                    //     {
                                                    //         max: 40,
                                                    //         message: '账号最大长度为40!',
                                                    //     },
                                                    // ],
                                                    content: <Input disabled={itemDisabled} type='text' placeholder='请输入账号' />,
                                                },
                                                {
                                                    label: '密码',
                                                    name: 'password',
                                                    hide: this.collectMethod !== '1' || !itemDisabled,
                                                    // rules: [
                                                    //     {
                                                    //         max: 40,
                                                    //         message: '密码最大长度为40!',
                                                    //     },
                                                    // ],
                                                    content: <Input type={passwordType} disabled={itemDisabled} placeholder='请输入密码' onChange={this.passwordChange} />,
                                                },

                                            ]
                                                : []
                                        )
                                    )}
                                </div>
                                <div style={{ display:  itemDisabled ? 'none' : 'grid' }} className={classNames(itemDisabled ? 'MiniForm' : 'EditMiniForm', 'Grid4 columnGap8')}>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '主机地址',
                                            name: 'hostAddress',
                                            hide: this.collectMethod !== '1',
                                            rules: [
                                                {
                                                    max: 128,
                                                    message: '主机地址最大长度为128!',
                                                },
                                            ],
                                            content: <Input onBlur={this.onHostAddressBlur} disabled={itemDisabled} onChange={this.hostAdressChange} placeholder='192.168.1.1' />,
                                        },
                                        {
                                            label: '端口号',
                                            name: 'port',
                                            hide: this.collectMethod !== '1',
                                            rules: [
                                                {
                                                    pattern: portReg,
                                                    message: '请输入正整数!',
                                                },
                                            ],
                                            content: <Input maxLength={5} disabled={itemDisabled} onChange={this.hostPortChange} placeholder='10000' />,
                                        },
                                        {
                                            label: 'SID 或 Service Name',
                                            hide: !hasExtraServerMode || this.collectMethod !== '1',
                                            name: 'oracleType',
                                            rules: [
                                                {
                                                    required: isEdit && !itemDisabled,
                                                    message: '请选择SID 或 Service Name!',
                                                },
                                            ],
                                            content: hasExtraServerMode ? (
                                                <Radio.Group onChange={this.oracleTypeChange} disabled={this.props.param.type == 'look'}>
                                                    {extraServerModeList.map((item) => {
                                                        return <Radio value={item.key}>{item.key}</Radio>
                                                    })}
                                                </Radio.Group>
                                            ) : null,
                                        },
                                        {
                                            label: 'SID 或 Service Name 名称',
                                            hide: !hasExtraServerMode || this.collectMethod !== '1',
                                            name: 'sid',
                                            rules: [
                                                {
                                                    required: isEdit && !itemDisabled && this.collectMethod === '1',
                                                    message: '请输入SID 或 Service Name！',
                                                },
                                                {
                                                    max: 16,
                                                    message: 'SID 或 Service Name最大长度为16!',
                                                },
                                            ],
                                            content: hasExtraServerMode ? (
                                                <Input disabled={itemDisabled} onChange={this.SIDChange} className='datasourinput' placeholder='请输入Service Name' />
                                            ) : null,
                                        },
                                        {
                                            label: '驱动类型',
                                            hide: !extraDriverTypeList.length || this.collectMethod !== '1',
                                            name: 'driverOption',
                                            content: extraDriverTypeList.length ? (
                                                <Select disabled={this.props.param.type == 'look'} onChange={this.driverChange}>
                                                    {extraDriverTypeList.map((item) => {
                                                        return (
                                                            <Option key={item.key} value={item.key}>
                                                                {item.value}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                            ) : null,
                                        },
                                        {
                                            label: '数据库',
                                            hide: !dbInputShow || this.collectMethod !== '1',
                                            name: 'database',
                                            rules: [
                                                {
                                                    required: isEdit && this.state.dbInputShow,
                                                    message: '请输入数据库!',
                                                },
                                                {
                                                    max: 32,
                                                    message: '数据库最大长度为32!',
                                                },
                                            ],
                                            content: dbInputShow ? <Input disabled={itemDisabled} onChange={this.databaseChange} placeholder='请输入数据库' /> : null,
                                        },
                                    ])}
                                </div>
                                <div style={{ display:  itemDisabled ? 'none' : 'grid' }} className={classNames(itemDisabled ? 'MiniForm' : 'EditMiniForm', 'Grid2 columnGap8')}>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: 'DRIVER URL',
                                            name: 'host',
                                            hide: this.collectMethod !== '1',
                                            rules: [
                                                {
                                                    required: isEdit && !itemDisabled && this.collectMethod === '1',
                                                    message: '请输入DRIVER URL！',
                                                },
                                                {
                                                    max: 200,
                                                    message: 'DRIVER URL最大长度为200!',
                                                },
                                            ],
                                            content: <Input onChange={this.hostChange} disabled={itemDisabled} placeholder='请输入JDBC URL(DRIVER URL最大长度为200)' />,
                                        },
                                    ])}
                                </div>
                                <div style={{ display:  itemDisabled ? 'none' : 'grid' }} className={classNames(itemDisabled ? 'MiniForm' : 'EditMiniForm', 'Grid4 columnGap8')}>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '账号',
                                            name: 'username',
                                            hide: this.collectMethod !== '1',
                                            // rules: [
                                            //     {
                                            //         max: 40,
                                            //         message: '账号最大长度为40!',
                                            //     },
                                            // ],
                                            content: <Input disabled={itemDisabled} type='text' placeholder='请输入账号' />,
                                        },
                                        {
                                            label: '密码',
                                            name: 'password',
                                            hide: this.collectMethod !== '1',
                                            // rules: [
                                            //     {
                                            //         max: 40,
                                            //         message: '密码最大长度为40!',
                                            //     },
                                            // ],
                                            content: <Input type={passwordType} disabled={itemDisabled} placeholder='请输入密码' onChange={this.passwordChange} />,
                                        },
                                    ])}
                                </div>
                                <div className={classNames(itemDisabled ? 'MiniForm' : 'EditMiniForm', 'Grid1')}>
                                    {RenderUtil.renderFormItems([
                                        {
                                            hide: itemDisabled || this.collectMethod !== '1',
                                            label: '',
                                            content: (
                                                <div className='HControlGroup' style={{ flexWrap: 'nowrap' }}>
                                                    <Button style={{ marginRight: 24 }} ghost loading={this.state.loadingConnect} type='primary' className='' onClick={this.connected}>
                                                        连接数据库
                                                    </Button>
                                                    <div>
                                                        <div>{connectInfo}</div>
                                                    </div>
                                                </div>
                                            ),
                                        },
                                    ])}
                                </div>
                            </Module>
                            : null
                    }
                    {Boolean(this.collectMethod === '1' && connectStatus === 2) && (
                        <React.Fragment>
                            <Module title='数据库选择'>
                                {/*<Spin spinning={loading}>*/}
                                    {renderDataBase()}
                                    {/* <Transfer
                                        className='dataSourceTransfer'
                                        dataSource={schemaData}
                                        showSearch={connectStatus == '2'}
                                        listStyle={{
                                            width: '100%',
                                            height: 400,
                                        }}
                                        titles={connectStatus != '2' ? ['', ''] : ['未选数据库', '已选数据库']}
                                        disabled={itemDisabled || connectStatus != '2'}
                                        locale={{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容' }}
                                        filterOption={this.filterOption}
                                        targetKeys={targetKeys}
                                        onChange={this.handleChange}
                                        onSearch={this.handleSearch}
                                        render={(item) => item.title}
                                    /> */}
                                {/*</Spin>*/}
                            </Module>

                            {this.connectWay === 'DICT' && (
                                <React.Fragment>
                                    <Module title='其它'>
                                        <div className='MiniForm Grid3'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '要采集的系统',
                                                    hide: dictSys.length <= 0,
                                                    name: 'systemIdent',
                                                    rules: [
                                                        {
                                                            required: isEdit && !itemDisabled,
                                                            message: '请选择要采集的系统！',
                                                        },
                                                    ],
                                                    content:
                                                        dictSys.length <= 0 ? null : (
                                                            <Select onChange={this.sysSelectChange}>
                                                                {dictSys.map((item, index) => {
                                                                    return (
                                                                        <Option key={item} value={item}>
                                                                            {item}
                                                                        </Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        ),
                                                },
                                                {
                                                    label: '需要采集的库',
                                                    hide: sysSchemaData.length <= 0,
                                                    content: (
                                                        <Spin spinning={sysSchemaLoding}>
                                                            <Transfer
                                                                className='dataSourceTransfer'
                                                                dataSource={sysSchemaData}
                                                                showSearch
                                                                listStyle={{
                                                                    width: '265px',
                                                                    height: 400,
                                                                }}
                                                                titles={['未选数据库', '已选数据库']}
                                                                disabled={itemDisabled}
                                                                locale={{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容' }}
                                                                filterOption={this.filterOption}
                                                                targetKeys={dictDatabases}
                                                                onChange={this.handleDictChange}
                                                                onSearch={this.handleSearch}
                                                                render={(item) => item.title}
                                                            />
                                                        </Spin>
                                                    ),
                                                },
                                            ])}
                                        </div>
                                    </Module>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                    <DatabaseDrawer
                        ref={(dom) => this.databaseDrawer = dom}
                        getDatabase={this.getDatabase}
                    />
                </Form>
            </React.Fragment>
        )
    }
}
