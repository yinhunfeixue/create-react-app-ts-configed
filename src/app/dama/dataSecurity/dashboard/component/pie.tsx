import React, { useEffect, useRef } from 'react';

import * as echarts from 'echarts';
import { debounce } from 'lodash';

export default function PieChart (props: React.PropsWithChildren<{
  elementId: string,
  options: Record<string, any>,
  height?: number,
  data?: Record<string, any>,
  configInfo?: Record<string, any>
}>) {

  const { elementId, options, height = 200, configInfo = {}, data = {} } = props;

  const ref = useRef<{
    myChart: any,
    option: any,
    timer?: any,
    play?: boolean,
    currentIndex: number,
  }>({myChart: undefined, option: undefined, play: true, currentIndex: -1});

  /* effect */
  useEffect(() => {
    initChart({...options});
    return () => {
      clearInterval(ref.current.timer)
    }
  }, [JSON.stringify(options), JSON.stringify(configInfo)])

  const initChart = (option: Record<string, any>) => {

    const myChart = echarts.init(document.getElementById(elementId) as HTMLElement);
    
    const options = {
      // 列表页配置tooltip
      ...( configInfo.seriesInfo ? {
        tooltip: {
          trigger: 'item',
          formatter: '{b}：{d}%'
        },
      } : {} ),
      // 列表页配置legend
      ...( configInfo.seriesInfo? {
        legend: {
          show: false
        },
      } : {} ),
      // 列表页配置series
      ...( configInfo.seriesInfo? {
        series: [
          ...configInfo.seriesInfo
        ]
      } : {} ),
      // 详情页配置lseries
      ...( configInfo.seriesInfo? {} : option ),
      color: ['#40BFF6', '#3A9DFF', '#F7C739', '#76DEE2', '#42D0D5', '#40BFF6']
    }

    myChart.setOption(options);

    ref.current.myChart = myChart;
    ref.current.option = options;

    autoPlay();
    listen();
  }

  const autoPlay = () => {
    const myChart = ref.current.myChart;
    const option = ref.current.option;
    // 每次轮播前，取消之前定时.保证没有泄漏
    if(ref.current.timer) {
      clearInterval(ref.current.timer);
      ref.current.timer = null;
    }
    ref.current.timer = setInterval(function() {
      var dataLen = option.series[0].data.length;
      // 取消之前高亮的图形
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: ref.current.currentIndex
      });
      ref.current.currentIndex = (ref.current.currentIndex + 1) % dataLen;
      // 高亮当前图形
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: ref.current.currentIndex
      });
      // 显示 tooltip
    }, 2000);

  }

  const listen = () => {

    const myChart = ref.current.myChart;
    // 图例开关的行为只会触发 legendselectchanged 事件
    myChart.on('mouseover',  function(params: any) {
      if(!params.event.target.hasOwnProperty("shape")) return
      if(ref.current.currentIndex !== params.dataIndex){
           // 取消之前高亮的图形
        myChart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: ref.current.currentIndex
        });
      }
      // 获取点击图例的选中状态
      ref.current.play = false;
      clearInterval(ref.current.timer);
      ref.current.timer = null;
    });
    myChart.on('mouseout', function(params: any) {
      if(!params.event.target.hasOwnProperty("shape")) return
      // 获取点击图例的选中状态
      ref.current.play = true;
      if(!ref.current.timer) {
        myChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: ref.current.currentIndex
        });
        autoPlay();
      }
    });

  }

  return (
    <div style={{ height: height }} id={elementId}></div>
  )
}