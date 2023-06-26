import EmptyLabel from '@/component/EmptyLabel'
import React, { Component } from 'react'
import './index.less'

export default class InfoCard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {
            record: { cnName, enName, contents = [], remark, icon },
            type,
            style,
        } = this.props
        return (
            <div className='infoCardBody' style={style}>
                {type === 'role' ? <span className='item_left item_left_role iconfont icon-gangwei'></span> : <span className='item_left item_left_user'>{cnName && cnName.substring(0, 1)}</span>}

                <div className='item_content'>
                    <span className='title'>
                        {cnName || ''} {`${enName ? `(${enName})` : ''} `} {icon}
                    </span>
                    {remark === '系统创建' && <span className='xitong_tag'>内置</span>}
                    <div className='bottom'>
                        {contents.map((content) => {
                            return (
                                <span className='bottom_item'>
                                    <span className='decribe'>{content.name} : </span>
                                    <span className='decribe_content'> {content.value || <EmptyLabel />}</span>
                                </span>
                            )
                        })}
                        {
                            <span className='bottom_item'>
                                <span className='decribe'>{remark || '暂无描述'} </span>
                            </span>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
