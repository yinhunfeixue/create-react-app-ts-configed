import ScrollBarDirection from '@/pages/component/ScrollBarDirection';
import classnames from 'classnames';
import React, { Component, CSSProperties } from 'react';
import './ScrollBar.less';

interface IScrollBarState {
  value: number;
}
interface IScrollBarProps {
  maxValue: number;
  value?: number;
  className?: string;
  style?: CSSProperties;
  onChange?: (value: number) => void;
  direction: ScrollBarDirection;
}

interface IPoint {
  x: number;
  y: number;
}
/**
 * ScrollBar
 */
class ScrollBar extends Component<IScrollBarProps, IScrollBarState> {
  private _mousedownPoint?: IPoint;
  private _mousedownValue?: number;

  constructor(props: IScrollBarProps) {
    super(props);
    this.state = {
      value: 0,
    };
  }
  get value() {
    const { value } = this.props;
    return value === undefined ? this.state.value : value;
  }

  private trackRef: React.RefObject<HTMLDivElement> = React.createRef();

  private sliderRef: React.RefObject<HTMLDivElement> = React.createRef();

  private caluteSliderSize() {
    const { maxValue } = this.props;
    // 滑块尺寸规则
    // 1. 设定滑块最小尺寸=轨道尺寸/5
    // 2. 滑块尺寸=Math.max(轨道尺寸-maxValue, 最小尺寸）
    const trackSize = this.trackSize;
    const minSliderSize = trackSize / 5;
    return Math.max(trackSize - maxValue, minSliderSize);
  }

  private get trackSize() {
    return this.getElementSize(this.trackRef.current);
  }

  private get sliderSize() {
    return this.getElementSize(this.sliderRef.current);
  }

  private set sliderSize(value: number) {
    this.setElementSize(this.sliderRef.current, value);
  }

  private set sliderPosition(value: number) {
    this.setElementPosition(this.sliderRef.current, value);
  }

  private getElementSize(target: HTMLElement | null): number {
    if (!target) {
      return 0;
    }
    const rect = target.getBoundingClientRect();
    const { direction } = this.props;
    switch (direction) {
      case ScrollBarDirection.H:
        return rect.width;
      default:
        return rect.height;
    }
  }

  private setElementSize(target: HTMLElement | null, value: number) {
    if (!target) {
      return;
    }

    const strValue = `${value || 0}px`;
    const { direction } = this.props;
    switch (direction) {
      case ScrollBarDirection.H:
        return (target.style.width = strValue);
      default:
        return (target.style.height = strValue);
    }
  }

  private setElementPosition(target: HTMLElement | null, value: number) {
    if (!target) {
      return;
    }

    const strValue = `${value || 0}px`;
    const { direction } = this.props;
    switch (direction) {
      case ScrollBarDirection.H:
        return (target.style.left = strValue);
      default:
        return (target.style.top = strValue);
    }
  }

  private updateSizeAndPosition() {
    const { maxValue } = this.props;
    const value = this.value;

    // 获取滑块尺寸
    const sliderSize = this.caluteSliderSize();
    // 获取滑块位置=(轨道宽度-滑块宽度) * value / maxValue
    const sliderPosition = ((this.trackSize - sliderSize) * value) / maxValue;

    this.sliderPosition = sliderPosition;
    this.sliderSize = sliderSize;
  }

  componentDidMount() {
    this.updateSizeAndPosition();
  }

  componentDidUpdate(prevProps: typeof this.props) {
    type t2 = keyof typeof this.props;
    const nameList: t2[] = ['maxValue', 'value', 'direction'];
    let needUpdate = false;
    for (let item of nameList) {
      if (this.props[item] !== prevProps[item]) {
        needUpdate = true;
        break;
      }
    }

    if (needUpdate) {
      this.updateSizeAndPosition();
    }
  }

  private startDrag(event: MouseEvent) {
    this._mousedownPoint = {
      x: event.pageX,
      y: event.pageY,
    };
    this._mousedownValue = this.value;
    this.addListeners();
  }

  private endDrag() {
    this._mousedownPoint = undefined;
    this._mousedownValue = undefined;
    this.removeListeners();
  }

  private addListeners() {
    this.removeListeners();
    document.body.addEventListener('mousemove', this.mouseMoveHandler);
    document.body.addEventListener('mouseup', this.mouseUpHandler);
  }

  private removeListeners() {
    document.body.removeEventListener('mousemove', this.mouseMoveHandler);
    document.body.removeEventListener('mouseup', this.mouseUpHandler);
  }

  private getDistance(p1: IPoint, p2: IPoint) {
    const { direction } = this.props;
    switch (direction) {
      case ScrollBarDirection.H:
        return p2.x - p1.x;
      default:
        return p2.y - p1.y;
    }
  }

  private mouseMoveHandler = (event: MouseEvent) => {
    if (!this._mousedownPoint) {
      return;
    }
    const { maxValue } = this.props;
    const point: IPoint = {
      x: event.pageX,
      y: event.pageY,
    };
    const distance = this.getDistance(this._mousedownPoint, point);
    const currentValue = Math.max(
      0,
      Math.min(maxValue, (this._mousedownValue || 0) + distance)
    );
    this.setValue(currentValue);
  };

  private setValue(value = 0) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
    this.setState({ value });
    this.updateSizeAndPosition();
  }

  private mouseUpHandler = (event: MouseEvent) => {
    this.endDrag();
  };

  render() {
    const { className, style } = this.props;
    return (
      <div
        className={classnames('DmpScrollTrack', className)}
        style={style}
        ref={this.trackRef}
      >
        <div
          className={classnames('DmpScrollSlider', className)}
          ref={this.sliderRef}
          onMouseDown={(event) => this.startDrag(event.nativeEvent)}
        />
      </div>
    );
  }
}

export default ScrollBar;
