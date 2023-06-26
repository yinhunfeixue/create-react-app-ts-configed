import React, {Component} from 'react';
import {Button, Col, Row} from "antd";
import InputClose from "app_common/es/inputClose/inputClose";


class CommonSearch extends Component {

    constructor(props){
        super(props)
    }



    handleSearch = ()=>{
        this.props.handleSearch(this.keyword)
    }

    onChange = (value)=>{
        this.keyword = value
    }

    render() {
        return (
            <Row type="flex" justify="space-between" align="center">
                <Col span={18}>
                    <InputClose
                        value={this.keyword}
                        onPressEnter={this.handleSearch}
                        onClear={this.handleSearch}
                        handleInputChange={this.onChange}
                        placeholder={"请输入表中英文名搜索"} />
                </Col>
                <Col span={5} offset={1} style={{textAlign:"right"}}>
                    <Button type="primary" onClick={this.handleSearch}>搜索</Button>
                </Col>
            </Row>
        )
    }
}



export default CommonSearch;
