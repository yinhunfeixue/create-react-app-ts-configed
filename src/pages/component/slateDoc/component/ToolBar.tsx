import Config from '@/pages/component/slateDoc/Config';
import ColorPicker from '@/pages/component/slateDoc/component/ColorPicker';
import IStyle from '@/pages/component/slateDoc/interface/IStyle';
import { Button, Divider, Select } from 'antd';
import { Property } from 'csstype';
import React, { Component, ReactNode } from 'react';
import { Editor } from 'slate';
import styles from './ToolBar.module.less';

interface IToolBarState {
  style: IStyle;
  fontSizeList: number[];
  alignList: { value: Property.TextAlign; label: string }[];

  textType: string;
  textTypeList: { value: string; label: string }[];
}

interface IToolBarProps {
  edit: Editor;
  onStyleChange: (value: IStyle) => void;
  children?: ReactNode;
  onTypeChange: (value: string) => void;
  onInsertElement: (type: string) => void;

  onWrapTypeChange: (
    wrapType: string,
    type: string,
    removedWrapType: string[]
  ) => void;
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

      alignList: [
        { value: 'left', label: '左' },
        { value: 'center', label: '中' },
        { value: 'right', label: '右' },
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
    const { fontSizeList, style, textTypeList, textType, alignList } =
      this.state;
    const { fontSize, color, fontWeight, textAlign } = style;
    const { children, onInsertElement, onWrapTypeChange } = this.props;
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
        <Divider type="vertical" />
        {/* 对齐 */}
        <Select
          options={alignList}
          value={textAlign}
          style={{ width: 60 }}
          bordered={false}
          dropdownStyle={{ width: 140 }}
          dropdownMatchSelectWidth={false}
          onChange={(value) => this.updateStyle({ textAlign: value })}
        />
        {/* 数字序号 */}
        <Button onClick={() => onWrapTypeChange('ol', 'li', ['ol', 'ul'])}>
          ol
        </Button>
        {/* 列表 */}
        <Button onClick={() => onWrapTypeChange('ul', 'li', ['ol', 'ul'])}>
          ul
        </Button>
        <Divider type="vertical" />
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
