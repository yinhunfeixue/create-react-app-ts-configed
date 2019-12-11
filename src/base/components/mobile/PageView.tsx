import IComponentProps from '@/base/interfaces/IComponentProps';
import React, { Component, ReactNode } from 'react';
import Toucher from './Toucher';

const styles = require('./PageView.less');
const classnames = require('classnames');

export interface IPageViewProps extends IComponentProps {
  close: () => void;
  title: string;
  disabledBack: boolean;
}

/**
 * PageView
 */
class PageView<P extends IPageViewProps, S> extends Component<P, S> {
  private _show: boolean = true;
  private _touchX: number = 0;
  private _closeTouchX: number = 80;
  private _touching: boolean = false;

  /**
   * 头部样式名，其中：
   * + .className i 对应返回按钮
   * + .className h1 对应标题栏
   */
  get headerClassName() {
    return '';
  }

  /**
   * 标题
   */
  get title(): string {
    return '';
  }

  /**
   * 是否显示头部
   */
  get showHeader(): boolean {
    return true;
  }

  /**
   * 是否禁用返回按钮
   */
  get disabledBack(): boolean {
    return false;
  }

  /**
   * 是否禁用触摸返回
   */
  get disableTouchBack(): boolean {
    return false;
  }

  /**
   * 额外的内容，显示在头部右侧
   */
  get extra(): ReactNode {
    return null;
  }

  /**
   * 渲染头部，默认的头部包含3部分：返回按钮、标题、右侧扩展区
   *
   * 通常可使用参数按钮这部分的内容，如果默认结构无法满足需求，可重写此方法以完全自定义头部
   *
   * 重写时唯一要注意的地方是：关闭页面的需调用 this.close();
   */
  protected renderHeader() {
    const extra = this.extra;
    if (this.showHeader) {
      return (
        <header className={this.headerClassName}>
          {!this.disabledBack && (
            <i
              onClick={() => {
                this.close();
              }}
            />
          )}
          <h1>{this.title}</h1>
          <div className={styles.Extra}>{extra}</div>
        </header>
      );
    }
    return null;
  }

  renderChildren() {
    return <div>pageView</div>;
  }

  /**
   * 关闭页面
   */
  protected close() {
    if (this._show) {
      this._show = false;
      this.forceUpdate();
    }
  }

  render() {
    const { close } = this.props;
    const _closeTouchX = this._closeTouchX;
    const disableTouchBack = this.disableTouchBack;

    const style: any = {
      transform: `translate(${this._touchX}px)`
    };

    const bgStyle: any = {
      opacity: 0.2 + Math.max(0, (_closeTouchX - this._touchX) / _closeTouchX)
    };

    if (this._touching) {
      style.transition = 'none';
      bgStyle.transition = 'none';
    }
    return (
      <React.Fragment>
        <div
          className={classnames(styles.Bg, this._show ? '' : styles.BgClose)}
          style={bgStyle}
        />
        <Toucher
          onTouching={x => {
            if (!disableTouchBack) {
              this._touching = true;
              this._touchX = Math.max(0, x);
              this.forceUpdate();
            }
          }}
          onTouch={(h, v, x, y) => {
            if (!disableTouchBack) {
              this._touching = false;
              if (x > _closeTouchX) {
                this.close();
              } else {
                this._touchX = 0;
              }
              this.forceUpdate();
            }
          }}
          className={classnames(
            styles.PageView,
            this._show ? '' : styles.PageViewClose
          )}
          onAnimationEnd={() => {
            if (!this._show) {
              close();
            }
          }}
          style={style}
        >
          {this.renderHeader()}
          <main>{this.renderChildren()}</main>
        </Toucher>
      </React.Fragment>
    );
  }
}

export default PageView;
