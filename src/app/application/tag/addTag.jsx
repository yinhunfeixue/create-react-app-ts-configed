import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { CheckOutlined } from '@ant-design/icons'
import { Form, message, Tag, TreeSelect } from 'antd'
import { allTagValue, deleteableTagValue, taggleTagObject, untaggle } from 'app_api/tagManageApi'
import { Button } from 'lz_antd'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

const { CheckableTag } = Tag
const { TreeNode } = TreeSelect

@observer
export default class AddTag extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addTagList: [], // 添加标签list
            addSelectList: [], // 添加标签已选listID
            deleteTagList: [], // 可删除标签list
            deleteSelectList: [], // 删除标签已选list
            selectTagList: [], // 添加标签已选list
        }
    }

    componentWillMount() {
        if (this.props.modalType == 'add') {
            this.getAllTagList()
        } else if (this.props.modalType == 'delete') {
            this.getAllDeleteTag()
        }
    }
    handleChangeAddTag = (index, tagIndex) => {
        console.log(index, '000')
        const { addTagList, addSelectList, selectTagList } = this.state
        let tagId = addTagList[index].tagValueList[tagIndex].tagValueId
        addTagList[index].tagValueList[tagIndex].checked = !addTagList[index].tagValueList[tagIndex].checked

        if (this.state.addSelectList.includes(tagId)) {
            this.state.addSelectList.splice(this.state.addSelectList.indexOf(tagId), 1)
            for (let i = 0; i < selectTagList.length; i++) {
                if (selectTagList[i].tagValueId == tagId) {
                    selectTagList.splice(i, 1)
                }
            }
        } else {
            this.state.addSelectList.push(tagId)
            selectTagList.push(addTagList[index].tagValueList[tagIndex])
        }
        this.setState({
            addTagList,
            addSelectList: [...this.state.addSelectList],
            selectTagList,
        })
        this.onChangeTreeSelect(addSelectList)
        console.log(addSelectList)
    }
    onChangeTreeSelect = async (value) => {
        const { addTagList, addSelectList } = this.state
        console.log(value, 'onChangeTreeSelect')
        addTagList.map((item, i) => {
            item.tagValueList.map((tag) => {
                tag.checked = false
                if (value.includes(tag.tagValueId)) {
                    tag.checked = true
                }
            })
        })
        await this.setState({ addSelectList: [...value], addTagList })
    }
    handleChangeDeleteTag = (index) => {
        const { deleteTagList, deleteSelectList } = this.state
        let tagId = deleteTagList[index].tagValueId
        deleteTagList[index].checked = !deleteTagList[index].checked
        if (deleteSelectList.includes(tagId)) {
            deleteSelectList.splice(deleteSelectList.indexOf(tagId), 1)
        } else {
            deleteSelectList.push(tagId)
        }
        this.setState({ deleteTagList, deleteSelectList })
    }

    getAllTagList = async () => {
        const { addSelectList, selectTagList } = this.state
        let res = await allTagValue({ bizObjectType: this.props.queryInfo.resultType })
        if (res.code == 200) {
            for (let i = 0; i < res.data.length; i++) {
                for (let j = 0; j < res.data[i].tagValueList.length; j++) {
                    for (let k = 0; k < this.props.hasTagList.length; k++) {
                        console.log(i, res.data[i].tagValueList[j], 'res.data[i].tagValueList[j]')
                        if (res.data[i].tagValueList[j] !== undefined) {
                            if (res.data[i].tagValueList[j].tagValueId == this.props.hasTagList[k].tagValueId) {
                                res.data[i].tagValueList.splice(j, 1)
                                j--
                            }
                        }
                    }
                }
            }
            console.log(selectTagList, 'selectTagList+++++++++')
            res.data.map((item, index) => {
                item.tagValueList.map((tag) => {
                    tag.checked = false
                })
            })
            await this.setState({ addTagList: res.data, addSelectList: [...addSelectList], selectTagList })
            // this.changeTagStyle()
        }
        console.log(this.state.addTagList)
    }
    getAllDeleteTag = async () => {
        let query = {
            ...this.props.params,
            queryParam: this.props.queryInfo,
            resultType: this.props.queryInfo.resultType,
        }
        let res = await deleteableTagValue(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.checked = false
            })
            this.setState({ deleteTagList: res.data })
        }
    }
    // 添加标签
    postAddTag = async () => {
        this.setState({ loading: true })
        let query = {
            ...this.props.params,
            queryParam: this.props.queryInfo,
            resultType: this.props.queryInfo.resultType,
        }
        query.tagValueIdList = this.state.addSelectList
        let res = await taggleTagObject(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('添加成功')
            this.props.clearSelectedRows()
            this.props.closeModal()
            this.props.refreshTable()
        }
    }
    // 删除标签
    postDeleteTag = async () => {
        this.setState({ loading: true })
        let query = {
            ...this.props.params,
            queryParam: this.props.queryInfo,
            resultType: this.props.queryInfo.resultType,
        }
        query.tagValueIdList = this.state.deleteSelectList
        console.log(JSON.stringify(query))
        let res = await untaggle(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('删除成功')
            this.props.clearSelectedRows()
            this.props.closeModal()
            this.props.resetSearch()
        }
    }
    // 删除标签
    closeTag = (dataName, index) => {
        this.state[dataName].splice(index, 1)
        this.setState({
            dataName: this.state[dataName],
        })
    }

    renderSelect = (tag) => {
        console.log(tag, 'renderSelect')
        return (
            <span className={tag.tagTypeName == '入湖' ? '' : 'geekBlueTag'} color='blue'>
                {tag.tagValueName}
            </span>
        )
    }

    render() {
        const { addTagList, loading, addSelectList, deleteTagList, deleteSelectList } = this.state
        const { title, visible, onCancel, modalType } = this.props
        return (
            <DrawerLayout
                drawerProps={{
                    title,
                    visible,
                    onClose: onCancel,
                    width: 480,
                }}
                renderFooter={() => {
                    if (modalType === 'add') {
                        return (
                            <React.Fragment>
                                <Button type='primary' disabled={!addSelectList.length} loading={loading} onClick={this.postAddTag}>
                                    添加
                                </Button>
                                <Button onClick={onCancel}>取消</Button>
                            </React.Fragment>
                        )
                    } else if (modalType == 'delete') {
                        return (
                            <React.Fragment>
                                <Button onClick={this.postDeleteTag} disabled={!deleteSelectList.length} loading={loading} type='primary'>
                                    确定删除
                                </Button>
                                <Button onClick={onCancel}>取消</Button>
                            </React.Fragment>
                        )
                    }
                }}
            >
                <Form className='EditMiniForm Grid1'>
                    {RenderUtil.renderFormItems(
                        [
                            {
                                content: (
                                    <TreeSelect
                                        style={{ width: '100%' }}
                                        showSearch
                                        multiple
                                        value={addSelectList}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeDefaultExpandAll
                                        placeholder='请选择标签'
                                        treeNodeFilterProp='title'
                                        treeNodeLabelProp='label'
                                        onChange={this.onChangeTreeSelect}
                                    >
                                        {addTagList.map((item, index) => {
                                            return (
                                                <TreeNode selectable={false} title={item.tagTypeName} key={item.tagTypeName} value={item.tagTypeName}>
                                                    {item.tagValueList
                                                        ? item.tagValueList.map((tag) => {
                                                              return <TreeNode label={this.renderSelect(tag)} value={tag.tagValueId} title={tag.tagValueName} key={tag.tagValueId} />
                                                          })
                                                        : null}
                                                </TreeNode>
                                            )
                                        })}
                                    </TreeSelect>
                                ),
                            },
                        ].concat(
                            this.props.modalType == 'add'
                                ? addTagList.map((item, index) => {
                                      return {
                                          label: item.tagTypeName,
                                          content: item.tagValueList.length ? (
                                              <div>
                                                  {item.tagValueList.map((tag, tagIndex) => {
                                                      return (
                                                          <CheckableTag
                                                              className={item.tagTypeName == '入湖' ? '' : 'geekBlueTag'}
                                                              checked={tag.checked}
                                                              onChange={this.handleChangeAddTag.bind(this, index, tagIndex)}
                                                          >
                                                              {tag.tagValueName}
                                                              <CheckOutlined className='checkIcon' style={{ display: tag.checked ? 'inline-block' : 'none' }} />
                                                          </CheckableTag>
                                                      )
                                                  })}
                                              </div>
                                          ) : (
                                              <div style={{ fontSize: '12px', color: '#b3b3b3' }}>暂无可用标签</div>
                                          ),
                                      }
                                  })
                                : deleteTagList
                                      .map((item, index) => {
                                          return {
                                              content: (
                                                  <CheckableTag
                                                      className={item.tagTypeName == '入湖' ? '' : 'geekBlueTag'}
                                                      checked={item.checked}
                                                      onChange={this.handleChangeDeleteTag.bind(this, index)}
                                                  >
                                                      {item.tagValueName}
                                                      <CheckOutlined className='checkIcon' style={{ display: item.checked ? 'inline-block' : 'none' }} />
                                                  </CheckableTag>
                                              ),
                                          }
                                      })
                                      .concat([
                                          {
                                              content: (
                                                  <div>
                                                      <span style={{ color: '#b3b3b3', fontSize: '12px', marginTop: '8px', display: 'inline-block' }}>
                                                          {this.props.selectDataLength}个资源共{deleteTagList.length}个标签
                                                      </span>
                                                  </div>
                                              ),
                                          },
                                      ])
                        )
                    )}
                </Form>
            </DrawerLayout>
        )
    }
}
