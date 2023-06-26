import React, { ReactNode, useEffect, useRef } from "react";
import style from './index.lees';

export default function TreeLayout (props: React.PropsWithChildren<{
  rightTitle?: ReactNode,
  leftTitle?: ReactNode,
  leftContent?: ReactNode,
  getRightContentRef?: (data: any) => void,
}>) {

  const { rightTitle, leftTitle, leftContent, getRightContentRef } = props;
  const ref = useRef();

  useEffect(() => {
    getRightContentRef && getRightContentRef(ref.current);
    console.log('ref-------', ref);
  }, [])

  return (
    <div className={style.wrap}>
      <div className={style.left}>
        <div className={style.leftTitle}>{leftTitle}</div>
        <div className={style.leftContent}>{leftContent}</div>
      </div>
      <div className={style.right}>
        <div className={style.rightTitle}>{rightTitle}</div>
        <div ref={ref} className={style.rightContent}>{props.children}</div>
      </div>
    </div>
  )
}
