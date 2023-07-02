import { Popover } from 'antd';
import React, { Component } from 'react';
import { SwatchesPicker } from 'react-color';
import styles from './ColorPicker.module.less';

interface IColorPickerState {}
interface IColorPickerProps {
  color: string;
  onChange: (value: string) => void;
}

/**
 * ColorPicker
 */
class ColorPicker extends Component<IColorPickerProps, IColorPickerState> {
  render() {
    const { color, onChange } = this.props;
    return (
      <Popover
        trigger={['click']}
        overlayClassName={styles.Popover}
        content={
          <SwatchesPicker
            className={styles.ColorPicker}
            color={color}
            onChange={(color) => onChange(color.hex)}
          />
        }
      >
        <div
          className={styles.ColorButton}
          style={{ backgroundColor: color }}
        />
      </Popover>
    );
  }
}

export default ColorPicker;
