import React from 'react';
import classnames from 'classnames';

import style from './index.lees';

export default function (props: React.PropsWithChildren<{
  onClick?: () => void,
  color?: string,
  width?: number,
  height?: number,
  style?: React.CSSProperties,
  className?: string
}>) {

  const { onClick, color = '#4D73FF', width = 14, height = 14, className } = props;

  return (
    <span className={classnames(style.wrap, { [`${className}`]: !!className })} onClick={onClick} style={props.style}>
      <svg viewBox="0 0 1024 1024" p-id="5379" width={width} height={height}><path d="M468.672 150.656v86.656H150.656v636.032h636.032V555.328h86.656V960H64V150.656h404.672zM959.232 64v265.984h-86.656V212.672L542.912 542.4l-61.312-61.248 330.368-330.496H684.8V64h274.432z" fill={color} p-id="5380"></path></svg>
    </span>
  )
}
