import Request from "@/api/request";

/* 表路径 */

export function readTablePath(systemId: string, dwLevel: 'none' | 'ods' | 'dw' | 'app') {
  return Request.get('/quantchiAPI/api/dwapp/dataConfirm/queryTableSource', { systemId, dwLevel })
}

/* 业务分类 */

export function readBusinessClassify(params: any) {
  return Request.get('/quantchiAPI/api/tree/business', params);
}

/* 数仓主题分类 */
export function readDwTheme(params: any) {
  return Request.get('/quantchiAPI/api/tree/dataWarehouse/', params);
}

/* 分析主题分类 */
export function readAnalizeTheme(params: any) {
  return Request.get('/quantchiAPI/api/tree/analysisTheme/', params);
}