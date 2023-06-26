import React from 'react'
import { InfoCircleOutlined } from '@ant-design/icons';
import { Alert, Radio, Tooltip } from 'antd';
import './index.css';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const PanelContainer = (props) => {
    return (
        <div className="panelcont_margin" style={{ display: props.hide ? 'none' : '' }}>
            <div className='pc-title'>
                <div className='pc-title-left'>
                    {props.title}
                    {props.hasTip ? <Tooltip placement="rightTop" title={props.hasTip} arrowPointAtCenter={true}>
                        <InfoCircleOutlined style={{ marginLeft: 16, fontSize: 14 }} />
                    </Tooltip> : null}
                </div>
                {props.hasRadio ? <div className='pc-title-right'>
                    {props.hasRadio}
                </div> : null}
            </div>

            {props.alert ? <Alert message={props.alert} className="alert_color" type="warning" closable /> : null}

            {props.hasFilter ? <div className='pc-filter'>
                {props.hasFilter}
            </div> : null}
            <div>
                {props.children}
            </div>
        </div>
    );
}

export default PanelContainer
