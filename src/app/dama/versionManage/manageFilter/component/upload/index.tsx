import React, { useState } from 'react'

import { Alert, Space, Button, Typography, Radio, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { DrawerWrap } from 'cps'
import type { RcFile } from 'antd/es/upload/interface'
import { inputWhitelistTableByFile } from 'app_api/autoManage'



import style from './index.less'
import { dsSettingDetail, filterOpts, filterRule, filterTypes, saveDsSetting, filterTable } from 'app_api/autoManage'

interface TrequestOptions {
    onProgress: (event: { percent: number }) => void
    onError: (event: Error, body?: Record<string, any>) => void
    onSuccess: (body: Record<string, any>) => void
    data: Record<string, any>
    filename: string
    file: File
    withCredentials: boolean
    action: string
    headers: Record<string, any>
}

export default function UploadDrawer(
    props: React.PropsWithChildren<{
        submitChange: () => void
    }>
) {
    const {  submitChange } = props
    const [fileList, setFileList] = useState<any[]>([])
    const [visible, setVisible] = useState<boolean>(false)

    const uploadRequest = (params: TrequestOptions) => {
        const { file, onSuccess, onError } = params || {}
        onSuccess({ file })
    }

    const uploadChange = (info: any) => {
        const { status, originFileObj } = info.file
        console.log('info', info)

        if (status === 'done') {
            fileList.length = 0
            fileList.push(originFileObj)
        }
        if (status === 'removed') {
            fileList.length = 0
        }
        setFileList([...fileList])
    }

    const beforeUpload = (file: RcFile) => {
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
            message.error('文件大小不能超过1M')
        }
        return isLt5M
    }

    const submit = () => {
        if (fileList.length <= 0) {
            message.warn('请先上传文件')
            return
        }
        const fd = new FormData()
        fd.append('file', fileList[0])
        inputWhitelistTableByFile(fd).then((res) => {
            if (res.code === 200) {
                message.success(res.msg)
                onClose()
                submitChange && submitChange()
            } else {
                message.error(res.msg || '操作失败')
            }
        })
    }

    const onClose = () =>{
      setVisible(false)
    }
    const downLoadFile = () =>{
      const url = `../../../../../resources/template/settingTemplates/govFilter.xlsx`
      const eleLink = document.createElement('a');
      eleLink.style.display = 'none';
      eleLink.href = url;
      eleLink.download = "待治理表导入模板.xlsx"
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);
    }

    return (
        <React.Fragment>
          <span onClick={() => setVisible(true)} className='file_import'><span style={{marginRight: 6}} className='iconfont icon-daoru'></span>文件导入</span>
            <DrawerWrap width={480} visible={visible} onClose={onClose} title='上传待治理表' onOk={submit}>
                <div className={style.step}>
                    <p>1.下载导入模板，完善信息</p>
                    <Typography.Link>
                        <a  onClick={downLoadFile} >
                            下载模板
                        </a>
                    </Typography.Link>
                </div>
                <div className={style.step}>
                    <p>2.导入完善好的表格</p>
                    <Upload.Dragger onChange={uploadChange} customRequest={uploadRequest} maxCount={1} accept='.xlsx' beforeUpload={beforeUpload}>
                        <p className='ant-upload-drag-icon'>
                            <UploadOutlined />
                        </p>
                        <p className='ant-upload-text'>点击或拖拽文件到此处上传</p>
                    </Upload.Dragger>
                </div>
            </DrawerWrap>
        </React.Fragment>
    )
}
