import { Editor, EditorState, Modifier, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import React, { useState } from 'react';

interface RichTextEditorProps {}

const styleMap = {
  'FONTSIZE-12': {
    fontSize: '12px',
  },
  'FONTSIZE-14': {
    fontSize: '14px',
  },
  'FONTSIZE-16': {
    fontSize: '16px',
  },
  'FONTSIZE-18': {
    fontSize: '18px',
  },
  'FONTSIZE-20': {
    fontSize: '20px',
  },
  'COLOR-red': {
    color: 'red',
  },
};

const RichTextEditor: React.FC<RichTextEditorProps> = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  const toggleBold = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const setFontSize = (fontSize: string) => {
    const selection = editorState.getSelection();
    const nextContentState = Modifier.applyInlineStyle(
      editorState.getCurrentContent(),
      selection,
      `FONTSIZE-${fontSize}`
    );
    setEditorState(
      EditorState.push(editorState, nextContentState, 'change-inline-style')
    );
  };

  const setColor = (color: string) => {
    const selection = editorState.getSelection();
    const nextContentState = Modifier.applyInlineStyle(
      editorState.getCurrentContent(),
      selection,
      `COLOR-${color}`
    );
    console.log('color', `COLOR-${color}`);

    setEditorState(
      EditorState.push(editorState, nextContentState, 'change-inline-style')
    );
  };

  const exportHtml = () => {
    const contentState = editorState.getCurrentContent();
    const options = {
      inlineStyles: {
        'FONTSIZE-12': { style: { fontSize: '12px' } },
        'FONTSIZE-14': { style: { fontSize: '14px' } },
        'FONTSIZE-16': { style: { fontSize: '16px' } },
        'FONTSIZE-18': { style: { fontSize: '18px' } },
        'FONTSIZE-20': { style: { fontSize: '20px' } },
        'COLOR-red': { style: { color: 'red' } },
      },
    };
    const html = stateToHTML(contentState, options);
    console.log(html);
  };

  return (
    <div>
      <button onClick={toggleBold}>Bold</button>
      <select
        onChange={(e) => setFontSize(e.target.value)}
        defaultValue="default"
      >
        <option value="default" disabled>
          Font Size
        </option>
        <option value="12">12</option>
        <option value="14">14</option>
        <option value="16">16</option>
        <option value="18">18</option>
        <option value="20">20</option>
      </select>
      <input
        type="color"
        onChange={(e) => {
          setColor('red');
        }}
      />
      <button onClick={exportHtml}>Export HTML</button>
      <Editor
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
        customStyleMap={styleMap}
      />
    </div>
  );
};

export default RichTextEditor;
