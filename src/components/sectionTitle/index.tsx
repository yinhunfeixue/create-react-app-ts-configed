import React, { ReactNode } from 'react';
import style from './index.lees';

export default function SectionTitle(props: React.PropsWithChildren<{
  title: string,
  subTitle?: ReactNode,
  extra?: ReactNode,
  style?: React.CSSProperties,
  
}>) {

  const { title, subTitle, extra } = props;

  return (
    <div className={style.wrap} style={props.style}>
      <h3>
        {title}
        {subTitle && <>{subTitle}</>}
      </h3>
      {
        extra && extra
      }
    </div>
  )
}
