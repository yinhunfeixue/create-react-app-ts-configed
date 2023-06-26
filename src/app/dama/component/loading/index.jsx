import { Table, Row, Col, Card, Select, Spin } from 'antd'
import './index.less'

const DataLoading = () => {
    return (
        <div className='bk-app-loading-indicator'>
            <div className='load-wrap'>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
            </div>
        </div>
    )
}

export default DataLoading
