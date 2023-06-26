import { Alert, Button, message, Steps } from 'antd'
import { initializeNextStep, initializeProgress } from 'app_api/dataWarehouse'
import { templateDownload } from 'app_api/metadataApi'
import Cache from 'app_utils/cache'
import React, { Component } from 'react'
import './style.less'

const { Step } = Steps

export default class WareHoseWelcome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            current: 0,
            canNextStep: false,
            complete: false,
            tips: false,
            loading: false,
        }
    }
    componentDidMount = () => {
        console.log(this.props.location.state, 'location++++++')
        this.init()
    }
    init = async () => {
        let res = await initializeProgress()
        if (res.code == 200) {
            Cache.set('guideInfo', res.data)
            this.setState({
                canNextStep: res.data.canNextStep,
                complete: res.data.complete,
                current: res.data.step - 1,
                tips: res.data.tips,
            })
        }
    }
    next = async () => {
        let res = await initializeNextStep()
        if (res.code == 200) {
            this.init()
        }
    }
    start = async () => {
        this.setState({ loading: true })
        let res = await initializeNextStep()
        this.setState({ loading: false })
        if (res.code == 200) {
            // this.props.removeTab('引导页')
            this.props.addTab('首页')
        }
    }
    downloadRoot = async () => {
        let res = await templateDownload()
    }
    downLoadStandard = () => {
        const url = '../../../../resources/template/standardAcquisitionTemplate.zip'
        window.open(url, '_self')
    }
    render() {
        const { current, canNextStep, complete, tips, loading } = this.state
        return (
            <div className='guideContainer'>
                <div className='guideItem' style={{ height: 128, padding: '6px 91px' }}>
                    <div className='guideTitle'>欢迎使用量之数据仓库管理工具</div>
                    <div className='guidePic'>
                        <img src={require('app_images/home/guidePic.png')} />
                    </div>
                </div>
                <div style={{ margin: '56px 0 16px 0', fontSize: '16px', color: '#333' }}>初始化配置</div>
                <div className='guideItem' style={{ padding: '40px 91px 16px 60px' }}>
                    <div style={{ marginBottom: 80, padding: '0 30px' }}>
                        <Steps size='small' current={current}>
                            <Step title='元数据采集' />
                            <Step title='数仓层级配置' />
                            <Step title='血缘关系采集' />
                            <Step title='治理活动准备' />
                        </Steps>
                    </div>
                    {current == 0 ? (
                        <div className='stepContent'>
                            <div className='contentTitle'>数仓元数据采集</div>
                            <div className='contentValue'>
                                第一步：进入<a onClick={() => this.props.addTab('数据源管理')}>“数据源管理”</a>，新建数据源，建立数据源连接关系
                            </div>
                            <div className='contentValue'>
                                第二步：进入<a onClick={() => this.props.addTab('autoTask')}>“自动采集”</a>，在采集任务里可以配置采集任务类型和采集的调度周期
                            </div>
                            {tips ? (
                                <Alert
                                    closable
                                    style={{ margin: '24px 0 90px 0' }}
                                    message='帮助信息'
                                    description='整个数据采集过程需要些时间，采集完成后，才能进行数仓层级配置，您可以在“自动采集”中查看任务状态。'
                                    type='info'
                                    showIcon
                                />
                            ) : null}
                            {/*<div className='contentValue' style={{ marginTop: 130 }}>相关帮助文档<a onClick={() => this.props.addTab('标签映射')} style={{ marginLeft: 24 }}>标签映射</a></div>*/}
                        </div>
                    ) : null}
                    {current == 1 ? (
                        <div className='stepContent'>
                            <div className='contentValue' style={{ marginBottom: 32 }}>
                                系统已为您预设了数据仓库分层结构，您可以对预设的分层结构进行修改，<a onClick={() => this.props.addTab('数仓层级设置')}>查看数仓分层结构</a>。
                            </div>
                            <div className='contentTitle'>修改数仓分层分方法</div>
                            <div className='contentValue'>
                                第一步：进入<a onClick={() => this.props.addTab('标签管理')}>“标签管理”</a>，添加新的分层标签内容，为减少对系统计算的影响，请禁用不需要的标签。
                            </div>
                            <div className='contentValue'>
                                第二步：进入<a onClick={() => this.props.addTab('数仓层级设置')}>“数仓分层结构管理”</a>，设置新的分层结构。
                            </div>
                            <div className='contentValue'>
                                第三步：进入<a onClick={() => this.props.addTab('标签映射')}>“标签服务”</a>，在采集的元数据的数据库上添加分层标签。
                            </div>
                        </div>
                    ) : null}
                    {current == 2 ? (
                        <div className='stepContent'>
                            <div className='contentValue' style={{ marginBottom: 32 }}>
                                量之数据治理服务中包含诸多智能化、自动化服务，血缘关系是量之智能化、自动化算法的基础，在开启系统前，建议您尽可能多的收集血缘脚本文件，并上传。
                            </div>
                            <div className='contentTitle'>数仓血缘关系采集</div>
                            <div className='contentValue'>
                                第一步：进入<a onClick={() => this.props.addTab('文件采集')}>“血缘文件采集”</a>，上传血缘脚本文件，系统支持批量上传。
                            </div>
                            <div className='contentValue'>
                                第二步：脚本文件上传后，您可以配置<a onClick={() => this.props.addTab('目录采集')}>“血缘目录采集”</a>任务，实现血缘脚本文件的自动更新。（非必选）
                            </div>
                            {tips ? (
                                <Alert
                                    closable
                                    style={{ margin: '24px 0 90px 0' }}
                                    message='帮助信息'
                                    description='血缘解析需要时间，解析完成后，您将完成整个系统初始化的配置。'
                                    type='info'
                                    showIcon
                                />
                            ) : null}
                            {/*<div className='contentValue' style={{ marginTop: 130 }}>相关帮助文档*/}
                            {/*<a style={{ marginLeft: 24 }} onClick={() => this.props.addTab('血缘任务')}>血缘文件管理</a>*/}
                            {/*<a style={{ marginLeft: 24 }} onClick={() => this.props.addTab('采集任务')}>血缘采集</a>*/}
                            {/*</div>*/}
                        </div>
                    ) : null}
                    {current == 3 ? (
                        <div className='stepContent'>
                            <div className='contentValue' style={{ marginBottom: 32 }}>
                                为了方便您后续的治理活动，也方便系统更好的为您评估数仓当前的规范化建设水平，我们建议您准备以下内容，并上传系统。
                            </div>
                            <div className='contentValue'>
                                1.词根列表 <a onClick={this.downloadRoot}>词根采集模板</a>
                            </div>
                            <div style={{ paddingLeft: 10, fontSize: '14px', margin: '8px 0 18px 0' }}>系统用于：中文名补充推荐、规范性检查、数仓规范性评估</div>
                            <div className='contentValue'>
                                2.标准列表 <a onClick={this.downLoadStandard}>标准采集模板</a>
                            </div>
                            <div style={{ paddingLeft: 10, fontSize: '14px', margin: '8px 0 18px 0' }}>系统用于：智能映射、落标核验、标准化自动改写</div>
                            {/*<div className='contentValue' style={{ marginTop: 130 }}>相关帮助文档<a onClick={() => this.props.addTab('词根库')} style={{ marginLeft: 24 }}>词根</a></div>*/}
                        </div>
                    ) : null}
                    <div style={{ textAlign: 'center', paddingTop: 16 }}>
                        {current == 3 ? (
                            <Button loading={loading} disabled={!canNextStep} type='primary' onClick={this.start}>
                                开始使用
                            </Button>
                        ) : (
                            <Button disabled={!canNextStep} type='primary' onClick={this.next}>
                                下一步
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
