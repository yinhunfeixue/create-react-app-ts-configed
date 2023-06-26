import DissectStatus from '@/app/dataDissect/enum/DissectStatus'
import IAnalysisResult from '@/app/dataDissect/interface/IAnalysisResult'
import PageUtil from '@/utils/PageUtil'
import { CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons'
import { Modal } from 'antd'
import React from 'react'

/**
 * DataDissectUtil
 */
class DataDissectUtil {
    static gotoDetail(item: IAnalysisResult, onClickEdit: () => void) {
        // 只有成功状态才跳转详情，其它弹出提示
        const { statusMessage, analysisStatus, tableId } = item
        if (analysisStatus === DissectStatus.SUCCESS) {
            PageUtil.addTab('dataDissectDetail', { id: tableId }, true)
        } else {
            const needUpdate = [DissectStatus.EXPIRE, DissectStatus.INVALID].includes(analysisStatus)
            const isError = [DissectStatus.EXPIRE, DissectStatus.INVALID, DissectStatus.ERROR].includes(analysisStatus)
            Modal.confirm({
                title: DissectStatus.toString(analysisStatus),
                content: statusMessage,
                okText: DissectStatus.toBtnLabel(analysisStatus),
                okType: DissectStatus.toBtnType(analysisStatus),
                cancelText: '取消',
                icon: isError ? <CloseCircleFilled style={{ color: 'red' }} /> : <InfoCircleFilled style={{ color: 'rgba(77,116,245)' }} />,
                cancelButtonProps: {
                    style: {
                        display: needUpdate ? 'unset' : 'none',
                    },
                },
                onOk: () => {
                    if (needUpdate && onClickEdit) {
                        onClickEdit()
                    }
                },
            })
        }
    }
}
export default DataDissectUtil
