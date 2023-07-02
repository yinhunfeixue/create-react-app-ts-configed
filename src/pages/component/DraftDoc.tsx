import DraftToolBar from '@/pages/component/DraftToolBar';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import React, { useCallback, useState } from 'react';
import './DraftDoc.less';

interface IDraftDocProps {}

/**
 * DraftDoc
 */
const DraftDoc: React.FC<IDraftDocProps> = (props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [colorStyleMap, setColorStyleMap] = useState({
    fontsize24: {
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

  const setFontSize = useCallback(() => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'fontsize24'));
  }, [editorState]);

  return (
    <div className="DraftDoc">
      <DraftToolBar
        onBoldChange={toggleBold}
        onColorChange={changeColor}
        onInsertTable={() => {
          setFontSize();
        }}
      />
      <div className="DraftDocBody">
        <Editor
          customStyleMap={colorStyleMap}
          editorState={editorState}
          onChange={(value) => setEditorState(value)}
        />
      </div>
    </div>
  );
};
export default DraftDoc;
