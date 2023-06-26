import React, { ReactNode } from 'react';
import { CloseOutlined } from '@ant-design/icons';

import { Drawer, DrawerProps, Space, Button, Divider } from 'antd';
import classnames from 'classnames';

import './index.less';

const ExtraGroup = (props: React.PropsWithChildren<{
  onClose: (event: any) => void,
  createExtraElement?: () => React.ReactNode[]
}>) => {
  const { createExtraElement, onClose } = props
  const closable = Boolean(onClose)

  let elementList: ReactNode[] = closable ? [<CloseOutlined onClick={(event) => onClose && onClose(event as any)} />] : []
  if (createExtraElement) {
      elementList = createExtraElement().concat(elementList)
  }
  elementList = elementList
      .map((item, index) => {
          if (index < elementList.length - 1) {
              return [item, <Divider type='vertical' />]
          }
          return [item]
      })
      .flat()
  return <div className='ExtraGroup'>{elementList}</div>
}

interface TdrawerWrap extends DrawerProps {
  visible: boolean,
  onClose: () => void,
  onOk?: () => void,
  createExtraElement?: () => React.ReactNode[]
  className?: string,
  okLoading?: boolean
  width?: number
}

export default function (props: React.PropsWithChildren<TdrawerWrap>) {

  const { visible, onClose, onOk, title, createExtraElement, className, okLoading, width = 640, ...params} = props;

  return (
    <Drawer
      footer={
        <Space>
          <Button loading={okLoading} onClick={onOk} type="primary">确定</Button>
          <Button onClick={onClose}>取消</Button>
        </Space>
      }
      width={width}
      {...params}
      visible={visible}
      onClose={onClose}
      maskClosable={false}
      closable={false}
      className={classnames('DrawerLayout', { [`${className}`]: !!className })}
      title={
        <div className='TitleGroup'>
          <div className='Title'>{title}</div>
          <ExtraGroup onClose={onClose} createExtraElement={createExtraElement}  />
        </div>
      }
    >
      <main className='commonScroll'>
        {visible && <div id='drawerLayoutDropContainer' />}
        {visible && props.children}
      </main>
    </Drawer>
  )
}
