import { Component, CSSProperties } from 'react';

interface IScrollBarState {
  value?: number;
}
interface IScrollBarProps {
  maxValue: number;
  value?: number;
  className?: string;
  style?: CSSProperties;
  onSChange?: (value: number) => void;
}

/**
 * ScrollBar
 */
class ScrollBar extends Component<IScrollBarProps, IScrollBarState> {
  get value() {
    const { value } = this.props;
    return value === undefined ? this.state.value : value;
  }

  private caluteSize() {
    // 滑块尺寸规则
    // 1. 滑块最小尺寸为 
    // 2. 当轨道尺寸大于maxValue + 100时，
  }

  render() {
    const { className, style, maxValue } = this.props;
    const value = this.value;

    // 计算滑块尺寸、位置

    return (
      <div className={className} style={style}>
        <div />
      </div>
    );
  }
}

export default ScrollBar;
