export { default as Time } from './time';


/* 百分比格式化 */
export const formatPercent = (value: number, total: number, toFixed?: number) => {
  if(total == 0) return { value: 0, percent: '0%' }
  const res = Number(((value/total)*100).toFixed(toFixed || 0));
  const formatRes = (typeof(res) !== 'number' || res === Infinity) ? '' : res;
  return {
    value: formatRes,
    percent: formatRes ? formatRes + '%' : ''
  }
}

/* 数字添加千分符 */
export function addDou(numStr: number|string) {
  if(!numStr) return '';
  const strNum = String(numStr);
  const numArr = strNum.split('.');
  let num = numArr[0]
  var result = ''
  while(num.length>3){
      result = ','+num.slice(-3)+result
      num = num.slice(0,num.length-3)
  }
  if(num){
      result = num+result
  }
  result = numArr[1] ? result+'.'+numArr[1] : result
  return result
}

/* 
  递归
*/

export function recursiveByCb(data: any[], cb: (item: any) => void) {
  function loop(data: any[]) {
    data.forEach(v => {
      cb(v);
      if(v.children && v.children.length > 0) {
        loop(v.children)
      }
    })
  }
  loop(data)
}
