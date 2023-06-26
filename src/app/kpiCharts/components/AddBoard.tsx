import { requestBoardTypeList } from '@/api/kpiChartApi'
import Assets from '@/app/kpiCharts/Assets'
import IBoardType from '@/app/kpiCharts/interface/IBoardType'
import { Anchor } from 'antd'
import classNames from 'classnames'
import React, { Component } from 'react'
import './AddBoard.less'

const { Link } = Anchor

interface IBoardTypeList {
    label: string
    list: IBoardType[]
}

interface IAddBoardState {
    dataSource: IBoardTypeList[]
    selectedTag: string
}
interface IAddBoardProps {
    onSelect: (data: IBoardType) => void
}

/**
 * AddBoard
 */
class AddBoard extends Component<IAddBoardProps, IAddBoardState> {
    private tagList = [
        {
            value: 1,
            label: '元数据',
            list: [],
        },
        {
            value: 2,
            label: '标准',
            list: [],
        },
        {
            value: 3,
            label: '质量',
            list: [],
        },
        {
            value: 4,
            label: '安全',
            list: [],
        },
        {
            value: 5,
            label: '数仓',
            list: [],
        },
    ]

    private scrollerRef = React.createRef<HTMLDivElement>()

    constructor(props: IAddBoardProps) {
        super(props)
        this.state = {
            dataSource: this.tagList,
            selectedTag: '',
        }
    }
    componentDidMount() {
        this.requestData()
    }

    private requestData() {
        this.tagList.forEach((item) => {
            requestBoardTypeList(item.value).then((res) => {
                item.list = res.data
                this.forceUpdate()
            })
        })
    }

    private setSelectedTag(value: string) {
        this.setState({ selectedTag: value })
    }

    render() {
        const { dataSource, selectedTag } = this.state
        const { onSelect } = this.props
        return (
            <div className='AddBoard'>
                <div className='Slider'>
                    {/* 左侧标签 */}
                    <Anchor
                        affix={false}
                        className=' commonScroll'
                        getContainer={() => {
                            return this.scrollerRef.current || document.body
                        }}
                        onChange={(value) => {
                            this.setSelectedTag(value.slice(1))
                        }}
                    >
                        {dataSource.map((groupItem) => {
                            const { label } = groupItem
                            const selected = label === selectedTag
                            return <Link title={label} href={`#${label}`} className={classNames('TypeTag', selected ? 'TypeTagSelected' : '')} key={label} />
                        })}
                    </Anchor>
                </div>
                {/* 右侧分组列表 */}
                <div className='Body commonScroll' ref={this.scrollerRef}>
                    {dataSource.map((groupItem) => {
                        return (
                            <div key={groupItem.label} className='TypeGroup'>
                                <h3 id={`${groupItem.label}`}>{groupItem.label}</h3>
                                <main>
                                    {groupItem.list.map((item) => {
                                        return (
                                            <div
                                                key={item.id}
                                                className='TypeItem'
                                                onClick={() => {
                                                    onSelect(item)
                                                }}
                                            >
                                                <header>
                                                    <img src={Assets[item.iconUrl]} />
                                                    <h4>{item.name}</h4>
                                                </header>
                                                <div className='Des' dangerouslySetInnerHTML={{ __html: item.description }} />
                                            </div>
                                        )
                                    })}
                                </main>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default AddBoard
