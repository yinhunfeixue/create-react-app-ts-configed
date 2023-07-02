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

  textType: string;
  textTypeList: { value: string; label: string }[];
}
interface IToolBarProps {
  edit: Editor;
  onStyleChange: (value: IStyle) => void;
  children?: ReactNode;
  onTypeChange: (value: string) => void;
  onInsertElement: (type: string) => void;
}

/**
 * ToolBar
 */
class ToolBar extends Component<IToolBarProps, IToolBarState> {
  constructor(props: IToolBarProps) {
    super(props);
    this.state = {
      fontSizeList: [12, 14, 16, 18, 20, 24, 28],
      textType: 'span',
      textTypeList: [
        {
          value: 'span',
          label: '正文',
        },
        {
          value: 'h1',
          label: '标题一',
        },
        {
          value: 'h2',
          label: '标题二',
        },
        {
          value: 'h3',
          label: '标题三',
        },
        {
          value: 'h4',
          label: '标题四',
        },
      ],
      style: { ...Config.defaultStyle },
    };
  }

  private updateStyle(value: Partial<IStyle>) {
    const { onStyleChange } = this.props;
    this.setState(
      {
        style: {
          ...this.state.style,
          ...value,
        },
      },
      () => {
        onStyleChange(value);
      }
    );
  }

  private updateType(value: string) {
    const { onTypeChange } = this.props;
    this.setState(
      {
        textType: value,
      },
      () => {
        onTypeChange(value);
      }
    );
  }

  render() {
    const { fontSizeList, style, textTypeList, textType } = this.state;
    const { fontSize, color, fontWeight } = style;
    const { children, onInsertElement } = this.props;
    return (
      <div className={styles.ToolBar}>
        {/* 文本类型 */}
        <Select
          options={textTypeList}
          value={textType}
          style={{ width: 90 }}
          bordered={false}
          dropdownStyle={{ width: 140 }}
          dropdownMatchSelectWidth={false}
          onChange={(value) => this.updateType(value)}
        />
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
        <Button
          type="text"
          style={{ fontWeight }}
          onClick={() => onInsertElement('hr')}
        >
          -
        </Button>
        {/* 扩展功能 */}
        {children}
      </div>
    );
  }
}

export default ToolBar;
