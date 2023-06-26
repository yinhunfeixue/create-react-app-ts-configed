
import React, { ReactNode } from "react";
import styles from './index.lees';
import classnames from 'classnames';
import AutoTip from '@/component/AutoTip'

const ListHorizontal = (props: React.PropsWithChildren<{
  label: ReactNode,
  value?: ReactNode,
  content?: ReactNode
  style?: React.CSSProperties
  valueToolTip?: boolean
  toolTipWidth?: number,
  labelWidth?: number,
}>) => {
  const { label, value, content, style={ marginBottom: 12 }, valueToolTip, toolTipWidth, labelWidth } = props;
  return (
    <div className={styles.wrap} style={{ ...style }}>
      <span style={{ width: labelWidth }} className={styles.label}>{label}</span>
      <p className={classnames({ [styles.value]: value || content })}>
        {
          valueToolTip && (value || content) ? (
            <AutoTip style={{ width: toolTipWidth }} content={value || content || '-'}>
              {value || content || '-'}
            </AutoTip>
          ) : (value || content || '-')
        }
      </p>
    </div>
  )
}

const Wrap: React.FC<{ children: ReactNode, style?: React.CSSProperties, className?: string }> = (props) => {
  return (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  )
}

ListHorizontal.Wrap = Wrap;

export default ListHorizontal;