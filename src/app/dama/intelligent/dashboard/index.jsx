//
// import React, { Component } from 'react'
// // import tabConfigs from 'app_config/dashboard'
// // import DashboarTabConfigs from 'app_config/dashboard'
// // import IntelligentTabConfigs from 'app_config/intelligent'
// import tabConfigs from 'app_config'
// import TabsComponent from 'app_page/component/tabs'
// import './index.less'
// // const tabConfigs = Object.assign(
// //     {},
// //     DashboarTabConfigs,
// //     IntelligentTabConfigs
// // )
//
// export default class Dashboard extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//         }
//     }
//
//     componentDidMount = () => {
//         if (this.props.match && this.props.match.params.dataId) {
//             let param = {
//                 dataId: this.props.match.params.dataId
//             }
//             this.tabsCom.add('dashboardEdit', param)
//         } else {
//             this.tabsCom.add('dashboardList')
//         }
//     }
//
//     render() {
//         return (
//             <div className='exam_container' style={{ height: '100%' }}>
//                 <div
//                     className='exam_container_right'
//                     style={{ marginLeft: 0 }}
//                 >
//                     <TabsComponent dataId={this.props.match.params.dataId || null} componentList={tabConfigs} ref={(dom) => {
//                         this.tabsCom = dom
//                     }}
//                     />
//                 </div>
//             </div>
//         )
//     }
// }
