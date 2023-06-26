import React, { useEffect, useState } from "react";
import { Modal, Popover } from 'antd';
import UploadImg from '../Upload';
import style from './index.lees';
import { PlusOutlined } from '@ant-design/icons';


let imgs: string[] = []; imgs.length = 10; imgs.fill('');

imgs = imgs.map((v, index) => `/quantchiAPI/system-icon/${index + 1}.png`);

const randomImg = () => `/quantchiAPI/system-icon/${  Number((Math.random()*9).toFixed(0))*1 + 1}.png`

export default function uploadWrap(props: React.PropsWithChildren<{
  onChange?: (value: any) => void,
  value?: string,
}>) {

  const { onChange, value } = props;
  const [imgUrl, setImgUrl] = useState<string>();

  const [visible, setVisible] = useState(false);

  const [imgChange, setImgChange] = useState(false);

  useEffect(() => {
    if(value && !imgChange) {
      setImgUrl(value);
    }
    if(!value && !imgChange) {
      const _img = randomImg();
      setImgUrl(_img);
      onChange && onChange(_img);
    }
  }, [value])

  const imgClick = (src: string) => {
    setImgUrl(src);
    onChange &&  onChange(src);
    setImgChange(true);
    setVisible(false);
    console.log('imgClick');
  }

  const uploadChange = (info: any) => {
    if (info.file.status === 'done') {
      setImgUrl((info.file.response || {}).url);
      onChange && onChange((info.file.response || {}).url);
      setImgChange(true);
      setVisible(false);
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setVisible(newOpen);
  };

  return (
    <div onClick={() => setVisible(false)}>
      <Popover
        overlayClassName={style.modal}
        trigger="click"
        placement="bottomLeft"
        visible={visible}
        getPopupContainer={node => node.parentElement as HTMLElement}
        content={
          <>
            <div className={style.imgWrap} onClick={e => e.preventDefault()}>
              <UploadImg
                showUploadList={false}
                maxCount={1}
                onChange={uploadChange}
              >
                <div className={style.header}>自定义上传 <PlusOutlined /></div>
              </UploadImg>
              <div className={style.content}>
                <p>系统图标</p>
                <div className={style.list}>
                  {
                    imgs.map((v: string, index: number) => <span><i onClick={() => { imgClick(v) }}/><img width={28} height={28} key={index} src={v} /></span>)
                  }
                </div>
              </div>
            </div>
          </>
        }
      >
        <span onClick={(e) => { e.stopPropagation(); setVisible(true) }} className={style.img} style={{ backgroundImage: `url(${imgUrl})` }}><i/></span>
      </Popover>
      {/* <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        wrapClassName={style.modal}
        width={204}
        getContainer={false}
      >
        <div className={style.imgWrap}>
          <UploadImg
            showUploadList={false}
            maxCount={1}
            onChange={uploadChange}
          >
            <div className={style.header}>自定义上传 <PlusOutlined /></div>
          </UploadImg>
          <div className={style.content}>
            <p>系统图标</p>
            <div className={style.list}>
              {
                imgs.map((v: string, index: number) => <span><i onClick={() => { imgClick(v) }}/><img width={28} height={28} key={index} src={v} /></span>)
              }
            </div>
          </div>
        </div>
      </Modal> */}
    </div>
  )
}
