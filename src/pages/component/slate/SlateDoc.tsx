import { Button } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { Editor, Element, Node, Range, Text, createEditor } from 'slate';

import MyLeaf from '@/pages/component/slate/MyLeaf';
import escapeHtml from 'escape-html';

import { Editable, RenderLeafProps, Slate, withReact } from 'slate-react';

interface FontSizeMenuProps {
  editor: Editor;
}

const FontSizeMenu: React.FC<FontSizeMenuProps> = ({ editor }) => {
  const [fontSize, setFontSize] = useState<string>('14');

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
      children: [
        {
          text: 'A line of',
        },
        {
          text: ' text i',
          bold: true,
        },
        {
          text: 'n a p',
        },
        {
          text: 'aragr',
          color: '#e70d0d',
        },
        {
          text: 'aph.',
        },
      ],
    },
  ]);

  const [htmlContent, setHtmlContent] = useState('');

  const renderElement = ({ attributes, children, element }: any) => {
    switch (element.type) {
      case 'custom':
        return <MyLeaf />;
      default:
        return <p {...attributes}>{children}</p>;
    }
  };

  const renderLeaf = useCallback(
    ({ attributes, children, leaf }: RenderLeafProps) => {
      const customLeaf = leaf as CustomText;
      const fontSize = customLeaf.fontSize || '14';
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

  /**
   * 序列化为纯文本
   * @param nodes
   * @returns
   */
  const serialize = (nodes: Node[]) => {
    return nodes.map((n: Node) => Node.string(n)).join('\n');
  };

  const serializeHTML = (node: any) => {
    if (Text.isText(node)) {
      let style: string[] = [];
      const { bold, color, fontSize } = node as any;
      if (bold) {
        style.push(`font-weight: bold`);
      }
      if (color) {
        style.push(`color: ${color}`);
      }
      if (fontSize) {
        style.push(`font-size: ${fontSize}px`);
      }
      let string = escapeHtml(node.text);

      if (style.length) {
        string = `<span style="${style.join(';')}">${string}</span>`;
      }
      return string;
    }

    const children = node.children
      ? node.children.map((n: Node) => serializeHTML(n)).join('')
      : '';

    switch (node.type) {
      case 'custom':
        return '<div style="border:1px solid #eee; width:100px; height:50px;">custom</div>';
      case 'quote':
        return `<blockquote><p>${children}</p></blockquote>`;
      case 'paragraph':
        return `<p>${children}</p>`;
      case 'link':
        return `<a href="${escapeHtml(node.url)}">${children}</a>`;
      default:
        return children;
    }
  };

  const serializeHTMLList = (node: any[]) => {
    return node.map((item) => serializeHTML(item)).join('');
  };

  const insertCustomComponent = () => {
    const { selection } = editor;
    if (selection) {
      const customComponent = {
        type: 'custom',
        children: [{ text: '' }],
      };
      editor.insertNode(customComponent);
    }
  };

  return (
    <div>
      <FontSizeMenu editor={editor} />
      <BoldButton editor={editor} />
      <ColorPicker editor={editor} />
      <Button
        onClick={() => {
          const html = serializeHTMLList(value);
          setHtmlContent(html);
          console.log(
            'save',
            value,
            `纯文本=${serialize(value)},  富文本=${html}`
          );
        }}
      >
        导出
      </Button>
      <Button onClick={() => insertCustomComponent()}>插入自定义元素</Button>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          console.log('chagne', value);

          setValue(value as CustomElement[]);
        }}
      >
        <Editable renderLeaf={renderLeaf} renderElement={renderElement} />
      </Slate>

      <h4>转换为html的效果</h4>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default RichTextEditor;
