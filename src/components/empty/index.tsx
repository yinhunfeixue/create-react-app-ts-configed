import React from "react";
import { Empty as EmptyPage } from 'antd';

import styles from './index.lees';

export default function Empty(props: React.PropsWithChildren<{
  type?: string,
  image: string,
  desc?: string,
  height?: number,
  style?: React.CSSProperties
}>) {

  const { image, desc, height = 500, style={} } = props;

  return (
    <div style={{ ...style }}>
      <EmptyPage
        style={{ height, }}
        className={styles.emptyWrap}
        image={image}
        imageStyle={{
          height: 96,
        }}
        description={
          <span className={styles.desc}>
            {desc}
          </span>
        }
      >{props.children}</EmptyPage>
    </div>
  )
}
