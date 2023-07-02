import IComponentProps from '@/base/interfaces/IComponentProps';
import ToolBar from '@/pages/component/slateDoc/component/ToolBar';
import IDocController from '@/pages/component/slateDoc/interface/IDocController';
import IElement from '@/pages/component/slateDoc/interface/IElement';
import IStyle from '@/pages/component/slateDoc/interface/IStyle';
import IText from '@/pages/component/slateDoc/interface/IText';
import classNames from 'classnames';
import L from 'lodash';
import React, { Component, ReactElement, ReactNode } from 'react';
import {
  Editor,
  Element,
  Node,
  Range,
  Text,
  Transforms,
  createEditor,
} from 'slate';
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

  showDrop?: boolean;
  dropContent?: ReactNode;
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

  customElementRender?: (
    data: RenderElementProps,
    controller: IDocController
  ) => ReactElement | undefined;

  disabledEdit?: boolean;

  isInline?: (node: IElement) => boolean;

  docScale?: number;

  bodyExtra?: ReactNode;
}

/**
 * SlateDoc2
 */
class SlateDoc2 extends Component<ISlateDoc2Props, ISlateDoc2State> {
  public controller!: IDocController;
  constructor(props: ISlateDoc2Props) {
    super(props);
    const editor = withReact(createEditor());
    if (props.isInline) {
      editor.isInline = props.isInline as any;
    }
    this.state = {
      editor,
      value: props.initData || [
        {
          type: 'p',
          children: [
            {
              text: '',
            },
          ],
        },
      ],
    };

    this.controller = {
      insertItem: this.insertItem,
      removeItem: this.removeItem,
      updateItem: this.updateItem,
      getValue: () => this.state.value,
      insertItemList: this.insertItemList.bind(this),
    };
  }

  private insertItem = <T = any,>(element: IElement<T>) => {
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
  };

  private insertItemList<T = any>(elementList: IElement<T>[]) {
    const { editor } = this.state;
    const { selection } = editor;
    if (selection) {
      editor.insertNodes(elementList, {});
    }
  }

  private removeItem = (match: (n: IElement) => boolean) => {
    const { editor } = this.state;
    for (const [node, path] of Node.nodes(editor)) {
      if (match(node as IElement)) {
        Transforms.removeNodes(editor, { at: path });
        break;
      }
    }
  };

  private updateItem = (
    match: (n: IElement) => boolean,
    data: Partial<IElement>
  ) => {
    const { editor } = this.state;
    for (const [node, path] of Node.nodes(editor)) {
      if (match(node as IElement)) {
        Transforms.setNodes(editor, data, { at: path });
        break;
      }
    }
  };

  private renderLeaf(data: RenderLeafProps) {
    const { attributes, children } = data;
    let leaf: IText = data.leaf;
    const { type = 'span', props } = leaf;
    return React.createElement(type, {
      ...attributes,
      ...props,
      children,
    });
  }

  private renderElement = (data: RenderElementProps) => {
    const { customElementRender } = this.props;
    let result: ReactElement | undefined;
    if (customElementRender) {
      result = customElementRender(data, this.controller);
    }
    if (!result) {
      result = this.defaultElementRender(data);
    }
    return result;
  };

  private defaultElementRender(data: RenderElementProps) {
    const { attributes, children } = data;
    let element: IElement = data.element as IElement;
    const { type = 'div', props } = element;
    const noChildrenType = ['hr'];

    if (noChildrenType.includes(type)) {
      return React.createElement(type, { ...attributes });
    } else {
      return React.createElement(type, {
        ...attributes,
        ...props,
        children,
      });
    }
  }

  private updateType(type: string) {
    const { editor } = this.state;

    Transforms.setNodes<IElement>(editor, { type }, { split: true });
  }

  private wrapType(
    wrapType: string,
    type: string,
    removedWrapType: string[] = []
  ) {
    const { editor } = this.state;
    const { selection } = editor;

    if (!selection) {
      return;
    }

    const hasNode = Boolean(
      Array.from(
        Editor.nodes(editor, {
          at: selection,
          match: (n) => Element.isElement(n) && (n as IElement).type === type,
        })
      ).length
    );
    const nodes = Array.from(
      Editor.nodes(editor, {
        at: selection,
        match: (n) => !Editor.isEditor(n) && Element.isElement(n),
      })
    );

    if (hasNode) {
      // 还原type，并移除wrap
      for (const [node, path] of nodes) {
        if ((node as IElement).type === type) {
          Transforms.setNodes<IElement>(
            editor,
            { type: (node as IElement).orgType, orgType: undefined },
            {
              at: path,
            }
          );
        }
      }
      Transforms.unwrapNodes(editor, {
        match: (n) => {
          const type = (n as IElement).type;
          const result =
            !Editor.isEditor(n) &&
            Element.isElement(n) &&
            (type === wrapType || removedWrapType.includes(type));
          return result;
        },
      });
    } else {
      // 设置结点类型和源类型，并添加包裹元素
      for (const [node, path] of nodes) {
        Transforms.setNodes<IElement>(
          editor,
          { type, orgType: (node as IElement).type },
          { at: path }
        );
      }
      Transforms.wrapNodes(editor, {
        type: wrapType,
      } as any);
    }
  }

  private getSelectNodeList() {
    const { editor } = this.state;
    const { selection } = editor;
    if (selection) {
      const array = Array.from(Editor.nodes(editor, { at: selection }));
      if (array.length) {
        return array.map((item) => item[0]) as unknown as IElement[];
      }
    }
    return undefined;
  }

  private updateStyle(style: IStyle) {
    const { editor } = this.state;
    const { selection } = editor;

    if (selection) {
      // const previousSelection = Object.assign({}, editor.selection);
      const useBlock = Boolean(style.textAlign);
      const blockMatch = (n: Node) => {
        return Element.isElement(n) && !Editor.isEditor(n);
      };
      const inlineMatch = Text.isText;

      const match = useBlock ? blockMatch : inlineMatch;

      Transforms.setNodes(editor, { props: { style } } as IElement, {
        match,
        split: !useBlock,
        merge: (props, node) => {
          const value = L.merge({}, props, node);
          return value;
        },
      });

      // setTimeout(() => {
      //   Transforms.select(editor, previousSelection);
      // }, 100);
    }
  }

  private valueChangeHandler() {
    const checkList = [this.checkQuote];
    for (const item of checkList) {
      if (item()) {
        break;
      }
    }
  }

  private checkQuote = (): boolean => {
    // 获取前后文本，判断是否显示下拉框
    const textOnBothSides = this.getBeforeAndAfterText();
    if (textOnBothSides) {
      const { before, after } = textOnBothSides;

      const beforeIndex = before.lastIndexOf('[[');
      const afterIndex = after.indexOf(']]');

      // 如果是光标在 [[]]中间，则显示下拉框
      if (beforeIndex >= 0 && afterIndex >= 0) {
        const beforeContent = before.substring(beforeIndex + 2);
        const afterContent = after.substring(0, afterIndex);
        this.setState({
          showDrop: true,
          dropContent: `${beforeContent}-${afterContent}`,
        });
        return true;
      }
    }
    this.setState({ showDrop: false, dropContent: `` });
    return false;
  };

  private getBeforeAndAfterText():
    | { before: string; after: string }
    | undefined {
    const { editor } = this.state;
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      // 获取光标前后的位置
      let before = Editor.before(editor, selection, { unit: 'block' });
      let after = Editor.after(editor, selection, { unit: 'block' });

      // 创建一个包含光标前后的范围
      let beforeRange = before
        ? { anchor: before, focus: selection.anchor }
        : null;
      let afterRange = after
        ? { anchor: selection.anchor, focus: after }
        : null;

      // 获取这个范围内的文本
      let beforeText = beforeRange ? Editor.string(editor, beforeRange) : '';
      let afterText = afterRange ? Editor.string(editor, afterRange) : '';
      return { before: beforeText, after: afterText };
    }
    return undefined;
  }

  render() {
    const { editor, value, showDrop, dropContent } = this.state;
    const {
      extraTools,
      className,
      style,
      disabledEdit,
      docScale = 1,
      bodyExtra,
    } = this.props;

    const selectedNodeList = this.getSelectNodeList();

    return (
      <div className={classNames('SlateDoc2', className)} style={style}>
        {/* 操作区 */}
        {!disabledEdit ? (
          <header>
            <ToolBar
              selectedNodeList={selectedNodeList}
              edit={editor}
              onStyleChange={(value) => {
                this.updateStyle(value);
              }}
              onTypeChange={(value) => {
                this.updateType(value);
              }}
              onInsertElement={(type) => {
                this.insertItem({
                  type,
                  children: [
                    {
                      text: '',
                    },
                  ],
                });
              }}
              onWrapTypeChange={(wrapType, type, removedWrapType) => {
                this.wrapType(wrapType, type, removedWrapType);
              }}
            >
              {extraTools}
            </ToolBar>
          </header>
        ) : null}

        {/* 内容区 */}
        <div className="SlateDocBody">
          {bodyExtra}
          <main style={{ transform: `scale(${docScale})` }}>
            <Slate
              editor={editor}
              value={value}
              onChange={(value) => {
                this.setState({ value: value as IElement[] });
                this.valueChangeHandler();
              }}
            >
              <Editable
                readOnly={disabledEdit}
                style={{ padding: 20 }}
                renderLeaf={this.renderLeaf}
                renderElement={this.renderElement}
              />
            </Slate>
          </main>
          {showDrop ? (
            <div style={{ position: 'absolute', top: 200, left: '50%' }}>
              drop {dropContent}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default SlateDoc2;
