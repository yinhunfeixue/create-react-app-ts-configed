import CollapseLabel from '@/component/collapseLabel/CollapseLabel';
import DrawerLayout from '@/component/layout/DrawerLayout';
import RenderUtil from '@/utils/RenderUtil';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Tag, Tooltip, Modal, Divider } from 'antd';
import { dataSecurityLevelList } from 'app_api/dataSecurity';
import React, { Component } from 'react';
import { ListHorizontal } from 'cps';
import '../index.less';


export default class CategoryDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
                featureConfiguration: []
            },
            levelList: [],
        }
    }
    openModal = (data) => {
        data.featureConfiguration = data.featureConfiguration == undefined ? [] : data.featureConfiguration
        console.log('openModal', data, this.props);
        this.setState({
            modalVisible: true,
            detailInfo: data
        })
        //this.getDataSecurityLevelList()
        // this.modalCollapseLabel&&this.modalCollapseLabel.getVisibleBtn()
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    getDataSecurityLevelList = async () => {
        let res = await dataSecurityLevelList()
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = parseInt(item.id)
            })
            this.setState({
                levelList: res.data
            })
        }
    }
    renderDesc = (value, name) => {
        return <CollapseLabel ref={(dom) => (this[name] = dom)} value={value}/>
    }
    getLevelDesc = (value) => {
        let { levelList } = this.state
        for (let i=0;i<levelList.length;i++) {
            if (levelList[i].id == value) {
                return levelList[i].name
            }
        }
    }
    render() {
        const {
            modalVisible,
            detailInfo,
        } = this.state
        const { type } = this.props;
        console.log('detailInfo', detailInfo);
        return (
            <Modal
                visible={modalVisible}
                title="详情"
                onCancel={this.cancel}
                footer={null}
                wrapClassName="classifyModal"
            >
                <div className='classifyDetail'>
                    <div className='header'>
                        <p className="title">
                            <span className={`iconfont icon-wenjian1 ${detailInfo.businessTag == 3 && type === 'dataWare' ? 'business3' : ''}`} />
                            {detailInfo.name || ''}
                            { !detailInfo.attributionCompletion && <span className='mark'>业务信息待完善</span> }
                        </p>
                        <p className='desc'>描述：{detailInfo.description || '-'}</p>
                    </div>
                    <Divider type="horizontal" style={{ margin: '16px 0 24px 0' }} />
                    {
                        type === 'dataWare' && (
                            <React.Fragment>
                                <h3>基本信息</h3>
                                <ListHorizontal style={{ margin: '16px 0 12px 0' }} label="英文名" value={detailInfo.englishName} />
                                <ListHorizontal style={{ marginBottom: 36 }} label="英文名简称" value={detailInfo.code} />
                            </React.Fragment>
                        )
                    }
                    {
                        (type !== 'dataWare' || (type === 'dataWare' && detailInfo.businessTag !== 3)) && (
                            <React.Fragment>
                                <h3>业务信息</h3>
                                <ListHorizontal style={{ margin: '16px 0 12px 0' }} label="业务归属部门" value={detailInfo.businessDepartment} />
                                <ListHorizontal style={{ marginBottom: 0 }} label="业务负责人" value={`${detailInfo.businessManager || ''}${detailInfo.businessManagerAccount ? `（${detailInfo.businessManagerAccount || ''}）` : ''}`} />
                            </React.Fragment>
                       )
                    }
                </div>
            </Modal>
        );
    }
}