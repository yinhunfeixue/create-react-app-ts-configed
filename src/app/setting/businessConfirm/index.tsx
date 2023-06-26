import React from "react";
import { ContentLayout, AppTree, AppTreeSearch } from "cps";
import { Checkbox } from 'antd';

import style from './index.lees';

export default function(props: React.PropsWithChildren<{

}>) {
  return (
    <ContentLayout
      title="业务分类"
      titleExtra={<Checkbox><span style={{ fontWeight: 400 }}>仅显示未完善</span></Checkbox>}
      init
    >
      <AppTreeSearch
        style={{ marginBottom: 16 }}
        placeholder="请输入业务分类名称"
        
      />
      <AppTree

      />
    </ContentLayout>
  )
}