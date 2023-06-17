import ScrollBarUtil from '@/pages/component/ScrollBarUtil';
import classNames from 'classnames';
import React, { CSSProperties, Component } from 'react';
import './ScrollContainer.less';

interface IScrollContainerState {}
interface IScrollContainerProps {
  className?: string;
  style?: CSSProperties;
  onScrollSizeChange: (width: number, height: number) => void;
  scrollLeft?: number;
  scrollTop?: number;
}

/**
 * ScrollContainer
 */
class ScrollContainer extends Component<
  IScrollContainerProps,
  IScrollContainerState
> {
  private containerRef: React.RefObject<HTMLDivElement> = React.createRef();
  private contentRef: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount(): void {
    this.listenScrollChange();
  }

  private listenScrollChange() {
    if (this.containerRef.current && this.contentRef.current) {
      ScrollBarUtil.listenScrollChange(
        this.containerRef.current,
        this.contentRef.current,
        (data) => {
          const { onScrollSizeChange } = this.props;
          onScrollSizeChange(data.width, data.height);
        }
      );
    }
  }

  render() {
    const { children, style, className, scrollLeft, scrollTop } = this.props;
    return (
      <div
        ref={this.containerRef}
        className={classNames('ScrollContainer', className)}
        style={style}
      >
        <div
          className="ScrollContainerWrap"
          ref={this.contentRef}
          style={{
            transform: `translate(-${scrollLeft || 0}px, -${scrollTop || 0}px)`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default ScrollContainer;
