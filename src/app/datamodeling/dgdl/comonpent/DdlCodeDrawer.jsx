// DDL生成
import React, { Component } from 'react'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { Button, message, Input } from 'antd'
import { tableDdlDownload } from 'app_api/dataModeling'
import { tableDgdl } from 'app_api/metadataApi'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Code from '@/components/code/Code'

const { TextArea } = Input
export default class DdlDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            sqlContent: '',
            sqlContentMore: '',
            drawerTitle: '',
            queryInfo: {},
            showMore: false,
        }
    }
    openModal = async (code, title, queryInfo) => {
        await this.setState({
            modalVisible: true,
            sqlContent: code,
            drawerTitle: title,
            queryInfo,
            showMore: false,
        })
        if (title == 'DGDL') {
            this.getSqlContentMore()
        }
    }
    getSqlContentMore = async () => {
        let { queryInfo } = this.state
        let query = {
            ...queryInfo,
            dgdlComment: true,
        }
        let res = await tableDgdl(query)
        if (res.code == 200) {
            this.setState({
                sqlContentMore: res.data,
            })
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    copy = () => {
        let { showMore, sqlContent, sqlContentMore } = this.state
        var input = document.getElementById('textarea')
        input.value = showMore ? sqlContentMore : sqlContent
        input.select()
        document.execCommand('copy')
        message.success('复制成功')
    }
    download = async () => {
        let { showMore, queryInfo } = this.state
        let query = {
            ...queryInfo,
        }
        if (showMore) {
            query = {
                ...queryInfo,
                dgdlComment: true,
            }
        }
        let res = await tableDdlDownload(query)
        message.info('系统准备下载')
    }
    render() {
        const { modalVisible, sqlContent, drawerTitle, sqlContentMore, showMore } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'DdlDrawer',
                    title: drawerTitle,
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true,
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        {drawerTitle == 'DGDL' ? (
                            <div>
                                <div style={{ marginBottom: 16 }}>
                                    生成内容
                                    {showMore ? (
                                        <a onClick={() => this.setState({ showMore: false })} style={{ float: 'right' }}>
                                            <span style={{ marginRight: 8, fontSize: '14px' }} className='iconfont icon-zuo'></span>返回简洁版
                                        </a>
                                    ) : (
                                        <a onClick={() => this.setState({ showMore: true })} style={{ float: 'right' }}>
                                            查看完整版<span style={{ marginLeft: 8, fontSize: '14px' }} className='iconfont icon-you'></span>
                                        </a>
                                    )}
                                </div>
                                {showMore ? <TextArea autoSize disabled value={sqlContentMore} className='commonScroll' /> : <TextArea autoSize disabled value={sqlContent} className='commonScroll' />}
                            </div>
                        ) : (
                            <Code code={sqlContent} />
                        )}
                        <div>
                            <Button style={{ marginRight: 8 }} onClick={this.copy} type='primary' ghost>
                                复制
                            </Button>
                            <Button onClick={this.download} type='primary' ghost>
                                下载
                            </Button>
                        </div>
                        <textarea id='textarea' style={{ opacity: '0', height: '0px', marginTop: 0 }}>
                            {showMore ? sqlContentMore : sqlContent}
                        </textarea>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
