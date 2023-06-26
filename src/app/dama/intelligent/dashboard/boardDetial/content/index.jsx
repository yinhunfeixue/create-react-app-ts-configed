import React, { Component } from 'react'
import Views from './views'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import './index.less'
// // import EditView from './editView'
import { NotificationWrap } from 'app_common'
import _ from 'underscore'

import { viewDelete, boardUpdate } from 'app_api/dashboardApi'

// @observer
class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {
            viewList: [],
            operate: '',
            viewPosition: [],
            pinboardId: 0,
        }
    }

    handleEditView = async(data) => {
        let viewData = data.data
        if (viewData.id) {
            this.editViewDom.visibleModal(true, data)
        }
    }

    setViewList = (data) => {
        let viewPosition = JSON.parse(data.position)
        let viewList = data.views
        if (!_.isEmpty(viewPosition)) {
            let viewListKeyObj = {}
            let viewPositionRes = []
            let viewPositionKeyObj = {}
            _.map(viewList, (v, k) => {
                viewListKeyObj[v.id] = v
            })

            _.map(viewPosition, (val, index) => {
                if (viewListKeyObj[val.id]) {
                    viewPositionRes.push({ ...viewListKeyObj[val.id], ...val })
                    viewPositionKeyObj[val.id] = 1
                    delete viewListKeyObj[val.id]
                }
            })

            _.map(viewListKeyObj, (v, id) => {
                if (!viewPositionKeyObj[id]) {
                    viewPositionRes.push(v)
                }
            })

            viewPosition = viewPositionRes
        } else {
            viewPosition = viewList
        }

        this.setState({
            viewList,
            viewPosition,
            pinboardId: data.pinboardId,
        })
        if (data.views.length === 0) {
            this.props.setIsEmpty(true)
        } else {
            this.props.setIsEmpty(false)
        }
    }

    handleDelView = async(data) => {
        let { viewList } = this.state
        if (data.data.id) {
            const res = await viewDelete({
                id: data.data.id,

            })
            if (res.code === 200) {
                NotificationWrap.success(res.msg)
            } else {
                NotificationWrap.error(res.msg)
            }
        }

        let dataIndex = viewList.find((val) => val.id === data.id)
        viewList.splice(dataIndex, 1)
        if (viewList.length === 0) {
            this.props.setIsEmpty(true)
        }
        // delete viewList[data.index]

        // console.log(viewList, '-------viewList----')
        // this.setState({
        //     viewList
        // })
    }

    updatePosition = async(data) => {
        let viewPosition = []
        _.map(data, (val, index) => {
            viewPosition.push({
                id: val.id,
                style: val.style
            })
        })
        let res = await boardUpdate({
            id: this.state.pinboardId,
            viewPosition
        })

        if (res.code === 200) {
            NotificationWrap.success(res.msg)
        } else {
            NotificationWrap.error(res.msg)
        }
    }

    /**
     * UPDATE 某一视图宽度之后，保存的信息
     */
    handleViewPosition = (viewData) => {
        let viewPosition = this.state.viewPosition
        let viewIndex = viewData.index
        viewPosition[viewIndex] = {
            ...viewPosition[viewIndex],
            style: {
                ...viewData.style
            }
        }
        this.updatePosition(viewPosition)
    }

    /**
     * MOVE 之后调用保存最新位置信息
     */
    handleUpdatePosition = (data) => {
        this.updatePosition(data)
    }

    handleViewOperate = (data) => {
        if (data.operate === 'edit') {
            this.handleEditView(data)
        } else if (data.operate === 'del') {
            this.handleDelView(data)
        } else if (data.operate === 'position') {
            this.handleViewPosition(data)
        } else if (data.operate === 'view') {
            this.props.handleViewRender && this.props.handleViewRender(data.data)
        }
    }

    reSetState = (field, value) => {
        this.setState({
            [field]: value
        })
    }

    render() {
        const { viewPosition, operate } = this.state
        return (
            <div className='boardContent' >
                <DndProvider backend={Backend}>
                    <Views
                        viewList={viewPosition}
                        operate={operate}
                        reSetState={this.reSetState}
                        funcs={{
                            handleUpdatePosition: this.handleUpdatePosition,
                            handleViewOperate: this.handleViewOperate
                        }}
                        boardDetialRef={this.props.boardDetialRef}
                    />
                </DndProvider>
            </div>
        )
    }
}

export default Content
