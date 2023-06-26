import React, { Component } from 'react'
import FieldCellRead from './FieldCellRead'

import './RelateCellRead.less'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import RelateType from '../../../../enums/RelateType'

/**
 * 关联关系
 */
class RelateCellRead extends Component {
    render() {
        const {
            sourceTableName,
            sourceFieldName,
            relateTableName,
            relateFieldName,
            onDelete,
            onEdit,
            join
        } = this.props

        return (
            <div className='RelateCellRead'>
                <FieldCellRead
                    tableName={sourceTableName}
                    fieldName={sourceFieldName}
                />
                <div className='CenterInfo'>
                    <hr />
                    <div className='RelateType'>
                        {join == 0?'左连接':(join == 1?'右连接':(join == 2?'内连接':'外连接'))}
                        {/*{RelateType.toString(join)}*/}
                    </div>
                    <hr />
                </div>
                <FieldCellRead
                    tableName={relateTableName}
                    fieldName={relateFieldName}
                />
                {
                    this.props.editMode?
                        <div className='IconGroup'>
                            <DeleteOutlined
                                style={{ color: this.props.relationType !== 0?'#1890FF':'#B3B3B3', cursor: this.props.relationType !== 0?'pointer':'not-allowed' }}
                                onClick={() => {
                                    if (this.props.relationType == 0) {
                                        return
                                    }
                                    if (onDelete) {
                                        onDelete()
                                    }
                                }} />
                            <EditOutlined
                                style={{ color: this.props.relationType !== 0?'#1890FF':'#B3B3B3', cursor: this.props.relationType !== 0?'pointer':'not-allowed' }}
                                onClick={() => {
                                    if (this.props.relationType == 0) {
                                        return
                                    }
                                    if (onEdit) {
                                        onEdit()
                                    }
                                }} />
                        </div>
                        :null
                }
            </div>
        );
    }
}

export default RelateCellRead
