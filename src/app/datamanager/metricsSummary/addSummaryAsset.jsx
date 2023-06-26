import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Form, Input, message, Radio, Select, Steps, Table, Tooltip } from 'antd'
import { getUserList } from 'app_api/manageApi'
import { metricsProcessFilters, parseCname, saveSummaryMetrics, suggestion, summaryDetailForEdit, summaryMetrics } from 'app_api/metadataApi'
import React, { Component } from 'react'
import './index.less'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const { Step } = Steps

let col = 0
let spanName = 0

export default class AddFactAsset extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            columnData: [],
            tableNameCn: '',
            tableNameCnWithSpace: '',
            tableNameEn: '',
            cnameDesc: '暂无词根信息',
            tableNameCnData: [],
            rootList: [],
            showDropown: false,
            showShadow: true,
            assetInfo: {
                description: '',
            },
            tableLoading: false,
            userList: [],
            disabledDesc: '需对上面内容进行选择，“*”为必填项',
            processList: [],
            queryInfo: {
                bizProcessId: undefined,
                keyword: '',
            },
        }
        this.assetColumns = [
            {
                dataIndex: 'chineseName',
                key: 'chineseName',
                title: '指标名称',
                width: 240,
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <div style={{ width: 220, overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'englishName',
                key: 'englishName',
                title: '指标英文名',
                width: 200,
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '原子指标',
                dataIndex: 'atomicMetricsChineseName',
                key: 'atomicMetricsChineseName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '统计周期',
                dataIndex: 'statisticalPeriodChineseName',
                key: 'statisticalPeriodChineseName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '业务限定',
                dataIndex: 'bizLimitChineseName',
                key: 'bizLimitChineseName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '业务过程',
                dataIndex: 'bizProcessName',
                key: 'bizProcessName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '来源事实',
                dataIndex: 'factAssetsName',
                key: 'factAssetsName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
        ]
    }
    componentDidMount = async () => {
        this.getProcessList()
        this.getTableList()
        this.getEditDetail()
        this.getUserData()
        document.addEventListener(
            'mousedown',
            function (e) {
                if (e.target.className == 'tableAutoDropdownItem' || e.target.className == 'highlight') {
                    e.preventDefault()
                }
            },
            false
        )
    }
    getProcessList = async () => {
        let res = await metricsProcessFilters({ summaryId: this.props.location.state.id })
        if (res.code == 200) {
            this.setState({
                processList: res.data,
            })
        }
    }
    getEditDetail = async () => {
        let res = await summaryDetailForEdit({ id: this.props.location.state.id })
        if (res.code == 200) {
            this.getAssetInfo(res.data)
        }
    }
    getAssetInfo = async (data) => {
        data.description = data.description ? data.description : ''
        data.type = 1
        await this.setState({
            assetInfo: data,
            // partitionData: data.columnInfos.partitionColumns,
            // columnData: data.columnInfos.normalColumns,
            rootList: data.rootList ? data.rootList : [],
            tableNameCn: data.name !== undefined ? data.name : '',
            tableNameEn: data.englishSuffixName,
            tableNameCnWithSpace: data.name !== undefined ? data.name : '',
        })
        this.getEname()
        // this.setState({
        //     tableNameEn: data.englishSuffixName
        // })
    }
    getUserData = async () => {
        let res = await getUserList({ page: 1, page_size: 99999, brief: false })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    postData = async () => {
        const { assetInfo, tableNameEn, tableNameCnWithSpace, rootList } = this.state
        let query = {
            ...assetInfo,
            name: tableNameCnWithSpace,
            englishSuffixName: tableNameEn,
            rootList: rootList,
        }
        this.setState({ loading: true })
        let res = await saveSummaryMetrics(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.back()
        }
    }

    back() {
        ProjectUtil.historyBack().catch(() => {
            this.props.addTab('汇总资产')
        })
    }
    onChangeTableEn = (e) => {
        this.setState({
            tableNameEn: e.target.value,
        })
    }
    onSelectTableNameCn = async (data) => {
        console.log(data, 'onSelectTableNameCn')
        let { rootList, tableNameCn, tableNameCnWithSpace } = this.state
        let hasRepeat = false
        rootList.map((item) => {
            if (item.id == data.id) {
                hasRepeat = true
            }
        })
        if (!hasRepeat) {
            rootList.push(data)
        }
        tableNameCn = tableNameCn.slice(0, data.startPosition) + data.descWord + tableNameCn.slice(data.endPosition) + ' '
        await this.setState({
            tableNameCn,
            tableNameCnWithSpace: tableNameCn,
            rootList,
            tableNameCnData: [],
        })
        console.log(rootList, tableNameCn, 'rootList')
        this.getEname()
    }
    onInputBlur = (e) => {
        let { tableNameCn } = this.state
        tableNameCn = tableNameCn.replace(/\s*/g, '')
        this.setState({
            tableNameCn,
            showDropown: false,
        })
        this.getEname()
    }
    onInputFocus = () => {
        let { tableNameCnWithSpace } = this.state
        this.setState({
            tableNameCn: tableNameCnWithSpace,
            showDropown: true,
        })
    }
    onChangeTableNameCn = async (e) => {
        console.log(e, 'onChangeTableNameCn')
        let { rootList } = this.state
        let str = e.target.value
        // 只能连续输入一个空格
        if (str.length > 1) {
            if (str[str.length - 1] == ' ' && str[str.length - 2] == ' ') {
                str = str.slice(0, str.length - 1)
            }
        }
        await this.setState({
            tableNameCn: str,
            tableNameCnWithSpace: str,
        })
        let tableAutoInput = document.querySelector('.tableAutoInput .ant-input')
        let cursurPosition = -1
        console.log(tableAutoInput, 'tableAutoInput.selectionStart')
        if (tableAutoInput.selectionStart) {
            cursurPosition = tableAutoInput.selectionStart
        }
        if (this.state.tableNameCn[cursurPosition] == ' ') {
            console.log('输入空格')
            this.getEname()
            this.getSuggestion(cursurPosition)
        } else {
            this.getSuggestion(cursurPosition)
        }
    }
    getSuggestion = async (cursurPosition) => {
        const { tableNameCn, assetInfo, rootList } = this.state
        let query = {
            cname: tableNameCn,
            datasourceId: assetInfo.datasourceId,
            position: cursurPosition,
        }
        let res = await suggestion(query)
        if (res.code == 200) {
            this.setState({
                tableNameCnData: res.data,
            })
        }
    }
    getEname = async () => {
        const { tableNameCn, tableNameEn, assetInfo, tableNameCnWithSpace, cnameDesc, rootList } = this.state
        let query = {
            cname: tableNameCnWithSpace,
            ename: tableNameEn,
            datasourceId: assetInfo.datasourceId,
            rootList,
        }
        let res = await parseCname(query)
        if (res.code == 200) {
            this.setState({
                tableNameEn: res.data.ename,
                cnameDesc: res.data.cnameDesc ? res.data.cnameDesc.replace(/&nbsp;/g, '\u00A0') : '暂无词根信息',
                rootList: res.data.rootList,
            })
        }
    }
    onTableEnBlur = () => {
        let { tableNameEn } = this.state
        if (tableNameEn) {
            tableNameEn = tableNameEn.replace(/\s*/g, '')
        }
        this.setState({
            tableNameEn,
        })
    }
    getShowShadow = () => {
        const { columnData } = this.state
        let tableHeight = (columnData.length + 1) * 40
        let pageHeight = document.querySelector('.exam_container_right').clientHeight - 500
        if (tableHeight > pageHeight) {
            this.setState({
                showShadow: true,
            })
        } else {
            this.setState({
                showShadow: false,
            })
        }
    }
    changeType = (e) => {
        const { assetInfo } = this.state
        assetInfo.type = e.target.value
        this.setState({
            assetInfo,
        })
    }
    changeDesc = (e) => {
        const { assetInfo } = this.state
        assetInfo.description = e.target.value
        this.setState({
            assetInfo,
        })
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
    changeUser = (e) => {
        const { assetInfo } = this.state
        assetInfo.businessManager = e
        this.setState({
            assetInfo,
        })
    }
    search = () => {
        this.getTableList()
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            bizProcessId: undefined,
            keyword: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeProcess = async (e) => {
        let { queryInfo } = this.state
        queryInfo.bizProcessId = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    getTableList = async () => {
        let { queryInfo } = this.state
        let query = {
            needAll: true,
            summaryId: this.props.location.state.id,
            ...queryInfo,
        }
        this.setState({ tableLoading: true })
        let res = await summaryMetrics(query)
        if (res.code == 200) {
            this.setState({
                columnData: res.data,
            })
        }
        this.setState({ tableLoading: false })
    }

    render() {
        const {
            loading,
            columnData,
            tableNameCn,
            tableNameCnData,
            tableNameEn,
            cnameDesc,
            tableNameCnWithSpace,
            showDropown,
            showShadow,
            assetInfo,
            tableLoading,
            userList,
            disabledDesc,
            processList,
            queryInfo,
        } = this.state

        return (
            <div className='VControlGroup addSummaryAsset' style={{ marginBottom: 60 }}>
                <TableLayout
                    disabledDefaultFooter
                    title='编辑汇总资产'
                    showFooterControl
                    renderDetail={() => {
                        return (
                            <Form>
                                {RenderUtil.renderFormItems(
                                    [
                                        {
                                            label: '统计粒度',
                                            content: assetInfo.statisticalColumn,
                                        },
                                        {
                                            label: '业务版块',
                                            content: (
                                                <React.Fragment>
                                                    <span style={{ marginRight: 32 }}>{assetInfo.bizModuleName || <EmptyLabel />}</span>
                                                    <span style={{ marginRight: 32 }}>主题域：{assetInfo.themeName || <EmptyLabel />}</span>
                                                </React.Fragment>
                                            ),
                                        },
                                        {
                                            label: '汇总资产名称',
                                            required: true,
                                            extra: cnameDesc ? <div className='inputTip'>{cnameDesc}</div> : null,
                                            content: (
                                                <React.Fragment>
                                                    <Input
                                                        className='tableAutoInput'
                                                        placeholder='请输入中文名称'
                                                        value={tableNameCn}
                                                        onChange={this.onChangeTableNameCn}
                                                        onBlur={this.onInputBlur}
                                                        onFocus={this.onInputFocus}
                                                        maxLength={64}
                                                        suffix={<span style={{ color: '#B3B3B3' }}>{tableNameCn.length}/64</span>}
                                                    />
                                                    {showDropown ? (
                                                        <div className='tableAutoDropdown commonScroll'>
                                                            {tableNameCnData.map((item) => {
                                                                return (
                                                                    <div
                                                                        className='tableAutoDropdownItem'
                                                                        dangerouslySetInnerHTML={{ __html: item.showDesc }}
                                                                        onClick={this.onSelectTableNameCn.bind(this, item)}
                                                                    ></div>
                                                                )
                                                            })}
                                                            {!tableNameCnData.length ? <div style={{ color: '#666', textAlign: 'center' }}>暂无推荐，请输入进行搜索</div> : null}
                                                        </div>
                                                    ) : null}
                                                </React.Fragment>
                                            ),
                                        },
                                        {
                                            label: '汇总资产英文名',
                                            required: true,
                                            content: (
                                                <Input
                                                    className='suffixInput'
                                                    maxLength={64}
                                                    onChange={this.onChangeTableEn}
                                                    onBlur={this.onTableEnBlur}
                                                    value={tableNameEn}
                                                    addonBefore={assetInfo.englishPrefixName}
                                                    // addonAfter={assetInfo.englishSuffixName}
                                                    suffix={<span style={{ color: '#B3B3B3' }}>{tableNameEn.length}/64</span>}
                                                    placeholder='输入中文名可自动匹配英文名'
                                                />
                                            ),
                                        },
                                        {
                                            label: '描述信息',
                                            content: (
                                                <div style={{ position: 'relative' }}>
                                                    <TextArea maxLength={128} style={{ height: 52 }} value={assetInfo.description} onChange={this.changeDesc} placeholder='请输入描述信息' />
                                                    <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: '8px' }}>
                                                        {assetInfo.description ? assetInfo.description.length : 0}/128
                                                    </span>
                                                </div>
                                            ),
                                        },
                                        {
                                            label: '负责人',
                                            content: (
                                                <Select allowClear style={{ width: '100%' }} onChange={this.changeUser} value={assetInfo.businessManager} placeholder='负责人'>
                                                    {userList.map((item) => {
                                                        return (
                                                            <Option value={item.username} key={item.username}>
                                                                {item.realname}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                            ),
                                        },
                                    ],
                                    {
                                        labelCol: { span: 3 },
                                    }
                                )}
                            </Form>
                        )
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Tooltip title={!tableNameCnWithSpace || !tableNameEn ? disabledDesc : ''}>
                                    <Button disabled={!tableNameCnWithSpace || !tableNameEn} type='primary' loading={loading} onClick={this.postData}>
                                        保存
                                    </Button>
                                </Tooltip>{' '}
                                <Button onClick={() => this.back()}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                />
                <Module title='指标详情'>
                    <div className='HControlGroup'>
                        <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索指标名称' />
                        <Select allowClear onChange={this.changeProcess} value={queryInfo.bizProcessId} placeholder='业务过程'>
                            {processList.map((item) => {
                                return (
                                    <Option title={item.name} value={item.id} key={item.id}>
                                        {item.name}
                                    </Option>
                                )
                            })}
                        </Select>

                        <Button onClick={this.reset}>重置</Button>
                    </div>
                    <Table rowKey='id' loading={tableLoading} columns={this.assetColumns} dataSource={columnData} pagination={false} scroll={{ x: 1000 }} />
                </Module>
            </div>
        )
    }
}
