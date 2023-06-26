import TableLayout from '@/component/layout/TableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Form, message, Tabs } from 'antd'
import { connectDataSource, getDataSourcedDatabase, dsMap } from 'app_api/metadataApi'
import UserService from 'app_page/services/user/userService'
import qs from 'qs'
import React, { Component } from 'react'
import './addSource.less'
import CodeCollection from './codeCollection/codeCollection'
import DataSourceSettingForm from './settingForm/dataSourceSettingForm'
const TabPane = Tabs.TabPane
import styles from './look.module.less'
import Module from '@/component/Module'
import TableLayoutHeader from '@/component/layout/TableLayoutHeader'
import classNames from 'classnames'

function transFalse(obj) {
    Object.keys(obj).forEach((v) => {
        if (obj[v] === 'false') {
            obj[v] = false
        }
    })
}

export default class LookSource extends Component {
    constructor(props) {
        super(props)

        this.state = {
            connectStatus: 0, // 第一步连接状态  四种 ：0(未连接) 1（正在连接） 2（连接成功） 3（连接失败）
            connectMsg: null, // 连接信息
            schemaData: [], // 所有库数据
            targetKeys: [], // 已选库数据
            loading: false, // 穿梭框外侧loading
            connectWay: '1',
            dictDatabases: [],
            userList: [],
        }
        const search = qs.parse(props.location.search, { ignoreQueryPrefix: true })
        console.log('search', search)
        if (!this.props.location.state) {
            transFalse(search)
            search.extra = search.extra && JSON.parse(search.extra)
            search.treeNodeIds = search.treeNodeIds.split(',')
            this.props.location.state = search
        }
    }

    componentDidMount() {
        const param = this.propsParam
        if (param.collectMethod == 1) {
            // 自动采集
            // setTimeout(() => {
            //     this.connected({ id: param.id })
            // }, 100)
        }
        this.getUserList()
    }

    connected = async (param = {}) => {
        let req = {},
            reqinfo = await this.settingForm.getConnectInfo()
        req = { ...reqinfo, ...param }
        if (req) {
            this.setState({
                connectStatus: 1,
                connectMsg: '正在连接。。。',
            })
            console.log('reqinfo', reqinfo)
            connectDataSource(req).then((res) => {
                if (res.code == '200') {
                    this.setState({
                        loading: true,
                        connectStatus: 2,
                    })
                    if (reqinfo.dsType === 'REPORT') {
                        return this.setState({
                            connectStatus: 1,
                            loading: false,
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
                                obj.disabled = true
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

    changeDictDatabase = (dictDatabases) => {
        this.setState({ dictDatabases })
    }

    getUserList = async () => {
        let userList = await UserService.getUserIdNameList()
        this.setState({
            userList,
        })
    }

    changeSteps = (way) => {
        this.setState({
            connectWay: way,
        })
    }

    get propsParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    renderCodeCollection() {
        return (
            <CodeCollection
                param={this.props.location.state}
                wrappedComponentRef={(node) => {
                    this.codeCollection = node
                }}
            />
        )
    }
    openEditPage = () => {
        dsMap({id: this.propsParam.id}).then(res => {
            if (res.code == 200) {
                this.propsParam.isDsMap = res.data
                this.props.addTab('编辑数据源', { ...this.propsParam, type: 'edit' })
            }
        })
    }

    render() {
        const { connectStatus, connectMsg, schemaData, targetKeys, loading, connectWay, dictDatabases, userList, baseInfo } = this.state

        const param = this.propsParam
        const { datasourceConnectionModifyUserName, datasourceConnectionModifiedDate } = param
        const validState = param.validState != 0
        return (
            <div className={classNames('VControlGroup', styles.look)}>
                <TableLayoutHeader
                    title={
                        <span className='HControlGroup'>
                            <span>数据源详情</span>
                            <StatusLabel syncTextColor style={{ fontSize: 14 }} type={validState ? 'success' : 'warning'} message={validState ? '生效' : '未生效'} />
                        </span>
                    }
                    renderHeaderExtra={() => {
                        return (
                            <span className={styles.HeaderExtra}>
                                <Button onClick={this.openEditPage} type="primary" ghost>编辑</Button>
                            </span>
                        )
                    }}
                />
                <DataSourceSettingForm
                    changeSteps={this.changeSteps}
                    schemaData={schemaData}
                    targetKeys={targetKeys}
                    userList={userList}
                    dictDatabases={dictDatabases}
                    loading={loading}
                    connectStatus={connectStatus}
                    connectMsg={connectMsg}
                    param={this.props.location.state}
                    connected={this.connected}
                    changeDictDatabase={this.changeDictDatabase}
                    ref={(node) => {
                        this.settingForm = node
                    }}
                />
                {this.propsParam.hasCode && this.renderCodeCollection()}
            </div>
        )
    }

    renderOld() {
        const { connectStatus, connectMsg, schemaData, targetKeys, loading, connectWay, dictDatabases, userList, baseInfo } = this.state

        const param = this.propsParam

        return (
            <TableLayout
                disabledDefaultFooter
                className='addSourceLayout'
                title={`数据源详情`}
                renderHeaderExtra={() => {
                    return (
                        <Form layout='inline'>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '状态',
                                    content:
                                        param.validState == 0 ? (
                                            <span
                                                style={{
                                                    color: '#ed0000',
                                                }}
                                            >
                                                未生效
                                            </span>
                                        ) : (
                                            '生效'
                                        ),
                                },
                                {
                                    label: '修改人',
                                    content: param.datasourceConnectionModifyUserName,
                                },
                                {
                                    label: '修改时间',
                                    content: param.datasourceConnectionModifiedDate,
                                },
                            ])}
                        </Form>
                    )
                }}
                renderDetail={() => {
                    const showCollect = this.props.location.state.collectMethod == '1' && connectWay == '1' && param.dsType !== 'REPORT'
                    return (
                        <Tabs defaultActiveKey='1'>
                            <TabPane tab='数据源配置' key='1'>
                                <DataSourceSettingForm
                                    changeSteps={this.changeSteps}
                                    schemaData={schemaData}
                                    targetKeys={targetKeys}
                                    userList={userList}
                                    dictDatabases={dictDatabases}
                                    loading={loading}
                                    connectStatus={connectStatus}
                                    connectMsg={connectMsg}
                                    param={this.props.location.state}
                                    connected={this.connected}
                                    changeDictDatabase={this.changeDictDatabase}
                                    ref={(node) => {
                                        this.settingForm = node
                                    }}
                                />
                            </TabPane>
                            {showCollect && (
                                <TabPane tab='码表采集配置' key='2'>
                                    <CodeCollection
                                        param={this.props.location.state}
                                        wrappedComponentRef={(node) => {
                                            this.codeCollection = node
                                        }}
                                    />
                                </TabPane>
                            )}
                        </Tabs>
                    )
                }}
            />
        )
    }
}
