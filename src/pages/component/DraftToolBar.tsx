import { Button } from 'antd';
import React from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import './DraftToolBar.less';

interface IDraftToolBarProps {
  onBoldChange: (bold: boolean) => void;
  onColorChange: (color: ColorResult) => void;
  onInsertTable: () => void;
}
/**
 * DraftToolBar
 */
const DraftToolBar: React.FC<IDraftToolBarProps> = (props) => {
  const { onBoldChange, onColorChange, onInsertTable } = props;
  return (
    <div className="DraftToolBar">
      <button onClick={() => onBoldChange(true)}>加粗</button>
      <SketchPicker onChangeComplete={(color) => onColorChange(color)} />
      <Button onClick={onInsertTable}>插入表格</Button>
    </div>
  );
};
export default DraftToolBar;
