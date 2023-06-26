import { Typography } from 'antd'
import React, { useState } from 'react'
import './index.less'

const { Paragraph } = Typography
const TextMore = ({ text, rows = 1 }) => {
    const [visible, setVisible] = useState(false)
    return (
        <div className='textMore_box' style={{ position: 'relative' }}>
            <Paragraph
                ellipsis={
                    visible
                        ? false
                        : {
                              rows: rows,
                              expandable: true,
                              symbol: <div>aaa</div>,
                          }
                }
            >
                {text}
                {visible && <a onClick={() => setVisible(false)}>收起</a>}
            </Paragraph>
            {!visible && (
                <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#fff' }}>
                    <a onClick={() => setVisible(true)}>显示详情</a>
                </div>
            )}
        </div>
    )
}

export default TextMore
