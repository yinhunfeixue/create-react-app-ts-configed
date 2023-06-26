import React, { useCallback, useEffect, useState } from "react";
import { Form, Tag, Steps, Input, Radio, Checkbox, InputNumber, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import DataSource from './dataSource';
import { createTrustDataSource, readTrustDataSourceConfig } from '@/api/trustData';

import style from './form.lees';
import classNames from "classnames";

const Error: React.FC<{
  content: string,
  show: boolean,
}> = props => {
  const { content = '', show } = props;
  return  show ? (
    <span className={style.errorTips}>{content}</span>
  ) : null
}

export default function(props: React.PropsWithChildren<{
  form: { submit: () => Promise<string>|void },
}>) {
  const { form } = props;
  /* state */
  const [tags, setTags] = useState<any[]>([]);
  const [dataSourceVisible, setDataSourceVisible] = useState(false);
  const [count, setCount] = useState<number>(0);

  // 数据使用情况
  const [useValue, setUseValue] = useState<any[]>([1]);
  // 数据质量
  const [qualityDay, setQualityDay] = useState<any>(7);
  const [qualityValue, setQualityValue] = useState<any>(1);
  const [qualityPass, setQualityPass] = useState<any>(100);
  const [qualityError, setQualityError] = useState<any>(5);
  // 元数据质量
  const [metaValue, setMetaValue] = useState<any[]>([]);
  const [metaCnValue, setMetaCnValue] = useState<any>(100);
  // 数据确权
  const [confirmValue, setConfirmValue] = useState<any[]>([]);

  useEffect(() => {
    // 查询默认配置
    readTrustDataSourceConfig().then(res => {
      if(res.code !== 200) {
        message.error(res.msg || '获取配置异常');
        return;
      }
      const { data = {} } = res || {};
      // 数据源
      setTags(data.datasourceIds || []);
      // 数据使用情况
      if(data.dataUserItem){
        setUseValue( data.dataUserItem == 3 ? [1,2] : [data.dataUserItem*1] )
      }
      // 数据确权
      if(data.dataConfirmItem){
        setConfirmValue( data.dataConfirmItem == 3 ? [1,2] : [data.dataConfirmItem*1] )
      }
      // 数据质量
      data.qualityRange && setQualityDay( data.qualityRange )
      data.checkResultItem && setQualityValue( data.checkResultItem )
      if(data.checkResultItem == 1) {
        data.checkResultValue && setQualityPass(data.checkResultValue)
      } else {
        (data.checkResultValue || data.checkResultValue === 0) && setQualityError(data.checkResultValue)
      }
      // 元数据质量
      if (data.metaDataQualityItem != 0) {
        setMetaValue( data.metaDataQualityItem == 3 ? [1,2] : [data.metaDataQualityItem*1] );
        if(data.metaDataQualityItem == 1 || data.metaDataQualityItem == 3) {
          setMetaCnValue(data.chnCompleteRatio)
        }
      }
    })
  }, [])

  useEffect(() => {
    form.submit = submit;
  })

  /* action */
  const openDataSourceModal = () => {
    setCount(c => c+ 1)
    setDataSourceVisible(true);
  }
  const closeDataSourceModal = () => {
    setDataSourceVisible(false);
  }

  const submit = (): Promise<string>|void => {
    console.log('submit');
    // 数据使用情况
    if(useValue.length <= 0) {
      message.warn('数据使用情况不能为空');
      return Promise.resolve('block');
    }
    // 数据质量
    if(!qualityDay) {
      message.warn('质量管控范围不能为空');
      return Promise.resolve('block');
    }
    if(qualityDay > 30) {
      message.warn('质量管控范围数值 1~30 之间整数')
      return Promise.resolve('block');
    }
    if (qualityValue == 1 && (!qualityPass)) {
      message.warn('规则通过率不能为空');
      return Promise.resolve('block');
    }
    if (qualityValue == 1 && (qualityPass<80 || qualityPass > 100)) {
      message.warn('规则通过率数值 80~100 之间整数')
      return Promise.resolve('block');
    }
    if (qualityValue == 2 && (!qualityError && qualityError !== 0)) {
      message.warn('平均错误率不能为空');
      return Promise.resolve('block');
    }
    if (qualityValue == 2 && (qualityError>25)) {
      message.warn('平均错误率数值 0~25 之间整数')
      return Promise.resolve('block');
    }
    // 元数据质量非必填
    if (metaValue.includes(1) && !metaCnValue) {
      message.warn('中文完整度不能为空');
      return Promise.resolve('block');
    }
    if (metaValue.includes(1) && metaCnValue < 80 || metaCnValue > 100) {
      message.warn('中文完整度数值 80~100 之间整数');
      return Promise.resolve('block');
    }

    // 组装数据
    const postData = {
      // 数据源
      datasourceIds: tags,
      // 数据使用情况
      dataUserItem: useValue.length == 2 ? 3 : useValue[0],
      // 数据质量
      checkResultItem: qualityValue,
      checkResultValue: qualityValue == 1 ? qualityPass : qualityError,
      qualityRange: qualityDay,
      // 元数据质量
      metaDataQualityItem: metaValue.length == 2 ? 3 : metaValue.length == 0 ? 0 : metaValue[0],
      chnCompleteRatio: metaValue.includes(1) ? metaCnValue : '',
      // 数据确权
      dataConfirmItem: confirmValue.length == 2 ? 3 : confirmValue[0] || 0,
    }
    return createTrustDataSource(postData).then(res => {
      if(res.code == 200) {
        message.success('保存成功');
        return Promise.resolve('success');
      } else {
        message.error(res.msg || '保存失败');
        return Promise.resolve('error');
      }
    }).catch(err => {
      return Promise.resolve('error')
    }).finally(() => {
      return Promise.resolve('error');
    })
  }

  const dataSourceChange = (data: any[]) => {
    setTags([...data]);
  }

  const tagClose = (id: any) => {
    setTags(tags => tags.filter(v => v.id != id));
  }

  return (
    <div className={style.wrap}>
      <section style={{ marginBottom: 23 }}>
        <div className={style.header}>数据来源（{tags.length}）</div>
        <div className={style.headerList}>
          {/* <Tag>默认数据源</Tag> */}
          {
            tags.map(v => (<Tag key={v.id} onClose={() => { tagClose(v.id) }} closable={!v.flag}>{v.name}</Tag>))
          }
          <Tag onClick={openDataSourceModal} className={style.addTag}><PlusOutlined />添加数据源</Tag>
        </div>
      </section>
      <section>
        <div className={style.header}>认证要求</div>
        <Steps direction="vertical" current={0} size="small">
          <Steps.Step icon={<div className={style.stepIcon}>1</div>} title={<>数据的使用情况<span className={style.required}>*</span></>} description={
            <>
              <div className={style.use}>
                <Checkbox.Group value={useValue} onChange={values => { setUseValue(values); console.log('values', values) }}>
                  <Checkbox value={1}>报表被应用所使用</Checkbox>
                  <br/>
                  <Checkbox value={2}>存在下游血缘关系</Checkbox>
                </Checkbox.Group>
              </div>
            </>
          }/>
          <Steps.Step icon={<div className={style.stepIcon}>2</div>} title={<>数据质量<span className={style.required}>*</span></>} description={
            <>
              <div className={style.quality}>
                <div className={style.title}>2.1 在质量管控范围内</div>
                <div className={classNames({ [style.validateError]: qualityDay > 30 })}>最近<InputNumber min={1} precision={0}  value={qualityDay} onChange={value => setQualityDay(value)} style={{ width: 120 }} addonAfter="天" />被检核过 <Error show={qualityDay>30} content="数值1~30之间整数" /></div>
              </div>
              <div className={style.quality}>
                <div className={style.title}>2.2 检核结果要求</div>
                <div>
                  <Radio.Group value={qualityValue} onChange={e => setQualityValue(e.target.value)} >
                    <Radio value={1}>
                      <span className={classNames(style.inputGroup, { [style.validateError]: qualityPass < 80 || qualityPass > 100 })}>
                        规则通过率  <InputNumber min={80} precision={0} style={{ display: qualityValue == 1 ? 'block' : 'none' }} value={qualityPass} onChange={value => setQualityPass(value)} addonAfter="%" />
                        <Error show={qualityPass < 80 || qualityPass > 100} content="数值80~100之间整数" />
                      </span>
                    </Radio>
                    <br/>
                    <Radio value={2}>
                      <span className={classNames(style.inputGroup, { [style.validateError]: qualityError > 25 })}>
                        平均错误率 <InputNumber min={0} precision={0} style={{ display: qualityValue == 2 ? 'block' : 'none' }} value={qualityError} onChange={value => setQualityError(value)} addonAfter="%" />
                        <Error show={qualityError > 25} content="数值0~25之间整数" />
                      </span>
                    </Radio>
                  </Radio.Group>
                </div>
              </div>
            </>
          }/>
          <Steps.Step icon={<div className={style.stepIcon}>3</div>} title="元数据质量" description={
            <>
              <div className={style.use}>
                <Checkbox.Group value={metaValue} onChange={values => setMetaValue(values)}>
                  <Checkbox value={1}>
                    <span className={classNames(style.inputGroup, { [style.validateError]: metaCnValue < 80 || metaCnValue > 100 })}>
                      中文完整度<span onClick={e => { e.stopPropagation(); e.preventDefault(); }}><InputNumber min={80} precision={0} style={{ display: metaValue.includes(1) ? 'block' : 'none' }} value={metaCnValue} onChange={value => setMetaCnValue(value)} addonAfter="%" /></span>
                      <Error show={metaCnValue < 80 || metaCnValue > 100} content="数值80~100之间整数" />
                    </span>
                  </Checkbox>
                  <br/>
                  <Checkbox value={2}>
                    <span className={style.inputGroup}>
                      主键完整
                    </span>
                  </Checkbox>
                </Checkbox.Group>
              </div>
            </>
          }/>
          <Steps.Step icon={<div className={style.stepIcon}>4</div>} title="数据确权" description={
            <>
              <div className={style.use}>
                <Checkbox.Group value={confirmValue} onChange={values => setConfirmValue(values)}>
                  <Checkbox value={1}>
                    <span className={style.inputGroup}>
                      技术归属部门 / 技术负责人
                    </span>
                  </Checkbox>
                  <br/>
                  <Checkbox value={2}>
                    <span className={style.inputGroup}>
                      业务归属部门 / 业务负责人
                    </span>
                  </Checkbox>
                </Checkbox.Group>
              </div>
            </>
          }/>
        </Steps>
      </section>
      <DataSource
        key={count}
        visible={dataSourceVisible}
        onCancel={closeDataSourceModal}
        onChange={dataSourceChange}
        values={tags}
      />
    </div>
  )
}
