import Request from "./request"
/* 
  分类确权
*/

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
  return Request.get<any, Tsystem[]>('/quantchiAPI/api/dwapp/dataConfirm/listSystems', params);
}

// 确权列表

export function readConfirmList(params: Record<string, any>) {
  return Request.post('/quantchiAPI/api/dwapp/dataConfirm/confirmTableList', params)
}

// 单标确权查询
export function readConfirmSignleDetail(params: { tableId: string }) {
  return Request.get('/quantchiAPI/api/dwapp/dataConfirm/singleTableConfirmInfo', params);
}

// 多表确权查询
export function readConfirmBatchDetail(params: {tableIds: string[]}) {
  return Request.post('/quantchiAPI/api/dwapp/dataConfirm/batchTableConfirmInfo', params);
}

// 确权操作
export function createConfirm(params: Record<string, any>) {
  return Request.post('/quantchiAPI/api/dwapp/dataConfirm/batchConfirmTable', params)
}

// 变更分类归属部门的提示信息
export function readChangeDepart(params: { classId: string, deptId: string }) {
  return Request.get('/quantchiAPI/api/dwapp/dataConfirm/changeDeptNotice', params);
}

// 变更分类负责人的提示信息
export function readChangeUser(params: { classId: string, managerId: string }) {
  return Request.get('/quantchiAPI/api/dwapp/dataConfirm/changeManagerNotice', params);
}

// 系统详情查询
export function readSystemDetail(params: { systemId: string }) {
  return Request.get('/quantchiAPI/api/dwapp/dataConfirm/querySystemInfo', params);
}

// 配置是否完善
export function readSystemCompleted(params: { dwLevel: any, systemId: any }) {
  return Request.get('/quantchiAPI/api/dwapp/dataConfirm/isClassInfoCompleted', params);
}

// 查询全部列表
export function readAllConfirmation(params: Record<string, any>) {
  return Request.post('/quantchiAPI/api/dwapp/dataConfirm/batchConfirmAllTable', params);
}