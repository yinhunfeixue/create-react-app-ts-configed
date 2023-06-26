import React from 'react';
import G6 from '@antv/g6';
import {JfCard} from 'app_common'
import style from '../../resources/dmp/css/component/consanguinityChart/consanguinityChart.css';

const data = {
    "nodes": [
        {
            "id": "node1",
            "name": "客户交易明细表",
            "x": 100,
            "y": 100,
            "status": 'success'
        },
        {
            "id": "node2",
            "name": "客户资金流失表",
            "x": 100,
            "y": 350,
            "status": 'success'
        },
        {
            "id": "node3",
            "name": "客户基本信息表",
            "x": 100,
            "y":600 ,
            "status": 'success'
        },

        {
            "id": "node4",
            "name": "客户每日资产表",
            "x": 350,
            "y": 100,
            "status": 'fail'
        },
        {
            "id": "node5",
            "name": "营业部每日资产表",
            "x": 350,
            "y": 350,
            "status": 'success'
        },
        {
            "id": "node6",
            "name": "市场数据表",
            "x": 350,
            "y": 600,
            "status": 'fail'
        },
        {
            "id": "node7",
            "name": "公司每日资产表",
            "x": 600,
            "y": 350,
            "status": 'fail'
        }],
    "edges": [{
        "source": "node1",
        "target": "node4",
        "id": "edge1"
    }, {
        "source": "node2",
        "target": "node4",
        "id": "edge2"
    },{
        "source": "node2",
        "target": "node5",
        "id": "edge3"
    }, {
        "source": "node3",
        "target": "node5",
        "id": "edge4"
    },{
        "source": "node5",
        "target": "node7",
        "id": "edge5"
    }, {
        "source": "node6",
        "target": "node7",
        "id": "edge6"
    }  ]
};

export default class ConsanguinityChart extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            title:this.props.title,//模块标题
            data:this.props.data, //数据接收
        };

    }
    componentDidMount(){

        console.log("开始渲染数据");

        this. refreshWholeCharts(data);
    }

    //绘制图形
    refreshWholeCharts(data){
        let Util = G6.Util;
        G6.registerNode('customNode', {
            cssSize: true, // 不使用内部 size 作为节点尺寸
            getHtml: function getHtml(cfg) {
                let model = cfg.model;
                let container = Util.createDOM('<div class="node-container"></div>');
                let corner =Util.createDOM('<div class="node-container-corner"></div>');
                let title = Util.createDOM('<div class="node-container-title">\n    <span>' + model.name + '</span>\n    </div>');
                let status = Util.createDOM('<div class="node-container-status node-container-' + model.status + '">\n      </div>');
                container.appendChild(corner);
                container.appendChild(title);
                container.appendChild(status);
                return container;
            }
        }, 'html');
        let net = new G6.Net({
            id: 'cmountNode',
            height: 300,
            fitView: 'tc'
        });
        net.removeBehaviour(['wheelZoom', 'resizeNode']);
        net.source(data.nodes, data.edges);
        net.node().shape('customNode').style({
            stroke: null // 去除默认边框
        });
        net.edge().shape('arrow');
        net.render();
    }

    render(){
         //2、创建dom
        return(
            <JfCard title={this.state.title} bordered={false} loading={this.state.loading} hasTip={this.props.hasTip}>
                <div className="chart_height" >
                    <div id="cmountNode" style={{width:'100%',height:'100%'}} ref="container" > </div>
                </div>
            </JfCard>

        );
    }
}
