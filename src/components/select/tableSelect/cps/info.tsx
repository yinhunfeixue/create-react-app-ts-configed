import React from "react";

import style from './info.lees';

const Right = <svg width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M386.844444 170.666667l-45.511111 39.822222L597.333333 512 341.333333 813.511111l39.822223 39.822222L682.666667 512z"></path></svg>

function filterLabel(str: string) {
  const label1 = `<span class='highlight'>`;
  const label2 = `</span>`;
  return str = str.replaceAll(label1, '').replaceAll(label2, '');
}

export default function(props: React.PropsWithChildren<{
  names: Record<string, any>[]
}>) {
  const { names = [] } = props;
  return (
    <div className={style.wrap}>
      <span>当前选择：</span>
      <div>
        {
          names.map((v, i) => <>
            <span>{ filterLabel(v[['dsName', 'physicalDatabase', 'physicalTable'][i]]) }</span>
            {i < names.length - 1 && <label>{Right}</label>}
          </>)
        }
      </div>
    </div>
  )
}
