
import Request from "@/api/request";


interface Tlist extends Record<string, any> {
  hasPath: boolean,
  icon: string,
  id: number,
  name: string,
  outSysId: number,
}
/* 系统分类 */
export interface Tsystem extends Record<string, any> {
  id: number,
  name: string,
  desc: string,
  systemList: Tlist[]
}

export function querySystemList(params?: { keyword?: string }) {
  return Request.get<any, Tsystem[]>('/quantchiAPI/api/system/sysTree', params);
}

export function createSystemCategory(params: Record<string, any>) {
  return Request.post('/quantchiAPI/api/system/sysCategoryCreate', params);
}

export function editSystemCategory(params: Record<string, any>) {
  return Request.post('/quantchiAPI/api/system/sysCategoryEdit', params);
}

export function deleteSystemCategory(params: { sysCategoryId:string|number }) {
  return Request.get('/quantchiAPI/api/system/sysCategoryDelete', params);
}

export function sortCategory(params: {}) {
  return Request.post('/quantchiAPI/api/system/sysCategorySort', params);
}

/* 系统 */

export interface TsystemDetail extends Record<string, any> {
  businessDepartment?: string
  businessMangerId?:	number
  code?: number
  createTime?: string
  createUserId?: string
  createUserName?: string
  desc?: string
  icon?: string
  id?: string
  modifyUserId?: string
  modifyUserName?: string
  name?: string
  otherBusinessUsed?: string
  systemSupplier?: string
  systemType?: number|string
  techniqueDepartment?: string
  techniqueManagerId?: string
  updateTime?: string
  techniqueManagerName?: string,
  businessMangerName?: string
}

export function querySystemListByCate(parms: { categoryId: any }) {
  return Request.get('/quantchiAPI/api/system/systemListOfCategory', parms);
}

export function querySystem(params: { sysId: string }) {
  return Request.get<any, TsystemDetail>('/quantchiAPI/api/system/sysDetail', params)
}

export function createSystem(params: TsystemDetail) {
  return Request.post('/quantchiAPI/api/system/sysCreate', params)
}

export function editSystem(params: TsystemDetail) {
  return Request.post('/quantchiAPI/api/system/sysEdit', params)
}

export function sortSystem(params: {}) {
  return Request.post('/quantchiAPI/api/system/sysSort', params);
}

export function deleteSystem(params: {sysId: string}) {
  return Request.get('/quantchiAPI/api/system/sysDelete', params);
}


/* 报表 */

export interface Treport{
  businessDepartment?: string
  businessMangerId?: string
  createTime?: string
  desc?: string
  id?: string
  levelId?: string
  modifyUserId?: string
  modifyUserName?: string
  periodId?: string
  reportCategoryId?: string
  systemId?: string
  systemPathId?: string
  techniqueDepartment?: string	
  techniqueManagerId?:string
  updateTime?:string
}

export function queryReport(params: { reportName?: string, systemId?: string, systemPathId?: string }) {
  return Request.post<any, { list: Treport[] }>('/quantchiAPI/api/system/systemreport/sysReportList', { pageNum: 1, pageSize: 5, ...params })
}

/* 关联数据源 */

/* export interface TdataSource {
  alias?: string
  collectTime?: string
  contextPath?: string
  contextPaths?: string
  createUserId?: string
  creationDate?: string
  databaseInstance?: string
  databaseVersion?: string
  datasourceConnectionModifiedDate?: string
  datasourceConnectionModifyUserId?: string
  datasourceConnectionModifyUserName?: string
  description?: string
  driverOption?: string
  dsName?: string
  dsType?: string
  effectiveTime?: string
  hasSim?: string
  id?: string
  identifier?: string
  keyword?: string
  mountNodeId?: string
  network?: string
  operationSystem?: string
  product?: string
  table_num?: string
  taskTypeCount?: string
  validState?: string
} */
export interface TdataSource {
  collectMethod: number
  collectTime: string
  creationDate: string
  dataWarehouse: boolean
  databases: any[]
  datasourceConnectionModifiedDate: string
  dsName: string
  effectiveTime: null
  hasCode: boolean
  hasSim: boolean
  id: number
  identifier: string
  mountNodeIds: string[]
  treeNodeIds: string[],
  selected?: boolean
}

export function queryDataSourceList(params: { systemId?: string, keyword?: string, pageNum?: number, pageSize?: number }) {
  return Request.get<any, TdataSource[]>('/quantchiAPI/api/system/datasource/selectDatasourceList', params)
}

export function queryLinkedDataSource(params: { sysId?: string }) {
  return Request.get('/quantchiAPI/api/system/datasource/sysDataSourceList', params)
}

export function createSystemDataSource(params: { datasourceIds: any[], systemId: any }) {
  return Request.post('/quantchiAPI/api/system/datasource/addSysRelation', params)
}

export function unbindLinkedDataSource(params: { dataSourceId?: string, sysId?: string }) {
  return Request.get('/quantchiAPI/api/system/datasource/removeRelation', params);
}


/* 系统目录 */
export interface TsystemDirectory {
  canEdit?: boolean,
  desc?: string	
  id?: string	
  name?: string	
  sort?: string	
  childList?: TsystemDirectory[]
}

export function querySystemDirectoryList(params: { systemId?: string|number }) {
  return Request.get<any, TsystemDirectory[]>('/quantchiAPI/api/system/systempath/sysPathTree', params)
}

export function sortDirectory(params: { sortList: string[] }) {
  return Request.post('/quantchiAPI/api/system/systempath/sysPathSort', params);
}

export function uploadDirectory(params: FormData) {
  return Request.post('/quantchiAPI/api/system/systempath/sysPathImport', params);
}

export function editDirectory(params: Record<string, any>) {
  return Request.post('/quantchiAPI/api/system/systempath/sysPathEdit', params);
}

export function createDirectory(params: Record<string, any>) {
  return Request.post('/quantchiAPI/api/system/systempath/sysPathCreate', params);
}

export function searchDirectory(params: { keyword: string, systemId: string, }) {
  return Request.get('/quantchiAPI/api/system/systempath/sysPathTreeSearch', params);
}

export function deleteDirectory(params: { id: string }) {
  return Request.get('/quantchiAPI/api/system/systempath/sysPathDelete', params)
}

export function queryDirectoryDetail(params: { id: string }) {
  return Request.get('/quantchiAPI/api/system/systempath/sysPathDetail', params)
}
