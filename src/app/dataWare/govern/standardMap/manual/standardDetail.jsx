import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Anchor, Collapse, ConfigProvider, Divider, Form, Input, message, Modal, Select, Table, Tabs, Tooltip, TreeSelect } from 'antd'
import GeneralTable from 'app_page/dama/component/generalTable'
import { observer } from 'mobx-react'
import moment from 'moment'
import React, { Component } from 'react'
// import '../style.less'
import { queryDetailInfo } from '@/api/standardApi'
import AddRule from '@/app/metadata/standard/addRule/index'
import AutoTip from '@/component/AutoTip'
import FoldAuchor from '@/component/foldAuchor/FoldAuchor'
import TableLayoutHeader from '@/component/layout/TableLayoutHeader'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import classNames from 'classnames'
import CodeValue from './standardCodeValue'
import './standardDetail.less'
import store from './store'

const { Link } = Anchor
const Panel = Collapse.Panel

const FormItem = Form.Item
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode
const { TabPane } = Tabs

const { TextArea } = Input

const formItemLayout816 = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
}

const formItemLayout_ywdy = {
    labelCol: {
        span: '3 ywdy_width_3',
    },
    wrapperCol: {
        span: '21 ywdy_width_21',
    },
}
const entityStatusSelect = [
    { key: '0', value: '未发布' },
    { key: '1', value: '已发布' },
    { key: '4', value: '废弃' },
]

@observer
class loeStandardForm extends Component {
    constructor(props) {
        super(props)
        this.scrollerRef = React.createRef()
        // 引用代码详情表格头
        this.referenceCodeColumns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 50,
            },
            {
                title: '编码取值',
                dataIndex: 'udcValue',
                key: 'udcValue',
                width: '30%',
            },
            {
                title: '编码说明',
                dataIndex: 'udcDesc',
                key: 'udcDesc',
                ellipsis: true,
                width: '30%',
            },
        ]

        this.referenceTableColumns = [
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                width: 80,
            },
            {
                title: '英文名',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => <Tooltip title={text}>{text ? <span dangerouslySetInnerHTML={{ __html: text }} /> : <EmptyLabel />}</Tooltip>,
            },
            {
                title: '中文名',
                dataIndex: 'zhName',
                key: 'zhName',
                render: (text, record) => <Tooltip title={text}>{text ? <span dangerouslySetInnerHTML={{ __html: text }} /> : <EmptyLabel />}</Tooltip>,
            },
            {
                title: '路径',
                dataIndex: 'path',
                key: 'path',
                render: (text, record) => <Tooltip title={text}>{text ? <span dangerouslySetInnerHTML={{ __html: text }} /> : <EmptyLabel />}</Tooltip>,
            },
            {
                dataIndex: 'modifiedTime',
                key: 'modifiedTime',
                title: '更新时间',
                minWidth: 150,
                render: (text) => (text !== undefined ? <Tooltip title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tooltip> : '- -'),
            },
        ]

        this.referenceTableRowSelection = {
            type: 'checkbox',
            onChange: (selectedRowKeys, selectedRows) => {
                store.referSelectedRows = selectedRows
            },
        }
        this.isDisabled = false
        this.columns = [
            {
                dataIndex: 'createTime',
                key: 'createTime',
                title: '时间',
                width: 200,
                render: (text) => (text !== undefined ? <Tooltip title={text}>{text}</Tooltip> : ''),
            },
            {
                dataIndex: 'operator',
                key: 'operator',
                title: '操作人',
                width: 200,
                render: (text, record) => {
                    let title = (record.operatorName || '') + `( ${text} )`
                    return <AutoTip content={title} />
                },
            },
            {
                dataIndex: 'standardCreateMode',
                key: 'standardCreateMode',
                title: '方式',
                width: 120,
                render: (text) => <Tooltip title={text == 1 ? '文件导入' : '页面修改'}>{text == 1 ? '文件导入' : '页面修改'}</Tooltip>,
            },
            {
                dataIndex: 'changeDescription',
                key: 'changeDescription',
                title: '变更描述',
                minWidth: 200,
                render: (text) => (text ? <Tooltip title={`修改属性${text}项`}>{`修改属性${text}项`}</Tooltip> : <EmptyLabel />),
            },
            {
                dataIndex: 'action',
                key: 'action',
                title: '操作',
                width: 100,
                render: (text, record, index) => {
                    return <a onClick={this.openDetailModal.bind(this, record)}>变更详情</a>
                },
            },
        ]
        this.state = {
            submitStatus: true,
            historyDetailModal: false,
            historyDetail: {},
            tableData: [],
            dataList: [],
            submitStatus: true,
            queryParam: {},
            selectedTag: '',
            ruleShow: true,
            detailColumns: [
                {
                    dataIndex: 'property',
                    key: 'property',
                    title: '属性',
                    width: 140,
                    render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
                },
                {
                    dataIndex: 'former',
                    key: 'former',
                    title: '变更前',
                    width: 140,
                    render: (text) => (text == null ? <EmptyLabel /> : <Tooltip title={text}>{text}</Tooltip>),
                },
                {
                    dataIndex: 'current',
                    key: 'current',
                    title: '变更后',
                    render: (text) =>
                        text == null ? (
                            <EmptyLabel />
                        ) : (
                            <Tooltip placement='topLeft' title={text}>
                                <span className='LineClamp'>{text}</span>
                            </Tooltip>
                        ),
                },
            ],
        }
    }

    referenceCodeClick = () => {
        // store.referenceCodeClick()
        this.props.addTab('标准详情', { entityId: store.referenceCode, id: store.detailData.udcCodeId }, true)
    }

    componentWillMount = async () => {
        store.getDepartment()
        store.getSelectValue()
        await this.setState({
            queryParam: this.pageParam,
        })
        this.isDisabled = !(this.state.queryParam.operate === 'edit')
        this.init()
    }
    init = async () => {
        const addInfo = this.pageParam
        const res = await queryDetailInfo({ standardId: addInfo.id })
        await this.setState({ addInfo })
        if (res.code === 200) {
            let standardEnname, standardCnname
            this.getStandardnames(res.data)
            this.setState({ dataList: res.data })
            this.setSelectedTag(res.data[0] ? res.data[0].appBaseConfigName : '')
        }
    }
    getStandardnames = (array) => {
        for (let index = 0; index < array.length; index++) {
            const element = array[index]
            for (let j = 0; j < element.metaModelDetailList.length; j++) {
                const detail = element.metaModelDetailList[j]
                const { nameEn } = detail
                const {
                    nameCn,
                    value: { value },
                } = detail
                if (nameEn === 'entityName') {
                    this.setState({ standardEnname: value.name })
                } else if (nameEn === 'entityDesc') {
                    this.setState({ standardCnname: value.name })
                }
            }
        }
    }
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    openDetailModal = (record) => {
        const { id } = record
        const historyDetailModal = !this.state.historyDetailModal
        this.setState({ historyDetailModal, historyDetail: record })
        if (historyDetailModal) {
            store.getHistoryRecordDetail({ id: id })
        }
    }

    // 获取详情数据
    async componentDidMount() {
        let form = this.props.form,
            newParam = ''
        if (this.state.queryParam.entityId) {
            newParam = { entityId: this.state.queryParam.entityId }
            store.getHistoryRecord({ entityId: this.state.queryParam.entityId })
        } else if (this.state.queryParam.id) {
            newParam = { id: this.state.queryParam.id }
        }
        await store.getStandardSourceList(newParam)
        // await store.setDetailData(form, store.detailData)
        store.getReferenceData({ standardId: this.state.queryParam.id })
    }

    renderDetail = async (params) => {
        let form = this.props.form,
            newParam = ''
        if (params.entityId) {
            newParam = { entityId: params.entityId }
        } else if (params.id) {
            newParam = { id: params.id }
        }
        await store.getStandardSourceList(newParam)
        // await store.setDetailData(form, store.detailData)
    }

    // 点击确定关闭modal
    onCancelPage = () => {
        // this.props.removeTab('标准管理-修改')
    }

    onCancel = () => {
        store.getReferenceData({ standardId: this.state.queryParam.id })
    }
    confirm = () => {
        Modal.confirm({
            title: '确定删除？',
            content: '点击确认删除',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                this.deleteMap()
            },
            onCancel() {},
        })
    }
    deleteMap = () => {
        // let fieldIds = []
        // let targetIds = []
        // store.referSelectedRows.forEach(item=>{
        //     if (item.type==="字段") {
        //         fieldIds.push(item.id)
        //     }else if (item.type==="指标"){
        //         targetIds.push(item.id)
        //     }
        // })
        let referSelectedRows = store.referSelectedRows
        if (referSelectedRows.length > 0) {
            store.delMap().then(() => {
                store.getReferenceData({ standardId: this.state.queryParam.id })
            })
        } else {
            message.error('请选择要删除的项！')
        }
    }

    onStartChange = (value) => {
        // this.setState({
        //     startDateValue: value
        // })
    }
    onEndChange = (value) => {
        // this.setState({
        //     endDateValue: value
        // })
    }
    changePage = (params) => {
        store.getHistoryRecord(params)
    }

    formatDateAtt(att) {
        if (!att) {
            return undefined
        } else if (!att.format) {
            return att
        }
        return att.format('YYYY-MM-DD')
    }

    setSelectedTag(value) {
        this.setState({ selectedTag: value })
    }

    getRuleList = (arr) => {
        this.setState({ ruleShow: arr.length > 0 })
    }

    renderStatusIcon = (status) => {
        let type, color
        switch (status) {
            case '已发布':
                color = '#339933'
                type = 'success'
                break
            case '未发布':
                color = '#FF9900'
                type = 'originWarning'
                break
            case '废弃':
                color = '#C4C8CC'
                type = 'greyWarning2'
                break
            default:
                break
        }
        return (
            <span style={{ fontSize: 14, color }}>
                <StatusLabel type={type} />
                <span> {status}</span>
            </span>
        )
    }

    render() {
        const {
            standardLevel,
            levelType,
            associationIndex,
            referenceCode,
            codeVisible,
            termEntityId,
            standardSystemSelect,
            standardLevelSelect,
            gradeSelect,
            typeSelect,
            frequencySelect,
            dataCategorySelect,
            logicTypeSelect,
            systemUsedSelect,
            dataUnitSelect,
            controlDeptSelect,
            coSectorSelect,
            referenceTableData,
            historyRecordList,
            historyRecordDetail,
            tablePagination,
            tableLoading,
            detailTableLoading,
            detailData,
            tablePaginationRecord,
        } = store
        const { submitStatus, tableData, historyDetailModal, detailColumns, selectedTag, dataList, addInfo, historyDetail, standardEnname, standardCnname, ruleShow } = this.state
        let controlDept = detailData.controlDept ? parseInt(detailData.controlDept) : ''
        let coSector = detailData.coSector ? parseInt(detailData.coSector) : ''

        // for循环获取值
        const loop = (data) =>
            data.map((item) => {
                if (item.children && item.children.length) {
                    let children = item.children.slice()
                    return (
                        <TreeNode key={item.id} value={item.id.toString()} title={item.name}>
                            {loop(children)}
                        </TreeNode>
                    )
                }
                return <TreeNode key={item.id} isLeaf value={item.id.toString()} title={item.name} />
            })
        return (
            <React.Fragment>
                <div id='pageContent'>
                    <TableLayoutHeader
                        title={
                            <span>
                                {detailData.entityId || ''} <span style={{ marginLeft: 12 }}>{this.renderStatusIcon(detailData.entityStatus)}</span>
                            </span>
                        }
                    />
                    <div className='dataWare_standardDetail' ref={this.scrollerRef}>
                        <div className='VControlGroup Body commonScroll'>
                            {dataList.map((metaModel, index) => {
                                return (
                                    <React.Fragment>
                                        <div id={metaModel.appBaseConfigName}>
                                            <Module title={metaModel.appBaseConfigName}>
                                                <Form className='LMiniForm Grid2Mini'>
                                                    {RenderUtil.renderFormItems(
                                                        metaModel.metaModelDetailList.map((detail) => {
                                                            const {
                                                                nameCn,
                                                                value: { value },
                                                            } = detail
                                                            return {
                                                                label: nameCn,
                                                                content:
                                                                    value.name && value.name.length > 24 ? (
                                                                        <Tooltip placement='top' title={value.name}>
                                                                            <span className='LineClamp'>{value.name || <EmptyLabel />}</span>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        <span className='LineClamp'>{value.name || <EmptyLabel />}</span>
                                                                    ),
                                                            }
                                                        })
                                                    )}
                                                </Form>
                                                {addInfo.standardLevel === '代码标准' && metaModel.appBaseConfigName === '技术属性' && <CodeValue param={this.state.queryParam} {...this.props} />}
                                            </Module>
                                        </div>
                                        {addInfo.id && addInfo.standardLevel === '基础标准' && metaModel.appBaseConfigName === '业务属性' && ruleShow && (
                                            <div id='ruleList' className='tableInfo'>
                                                <Module title='校验规则'>
                                                    <AddRule onChange={this.getRuleList} readOnly={true} standardId={addInfo.id} />
                                                </Module>
                                            </div>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                            <div id='relations'>
                                <Module title='映射关系'>
                                    <ConfigProvider
                                        renderEmpty={() => {
                                            return <EmptyIcon />
                                        }}
                                    >
                                        <Table rowKey='id' columns={this.referenceTableColumns} pagination={tablePaginationRecord} dataSource={referenceTableData} />
                                    </ConfigProvider>
                                </Module>
                            </div>
                            <div id='records'>
                                <Module title='变更记录'>
                                    <GeneralTable
                                        tableProps={{
                                            tableData: historyRecordList,
                                            columns: this.columns,
                                            tableLoading,
                                            bordered: false,
                                            rowKey: 'id',
                                        }}
                                        paginationProps={{
                                            pagination: tablePagination,
                                            getTableData: this.changePage,
                                            showSizeChanger: true,
                                            showQuickJumper: true,
                                        }}
                                    />
                                </Module>
                            </div>
                        </div>
                        {/* 左侧标签 */}
                        {dataList.length > 0 && (
                            <FoldAuchor
                                affix={false}
                                getContainer={() => document.getElementById('pageContent')}
                                onChange={(value) => {
                                    this.setSelectedTag(value.slice(1) || dataList[0].appBaseConfigName)
                                }}
                            >
                                {dataList.map((groupItem) => {
                                    const { appBaseConfigName } = groupItem
                                    const selected = appBaseConfigName === selectedTag
                                    return (
                                        <React.Fragment>
                                            <Link
                                                title={appBaseConfigName}
                                                href={`#${appBaseConfigName}`}
                                                className={classNames('TypeTag', selected ? 'TypeTagSelected' : '')}
                                                key={appBaseConfigName}
                                            />
                                            {addInfo.id && addInfo.standardLevel === '基础标准' && groupItem.appBaseConfigName === '业务属性' && ruleShow && (
                                                <Link className={classNames('TypeTag', selectedTag === 'ruleList' ? 'TypeTagSelected' : '')} href={`#ruleList`} title='校验规则' />
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                                {/* {levelType == 3 && (
                                        <Link title='代码值' href={`#codevalue`} className={classNames('TypeTag', selectedTag === 'codevalue' ? 'TypeTagSelected' : '')} key='codevalue' />
                                    )} */}
                                <Link title='映射关系' href={`#relations`} className={classNames('TypeTag', selectedTag === 'relations' ? 'TypeTagSelected' : '')} key='relations' />
                                <Link title='变更记录' href={`#records`} className={classNames('TypeTag', selectedTag === 'records' ? 'TypeTagSelected' : '')} key='records' />
                            </FoldAuchor>
                        )}
                    </div>
                </div>
                <DrawerLayout
                    drawerProps={{
                        title: '变更详情',
                        visible: historyDetailModal,
                        onClose: this.openDetailModal,
                        destroyOnClose: true,
                        width: 640,
                    }}
                >
                    <div style={{ color: '#2D3033', fontSize: 18, fontWeight: 600 }}>
                        {standardCnname} {standardEnname && `[${standardEnname}]`}
                    </div>
                    <div style={{ color: '#5E6266' }}>
                        <span>变更时间: {historyDetail.createTime}</span>
                        <span style={{ marginLeft: 40 }}>变更描述: {`修改属性${historyDetail.changeDescription}项`} </span>
                    </div>
                    <Divider style={{ marginTop: 16 }} />
                    <Module title='变更记录' style={{ padding: 0 }}>
                        <GeneralTable
                            tableProps={{
                                tableData: historyRecordDetail,
                                columns: detailColumns,
                                rowKey: 'id',
                                tableLoading: detailTableLoading,
                            }}
                            paginationProps={{ pagination: { isNull: true } }}
                        />
                    </Module>
                </DrawerLayout>
                <div className='dopTitle'>- DOP数据运营平台 -</div>
            </React.Fragment>
        )
    }
}

const AddForm = loeStandardForm
export default AddForm
