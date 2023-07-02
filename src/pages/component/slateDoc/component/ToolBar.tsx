import { Button, Divider, Select, Tooltip } from 'antd';
import { Property } from 'csstype';
import React, { Component, ReactNode } from 'react';
import { Editor } from 'slate';
import Config from '../Config';
import IStyle from '../interface/IStyle';
import ColorPicker from './ColorPicker';
import IconFont from './IconFont2';
import styles from './ToolBar.module.less';

interface IToolBarState {
  style: IStyle;
  fontSizeList: number[];
  alignList: { value: Property.TextAlign; label: ReactNode }[];

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
        { value: 'left', label: <IconFont useCss type="e758" /> },
        { value: 'center', label: <IconFont useCss type="e756" /> },
        { value: 'right', label: <IconFont useCss type="e757" /> },
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
        <Tooltip title="有序列表">
          <IconFont
            className="IconButton"
            useCss
            type="e75a"
            onClick={() => onWrapTypeChange('ol', 'li', ['ol', 'ul'])}
          />
        </Tooltip>
        <Tooltip title="无序列表">
          <IconFont
            className="IconButton"
            useCss
            type="e759"
            onClick={() => onWrapTypeChange('ul', 'li', ['ol', 'ul'])}
          />
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="分隔线">
          <IconFont
            className="IconButton"
            useCss
            type="e75b"
            onClick={() => {
              onInsertElement('hr');
              onInsertElement('p');
            }}
          />
        </Tooltip>
        {/* 扩展功能 */}
        {children}
      </div>
    );
  }
}

export default ToolBar;
