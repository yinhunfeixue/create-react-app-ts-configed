import React, {Component} from 'react';
import ConnectRelation from "../components/connectRelation";

class ConnectRelationEdit extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const {param} =this.props
        const{id,tableId,...restParam}=param
        console.log(restParam)
        return (
            <div>
                <div>
                    <span>表英文名：{param.tableEnglishName}</span>
                    <span>表中文名：{param.tableName}</span>
                </div>
                <ConnectRelation  id={tableId} {...restParam} addTab={this.props.addTab}/>
            </div>
        )
    }
}


export default ConnectRelationEdit;
