import React, {Component} from 'react'
import {Menu} from 'antd';
import {Link} from 'react-router-dom';

const SubMenu = Menu.SubMenu;
export default class MultistageMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentSelectedKey: this.props.currentSelectedKey
        }
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {}

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps");
        console.log(nextProps);
        this.setState({
            currentSelectedKey: nextProps.currentSelectedKey
        });
    }

    handleClick(e) {
        console.log(e);
        this.setState({currentSelectedKey: e.key})
    }

    leftMenuItem(data) {
        let _this = this;
        if (data && data.length) {
            return data.map(function(node, index) {
                return (<Menu.Item key={node.column_url}>
                    <Link to={`/${node.column_url.slice(1)}`}>
                        <i className={node.column_class
                                ? node.column_class
                                : "anticon anticon-bank"}></i>
                        <span>{node.column_name}</span>
                    </Link>
                </Menu.Item>);
            });
        }
        return null;
    }

    render() {
        console.log(this.props);
        console.log(this.state.currentSelectedKey);
        return (<Menu theme={this.props.theme} mode={this.props.mode} selectedKeys={this.state.currentSelectedKey} onClick={this.handleClick}>
            {this.leftMenuItem(this.props.menuList)}
        </Menu>)
    }
}
