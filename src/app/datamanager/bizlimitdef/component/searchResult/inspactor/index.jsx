import './index.less'

const TableInspactor = (props) => {
    const { sourceData } = props
    let data = sourceData.inspector
    return (
        <div className='inspector'>
            {
                data.selects && data.selects.length > 0 &&
                <div>
                    <h3 className='inspectorTopic'>展示</h3>
                    <p className='inspectorContent' >
                        {data.selects.join('、')}
                    </p>
                </div>
            }
            {
                data.groupBys && data.groupBys.length > 0 &&
                <div>
                    <h3 className='inspectorTopic'>分组</h3>
                    <p className='inspectorContent'>
                        {
                            data.groupBys.map((value, index) => {
                                return <span key={index} style={{ display: 'block', lineHeight: '22px', overflowWrap: 'break-word' }}>{value}</span>
                            })
                        }
                    </p>
                </div>
            }
            {
                data.joinConditions && data.joinConditions.length > 0 &&
                <div>
                    <h3 className='inspectorTopic'>过滤条件</h3>
                    <p className='inspectorContent'>
                        {
                            data.joinConditions.map((value, index) => {
                                return <span key={index} style={{ display: 'block', lineHeight: '22px', overflowWrap: 'break-word' }}>{value}</span>
                            })
                        }
                    </p>
                </div>
            }
            {
                data.calculations && data.calculations.length > 0 &&
                <div>
                    <h3 className='inspectorTopic'>计算属性</h3>
                    <p className='inspectorContent'>
                        {data.calculations.join('、')}
                    </p>
                </div>
            }
            {
                data.orderBys && data.orderBys.length > 0 &&
                <div>
                    <h3 className='inspectorTopic'>排序</h3>
                    <p className='inspectorContent'>
                        {data.orderBys.join('、')}

                    </p>
                </div>
            }
        </div>
    )
}

export default TableInspactor
