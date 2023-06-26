import EmptyLabel from '@/component/EmptyLabel'
import { Button, Col, Form, Input, message, Radio, Row, Select } from 'antd'
import { getUserList } from 'app_api/manageApi'
import { facttableDataTypes, parseCname, suggestion } from 'app_api/metadataApi'
import { factassetsColumns, factassetsSimple, getAtomicMetricsById, getBizClassifyById, getDatasourceId, listFunctions, saveOrUpdate, suggestColumnType } from 'app_api/termApi'
import React, { Component } from 'react'
import './index.less'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input

let col = 0
let spanName = 0

export default class eastUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rootInfo: {
                partitionFlag: false,
                partitionColumnEnames: [],
            },
            dataSourceConfig: true,
            databaseIdList: [],
            loading: false,
            sourceList: [],
            baseList: [],
            ddlModal: false,
            sqlContent: '',
            columnData: [],
            columnDataBackup: [],
            tableNameCn: '',
            tableNameCnWithSpace: '',
            tableNameEn: '',
            cnameDesc: '暂无词根信息',
            tableNameCnData: [],
            rootList: [],
            showDropown: false,
            dataTypeInfo: [],
            ddlLoading: false,
            dragTableLoading: false,
            codeItemIndex: 0,
            showDataType: true,
            configLimitInfo: {
                enableNotNull: false,
                enablePartition: false,
                enablePrimary: false,
            },
            showShadow: false,

            assetList: [],
            columnList: [],
            functionList: [],
            userList: [],
        }
    }
    componentDidMount = async () => {
        this.getFactassetsSimple()
        this.getListFunctions()
        this.getUserData()
        this.getDataTypes()

        if (this.props.location.state.pageType == 'edit') {
            this.getDetail()
        }
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
    getDetail = async () => {
        const { rootInfo } = this.state
        let res = await getAtomicMetricsById({ id: this.props.location.state.id })
        if (res.code == 200) {
            await this.setState({
                rootInfo: res.data,
                rootList: res.data.rootList ? res.data.rootList : [],
                tableNameCn: res.data.chineseNameSource ? res.data.chineseNameSource : '',
                tableNameEn: res.data.englishName,
                tableNameCnWithSpace: res.data.chineseNameSource ? res.data.chineseNameSource : '',
            })
            this.getFactassetsColumns()
            this.getEname()
        }
    }
    getFactassetsSimple = async () => {
        let res = await factassetsSimple()
        if (res.code == 200) {
            this.setState({
                assetList: res.data,
            })
        }
    }
    getDataTypes = async () => {
        let res = await facttableDataTypes()
        if (res.code == 200) {
            this.setState({
                dataTypeInfo: res.data,
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
    getFactassetsColumns = async () => {
        const { rootInfo } = this.state
        let query = {
            needAll: true,
            factAssetsId: rootInfo.factAssetsId,
            type: 0,
        }
        let res = await factassetsColumns(query)
        if (res.code == 200) {
            this.setState({
                columnList: res.data,
            })
        }
    }
    getListFunctions = async () => {
        let res = await listFunctions()
        if (res.code == 200) {
            this.setState({
                functionList: res.data,
            })
        }
    }
    changeAsset = async (e) => {
        const { rootInfo } = this.state
        rootInfo.factAssetsId = e
        rootInfo.factColumnId = undefined
        rootInfo.datasourceId = ''
        await this.setState({
            rootInfo,
        })
        this.getFactassetsColumns()
        this.getClassityById()
    }
    changeColumn = async (e, node) => {
        const { rootInfo } = this.state
        rootInfo.factColumnId = e
        rootInfo.factColumnNameEn = node.props.factColumnNameEn
        rootInfo.physicalColumnId = node.props.physicalColumnId
        rootInfo.datasourceId = ''
        await this.setState({
            rootInfo,
        })
        this.getDatasourceIdByColumn()
        this.getSuggestColumnType()
    }
    getDatasourceIdByColumn = async () => {
        const { rootInfo } = this.state
        let res = await getDatasourceId({ columnId: rootInfo.physicalColumnId })
        if (res.code == 200) {
            rootInfo.datasourceId = res.data
            this.setState({
                rootInfo,
            })
        }
    }
    changeDesc = (e) => {
        const { rootInfo } = this.state
        rootInfo.description = e.target.value
        this.setState({
            rootInfo,
        })
    }
    changeUser = (e, node) => {
        const { rootInfo } = this.state
        rootInfo.busiManagerId = e
        rootInfo.busiManagerName = node.props.busiManagerName
        this.setState({
            rootInfo,
        })
    }
    changeDataType = (e) => {
        const { rootInfo } = this.state
        rootInfo.dataType = e
        this.setState({
            rootInfo,
        })
    }
    changeFunction = async (e) => {
        const { rootInfo } = this.state
        rootInfo.function = e
        await this.setState({
            rootInfo,
        })
        this.getSuggestColumnType()
    }
    getSuggestColumnType = async () => {
        const { rootInfo } = this.state
        let query = {
            columnId: rootInfo.factColumnId,
            function: rootInfo.function,
        }
        let res = await suggestColumnType(query)
        if (res.code == 200) {
            rootInfo.dataType = rootInfo.dataType ? rootInfo.dataType : res.data.value
            this.setState({
                rootInfo,
            })
        }
    }
    getClassityById = async () => {
        const { rootInfo } = this.state
        let res = await getBizClassifyById({ id: rootInfo.factAssetsId })
        if (res.code == 200) {
            rootInfo.bizProcessName = res.data.name
            rootInfo.moduleNameWithParent = res.data.moduleNameWithParent
            rootInfo.themeNameWithParent = res.data.themeNameWithParent
            this.setState({
                rootInfo,
            })
        }
    }
    postData = async () => {
        const { rootInfo, columnData, tableNameCn, tableNameEn, tableNameCnWithSpace, rootList } = this.state
        let query = {
            ...rootInfo,
            rootList,
            chineseName: tableNameCn,
            chineseNameSource: tableNameCnWithSpace,
            englishName: tableNameEn,
        }
        this.setState({ loading: true })
        let res = await saveOrUpdate(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.props.addTab('指标定义')
        }
    }
    copy = () => {
        var input = document.getElementById('textarea')
        input.value = this.state.sqlContent
        input.select()
        document.execCommand('copy')
        message.success('复制成功')
    }
    onChangeTableEn = (e) => {
        this.setState({
            tableNameEn: e.target.value,
        })
    }
    onSelectTableNameCn = async (data) => {
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
        const { tableNameCn, rootInfo, rootList } = this.state
        let query = {
            cname: tableNameCn,
            datasourceId: rootInfo.datasourceId,
            position: cursurPosition,
        }
        let res = await suggestion(query)
        if (res.code == 200) {
            // res.data.map((item) => {
            //     item.selected = false
            //     rootList.map((item1) => {
            //         if (item1.id == item.id) {
            //             item.selected = true
            //         }
            //     })
            // })
            this.setState({
                tableNameCnData: res.data,
            })
        }
    }
    getEname = async () => {
        const { tableNameCn, tableNameEn, rootInfo, tableNameCnWithSpace, cnameDesc, rootList } = this.state
        let query = {
            cname: tableNameCnWithSpace,
            ename: tableNameEn,
            datasourceId: rootInfo.datasourceId,
            rootList,
        }
        let res = await parseCname(query)
        if (res.code == 200) {
            this.setState({
                tableNameEn: res.data.ename,
                cnameDesc: res.data.cnameDesc.replace(/&nbsp;/g, '\u00A0') || '暂无词根信息',
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
    render() {
        const {
            rootInfo,
            databaseIdList,
            loading,
            sourceList,
            baseList,
            columnData,
            ddlModal,
            sqlContent,
            dataSourceConfig,
            tableNameCn,
            tableNameCnData,
            tableNameEn,
            cnameDesc,
            tableNameCnWithSpace,
            showDropown,
            ddlLoading,
            dragTableLoading,
            configLimitInfo,
            showShadow,

            assetList,
            columnList,
            functionList,
            dataTypeInfo,
            userList,
        } = this.state
        console.log(columnData, 'dmDetail+++')
        return (
            <div className='commonTablePage addAtomIndexma' style={{ paddingBottom: '60px' }}>
                <div className='title'>{this.props.location.state.pageType == 'edit' ? '编辑原子指标' : '定义原子指标'}</div>
                <Form labelAlign='right' style={{ margin: '16px 0 32px 0' }}>
                    <Form.Item>
                        <Row>
                            <Col span={6} style={{ width: '120px', fontSize: '14px', textAlign: 'right' }}>
                                <span style={{ color: '#E02020' }}>*</span>来源字段：
                            </Col>
                            <Col span={16}>
                                <Select
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    style={{ width: 230 }}
                                    disabled={this.props.location.state.pageType == 'edit'}
                                    onChange={this.changeAsset}
                                    value={rootInfo.factAssetsId}
                                    placeholder='选择事实资产'
                                >
                                    {assetList.map((item) => {
                                        return (
                                            <Option title={item.name} value={item.id} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Select
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    style={{ width: 230, marginLeft: 8 }}
                                    disabled={this.props.location.state.pageType == 'edit'}
                                    onChange={this.changeColumn}
                                    value={rootInfo.factColumnId}
                                    placeholder='选择字段'
                                >
                                    {columnList.map((item) => {
                                        return (
                                            <Option
                                                physicalColumnId={item.physicalColumnId}
                                                factColumnNameEn={item.englishName}
                                                title={item.chineseName + ' ' + item.englishName}
                                                value={item.id}
                                                key={item.id}
                                            >
                                                {item.chineseName + ' ' + item.englishName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Col>
                        </Row>
                        {rootInfo.factAssetsId ? (
                            <div className='inputTip' style={{ paddingLeft: 120, fontSize: '14px', color: '#666', marginTop: 8 }}>
                                <span style={{ marginRight: '32px' }}>业务板块：{rootInfo.moduleNameWithParent || <EmptyLabel />}</span>
                                <span style={{ marginRight: '32px' }}>主题域：{rootInfo.themeNameWithParent || <EmptyLabel />}</span>
                                <span style={{ marginRight: '32px' }}>业务过程：{rootInfo.bizProcessName || <EmptyLabel />}</span>
                            </div>
                        ) : null}
                    </Form.Item>
                    <Form.Item>
                        <Row>
                            <Col span={6} style={{ width: '120px', fontSize: '14px', textAlign: 'right' }}>
                                <span style={{ color: '#E02020' }}>*</span>原子指标名称：
                            </Col>
                            <Col span={16} style={{ position: 'relative' }}>
                                <Input
                                    style={{ width: 468 }}
                                    disabled={!rootInfo.datasourceId}
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
                                    <div style={{ width: 468 }} className='tableAutoDropdown commonScroll'>
                                        {tableNameCnData.map((item) => {
                                            return (
                                                <div className='tableAutoDropdownItem' dangerouslySetInnerHTML={{ __html: item.showDesc }} onClick={this.onSelectTableNameCn.bind(this, item)}>
                                                    {/*<span dangerouslySetInnerHTML = {{ __html: item.showDesc }}></span>*/}
                                                    {/*{item.selected?<Icon style={{ float: 'right' }} type="check" />:null}*/}
                                                </div>
                                            )
                                        })}
                                        {!tableNameCnData.length ? <div style={{ color: '#666', textAlign: 'center' }}>暂无推荐，请输入进行搜索</div> : null}
                                    </div>
                                ) : null}
                            </Col>
                        </Row>
                        {cnameDesc ? (
                            <div className='inputTip' style={{ paddingLeft: 120 }}>
                                {cnameDesc}
                            </div>
                        ) : null}
                    </Form.Item>
                    <Form.Item>
                        <Row>
                            <Col span={6} style={{ width: '120px', fontSize: '14px', textAlign: 'right' }}>
                                <span style={{ color: '#E02020' }}>*</span>原子指标英文名：
                            </Col>
                            <Col span={16}>
                                <Input
                                    style={{ width: 468 }}
                                    disabled={!rootInfo.datasourceId}
                                    maxLength={64}
                                    suffix={<span style={{ color: '#B3B3B3' }}>{tableNameEn.length}/64</span>}
                                    onChange={this.onChangeTableEn}
                                    onBlur={this.onTableEnBlur}
                                    value={tableNameEn}
                                    placeholder='输入表中文名可自动匹配表英文名'
                                />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <Row>
                            <Col span={6} style={{ width: '120px', fontSize: '14px', textAlign: 'right' }}>
                                <span style={{ color: '#E02020' }}>*</span>计算逻辑：
                            </Col>
                            <Col span={16}>
                                <Select
                                    style={{ width: 230 }}
                                    disabled={this.props.location.state.pageType == 'edit' || !rootInfo.factColumnId}
                                    onChange={this.changeFunction}
                                    value={rootInfo.function}
                                    placeholder='选择计算方法'
                                >
                                    {functionList.map((item) => {
                                        return (
                                            <Option value={item.key} key={item.key}>
                                                {item.value + ' ' + item.key}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                {rootInfo.function && rootInfo.factColumnId ? (
                                    <span style={{ color: '#666', fontSize: '14px', marginLeft: 16 }}>
                                        <span>{rootInfo.function}</span>
                                        {rootInfo.factColumnNameEn ? <span>（{rootInfo.factColumnNameEn}）</span> : null}
                                    </span>
                                ) : null}
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <Row>
                            <Col span={6} style={{ width: '120px', fontSize: '14px', textAlign: 'right' }}>
                                <span style={{ color: '#E02020' }}>*</span>数据类型：
                            </Col>
                            <Col span={16}>
                                <Select style={{ width: 230 }} onChange={this.changeDataType} value={rootInfo.dataType} placeholder='选择数据类型'>
                                    {dataTypeInfo.map((item) => {
                                        return (
                                            <Option value={item} key={item}>
                                                {item}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <Row>
                            <Col span={6} style={{ width: '120px', fontSize: '14px', textAlign: 'right' }}>
                                业务口径：
                            </Col>
                            <Col span={16}>
                                <TextArea
                                    onChange={this.changeDesc}
                                    value={rootInfo.description}
                                    maxLength={128}
                                    style={{ position: 'relative', paddingTop: 8, width: 468, marginTop: 5, height: 128, resize: 'none' }}
                                    placeholder='请输入业务口径'
                                />
                                <span style={{ color: '#B3B3B3', position: 'absolute', bottom: '0', left: '428px' }}>{rootInfo.description ? rootInfo.description.length : 0}/128</span>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <Row>
                            <Col span={6} style={{ width: '120px', fontSize: '14px', textAlign: 'right' }}>
                                负责人：
                            </Col>
                            <Col span={16}>
                                <Select allowClear style={{ width: 468 }} onChange={this.changeUser} value={rootInfo.busiManagerId} placeholder='负责人'>
                                    {userList.map((item) => {
                                        return (
                                            <Option busiManagerName={item.realname} value={item.id} key={item.id}>
                                                {item.realname}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
                <div className='saveBtn' style={{ boxShadow: showShadow ? '0px 2px 14px 1px rgba(0, 0, 0, 0.1)' : 'none' }}>
                    <Button
                        type='primary'
                        disabled={!rootInfo.factColumnId || !tableNameCn || !tableNameEn || !rootInfo.function || !rootInfo.dataType}
                        loading={loading}
                        style={{ marginRight: '8px' }}
                        onClick={this.postData}
                    >
                        保存
                    </Button>
                </div>
            </div>
        )
    }
}
