import React, { useCallback, useMemo, useState } from 'react';
import { Editor, Element, Range, Text, createEditor } from 'slate';
import { Editable, RenderLeafProps, Slate, withReact } from 'slate-react';

interface FontSizeMenuProps {
  editor: Editor;
}

const FontSizeMenu: React.FC<FontSizeMenuProps> = ({ editor }) => {
  const [fontSize, setFontSize] = useState<string>('16');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = event.target.value;
    const { selection } = editor;

    if (selection && Range.isExpanded(selection)) {
      Editor.addMark(editor, 'fontSize', newSize);
    }

    setFontSize(newSize);
  };

  return (
    <select value={fontSize} onChange={handleChange}>
      <option value="12">12</option>
      <option value="14">14</option>
      <option value="16">16</option>
      <option value="18">18</option>
      <option value="20">20</option>
    </select>
  );
};

const BoldButton: React.FC<FontSizeMenuProps> = ({ editor }) => {
  const handleClick = () => {
    const { selection } = editor;
    if (selection && Range.isExpanded(selection)) {
      Editor.addMark(editor, 'bold', true);
    } else {
      Editor.removeMark(editor, 'bold');
    }
  };

  return <button onClick={handleClick}>Bold</button>;
};

const ColorPicker: React.FC<FontSizeMenuProps> = ({ editor }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    const { selection } = editor;

    if (selection && Range.isExpanded(selection)) {
      Editor.addMark(editor, 'color', color);
    }
  };

  return <input type="color" onChange={handleChange} />;
};

interface CustomElement extends Element {
  type: string;
  children: CustomText[];
}

interface CustomText extends Text {
  fontSize?: string;
  bold?: boolean;
  color?: string;
}

const RichTextEditor: React.FC = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<CustomElement[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);

  const renderLeaf = useCallback(
    ({ attributes, children, leaf }: RenderLeafProps) => {
      const customLeaf = leaf as CustomText;
      const fontSize = customLeaf.fontSize || '16';
      const fontWeight = customLeaf.bold ? 'bold' : 'normal';
      const color = customLeaf.color || 'black';
      return (
        <span
          {...attributes}
          style={{ fontSize: `${fontSize}px`, fontWeight, color }}
        >
          {children}
        </span>
      );
    },
    []
  );

  return (
    <div>
      <FontSizeMenu editor={editor} />
      <BoldButton editor={editor} />
      <ColorPicker editor={editor} />
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => setValue(value as CustomElement[])}
      >
        <Editable renderLeaf={renderLeaf} />
      </Slate>
    </div>
  );
};

export default RichTextEditor;
