import React, { useState, useCallback, useEffect } from 'react'
import ViewItem from './viewItem'
import update from 'immutability-helper'
import _ from 'underscore'
const style = {
    width: '100%',
    height: '100%'
}

const Views = (props) => {
    {
        let viewList = [...props.viewList]
        if (viewList.length < 1) {
            return (
                <div></div>
            )
        }

        const [updateStatus, setUpdateStatus] = useState(false)
        const [cards, setCards] = useState(viewList)

        // 视图移动，位置调整事件处理
        const moveView = useCallback(
            (dragIndex, hoverIndex) => {
                const dragCard = cards[dragIndex]
                setCards(
                    update(cards, {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, dragCard],
                        ],
                    }),
                )
                props.reSetState('operate', '')
            },
            [cards],
        )

        // 删除页面视图
        const deleteView = useCallback(
            (index) => {
                setCards(
                    update(cards, {
                        $splice: [[index, 1]]
                    }),
                )

                props.reSetState('operate', 'del')
            },
            [cards],
        )

        // 视图操作事件处理
        const operateEvent = (data) => {
            if (data.operate === 'del') {
                deleteView(data.index)
            }
            props.funcs.handleViewOperate && props.funcs.handleViewOperate(data)
        }

        const renderView = (card, index) => {
            return (
                <ViewItem
                    key={card.id}
                    index={index}
                    id={card.id}
                    data={card}
                    moveView={moveView}
                    operateEvent={operateEvent}
                    boardDetialRef={props.boardDetialRef}
                />
            )
        }

        /**
         * 监听 cards 变化，非初始状态且cards变化的时候保存位置变化信息
         * updateStatus true 也执行修改，防止修改过程中与原数据 一样的时候，不触发修改
         */
        useEffect(() => {
            console.log(!_.isEqual(props.viewList, cards), updateStatus, '----------useEffect-------')
            if (!_.isEqual(props.viewList, cards) || updateStatus) {
                props.funcs.handleUpdatePosition(cards)
                setUpdateStatus(true)
            }
        }, [cards])

        return (
            <div style={style}>{cards.map((card, i) => renderView(card, i))}</div>
        )
    }
}
export default Views
