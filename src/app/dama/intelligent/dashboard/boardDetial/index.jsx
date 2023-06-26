import React, { Component } from 'react'
import Search from './search/index'
import Content from './content'
import './index.less'
import store from './store'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import Error from 'app_images/error.svg'
import ProjectUtil from '@/utils/ProjectUtil'

@observer
export default class BoardDetial extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ifEmpty: false
        }
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    componentDidMount = async () => {
        store.changePinboardId(this.pageParams.id)
        await store.getData(this.pageParams.id)
        this.handleRenderViewContent()
    }

    handleRenderViewContent = () => {
        this.contentDom && this.contentDom.setViewList({
            views: toJS(store.views),
            position: toJS(store.viewPosition),
            pinboardId: store.pinboardId,
        })
    }

    handleViewRender = async (data) => {
        this.props.addTab('dataSearchIndex', { data, dataSourceType: 'dashboardView' })
    }

    setIsEmpty = (bl) => {
        this.setState({
            isEmpty: bl
        })
    }

    render() {
        const { name, description } = store
        const { isEmpty } = this.state
        return (
            <div className='boardDetial' ref={(dom) => { this.boardDetialRef = dom }} >
                <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                    <Search
                        name={name}
                        description={description}
                        filters={store.selectedList.slice()}
                        isEmpty={isEmpty}
                        removeTab={this.props.remove} addTab={this.props.addTab}
                    />
                </div>
                {
                    isEmpty ? <div className='blankContent'><div className='contentIcon'><img src={Error} /><div>看板里还没有内容</div></div></div>
                        : <Content
                            ref={(dom) => { this.contentDom = dom }}
                            setIsEmpty={this.setIsEmpty}
                            handleViewRender={this.handleViewRender}
                            boardDetialRef={this.boardDetialRef}
                          />
                }

            </div>
        )
    }
}
