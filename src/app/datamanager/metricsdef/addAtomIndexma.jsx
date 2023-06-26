import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Form, Input, message, Radio, Select } from 'antd'
import { getUserList } from 'app_api/manageApi'
import { facttableDataTypes, parseCname, suggestion } from 'app_api/metadataApi'
import { factassetsColumns, factassetsSimple, getAtomicMetricsById, getDatasourceId, listFunctions, saveOrUpdate, suggestColumnType } from 'app_api/termApi'
import React, { Component } from 'react'

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

        // if (this.props.location.state.pageType == 'edit') {
        //     this.getDetail()
        // }
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
        // this.getClassityById()
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
    // getClassityById = async () => {
    //     const { rootInfo } = this.state
    //     let res = await getClassifyById({ id: rootInfo.factAssetsId })
    //     if (res.code == 200) {
    //         rootInfo.bizProcessName = res.data.name
    //         rootInfo.moduleNameWithParent = res.data.moduleNameWithParent
    //         rootInfo.themeNameWithParent = res.data.themeNameWithParent
    //         this.setState({
    //             rootInfo,
    //         })
    //     }
    // }
    postData = async () => {
        const { rootInfo, columnData, tableNameCn, tableNameEn, tableNameCnWithSpace, rootList } = this.state
        const { onSuccess } = this.props
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
            if (onSuccess) {
                onSuccess()
            }
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
        const { visible, onClose } = this.props
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
        return (
            <DrawerLayout
                drawerProps={{
                    title: '定义原子指标',
                    visible,
                    onClose,
                    width: 480,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button
                                type='primary'
                                disabled={!rootInfo.factColumnId || !tableNameCn || !tableNameEn || !rootInfo.function || !rootInfo.dataType}
                                loading={loading}
                                onClick={this.postData}
                            >
                                确定
                            </Button>
                            <Button onClick={() => onClose()}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                <Form className='EditMiniForm Grid1'>
                    {RenderUtil.renderFormItems([
                        {
                            label: '来源字段',
                            required: true,
                            content: (
                                <div className='HControlGroup' style={{ justifyContent: 'stretch', flexWrap: 'nowrap' }}>
                                    <Select
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        onChange={this.changeAsset}
                                        value={rootInfo.factAssetsId}
                                        placeholder='选择事实资产'
                                        style={{ width: '100%' }}
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
                                        onChange={this.changeColumn}
                                        value={rootInfo.factColumnId}
                                        placeholder='选择字段'
                                        style={{ width: '100%' }}
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
                                </div>
                            ),
                        },
                        {
                            label: '原子指标名称',
                            required: true,
                            extra: cnameDesc,
                            content: (
                                <div style={{ position: 'relative' }}>
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
                                </div>
                            ),
                        },
                        {
                            label: '原子指标英文名',
                            required: true,
                            content: (
                                <Input
                                    maxLength={64}
                                    suffix={<span style={{ color: '#B3B3B3' }}>{tableNameEn.length}/64</span>}
                                    onChange={this.onChangeTableEn}
                                    onBlur={this.onTableEnBlur}
                                    value={tableNameEn}
                                    placeholder='输入表中文名可自动匹配表英文名'
                                />
                            ),
                        },
                        {
                            label: '计算逻辑',
                            required: true,
                            extra:
                                rootInfo.function && rootInfo.factColumnId ? (
                                    <span style={{ color: '#666', fontSize: '14px', marginLeft: 16 }}>
                                        <span>{rootInfo.function}</span>
                                        {rootInfo.factColumnNameEn ? <span>（{rootInfo.factColumnNameEn}）</span> : null}
                                    </span>
                                ) : null,
                            content: (
                                <Select disabled={!rootInfo.factColumnId} onChange={this.changeFunction} value={rootInfo.function} placeholder='选择计算方法'>
                                    {functionList.map((item) => {
                                        return (
                                            <Option value={item.key} key={item.key}>
                                                {item.value + ' ' + item.key}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            ),
                        },
                        {
                            label: '数据类型',
                            required: true,
                            content: (
                                <Select onChange={this.changeDataType} value={rootInfo.dataType} placeholder='选择数据类型'>
                                    {dataTypeInfo.map((item) => {
                                        return (
                                            <Option value={item} key={item}>
                                                {item}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            ),
                        },
                        {
                            label: '业务口径',
                            content: (
                                <div style={{ position: 'relative' }}>
                                    <TextArea
                                        onChange={this.changeDesc}
                                        value={rootInfo.description}
                                        maxLength={128}
                                        style={{ position: 'relative', marginTop: 5, height: 52 }}
                                        placeholder='请输入业务口径'
                                    />
                                    <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: 8 }}>{rootInfo.description ? rootInfo.description.length : 0}/128</span>
                                </div>
                            ),
                        },
                        {
                            label: '负责人',
                            content: (
                                <Select allowClear onChange={this.changeUser} value={rootInfo.busiManagerId} placeholder='负责人'>
                                    {userList.map((item) => {
                                        return (
                                            <Option busiManagerName={item.realname} value={item.id} key={item.id}>
                                                {item.realname}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            ),
                        },
                    ])}
                </Form>
            </DrawerLayout>
        )
    }
}
