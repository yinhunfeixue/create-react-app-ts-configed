// import React, { Component } from 'react'
// import Containers from './container'
// import tabConfigs from 'app_config'
// import TabsComponent from 'app_page/component/tabs'
// import 'app_component_main/baseLayout/index.less'
//
// export default class SourceMaContainer extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//
//         }
//     }
//
//     highFunctionClick = (title) => {
//         this.tabsCom.add(title)
//     }
//
//     // componentDidMount() {
//     //     this.tabsCom.add('数据源')
//     // }
//
//     changeActiveKey = (key) => {
//         if (key === '') {
//             // 这里为了处理key为空的情况
//             // this.container.setCurrentkey(["日常检核"])
//         } else {
//             this.container.setCurrentkey(key)
//         }
//     }
//
//     // commonSearch = () => {
//     //     this.tabsCom.add('全局搜索-搜索结果')
//     // }
//
//     commonSearch = (data) => {
//         this.tabsCom.add('全局搜索-搜索结果', { keyword: data })
//         // this.props.addTab('全局搜索-搜索结果', { keyword: data })
//     }
//
//     renderIndex = (menu) => {
//         this.tabsCom.add(menu)
//     }
//
//     render() {
//         return (
//             <div className='exam_container'>
//                 <div className='exam_container_left examination_left'>
//                     <Containers
//                         renderIndex={this.renderIndex}
//                         highFunctionClick={this.highFunctionClick} {
//                             ...this.props
//                         } ref={(dom) => {
//                         this.container = dom
//                     }}
//                     />
//                 </div>
//                 <div className='exam_container_right '>
//                     <TabsComponent
//                         componentList={tabConfigs}
//                         ref={(dom) => {
//                             this.tabsCom = dom
//                         }}
//                         changeActiveKey={this.changeActiveKey}
//                     />
//                 </div>
//             </div>
//         )
//     }
// }
