//注释掉即采用默认颜色
//切片颜色字体等的基本配置，特殊配置仍然可以在渲染时加入
const  SliceStyle = {
    /*通用*/
    textColor:'',
    lineColor:'',
    tipTextColor:'',
    tipBackgroundColor:'',
    //系列（饼图中为每一块扇形）
    seriesColor:['#6acafa', '#b7a2e7', '#f0ba4e', '#f88db9', '#71d398', '#8d9df2'],

    /*k线图*/
    //涨、跌
    klineColor:'rgba(241,101,84,0.4)',
    klineColor0:'rgba(130,224,167,0.4)',
    //涨、跌边框色
    klineBorderColor:'rgba(243,159,149,0.6)',
    klineBorderColor0:'rgba(172,241,199,0.9)'

    /*地图*/
};
export default SliceStyle;
