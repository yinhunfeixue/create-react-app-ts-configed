import IComponentProps from '@/base/interfaces/IComponentProps';
import ToolBar from '@/pages/component/slateDoc/component/ToolBar';
import IElement from '@/pages/component/slateDoc/interface/IElement';
import IStyle from '@/pages/component/slateDoc/interface/IStyle';
import IText from '@/pages/component/slateDoc/interface/IText';
import React, { Component, ReactElement, ReactNode } from 'react';
import { Editor, Node, Text, Transforms, createEditor } from 'slate';
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
    const editor = withReact(createEditor());
    this.state = {
      editor,
      value: props.initData || [],
    };
  }

  private renderLeaf(data: RenderLeafProps) {
    const { attributes, children } = data;
    let leaf: IText = data.leaf;
    const { type = 'span' } = leaf;
    return React.createElement(type, {
      ...attributes,
      style: leaf,
      children: <span>{children}</span>,
    });
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
      return React.createElement(type === 'p' ? 'div' : type, {
        ...attributes,
        style,
        children,
      });
    }
  }

  public removeItem(match: (n: IElement) => boolean) {
    const { editor } = this.state;
    for (const [node, path] of Node.nodes(editor)) {
      if (match(node as IElement)) {
        Transforms.removeNodes(editor, { at: path });
        break;
      }
    }
  }

  public updateItem(match: (n: IElement) => boolean, data: Partial<IElement>) {
    const { editor } = this.state;
    for (const [node, path] of Node.nodes(editor)) {
      if (match(node as IElement)) {
        Transforms.setNodes(editor, data, { at: path });
        break;
      }
    }
  }

  private updateType(type: string) {
    const { editor } = this.state;
    Transforms.setNodes<IElement>(
      editor,
      { type },
      { match: (n) => Editor.isBlock(editor, n as any) }
    );
  }

  private updateStyle(style: IStyle) {
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

  public insertContent<T = any>(element: Partial<IElement<T>>) {
    const { editor } = this.state;
    const { selection } = editor;
    if (selection) {
      if (!element.children) {
        element.children = [
          {
            text: '',
          },
        ];
      }
      editor.insertNode(element as IElement);
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
            onStyleChange={(value) => {
              this.updateStyle(value);
            }}
            onTypeChange={(value) => {
              this.updateType(value);
            }}
            onInsertElement={(type) => {
              this.insertContent({
                type,
              });
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
