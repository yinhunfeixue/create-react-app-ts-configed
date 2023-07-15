const FS = require('fs');
const PATH = require('path');

const assetFold = 'assets';
const ROOT_FOLDER = PATH.join(__dirname, assetFold);
const EXT_LIST = ['.jpg', '.png', '.svg', '.gif'];

const netAssetsServer = '';
const isWx = false;

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

  const varValue = generateAssetRequire(
    relativePath,
    Boolean(netAssetsServer),
    isWx
  );
  const varItem = `const ${varName} = ${varValue}`;
  code.varList.push(varItem);

  code.exportList.push(varName);
}

function generateAssetRequire(path, useNetAssets = true, isWx = false) {
  const usedPath = path.replace(/[\\/]/g, '/');
  if (useNetAssets) {
    return `getStaticReourceImg('${usedPath}')`;
  }
  if (isWx) {
    return `'/${assetFold}${usedPath}'`;
  }
  return `require('./${assetFold}${usedPath}')`;
}

const contentList = [];

contentList.push(`/* eslint-disable */`);
// 资源列表
contentList.push(code.varList.join('\r\n'));

// 用于导出的对象
contentList.push(
  `const Assets = {
  ${code.exportList.join(',\r\n')}
};`
);
// 用于导出的类型
contentList.push(`type AssetsType = typeof Assets`);

contentList.push(`export default Assets;`, `export type { AssetsType };`);

// 如果使用网络资源, 添加网络函数
if (netAssetsServer) {
  contentList.push(`function getStaticReourceImg(assetsPath:string):string{
    const server = '${netAssetsServer}';
    return \`\${server}\${assetsPath}\`
  }`);
}

const fileContent = contentList.join('\r\n\r\n');

FS.writeFileSync(PATH.join(__dirname, 'Assets.ts'), fileContent);

// const login_bg = require('./login/bg.jpg');
