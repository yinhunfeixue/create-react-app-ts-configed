import React, {Component} from 'react';
import '../style.less';

export default class RecommendList extends Component {

    constructor(props) {
        super(props);

    }

    // 点击右侧推荐问句执行父组件的handleSearch 重新请求中间所有的数据，与在输入框输入关键字，点查询执行一样的方法
    handleSearch(inputValue, e) {
        this.props.handleSearch(inputValue, e);
    }

    render() {
        return (
            <div className="intell_index_ul">
                <b>{this.props.title}</b>
                <ul className="intelligent_ul_li">
                    {
                        this.props.listData.slice().map((item, index) => {
                            // 这里便于给排名前三个的加样式
                            if (index === 0 || index === 1 || index === 2) {
                                return (<li key={index} className="intell_index_li first_three" onClick={this.handleSearch.bind(this, item.query)}>
                                    <a title={item.query}><i>{index+1}</i> <span>{item.query}</span></a>
                                </li>)
                            }
                            return (<li key={index} className="intell_index_li" onClick={this.handleSearch.bind(this, item.query)}>
                                <a title={item.query}><i className="intell-ico">{index+1}</i> <span>{item.query}</span></a>
                            </li>)
                        })
                    }
                </ul>
            </div>
        )
    }
}
