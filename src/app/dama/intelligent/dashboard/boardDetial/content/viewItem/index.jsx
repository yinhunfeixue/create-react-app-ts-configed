import React, { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import ItemTypes from './ItemTypes'
import { Row, Col, Tooltip, Dropdown, Button, Popconfirm } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons';
import GroupIcon from 'app_images/chart/GroupIcon.svg'
// import LazyLoad from 'react-lazyload'
import './index.less'
import Widget from '../widget'
import EditView from '../editView'
import { viewEdit } from 'app_api/dashboardApi'
import { NotificationWrap } from 'app_common'

const ViewItem = ({ id, data, index, moveView, operateEvent, boardDetialRef }) => {
    console.log(id, index, '---==========id===========---------------')
    if (!data.style) {
        data.style = { 'width': '100%' }
    }
    const ref = useRef(null)

    let _lastCoordY = null
    // let editViewDom = null
    const [editViewDom, setEditViewDom] = useState(null)
    const [viewCdata, setViewCdata] = useState(data)
    const [viewMaskStatus, setViewMaskStatus] = useState(false)
    const [viewMaskMsg, setViewMaskMsg] = useState('')
    const changeViewMaskStatus = (status, msg) => {
        setViewMaskStatus(status)
        if (msg) {
            setViewMaskMsg(msg)
        }
    }

    const operateEventView = (data) => {
        console.log(data, '---------operateEventViewoperateEventView-------')
        // operateEvent(data)
        let viewData = data.data
        if (viewData.id) {
            editViewDom.visibleModal(true, data)
        }
    }

    const handleEditBoardView = async(data) => {
        // return await viewEdit(data)
        let res = await viewEdit(data)
        if (res.code === 200) {
            let viewData = {
                ...viewCdata,
                ...data
            }

            // operateEvent({
            //     ...viewData,
            //     operate: 'edit'
            // })

            setViewCdata(viewData)
            NotificationWrap.success('标题描述修改成功')

            editViewDom.visibleModal(false)
        } else {
            NotificationWrap.error(res.msg)
        }
    }

    const updateViewPostion = (data) => {
        let viewData = {
            ...viewCdata,
            ...data
        }
        setViewCdata(viewData)

        operateEvent(data)
    }

    const handleOnDrag = (e) => {
        // setTimeout(() => {
        if (boardDetialRef) {
            console.log(boardDetialRef.offsetHeight, '--------boardDetialRef.offsetHeight---------')
            if (_lastCoordY === null) {
                console.log(_lastCoordY, '--------66666666666666666666---------')
                _lastCoordY = e.clientY
            } else {
                let scrollTop = boardDetialRef.scrollTop + e.clientY - _lastCoordY

                console.log(scrollTop, boardDetialRef.scrollTop, '------------scrollTop---boardDetialRef.scrollTop--------')

                if (boardDetialRef.scrollTop != scrollTop) {
                    if (scrollTop <= 0) {
                        boardDetialRef.scrollTop = 0
                    } else {
                        boardDetialRef.scrollTop = scrollTop
                    }
                }
            }
        }
        // }, 300)
        // console.log(e.clientY, '------------handleMouseMove-----------')
    }

    const handleOndragend = (e) => {
        console.log('--------------handleOndragendhandleOndragend-----------')
        _lastCoordY = null
    }

    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        hover(item, monitor) {
            console.log(_lastCoordY, '----------_lastCoordY------')
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current.getBoundingClientRect()
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            //     return
            // }
            // // Dragging upwards
            // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            //     return
            // }
            // Time to actually perform the action
            moveView(dragIndex, hoverIndex)
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex

            //
        },
    })
    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.CARD, id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),

    })
    const opacity = isDragging ? 0 : 1
    drag(drop(ref))

    return (
        <div className='viewsMod' style={{ opacity, width: '100%', ...viewCdata.style }}>
            <div className='viewBack'>
                <div ref={ref} onDrag={handleOnDrag} onDragEnd={handleOndragend}>
                    <div className='viewHeader'>
                        <Dropdown
                            overlay={
                                <div className='dropdownModel' >
                                    <Row gutter='16'>
                                        <Col><div className='downItem' onClick={() => { operateEventView({ index, operate: 'edit', data: viewCdata }) }}>编辑标题和描述</div></Col>
                                    </Row>
                                    <Row gutter='16'>
                                        <Col><div className='downItem' onClick={() => { operateEvent({ index, operate: 'view', data: viewCdata }) }}>查看搜索结果</div></Col>
                                    </Row>
                                    <Row gutter='16'>
                                        <Col>
                                            <Popconfirm
                                                title='确定要删除?'
                                                icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
                                                onConfirm={() => { operateEvent({ index, operate: 'del', data: viewCdata }) }}
                                                okText='确定'
                                                cancelText='取消'
                                            >
                                                <div className='downItem' >删除</div>
                                            </Popconfirm>
                                        </Col>
                                    </Row>
                                    <Row gutter='16'>
                                        <Col><div className='item-divider'></div></Col>
                                    </Row>
                                    <Row gutter='16'>
                                        <Col span='24' >
                                            <div className='size-selector'>
                                                <Row>
                                                    <Col span='12'>
                                                        <div className={viewCdata.style && viewCdata.style.width === '50%' ? 'size size-medium selected' : 'size size-medium'} onClick={() => { updateViewPostion({ index, operate: 'position', data: viewCdata, 'style': { 'width': '50%' }}) }} >
                                                            <div className='size-inner'></div>
                                                        </div>
                                                    </Col>
                                                    <Col span='12'>
                                                        <div className={(viewCdata.style && viewCdata.style.width === '100%') || !viewCdata.style || !viewCdata.style.width ? 'size size-large selected' : 'size size-large'} onClick={() => { updateViewPostion({ index, operate: 'position', data: viewCdata, 'style': { 'width': '100%' }}) }} >
                                                            <div className='size-inner'></div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            }

                            trigger={['click']}

                        >
                            <span style={{ float: 'right', border: '0', cursor: 'pointer', marginTop: '-3px' }} ><img src={GroupIcon} /></span>
                        </Dropdown>
                        <div className='viewTitle'>
                            <Tooltip placement='topLeft' title={viewCdata.name} >
                                {viewCdata.name}
                            </Tooltip>
                        </div>
                    </div>
                    <div className='viewDesc'>
                        <Tooltip placement='topLeft' title={viewCdata.description} >
                            {viewCdata.description}
                        </Tooltip>
                    </div>
                </div>
                <div className='viewBody'>
                    <div className='viewBodyMask' style={{ display: viewMaskStatus ? 'block' : 'none' }}>
                        <em >{viewMaskMsg}</em>
                        <Button type='primary' onClick={() => { changeViewMaskStatus(false) }}>我知道了</Button>
                    </div>
                    <Widget params={viewCdata} changeViewMaskStatus={changeViewMaskStatus} />
                </div>
            </div>

            <EditView
                ref={(dom) => { setEditViewDom(dom) }}
                handleEditBoardView={handleEditBoardView}
            />
        </div>
    )
}
export default ViewItem
