import IComponentProps from '@/base/interfaces/IComponentProps';
import ToolBar from '@/pages/component/slateDoc/component/ToolBar';
import IElement from '@/pages/component/slateDoc/interface/IElement';
import IStyle from '@/pages/component/slateDoc/interface/IStyle';
import IText from '@/pages/component/slateDoc/interface/IText';
import { Button } from 'antd';
import React, { Component } from 'react';
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
interface ISlateDoc2Props extends IComponentProps {}

/**
 * SlateDoc2
 */
class SlateDoc2 extends Component<ISlateDoc2Props, ISlateDoc2State> {
  constructor(props: ISlateDoc2Props) {
    super(props);
    this.state = {
      editor: withReact(createEditor()),
      value: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'A line of asdfd fadsd adfa dfdsf asdfabggdfgdfgfdgsdf  dfgsfg dfg df',
            },
          ],
        },
      ],
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

  private renderElement(data: RenderElementProps) {
    const { attributes, children } = data;
    let element: IElement = data.element as IElement;
    switch (element.type) {
      default:
        return <p {...attributes}>{children}</p>;
    }
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
      Transforms.select(editor, previousSelection);
    }
  }

  render() {
    const { editor, value } = this.state;
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
            <div>
              <Button>插入表格</Button>
            </div>
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
