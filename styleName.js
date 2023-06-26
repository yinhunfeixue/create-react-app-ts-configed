const path = require('path')
module.exports = function customName(name) {
  // if(name === 'antd/lib/utils'){
  //   return false;
  // }
  return `antd/lib/${name}/style`
}