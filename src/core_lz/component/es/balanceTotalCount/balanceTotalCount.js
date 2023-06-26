import React from 'react';
import G6 from '@antv/g6';
import {JfCard} from 'app_common'

const data = {
    "nodes": [{
        "x":"200",
        "y":"200",
        "label":"occur_balance"+'\n'+"融资合约发生金额",
        "id": "node1"
    }, {
        "x":"200",
        "y":"200",
        "label":  "fin_close_balance"+'\n'+"收市融资负债金额",
        "id": "node2",
        "style":{
            fill:'#666666',
        }
    }, {
        "x":"300",
        "y":"100",
        "label":"total_close_debit"+'\n'+"当日两融金额",
        "id": "node3"
    }, {
        "x":"300",
        "y":"200",
        "label":"close_rate"+'\n'+"当日维保比例",
        "id": "node4"
    }, {
        "x":"300",
        "y":"300",
        "label": "total_close_asse"+'\n'+"当日总资产",
        "id": "node5"
    }],
    "edges": [{
        "source": "node1",
        "target": "node2",
        "id": "edge1"
    }, {
        "source": "node2",
        "target": "node3",
        "id": "edge2"
    }, {
        "source": "node2",
        "target": "node4",
        "id": "edge3"
    }, {
        "source": "node2",
        "target": "node5",
        "id": "edge4"
    }]
};

export default class BalanceTotalCount extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            title: this.props.title,//定义模块标题
            data:this.props.chartsdata,  //定义传入的数据
        };

    }
    componentDidMount(){
       this.setState(
       );
        this.drawRangeMapCharts(data);
    }

    //绘制图形
    refreshBloodRelateCharts(){
     drawRangeMapCharts(this.state.data);
    }

    //绘制血缘关系图
    drawRangeMapCharts(data){

        let dagre = new G6.Plugins['layout.dagre']({
            rankdir: 'LR',//布局方向，根节点在左，往右布局
            nodesep: 50,    //节点距离
            ranksep: 50     //层次距离
        });
        let net = new G6.Net({
            id: 'bmountNode',
            height:300,
            fitView: 'autoZoom',
            plugins: [dagre]
        });
        net.node().shape('react'); //定义结点形状
        net.edge().shape('arrow');//定义箭头形状
        net.source(data.nodes, data.edges);//存入数据
        net.render();
    }
    render(){
        //2、创建dom
        return(
            <JfCard title={this.state.title} bordered={false} loading={this.state.loading} hasTip={this.props.hasTip}>
                <div className="chart_height" >
                    <div id="bmountNode" style={{width:'100%',height:'350px'}} ref="container" > </div>
                </div>
            </JfCard>
        );
    }
}
