/* eslint-disable */

import React, { useEffect, useMemo, useRef } from 'react';
import { Editor, Range, Text, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, useFocused, useSlate, withReact } from 'slate-react';

import { Button, Menu } from 'antd';

const HoveringMenuExample = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <HoveringToolbar />
      <Editable
        renderLeaf={(props) => <Leaf {...props} />}
        placeholder="Enter some text..."
        onDOMBeforeInput={(event: InputEvent) => {
          switch (event.inputType) {
            case 'formatBold':
              event.preventDefault();
              return toggleFormat(editor, 'bold');
            case 'formatItalic':
              event.preventDefault();
              return toggleFormat(editor, 'italic');
            case 'formatUnderline':
              event.preventDefault();
              return toggleFormat(editor, 'underlined');
          }
        }}
      />
    </Slate>
  );
};

const toggleFormat = (editor: any, format: any) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  );
};

const isFormatActive = (editor: any, format: any) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n[format] === true,
    mode: 'all',
  });
  return !!match;
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement | null>();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      el &&
      (!selection ||
        !inFocus ||
        Range.isCollapsed(selection) ||
        Editor.string(editor, selection) === '')
    ) {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection!.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = '1';
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  return (
    <div ref={ref as any}>
      <Menu
        style={{
          padding: '8px 7px 6px',
          position: 'absolute',
          zIndex: 1,
          top: -10000,
          left: -10000,
          marginTop: -6,
          opacity: 1,
          backgroundColor: '#222',
          borderRadius: 4,
          transition: 'opacity 0.75s',
          // top: -10000px;
          // left: -10000px;
          // margin - top: -6px;
          // opacity: 0;
          // background - color: #222;
          // border - radius: 4px;
          // transition: opacity 0.75s;
        }}
        onMouseDown={(e) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault();
        }}
      >
        <FormatButton format="bold" icon="format_bold" />
        <FormatButton format="italic" icon="format_italic" />
        <FormatButton format="underlined" icon="format_underlined" />
      </Menu>
    </div>
  );
};

const FormatButton = ({ format, icon }: any) => {
  const editor = useSlate();
  return (
    <Button
      // active={isFormatActive(editor, format)}
      onClick={() => toggleFormat(editor, format)}
    >
      {icon}
    </Button>
  );
};

const initialValue: any[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'This example shows how you can make a hovering menu appear above your content, which you can use to make text ',
      },
      { text: 'bold', bold: true },
      { text: ', ' },
      { text: 'italic', italic: true },
      { text: ', or anything else you might want to do!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Try it out yourself! Just ' },
      { text: 'select any piece of text and the menu will appear', bold: true },
      { text: '.' },
    ],
  },
];

export default HoveringMenuExample;
