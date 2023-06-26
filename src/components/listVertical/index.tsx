
import React from "react";
import style from './index.lees';
import classnames from 'classnames';

const ListVertical = (props: React.PropsWithChildren<{
  label: string,
  value?: string,
}>) => {
  const { label, value } = props;
  return (
    <div className={style.wrap}>
      <p>{label}</p>
      <p className={classnames({ [style.value]: value })}>{value || '-'}</p>
    </div>
  )
}

export default ListVertical;