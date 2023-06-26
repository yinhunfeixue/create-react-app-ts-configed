import DragSortingTable from '@/app/datamodeling/ddl/dragSortTable';
import DrawerLayout from '@/component/layout/DrawerLayout';
import { Button } from 'antd';
import React, { Component } from 'react';
import '../index.less';


export default class CategorySortDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            tableData: [],
            dragTableLoading: false,
            btnLoading: false,
            businessTag: '1'
        }
        this.columns = [
            {
                dataIndex: 'key',
                key: 'key',
                title: '序号',
                width: 60,
                render: (text,record, index) => <span>{index + 1}</span>
            },
            {
                dataIndex: 'name',
                key: 'name',
                title: '名称',
                render: (text,record, index) => <div>{text}</div>
            }
        ]
    }
    openModal = (data, businessTag) => {
        let { tableData } = this.state
        tableData = JSON.parse(JSON.stringify(data))
        tableData.map((item) => {
            delete item.children
        })
        this.setState({
            modalVisible: true,
            tableData,
            businessTag: businessTag || '1'
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    getSortData = async (data) => {
        this.setState({dragTableLoading: true})
        await this.setState({
            tableData: [...data]
        })
        this.setState({dragTableLoading: false})
    }
    postData = () => {
        this.cancel()
        this.props.getSortData(this.state.tableData)
    }
    render() {
        const {
            modalVisible,
            tableData,
            dragTableLoading,
            btnLoading,
            businessTag
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'categoryDetailDrawer',
                    title: businessTag == '1' ? '分类排序' : '特征排序',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button loading={btnLoading} onClick={this.postData} type='primary'>
                                保存
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div style={{ color: '#9EA3A8', marginBottom: 16 }}>长按可拖拽列表顺序</div>
                        {
                            !dragTableLoading && (
                                <DragSortingTable
                                    rowkey='id'
                                    columns={this.columns}
                                    dataSource={tableData}
                                    getSortData={this.getSortData}
                                    canMove={true}
                                    from='dataTable'
                                />
                            )
                        }
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}