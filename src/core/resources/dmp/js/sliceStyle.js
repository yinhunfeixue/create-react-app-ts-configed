//注释掉即采用默认颜色
//切片颜色字体等的基本配置，特殊配置仍然可以在渲染时加入
const  SliceStyle = {
    /*通用*/
    //文字颜色
    textColor:'#333',
    //双坐标系标题颜色
    titleColor:'#7d919e',
    //线条颜色
    lineColor:'#666',
    //提示条文字颜色
    tipTextColor:'#fff',
    //提示条背景色
    tipBackgroundColor:'',
    //系列（饼图中为每一块扇形）
    seriesColor:['#6acafa', '#b7a2e7', '#f0ba4e', '#f88db9', '#71d398', '#8d9df2'],
    //图例关闭颜色
    legendInactiveColor:'#7d7996',
    //x、y轴分隔线颜色，多个颜色表示间隔显示
    xAxisSplitLineColor:['#eee'],
    yAxisSplitLineColor:['#eee'],
    angleAxisSplitLineColor:['#999'],
    //轴名称颜色
    axisNameColor:'#7d919e',
    //视觉映射组件颜色（根据数据渐变）
    visualMapColor:['lightskyblue','#3d9bfd'],

    /*k线图*/
    //涨、跌
    klineColor:'rgba(241,101,84,0.4)',
    klineColor0:'rgba(130,224,167,0.4)',
    //涨、跌边框色
    klineBorderColor:'rgba(243,159,149,0.6)',
    klineBorderColor0:'rgba(172,241,199,0.9)',

    /*地图*/
    //气泡选中颜色
    mapScatterSelectedColor:'#ff0000',
    //气泡默认颜色
    mapScatterColor:'#ffa845',
    //地图视觉映射组件颜色
    mapVisualMapColor:['#3d9bfd','lightskyblue'],
    //气泡数据上升
    mapScatterUpColor:'#ed514c',
    //气泡数据下降
    mapScatterDownColor:'#81f8b1',
    //缩放按钮打开颜色
    scaleBtnOnColor:'#74c4f5',
    //缩放按钮关闭颜色
    scaleBtnOffColor:'#999',

    /*柱状图*/
    //上升下降符号的颜色（参：经分系统）
    barUpColor:'#ff4f4f',
    barDownColor:'#08ecb1',

    /*环形图ringpie*/
    //非主要部分环的颜色（高亮颜色）
    ringPiePlaceHolderColor:'#eee',
    ringPiePlaceHolderEmphasisColor:'#95aad3',

    /*血缘关系图relationGraph*/
    //中心点颜色
    relationGraphCenterNodeColor:'#106bff',
    //非中心点颜色
    relationGraphNodeColor:'#fff',
    // 选中点边的颜色
    relationGraphSelectedBorderColor:'#ffa442',
};
export default SliceStyle;
