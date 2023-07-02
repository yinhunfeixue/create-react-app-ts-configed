// @ts-ignore
import QuillTable from 'quill-table';
import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

import './QuillDoc.less';

ReactQuill.Quill.register({ 'modules/table': QuillTable }, true);

interface IQuillDocProps {}
/**
 * QuillDoc
 */
const QuillDoc: React.FC<IQuillDocProps> = (props) => {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {}, []);

  const toolbarOptions = {
    container: '#toolbar', // 将工具栏与外部元素关联
    handlers: {
      // 添加自定义处理程序（如果需要）
    },
  };

  const insertTable = () => {
    const quill = quillRef.current?.getEditor();
    const range = quill?.getSelection();

    console.log('insert table', range);

    if (range) {
      quill?.insertEmbed(range.index, 'table', 'new');
    }
  };

  return (
    <div className="QuillDoc">
      <header id="toolbar">
        {/* 在这里添加工具栏按钮 */}
        <button className="ql-bold">Bold</button>
        <button className="ql-italic">Italic</button>
        <button className="ql-underline">Underline</button>
        <select className="ql-size" value="normal" onChange={() => {}}>
          <option value="small">Small</option>
          <option value="normal">Normal</option>
          <option value="large">Large</option>
          <option value="huge">Huge</option>
        </select>
        <button className="ql-table" onClick={() => insertTable()}>
          Table
        </button>
      </header>
      <ReactQuill
        value={`<p><span style="color:red">aaaa</span>bbb</p>`}
        className="QuillDocBody"
        ref={quillRef}
        theme="snow"
        modules={{ toolbar: toolbarOptions }}
      />
    </div>
  );
};
export default QuillDoc;
