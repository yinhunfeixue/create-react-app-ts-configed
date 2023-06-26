import React, { ReactNode } from "react";
import SectionTitle from "../sectionTitle";
import style from './index.lees';

import classnames from 'classnames';

const Section: React.FC<{
  children: ReactNode
  title?: string,
  titleBottom?: number
  subTitle?: ReactNode,
  extra?: ReactNode,
  className?: string,
}> = props => {
  const { className, titleBottom = 16 } = props;
  return (
    <div className={classnames(style.section, { [`${className}`]: className })}>
      { props.title && <SectionTitle title={props.title} style={{marginBottom: titleBottom}} subTitle={props.subTitle} extra={props.extra} /> }
      {props.children}
    </div>
  )
}

export default Section;