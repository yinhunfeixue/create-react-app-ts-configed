import { Input, message, Radio, Spin, Tooltip } from 'antd'
import { formulaFunction, formulaTable, dimassetsFormulaLeftTree, factassetsFormulaLeftTree } from 'app_api/addNewColApi'
import { getTableAndColumn } from 'app_api/etldatasetApi'
import { searchMetricsBusiness } from 'app_api/wordSearchApi'
import CollspeWarp from 'app_component_main/collspeWarp'
import Measure from 'app_images/度量.svg'
import Date from 'app_images/日期.svg'
import Dimension from 'app_images/维度.svg'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import store from '../store'
import './index.less'
import Sugesstion from './searchBlock'

const { Search } = Input

@observer
export default class Formula extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 可选文本函数
            textList: [],
            // 字段列表
            columnList: [],
            // 运算符
            operator: ['+', '-', '*', '/', '(', ')', '>', '<', '<=', '>=', '==', '!='],
            keyword: '',
            loading: false,
        }
    }

    componentDidMount = async () => {
        this.getDataList()
        this.getTablelist()
    }
    // 获取可用的函数和数据列表
    getDataList = async () => {
        let res = await formulaFunction()
        if (res.code === 200) {
            this.setState({
                textList: res.data,
            })
        }
    }
    getTablelist = async (keyword) => {
        let { columnList } = this.state
        let params = {}
        if (keyword) {
            params.keyword = keyword
        }
        if (this.props.createETL) {
            this.setState({
                loading: true,
            })
            params.businessId = store.tempBusinessId
            params.stepNum = 2
            // params.usingBusinessIds = store.usingBusinessIds
            if (store.ifProcess) {
                params.etlProcessId = store.etlProcessId
            }
            let res = await getTableAndColumn(params)
            if (res.code === 200) {
                this.setState({
                    loading: false,
                })
                this.setState({
                    columnList: res.data.usableBusiness,
                })
            }
            return
        }
        if (this.props.addDimensionAsset || this.props.addFactAsset) {
            this.setState({
                loading: true,
            })
            params.assetsId = this.props.businessIds[0]
            params.needAll = true
            let res = {}
            if (this.props.addDimensionAsset) {
                res = await dimassetsFormulaLeftTree(params)
            } else {
                res = await factassetsFormulaLeftTree(params)
            }
            if (res.code === 200) {
                columnList = []
                res.data.map((item) => {
                    columnList.push({
                        cname: item.cname,
                        children: [item],
                    })
                })
                this.setState({
                    loading: false,
                })
                this.setState({
                    columnList,
                })
            }
            return
        }
        if (this.props.scope === 1) {
            params.businessId = store.businessId
            let res = await formulaTable(params)
            if (res.code === 200) {
                this.setState({
                    columnList: res.data,
                })
            }
        } else {
            this.setState({
                loading: true,
            })
            let businessId = store.businessId.toString()
            params.businessIds = businessId.split(',')
            params.usingBusinessIds = store.usingBusinessIds
            let res = await searchMetricsBusiness(params)
            if (res.code === 200) {
                this.setState({
                    loading: false,
                })
                // let list = res.data.usableBusiness.map((value, index) => {
                //     return value.businessId
                // })
                // store.setBusinessId(list)
                this.setState({
                    columnList: res.data.usableBusiness,
                })
            }
        }
    }
    // 搜索字段
    onSearch = (value) => {
        this.setState({
            keyword: value,
        })
        this.getTablelist(value)
    }
    // 更改类型
    changeType = (e) => {
        store.setColumnType(e.target.value)
    }
    // 添加新函数
    addNewFun = (name) => {
        this.searchWord.setItem(name, 1)
    }
    // 添加新字段/运算符
    addNewContent = (name) => {
        this.searchWord.setItem(name, 2)
    }

    addNewOperator = (name) => {
        this.searchWord.setItem(name, 3)
    }

    // 增加新列
    addMethod = async (params) => {
        this.props.addMethod(params)
    }
    getTooltip = (val) => {
        return <div dangerouslySetInnerHTML={{ __html: val.replace(/(\r\n|\n|\r)/gm, '<br/>') }}></div>
    }
    render() {
        const { textList, columnList, operator, loading } = this.state
        const { columnType, definition, errTip } = store
        const { scope, formulaList } = this.props
        return (
            <div className='formula'>
                <div className='formulaOption'>
                    {textList.map((value, index) => {
                        return (
                            <CollspeWarp title={value.name + '(' + value.count + ')'} key={index}>
                                {value.children.map((val, index) => {
                                    return (
                                        <Tooltip placement='leftBottom' title={this.getTooltip(val.comment)}>
                                            <div key={index} className='selectOption' onClick={this.addNewFun.bind(this, val.name)}>
                                                {val.name}
                                            </div>
                                        </Tooltip>
                                    )
                                })}
                            </CollspeWarp>
                        )
                    })}
                </div>
                <div className='tableList'>
                    <div className='searchBtn'>
                        <Search placeholder='请输入' size='small' onSearch={this.onSearch} style={{ width: 154 }} />
                    </div>
                    <Spin spinning={loading}>
                        {scope === 1 ? (
                            <div className='searchResult'>
                                {columnList.map((value, index) => {
                                    return (
                                        <CollspeWarp title={value.name + '(' + value.count + ')'} key={index}>
                                            {value.children.map((val, index) => {
                                                return (
                                                    <div key={index} className='selectOption' onClick={this.addNewContent.bind(this, val.name)}>
                                                        <div className='itemType'>
                                                            {val.type === '1' && <img src={Measure} />}
                                                            {val.type === '2' && <img src={Dimension} />}
                                                            {val.type === '3' && <img src={Date} />}
                                                        </div>
                                                        <div className='itemText'>{val.name}</div>
                                                    </div>
                                                )
                                            })}
                                        </CollspeWarp>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className='searchResult'>
                                {columnList.map((value, index) => {
                                    return value.children.length === 1 && value.cname === value.children[0].cname ? (
                                        <CollspeWarp title={value.children[0].cname + '(' + value.children[0].count + ')'}>
                                            {value.children[0].metrics.map((val, index) => {
                                                return (
                                                    <Tooltip placement='top' title={val.cname} key={index}>
                                                        <div key={index} className='selectOption' onClick={this.addNewContent.bind(this, val.cname)}>
                                                            <div className='itemType'>
                                                                {val.columnType === 1 && <img src={Measure} />}
                                                                {val.columnType === 2 && <img src={Dimension} />}
                                                                {val.columnType === 3 && <img src={Date} />}
                                                            </div>
                                                            <div className='itemText'>{val.cname}</div>
                                                        </div>
                                                    </Tooltip>
                                                )
                                            })}
                                        </CollspeWarp>
                                    ) : (
                                        <CollspeWarp title={value.cname + '(' + value.count + ')'} key={index}>
                                            {value.children &&
                                                value.children.map((value1, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <div className='selectTopic'>{value1.cname}</div>
                                                            {value1.metrics.map((val, index) => {
                                                                return (
                                                                    <Tooltip placement='top' title={val.cname} key={index}>
                                                                        <div className='selectOption' onClick={this.addNewContent.bind(this, val.cname)}>
                                                                            <div className='itemType'>
                                                                                {val.columnType == 1 && <img src={Measure} />}
                                                                                {val.columnType == 2 && <img src={Dimension} />}
                                                                                {val.columnType == 3 && <img src={Date} />}
                                                                            </div>
                                                                            <div className='itemText'>{val.cname}</div>
                                                                        </div>
                                                                    </Tooltip>
                                                                )
                                                            })}
                                                        </div>
                                                    )
                                                })}
                                        </CollspeWarp>
                                    )
                                })}
                                {formulaList.length > 0 && (
                                    <CollspeWarp title={'计算公式'}>
                                        {formulaList.map((val, index) => {
                                            return (
                                                <Tooltip placement='top' title={!val.usable ? '不可使用' : val.cname} key={index}>
                                                    <div key={index} className='selectOption' onClick={val.usable && this.addNewContent.bind(this, val.cname)}>
                                                        <div className='itemType'>
                                                            {val.columnType === 1 && <img src={Measure} />}
                                                            {val.columnType === 2 && <img src={Dimension} />}
                                                            {val.columnType === 3 && <img src={Date} />}
                                                        </div>
                                                        <div className='itemText'>{val.cname}</div>
                                                    </div>
                                                </Tooltip>
                                            )
                                        })}
                                    </CollspeWarp>
                                )}
                            </div>
                        )}
                    </Spin>
                </div>
                <div className='formulaContent'>
                    <div className='formulaHeaderBtn'>
                        {operator.map((value, index) => {
                            return (
                                <span className='operator' key={index} onClick={this.addNewOperator.bind(this, value)}>
                                    {value}
                                </span>
                            )
                        })}
                    </div>
                    <div className='formulaWords'>
                        <Sugesstion
                            isHasDefinition={definition.length && definition.length > 0}
                            ref={(ref) => {
                                this['searchWord'] = ref
                            }}
                            scope={this.props.scope}
                            getTablelist={this.getTablelist}
                        />
                        <div className='errTip'>{errTip === '公式合法' ? errTip : <span style={{ color: '#F5222D' }}>{errTip}</span>}</div>
                    </div>
                    <div className='formulaType'>
                        <div className='fieldType'> 字段类型</div>
                        <Radio.Group value={columnType} onChange={this.changeType}>
                            <Radio value={0}>自动</Radio>
                            <Radio value={1}>度量</Radio>
                            <Radio value={2}>维度</Radio>
                            <Radio value={3}>时间</Radio>
                        </Radio.Group>
                    </div>
                    {definition.length > 0 && (
                        <div className='formulaMeans'>
                            <div className='Topic'>公式释义</div>
                            {definition.map((value, index) => {
                                return (
                                    <div key={index} className='definition'>
                                        <p>{value.text}</p>
                                        <p className='defContent' dangerouslySetInnerHTML={{ __html: value.comment }} />
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
