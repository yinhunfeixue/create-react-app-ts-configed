import IComponentProps from '@/base/interfaces/IComponentProps';
import ToolBar from '@/pages/component/slateDoc/component/ToolBar';
import IElement from '@/pages/component/slateDoc/interface/IElement';
import IStyle from '@/pages/component/slateDoc/interface/IStyle';
import IText from '@/pages/component/slateDoc/interface/IText';
import React, { Component, ReactElement, ReactNode } from 'react';
import { Text, Transforms, createEditor } from 'slate';
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react';
import './SlateDoc2.less';

interface ISlateDoc2State {
  editor: ReactEditor;
  value: IElement[];
}
interface ISlateDoc2Props extends IComponentProps {
  /**
   * 额外的工具，会放在工具栏右侧
   * 工具通常分两种
   * 1. 插入元素--@see insertContent
   * 2. 修改样式--@see updateStyle
   */
  extraTools?: ReactNode;

  initData?: IElement[];

  customElementRender?: (data: RenderElementProps) => ReactElement | undefined;
}

/**
 * SlateDoc2
 */
class SlateDoc2 extends Component<ISlateDoc2Props, ISlateDoc2State> {
  constructor(props: ISlateDoc2Props) {
    super(props);
    this.state = {
      editor: withReact(createEditor()),
      value: props.initData || [],
    };
  }

  private renderLeaf(data: RenderLeafProps) {
    const { attributes, children } = data;
    let leaf: IText = data.leaf;

    return (
      <span {...attributes} style={leaf}>
        {children}
      </span>
    );
  }

  private renderElement = (data: RenderElementProps) => {
    const { customElementRender } = this.props;
    let result: ReactElement | undefined;
    if (customElementRender) {
      result = customElementRender(data);
    }
    if (!result) {
      result = this.defaultElementRender(data);
    }
    return result;
  };

  private defaultElementRender(data: RenderElementProps) {
    const { attributes, children } = data;
    let element: IElement = data.element as IElement;
    const { type, style } = element;
    const noChildrenType = ['hr', 'br'];
    if (noChildrenType.includes(type)) {
      return React.createElement(type, { ...attributes, style });
    } else {
      return React.createElement(type, { ...attributes, style, children });
    }
  }

  public updateStyle(style: IStyle) {
    const { editor } = this.state;
    const { selection } = editor;

    const previousSelection = Object.assign({}, editor.selection);

    if (selection) {
      Transforms.setNodes<IText>(editor, style, {
        match: Text.isText,
        split: true,
      });

      setTimeout(() => {
        Transforms.select(editor, previousSelection);
      }, 10);
    }
  }

  public insertContent<T = any>(element: IElement<T>) {
    const { editor } = this.state;
    const { selection } = editor;
    if (selection) {
      editor.insertNode(element);
    }
  }

  render() {
    const { editor, value } = this.state;
    const { extraTools } = this.props;
    return (
      <div className="SlateDoc2">
        {/* 操作区 */}
        <header>
          <ToolBar
            edit={editor}
            onChange={(value) => {
              this.updateStyle(value);
            }}
          >
            {extraTools}
          </ToolBar>
        </header>
        {/* 内容区 */}
        <main>
          <Slate
            editor={editor}
            value={value}
            onChange={(value) => {
              this.setState({ value: value as IElement[] });
            }}
          >
            <Editable
              renderLeaf={this.renderLeaf}
              renderElement={this.renderElement}
            />
          </Slate>
        </main>
      </div>
    );
  }
}

export default SlateDoc2;
