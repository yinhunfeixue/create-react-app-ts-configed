import React from 'react'
import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Spin, Tooltip } from 'antd';

import './index.css';
import '../../../resources/dmp/css/fonts/iconfont.css';

const JfCard = (props) => {
    const title = props.title?<span>
        {props.title}
        {props.hasTip?<Tooltip placement="rightTop" title={props.hasTip} arrowPointAtCenter={true}>
            <InfoCircleOutlined className="righttop_color" />
        </Tooltip>:undefined}
    </span>:undefined
    return (
        <div className="card_layout_module">
            <div className="card_branch">
                <Card bordered={false} title={title} className={props.className} >
                	<Spin spinning={props.loading?props.loading:false} tip="正在加载...">
                    	{props.children}
                    </Spin>
                </Card>
            </div>
        </div>
    )
}

export default JfCard
