import { downloadTemplate, requestImportUser } from '@/api/systemApi'
import IComponentProps from '@/base/interfaces/IComponentProps'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import React, { Component } from 'react'

interface IImportUserState {
    fileList: UploadFile[]
    loading: boolean
}
interface IImportUserProps extends IComponentProps {
    visible: boolean
    onClose: () => void
    onSuccess: () => void
}

/**
 * ImportUser
 */
class ImportUser extends Component<IImportUserProps, IImportUserState> {
    constructor(props: IImportUserProps) {
        super(props)
        this.state = {
            fileList: [],
            loading: false,
        }
    }

    private importFile = () => {
        const { fileList } = this.state
        const { onSuccess } = this.props

        if (!fileList || !fileList.length) {
            message.info('请上传文件')
            return
        }
        this.setState({ loading: true })
        requestImportUser(fileList[0])
            .then((res) => {
                const { code, msg } = res
                if (code === 200) {
                    message.success(msg || '导入成功')
                    onSuccess()
                } 
            })
            .finally(() => {
                this.setState({ loading: false })
            })
    }
    render() {
        const { visible, onClose } = this.props
        const { fileList, loading } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    title: '批量导入用户',
                    visible,
                    onClose,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button loading={loading} type='primary' onClick={this.importFile}>
                                导入
                            </Button>
                            <Button disabled={loading} onClick={onClose}>
                                取消
                            </Button>
                        </React.Fragment>
                    )
                }}
            >
                <div>
                    {[
                        {
                            label: '1. 下载导入模板，完善信息',
                            content: <a onClick={() => downloadTemplate()}>下载模板</a>,
                        },
                        {
                            label: '2. 导入完善好的表格（支持xlsx格式）',
                            content: (
                                <div style={{ height: 150 }}>
                                    <Upload.Dragger
                                        multiple={false}
                                        accept='.xlsx'
                                        customRequest={(options) => {
                                            this.setState({ fileList: [options.file as any] })
                                        }}
                                        onRemove={(file) => {
                                            this.setState({ fileList: fileList.filter((item) => item !== file) })
                                        }}
                                        fileList={fileList}
                                    >
                                        <p className='ant-upload-drag-icon'>
                                            <UploadOutlined />
                                        </p>
                                        <p className='ant-upload-text'>请点击或拖拽进行上传！</p>
                                    </Upload.Dragger>
                                </div>
                            ),
                        },
                    ].map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <div style={{ marginBottom: 8, marginTop: index > 0 ? 20 : 0 }}>{item.label}</div>
                                {item.content}
                            </React.Fragment>
                        )
                    })}
                </div>
            </DrawerLayout>
        )
    }
}

export default ImportUser
