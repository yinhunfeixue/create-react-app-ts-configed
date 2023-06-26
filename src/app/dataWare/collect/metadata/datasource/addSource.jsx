import TableLayout from '@/component/layout/TableLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import { CheckCircleFilled } from '@ant-design/icons'
import { Button, message, Steps, Form } from 'antd'
import RenderUtil from '@/utils/RenderUtil';
import { addSourceNew, connectDataSource, datasourceSqltest, getDataSourcedDatabase, updateTaskJobByBusiness } from 'app_api/metadataApi'
import UserService from 'app_page/services/user/userService'
import React, { Component } from 'react'
import './addSource.less'
import CodeCollection from './codeCollection/codeCollection'
import DataSourceSettingForm from './settingForm/dataSourceSettingForm'
import StatusLabel from '@/component/statusLabel/StatusLabel'


const { Step } = Steps

export default class AddSource extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sqlError: false,
            addInfo: {},
            current: 0,
            step1Display: 'block', // 第一步组件的显示隐藏
            step2Display: 'none', // 第2步组件的显示隐藏
            step3Display: 'none',
            connectStatus: 0, // 第一步连接状态  四种 ：0(未连接) 1（正在连接） 2（连接成功） 3（连接失败）
            connectMsg: null, // 连接信息
            connectSimStatus: 0, // 第一步连接状态  四种 ：0(未连接) 1（正在连接） 2（连接成功） 3（连接失败）
            saveStatus: 0, // 第二步保存状态  四种 ：0(未保存) 1（正在保存） 2（保存成功） 3（保存失败）
            saveMsg: null, // 保存信息
            schemaData: [], // 所有库数据
            targetKeys: [], // 已选库数据
            dictDatabases: [],
            loading: false, // 穿梭框外侧loading
            stepsTitles: [
                {
                    title: '数据源配置',
                },
                {
                    title: '码表采集配置',
                },
            ],
            userList: [],
            isSmratBi: false,
        }

        this.collectionWay = '1' // 1 自动  2 手动
        this.connectWay = '1' // 1 JDBC 2中间库数据字典采集
    }

    componentDidMount() {
        const { type, collectMethod, dsType } = this.pageParams
        if (type != 'add') {
            if (dsType === 'REPORT') {
                this.setState({ isSmratBi: true })
            }
            this.changeCollectionWay(collectMethod)
        }
        this.getUserList()
    }

    resetSaveStatus = () => {
        this.setState({
            saveStatus: 0,
        })
    }

    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }

    next = async () => {
        let req = {},
            req1 = await this.settingForm.getWholeInfo(),
            req2 = {}
        if (!req1) {
            return
        }
        if (this.collectionWay == '1') {
            if (this.codeCollection) {
                req2 = this.codeCollection.getFormData()
            }
        }
        req = { ...req1, ...req2 }
        if (!req.treeNodeIds) {
            message.error('请选择系统分类')
            return
        }

        if (!req.network) {
            message.error('请选择网段')
            return
        }
        this.nextFunction()
        if (this.codeCollection) {
            this.codeCollection.getProduct(req.product)
        }
    }

    getUserList = async () => {
        let userList = await UserService.getUserIdNameList()
        this.setState({
            userList,
        })
    }

    nextFunction = () => {
        const current = this.state.current + 1
        this.setState({ current, step1Display: 'none', step2Display: 'block' })
    }

    prev() {
        const current = this.state.current - 1
        this.setState({ current, step1Display: 'block', step2Display: 'none' })
    }

    connected = async (param = {}) => {
        let req = {}
        let reqinfo = await this.settingForm.getConnectInfo()
        req = { ...reqinfo, ...param }

        if (!req.username || req.username == '') {
            // 用户名不存在，不调用数据库连接
            return
        }
        console.log('param', param)
        if (!req.network) {
            message.error('请选择网段')
            return
        }
        if (req.toString() !== '{}') {
            if (this.props.location.state.type == 'edit') {
                req.id = this.props.location.state.id
            } else {
                this.setState({
                    connectStatus: 1,
                    connectMsg: '正在连接...',
                })
            }

            return connectDataSource(req).then((res) => {
                if (res.code == '200') {
                    this.setState({
                        loading: true,
                        connectStatus: 2,
                        connectMsg: (
                            <span>
                                <CheckCircleFilled style={{ color: '#2AC75E', marginRight: 4 }} />
                                {res.msg || '连接成功'}
                            </span>
                        ),
                    })
                    if (req && req.dsType === 'REPORT') {
                        this.connectWay = '3'
                        return this.setState({
                            loading: false,
                            connectStatus: 1,
                        })
                    }

                    getDataSourcedDatabase(req).then((res) => {
                        if (res.code == '200') {
                            let targetKeys = [],
                                schemaData = []
                            _.map(res.data, (item, key) => {
                                let obj = {}
                                obj.key = item.physicalDatabase
                                obj.title = item.physicalDatabase
                                obj.description = item.physicalDatabase
                                obj.selected = item.selected
                                if (item.selected) {
                                    targetKeys.push(obj.key)
                                }
                                schemaData.push(obj)
                            })
                            this.setState({
                                schemaData,
                                targetKeys,
                                loading: false,
                            })
                        } else {
                            this.setState({
                                loading: false,
                                connectStatus: 3,
                                connectMsg: res.msg ? res.msg : '获取schema数据库失败!',
                            })
                            message.error(res.msg ? res.msg : '获取schema数据库失败！')
                        }
                    })
                } else {
                    this.setState({
                        connectStatus: 3,
                        connectMsg: res.msg ? res.msg : '连接失败',
                    })
                }
            })
        }
    }

    saveTableData = async (callback) => {
        //await this.next() // 如果码表采集恢复则去掉该功能

        let req = {},
            req1 = await this.settingForm.getWholeInfo(),
            req2 = {}
        console.log('debugger', req1)
        if (!req1) {
            return
        }

        if (this.collectionWay == '1') {
            if (this.codeCollection) {
                req2 = await this.codeCollection.getFormData()
            }
        }
        req = { ...req1, ...req2 }
        console.log(req2,'req22222')
        if (req.hasCode) {
            if (!req.codeItemSql || !req.codeValueSql) {
                // message.warning('请填写SQL信息')
                return
            }
            if (this.state.codeItemSql || this.state.codeValueSql) {
                return
            }
            // if (typeof this.codeCollection.getFieldsError().codeItemSql !== 'undefined' || typeof this.codeCollection.getFieldsError().codeValueSql !== 'undefined') {
            //     return
            // }
        }
        if (this.props.location.state.type == 'edit') {
            req.id = this.props.location.state.id
        }
        req.databases = this.state.targetKeys
        if (this.connectWay == '3') {
            delete req.databases
            req.hasCode = false
        }
        if (this.connectWay == '2') {
            req.dictDatabases = this.state.dictDatabases
        }
        if (!req.treeNodeIds || !req.treeNodeIds.length) {
            message.error('请选择系统分类')
            return
        }

        if (!req.network) {
            message.error('请选择网段')
            return
        }

        // console.log(req,'reqreqreqreq')
        if (this.collectionWay == '1') {
            // 是手动采集 连接方式不是JDBC 检查仿真环境密码账号之后再提交 是JDBC 看是否码表采集 。。。
            if (this.connectWay == '2' || this.connectWay == '3') {
                this.submitData(req, callback)
            } else {
                if (req2) {
                    if (req.hasCode) {
                        this.submitData(req, callback)
                    } else {
                        req = await this.settingForm.getWholeInfo()
                        if (this.props.location.state.type == 'edit') {
                            req.id = this.props.location.state.id
                        }
                        req.databases = this.state.targetKeys
                        req.hasCode = false
                        this.submitData(req, callback)
                    }
                }
            }
        } else {
            req = await this.settingForm.getHandelInfo()
            if (this.props.location.state.type == 'edit') {
                req.id = this.props.location.state.id
            }
            this.submitData(req, callback)
        }
    }

    submitData = (req, callback) => {
        console.log(req, callback,'req+++++++++++++++')
        // req.realProduct = req.product
        addSourceNew(req).then((res) => {
            if (res.code == '200') {
                message.success(res.msg ? res.msg : '保存成功')
                this.setState({
                    saveStatus: 2,
                    saveMsg: res.msg ? res.msg : '保存成功',
                })
                updateTaskJobByBusiness({ businessType: 1001, businessName: req.dsName, businessId: req.id, network: req.network }).then((response) => {})
                if (callback && typeof callback == 'function') {
                    callback(res.data.id, req.dsName)
                } else {
                    this.setState({
                        current: 2,
                        step3Display: 'block',
                        step2Display: 'none',
                        step1Display: 'none',
                        addInfo: req
                    })
                    // this.props.addTab('数据源管理')
                }
            } else {
                this.setState({
                    saveStatus: 3,
                    saveMsg: res.msg ? res.msg : '保存失败',
                })
            }
        })
    }

    changeSchemaData = (data) => {
        this.setState({ schemaData: data })
    }
    changeTargetKeys = (targetKeys) => {
        let _this = this
        if (this.connectWay == '2') {
            // 只在中间库情况下触发
            if (targetKeys.length > 1) {
                message.warning('在选择【中间库数据字典采集】情况下，只能选择一个数据表')
            } else {
                this.setState({ targetKeys }, () => {
                    if (targetKeys.length > 0) {
                        this.setState(
                            {
                                connectStatus: 2,
                            },
                            () => {
                                _this.settingForm.getDictSysList()
                            }
                        )
                    }
                })
            }
        } else {
            this.setState({ targetKeys })
        }
    }

    changeDictDatabase = (dictDatabases) => {
        this.setState({ dictDatabases })
    }

    checkSqlChange = async (type, e) => {
        const value = e.target.value
        let req = await this.settingForm.getConnectInfo()
        req.sql = value
        if (req && req.sql) {
            datasourceSqltest(req).then((res) => {
                if (res.code != '200') {
                    this.setState({[type]: true})
                    this.codeCollection.setFieldsRerrors(type, res.msg ? res.msg : '当前输入的sql无效，请检查后重新输入！', value)
                } else {
                    this.setState({[type]: false})
                }
            })
        }
    }

    creatCollection = (type, flag, e) => {
        console.log('debuggerdebuggerdebuggerdebuggerdebugger', type)
        if (type == '1') {
            this.saveTableData(flag ? this.goAddAutoCollection : () => {})
        } else {
            this.saveTableData(
                // flag
                //     ? () => {
                //           this.props.addTab('添加手动采集任务', { from: 'dataSourceManage' })
                //       }
                //     : () => {}
            )
        }
    }

    goAddAutoCollection = (key, label) => {
        let param = {
            from: 'dataSourceManage',
            datasourceIdInfo: {
                key,
                label,
            },
        }
        this.props.addTab('编辑采集任务', param)
    }

    changeCollectionWay = (way) => {
        this.collectionWay = way
        if (way == '1' && this.connectWay == '1') {
            this.setState({
                stepsTitles: [
                    {
                        title: '数据源配置',
                    },
                    {
                        title: '码表采集配置',
                    },
                ],
            })
        } else if (way == '2') {
            this.setState({
                stepsTitles: [
                    {
                        title: '数据源配置',
                    },
                ],
            })
        }
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            console.log('--------------changeStepstart======----------')
            this.setState(state, resolve)
        })
    }

    // 这两个不一样 自动采集 并且 连接方式是JDBC的时候 才 有第二步码表采集配置 connectWay 1代表 JDBC 2代表中间库数据字典采集
    changeSteps = async (way) => {
        console.log('way', way)
        this.connectWay = way
        if (way == '1') {
            await this.setStateAsync({
                stepsTitles: [
                    {
                        title: '数据源配置',
                    },
                    {
                        title: '码表采集配置',
                    },
                ],
            })
        } else if (way == '2' || way == '3') {
            await this.setStateAsync({
                stepsTitles: [
                    {
                        title: '数据源配置',
                    },
                ],
            })
        }
    }

    closePage = () => {
        this.props.addTab('数据源管理')
    }

    render() {
        const {
            current,
            step1Display,
            step2Display,
            step3Display,
            connectStatus,
            connectMsg,
            saveStatus,
            saveMsg,
            schemaData,
            targetKeys,
            dictDatabases,
            loading,
            connectSimStatus,
            stepsTitles,
            userList,
            isSmratBi,
            addInfo
        } = this.state

        const { type, isDsMap } = this.pageParams
        const isAdd = type === 'add'
        return (
            <TableLayout
                showFooterControl
                title={isAdd ? '新增数据源' : '编辑数据源'}
                className='addSourceLayout'
                renderDetail={() => {
                    if (isDsMap) {
                        return null
                    } else {
                        return (
                            <React.Fragment>
                                <Steps size='small' current={current} style={{ marginBottom: 24 }}>
                                    <Steps.Step title='数据源信息' />
                                    <Steps.Step title='采集码表' />
                                    <Steps.Step title='完成' />
                                </Steps>
                            </React.Fragment>
                        )
                    }
                }}
                renderTable={() => {
                    return (
                        <div className='steps-content' style={{ padding: 16, background: 'white' }}>
                            <div
                                style={{
                                    display: step1Display,
                                }}
                            >
                                <DataSourceSettingForm
                                    changeSteps={this.changeSteps}
                                    changeCollectionWay={this.changeCollectionWay}
                                    schemaData={schemaData}
                                    dictDatabases={dictDatabases}
                                    targetKeys={targetKeys}
                                    saveStatus={saveStatus}
                                    saveMsg={saveMsg}
                                    changeTargetKeys={this.changeTargetKeys}
                                    changeSchemaData={this.changeSchemaData}
                                    loading={loading}
                                    connectStatus={connectStatus}
                                    connectMsg={connectMsg}
                                    connectSimStatus={connectSimStatus}
                                    param={this.pageParams}
                                    addTab={this.props.addTab}
                                    connected={this.connected}
                                    userList={userList}
                                    changeDictDatabase={this.changeDictDatabase}
                                    ref={(node) => {
                                        this.settingForm = node
                                    }}
                                />
                            </div>
                            {this.collectionWay == '2' ? null : (
                                <div
                                    style={{
                                        display: step2Display,
                                    }}
                                >
                                    <CodeCollection
                                        creatCollection={this.creatCollection}
                                        saveTableData={this.saveTableData}
                                        saveStatus={saveStatus}
                                        saveMsg={saveMsg}
                                        param={this.props.location.state}
                                        // removeTab={this.props.removeTab}
                                        addTab={this.props.addTab}
                                        resetSaveStatus={this.resetSaveStatus}
                                        checkSqlChange={this.checkSqlChange}
                                        ref={(node) => {
                                            this.codeCollection = node
                                        }}
                                    />
                                </div>
                            )}
                            <div
                                style={{
                                    display: step3Display,
                                }}
                                className="step3Content"
                            >
                                <div className="listBtn">
                                    <StatusLabel type='success' message='创建成功' />
                                </div>
                                <Form className='MiniForm DetailPart FormPart' layout='inline'>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '数据源名称',
                                            content: addInfo.dsName,
                                        },
                                        {
                                            label: '数仓标识',
                                            content: addInfo.dataWarehouse ? '是' : '否',
                                        },
                                        {
                                            label: '采集方式',
                                            content: this.collectionWay == 1 ? '采集任务' : '模板采集',
                                        },
                                        {
                                            label: '技术归属部门',
                                            content: addInfo.techniqueDepartmentName,
                                        },
                                        {
                                            label: '技术负责人',
                                            content: addInfo.techniqueManagerName,
                                        },
                                    ])}
                                </Form>
                                <div className="listBtn">
                                    <Button onClick={this.closePage} type="primary">返回列表</Button>
                                </div>
                            </div>
                        </div>
                    )
                }}
                renderFooter={() => {
                    if (current < 2) {
                        if (this.pageParams.isDsMap) {
                            return (
                                <React.Fragment>
                                    <div
                                        className='HControlGroup'
                                    >
                                        <Button type='primary' disabled={this.connectWay === '3' && connectStatus !== 1} onClick={() => this.saveTableData()}>
                                            保存
                                        </Button>
                                        <Button onClick={this.closePage}>
                                            取消
                                        </Button>
                                    </div>
                                </React.Fragment>
                            )
                        } else {
                            return (
                                <React.Fragment>
                                    {/* 第2步的按钮 */}
                                    <div
                                        className='HControlGroup'
                                        style={{
                                            display: step2Display,
                                        }}
                                    >
                                        <Button type='primary' onClick={() => this.creatCollection('1', true)}>
                                            保存并创建采集任务
                                        </Button>
                                        <Button type='primary' onClick={() => this.saveTableData()}>
                                            保存
                                        </Button>
                                    </div>
                                    {this.state.current > 0 && this.collectionWay == '1' && (
                                        <Button onClick={() => this.prev()} type='primary' ghost>
                                            上一步
                                        </Button>
                                    )}
                                    {this.collectionWay == '1' && this.connectWay == '1' ? null : (
                                        <React.Fragment>
                                            <Button className='metadata-btn-xyb' disabled={this.connectWay === '3' && connectStatus !== 1} type='primary' onClick={this.saveTableData.bind(this)}>
                                                保存
                                            </Button>
                                            <Button type='primary' disabled={this.connectWay === '3' && connectStatus !== 1} onClick={() => this.creatCollection(this.collectionWay, true)}>
                                                保存并创建采集任务
                                            </Button>
                                            <Button onClick={this.closePage} className={connectStatus == 2 ? '' : 'metadata-btn-xyb'}>
                                                取消
                                            </Button>
                                        </React.Fragment>
                                    )}

                                    {this.state.current < stepsTitles.length - 1 && !isSmratBi ? (
                                        <Button disabled={!targetKeys.length || connectStatus != 2} type='primary' onClick={() => this.next()} className='metadata-btn-xyb'>
                                            下一步
                                        </Button>
                                    ) : null}

                                    {this.connectWay == '1' ? (
                                        this.collectionWay == '1' ? (
                                            connectStatus == 2 ? (
                                                <Button onClick={this.closePage}>取消</Button>
                                            ) : (
                                                <Button onClick={this.closePage} className={connectStatus == 2 ? '' : 'metadata-btn-xyb'}>
                                                    取消
                                                </Button>
                                            )
                                        ) : null
                                    ) : null}
                                </React.Fragment>
                            )
                        }
                    } else {
                        return null
                    }
                }}
            />
        )
    }
}
