import Config from '@/pages/component/slateDoc/Config';
import ColorPicker from '@/pages/component/slateDoc/component/ColorPicker';
import IStyle from '@/pages/component/slateDoc/interface/IStyle';
import { Button, Select } from 'antd';
import React, { Component, ReactNode } from 'react';
import { Editor } from 'slate';
import styles from './ToolBar.module.less';

interface IToolBarState {
  fontSizeList: number[];
  style: IStyle;
}
interface IToolBarProps {
  edit: Editor;
  onChange: (value: IStyle) => void;
  children?: ReactNode;
}

/**
 * ToolBar
 */
class ToolBar extends Component<IToolBarProps, IToolBarState> {
  constructor(props: IToolBarProps) {
    super(props);
    this.state = {
      fontSizeList: [12, 14, 16, 18, 20, 24, 28],

      style: { ...Config.defaultStyle },
    };
  }

  private updateStyle(value: Partial<IStyle>) {
    const { onChange } = this.props;
    this.setState(
      {
        style: {
          ...this.state.style,
          ...value,
        },
      },
      () => {
        onChange(value);
      }
    );
  }

  render() {
    const { fontSizeList, style } = this.state;
    const { fontSize, color, fontWeight } = style;
    const { children } = this.props;
    return (
      <div className={styles.ToolBar}>
        {/* 常规内容 */}
        {/* 字号 */}
        <Select
          value={fontSize}
          style={{ width: 60 }}
          bordered={false}
          options={fontSizeList.map((item) => ({ value: item, label: item }))}
          dropdownStyle={{ width: 100 }}
          dropdownMatchSelectWidth={false}
          onChange={(value) => this.updateStyle({ fontSize: value })}
        />
        {/* 颜色 */}
        <ColorPicker
          color={color || '#999999'}
          onChange={(color) => this.updateStyle({ color })}
        />
        {/* 粗体 */}
        <Button
          type="text"
          style={{ fontWeight }}
          onClick={() =>
            this.updateStyle({ fontWeight: fontWeight ? 'bold' : undefined })
          }
        >
          B
        </Button>
        {/* 对齐 */}
        {/* 数字序号 */}
        {/* 列表 */}
        {/* 分隔线 */}
        {/* 扩展功能 */}
        {children}
      </div>
    );
  }
}

export default ToolBar;
