import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';
import React, { useEffect, useRef } from 'react';

interface IPage1Props {}

const DATA = {
  nodes: [
    {
      name: '首次打开',
    },
    {
      name: '结果页',
    },
    {
      name: '验证页',
    },
    {
      name: '我的',
    },
    {
      name: '朋友',
    },
    {
      name: '其他来源',
    },
    {
      name: '首页 UV',
    },
    {
      name: '我的',
    },
    {
      name: '扫一扫',
    },
    {
      name: '服务',
    },
    {
      name: '蚂蚁森林',
    },
    {
      name: '跳失',
    },
    {
      name: '借呗',
    },
    {
      name: '花呗',
    },
    {
      name: '其他流向',
    },
  ],
  links: [
    {
      source: 0,
      target: 6,
      value: 160,
      state: '0',
    },
    {
      source: 1,
      target: 6,
      value: 40,
    },
    {
      source: 2,
      target: 6,
      value: 10,
    },
    {
      source: 3,
      target: 6,
      value: 10,
    },
    {
      source: 4,
      target: 6,
      value: 8,
    },
    {
      source: 5,
      target: 6,
      value: 27,
    },
    {
      source: 6,
      target: 7,
      value: 30,
    },
    {
      source: 6,
      target: 8,
      value: 40,
    },
    {
      source: 0,
      target: 9,
      value: 35,
    },
    {
      source: 6,
      target: 10,
      value: 25,
    },
    {
      source: 6,
      target: 11,
      value: 10,
    },
    {
      source: 6,
      target: 12,
      value: 30,
    },
    {
      source: 6,
      target: 13,
      value: 40,
    },
    {
      source: 6,
      target: 14,
      value: 45,
    },
  ],
};

const Page1: React.FC<IPage1Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  let chartRef = useRef<Chart>();

  const initChart = () => {
    const ds = new DataSet();
    const dv = ds.createView().source(DATA, {
      type: 'graph',
      edges: (d) => d.links,
    });

    dv.transform({
      type: 'diagram.sankey',
      // nodeWidth: 0.05,
      // nodePadding: 0.03,
      sort: (a, b) => {
        if (a.value > b.value) {
          return 0;
        } else if (a.value < b.value) {
          return -1;
        }
        return 0;
      },
    });

    const edges = dv.edges.map((edge) => {
      return {
        source: edge.source.name,
        target: edge.target.name,
        name:
          edge.source.name === '首页 UV' ? edge.target.name : edge.source.name,
        x: edge.x,
        y: edge.y,
        value: edge.value,
        state: edge.state,
      };
    });

    const nodes = dv.nodes.map((node) => {
      return {
        x: node.x,
        y: node.y,
        name: node.name,
      };
    });

    if (!ref.current) {
      return;
    }
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const chart = new Chart({
      container: ref.current,
      autoFit: true,
      height: 500,
      appendPadding: 16,
      syncViewPadding: true,
    });

    chartRef.current = chart;

    chart.on('mousedown', (...args: any) => {
      console.log('mousedown1', ...args);
    });

    // chart.legend(false);

    chart.tooltip({
      showTitle: false,
      showMarkers: false,
    });

    // chart.axis(false);

    chart.scale({
      x: { sync: true, nice: true },
      y: { sync: true, nice: true },
      source: { sync: 'color' },
      name: { sync: 'color' },
    });

    // node view
    const nodeView = chart.createView();
    nodeView.data(nodes);

    nodeView
      .polygon()
      .position('x*y') // nodes数据的x、y由layout方法计算得出
      .color('name')
      .label('x*name', (x, name) => {
        const isLast = x[1] === 1;
        return {
          style: {
            fill: '#545454',
            textAlign: isLast ? 'end' : 'start',
          },
          offsetX: isLast ? -8 : 8,
          content: name,
        };
      })
      .tooltip(false)
      .style('name', (name) => {
        if (name === '跳失') {
          return {
            fill: '#FF6010',
            stroke: '#FF6010',
          };
        }
        if (name === '首页 UV') {
          return {
            fill: 'red',
            stroke: '#5D7092',
          };
        }
        return {
          outerWidth: 100,
        };
      });

    // edge view
    const edgeView = chart.createView();
    edgeView.data(edges);
    edgeView
      .edge()
      .position('x*y')
      .shape('arc')
      .color('name')
      .tooltip('target*source*value', (target, source, value) => {
        return {
          name: source + ' to ' + target,
          value,
        };
      })
      .style('source*target*state', (source, target, state) => {
        if (state === '0') {
          return {
            lineWidth: 0,
            opacity: 0.4,
            fill: 'red',
            stroke: '#ff6666',
          };
        }
        if (source.includes('其他') || target.includes('其他')) {
          return {
            lineWidth: 0,
            opacity: 0.4,
            fill: '#CCC',
            stroke: '#CCC',
          };
        }

        if (target === '跳失') {
          return {
            lineWidth: 0,
            opacity: 0.4,
            fill: 'l(0) 0:#FFBB9E 0.2:#FFC8B4 1:#FFFCF2',
            stroke: 'l(0) 0:#FFBB9E 0.2:#FFC8B4 1:#FFFCF2',
          };
        }

        return {
          opacity: 0.4,
          lineWidth: 0,
        };
      })
      .state({
        active: {
          style: {
            opacity: 0.8,
            lineWidth: 0,
          },
        },
        inactive: {
          style: {
            opacity: 0.1,
          },
        },
      });

    chart.interaction('element-active');

    chart.render();

    setTimeout(() => {
      updateElementState();
    }, 3000);

    const updateElementState = () => {
      const elementList = edgeView.getElements();

      elementList.forEach((item) => {
        const data = item.getData();
        console.log('data', data);

        if (data.source === '首次打开' || data.target === '首次打开1.5') {
          item.setState('active', true);
        } else {
          item.setState('inactive', true);
        }
      });
    };
  };

  useEffect(() => {
    initChart();
  }, []);

  return (
    <div
      ref={ref}
      style={{ width: 800, height: 400, border: '1px solid red' }}
    ></div>
  );
};
export default Page1;
