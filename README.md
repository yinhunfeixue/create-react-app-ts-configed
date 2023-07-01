# 基于 create-react-app 的官网类项目脚手架

因为公司大部分项目基于 antd pro，打包的文件过大，用于官网类项目不太合适。综合官
网项目的以下需求

- 体积
- 任意链接可单独打开
- 项目开发注释不清的问题。

基于 createReactApp 配置一个脚手架，主要要求如下

1. 模块的初始参数都从 Url 中获取，不使用 redux 持久化数据，便于分享链接
1. 代码分割，减小单个页面的体积
1. 公共组件打包成单独的 vendor 文件，
1. 强制类必须有注释
1. 尽量使用用户量大的第三方库，一定需要自定义的，代码尽量简单。如果换人也方便维
   护

## 概述

### 配置变动

1. 公共模块打包成单独的文件，当项目代码修改时，公共代码不用重新加载
1. 可配置打包时是否生成 souceMap 文件
1. less 支持
1. css 模块化，使用 styles.aa 引用 css
1. 添加修饰符支持，例如@Form.create()
1. eslint 配置常规要求，并要求类必须有注释
1. antd 组件库的配置

### 功能

1. 模块分割，并支持禁用模块分割
1. 路由配置函数及示例代码
1. 使用 url 传参，以便分享链接时，能获取到完整参数
1. 提供跳转的方法，方法可传入 hash 路径及参数
1. 代理配置并提供示例代码
1. 默认引入 axios
1. 提供网络请求默认配置

## 项目结构

.env——环境变量配置

.babelrc——babel 配置

.eslintrc.js———eslint 配置

src/

...components/Async.js——异步模块组件，**勿修改**

...config/RouterConfig.jsx--路由配置文件，文件请勿删除，里面的代码**可修改内部代
码**

...pages--模块，文件夹中文件为示例文件，可**全部删除**

...proxy/ProxySetting.js--网络代理配置，文件内容**可根据实际需要修改**

...utils/UrlUtil.js--提供链接跳转功能，**勿修改**

...App.js--主程序，可**根据需要修改**

## 模块创建

模块建议放在 src/pages 目录下，无特别要求，普通的 react 组件即可

## 布局配置

修改`src\config\RouteConfig.tsx`的`layout`变量

- tab--选项卡布局，此时浏览器 Url 不会变化

* basic--基础布局

## 路由配置

路由配置位于`src/config/RouterConfig.jsx`中，格式有两种

**代码分割为独立文件的模块**

```
 <Route
  path="/page1"
  exact
  component={async(() => import('../pages/Page1'))}
 />
```

**打包到主文件的模块**

```
import Page1 from '../pages/Page1';

<Route path="/page1" exact component={Page1} />
```

## 开发环境代理配置

在 [./setupProxy.js](./src/setupProxy.js) 的`pathList`变量中，增加字符串，即可新增本机代理

## 路径跳转

路径跳转，支持通过对象的方法设置参数，跳转方法位于`src/utils/UrlUtil.js`中

给 a 标签设置 href 属性，使用`UrlUtil.getUrl(路由, 可选参数)`，例如

```
//不带参数
UrlUtil.getUrl('page1')

//携带参数
UrlUtil.getUrl('page1', {x:1})
```

直接跳转，使用`UrlUtil.toUrl(路由, 可选参数)`，参数功能和`UrlUtil.getUrl`相同

## 在模块中获取 URL 参数

模块中的`this.props.query`属性表示当前携带的参数对象，仅在模块中有效。

如需在任意组件获取 url 中的参数，可使用如下代码

```
const URL = require('url');

URL.parse(this.props.location.search, true).query
```

## 网络请求配置

配置位于`src/proxy/ProxySetting.js`中，默认配置为

- 请求携带使用 cookie
- 远程根路径和当前页面路径一致
- 请求数据为 json 格式
- 提供了全局的响应成功拦截器（`successHandler`）和响应失败拦截器
  （`errorHandler`），一些失败的请求，可在此处处理。例如，当返回码是 0 表示失败
  ，可以在`successHandler`中检查响应码，如果失败，直接显示错误信息，并返
  回`return new Promise(() => { });`，则请求响应不会再进入模块中

其它内容可参考 axios 官网，https://www.npmjs.com/package/axios

## 其它配置
### 禁用代码分割

禁用代码分割后，在`.babelrc`中添加`dynamic-import-node`插件，如下

```
{
  "plugins": [
    [
    "dynamic-import-node"
  ]
}
```

### 生产环境打包时，生成 sourceMap 文件

在`.env`文件中，设置`GENERATE_SOURCEMAP=true`。
默认为 false，表示不生成 sourceMap 文件

安装依赖

```
npm i axios h5-webview antd react-router @ant-design/icons fb-project-component path-to-regexp react-router-dom babel-plugin-import url http-proxy-middleware --save
```


# 开发

## 代码片段

-   `newEnum`- ts 枚举
-   `newInterface`- ts 接口
-   `newCom`- ts + react 类组件
-   `newPage`- ts + react 类页面
-   `newClass`- 类
-   `newHooks`- ts + react hooks

## 图片素材

### require 图片

1. 图片添加到 [src/assets](./src/assets)
2. 执行 `npm run assets`，此时，会**自动生成**[\*\*Assets.ts](./src/Assets.ts)，并 require 上述目录的所有图片
3. 调用 `Assets.图片相对src/assets的路径`，示例：

```jsx
// src/assets/icon/a.png
<img src={Assets.icon_a} />
```

### 静态素材

放到 [public](./public)，使用相对 html 的路径，示例:

```html
<!-- public/a/a1.png -->
<img src="/a/a1.png" />
```

## 代码格式化

1. 使用 vscode 开发
2. 安装 Prettier 插件

> 此时，保存时，会**自动格式化**。
> 且所有人保持相同的格式化规则，避免因格式化引起的冲突

## css

-   `*.less` - 普通 less。建议 **通用组件** 使用，使用组件时，可以覆盖样式
-   `*.module.less` - 支持 css module 的 less 文件。建议 **页面文件** 中使用，避免样式冲突

## 开发代理配置

在 [./setupProxy.js](./src/setupProxy.js) 的`pathList`变量中，增加字符串，即可新增本机代理
