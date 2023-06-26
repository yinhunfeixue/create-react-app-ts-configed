import EmptyIcon from '@/component/EmptyIcon'
import DrawerLayout from '@/component/layout/DrawerLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { EditOutlined } from '@ant-design/icons'
import { Button, Cascader, Form, Input, Layout, message, Modal, Tooltip } from 'antd'
import { addBoardView } from 'app_api/dashboardApi'
import { catalogDwTree } from 'app_api/dataSecurity'
import { departments } from 'app_api/manageApi'
import { bizLimitEditDetail, parseCname, saveBizLimit, suggestion } from 'app_api/metadataApi'
import { activeMetrics, bindActiveMetrics, clearQuery, enterActive, saveMtrics } from 'app_api/reportActive'
import { selectMetric } from 'app_api/termApi'
import {
  deleteSearchViewList,
  getAggregationData,
  getDatamanagerBusiness,
  getDrillDownSearch,
  getDrillIndexList,
  getSearchDetail,
  handleSwitchData,
  kwdDownload,
  searchViewAdd,
  searchViewList,
} from 'app_api/wordSearchApi'
import Cache from 'app_utils/cache'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
// import '../index.less'
import DrillList from './component/drillList'
import KeyWordSearch from './component/keyWordSearch'
import KwLeftContent from './component/kwLeftContent/leftContent'
import DataLoading from './component/loading'
import SearchResult from './component/searchResult'
import './intelligent.less'
import store from './store'

const { Header, Footer, Sider, Content } = Layout
const { confirm } = Modal
const { TextArea } = Input

@observer
export default class reportDetail extends Component {
  constructor(props) {
    super(props)
    this.redioDefultValue = this.props.location.state.value

    this.state = {
      tableLoading: false,
      menuSelectedKeys: [],
      drillDisplay: 'none',
      drillIndexComponent: null,
      searchViewDataList: [],
      viewIds: [],
      isCreateSql: false,
      indexmaList: [{ id: 1 }],
      indexmaValue: '',
      indexmaVisibleModal: false,
      indexmaTableData: [],
      indexmaTotal: 0,
      selectedIndexma: [],
      viewId: '',
      businessId: '',
      isEdit: false,
      editModal: false,
      btnLoading: false,
      editInfo: {
        classifyNodeIds: [],
      },
      bizClassifyDefList: [],
      themeDefList: [],
      cnameDesc: '暂无词根信息',
      tableNameCn: '',
      tableNameCnWithSpace: '',
      showDropown: false,
      tableNameCnData: [],
      tableNameEn: '',
      rootList: [],
    }
    this.indexmaColumns = [
      {
        title: '指标编码',
        dataIndex: 'entityId',
        key: 'entityId',
        operateType: 'serach',
        align: 'left',
        render: (text, record) => (
          <Tooltip title={text}>
            <span onClick={this.getIndexmaDetail.bind(this, record.id)} style={{ color: '#1890ff', cursor: 'pointer' }}>
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: '指标',
        dataIndex: 'entityName',
        key: 'entityName',
        operateType: 'serach',
        align: 'left',
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '指标中文名',
        dataIndex: 'entityDesc',
        key: 'entityDesc',
        operateType: 'serach',
        align: 'left',
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '归属部门',
        dataIndex: 'controlDept',
        key: 'controlDept',
        operateType: 'searchAndSelect',
        align: 'left',
        render: (text, record) => <Tooltip title={record.controlDeptName}>{record.controlDeptName}</Tooltip>,
      },
      {
        title: '关联数据集',
        dataIndex: 'relateDatasetName',
        key: 'relateDatasetName',
        align: 'left',
        render: (text, record) => (
          <Tooltip title={text}>
            <span onClick={this.getDatasetDetail.bind(this, record.relateDatasetId)} style={{ color: '#1890ff', cursor: 'pointer' }}>
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: '业务定义',
        dataIndex: 'businessDefinition',
        key: 'businessDefinition',
        align: 'left',
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
    ]
  }

  componentWillMount = () => {
    this.getSearchConditionBizModuleAndTheme()
    this.init()
    const { pageType } = this.pageParam
    if (pageType == 'edit') {
      this.getEditDetail()
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

  componentDidMount = () => {
    // this.initDidMount()
  }
  getEditDetail = async () => {
    let { editInfo } = this.state
    let res = await bizLimitEditDetail({ id: this.props.location.state.id })
    if (res.code == 200) {
      editInfo.id = res.data.id
      editInfo.description = res.data.description
      editInfo.classifyNodeIds = res.data.classifyNodeIds ? res.data.classifyNodeIds : []
      await store.setNodeList(res.data.searchParam.nodeList)
      await store.setBusinessIds(res.data.searchParam.businessIds)
      await store.setTempBusinessId(res.data.searchParam.tempBusinessId)
      await store.getSearchMetricsBusiness({ businessIds: res.data.searchParam.businessIds })
      await this.setState({
        editInfo,
        rootList: res.data.rootList,
        tableNameCn: res.data.chineseName,
        tableNameEn: res.data.englishName,
        tableNameCnWithSpace: res.data.chineseName,
      })
      this.getEname()
      await store.setSearchItem(store.nodeList, true)
      await store.leftSelected(store.nodeList)
      await store.onSearch({
        businessIds: store.businessIds,
        nodeList: store.nodeList,
        tempBusinessId: store.tempBusinessId,
      })
      this.searchAction()
    }
  }
  getBusinessName = async (id) => {
    let param = {
      businessIds: id,
      needDetail: false,
    }
    let res = await getDatamanagerBusiness(param)
    if (res.code == 200) {
      if (res.data.length) {
        return res.data[0].businessTypeName
      }
    } else {
      return []
    }
  }
  postSaveMtrics = async () => {
    let { indexmaList, indexmaValue } = this.state
    if (!indexmaValue) {
      message.error('请选择关联指标')
      return
    }
    let activeCount = 0
    let hasActive = false // 是否已有激活口径
    let indexmaInfo = {}
    let businessIds1 = ''
    let businessIds2 = ''
    let desc1 = ''
    let desc3 = ''
    indexmaList.map((item) => {
      if (item.active) {
        activeCount = activeCount + 1
        if (item.id == indexmaValue) {
          hasActive = true
          desc3 = item.cname + ' ' + item.ename + ' ' + '（' + item.code + '）'
          item.nodeList.map((item1) => {
            businessIds1 = item1.businessId
            desc1 += item1.content + ' '
          })
        }
      }
    })
    let desc2 = ''
    store.nodeList.map((item) => {
      desc2 += item.content + ' '
      businessIds2 = item.businessId
    })
    let desc4 = await this.getBusinessName(businessIds1)
    let desc5 = await this.getBusinessName(businessIds2)
    let renderContent = (
      <div>
        <div style={{ marginBottom: '16px' }}>【{desc3}】已有激活口径，是否要替换为新的激活口径？</div>
        <div>替换前：</div>
        <div>关联数据集： {desc4}</div>
        <div style={{ marginBottom: '16px' }}>激活口径：{desc1}</div>
        <div>替换后：</div>
        <div>关联数据集： {desc5}</div>
        <div>激活口径：{desc2}</div>
      </div>
    )
    let params = {
      ignoreMeasureInReports: true,
      reportsId: this.props.location.state.reportsId,
      metricsId: this.state.indexmaValue,
      searchParam: {
        nodeList: store.nodeList,
        businessIds: store.businessIds,
        tempBusinessId: this.props.location.state.reportsId,
      },
    }
    if (hasActive) {
      let that = this
      confirm({
        title: '指标将被替换',
        content: renderContent,
        okText: '确认替换',
        cancelText: '取消',
        className: 'indexmaComfrimModal',
        async onOk() {
          let res = await saveMtrics(params)
          if (res.code == 200) {
            await that.getIndexmaSelectData()
            if (activeCount < indexmaList.length) {
              message.success('激活成功，请选择下一个需要激活的指标')
            } else {
              message.success('激活成功，当前报表全部指标均已激活')
            }
          }
        },
      })
    } else {
      let res = await saveMtrics(params)
      if (res.code == 200) {
        await this.getIndexmaSelectData()
        if (activeCount < indexmaList.length) {
          message.success('激活成功，请选择下一个需要激活的指标')
        } else {
          message.success('激活成功，当前报表全部指标均已激活')
        }
      }
    }
  }
  getEnterActive = () => {
    let res = enterActive({ reportsId: this.props.location.state.reportsId })
  }
  init = async () => {
    // 初始的加载清除 kws_columnsHeader session
    Cache.remove('kws_columnsHeader')
    store.clearAll()
    store.clearButton()
    // if (this.props.location.state.tempBusinessId) {
    //     store.setTempBusinessId(this.props.location.state.tempBusinessId)
    // }
    //
    // if (this.props.location.state.busiGroupId) {
    //     store.setBusiGroupId(this.props.location.state.busiGroupId)
    // }
    // if (this.props.location.state.businessIds) {
    //     store.setBusinessIds(this.props.location.state.businessIds)
    // }
    //
    // if (this.props.location.state.businessId) {
    //     store.changeRadioValue(this.props.location.state.businessId, this.props.location.state.type || 0)
    //     store.clearContent()
    // } else {
    //     store.clearContent()
    // }
  }

  initDidMount = async () => {
    console.log(this.props.location.state, store.businessIds, '-----------this.props.location.state----------')
    if (this.props.location.state.businessIds) {
      if (this.props.location.state.nodeList) {
        let param = {
          businessIds: store.businessIds,
          type: this.props.location.state.type || 0,
          nodeList: this.props.location.state.nodeList,
          tempBusinessId: this.props.location.state.tempBusinessId,
        }
        store.setSearchItem(this.props.location.state.nodeList, true)

        store.leftSelected(this.props.location.state.nodeList)
        if (this.props.location.state.dataSourceType === 'dashboardView') {
          // 看板跳转过来的视图得重新识别 NODELIST
          await store.onMatch({ ...param })
          param['nodeList'] = store.searchItem
          param['chartType'] = this.props.location.state.chartType ? this.props.location.state.chartType : 'Table'
          param['chartParam'] = this.props.location.state.chartParam
        }
        await store.onSearch({ ...param })

        // 搜索视图数据请求
        this.getSearchViewList()

        this.searchAction()
      }
    }
    this.search.onSearchFocus()
  }

  // setLoading = (status = true) => {
  //     this.KwContent.setLoading(status)
  // }

  searchAction = () => {
    this.setState({
      drillIndexComponent: null,
    })
    const { sourceData, sourceDataCode, loading, businessId, nodeList, busiGroupId } = store
    console.log(sourceDataCode, '----------------------searchActionsearchAction---------')
    let params = {
      sourceData,
      sourceDataCode,
      businessId,
      nodeList,
      loading,
      busiGroupId,
    }
    this.searchResultDom && this.searchResultDom.getSourceData && this.searchResultDom.getSourceData(params)
  }

  handleDownload = () => {
    let params = {
      businessIds: store.usableBusinessIds,
      nodeList: store.nodeList,
      tempBusinessId: store.tempBusinessId,
      viewIds: store.viewSelectedIds,
    }
    kwdDownload(params)
  }

  // 明细接口调用
  handleDetail = (params) => {
    return getSearchDetail({
      ...params,
      businessIds: store.usableBusinessIds,
      nodeList: store.nodeList,
      tempBusinessId: store.tempBusinessId,
      viewIds: store.viewSelectedIds,
    })
  }

  // 图形切换接口调用
  handleSwitchChart = (params) => {
    this.setState({
      drillIndexComponent: null,
    })
    return handleSwitchData({
      ...params,
      businessIds: store.usableBusinessIds,
      nodeList: store.nodeList,
      tempBusinessId: store.tempBusinessId,
      viewIds: store.viewSelectedIds,
    })
  }

  // 统计数据接口调用
  handleAggregationData = (params) => {
    return getAggregationData({
      ...params,
      businessIds: store.usableBusinessIds,
      nodeList: store.nodeList,
      tempBusinessId: store.tempBusinessId,
      viewIds: store.viewSelectedIds,
    })
  }

  handleAddBoardView = (params) => {
    return addBoardView({
      ...params,
      businessIds: store.usableBusinessIds,
      tempBusinessId: store.tempBusinessId,
      queryType: 0,
      queryParam: JSON.stringify(store.nodeList),
      searchViewIds: store.viewSelectedIds,
    })
  }

  handleAddSearchView = async (params) => {
    let searchViewDataList = this.state.searchViewDataList
    let data = await searchViewAdd({
      ...params,
      keywordSearchParam: {
        businessIds: store.usableBusinessIds,
        tempBusinessId: store.tempBusinessId,
        nodeList: store.nodeList,
        searchViewIds: store.viewSelectedIds,
      },
    })

    if (data.code === 200) {
      // 如果有 tempBusinessId 需要更新 tempBusinessId
      let tempBusinessId = data.data.tempBusinessId
      if (tempBusinessId) {
        store.setTempBusinessId(tempBusinessId)
      }

      if (params.type === '1') {
        // 搜索视图，才更新搜索视图页面模块
        searchViewDataList.push(data.data)

        this.setState(
          {
            searchViewDataList,
          },
          () => {
            this.search.renderViewList(searchViewDataList, 'expend')
          }
        )
      }
    }

    return data
  }

  getDrillIndexListData = async (params) => {
    let data = await getDrillIndexList({
      ...params,
      businessIds: store.usableBusinessIds,
      nodeList: store.nodeList,
      tempBusinessId: store.tempBusinessId,
    })
    if (data.code === 200) {
      return data.data
    } else {
      return []
    }
  }

  handleDrillSearch = async (param) => {
    let data = await getDrillDownSearch({
      ...param,
      businessIds: store.usableBusinessIds,
      nodeList: store.nodeList,
      tempBusinessId: store.tempBusinessId,
    })
    if (data.code === 200) {
      let param = {
        businessIds: store.usableBusinessIds,
        nodeList: data.data,
      }
      store.setSearchItem(param.nodeList, true)
      store.leftSelected(param.nodeList)

      // await store.onSearch(param)
      // this.searchAction()

      this.handleSearchAction(param)
    } else {
      // return []
    }
  }

  // 下钻数据列表
  handleDrillDownData = async (param) => {
    this.setState({
      drillIndexComponent: null,
    })

    let data = await this.getDrillIndexListData({})

    const { clientWidth, clientTop, clientLeft } = this.kwMainDom
    this.setState({
      drillIndexComponent: (
        <DrillList
          params={{
            ...param,
            data: data,
          }}
          ref={(dom) => {
            this.drillListDom = dom
          }}
          handleDrillSearch={this.handleDrillSearch}
          getDrillIndexListData={this.getDrillIndexListData}
        />
      ),
    })
  }

  getSearchViewList = async () => {
    let data = await searchViewList({
      businessIds: store.usableBusinessIds,
      tempBusinessId: store.tempBusinessId,
    })

    store.setViewSelectedIds([])

    if (data.code === 200) {
      this.setState(
        {
          searchViewDataList: data.data,
        },
        () => {
          this.search.renderViewList(data.data)
        }
      )
    }
  }

  // 视图删除
  handleDeleteViewList = async (data) => {
    let res = await deleteSearchViewList({
      viewId: data.viewId,
      tempBusinessId: store.tempBusinessId,
    })

    let searchViewDataList = this.state.searchViewDataList
    if (res.code === 200) {
      let viewIdsSelected = []
      let searchActionIs = false
      searchViewDataList.map((val, k) => {
        if (val.selected) {
          viewIdsSelected.push(val.viewId)
          if (val.viewId === data.viewId) {
            searchActionIs = true
          }
        }
      })

      store.setViewSelectedIds(viewIdsSelected)
      searchViewDataList = searchViewDataList.filter(({ viewId }) => viewId !== data.viewId)

      console.log(searchViewDataList, '----delete-----searchViewDataList')
      this.setState(
        {
          searchViewDataList,
        },
        () => {
          this.search.renderViewList(searchViewDataList, 'expend')

          searchActionIs && this.handleSearchAction()
        }
      )
      message.success('删除成功！')
    }
  }

  handleSearchAction = async (params = {}) => {
    await store.onSearch({
      businessIds: store.usableBusinessIds,
      nodeList: store.nodeList,
      tempBusinessId: store.tempBusinessId,
      viewIds: store.viewSelectedIds,
      ...params,
    })
    // this.setState({
    //     viewIds
    // })
    this.searchAction()
  }
  delFormula = (params) => {
    this.search.delFormula(params)
  }
  changeCreateSql = (isEdit, viewId, businessId) => {
    this.setState({
      isCreateSql: true,
      viewId: viewId,
      businessId,
      isEdit,
    })
    store.setShowCreateBtn(false)
  }
  cancelSql = () => {
    this.setState({
      isCreateSql: false,
    })
    store.setShowCreateBtn(true)
    // store.getActiveViews(this.props.location.state.reportsId)
    store.clearButton()
  }
  onChangeIndexma = (e) => {
    this.setState({
      indexmaValue: e,
    })
  }
  indexmaLabelRender = (data) => {
    return (
      <div className='indexmaSelectContent'>
        {data.active ? (
          <span className='indexmaStatus'>已激活</span>
        ) : (
          <span style={{ background: '#D3D3D3' }} className='indexmaStatus'>
            未激活
          </span>
        )}
        <span className='indexmaName'>
          {data.cname} {data.ename} （{data.code}）
        </span>
      </div>
    )
  }
  openIndexmaModal = () => {
    this.setState({
      indexmaVisibleModal: true,
    })
    this.getIndexmaList()
  }
  cancel = () => {
    this.setState({
      indexmaVisibleModal: false,
      editModal: false,
    })
  }
  getDatasetDetail = (id) => {
    this.cancel()
    this.props.addTab('dataAsssetDetail', { editMode: false, data: { businessId: id, id: id }, from: 'metadata' })
  }
  getIndexmaDetail = (id) => {
    let params = {
      key: 'extra',
      editOrLook: 'look',
      from: 'n',
      entityId: id,
      reportsId: this.props.location.state.reportsId,
    }
    this.cancel()
    this.props.addTab('指标管理-详情', { ...params })
  }
  getIndexmaList = async (params = {}) => {
    console.log(params.filterSelectedList, 'params.filterSelectedList')
    let query = {
      ...params.filterSelectedList,
      controlDept: params.filterSelectedList ? (params.filterSelectedList.controlDept ? params.filterSelectedList.controlDept.join(',') : undefined) : undefined,
      page: params.pagination ? params.pagination.page : 1,
      page_size: params.pagination ? params.pagination.page_size : 10,
    }
    if (!query.controlDept) {
      delete query.controlDept
    }
    let res = await selectMetric(query)
    if (res.code == 200) {
      let param = {
        ...params.filterSelectedList,
      }
      let data = {
        data: res.data,
        total: res.total,
      }
      this.setState({
        indexmaTableData: res.data,
        indexmaTotal: res.total,
      })
      this.tableDom && this.tableDom.setTableData(data, param)
    }
  }

  get pageParam() {
    return ProjectUtil.getPageParam(this.props)
  }

  onFilterSearch = async (params) => {
    console.log(params, 'chartDetail params+++++')
    let res = await departments({ recursive: true, keyword: params.value })
    if (res.code == 200) {
      let array = []
      res.data.map((item) => {
        if (item.children) {
          if (item.children.length) {
            item.children.map((item1) => {
              array.push({ name: item1.departName, id: item1.id })
            })
          }
        } else {
          array.push({ name: item.departName, id: item.id })
        }
      })
      console.log(array, 'array+++++')
      return array
    } else {
      return []
    }
  }
  onIndexmaCheckboxChange = (data) => {
    console.log(data, 'onIndexmaCheckboxChange')
    this.setState({
      selectedIndexma: data,
    })
  }
  postIndexma = async () => {
    let res = await bindActiveMetrics({ reportsId: this.props.location.state.reportsId, metricsId: this.state.selectedIndexma })
    if (res.code == 200) {
      this.cancel()
      this.getIndexmaSelectData()
    }
  }
  getIndexmaSelectData = async () => {
    let res = await activeMetrics({ reportsId: this.props.location.state.reportsId })
    if (res.code == 200) {
      this.setState({
        indexmaList: res.data,
      })
    }
  }
  clearIndexma = async () => {
    let { indexmaList, indexmaValue } = this.state
    if (!indexmaValue) {
      message.error('请选择关联指标')
      return
    }
    let hasActive = false // 是否已有激活口径
    indexmaList.map((item) => {
      if (item.active) {
        if (item.id == indexmaValue) {
          hasActive = true
        }
      }
    })
    let params = {
      metricsId: this.state.indexmaValue,
    }
    console.log(params, 'clear+++')
    if (hasActive) {
      let res = await clearQuery(params.metricsId)
      if (res.code == 200) {
        await this.getIndexmaSelectData()
        message.success('解除绑定成功')
      }
    } else {
      message.error('该指标未激活')
    }
  }
  openSaveModal = () => {
    this.setState({
      editModal: true,
    })
  }
  changeBusi = async (value, selectedOptions) => {
    console.log(value, selectedOptions)
    let { editInfo } = this.state
    editInfo.classifyNodeIds = value
    await this.setState({
      editInfo,
    })
  }
  getSearchConditionBizModuleAndTheme = async () => {
    let res = await catalogDwTree({ businessTag: '1, 2' })
    if (res.code == 200) {
      this.setState({
        bizClassifyDefList: this.deleteSubList(res.data),
      })
    }
  }
  deleteSubList = (data) => {
    data.map((item) => {
      if (!item.children.length) {
        delete item.children
      } else {
        this.deleteSubList(item.children)
      }
    })
    return data
  }
  changeName = (name, e) => {
    const { editInfo } = this.state
    editInfo[name] = e.target.value
    this.setState({
      editInfo,
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
    const { tableNameCn, rootList } = this.state
    let query = {
      cname: tableNameCn,
      datasourceId: store.datasourceId,
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
    const { tableNameCn, tableNameEn, tableNameCnWithSpace, cnameDesc, rootList } = this.state
    let query = {
      cname: tableNameCnWithSpace,
      ename: tableNameEn,
      datasourceId: store.datasourceId,
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
  onChangeTableEn = (e) => {
    this.setState({
      tableNameEn: e.target.value,
    })
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
  postData = async () => {
    const { editInfo, tableNameEn, tableNameCn, tableNameCnWithSpace, rootList } = this.state
    const { businessIds, nodeList, tempBusinessId } = store
    let query = {
      ...editInfo,
      type: 0,
      rootList: rootList,
      chineseName: tableNameCnWithSpace,
      englishName: tableNameEn,
      sourceAssetsId: businessIds[0],
      searchParam: {
        businessIds: businessIds,
        nodeList: nodeList,
        tempBusinessId,
      },
    }
    this.setState({ btnLoading: true })
    let res = await saveBizLimit(query)
    this.setState({ btnLoading: false })
    if (res.code == 200) {
      message.success('保存成功')
      this.cancel()
      ProjectUtil.historyBack().catch(() => {
        this.props.addTab('业务限定')
      })
    }
  }

  render() {
    const { sourceDataCode, loading, datasourceId, nodeList } = store

    const {
      drillIndexComponent,
      searchViewDataList,
      isCreateSql,
      indexmaList,
      indexmaValue,
      indexmaVisibleModal,
      indexmaTotal,
      indexmaTableData,
      selectedIndexma,
      viewId,
      businessId,
      isEdit,
      editModal,
      btnLoading,
      editInfo,
      bizClassifyDefList,
      themeDefList,

      cnameDesc,
      tableNameCn,
      showDropown,
      tableNameCnData,
      tableNameEn,
    } = this.state
    let param = {
      selectedGroup: { busiGroupId: '' },
      record: { id: businessId },
      viewId,
      reportsId: this.props.location.state.reportsId,
      isCreate: !isEdit,
      from: 'reportActive',
    }
    const indexmaRowSelection = {
      type: 'checkbox',
    }
    let activeCount = 0
    indexmaList.map((item) => {
      if (item.active) {
        activeCount = activeCount + 1
      }
    })
    const { pageType } = this.pageParam
    const isEditPage = pageType === 'edit'

    return (
      <React.Fragment>
        <SliderLayout
          style={{
            height: '100%',
          }}
          disabledFold
          renderSliderHeader={() => {
            return (
              <div className='HControlGroup' style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>数据表</span>
                <EditOutlined
                  onClick={() => {
                    if (this.leftContent) {
                      this.leftContent.displayDrawer()
                    }
                  }}
                />
              </div>
            )
          }}
          renderSliderBody={() => {
            return (
              <KwLeftContent
                ref={(target) => {
                  this.leftContent = target
                }}
                reportsData={this.props.location.state}
                changeCreateSql={this.changeCreateSql}
                delFormula={this.delFormula}
                {...this.props}
                businessIds={store.businessIds}
                searchAction={this.handleSearchAction}
                getSearchViewList={this.getSearchViewList}
              />
            )
          }}
          renderContentHeader={() => {
            return isEditPage ? '编辑业务限定' : '定义业务限定'
          }}
          renderContentHeaderExtra={() => {
            return (
              <Button disabled={!datasourceId || loading || (nodeList ? !nodeList.length : true)} onClick={this.openSaveModal} type='primary' style={{ float: 'right' }}>
                保存
              </Button>
            )
          }}
          renderContentBody={() => {
            if (isCreateSql) {
              return null
            }
            return (
              <div className='VControlGroup'>
                <KeyWordSearch
                  ref={(refs) => {
                    this.search = refs
                  }}
                  tabOperate={{
                    addTab: this.props.addTab,
                    // removeTab: this.props.removeTab,
                  }}
                  handleDeleteViewList={this.handleDeleteViewList}
                  handleSearchAction={this.handleSearchAction}
                  postSaveMtrics={this.postSaveMtrics}
                />
                <Content className='wrap'>
                  <div style={{ height: '100%', minHeight: '495px' }}>
                    <div
                      className='kwMain'
                      ref={(e) => {
                        this.kwMainDom = e
                      }}
                    >
                      {!sourceDataCode ? (
                        <EmptyIcon description='没有查询到相关的指标或数据，请重新输入' />
                      ) : loading ? (
                        <DataLoading />
                      ) : (
                        <SearchResult
                          ref={(e) => {
                            this.searchResultDom = e
                          }}
                          detailBtn
                          addDashboardBtn
                          addSearchViewBtn
                          funcs={{
                            handleDetail: this.handleDetail,
                            handleSwitchChart: this.handleSwitchChart,
                            handleAggregationData: this.handleAggregationData,
                            handleDownload: this.handleDownload,
                            handleDrillDownData: this.handleDrillDownData,
                            handleAddBoardView: this.handleAddBoardView,
                            handleAddSearchView: this.handleAddSearchView,
                          }}
                        />
                      )}
                      {drillIndexComponent}
                    </div>
                  </div>
                </Content>
              </div>
            )
          }}
        />
        <DrawerLayout
          drawerProps={{
            title: '保存业务限定',
            visible: editModal,
            onClose: this.cancel,
          }}
          renderFooter={() => {
            return (
              <React.Fragment>
                <Button disabled={!tableNameCn || !tableNameEn || !editInfo.classifyNodeIds.length} onClick={this.postData} type='primary' loading={btnLoading}>
                  确定
                </Button>
                <Button onClick={this.cancel}>取消</Button>
              </React.Fragment>
            )
          }}
        >
          {editModal && (
            <Form className='EditMiniForm Grid1'>
              {RenderUtil.renderFormItems([
                {
                  label: '业务分类',
                  required: true,
                  content: (
                    <Cascader
                      allowClear
                      fieldNames={{ label: 'name', value: 'id' }}
                      options={bizClassifyDefList}
                      value={editInfo.classifyNodeIds}
                      displayRender={(e) => e.join('-')}
                      onChange={this.changeBusi}
                      popupClassName='searchCascader'
                      placeholder='业务分类'
                    />
                  ),
                },
                {
                  label: '业务限定名称',
                  required: true,
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
                            return <div className='tableAutoDropdownItem' dangerouslySetInnerHTML={{ __html: item.showDesc }} onClick={this.onSelectTableNameCn.bind(this, item)}></div>
                          })}
                          {!tableNameCnData.length ? <div style={{ color: '#666', textAlign: 'center' }}>暂无推荐，请输入进行搜索</div> : null}
                        </div>
                      ) : null}
                    </div>
                  ),
                  extra: cnameDesc ? <div className='inputTip'>{cnameDesc}</div> : null,
                },
                {
                  label: '业务限定英文名',
                  required: true,
                  content: (
                    <Input
                      maxLength={64}
                      onChange={this.onChangeTableEn}
                      onBlur={this.onTableEnBlur}
                      value={tableNameEn}
                      suffix={<span style={{ color: '#B3B3B3' }}>{tableNameEn.length}/64</span>}
                      placeholder='输入中文名可自动匹配英文名'
                    />
                  ),
                },
                {
                  label: '业务口径',
                  content: (
                    <div style={{ position: 'relative' }}>
                      <TextArea
                        maxLength={128}
                        style={{ position: 'relative', paddingTop: 8, resize: 'none', height: 52 }}
                        value={editInfo.description}
                        onChange={this.changeName.bind(this, 'description')}
                        placeholder='请输入业务口径'
                      />
                      <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: 8 }}>{editInfo.description ? editInfo.description.length : 0}/128</span>
                    </div>
                  ),
                },
              ])}
            </Form>
          )}
        </DrawerLayout>
      </React.Fragment>
    )
  }
}
