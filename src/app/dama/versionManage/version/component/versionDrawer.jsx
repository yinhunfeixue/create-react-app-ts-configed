import { Button, Input, Select, message } from 'antd'
import { Form } from '@ant-design/compatible'
import React, { Component } from 'react'
import '../index.less'
import RenderUtil from '@/utils/RenderUtil'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { updateVerInfo } from 'app_api/autoManage'
import moment from 'moment'
import Cache from 'app_utils/cache'

const { TextArea } = Input
export default class VersionDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {},
            versionList: [],
            loading: false,
            datasourceEname: '',
        }
    }
    openModal = (datasource, version, versionList) => {
        let { detailInfo } = this.state
        detailInfo = {
            version,
            datasourceId: datasource.id,
        }
        this.setState({
            modalVisible: true,
            detailInfo,
            versionList,
            datasourceEname: datasource.name,
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    handleInputChange = (name, e) => {
        let { detailInfo } = this.state
        detailInfo[name] = e.target.value
        this.setState({
            detailInfo,
        })
    }
    postData = async () => {
        let { detailInfo, datasourceEname } = this.state
        let query = {
            ...detailInfo,
            submitter: Cache.get('userinfo').english_name + '(' + Cache.get('userinfo').lastname + ')',
        }
        query.tag = datasourceEname + '-' + moment().format('YYYYMMDD') + '-' + detailInfo.tag
        this.setState({ loading: true })
        let res = await updateVerInfo(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('版本发布成功')
            this.cancel()
            this.props.setVersion()
        }
    }
    changeStatus = (e) => {
        let { detailInfo } = this.state
        detailInfo.version = e
        this.setState({
            detailInfo,
        })
    }
    render() {
        const { modalVisible, detailInfo, versionList, loading, datasourceEname } = this.state
        const suffixStyle = {
            position: 'absolute',
            bottom: 8,
            right: 8,
            color: '#C4C8CC',
        }
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'versionDrawer versionCompareResult',
                    title: '定版',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!detailInfo.version || !detailInfo.tag} type='primary' loading={loading} onClick={this.postData}>
                                发布版本
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Form className='EditMiniForm postForm Grid1' style={{ columnGap: 8 }}>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '系统版本',
                                    required: true,
                                    content: (
                                        <Select
                                            showSearch
                                            optionFilterProp='title'
                                            onChange={this.changeStatus}
                                            value={detailInfo.version}
                                            dropdownClassName='versionSelectDropdown'
                                            placeholder='请选择'
                                        >
                                            {versionList.map((item) => {
                                                return (
                                                    <Select.Option title={item.version} key={item.version} value={item.version}>
                                                        {item.latest ? <span className='newTag'>最新</span> : null}
                                                        {item.version}
                                                    </Select.Option>
                                                )
                                            })}
                                        </Select>
                                    ),
                                },
                                {
                                    label: '版本名称',
                                    required: true,
                                    content: (
                                        <Input
                                            placeholder='请输入'
                                            value={detailInfo.tag}
                                            onChange={this.handleInputChange.bind(this, 'tag')}
                                            maxLength={32}
                                            addonBefore={datasourceEname + '-' + moment().format('YYYYMMDD')}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{detailInfo.tag ? detailInfo.tag.length : 0}/32</span>}
                                        />
                                    ),
                                },
                                {
                                    label: '版本描述',
                                    content: (
                                        <div style={{ position: 'relative' }}>
                                            <TextArea
                                                style={{ height: 52 }}
                                                placeholder='请输入描述'
                                                rows={4}
                                                maxLength={128}
                                                value={detailInfo.desc}
                                                onChange={this.handleInputChange.bind(this, 'desc')}
                                            />
                                            <span style={{ ...suffixStyle }}>{detailInfo.desc ? detailInfo.desc.length : 0}/128</span>
                                        </div>
                                    ),
                                },
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
