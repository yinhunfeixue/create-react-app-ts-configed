import Request from "@/api/request";

/* 技术归属部门 */

export interface Tdepart {
  departName: string
  depth: number
  id: string
  leaf: boolean
  parent: string
  parentId: string
  path: string
  root: boolean
}

export interface Tuser {
  departmentId: string
  departmentName: string
  departmentNameAll: string
  email: string
  id: string
  realname: string
  username:string
  status: number
}

export function queryDepart() {
  return Request.get<any, Tdepart[]>('/quantchiAPI/api/departments', { page_size: 99999 })
}

export function queryUser(params: { departmentId?: string }) {
  return Request.get<any, Tuser[]>('/quantchiAPI/api/users', { brief: false, page_size: 99999, ...params })
}

export function queryTreeDepart() {
  return Request.get('/quantchiAPI/api/umg/dept/deptTree', {})
}

// 分类
export function queryCate() {
  return Request.get('/quantchiAPI/api/system/systemreport/getReportsCategoryTree', {})
}

// 等级
export function queryLevel() {
  return Request.get('/quantchiAPI/api/option/standard/reportLevel', {})
}

// 周期
export function queryCycle() {
  return Request.get('/quantchiAPI/api/option/standard/reportCycle', {})
}


/* 数据源 */
export function readDataSource() {
  return Request.get('/quantchiAPI/api/metadata/datasource', {ignoreProducts: 'MONGODB', sourceType: 1})
}

/* 数据库 */
export function readDatabase(params: {datasourceId: number}) {
  return Request.get('/quantchiAPI/api/metadata/database/list', { page: 1, page_size: 999999, ...params })
}

/* 数据库表选择 */
export function readDataTable(params: { databaseId: number, datasourceId: number }) {
  return Request.post('/quantchiAPI/api/metadata/table/searchTable', { page: 1, page_size: 999999, ...params })
}

/* 数据库表选择 */
export function listTableByDatabaseId(params: { databaseId: number, datasourceId: number }) {
  return Request.get('/quantchiAPI/api/metadata/table/listTableByDatabaseId', { page: 1, page_size: 999999, ...params })
}



/* 表搜索 */
export function readDataTableByKeyword(params: { tableName: string }) {
  return Request.get('/quantchiAPI/api/dwapp/trust/queryTablePathByName', params);
}