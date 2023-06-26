import React from 'react'
import {Table} from 'antd';

//股基交易信息概览
const  columns_stock_based = [{
          title: '指标名称',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: '指标值(万元)',
          dataIndex: 'detailed',
          key: 'detailed',
        }, {
          title: '同比',
          dataIndex: 'erlier',
          key: 'erlier',
        }];
const dataSource_stock_based = [{
          key: '1',
          name: '全国股基总市值',
          detailed: '334,455,599',
          erlier: <span className="anticon-upp"><i className='anticon anticon-caret-up'></i> 1.52% </span>
        }, {
          key: '2',
          name: '公司股基总市值',
          detailed: '334,455,599',
          erlier: <span className="anticon-downn"><i className='anticon anticon-caret-down'></i> 0.65% </span>
        }, {
          key: '3',
          name: <span>公司股基交易<br/>额市场占有率</span>,
          detailed: '0.67%',
          erlier: <span className="anticon-downn"><i className='anticon anticon-caret-down'></i> 0.65% </span>
       }, {
         key: '4',
         name: '公司股基总市值',
         detailed: '334,455,599',
         erlier: <span className="anticon-upp"><i className='anticon anticon-caret-up'></i> 0.65% </span>
       }, {
         key: '05',
         name: '公司股基总市值',
         detailed: '334,455,599',
         erlier: <span className="anticon-downn"><i className='anticon anticon-caret-down'></i> 0.65% </span>
       }, {
         key: '06',
         name: '公司股基总市值',
         detailed: '334,455,599',
         erlier: <span className="anticon-downn"><i className='anticon anticon-caret-down'></i> 0.65% </span>
       }, {
         key: '07',
         name: '公司股基总市值',
         detailed: '334,455,599',
         erlier: <span className="anticon-downn"><i className='anticon anticon-caret-down'></i> 0.65% </span>
       }, {
         key: '08',
         name: '公司股基总市值',
         detailed: '334,455,599',
         erlier: <span className="anticon-upp"><i className='anticon anticon-caret-up'></i> 0.65% </span>
       }, {
         key: '09',
         name: '公司股基总市值',
         detailed: '334,455,599',
         erlier: <span className="anticon-downn"><i className='anticon anticon-caret-down'></i> 0.65% </span>
       }, {
         key: '10',
         name: '公司股基总市值',
         detailed: '334,455,599',
         erlier: <span className="anticon-upp"><i className='anticon anticon-caret-up'></i> 0.65% </span>
       }, {
         key: '11',
         name: '公司股基总市值',
         detailed: '334,455,599',
         erlier: <span className="anticon-downn"><i className='anticon anticon-caret-down'></i> 0.65% </span>
       }, {
         key: '12',
         name: '公司股基总市值',
         detailed: '334,455,599',
         erlier: <span className="anticon-upp"><i className='anticon anticon-caret-up'></i> 0.65% </span>
       }];

const JfTable = (props) => {
    return (

        <div className="table_stock_based">
            <Table columns={columns_stock_based} dataSource={dataSource_stock_based} pagination={false} scroll={{ y: 340 }} />
        </div>

    )
}

export default JfTable
