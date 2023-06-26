// /**
//  *  props {
//  *     getData:fun ,
//  *     deleteData :fun ,
//  *     editData : fun
//  *  }
//  * */
// import React from "react";
// import "./index.less";
// import classNames from 'classnames';
// import * as d3 from "d3";
// import CONSTANT from './CONSTANT';
// import TreeComponent from './treeComponent';
// import ZoomIn from 'app_images/zoomin.png'
// import ZoomOut from 'app_images/zoomout.png'
// import resetPng from 'app_images/reset.png'
//
// export default class ThreedTree extends React.Component {
//
//     constructor(props){
//         super(props);
//         this.state={
//             treeData: [],
//             currentNode: {}, // select node
//             menuStatus: 'hidden',
//             positionY: 0,
//             positionX: 0,
//             tranInfo: CONSTANT.TRANINFO,
//             dataSource: null,
//             width: 800,
//             height:400
//         }
//     }
//     componentWillMount() {
//
//     }
//     componentDidMount(){
//         // document.querySelector('.asideMenu').addEventListener('click',this.getData , false)
//         this.setState({
//             width: document.querySelector('.chartContainer').offsetWidth,
//             height: document.querySelector('.chartContainer').offsetHeight
//         })
//     }
//
//     getNodeData = ()=>{
//         let treeData = JSON.parse(JSON.stringify(this.props.treeData))
//         return treeData
//     }
//
//     addNode = () => {
//         const { currentNode } = this.state;
//         this.cancleActive();
//         if (!currentNode.children) {
//             currentNode.children = [];
//         }
//         CONSTANT.NEWNODE.name = Math.random() * 10;
//         currentNode.children.push(CONSTANT.NEWNODE);
//
//         let rootNode = currentNode;
//         while (rootNode.parent) {
//             rootNode = rootNode.parent;
//         }
//         delete rootNode.data;
//         this.setState({dataSource: rootNode});
//     }
//
//     deleteNode = () => {
//         let { currentNode } = this.state;
//         this.cancleActive();
//         if (currentNode.children) {
//             currentNode.children = null;
//         }
//         const currentNodeName = currentNode.name;
//         const currentNodeParent = currentNode.parent;
//         if (currentNodeParent) {
//             for (let i = 0; i < currentNodeParent.children.length; i++) {
//                 if (currentNodeParent.children[i].name === currentNodeName) {
//                     currentNodeParent.children.splice(i,1);
//                 }
//             }
//         } else {
//             currentNode = null;
//         }
//         let rootNode = currentNode;
//         if (rootNode) {
//             while (rootNode.parent) {
//                 rootNode = rootNode.parent;
//             }
//         }
//         this.setState({dataSource: rootNode});
//     }
//
//     cancleActive = () => {
//         // reset node active
//         this.setState({menuStatus: 'hidden', currentNode: {}});
//     }
//
//     nodeClick = (event, currentNode) => {
//         const positionX = event.pageX + CONSTANT.DIFF.X + 'px';
//         const positionY = event.pageY + CONSTANT.DIFF.Y  + 'px';
//
//         event.stopPropagation();
//         this.setState({menuStatus: 'visible', currentNode, positionX, positionY});
//     }
//
//     zoomIn = () => {
//         const g = d3.select('.tree_map');
//         d3.zoom().scaleBy(g, 0.9);
//         const tranInfo = d3.zoomTransform(g.node());
//         this.setState({tranInfo});
//     }
//
//     zoomOut = () => {
//         const g = d3.select('.tree_map');
//         d3.zoom().scaleBy(g, 1.1);
//         const tranInfo = d3.zoomTransform(g.node());
//         this.setState({tranInfo});
//     }
//
//     resetZoom = async () => {
//         await this.setState({
//             tranInfo: CONSTANT.TRANINFO
//         })
//         this.TreeComponent.resetTree({k: 1, x: 60, y: 500})
//     }
//     treeExpand = (id) => {
//         console.log(id,'d3tree+++++++++')
//         this.TreeComponent.treeExpand(id)
//     }
//     expandNode = (id) => {
//         this.props.expandNode(id)
//     }
//     render() {
//         const {
//             currentNode, positionX, positionY,
//             menuStatus, tranInfo, dataSource, width, height
//         } = this.state;
//         return (
//             <div style={{width: 'calc(100% - 220px)', height: '100%',display: 'inline-block' }}>
//                 <div className='chartContainer' style={{width: '100%', height: '100%' }}>
//                     <div className='HideScroll' onClick={this.cancleActive} style={{width: '100%', height: '100%',overflow: 'auto' }}>
//                         <TreeComponent data={dataSource} width={width} height={height} tranInfo={tranInfo} nodeClick={this.nodeClick}
//                                        getData={this.getNodeData} dataSource={dataSource} currentNode={currentNode}
//                                        depth={this.props.depth}
//                                        ref={(node)=>{this.TreeComponent=node}}
//                                        expandNode={this.expandNode}
//                         />
//                         <div className="menu" style={{visibility: menuStatus, left: positionX, top: positionY}}>
//                             <div className="info-menu">
//                                 <span>Avg.response time<i>{currentNode.avgTime}</i></span>
//                                 <span>TMP<i style={{width: '135px'}}>{currentNode.tmp}</i></span>
//                                 <span>Error/min.<i style={{width: '105px'}}>{currentNode.error}</i></span>
//                             </div>
//                         </div>
//                         <div className="operate-list">
//                             <div style={{marginBottom: '7px'}} onClick={this.resetZoom}><img title='重置' src={resetPng}/></div>
//                             <div style={{marginBottom: '7px'}} title="add node" onClick={this.zoomOut}><img title='放大' src={ZoomOut}/></div>
//                             <div title="delete node" onClick={this.zoomIn}><img title='缩小' src={ZoomIn}/></div>
//                         </div>
//                     </div>
//                 </div>
//
//             </div>
//         );
//     }
// }
