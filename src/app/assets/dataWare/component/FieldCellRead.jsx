import React, { PureComponent } from 'react'
import { Tooltip } from 'antd'
import './FieldCellRead.less'
/**
 * 字段展示类
 */
class FieldCellRead extends PureComponent {
    render() {
        const { tableName, fieldName } = this.props
        return (
            <div className='FieldCellRead'>
                <Tooltip title={tableName}>
                    <div className='TableCell'>{tableName}</div>
                </Tooltip>
                {fieldName && <Tooltip title={fieldName}><div className='FieldCell'>{fieldName}</div></Tooltip>}
            </div>
        )
    }
}

export default FieldCellRead
