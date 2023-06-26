import React, {Component} from 'react'
import {JfCard} from 'app_common';
import _ from 'underscore';
import $ from 'jquery';
import echarts from 'echarts';
import SliceStyle from 'app_js/sliceStyle';

/*
nodeData:[
    {
    //名称
    name:'',
    // 中文名
    c_name:'',
    // 与中心节点的距离，大于0为下级，小于0为上级
    level:number, parents<0, children>0,center=0
    // 是否有下级
    hasChild:boolean
    }
],
edgeData:[
    {
        // 起点name，即上级
        source,
        // 终点name，即下级
        target
    }
],
getNextLevelData:Function   (node)=>Array<node>
*/
const {
    relationGraphCenterNodeColor,
    relationGraphNodeColor,
    lineColor,
    relationGraphSelectedBorderColor,
    textColor
} = SliceStyle;
export default class RelationGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:this.props.title,
            loading:true,
            height:this.props.height
        }
        this.symbolSize = [80,55];
        this.btnSize = 7;
    }

    componentDidMount(){
        this.chart = echarts.init(this.refs.chart);
    }

    componentWillReceiveProps(nextProps){
        this.setState({title:nextProps.title,loading:nextProps.loading});
    }

    resize(){
        this.chart.resize();
    }

    //获取下一层数据
    async getNextLevelData(node){
        let nodes = _.map(this.nodePath[node.name],name=>(this.dataNameMap[name]));
        if(nodes.length===0){
            nodes = await this.props.getNextLevelData(node);
            this.nodePath[node.name] = nodes.map(({name})=>name);
        }
        return nodes;
    }

    async onClickExpand(index){
        this.nodeData[index].expanded = !this.nodeData[index].expanded;
        const node = this.nodeData[index];
        const level = node.level>0?node.level+1:node.level-1;
        //展开
        if(node.expanded){
            const nextLevelData = await this.getNextLevelData(node);
            _.map(nextLevelData,(item)=>{
                if(Object.keys(this.dataNameMap).indexOf(item.name)<0){
                    this.nodeData.push({...item,level});
                    this.openedPath[item.name] = 1;
                }
                else {
                    this.nodeData[this.dataNameMap[item.name].index].show = true;
                    this.openedPath[item.name]++;
                }
                if(level>0){
                    this.edgeData.push({source:node.name,target:item.name})
                }
                else {
                    this.edgeData.push({source:item.name,target:node.name})
                }
            });
        }
        //收起
        else {
            this.removingNodes = [];
            this.getRemovingNodes(node.name);
            this.nodeData.map(item=>{
                if(this.removingNodes.indexOf(item.name)>=0){
                    item.show = false;
                }
            });
            if(level>0){
                this.edgeData = this.edgeData.filter(({source})=>(this.removingNodes.indexOf(source)<0&&source!==node.name));
            }
            else {
                this.edgeData = this.edgeData.filter(({target})=>(this.removingNodes.indexOf(target)<0&&target!==node.name));
            }
        }
        this.prepareNodeData();
        this.option.series.data = this.data;
        this.option.series.links = this.edgeData;
        this.chart.setOption(this.option);
        this.setChartHeight();
    }

    getRemovingNodes(name){
        _.map(this.nodePath[name],(item)=>{
            this.openedPath[item]--;
            if(this.openedPath[item]===0){
                this.removingNodes.push(item);
                if(this.nodePath[item]&&this.dataNameMap[item].expanded){
                    this.nodeData[this.dataNameMap[item].index].expanded = false;
                    this.getRemovingNodes(item);
                }
            }
        })
    }

    getExpandBtn({node}){
        if(node.show==undefined){
            node.show = true;
        }
        const position = this.chart.convertToPixel({seriesIndex: 0}, [node.x,node.y]);
        if(node.level>0){
            position[0]+=this.symbolSize[0]/2+this.btnSize;
        }
        else {
            position[0]-=this.symbolSize[0]/2+this.btnSize;
        }
        return {
            type: 'group',
            id:node.name,
            invisible:!node.show,
            onclick:node.show?this.onClickExpand.bind(this,node.index):null,
            children: [
                {
                    type: 'circle',
                    z: 100,
                    id:`${node.name}_circle`,
                    invisible:!node.show,
                    left: 'center',
                    top: 'middle',
                    shape: {
                        r:this.btnSize
                    },
                    style: {
                        fill: '#ffa442',
                    }
                },
                {
                    type: 'text',
                    z: 100,
                    invisible:!node.show,
                    id:`${node.name}_text`,
                    top: 'middle',
                    left: 'center',
                    style: {
                        text: node.expanded?'-':'+',
                        fill:'#fff',
                        textVerticalAlign:'middle',
                        textAlign:'center',
                        font:'bolder'
                    }
                }
            ],
            position,
            z: 100
        }
    }

    setChartHeight(){
        const maxLevel = Math.max.apply(Math,Object.values(this.levelLength));
        let height = maxLevel*100;
        if(height<this.props.height){
            height = this.props.height;
        }
        this.setState({height},()=>{
            this.resize();
            this.chart.setOption({
                graphic:_.map(this.dataNameMap,item=>{
                    if(item.level===0||!item.hasChild){
                        return null;
                    }
                    return this.getExpandBtn({node:item});
                }).filter((item)=>(item!==null))
            });
        });
    }

    refreshGraph(params){
        this.params = params;
        this.dataNameMap = {};
        this.nodeData = params.nodeData;
        this.edgeData = _.map(params.edgeData,(edge)=>({...edge}));
        this.prepareNodeData();
        this.prepareNodePath();
        this.prepareOption(params);
        this.chart.clear();
        this.chart.setOption(this.option);
        this.setChartHeight();
        this.chart.off('graphRoam');
        this.chart.off('click');
        this.chart.on('graphRoam',()=>{
            this.chart.setOption({
                graphic:_.map(this.data,(item)=>{
                    if(item.level===0||!item.hasChild){
                        return null;
                    }
                    const position = this.chart.convertToPixel({seriesIndex: 0}, [item.x,item.y]);
                    if(item.level>0){
                        position[0]+=this.symbolSize[0]/2+this.btnSize;
                    }
                    else {
                        position[0]-=this.symbolSize[0]/2+this.btnSize;
                    }
                    return {
                        id:item.name,
                        position,
                        type:'group'
                    }
                }).filter((item)=>(item!==null))
            });
        });
        this.chart.on('click',(clickParams)=>{
            // &&clickParams.data.level!==0
            if(clickParams.dataType==='node'&&clickParams.data.index!==undefined){
                this.currentNode = clickParams.name;
                this.prepareNodeData();
                this.chart.setOption({
                    series:{
                        data:this.data
                    }
                });
                if(this.props.onClickNode){
                    this.props.onClickNode(clickParams.data);
                }
            }
        });
        this.setState({loading:false});
    }

    //nodePath---正向source作为key，target数组作为值，反向相反
    prepareNodePath(){
        this.nodePath = {};
        this.openedPath = {};
        _.map(this.edgeData,(edge)=>{
            if(!this.dataNameMap[edge.source]||!this.dataNameMap[edge.target]){
                return;
            }
            const {level} = this.dataNameMap[edge.source];
            let {target,source} = edge;
            if(level<0){
                target = edge.source;
                source = edge.target;
            }
            if(this.nodePath[`${source}`]==undefined){
                this.nodePath[`${source}`] = [];
            }
            if(this.openedPath[`${target}`]==undefined){
                this.openedPath[`${target}`] = 0;
            }
            this.openedPath[`${target}`]++;
            this.nodePath[`${source}`].push(`${target}`);
            this.dataNameMap[`${source}`].expanded = true;
            this.nodeData[this.dataNameMap[`${source}`].index].expanded = true;
        });
    }

    //给数据加上x,y用于定位，中心点及选中点加上特殊样式
    prepareNodeData(){
        this.levelLength = {};
        let physicsNodeData = [];
        this.data = _.map(this.nodeData,(node,index)=>{
            const {level} = node;
            if(this.levelLength[`${level}`]==undefined){
                this.levelLength[`${level}`] = 0;
            }
            this.levelLength[`${level}`]++;
            const length = this.levelLength[`${level}`];
            const x = 30*level;
            let y = 0;
            if(length%2===0){
                y = length*10*(Math.pow(-1,length));
            }
            else {
                y = (length-1)*10*(Math.pow(-1,length));
            }
            this.dataNameMap[node.name] = {...node,index,x,y};
            if(node.show==undefined){
                node.show = true;
            }
            if(!node.show){
                return null;
            }
            if(node.phsicalFieldName){
                const item = {
                    name:node.phsicalFieldName,
                    label:node.phsicalFieldName
                };
                let physicsLevel = 0;
                if(level>0){
                    physicsLevel = level+1;
                }
                else if(level<0){
                    physicsLevel = level-1;
                }
                const physicsX = 30*physicsLevel;
                if(this.levelLength[`${physicsLevel}`]==undefined){
                    this.levelLength[`${physicsLevel}`] = 0;
                }
                this.levelLength[`${physicsLevel}`]++;
                const physicsLength = this.levelLength[`${physicsLevel}`];
                let physicsY = 0;
                if(physicsLength%2===0){
                    physicsY = physicsLength*10*(Math.pow(-1,physicsLength));
                }
                else {
                    physicsY = (physicsLength-1)*10*(Math.pow(-1,physicsLength));
                }
                physicsNodeData.push({
                    ...item,
                    x:physicsX,
                    level:physicsLevel,
                    y:physicsY,
                    symbol:'circle',
                    itemStyle:{
                        normal:{
                            color:'#def0ff',
                            borderColor:'#def0ff'
                        }
                    }
                });
                let source = node.name;
                let target = item.name;
                if(physicsLevel<0){
                    source = item.name;
                    target = node.name;
                }
                this.edgeData.push({
                    source,
                    target,
                    symbol:'none',
                    lineStyle:{
                        normal:{
                            type:'dotted'
                        }
                    }
                })
            }
            let nodeStyle = {};
            if(level===0){
                nodeStyle = {
                    itemStyle:{
                        normal:{
                            color:relationGraphCenterNodeColor||'#106bff',
                            borderColor:relationGraphCenterNodeColor||'#106bff'
                        }
                    }
                }
            }
            else if (this.currentNode===node.name) {
                nodeStyle = {
                    itemStyle:{
                        normal:{
                            color:relationGraphNodeColor||'#fff',
                            borderColor:relationGraphSelectedBorderColor||'#ffa442'
                        }
                    }
                }
            }
            return {
                ...node,
                x,
                y,
                ...nodeStyle,
                index
            }
        }).filter((node)=>(node!==null)).concat(physicsNodeData);
    }

    prepareOption(params){
        this.option = {
            animation:true,
            series : {
                type: 'graph',
                layout: 'none',
                nodeScaleRatio:0,
                symbolSize: this.symbolSize,
                roam: true,
                top:'30',
                bottom:'30',
                label: {
                    normal: {
                        color:textColor,
                        show: true,
                        align:'center',
                        formatter:(labelParams)=>{
                            const {index,label,phsicalFieldDesc,level} = labelParams.data;
                            if(index===undefined){
                                return `${label.split('.').join('\n')}`
                            }
                            if(level===0){
                                return `{center|${label}${phsicalFieldDesc?('\n'+phsicalFieldDesc):''}}`
                            }
                            else {
                                return `${label}${phsicalFieldDesc?('\n'+phsicalFieldDesc):''}`
                            }
                        },
                        rich:{
                            center:{
                                textBorderColor:'#106bff',
                                textBorderWidth:1,
                                color:'#fff'
                            }
                        }
                    }
                },
                itemStyle:{
                    normal:{
                        color:relationGraphNodeColor||'#fff',
                        borderColor:'#ccc',
                    }
                },
                symbol:'rect',
                edgeSymbol: ['none','arrow'],
                edgeSymbolSize:15,
                data:this.data,
                links:this.edgeData
            }
        };
        $.extend(true,this.option,params.extraOption);
    }

    render(){
        return (<JfCard title={this.state.title||''} loading={this.state.loading} hasTip={this.props.hasTip}>
            <div style={{maxHeight:'400px',width:"100%"}}>
            <div ref="chart" style={{width:'100%',height:(this.state.height||280+'px')}}></div>
            </div>
        </JfCard>);
    }
}
