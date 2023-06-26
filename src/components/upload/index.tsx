import React from 'react';
import Request from '@/api/request';
import { Upload, message, UploadProps } from 'antd';

interface TuploadProps extends UploadProps {

}

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

export function ossUpload(file: File | File[]) {
  const formData = new FormData()

  if (Array.isArray(file)) {
    file.forEach((v) => formData.append('file', v))
  } else {
    formData.append('file', file)
  }
  return Request.post('/quantchiAPI/api/system/uploadImage', formData)
}

export default function UploadImage(props: React.PropsWithChildren<TuploadProps>) {
  const { ...params } = props;

  const uploadRequest = async (params: TrequestOptions) => {
    const { file, onSuccess, onError } = params || {};
    const res = await ossUpload(file);
    if(res.code === 200) {
      onSuccess({ url: `/quantchiAPI/${res.msg}` })
    } else {
      onError(new Error(res.msg));
    }
  }

  return (
    <Upload
      {...params}
      customRequest={uploadRequest}
    >
      {props.children}
    </Upload>
  )
}

