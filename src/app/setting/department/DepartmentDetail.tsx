import { requestDepartmentDetail } from '@/api/systemApi'
import InfoCard from '@/app/setting/permission/infoCard'
import IComponentProps from '@/base/interfaces/IComponentProps'
import RenderUtil from '@/utils/RenderUtil'
import { Form, Modal } from 'antd'
import React, { Component } from 'react'

interface IDepartmentDetailState {
    detail: any
}
interface IDepartmentDetailProps extends IComponentProps {
    visible: boolean
    onClose: () => void
    targetData: any
    addTab: Function
}

/**
 * DepartmentDetail
 */
class DepartmentDetail extends Component<IDepartmentDetailProps, IDepartmentDetailState> {
    constructor(props: IDepartmentDetailProps) {
        super(props)
        this.state = { detail: {} }
    }
    componentDidMount() {
        const { targetData } = this.props

        if (targetData) {
            requestDepartmentDetail(targetData.id).then((res) => {
                this.setState({ detail: res.data })
            })
        }
    }

    render() {
        const { visible, onClose } = this.props
        const { detail } = this.state
        return (
            <Modal title='部门详情' visible={visible} onCancel={onClose} footer={null}>
                <InfoCard
                    style={{ boxShadow: 'none', padding: 0, marginBottom: 24 }}
                    record={{
                        cnName: detail.deptName,
                        remark: detail.remark,
                    }}
                />
                {/* marginLeft: 68 是为了文字和 InfoCard的右侧对齐*/}
                <Form className='MiniForm Grid1' style={{ marginLeft: 68 }}>
                    {RenderUtil.renderFormItems([{ label: '部门ID', content: detail.deptId }])}
                </Form>
            </Modal>
        )
    }
}

export default DepartmentDetail
