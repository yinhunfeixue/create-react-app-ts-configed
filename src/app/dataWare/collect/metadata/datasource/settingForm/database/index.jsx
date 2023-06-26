import React, { Component } from 'react'
import { Modal, Input, Checkbox, Tooltip, List, Divider, message } from 'antd';
import style from './index.lees';
const Svg = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7691" width="14" height="14"><path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m256 396.8H256v102.4h512V460.8z" fill="#9EA3A8" p-id="7692"></path></svg>
import AutoTip from '@/component/AutoTip';


export default class DatabaseDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            targetKeys: [],
            sourceKeys: [],
            allSourceData: {},
            keyword: '',
            originTargetKeys: []
        }
    }
    openModal = async (sourceKeys, targetKeys, originTargetKeys) => {
        await this.setState({
            modalVisible: true,
            sourceKeys,
            targetKeys,
            originTargetKeys,
            allSourceData: [...sourceKeys],
            keyword: ''
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    databaseChange = () => {
        this.props.getDatabase(this.state.targetKeys)
        this.cancel()
    }
    remove = (name) => {
        let { targetKeys, sourceKeys, allSourceData } = this.state
        targetKeys = targetKeys.filter((item) => item !== name)
        sourceKeys.map((item) => {
            if (item.title == name) {
                item.selected = false
            }
        })
        allSourceData.map((item) => {
            if (item.title == name) {
                item.selected = false
            }
        })
        this.setState({
            targetKeys,
            sourceKeys,
            allSourceData
        })
    }
    change = (checked, index, data) => {
        let { sourceKeys, targetKeys, allSourceData } = this.state
        targetKeys = []
        sourceKeys[index].selected = checked
        allSourceData.map((item) => {
            if (item.title == data.title) {
                item.selected = checked
            }
        })
        allSourceData.map((item) => {
            if (item.selected) {
                targetKeys.push(item.title)
            }
        })
        this.setState({
            targetKeys,
            sourceKeys,
            allSourceData
        })
    }
    inputSearch = () => {
        let { sourceKeys, targetKeys, allSourceData, keyword } = this.state
        sourceKeys = allSourceData.filter((item) => item.title.includes(keyword))
        this.setState({
            sourceKeys
        })
    }
    changeInput = (e) => {
        this.setState({
            keyword: e.target.value
        })
    }
    render() {
        const {
            modalVisible,
            targetKeys,
            sourceKeys,
            keyword,
            originTargetKeys
        } = this.state
        return (
            <Modal
                width={800}
                title="添加数据库"
                visible={modalVisible}
                onCancel={this.cancel}
                wrapClassName={style.modal}
                onOk={this.databaseChange}
                destroyOnClose
            >
                {
                    modalVisible ? (
                        <div className={style.wrap}>
                            <div className={style.left}>
                                <Input.Search onChange={this.changeInput} value={keyword} onSearch={this.inputSearch} placeholder='搜索数据库' width={431} />
                                <div
                                    className={style.list}
                                    id="cate-system-dataSource"
                                    style={{
                                        height: 400,
                                        overflow: 'auto',
                                        padding: '0 16px',
                                    }}
                                >
                                    <List
                                        dataSource={sourceKeys}
                                        renderItem={(item, index) => (
                                            <div className={style.listItem} style={{ display: targetKeys.includes(item.title) ? 'none' : 'flex'}}>
                                                <Checkbox onChange={(e) => { this.change(e.target.checked, index, item) }} checked={item.selected} >
                          <span className={style.text}>
                            <AutoTip content={item.title} />
                          </span>
                                                </Checkbox>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className={style.right}>
                                <p className={style.title}>已选数据库（{targetKeys.length}）</p>
                                <div className={style.selectedList}>
                                    {
                                        Array.from(targetKeys.values()).map(v => (
                                            <div key={v}><span onClick={() => { this.remove(v) }}>{Svg}</span>{v}</div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ) : null
                }
            </Modal>
        )
    }
}