import { useState, useEffect } from 'react'
import { InboxOutlined, SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';
const { Option } = AutoComplete
import { getSuggestList } from 'app_api/metadataApi'
import './index.less'

const SearchTableAutoComplete = (props) => {
    // Declare a new state variable, which we'll call "count"
    const [tableList, setTableList] = useState([])
    const [selectValue, setSelectValue] = useState(props.searchTableValue || undefined)

    const handleSelect = (value, option) => {
        // console.log(value, option)
        let item = option.props.item
        // this.getChartData({
        //     tableId: item.id,
        //     hiddenTempTable: !this.state.hiddenTempTable
        // })

        // this.setState({
        //     selectedId: item.id,
        //     selectValue: value
        // })
        setSelectValue(value)
        props.handleSearchSelect && props.handleSearchSelect(item.id, value, item)
    }

    const handleChane = async (value) => {
        setSelectValue(value)
    }

    const handleSearch = async (value) => {
        console.log(value,'handleSearch')

        // setSelectValue(value)
        let optionsList = []
        let res = {}
        if (props.handleSearchSearch) {
            res = props.handleSearchSearch(value)
        } else {
            res = await getSuggestList({
                query: value,
            })
            if (res.data.length) {
                _.map(res.data, (opt, key) => {
                    let valueString = opt.table
                    if (opt.label) {
                        valueString = valueString + ' (' + opt.label + ')'
                    }
                    let highlightString = opt.tableHighlight
                    if (opt.labelHighlight) {
                        highlightString = highlightString + ' (' + opt.labelHighlight + ')'
                    }
                    optionsList.push(
                        <Option key={opt.id} value={valueString} item={opt}>
                            <div className='auto-input-search-item' >
                            <span className='auto-input-search-item-desc' dangerouslySetInnerHTML={{ __html: highlightString }}>
                            </span>
                                <span className='auto-input-search-item-count'>{opt.datasource} {opt.database}</span>
                            </div>
                        </Option>
                    )
                })
            } else {
                optionsList.push(
                    <Option key="1" disabled={true}>
                        <div className='auto-input-search-item' style={{ display: 'block', textAlign: 'center',padding: '15px'}}>
                            <InboxOutlined style={{ fontSize: '42px', color: '#f2f2f2' }} />
                            <br/>
                            暂无数据
                        </div>
                    </Option>
                )
            }
        }

        setTableList(optionsList)

    }

    useEffect(() => {
        setSelectValue(props.searchTableValue)
    }, [props.searchTableValue])

    return (
        <AutoComplete
            allowClear
            // size='large'
            value={selectValue}
            style={props.style ? { width: '100%', ...props.style } : { width: '100%' }}
            dataSource={tableList}
            onSelect={handleSelect}
            onSearch={handleSearch}
            onChange={handleChane}
            optionLabelProp='value'
            placeholder='请输入表中文名或英文名'
            {
            ...props.attrs
            }
        >
            <Input suffix={<SearchOutlined className='certain-category-icon' />} />
        </AutoComplete>
    );
}

export default SearchTableAutoComplete