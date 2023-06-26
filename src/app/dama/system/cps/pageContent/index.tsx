import React, { ReactNode, useMemo } from 'react';
import style from './index.lees';
import { Button, Space, Dropdown, Menu } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface Thead extends Record<string, any> {
  icon?: string,
  title?: string,
  desc?: string,
  tag?: string
}


export default function PageContent(props: React.PropsWithChildren<{
  right: ReactNode,
  title: string,
  head: Thead
}>) {

  const { right, title, head = {} } = props;

  const menu = useMemo(() => (
    <Menu
      onClick={handleMenuClick}
      items={[
        { label: '编辑', key: 'edit' },
        { label: '删除', key: 'delete' }
      ]}
    />
  ), [])

  const handleMenuClick = e => {
    
  }

  return (
    <div className={style.wrap}>
      <div className={style.left}>
        {right}
      </div>
      <div className={style.right}>
        <div className={style.title}>
          {title}
        </div>
        <div className={style.header}>
          {
            head.icon && <img src={head.icon} />
          }
          <div className={style.text}>
            <h2>
              {head.title}
              <span className={style.tag}>{head.isLeaf ? '系统' : '分类'}</span>
            </h2>
            <p>{head.desc}</p>
          </div>
          <div className={style.operation}>
            <Space>
              <Dropdown overlay={menu}>
                <Button>...更多</Button>
              </Dropdown>
              {!head.isLeaf && <Button type="primary"><PlusOutlined/>添加应用</Button>}
            </Space>
          </div>
        </div>
        <div className={style.content}>
          {props.children}
        </div>
      </div>
    </div>
  )
}