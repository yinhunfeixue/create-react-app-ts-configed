import IComponentProps from '@/base/interfaces/IComponentProps';
import ToolBar from '@/pages/component/slateDoc/component/ToolBar';
import React, { Component } from 'react';
import { Editor, createEditor } from 'slate';
import './SlateDoc2.less';

interface ISlateDoc2State {
  editor: Editor;
}
interface ISlateDoc2Props extends IComponentProps {}

/**
 * SlateDoc2
 */
class SlateDoc2 extends Component<ISlateDoc2Props, ISlateDoc2State> {
  constructor(props: ISlateDoc2Props) {
    super(props);
    this.state = {
      editor: createEditor(),
    };
  }

  render() {
    const { editor } = this.state;
    return (
      <div className="SlateDoc2">
        {/* 操作区 */}
        <header>
          <ToolBar
            edit={editor}
            onChange={(value) => {
              console.log('styleChange', value);
            }}
          />
        </header>
        {/* 内容区 */}
      </div>
    );
  }
}

export default SlateDoc2;
