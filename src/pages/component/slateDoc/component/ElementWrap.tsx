import IComponentProps from '@/base/interfaces/IComponentProps';
import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { Component, MouseEventHandler } from 'react';
import styles from './ElementWrap.module.less';

interface IElementWrapState {}
interface IElementWrapProps extends IComponentProps {
  onSettingClick?: MouseEventHandler;
  onDeleteClick?: MouseEventHandler;
}

/**
 * ElementWrap
 */
class ElementWrap extends Component<IElementWrapProps, IElementWrapState> {
  render() {
    const { children, onSettingClick, onDeleteClick } = this.props;
    return (
      <div contentEditable={false} className={styles.ElementWrap} tabIndex={0}>
        <span className={styles.ControlBar}>
          <Button
            icon={<SettingOutlined />}
            type="text"
            onClick={onSettingClick}
          />
          <Button
            icon={<DeleteOutlined />}
            type="text"
            onClick={(event) => {
              console.log('delete1');
              if (onDeleteClick) {
                onDeleteClick(event);
              }
            }}
          />
        </span>
        {children}
      </div>
    );
  }
}

export default ElementWrap;
