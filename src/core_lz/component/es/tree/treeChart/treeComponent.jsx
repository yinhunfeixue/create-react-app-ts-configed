// /**
//  * @author Fine
//  * @description d3 and react tree component
//  */
// import React from 'react';
// import * as d3 from 'd3';
//
// import CONSTANT from './CONSTANT';
// import data from './data';
//
// class TreeComponent extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             nodes: [], // tree nodes
//             links: [], // tree path
//             dataSource: [],
//             width: 0,
//             height: 0,
//             tranInfo: this.props.tranInfo,
//             clientX: 0,
//             clientY: 0,
//             toolTipInfo: []
//         };
//         this.tree = null;
//         /**
//          * bezier curve generator to path
//          */
//         this.bezierCurveGenerator = d3.linkHorizontal()
//             .x(d => d.y)
//             .y(d => d.x)
//     }
//
//     componentDidMount() {
//         // this.setState({
//         //     width: document.querySelector('.svgContainer').clientWidth,
//         //     height: document.querySelector('.svgContainer').clientHeight
//         // })
//         this.getData()
//         const g = d3.select('.tree_map');
//         g.on('mousedown',this.onmousedown)
//         g.call(
//             d3.drag()
//                 .on('drag', this.drag)
//         )
//     }
//     onmousedown = () => {
//         console.log(d3.event,'dragstart')
//         const {clientX,clientY} = d3.event
//         this.setState({
//             clientX,
//             clientY
//         })
//     }
//     drag = () => {
//         const {clientX,clientY,tranInfo} = this.state
//         let x = d3.event.sourceEvent.clientX - clientX
//         let y = d3.event.sourceEvent.clientY - clientY
//         tranInfo.x = Number(x) + tranInfo.x
//         tranInfo.y = Number(y) + tranInfo.y
//         this.setState({
//             clientX: d3.event.sourceEvent.clientX,
//             clientY: d3.event.sourceEvent.clientY,
//             tranInfo
//         })
//     }
//     diagonal = (d) => {
//         return "M" + d.y + "," + d.x
//             + "C" + (d.parent.y + 100) + "," + d.x
//             + " " + (d.parent.y + 100) + "," + d.parent.x
//             + " " + d.parent.y + "," + d.parent.x;
//     }
//     getData = async()=>{
//         let res =  await this.props.getData()
//         this.setState({
//             dataSource: res
//         })
//         this.initMapData()
//         this.resetTree(this.props.tranInfo)
//     }
//     // 收起
//     resetTree = (data) => {
//         console.log('reset+++++++')
//         const {nodes} = this.state
//         nodes.map((item) => {
//             if (item.data.level == 1 && item.data.children.length) {
//                 item.data.children = ''
//             }
//         })
//         this.setState({nodes,tranInfo: data})
//         console.log(this.state.tranInfo,'tranInfo')
//     }
//
//     shouldComponentUpdate(nextProps, nextState) {
//         const {links, nodes} = this.initTreeNodes(nextProps);
//         nextState.nodes = nodes;
//         nextState.links = links;
//
//         return true;
//     }
//
//     initMapData() {
//         const {links, nodes} = this.initTreeNodes(this.props);
//         this.setState({links, nodes});
//         let {toolTipInfo} = this.state
//         toolTipInfo = []
//         nodes.map((item) => {
//             toolTipInfo.push(false)
//         })
//     }
//     initTreeNodes(nextProps) {
//         // const {width, height, data} = this.props;
//         const { currentNode } = nextProps;
//         const { dataSource } = this.state
//         console.log('datasource',dataSource)
//         let nodes = [];
//         let links = [];
//         this.tree = d3.tree()
//             // .size([700, 500])
//             .nodeSize([200,300])
//             // .separation(function(a, b) {
//             //     return a.parent == b.parent ? 1 : 1.25;
//             // });
//             .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);
//         if (dataSource) {
//             // create data of tree structure
//             const hierarchyData = d3.hierarchy(dataSource)
//             // hierarchy layout and add node.x,node.y
//             const treeNode = this.tree(hierarchyData);
//             nodes = treeNode.descendants();
//             links = treeNode.links();
//             nodes = nodes.map(node => {
//                 if(node.data.children) {
//                     node.data._children = []
//                     // for(let i=0;i<node.data.children.length;i++) {
//                     //     node.data._children[i] = node.data.children[i]
//                     // }
//                     node.data._children = [...node.data.children];
//                 }
//                 if (node.active) {
//                     node.active = false;
//                     if (node.parent) {
//                         node.parent.active = false;
//                     }
//                 }
//                 if (node.data.name === currentNode.name) {
//                     node.active = true;
//                     if (node.parent) {
//                         node.parent.active = true;
//                     }
//                 }
//                 return node;
//             });
//             console.log(nodes)
//         }
//         return {nodes, links};
//     }
//
//     nodeActive = (event, currentNode) => {
//         // let { nodes } = this.state
//         console.log('currentNode',currentNode)
//         this.props.nodeClick(event, currentNode);
//     }
//     nodeEnter = (d, currentNode) => {
//         console.log(d,'currentNode',currentNode)
//         currentNode.data.children = currentNode.data.children ? '' : currentNode.data._children;
//         this.props.expandNode(currentNode.data.id)
//     }
//     treeExpand = (id) => {
//         // 同步展开或收起  功能先隐藏
//         return
//         console.log(id,'treeComponent+++++++++')
//         const {nodes} = this.state
//         nodes.map((item) => {
//             if (item.data.id == id) {
//                 item.data.children = item.data.children ? '' : item.data._children;
//                 this.initMapData()
//             }
//         })
//     }
//     getShortName = (value,type) => {
//         if (value) {
//             if (type == 2) {
//                 if (value.length > 20) {
//                     return value.substr(0,20) + '...'
//                 } else {
//                     return value
//                 }
//             } else {
//                 if (value.length > 6) {
//                     return value.substr(0,6) + '...'
//                 } else {
//                     return value
//                 }
//             }
//         } else {
//             return '（空白）'
//         }
//     }
//     showToolTip = (index,value) => {
//         const {toolTipInfo} = this.state
//         toolTipInfo[index] = value
//         this.setState({
//             toolTipInfo
//         })
//         console.log(toolTipInfo,'toolTipInfo')
//     }
//
//     render() {
//         const { width, height } = this.props;
//         let { links, nodes,dataSource,tranInfo, toolTipInfo } = this.state;
//         console.log(links,'links+++++')
//
//         return (
//             <svg className='svgContainer'>
//                 <g
//                     className="tree_map"
//                     transform={`translate(${tranInfo.x},${tranInfo.y}),scale(${this.props.tranInfo.k})`}>
//                     <g className='gLink'>
//                         {
//                             links.map((link, i) => {
//                                 const start = { x: link.source.x, y: link.source.y + CONSTANT.STARTBUF + 53 };
//                                 const end = { x: link.target.x, y: link.target.y + CONSTANT.ENDBUF };
//                                 const pathLink = this.bezierCurveGenerator({ source: start, target: end });
//
//                                 return <path
//                                     key={i}
//                                     d={pathLink}
//                                     fill='none'
//                                     stroke={CONSTANT.THEME.LINESTROKE}
//                                     strokeWidth='1'
//                                 />
//                             })}
//                     </g>
//                     <g className='gNode'>
//                         {nodes.map((node, i) => {
//                             node.type = node.data.type;
//                             node.tmp = node.data.tmp;
//                             node.error = node.data.error;
//                             node.color = node.data.color;
//                             node.name = node.data.name;
//                             node.level = node.data.level;
//
//                             return (<g key={i} transform={`translate(${node.y}, ${node.x - 10})`}>
//                                 {node.level == 0?
//                                     <g onClick={(event) => this.nodeActive(event, node)}>
//                                         <circle
//                                             cx={CONSTANT.CIRCLE.CX - 2}
//                                             cy={CONSTANT.CIRCLE.CY}
//                                             r={58}
//                                             fill='#636399'
//                                             stroke={node.active ? CONSTANT.THEME.ACTIVE : CONSTANT.THEME.NONEACTIVE}
//                                             strokeWidth={node.active ? 2 : 1}
//                                             style={{cursor: 'pointer'}}
//                                         />
//                                         <text x='7' y='12' fill='#fff' textAnchor='middle' style={{fontSize: CONSTANT.THEME.FONTSIZE,cursor: 'pointer'}}>
//                                             {this.getShortName(node.name)}
//                                         </text>
//                                     </g>
//                                     :
//                                     <g>
//                                         <g onClick={(event) => this.nodeActive(event, node)}
//                                            onMouseEnter={this.showToolTip.bind(this,i, true)}
//                                            onMouseLeave={this.showToolTip.bind(this,i, false)}>
//                                             <rect x={CONSTANT.CIRCLE.CX - 36} y={CONSTANT.CIRCLE.CY - 13} width={node.type == 1?90:270} height='32'
//                                                 // fill='#69B1BF'
//                                                   fill={CONSTANT.BACKGROUNDCOLOR[node.color % 6?(node.color % 6 - 1):5]}
//                                                   stroke={node.active ? CONSTANT.THEME.ACTIVE : CONSTANT.THEME.NONEACTIVE}
//                                                   strokeWidth={node.active ? 2 : 1}
//                                                   style={{cursor: 'pointer'}}
//                                             />
//                                             <text x='-18' y='15' fill='#fff' textAnchor='left' style={{fontSize: CONSTANT.THEME.FONTSIZE,cursor: 'pointer'}}>
//                                                 {this.getShortName(node.name, node.type)}
//                                             </text>
//                                         </g>
//                                         <g style={{display: toolTipInfo[i]?'block':'none'}}>
//                                             <text style={{fontSize: CONSTANT.THEME.FONTSIZE}} x='-25' y='45' fill='#b6b6b6' textAnchor='left'>{node.name}</text>
//                                         </g>
//                                     </g>
//                                 }
//                                 {node.depth < this.props.depth?
//                                     <g onClick={(d) => this.nodeEnter(d, node)}>
//                                         <circle
//                                             cx={76}
//                                             cy='10'
//                                             r='9'
//                                             fill='#F2F2F2'
//                                             style={{cursor: 'pointer'}}
//                                         />
//                                         <text x={70} y={15.5} fill='#555' textAnchor='right' style={{fontSize: '20px',cursor: 'pointer'}}>
//                                             {node.data.children?'-':'+'}
//                                         </text>
//                                     </g>
//                                     :''}
//                             </g>)
//                         })}
//                     </g>
//                 </g>
//             </svg>
//         )
//     }
// }
//
// export default TreeComponent;