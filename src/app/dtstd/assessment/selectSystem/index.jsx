import React, { Component } from 'react'
import { Modal, Select, message, Input, Button, Divider, InputNumber, Radio, Empty } from 'antd'
import { Form } from '@ant-design/compatible'
import { queryNotEstimateSystemList } from 'app_api/standardApi'
const InputGroup = Input.Group
import './index.less'

/**
 * 添加关联关系
 */

class SelectSystem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            currentSystem: {},
            systemList: [],
            systemListCopy: [],
        }
    }

    close = () => {
        this.setState({ visible: false })
    }

    openModal = () => {
        this.setState({ visible: true })
    }

    selectChange = (e) => {
        const value = e.target.value
        this.setState({ currentSystemId: value })
        const { onChange } = this.props
        onChange && onChange(value)
        this.close()
    }

    postData = () => {}

    componentDidMount = async () => {
        const res = await queryNotEstimateSystemList({})
        if (res.code === 200) {
            this.setState({ systemList: res.data, systemListCopy: res.data })
        }
    }

    searchHandle = (value) => {
        const { systemListCopy } = this.state
        const arr = Object.assign([], systemListCopy)

        this.setState({ systemList: arr.filter((system) => system.name.indexOf(value) > -1) })
    }

    searchChangeHandle = (e) => {
        this.searchHandle(e.target.value)
    }

    render() {
        const { visible, systemList, currentSystemId, systemListCopy } = this.state

        return (
            <React.Fragment>
                <div onClick={this.openModal} style={{ color: '#4D73FF', cursor: 'pointer' }}>
                    {currentSystemId ? (
                        <div>
                            {systemListCopy.find((system) => system.id === currentSystemId).name} <span className='iconfont icon-bianji'></span>
                        </div>
                    ) : (
                        ' + 添加系统'
                    )}
                </div>

                <Modal width={480} bodyStyle={{ height: '486px' }} visible={visible} title='选择系统' footer={null} onCancel={() => this.close()}>
                    <div className='selectSystem_list'>
                        <Input.Search placeholder='搜索系统' onChange={this.searchChangeHandle} onSearch={this.searchHandle} />
                        <Radio.Group defaultValue={2} className='system_group' onChange={this.selectChange}>
                            {systemList.map((system) => {
                                return (
                                    <Radio value={system.id} className={`system_item`}>
                                        <span className='title'>
                                            <img className='logo_img' src={system.icon} />
                                            {system.name}
                                        </span>
                                    </Radio>
                                )
                            })}
                        </Radio.Group>
                        {systemList.length === 0 && (
                            <Empty
                                style={{ margin: '80px 0 0 0' }}
                                image={<img src={require('app_images/dataCompare/empty_icon.png')} />}
                                description={<span style={{ fontFamily: 'PingFangSC-Medium, PingFang SC', fontWeight: '500' }}>无对应数据</span>}
                                imageStyle={{
                                    height: 120,
                                }}
                            ></Empty>
                        )}
                    </div>
                </Modal>
            </React.Fragment>
        )
    }
}

export default SelectSystem
