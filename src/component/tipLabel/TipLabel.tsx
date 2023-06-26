import IComponentProps from '@/base/interfaces/IComponentProps'
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { Component, ReactNode } from 'react'
import './TipLabel.less'

interface ITipLabelState {}
interface ITipLabelProps extends IComponentProps {
    label: ReactNode
    tip: ReactNode
}

/**
 * TipLabel
 */
class TipLabel extends Component<ITipLabelProps, ITipLabelState> {
    render() {
        const { label, tip } = this.props
        return (
            <span className='TipLabel'>
                {label}
                {tip && (
                    <Tooltip title={tip}>
                        <InfoCircleOutlined className='TipLabelIcon' />
                    </Tooltip>
                )}
            </span>
        );
    }
}

export default TipLabel
