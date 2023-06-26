
/*  
  血缘映射
*/

import Request from "@/api/request";

export interface TcreateBloodMap {
  auto: boolean,           // 是否自动确认
  databaseIds: string,    // 数据库ID，多个用逗号隔开
  deDesc: string,	//数仓层级描述
  dwType: string,	//数仓层级类型
  srcDsId: string,	//来源数据源ID	query	false	
  srcDsName: string //	来源数据源名	query	false	
  srcDsType: string, //	来源数据源类型	query	false	
  srcDw: boolean //	来源是否普数仓	query	false	
  tgtDsId: string //	目标数据源ID	query	false	
  tgtDsName: string //	目标源名称	query	false	
  tgtDsType: string //	目标源类型	query	false	
  tgtDw: boolean //	目标是否数仓
}

export function createBloodMap (params: Record<string, any>) {
  return Request.post<any, any>('/quantchiAPI/api/buildLineage/addDsPair', params)
}

export function readBloodMap(params: { keyword?: string, page?: number, pageSize?: number, page_size?: number, confirmedOrder?: any, toBeConfirmedOrder?: any, updateTimeOrder?: any }) {
  return Request.post('/quantchiAPI/api/buildLineage/listDsDetail', params);
}

export function updateBloodMap(params: TcreateBloodMap) {
  return Request.post<TcreateBloodMap, any>('/quantchiAPI/api/buildLineage/editDsPair', params)
}

export function deleteBloodMap(params: { srcDsId: string, tgtDsId: string }) {
  return Request.post('/quantchiAPI/api/buildLineage/deleteDsLineage', params)
}

export function readSTDataSource() {
  return Request.post('/quantchiAPI/api/buildLineage/listDsWithDwLvl', {})
}

export interface TreadTargetDataSource {
  id: number,
  name: string,
}
export function readTargetDataSource() {
  return Request.get<any, TreadTargetDataSource[]>('/quantchiAPI/api/buildLineage/listTgtDsId', {});
}

export interface TreadTargetDataSourceDetail{
  dsName?: string	//	数据源名称	
  dwLvl?: string //	数仓层级	string	
  tableConfirmed?: number  //	已映射表数目	integer(int32)	
  tableNotConfirmed?: number //	未映射表数目	integer(int32)	
  tableTotal?: number  //	表总数
}
export function readTargetDataSourceDetail(params: { datasourceId: number }) {
  return Request.get<any, TreadTargetDataSourceDetail>('/quantchiAPI/api/buildLineage/lineageTableCount', params);
}

export function rebuildBloodMap(params: { srcDsId: string, tgtDsId?: string }) {
  return Request.post('/quantchiAPI/api/buildLineage/rebuild', params);
}

export function readTableBloodMap(params: { keyword: string }) {
  return Request.post('/quantchiAPI/api/buildLineage/listTableDetail', params);
}

export function verifyTableBlood(params: { confirm: 0|1, srcSrcId: any, tgtSrcId: any }) {
  return Request.post('/quantchiAPI/api/buildLineage/auditLineage', params);
}

export function deleteTableBlood(params: { srcTableId: any, tgtTableId: any }) {
  return Request.get('/quantchiAPI/api/buildLineage/removeConfirmedLineage', params);
}

export function readDatabaseByCas(params: { dsId: any, dwLvl: any }) {
  return Request.get('/quantchiAPI/api/buildLineage/getDbByDsAndDwLvl', params);
}

export function readBloodMapDetail(params: { srcDsId?: any, tgtDsId?: any, keyword?: string, tgtDbId?: any, srcDbId?: any, page?: number, pageSize?: number, status: 0|1 }) {
  return Request.post('/quantchiAPI/api/buildLineage/listTableDetail', params)
}

// 
export function readBloodMapDetailRealy(params: { srcDsId: any, tgtDsId: any }) {
  return Request.get('/quantchiAPI/api/buildLineage/searchDsInfo', params)
}

export function readFieldMap(params: { page?: any, pageSize?: any, srcTableId: any, tgtTableId: any}) {
  return Request.post('/quantchiAPI/api/buildLineage/listColumnDetail', params);
}

export function readEditDetail(params: { srcDsId: any, tgtDsId: any }) {
  return Request.get('/quantchiAPI/api/buildLineage/writeback', params)
}

export function readTableBloodMapDatabase(params: { dbId: any, srcDsId: any, tgtDsId: any, type: 0 | 1 }) {
  return Request.post('/quantchiAPI/api/buildLineage/filterInfo', params);
}


