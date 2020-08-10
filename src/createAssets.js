const FS = require('fs');
const PATH = require('path');

const ROOT_FOLDER = PATH.join(__dirname, './assets/');
const EXT_LIST = ['.jpg', '.png', '.svg', '.gif'];

/**
 *
 * @param {*} folder
 * @return {string}
 */
function getAllFiles(folder = ROOT_FOLDER) {
  const items = FS.readdirSync(folder);
  let result = [];
  for (let item of items) {
    const absPath = PATH.join(folder, item);
    if (FS.statSync(absPath).isDirectory()) {
      result = result.concat(getAllFiles(absPath));
    } else if (EXT_LIST.indexOf(PATH.extname(item)) >= 0) {
      result.push(absPath);
    }
  }
  return result;
}

const code = {
  varList: [],
  exportList: [],
};
let fileList = getAllFiles();
for (const file of fileList) {
  const relativePath = file.replace(ROOT_FOLDER, '');
  const parse = PATH.parse(relativePath);

  const varName = PATH.join(parse.dir, parse.name)
    .split(PATH.sep)
    .filter((item) => item.length > 0)
    .join('_');

  const varValue = `require('./${relativePath.replace(/[\\/]/g, '/')}');`;
  const varItem = `const ${varName} = ${varValue}`;
  code.varList.push(varItem);

  code.exportList.push(varName);
}

let fileContent = '';
fileContent += code.varList.join('\r\n');
fileContent += '\r\n';
fileContent += '\r\n';
fileContent += `const Assets = {
  ${code.exportList.join(',\r\n')}
};\r\n`;

fileContent += `export default Assets;`;

FS.writeFileSync(PATH.join(ROOT_FOLDER, 'Assets.ts'), fileContent);

// const login_bg = require('./login/bg.jpg');
