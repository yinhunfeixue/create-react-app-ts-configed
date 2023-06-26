import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import { Alert, Cascader, Col, Form, Input, message, Modal, Row, Select, Spin, Tree } from 'antd'
import { getUserList } from 'app_api/manageApi'
import { deleteDerById, derivativeMetricsSearch, existsAtomicMetrics, getDerBizModuleAndTheme, getDerBizProcess, getDerById, updateDerivativeMetrics } from 'app_api/termApi'
import { LzTable } from 'app_component'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import DeriveDetailDrawer from './deriveDetailDrawer'
import './index.less'

const confirm = Modal.confirm
const { TextArea } = Input
const { TreeNode } = Tree

export default class AtomIndexma extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            queryInfo: {
                bizModuleIds: [],
                keyword: '',
                themeIds: [],
            },
            total: 0,
            editType: 1,
            editInfo: {},
            showSearchResult: false,
            checkbox: false,

            processModal: false,
            bizClassifyDefList: [],
            themeDefList: [],
            bizModuleIdList: [],
            themeIdList: [],

            detailModal: false,
            detailInfo: {
                atomicMetricsDTO: {},
                businessLimitDTO: {},
                statisticalPeriodDTO: {},
            },
            assetList: [{ id: 1 }],
            processList: [],
            bizModuleDefList: [],
            btnLoading: false,
            userList: [],
            existsAtomic: true,
            atomDetailModal: false,
            atomDetailInfo: {},
            periodDetailModal: false,
            periodDetailInfo: {},
            businessDetailModal: false,
            businessDetailInfo: {},
            sqlLoading: false,
            sqlContent: '',
        }

        this.pageSizeOptions = ['10', '20', '30', '40', '50']
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 60,
                fixed: 'left',
            },
            {
                title: '指标名称',
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: 280,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span style={{ cursor: 'pointer', color: '#1890ff' }} onClick={this.openDetailModal.bind(this, record)}>
                                {text}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '指标英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 240,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务板块',
                dataIndex: 'moduleNameWithParent',
                key: 'moduleNameWithParent',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '主题域',
                dataIndex: 'themeNameWithParent',
                key: 'themeNameWithParent',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务过程',
                dataIndex: 'bizProcessName',
                key: 'bizProcessName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务口径',
                dataIndex: 'description',
                key: 'description',
                width: 200,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 80,
                fixed: 'right',
                render: (text, record, index) => {
                    return (
                        <div>
                            <Tooltip title='编辑'>
                                <img className='editImg' onClick={this.openEditModal.bind(this, record, 'edit')} src={require('app_images/edit.png')} />
                            </Tooltip>
                            <Tooltip title='删除'>
                                <img className='editImg' onClick={this.deleteData.bind(this, record)} src={require('app_images/delete.png')} />
                            </Tooltip>
                        </div>
                    )
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getAssetList()
        this.getTableList({})
        this.getSearchConditionBizModuleAndTheme()
        this.getProcessList()
        this.getUserData()
    }
    getAssetList = async () => {
        let res = await existsAtomicMetrics()
        if (res.code == 200) {
            this.setState({
                existsAtomic: res.data,
            })
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
    openDetailModal = async (data) => {
        this.deriveDrawer.openDetailModal(data)
    }
    getSearchConditionBizModuleAndTheme = async () => {
        let res = await getDerBizModuleAndTheme()
        if (res.code == 200) {
            this.setState({
                bizClassifyDefList: this.deleteSubList(res.data.bizModuleDefList),
                themeDefList: this.deleteSubList(res.data.themeDefList),
            })
        }
    }
    deleteSubList = (data) => {
        data.map((item) => {
            if (!item.subList.length) {
                delete item.subList
            } else {
                this.deleteSubList(item.subList)
            }
        })
        console.log(data, 'deleteSubList')
        return data
    }
    deleteData = async (data) => {
        if (data.beUsed) {
            message.info('使用中无法删除')
            return
        }
        let that = this
        confirm({
            title: '你确定要删除吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                deleteDerById({ id: data.id }).then((res) => {
                    if (res.code == 200) {
                        message.success('删除成功')
                        that.getTableList()
                        // that.getSearchConditionBizModuleAndTheme()
                        // that.getProcessList()
                    }
                })
            },
        })
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let { queryInfo } = this.state
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            bizModuleId: queryInfo.bizModuleIds.length ? queryInfo.bizModuleIds[queryInfo.bizModuleIds.length - 1] : '',
            themeId: queryInfo.themeIds.length ? queryInfo.themeIds[queryInfo.themeIds.length - 1] : '',
        }
        this.setState({ loading: true })
        let res = await derivativeMetricsSearch(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                tableData: res.data,
                total: res.total,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
        }
        this.setState({ loading: false })
    }
    search = () => {
        this.setState({
            showSearchResult: true,
        })
        this.getTableList()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    openEditModal = async (data, pageType) => {
        data.pageType = pageType
        if (pageType == 'edit') {
            let res = await getDerById({ id: data.id })
            if (res.code == 200) {
                this.setState({
                    editModal: true,
                    editInfo: res.data,
                })
            }
        } else {
            this.props.addTab('定义衍生指标', data)
        }
    }
    cancel = () => {
        this.setState({
            detailModal: false,
            deleteModal: false,
            loading: false,
            editModal: false,
        })
    }
    checkOther = (e) => {
        this.setState({
            checkbox: e.target.checked,
        })
    }
    changeBusi = async (value, selectedOptions) => {
        console.log(value, selectedOptions)
        let { queryInfo } = this.state
        queryInfo.bizModuleIds = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeTheme = async (value, selectedOptions) => {
        console.log(value, 'value')
        let { queryInfo } = this.state
        queryInfo.themeIds = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    getProcessList = async () => {
        let res = await getDerBizProcess()
        if (res.code == 200) {
            this.setState({
                processList: res.data,
            })
        }
    }
    changeType = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    openBusinessPage = () => {
        this.props.addTab('定义原子指标', { pageType: 'add' })
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
            themeIds: [],
            bizModuleIds: [],
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeName = (name, e) => {
        const { editInfo } = this.state
        editInfo[name] = e.target.value
        this.setState({
            editInfo,
        })
    }
    postData = async () => {
        this.setState({ btnLoading: true })
        let res = await updateDerivativeMetrics(this.state.editInfo)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.getTableList()
        }
    }
    onChangeUser = (e, node) => {
        const { editInfo } = this.state
        editInfo.busiManagerId = e
        editInfo.busiManagerName = node.props.busiManagerName
        this.setState({
            editInfo,
        })
    }
    render() {
        let {
            tableData,
            loading,
            queryInfo,
            total,
            editType,
            editInfo,
            showSearchResult,
            deleteModal,
            checkbox,
            processModal,
            themeDefList,
            bizClassifyDefList,
            bizModuleIdList,
            themeIdList,
            detailModal,
            assetList,
            processList,
            editModal,
            btnLoading,
            userList,
            existsAtomic,
        } = this.state
        return (
            <div>
                {!existsAtomic ? (
                    <Spin spinning={loading}>
                        <Alert
                            closable
                            style={{ margin: '24px 0 16px 0' }}
                            message='帮助提示'
                            description={
                                <div>
                                    <div>定义衍生指标前需要完成原子指标定义。</div>
                                    <Button onClick={this.openBusinessPage} style={{ fontSize: '14px', paddingLeft: 0 }} type='link'>
                                        定义原子指标
                                    </Button>
                                </div>
                            }
                            type='info'
                            showIcon
                        />
                    </Spin>
                ) : null}
                {showSearchResult || total ? (
                    <div className='searchArea'>
                        <Button onClick={this.openEditModal.bind(this, {}, 'add')} type='primary'>
                            定义衍生指标
                        </Button>
                        <div style={{ float: 'right' }}>
                            <Cascader
                                allowClear
                                fieldNames={{ label: 'name', value: 'id', children: 'subList' }}
                                options={bizClassifyDefList}
                                value={queryInfo.bizModuleIds}
                                style={{ width: '120px', marginRight: '8px' }}
                                displayRender={(e) => e.join('-')}
                                onChange={this.changeBusi}
                                placeholder='业务板块'
                            />
                            <Cascader
                                allowClear
                                fieldNames={{ label: 'name', value: 'id', children: 'subList' }}
                                options={themeDefList}
                                value={queryInfo.themeIds}
                                style={{ width: '120px', marginRight: '8px' }}
                                displayRender={(e) => e.join('-')}
                                onChange={this.changeTheme}
                                placeholder='主题域'
                            />
                            <Select
                                allowClear
                                onChange={this.changeType.bind(this, 'bizProcessId')}
                                value={queryInfo.bizProcessId}
                                style={{ width: '120px', marginRight: '8px' }}
                                placeholder='业务过程'
                            >
                                {processList.map((item) => {
                                    return (
                                        <Option title={item.name} value={item.id} key={item.id}>
                                            {item.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                            <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} style={{ width: 180 }} placeholder='搜索指标' />
                            <Button onClick={this.reset} style={{ marginLeft: 8 }} className='searchBtn'>
                                重置
                            </Button>
                        </div>
                    </div>
                ) : null}
                {showSearchResult || total ? (
                    <div>
                        <LzTable
                            key='1'
                            columns={this.columns}
                            dataSource={tableData}
                            ref={(dom) => {
                                this.lzTableDom = dom
                            }}
                            getTableList={this.getTableList}
                            loading={loading}
                            rowKey='id'
                            pagination={{
                                showQuickJumper: true,
                                showSizeChanger: true,
                            }}
                            scroll={{ x: 1500 }}
                        />
                    </div>
                ) : (
                    <Spin spinning={loading}>
                        <div className='emptyIconArea' style={{ marginTop: 24 }}>
                            <div className='iconContent'>
                                <EmptyIcon description='您还未定义任何衍生指标' />
                                <Button disabled={!existsAtomic} style={{ marginTop: 16 }} type='primary' onClick={this.openEditModal.bind(this, {}, 'add')}>
                                    定义衍生指标
                                </Button>
                            </div>
                        </div>
                    </Spin>
                )}
                <Modal
                    title='编辑衍生指标'
                    visible={editModal}
                    onCancel={this.cancel}
                    width={700}
                    className='commonModal'
                    footer={[
                        <Button key='back' onClick={this.cancel}>
                            取消
                        </Button>,
                        <Button disabled={!editInfo.chineseName || !editInfo.englishNameTail} onClick={this.postData} key='submit' type='primary' loading={btnLoading}>
                            确定
                        </Button>,
                    ]}
                >
                    <div>
                        <Form labelAlign='left'>
                            <Form.Item>
                                <Row>
                                    <Col span={5} className='formLabelRight'>
                                        <span style={{ color: '#f23f30' }}>*</span>衍生指标名称：
                                    </Col>
                                    <Col span={19}>
                                        <Input
                                            style={{ paddingRight: '55px !important' }}
                                            maxLength={64}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{editInfo.chineseName ? editInfo.chineseName.length : 0}/64</span>}
                                            value={editInfo.chineseName}
                                            onChange={this.changeName.bind(this, 'chineseName')}
                                            placeholder='请输入中文名称'
                                        />
                                    </Col>
                                    <Col span={5} className='formLabelRight'>
                                        <span style={{ color: '#f23f30' }}>*</span>衍生指标英文名：
                                    </Col>
                                    <Col span={19}>
                                        <Input
                                            style={{ paddingRight: '55px !important' }}
                                            maxLength={64}
                                            addonBefore={editInfo.englishNameHead}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{editInfo.englishNameTail ? editInfo.englishNameTail.length : 0}/64</span>}
                                            value={editInfo.englishNameTail}
                                            onChange={this.changeName.bind(this, 'englishNameTail')}
                                            placeholder='请输入英文名称'
                                        />
                                    </Col>
                                    <Col span={5} className='formLabelRight'>
                                        业务口径：
                                    </Col>
                                    <Col span={19}>
                                        <TextArea
                                            maxLength={128}
                                            style={{ position: 'relative', paddingTop: 8, resize: 'none', height: 88 }}
                                            value={editInfo.description}
                                            onChange={this.changeName.bind(this, 'description')}
                                            placeholder='请输入描述信息'
                                        />
                                        <span style={{ color: '#B3B3B3', position: 'absolute', bottom: '0', right: '8px' }}>{editInfo.description ? editInfo.description.length : 0}/128</span>
                                    </Col>
                                    <Col span={5} className='formLabelRight'>
                                        负责人：
                                    </Col>
                                    <Col span={19}>
                                        <Select allowClear placeholder='请选择负责人' value={editInfo.busiManagerId} onChange={this.onChangeUser}>
                                            {userList &&
                                                userList.map((item) => {
                                                    return (
                                                        <Select.Option busiManagerName={item.realname} key={item.id} value={item.id}>
                                                            {item.realname}
                                                        </Select.Option>
                                                    )
                                                })}
                                        </Select>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
                <DeriveDetailDrawer
                    ref={(dom) => {
                        this.deriveDrawer = dom
                    }}
                    {...this.props}
                />
            </div>
        )
    }
}
