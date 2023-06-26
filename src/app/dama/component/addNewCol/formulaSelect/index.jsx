import { RightOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Select, TreeSelect } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';


const { Option } = Select
const { TreeNode } = TreeSelect;
const { SubMenu } = Menu;

@observer
class FormulaSelect extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            aggColumns: [],
            groupList: [...this.props.data]
        }
    }
    componentWillMount = () => {

    }
    onChangeColumns = (value, item) => {
        this.setState({
            aggColumns: value
        })
        this.props.onChange(value, item, this.props.index)
    }
    handleClickMenu = (index,name, key, e) => {
        console.log(e,'item')
        const { groupList } = this.state
        let timeTypeName = ''
        e.keyPath.reverse().map((item) => {
            timeTypeName += item.split('@')[1] + ' '
        })
        groupList[index][name] = timeTypeName
        groupList[index][key] = e.key
        if (key == 'timeTypeId') {
            groupList[index].interval = e.keyPath[1]?e.keyPath[1].split('@')[2]:''
            groupList[index].timeType = e.keyPath[0].split('@')[2]
        } else if (key == 'specialId') {
            groupList[index].special = e.key.split('@')[2]
        } else if (key == 'sortTypeId') {
            groupList[index].sortType = e.key.split('@')[2]
        }
        this.setState({
            groupList
        })
        this.props.onChangeMenu(groupList, this.props.index)
    }
    renderSelect = (value,index) => {
        console.log(value,'value')
        this.props.menuOption.map((item) => {
            if (value[item.listName]) {
                item.menu = (
                    <Menu className="timeMenuContainer" selectedKeys={value[item.selectedKeys]} onClick={this.handleClickMenu.bind(this,index,item.selectedName,item.selectedKeys)}>
                        {
                            value[item.listName].map((item1,index) => {
                                if (item1.children) {
                                    return (
                                        <SubMenu key={item1.id + '@' + item1.name + '@' + item1.id} title={item1.name} disabled={!item1.enable}>
                                            {
                                                item1.children.map((item) => {
                                                    return (<Menu.Item key={item1.id + '@' + item.name + '@' + item.id}>{item.name}</Menu.Item>)
                                                })
                                            }
                                        </SubMenu>
                                    )
                                } else {
                                    return (
                                        <Menu.Item key={item1.id + '@' + item1.name + '@' + item1.id} disabled={!item1.enable}>{item1.name}</Menu.Item>
                                    )
                                }
                            })
                        }
                    </Menu>
                )
            } else {
                item.menu = ''
            }
        })
        return (
            <div>
                <span style={{ fontSize: '13px', marginRight: '8px' }}>{value.name}</span>
                {
                    this.props.menuOption.map((item) => {
                        if (item.menu) {
                            return (
                                <Dropdown overlay={item.menu} placement="bottomRight">
                    <span style={{ color: '#B3B3B3', fontSize: '12px', marginRight: '12px' }} onClick={e => e.preventDefault()}>
                        {value[item.selectedName]} <RightOutlined style={{ fontSize: '12px' }} />
                    </span>
                                </Dropdown>
                            );
                        }
                    })
                }
            </div>
        );
    }
    render() {
        const { groupList, aggColumns } = this.state
        return (
            <div style={{ display: 'inline-block' }}>
                <Select
                    optionLabelProp="label"
                    showSearch
                    value={this.props.value}
                    optionFilterProp="children"
                    style={{ width: this.props.width }}
                    placeholder='请选择'
                    mode={this.props.mode}
                    onChange={this.onChangeColumns}
                    filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {
                        groupList.map((value, index) => {
                            return (
                                <Option key={index} businessId={value.businessId} value={value.id} label={this.renderSelect(value,index)}>{value.name}</Option>
                            )
                        })
                    }
                </Select>
            </div>
        )
    }
}

export default FormulaSelect