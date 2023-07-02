import { Divider, Select, Tooltip } from 'antd';
import { Property } from 'csstype';
import React, { Component, ReactNode } from 'react';
import { Editor, Element, Text } from 'slate';
import Config from '../Config';
import IElement from '../interface/IElement';
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

  selectedNodeList?: IElement[];
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

  private getColorFromNodeList() {
    return this.getStyleValueFromSelectionNodes('color');
  }

  private getFontWeightFromNodeList() {
    return this.getStyleValueFromSelectionNodes('fontWeight');
  }

  private getFontSizeFromNodeList() {
    return this.getStyleValueFromSelectionNodes('fontSize');
  }

  private gettextAlignFromNodeList() {
    return this.getStyleValueFromSelectionNodes(
      'textAlign',
      (n) => Element.isElement(n) && !Editor.isEditor(n)
    );
  }

  private getStyleValueFromSelectionNodes(
    attributeName: keyof React.CSSProperties,
    match: (n: IElement) => boolean = Text.isText
  ) {
    return this.getValuefromSelectionNodes(match, (item) => {
      if (item.props && item.props.style) {
        return item.props.style[attributeName];
      }
      return;
    });
  }

  private getValuefromSelectionNodes(
    match: (n: IElement) => boolean,
    getValue: (n: IElement) => any
  ) {
    const { selectedNodeList } = this.props;
    if (!selectedNodeList) {
      return undefined;
    }
    const effectList = selectedNodeList.filter(match);
    if (!effectList.length) {
      return undefined;
    }
    let result: any = getValue(effectList[0]);
    for (const item of effectList) {
      let currentValue = getValue(item);
      if (currentValue !== result) {
        return undefined;
      }
    }
    return result;
  }

  componentDidUpdate(prevProps: Readonly<IToolBarProps>): void {
    if (prevProps.selectedNodeList !== this.props.selectedNodeList) {
      const color = this.getColorFromNodeList();
      const fontWeight = this.getFontWeightFromNodeList();
      const fontSize = this.getFontSizeFromNodeList();
      const textAlign = this.gettextAlignFromNodeList();
      const { style } = this.state;
      this.setState({
        style: { ...style, color, fontWeight, fontSize, textAlign },
      });
    }
  }

  render() {
    const { fontSizeList, style, textTypeList, textType, alignList } =
      this.state;

    const { defaultStyle } = Config;
    const {
      fontSize = defaultStyle.fontSize,
      color = defaultStyle.color,
      fontWeight = defaultStyle.fontWeight,
      textAlign = defaultStyle.textAlign,
    } = style;
    const { children, onInsertElement, onWrapTypeChange } = this.props;

    return (
      <div
        className={styles.ToolBar}
        tabIndex={-1}
        // onMouseDown={(event) => {
        //   event.preventDefault();
        // }}
      >
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
          color={color as string}
          onChange={(color) => {
            this.updateStyle({ color });
          }}
        />
        {/* 粗体 */}
        <div
          style={{ fontWeight }}
          tabIndex={-1}
          onClick={() =>
            this.updateStyle({
              fontWeight: fontWeight === 'bold' ? 'normal' : 'bold',
            })
          }
        >
          B
        </div>
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
