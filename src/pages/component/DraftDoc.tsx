import DraftToolBar from '@/pages/component/DraftToolBar';
import { Button, message } from 'antd';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import React, { useCallback, useRef, useState } from 'react';
import './DraftDoc.less';

interface IDraftDocProps {}

const initHTML = `<p>我是初始值 ,<span style="color:red;font-size:24px">asfsfj</span>skgl sjkgjdfgkl;sdjg l;djgk sdfg df</p>`;

/**
 * DraftDoc
 */
const DraftDoc: React.FC<IDraftDocProps> = (props) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromHTML(initHTML))
  );
  const [colorStyleMap, setColorStyleMap] = useState({
    fontSize24: {
      fontSize: 24,
    },
  });

  const toggleBold = useCallback(() => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  }, [editorState]);

  const changeColor = useCallback(
    (color) => {
      const colorStyle = `COLOR_${color.hex}`;
      let editorStateWithColor = RichUtils.toggleInlineStyle(
        editorState,
        colorStyle
      );

      // 添加颜色样式定义到 colorStyleMap
      setColorStyleMap((prevColorStyleMap) => ({
        ...prevColorStyleMap,
        [colorStyle]: { color: color.hex },
      }));

      // 移除旧的颜色样式
      const currentInlineStyle = editorStateWithColor.getCurrentInlineStyle();
      currentInlineStyle.forEach((style) => {
        if (style && style.startsWith('COLOR_') && style !== colorStyle) {
          editorStateWithColor = RichUtils.toggleInlineStyle(
            editorStateWithColor,
            style
          );
        }
      });

      setEditorState(editorStateWithColor);
    },
    [editorState]
  );

  const setFontSize = useCallback(
    (value: number) => {
      setEditorState(
        RichUtils.toggleInlineStyle(editorState, `fontSize${value}`)
      );
      setTimeout(() => {
        if (editRef.current) {
          editRef.current.focus();
        }
      }, 0);
    },
    [editorState]
  );

  const exportHTML = useCallback(() => {
    const result = convertToHTML(editorState.getCurrentContent());
    console.log('result', result);

    message.success(result);
  }, [editorState]);

  const editRef = useRef<Draft.DraftComponent.Base.DraftEditor>(null);

  return (
    <div className="DraftDoc">
      <DraftToolBar
        onBoldChange={toggleBold}
        onColorChange={changeColor}
        onInsertTable={() => {}}
        onFontSizeChange={(value) => setFontSize(value)}
      />
      <div className="DraftDocBody">
        <div>
          <Button onClick={() => exportHTML()}>保存</Button>
        </div>
        <Editor
          ref={editRef}
          customStyleMap={colorStyleMap}
          editorState={editorState}
          onChange={(value) => setEditorState(value)}
        />
      </div>
    </div>
  );
};
export default DraftDoc;
