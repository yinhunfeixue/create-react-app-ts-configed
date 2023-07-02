import DraftToolBar from '@/pages/component/DraftToolBar';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import React, { useCallback, useState } from 'react';

interface IDraftDocProps {}

/**
 * DraftDoc
 */
const DraftDoc: React.FC<IDraftDocProps> = (props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [colorStyleMap, setColorStyleMap] = useState({});

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

  return (
    <div>
      <DraftToolBar
        onBoldChange={toggleBold}
        onColorChange={changeColor}
        onInsertTable={() => {}}
      />
      <Editor
        customStyleMap={colorStyleMap}
        editorState={editorState}
        onChange={(value) => setEditorState(value)}
      />
    </div>
  );
};
export default DraftDoc;
