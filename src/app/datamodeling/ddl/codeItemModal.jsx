import DrawerLayout from '@/component/layout/DrawerLayout'
import { CheckOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Dropdown,
    Input,
    Menu,
    message,
    Row,
    Tooltip,
    TreeSelect,
    Modal,
    Spin,
    Select,
} from 'antd';
import { codeItemDetail } from 'app_api/dataWarehouse'
import { codeItemDatasource, codeItemList } from 'app_api/metadataApi'
import React, { Component } from 'react'
import './codeItemModal.less'

const TreeNode = TreeSelect.TreeNode

export default class CodeItemModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            codeItemVisible: false,
            datasourceId: undefined,
            databaseIdList: [],
            codeValueList: [],
            selectedId: '',
            selectedName: '',
            selectedCode: '',
            dataSourceList: [],
            keyword: '',
            loading: false,
            databseList: []
        }
    }
    componentWillMount = () => {
        this.getDataSource()
    }
    getDataSource = async () => {
        let res = await codeItemDatasource()
        if (res.code == 200) {
            this.setState({
                dataSourceList: res.data,
            })
        }
    }
    showModal = async (datasourceId) => {
        await this.setState({
            codeItemVisible: true,
            selectedId: '',
            selectedName: '',
            selectedCode: '',
            databaseIdList: [],
            codeValueList: [],
            codeItemList: [],
            datasourceId
        })
        this.getCodeItemList()
    }
    cancelModal = () => {
        this.setState({
            codeItemVisible: false,
        })
    }
    getCodeItemList = async () => {
        let { datasourceId, databaseIdList, keyword } = this.state
        let query = {
            databaseIdList,
            datasourceId,
            page_size: 100000,
            name: keyword
        }
        this.setState({loading: true})
        let res = await codeItemList(query)
        this.setState({loading: false})
        if (res.code == 200) {
            res.data.map((item) => {
                item.datasourceCname = item.datasourceCname ? item.datasourceCname : ''
                item.databaseCname = item.databaseCname ? item.databaseCname : ''
            })
            this.setState({
                codeItemList: res.data,
            })
        }
    }
    selectCodeItem = async (data) => {
        await this.setState({
            selectedId: data.id,
            selectedName: data.name,
            selectedCode: data.code
        })
        this.getCodeValue()
    }
    getCodeValue = async () => {
        let res = await codeItemDetail(this.state.selectedId)
        if (res.code == 200) {
            this.setState({
                codeValueList: res.data.codeValues,
            })
        }
    }
    handleChange = async (e) => {
        await this.setState({
            databaseIdList: e,
        })
        this.getCodeItemList()
    }
    postData = () => {
        if (!this.state.selectedId) {
            message.info('请选择代码项')
            return
        }
        this.cancelModal()
        this.props.getCodeItem({ codeItemName: this.state.selectedName, refCodeItemId: this.state.selectedId, codeItemCode: this.state.selectedCode })
    }
    loop = (data) =>
        data.map((item) => {
            if (item.databases && item.databases.length) {
                return (
                    <TreeNode checkable={false} key={item.id} value={item.id} title={item.dsName}>
                        {this.loop(item.databases)}
                    </TreeNode>
                )
            }
            return <TreeNode key={item.databaseId} value={item.databaseId} title={item.physicalDatabase} />
        })
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    render() {
        const { codeItemVisible, codeItemList, codeValueList, dataSourceList, selectedId, databaseIdList, keyword, selectedName, loading, databseList } = this.state
        const menu = (
            <Menu onClick={(e) => e.preventDefault()}>
                <Menu.Item key='0' onClick={(e) => e.preventDefault()}>
                    <TreeSelect
                        showSearch={false}
                        multiple={true}
                        treeCheckable={true}
                        value={databaseIdList}
                        style={{ width: '100%' }}
                        treeDefaultExpandAll={true}
                        dropdownMatchSelectWidth
                        placeholder='点击筛选'
                        allowClear
                        onChange={this.handleChange}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                        {this.loop(dataSourceList)}
                    </TreeSelect>
                </Menu.Item>
            </Menu>
        )
        return (
            <Modal
                className="codeItemModal"
                title='引用代码'
                width={960}
                visible={codeItemVisible}
                onCancel={this.cancelModal}
                maskClosable={false}
                footer={[
                    <Button
                        disabled={!selectedId}
                        onClick={this.postData} type='primary'>
                        确定
                    </Button>,
                    <Button onClick={this.cancelModal}>
                        取消
                    </Button>,
                ]}
                // className='codeItemModal' title='选择代码项' visible={codeItemVisible} width={900} onOk={this.postData} onCancel={this.cancelModal}
            >
                {codeItemVisible ? (
                    <Row>
                        <Col span={16}>
                            <div className='codeItemTitle'>
                                推荐代码项
                                {/*<Dropdown overlayStyle={{ width: 450 }} overlay={menu} trigger={['click']}>*/}
                                    {/*<a style={{ float: 'right' }}>*/}
                                        {/*<Icon type='filter' style={{ marginRight: 5 }} />*/}
                                        {/*筛选*/}
                                    {/*</a>*/}
                                {/*</Dropdown>*/}
                            </div>
                            <div className='codeItemArea'>
                                <div style={{ padding: '12px 12px 0px 12px' }}>
                                    <Input.Search style={{ width: 414, marginRight: 8 }} onSearch={this.getCodeItemList} value={keyword} onChange={this.changeKeyword} placeholder='请输入关键词' allowClear/>
                                    <TreeSelect
                                        showSearch={false}
                                        multiple={true}
                                        treeCheckable={true}
                                        value={databaseIdList}
                                        style={{ width: 160, verticalAlign: 'bottom' }}
                                        treeDefaultExpandAll={true}
                                        // dropdownMatchSelectWidth
                                        placeholder='数据库'
                                        allowClear
                                        onChange={this.handleChange}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                    >
                                        {this.loop(dataSourceList)}
                                    </TreeSelect>
                                </div>
                                <div className='commonScroll' style={{ padding: '0px 7px 0 12px', height: 'calc(100% - 50px)' }}>
                                    <Spin spinning={loading}>
                                        {codeItemList.map((item) => {
                                            const selected = selectedId == item.id
                                            return (
                                                <div
                                                    onClick={this.selectCodeItem.bind(this, item)}
                                                    style={{ borderColor: selected ? '#4D73FF' : '#d3d3d3', backgroundColor: selected ? 'rgba(77, 115, 255, 0.1)' : '#F4F5F7' }}
                                                    className='codeItem'
                                                >
                                                    <Tooltip title={item.code + ' ' + item.name}>
                                                    <span className='codeItemName'>
                                                        {item.code} {item.name}
                                                    </span>
                                                    </Tooltip>
                                                    <Tooltip title={item.datasourceCname + '/' + item.databaseCname}>
                                                    <span className='codeItemPath'>
                                                        <span>{item.datasourceCname}</span>
                                                        <span>/{item.databaseCname}</span>
                                                    </span>
                                                    </Tooltip>
                                                    {selected && (
                                                        <span className='IconCheckWrap'>
                                                        <CheckOutlined className='IconCheck' />
                                                    </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </Spin>
                                </div>
                            </div>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={7}>
                            <div className='codeItemTitle'>预览代码值</div>
                            <div className='codeItemArea CodePreviewGroup'>
                                <div className='CodePreviewFirst'>{selectedName}</div>
                                <div className='commonScroll' style={{ height: 'calc(100% - 33px)' }}>
                                    {codeValueList.map((item) => {
                                        return (
                                            <div className='codeItem CodePreviewItem'>
                                                {item.value} {item.name}
                                            </div>
                                        )
                                    })}
                                    {!codeValueList.length ? <div className='tip'>请在左侧选择一个代码值进行预览</div> : null}
                                </div>
                            </div>
                        </Col>
                    </Row>
                ) : null}
            </Modal>
        );
    }
}
