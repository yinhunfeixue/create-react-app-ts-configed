import { Button } from 'antd';
import React from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import './DraftToolBar.less';

interface IDraftToolBarProps {
  onBoldChange: (bold: boolean) => void;
  onColorChange: (color: ColorResult) => void;
  onInsertTable: () => void;
  onFontSizeChange: (value: number) => void;
}
/**
 * DraftToolBar
 */
const DraftToolBar: React.FC<IDraftToolBarProps> = (props) => {
  const { onBoldChange, onColorChange, onInsertTable, onFontSizeChange } =
    props;
  return (
    <div className="DraftToolBar">
      <button onClick={() => onBoldChange(true)}>加粗</button>
      <SketchPicker onChangeComplete={(color) => onColorChange(color)} />
      <Button onClick={() => onFontSizeChange(24)}>设置字号</Button>
      <Button onClick={onInsertTable}>插入表格</Button>
    </div>
  );
};
export default DraftToolBar;
