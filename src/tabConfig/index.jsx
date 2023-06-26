import DataSecurity from './dataSecurity'
import DataWarehouse from './dataWarehouse'
import Examination from './examination'
import Report from './report'
// import DataSourceTabConfig from './DataSourceTabConfig'
import autoManage from './autoManage'
import dashboard from './dashboard'
import Intelligent from './intelligent'
import routers from './routers'

// const tabConfig = Object.assign(
//     {},
//     // Examination,
//     // IndexMa,
//     // Intelligent,
//     // MetaData,
//     // Standard,
//     // SystemManageMent,
//     // DataAsset,
//     // Dashboard,
//     // LakeEntry,
//     // DataWarehouse,
//     // RuleConfigTabConfig,
//     // GlobalSearch,
//     // DataManageV2TabConfig,
//     // dataSecurity
// )
const tabConfig = [
    // ...DataAsset,
    ...DataWarehouse,
    ...routers,
    ...Examination,
    ...Report,
    ...DataSecurity,
    ...autoManage,
    ...Intelligent,
    ...dashboard,
]

export default tabConfig
