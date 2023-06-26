// DDL解析
import React, { Component } from 'react'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { Button, message, Input, Form, Select } from 'antd'
import RenderUtil from '@/utils/RenderUtil'

const { TextArea } = Input
export default class AlysisDdlDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            code: '',
            sqlVocabTxt: undefined,
            baseTypeList: ['MySQL', 'Oracle', 'Hive', 'DB2', 'SQLServer', 'PostgreSQL', 'MariaDB']
        }
    }
    openModal = async (data) => {
        await this.setState({
            modalVisible: true,
            code: data.ddlInfo,
            sqlVocabTxt: data.sqlVocabTxt
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    handleInputChange = (e) => {
        this.setState({
            code: e.target.value
        })
    }
    changeSelect = (e) => {
        this.setState({
            sqlVocabTxt: e
        })
    }
    postData = () => {
        let data = {
            ddlInfo: this.state.code,
            sqlVocabTxt: this.state.sqlVocabTxt
        }
        this.props.startAlysis(data)
        this.cancel()
    }
    render() {
        const {
            modalVisible,
            code,
            baseTypeList,
            sqlVocabTxt
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'DdlDrawer',
                    title: '通过解析DDL',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!code || !sqlVocabTxt} onClick={this.postData} type='primary'>
                                开始解析
                            </Button>
                            <Button onClick={this.cancel}>
                                取消
                            </Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Form className="EditMiniForm Grid1">
                            {RenderUtil.renderFormItems(
                                [
                                    {
                                        label: '数据库类型',
                                        content: (
                                            <Select
                                                placeholder='请选择'
                                                onChange={this.changeSelect}
                                                value={sqlVocabTxt}
                                            >
                                                {baseTypeList.map((item) => {
                                                    return (
                                                        <Select.Option title={item} key={item} value={item}>
                                                            {item}
                                                        </Select.Option>
                                                    )
                                                })}
                                            </Select>
                                        ),
                                    },
                                ]
                            )}
                        </Form>
                        <TextArea style={{ height: 320,backgroundColor:'transparent' }} value={code} placeholder='请输入DDL语句' onChange={this.handleInputChange} />
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}