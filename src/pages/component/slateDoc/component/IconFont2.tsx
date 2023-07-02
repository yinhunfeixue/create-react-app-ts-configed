import IComponentProps from '@/base/interfaces/IComponentProps';
import { createFromIconfontCN } from '@ant-design/icons';
import classNames from 'classnames';
import React, { Component } from 'react';
import './IconFont.less';

interface IIconFontState {}
interface IIconFontProps extends IComponentProps {
  type: string;

  /**
   * 是否使用CSS图标，CSS图标的优点：可动态修改图标颜色。缺点：只能使用纯色
   */
  useCss?: boolean;
}

const IconFontWrap = createFromIconfontCN({
  //   scriptUrl: require('../iconfont.js'),
});

/**
 * IconFont
 */
class IconFont extends Component<IIconFontProps, IIconFontState> {
  render() {
    const { type, useCss, style, className } = this.props;
    if (useCss) {
      const char = unescape(`%u${type}`);
      return (
        <span
          {...this.props}
          style={style}
          className={classNames('IconFont', className)}
        >
          {char}
        </span>
      );
    }
    return <IconFontWrap {...this.props} type={type} />;
  }
}

export default IconFont;
