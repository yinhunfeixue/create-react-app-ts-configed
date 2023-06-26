import RelateCellRead from './RelateCellRead'
import React, { Component } from 'react'
import './wrapper.less'
export default class extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { relateList } = this.props
        console.log(this.props)
        let userAddList = []
        let systemList = []
        let defaultList = []
        relateList.map((value, index) => {
            if (value.relationType === 0) {
                defaultList.push(value)
            } else if (value.relationType === 1 || value.relationType === 3) {
                systemList.push(value)
            } else if (value.relationType === 2) {
                userAddList.push(value)
            }
        })
        //const type = record.relationType || 0
        return (
            <div>
                {
                    userAddList.length > 0 && <div className='userAdd wrapper'>
                        <div className='topic'>
                            <span className='colorChangeBlock'>人工关联</span>
                        </div>
                        {userAddList.map((item, index) => {
                            return (
                                <RelateCellRead
                                    onDelete={this.props.onDelete.bind(this, item.relationId)}
                                    onEdit={this.props.onEdit.bind(this, item)}
                                    key={item.id}
                                    sourceTableName={
                                        item.businessOriginalName
                                    }
                                    sourceFieldName={
                                        item.columnOriginalName
                                    }
                                    relateTableName={
                                        item.businessRelatedName
                                    }
                                    relateFieldName={
                                        item.columnRelatedName
                                    }
                                    join={
                                        item.join
                                    }
                                    relationType={item.relationType}
                                    editMode={this.props.editMode}
                                />
                            )
                        })}
                    </div>
                }
                {
                    systemList.length > 0 && <div className='system wrapper'>
                        <div className='topic'>
                            <span style={{ color: '#F27900' }}>推荐关联</span>
                        </div>
                        {systemList.map((item, index) => {
                            return (
                                <RelateCellRead
                                    onDelete={this.props.onDelete.bind(this, item.relationId)}
                                    onEdit={this.props.onEdit.bind(this, item)}
                                    key={item.id}
                                    sourceTableName={
                                        item.businessOriginalName
                                    }
                                    sourceFieldName={
                                        item.columnOriginalName
                                    }
                                    relateTableName={
                                        item.businessRelatedName
                                    }
                                    relateFieldName={
                                        item.columnRelatedName
                                    }
                                    join={
                                        item.join
                                    }
                                    relationType={item.relationType}
                                    editMode={this.props.editMode}
                                />
                            )
                        })}
                    </div>
                }
                {
                    defaultList.length > 0 && <div className='default wrapper'>
                        <div className='topic'>
                            <span style={{ color: '#EB8787' }}>默认关联</span>
                        </div>
                        {defaultList.map((item, index) => {
                            return (
                                <RelateCellRead
                                    onDelete={this.props.onDelete.bind(this, item.relationId)}
                                    onEdit={this.props.onEdit.bind(this, item)}
                                    key={item.id}
                                    sourceTableName={
                                        item.businessOriginalName
                                    }
                                    sourceFieldName={
                                        item.columnOriginalName
                                    }
                                    relateTableName={
                                        item.businessRelatedName
                                    }
                                    relateFieldName={
                                        item.columnRelatedName
                                    }
                                    join={
                                        item.join
                                    }
                                    relationType={item.relationType}
                                    editMode={this.props.editMode}
                                />
                            )
                        })}
                    </div>
                }
            </div>
        )
    }

}
