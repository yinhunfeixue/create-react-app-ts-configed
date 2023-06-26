import classnames from 'classnames';
import React, { ReactNode } from "react";
import { useNavigate } from 'react-router-dom';

import style from './index.lees';


export default function ContentLayout(props: React.PropsWithChildren<{
  title?: ReactNode,
  titleExtra?: ReactNode,
  back?: boolean,
  className?: string,
  footer?: boolean,
  init?: boolean
  renderOutFooter?: ReactNode,
  outFooterHeight?: number,
  showOutFooter?: boolean,
  /**
   * 点击返回触发的事件，默认回退到上一个页面
   */
  onBack?: () => void;
}>) {
  const { title, back, className = '', footer, init, titleExtra, renderOutFooter, showOutFooter, outFooterHeight = 56,onBack } = props;

  const navigate = useNavigate();

  const backChange = () => {
      if (onBack) {
          onBack()
      } else {
          navigate(-1)
      }
  }

  return (
    <>
      <div className={classnames(style.wrap, { [style.init]: !!init })}>
        {
          title && 
          <h3>{back && <span onClick={backChange} className={`${style.back} iconfont icon-fanhui`} />}
            <span className={style.title}>{title}</span>
            {titleExtra && titleExtra}
          </h3>
        }
        <div className={classnames(style.content, { [className]: !!className })}>
          {props.children}
        </div>
        {footer && <div className={style.footer}>- DOP数据运营平台 -</div>}
      </div>
      {
        renderOutFooter && (
          <div style={{ height: outFooterHeight }} className={classnames(style.outFooter, { [style.showOutFooter]: showOutFooter })}>
            {renderOutFooter}
          </div>
        )
      }
    </>
  )
}