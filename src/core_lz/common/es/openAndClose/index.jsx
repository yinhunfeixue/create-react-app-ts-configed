import React, {Component} from 'react'
import sqlFormatter from "sql-formatter"

const unexpendSqlStyle = {
    lineHeight: '8px',
    width: 'calc(100% - 90px)',
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    margin: '0'
}
const expendSqlStyle = {
    lineHeight: '14px',
    paddingLeft: '10px',
    width: 'calc(100% - 90px)',
    display: 'inline-block',
    textOverflow: 'ellipsis',
    border: '1px solid lightgray',
    borderRadius: '5px',
    margin: '0'
}

const btnStyle = {
    marginLeft: '10px',
    color: '#1890ff',
    cursor: 'pointer'
}
export default class OpenAndClose extends Component {
    constructor(props) {
        super(props)

        this.state = {
            carryOutSqlExpend: false,
            text: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            text: nextProps.text
        })
    }

    lookWhole = () => {
        this.setState({
            carryOutSqlExpend: !this.state.carryOutSqlExpend
        })
    }
    render() {
        const { carryOutSqlExpend, text } = this.state

        const sqlFormat = text!==""?sqlFormatter.format(this.props.text).replace(/<br>/g, '\n'):''

        return (<span>
                <pre style={carryOutSqlExpend?{...this.props.expendSqlStyle, ...expendSqlStyle}:{...this.props.unexpendSqlStyle, ...unexpendSqlStyle}}>{sqlFormat}</pre>
                {text!==""?<span style={btnStyle} onClick={this.lookWhole}>{carryOutSqlExpend?'收起':'展开'}</span>:null}
            </span>)
    }
}
