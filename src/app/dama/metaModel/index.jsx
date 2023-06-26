import { Tabs, Spin, message } from 'antd'
import React, { Component } from 'react'
import './index.less'
import { ContentLayout, Empty } from 'cps'
import { queryMetaModelList } from 'app_api/metaModelApi'
import { Time } from 'utils'

export default class MetaModel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            metaModelList: [],
            loading: false,
        }
    }

    componentDidMount = () => {
        this.queryMetaModelList()
    }

    queryMetaModelList = async () => {
        this.setState({ loading: false })
        let res = await queryMetaModelList({})
        if (res.code === 200) {
            this.setState({ metaModelList: res.data })
        }
        this.setState({ loading: false })
    }

    render() {
        const { metaModelList, loading } = this.state
        const { addTab, history } = this.props
        return (
            <ContentLayout title='元模型管理' footer>
                <Spin spinning={loading}>
                    {metaModelList.map((item, index) => (
                        <div className='metaModelBody' style={index < metaModelList.length - 1 ? { marginBottom: '16px' } : {}} onClick={() => this.props.addTab('属性管理', item)}>
                            <img src={item.icon} className='item_left' />
                            <div className='item_content'>
                                <span className='title'>{item.name}</span>
                                <div>
                                    <span className='bottom_item'>
                                        <span className='decribe'>修改时间</span>
                                        <span className='decribe_content'>{item.updateTime ? Time.formatTimeDetail(item.updateTime) : '～'}</span>
                                    </span>
                                    <span className='bottom_item'>
                                        <span className='decribe'>修改人</span>
                                        <span className='decribe_content'>{item.updateUser ? `${item.updateUser} (${item.updateUserAccount})` : '~'}</span>
                                    </span>
                                </div>
                            </div>
                            <div className='item_right'>
                                <span className='decribe'>属性数量</span>
                                <span className='decribe_content'>{item.subCount || 0}</span>
                            </div>
                        </div>
                    ))}
                </Spin>
            </ContentLayout>
        )
    }
}
