import { Popover } from 'antd';
import React, { Component } from 'react';
import { SwatchesPicker } from 'react-color';
import styles from './ColorPicker.module.less';

interface IColorPickerState {
  visible: boolean;
}
interface IColorPickerProps {
  color: string;
  onChange: (value: string) => void;
}

/**
 * ColorPicker
 */
class ColorPicker extends Component<IColorPickerProps, IColorPickerState> {
  constructor(props: IColorPickerProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  render() {
    const { visible } = this.state;
    const { color, onChange } = this.props;
    return (
      <Popover
        trigger={['click']}
        visible={visible}
        overlayClassName={styles.Popover}
        onVisibleChange={(visible) => this.setState({ visible })}
        content={
          <SwatchesPicker
            className={styles.ColorPicker}
            color={color}
            onChange={(color) => {
              this.setState({ visible: false });
              onChange(color.hex);
            }}
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
