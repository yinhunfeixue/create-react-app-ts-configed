import React, { useState } from 'react';
interface IColorPickerProps {
  color?: string;
}
/**
 * ColorPicker
 */
const ColorPicker: React.FC<IColorPickerProps> = (props) => {
  const [color, setColor] = useState(props.color || '#000000');

  return <div style={{ backgroundColor: color }}></div>;
};
export default ColorPicker;
