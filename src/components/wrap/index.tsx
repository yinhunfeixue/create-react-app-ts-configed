import React from "react";
import classnames from 'classnames';

import style from './index.lees';

export default function Wrap(props: React.PropsWithChildren<{
  padding?: number|string,
  marginBottom?: number,
  className?: string,
}>) {
  return <div className={classnames(style.wrap, { [`${props.className}`]: !!props.className })} style={{ padding: props.padding || 20, marginBottom: props.marginBottom }}>{props.children}</div>
}
