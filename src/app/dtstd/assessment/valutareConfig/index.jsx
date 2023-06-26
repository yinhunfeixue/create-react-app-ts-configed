import DrawerLayout from '@/component/layout/DrawerLayout'
import { Button, Input, message } from 'antd'
import { queryConfigBySystemId, saveConfig } from 'app_api/standardApi'
import React, { Component } from 'react'
import RuleForm from '../ruleForm/index'

const InputGroup = Input.Group

/**
 * 添加关联关系
 */

class ValutareConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            configData: [],
            newKey: 1,
        }
    }

    close = () => {
        this.setState({ visible: false })
    }

    openModal = () => {
        this.setState({ visible: true }, () => {
            this.queryConfigBySystemId()
        })
    }

    queryConfigBySystemId = async () => {
        const res = await queryConfigBySystemId({ systemId: this.props.selectedTable.systemId })
        if (res.code === 200) {
            this.setState({ configData: res.data, newKey: this.state.newKey + 1 })
        }
    }

    postData = async () => {
        let standardAssessConfigVoList = await this.ruleFormRef.postData()
        this.setState({ saveLoding: true })
        const res = await saveConfig({ systemId: this.props.selectedTable.systemId, standardAssessConfigVoList })
        this.setState({ saveLoding: false })
        if (res.code === 200) {
            this.close()
            this.props.systemRefresh && this.props.systemRefresh()
            return message.success('编辑成功')
        }
    }

    render() {
        const { visible, configData, newKey, saveLoding } = this.state
        const { selectedTable } = this.props
        return (
            <React.Fragment>
                <DrawerLayout
                    onCancel={() => this.close()}
                    drawerProps={{
                        className: 'metaModelDrawer',
                        title: '评估标准配置',
                        width: 482,
                        visible,
                        onClose: this.close,
                        maskClosable: false,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button onClick={this.postData} disabled={saveLoding} key='submit' type='primary'>
                                    确定
                                </Button>
                                <Button key='back' onClick={this.close}>
                                    取消
                                </Button>
                            </React.Fragment>
                        )
                    }}
                >
                    <div style={{ borderBottom: '1px solid #EEF0F5', padding: '20px 0', fontSize: 18, fontWeight: 600, marginTop: '-2px' }}>
                        <img style={{ width: 20, height: 20, marginRight: 8, marginTop: -4 }} src={selectedTable.systemIcon} />
                        {selectedTable.systemName}
                    </div>
                    {configData.length > 0 && <RuleForm key={newKey} configData={configData} wrappedComponentRef={(ref) => (this.ruleFormRef = ref)} />}
                </DrawerLayout>
            </React.Fragment>
        )
    }
}

export default ValutareConfig
