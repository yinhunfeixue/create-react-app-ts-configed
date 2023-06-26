import Request from '@/api/request'
/* 
  可信数据
*/

export interface TreadTrustData {
  authMethod: 0 | 1 //	认证方式(0:自动发现，1:人工添加)	integer(int32)	
  authTime: string  //	认证通过时间	string(date-time)	
  invalidSoon: boolean  //	是否即将失效	boolean	
  noticeDesc: string[]  //	提醒描述	string	
  noticeNum: number   //	提醒数	integer(int32)	
  operator: string  //	操作人	string	
  status: 1|2|3   //	状态:1已认证，2待认证，3已忽略	integer(int32)	
  tableId: number //	表id	integer(int64)	
  tableName: string //	表名	string	
  tablePath: string //	表路径	string	
  unstandardDesc: string[]  //	未达标描述	string	
  unstandardNum: number //	未达标数	integer(int32)	
}
export const mapStatus = {
  1: '已认证',
  2: '待认证',
  3: '已忽略'
}
export const mapAuthMethod = {
  0: '自动发现',
  1: '人工添加'
}
export const mockReadTrustData = [{
  authMethod: 0,
  authTime: '2022-09-09',  //	认证通过时间	string(date-time)	
  invalidSoon: true,
  noticeDesc: '数据质量',
  noticeNum: 2,
  operator: 'admin',
  status: 2,
  tableId: 1, //	表id	integer(int64)	
  tableName: 'table', //	表名	string	
  tablePath: '数据源名称/db_name', //	表路径	string	
  unstandardDesc: '数据发现',  //	未达标描述	string	
  unstandardNum: 5 //	未达标数	integer(int32)	
}]
export function readTrustData(params: { keyword?: string, databaseId?: string, datasourceId?: string, authMethod?: 0 | 1, status?: 1 | 2 | 3, tableName?: string, tablePath?: string, page?: number, pageSize?: number, needAll?: boolean, orderByTime?: any }) {
  return Request.post<any, TreadTrustData[]>('/quantchiAPI/api/dwapp/trust/list', params);
}

export function deleteTrustData(params: { tableId: number }) {
  return Request.del(`/quantchiAPI/api/dwapp/trust/removeAuthTable/${params.tableId}`, params)
}

export function createTrustDataSource(params: Record<string, any>) {
  return Request.post('/quantchiAPI/api/dwapp/trust/saveAuthConfig', params)
}

export function readTableSourcePath(params: { status?: number }) {
  return Request.get('/quantchiAPI/api/dwapp/trust/queryTableSource', params);
}

export function createTrustTable(params: { tableId: number }) {
  return Request.get('/quantchiAPI/api/dwapp/trust/addAuthTable', params);
}

export function readDataSource(params: { page: number, pageSize: number, keyword?: string }) {
  return Request.post('/quantchiAPI/api/dwapp/trust/queryDatasource', params)
}

export function readTrustDataSourceConfig() {
  return Request.get('/quantchiAPI/api/dwapp/trust/queryAuthConfig', {})
}

export function readTrustDataSourceDetail(params: { tableId: any }) {
  return Request.get('/quantchiAPI/api/dwapp/trust/queryAuthTableDetail',params )
}

export function reVerify(params: { tableId: any }) {
  return Request.get('/quantchiAPI/api/dwapp/trust/reAuthSingleTable', params)
}
