
import Request from '@/api/request';

/* 报表采集 */

export interface TcollectionList {
  taskNumber?: string
  collectStartTime?: string
  collectEndTime?: string
  createTime?: string
  recordNum?: string
  complementStatus?: string
}

export function queryCollectionTaskList(params?: Record<string, any>) {
  return Request.post<any,{ list: TcollectionList[], total: number }>('/service-datacollect/tdc/collecttask/taskList', params)
}

export interface TcollectionDetail {
  collectResultStatus: number
  collectType: number
  createTime: number
  eventId: number
  finishRecordNum: number
  id: number
  recordNum: number
  systemId: number
  taskNumber: string
  triggerType: number
  updateTime: number
  systemName: string
}

export function queryCollectionDetail(params: { taskId?: string }) {
  return Request.get<any, TcollectionDetail>('/service-datacollect/tdc/collecttask/taskDetail', params);
}

export function queryCollectionTaskReport(params: {taskId?: string, reportName?: string, status?: string, page?: number, pageSize?: number }) {
  return Request.post('/service-datacollect/tdc/collecttask/taskRecordPage', params)
}



/* 报表目录 */

export interface TreportDirectory {
  
}

export function querySystemDirectory() {
  return Request.get('/quantchiAPI/api/system/systempath/leftSysPathTree', {});
}

interface TdirectoryReportParams extends Record<string, any> {
  systemId?: string,
  systemPathId?: string,
  reportName?: string
}

export function queryDirectoryReport(params: TdirectoryReportParams ) {
  return Request.post('/quantchiAPI/api/system/systemreport/sysReportList', params);
}

export interface TreportDetail extends Record<string, any> {
  businessDepartment?: string
  businessMangerId?: string
  businessMangerName?: string
  createTime?: string
  desc?: string
  id?: string
  levelId?: string
  modifyUserId?: string
  modifyUserName?: string
  name?: string
  periodId?: string
  reportCategoryId?: string | string[]
  systemId?: string
  systemPath?: string
  systemPathId?: string
  techniqueDepartment?: string
  techniqueManagerId?: string
  techniqueManagerName?: string
  updateTime?: string
}

export function queryReportDetail(params: { reportId?: string }) {
  return Request.get<any, TreportDetail>('/quantchiAPI/api/system/systemreport/sysReportDetail', params);
}

export function queryReportTable(params: { reportId: string, pageNum: number, pageSize: number }) {
  return Request.post<any, any>('/quantchiAPI/api/system/systemreport/sysReportTableInfo', params);
}

export function editReport(params: Record<string, any>) {
  return Request.post('/quantchiAPI/api/system/systemreport/sysReportEdit', params);
}
