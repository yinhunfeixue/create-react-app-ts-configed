import React, { useState } from 'react';

import { Alert, Space, Button, Typography, Radio, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { DrawerWrap } from 'cps';
import type { RcFile } from 'antd/es/upload/interface';

import style from './index.lees';
import { uploadDirectory } from '../../Service';

interface TrequestOptions {
  onProgress: (event: { percent: number }) =>void
  onError: (event: Error, body?: Record<string, any>) => void
  onSuccess: (body: Record<string, any>) => void
  data: Record<string, any>
  filename: string
  file: File
  withCredentials: boolean
  action: string
  headers: Record<string, any>
}

export default function UploadDrawer(props: React.PropsWithChildren<{
  visible: boolean,
  onClose: () => void,
  systemId: string,
  node: Record<string, any>,
  submitChange: () => void,
}>) {
  const { visible, onClose, systemId, node = {}, submitChange } = props;
  const [fileList, setFileList] = useState<any[]>([])

  const uploadRequest = (params: TrequestOptions) => {
    const { file, onSuccess, onError } = params || {};
    onSuccess({ file })
  }

  const uploadChange = (info: any) => {
    const { status, originFileObj } = info.file;
    console.log('info', info);

    if(status === 'done') {
      fileList.length = 0;
      fileList.push(originFileObj);
    }
    if (status === 'removed') {
      fileList.length = 0;
    }
    setFileList([...fileList])
  }

  const beforeUpload = (file: RcFile) => {

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('文件大小不能超过1M');
    }
    return isLt5M;
  };

  const submit = () => {
    if (fileList.length <= 0) {
      message.warn('请先上传文件');
      return;
    }
    const fd = new FormData();
    fd.append('file', fileList[0]);
    fd.append('systemId', systemId);
    uploadDirectory(fd).then(res => {
      if(res.code === 200) {
        message.success('上传成功');
        onClose();
        submitChange && submitChange();
      } else {
        message.error(res.msg || '操作失败')
      }
    })
  }

  return (
    <DrawerWrap
      visible={visible}
      onClose={onClose}
      title="上传系统目录"
      onOk={submit}
    >
      <Alert message={`所属系统：${node.name}`} showIcon />
      <div className={style.step}>
        <p>1、请按照模板格式填写系统目录</p>
        <Typography.Link><a href="/quantchiAPI/file/导入目录样板数据.xlsx" download="导入目录样板数据" >下载文件模板</a></Typography.Link>
      </div>
      <div className={style.step}>
        <p>2、导入完好的表格（xlsx格式，最大5M）</p>
        <Upload.Dragger
          onChange={uploadChange}
          customRequest={uploadRequest}
          maxCount={1}
          accept=".xlsx"
          beforeUpload={beforeUpload}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
        </Upload.Dragger>
      </div>
      {/* <div className={style.step}>
        <p>3、更新方式</p>
        <Radio.Group defaultValue={2}>
          <Radio value={1}>增量更新</Radio>
          <Radio value={2}>全量更新</Radio>
        </Radio.Group>
      </div> */}
    </DrawerWrap>
  )
}
