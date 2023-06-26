import AutoTip from "@/component/AutoTip";
import EmptyLabel from '@/component/EmptyLabel';
import DrawerLayout from "@/component/layout/DrawerLayout";
import RichTableLayout from "@/component/layout/RichTableLayout";
import SliderLayout from "@/component/layout/SliderLayout";
import ModuleTitle from "@/component/module/ModuleTitle";
import StatusLabel from "@/component/statusLabel/StatusLabel";
import { Alert, Select as AntdSelect, Button, Cascader, Divider, Popover, Progress, Radio, Space, Table, Tabs, Tooltip, message } from 'antd';
import { FormTool, IconLink, ListHorizontal, Section, Select } from 'cps';
import { useAnalizeTheme, useBusinessClassify, useDwTheme, useTablePathData } from 'hooks';
import React, { useRef, useState } from "react";
import { addDou, recursiveByCb } from 'utils';

import { createConfirm, querySystemList, readAllConfirmation, readConfirmBatchDetail, readConfirmList, readConfirmSignleDetail, readSystemCompleted, readSystemDetail } from '@/api/confirmation';
import PermissionWrap from '@/component/PermissionWrap';
import ProjectUtil from '@/utils/ProjectUtil';
import { useCallback, useEffect } from "react";
import style from './index.lees';


const TABLE = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10764" width="16"><path fill='#2D3033' d="M96 160v704h832V160H96z m309.344 400.192v-160h192v160h-192z m192 64V800h-192v-175.808h192zM160 400.192h181.344v160H160v-160z m501.344 0H864v160h-202.656v-160zM864 224v112.192H160V224h704zM160 624.192h181.344V800H160v-175.808zM661.344 800v-175.808H864V800h-202.656z" p-id="10765"></path></svg>
const BASE = <svg  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10918" width="16"><path d="M512 64c206.208 0 374.4 67.776 383.616 152.704L896 224v576c0 88.32-171.904 160-384 160s-384-71.68-384-160v-576C128 135.68 299.904 64 512 64z m0 608c-133.568 0-251.2-28.416-320-71.552V800c0 52.992 143.296 96 320 96s320-43.008 320-96l0.064-199.616C763.264 643.52 645.632 672 512 672z m320.064-359.616C763.264 355.52 645.632 384 512 384c-133.568 0-251.2-28.416-320-71.552L191.936 512H192c0 52.992 143.296 96 320 96s320-43.008 320-96h0.064V312.384zM512 128c-176.704 0-320 43.008-320 96h-0.064H192v0.64l0.448 4.48C201.28 279.68 340.992 320 512 320c176.768 0 320-43.008 320-96S688.832 128 512 128z" fill="#9EA3A8" p-id="10919"></path></svg>

const LINK = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7055" width="16"><path d="M575.634286 545.060571l71.241143-71.241142 25.453714 25.453714 137.508571-137.435429L667.136 219.428571 529.92 356.717714l5.12 10.24-71.314286 71.241143-81.481143-86.528L657.042286 76.8l290.157714 290.157714-274.870857 274.870857L575.634286 545.060571zM438.125714 463.725714l-71.168 71.241143-10.24-10.166857L219.428571 662.162286 361.837714 804.571429l137.435429-137.362286-25.453714-25.453714 71.241142-71.314286 96.768 96.768-274.870857 274.797714L76.8 657.042286l274.870857-274.870857L438.125714 463.725714z m168.009143-132.388571l71.314286 71.314286-274.870857 274.870857-71.241143-71.314286L606.134857 331.337143z" fill="#5B7FA3" p-id="7056"></path></svg>

const delay = (cb: () => void) => {
  setTimeout(cb, 1000);
}

console.log('select all', Table.SELECTION_ALL);

const statusMap = [
  { text: '未确权', icon: 'minus', value: 0 },
  { text: '业务未确权', icon: 'minus', value: 1, },
  { text: '技术未确权', icon: 'minus', value: 2 },
  { text: '已确权', icon: 'success',value: 3 }
]

export default function (props: React.PropsWithChildren<{

}>) {

  /* value */

  const ref = useRef<{
    controller: any,
    selectController: any,
    _searchOptions: Record<string, any>,
    initKeyword: boolean,
    initDrawer: boolean,
    isAll?: boolean,
    selectedRows?: any[],
  }>({ controller: {}, _searchOptions: {}, selectController: {}, initKeyword: false, initDrawer: false, isAll: false, selectedRows: [] })

  /* state */
  const [treeData, setTreeData] = useState<any[]>([]);

  const [currentSelect, setCurrentSelect] = useState<Record<string, any>>({});
  const [systemDetail, setSystemDetail] = useState<Record<string, any>>({});

  const [visible, setVisible] = useState<boolean>(false);
  const [drawerActiveData, setDrawerActiveData] = useState<Record<string, any>>(false);
  const [isBatch, setIsBatch] = useState<boolean>(false);
  const [drawerActiveRecord, setDrawerActiveRecord] = useState<Record<string, any>>({});
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [tabValue, setTabValue] = useState<string>('ods');

  // from
  const [formClassifyValue, setFormClassifyValue] = useState<string>('');
  const [formBusinessDepart, setFormBusinessDepart] = useState<Record<string, any>>({});
  const [formBusinessUserId, setFormBusinessUserId] = useState('');
  const [formTechUserId, setFormTechUserId] = useState('');
  const [formBusinessClassifyValue, setFormBusinessClassifyValue] = useState<string[]>([])

  // table
  const [selectTableRows, setSelectTableRows] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [isAll, setIsAll] = useState<boolean>(false);

  /* hooks data */
  const tablePathData = useTablePathData(currentSelect.id, tabValue);
  const businessClassifyData = useBusinessClassify(false);
  const dwThemeData = useDwTheme(false);
  const analizeThemeData = useAnalizeTheme(false);

  /* alert close state */
  const [show, setShow] = useState<boolean>(true);
  const [showOds, setShowOds] = useState<boolean>(true);
  const [showDw, setShowDw] = useState<boolean>(true);
  const [showApp, setShowApp] = useState<boolean>(true);

  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  /* update */
  const [updateSysDetail, setUpdateSysDetail] = useState<boolean>(false);
  const [formToolKey, setFormToolKey] = useState<number>(0);

  const columns = [
    { title: '表名', dataIndex: 'tableNameEn', fixed: 'left', render: (text: any, record: any) => {
      return (
        <>
          <span className={style.iconTitle}>
            {TABLE}
            <span><AutoTip content={text || ''} /></span>
            {
              (record.sourceType) && (
                <Popover content={
                  <div className={style.blood}>
                    <p>血缘{record.sourceType == 1 ? '来源' : '目标'}表</p>
                    <p><AutoTip content={record.sourcePath || ''}/></p>
                  </div>
                }>
                  <span className={style.link}>
                    {LINK}
                  </span>
                </Popover>
              )
            }
          </span>
          <span className={style.iconTitle}>
            {BASE}
            <span className={style.text}><AutoTip content={record.tablePath || ''} /></span>
          </span>
        </>
      )
    } },
    { title: tabValue === 'dw' ? '数仓主题' : tabValue === 'app' ? '分析主题' : '业务分类', dataIndex: 'classPath', render: (text: any, record: any) => {
      return <AutoTip content={text || <EmptyLabel/>} />
    } },
    { title: '技术归属信息', dataIndex: 'techBelongInfo', render: (text: any, record: any) => {
      return (!record.techManagerName && !text) ? <EmptyLabel/> : (
        <div>
          <AutoTip content={record.techManagerName || ''} />
          <AutoTip content={text || ''} />
        </div>
      )
    } },
    { title: '业务归属信息', dataIndex: 'bizBelongInfo', render: (text: any, record: any) => {
      return (!record.bizManagerName && !text) ? <EmptyLabel/> : (
        <div>
          <AutoTip content={record.bizManagerName || ''} />
          <AutoTip content={text || ''} />
        </div>
      )
    } },
    { title: '状态', dataIndex: 'status', render: (text: any) => (
      <StatusLabel type={statusMap[text].icon} message={statusMap[text].text} />
    )}
  ]

  // params
  const params = ProjectUtil.getPageParam(props);

  /* effect */
  // 系统列表
  useEffect(() => {
    querySystemList({ keyword: '' }).then(res => {
      console.log('res', res);
      const { data = [] } = res;
      data.forEach(v => {
        v.key = v.id;
        v.title = v.name;
        v.id = `classify${v.id}`;
        if(v.systemList) {
          v.systemList.forEach(k => {
            if(k) {
              k.key = k.id
              k.title = k.name;
              k.parentId = v.id;
            }
          })
          // null值过滤
          v.systemList = v.systemList.filter(v => v !== null)
          v.children = v.systemList;
        }
      })
      setTreeData(data);
      // 默认选中第一条
      if(params.tableBelongClassify) {
        const findClassify = data.filter(v => v.id == `classify${params.tableBelongClassify}`)[0];
        const findSystem = (findClassify.systemList || []).filter(v => v.id == params.tableBelongSystemId)[0];
        setCurrentSelect(findSystem || {})
        params.dwLevel && (
          setTabValue(params.dwLevel)
        )
      } else {
        setCurrentSelect(data[0].systemList ? data[0].systemList[0] : {});
      }
      updateTable();
    })
  }, [])
  // 系统详情
  useEffect(() => {
    if(!currentSelect.id) {
      return;
    }
    readSystemDetail({ systemId: currentSelect.id }).then(res => {
      console.log('res', res);
      const { data = {} } = res;
      setSystemDetail({ ...data });
    })
  }, [currentSelect.id, updateSysDetail])
  // 是否完善
  useEffect(() => {
    if(!currentSelect.id) return;
    readSystemCompleted({ dwLevel: tabValue, systemId: currentSelect.id }).then(res => {
      setIsCompleted(!!res.data);
    })
  },[currentSelect.id, tabValue])

  /* event */
  const selectChange = (selectedKeys: any, e: any) => {
    const { node } = e;
    // 点击分类时，nothing
    if((node.id + '' || '').includes('classify')) {
      return;
    }
    // reset
    // selectChage更改时，重置tabValue(两个重置：树传递数据的充值-搜索参数的重置)
    setTabValue(node.systemType == 2 ? 'ods' : 'none');
    ref.current._searchOptions = {};
    resetFooter();
    // 充值搜索项
    setFormToolKey(n => n + 1);
    ref.current._searchOptions = {};

    setCurrentSelect({...node});
    updateTable();
  }

  const resetFooter = () => {
    ref.current.selectController.updateSelectedKeys([]);
  }

  const formChange = (values: any = {}, reset?: boolean) => {
    console.log('formChange', values);
    const data = reset ? {...values} : {
      ...ref.current._searchOptions,
      ...values,
    }
    ref.current._searchOptions = {...data}
    ref.current.controller.reset();
    // 重置页脚
    resetFooter();
  }

  const techChange = (values: string[], selectedOptions: any[]) => {

    let data: { techDeptId?: string, techManagerId?: string } = { techDeptId: '', techManagerId: '' };
    if (!values){
      formChange(data);
      return;
    }

    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption.isUser) {
      data.techDeptId = targetOption.departmentId;
      data.techManagerId = targetOption.id;
    } else {
      data.techDeptId = targetOption.id;
    }
    formChange(data)
  }

  const businessChange = (values: string[], selectedOptions: any[]) => {
    let data: { bizDeptId?: string, bizManagerId?: string } = { bizDeptId: '', bizManagerId: '' };
    if (!values){
      formChange(data);
      return;
    }
    console.log('values', values, selectedOptions);
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption.isUser) {
      data.bizDeptId = targetOption.departmentId;
      data.bizManagerId = targetOption.id;
    } else {
      data.bizDeptId = targetOption.id;
    }
    formChange(data)
  }

  const tablePathChange = (values: string[], selectedOptions: any[]) => {
    if (!values){
      formChange({
        datasourceId: '',
        databaseId: '',
      });
      return;
    }
    let data = {
      datasourceId: values[0],
      databaseId: values[1],
    }
    formChange(data);
  }

  const businessClassifyChange = (values: string[]) => {
    console.log('businessClassifyChange', values);
    if(!values) {
      formChange({
        classIdList: [],
      });
      return;
    }
    const targetId = values[values.length - 1];
    const ids: string[] = [];

    recursiveByCb(businessClassifyData.children, item => {
      if(item.id == targetId) {
        if(!item.children || item.children.length <= 0) {
          ids.push(item.id)
        } else {
          recursiveByCb(item.children, v => {
            if (!v.children || v.children.length <= 0) {
              ids.push(v.id)
            }
          })
        }
      }
    })

    let data = {
      classIdList: [...ids],
    }
    formChange(data);
  }

  const getTableData = useCallback((page: any, pageSize: any) => {
    console.log('currentSelect', currentSelect, ref.current._searchOptions);
    if(!currentSelect.id) {
      return Promise.resolve(
        {
          total: 0,
          dataSource: [],
          data: [],
        }
      )
    }
    const postData = {
      page,
      pageSize,
      dwLevel: currentSelect.systemType == 2 ? tabValue : 'none',
      systemId: currentSelect.id,
      ...ref.current._searchOptions,
    }
    if(params.tableName && !ref.current.initKeyword) {
      postData.keyword = params.tableName;
      //postData.dwLevel = params.dwLevel;
      ref.current.initKeyword = true;
      ref.current._searchOptions = {
        keyword: params.tableName,
      }
    } 
    // 删除多余参数
    delete postData['0'];
    delete postData.businessBelong;
    delete postData.systemPath;
    delete postData.techBelong;
    delete postData.businessClassify;
    return readConfirmList(postData).then(res => {
      const { data = [] } = res;
      setTimeout(() => {
        if(params.tableName && !ref.current.initDrawer) {
          openDrawer(data[0] || {}, true)
          ref.current.initDrawer = true;
        }
      }, 100)
      // 全选
      if (ref.current.isAll) {
        ref.current.selectController.updateSelectedKeys(data.map(v => v.id))
      }
      return {
        total: res.total,
        dataSource: data,
        data: data,
      }

    })
  }, [JSON.stringify(currentSelect), JSON.stringify(ref.current._searchOptions)])

  const updateTable = () => {
    ref.current.controller.reset();
  }

  /* drawer */
  const openDrawer = async (record: any, single: boolean, selectedRows?: any[]) => {
    console.log('ref', ref.current.selectController);
    setIsBatch(!single);
    setDrawerActiveRecord({ ...record });
    setIsEdit(record.status == 3);
    setSelectTableRows([...(selectedRows || [])])
    const res: any = single ? await readConfirmSignleDetail({ tableId: record.tableId || '' }) : await readConfirmBatchDetail((selectedRows || []) );
    
    const { data = {}, code } = res;
    console.log('data', data);
    if(code !== 200) {
      message.warn(res.msg || '操作失败');
      return;
    }
    setVisible(true);
    setDrawerActiveData({ ...data })
    // 打开弹窗时对初始值赋值
    const { recommendClassList = [] } = data;
    if (recommendClassList.length > 0) {
      const first = recommendClassList[0] || {};
      // 默认选中第一个分类
      setFormClassifyValue(first.classId)
      // 默认选中第一个分类时，赋值业务归属部门信息; 对应的人员信息也放在这里
      setFormBusinessDepart({
        name: first.bizDeptName,
        id: first.bizDeptId,
        userName: first.bizManagerName,
        userId: first.bizManagerId
      })
    } else {
      // 没有推荐信息时的赋值
      setFormClassifyValue('custom');
      // 分类信息赋值
      setFormBusinessClassifyValue(data.classIdPath || [])
      // 业务归属赋值
      setFormBusinessDepart({
        name: data.bizDeptName,
        id: data.bizDeptId,
        userName: data.bizManagerName,
        userId: data.bizManagerId
      })
    }

  }
  const closeDrawer = () => {
    setVisible(false);
    setDrawerActiveData({})
  }

  const drawerConfirm = () => {
    console.log('confirm drawer');
    const postData = {
      tableIdList: isBatch ? (selectTableRows || []).map(v => v.tableId) : [drawerActiveRecord.tableId],
      // 分类
      classId: (formBusinessClassifyValue && formBusinessClassifyValue[formBusinessClassifyValue.length - 1]) || formClassifyValue ,
      // 业务归属
      bizDeptId: formBusinessDepart.id,
      bizManagerId: formBusinessDepart.userId || formBusinessUserId,
      // 技术归属
      techDeptId: drawerActiveData.techDeptId,
      techManagerId: formTechUserId || drawerActiveData.techManagerId,
    };
    console.log('postData', postData);
    createConfirm(postData).then((res: any) => {
      console.log('res', res);
      if(res.code == 200) {
        message.success( !isBatch ? `${isEdit ? '修改' : '确权'}成功` : `成功${isEdit ? '编辑' : '确权'}${selectTableRows.length}张表`);
        // reset
        closeDrawer();
        updateTable();
        resetFooter();
        setUpdateSysDetail(v => !v)
      } else {
        message.error(res.msg || '操作失败');
      }
    })
  }

  const linkToTableDetail = (tableId: string) => {
    console.log('link');
    props.addTab('sysDetail', { id: tableId, tabValue: '' }, true)
  }

  const tabsChange = (tabKey: string) => {
    setTabValue(tabKey);
    resetFooter();
    // 重置搜索
    setFormToolKey(c => c + 1);
    ref.current._searchOptions = {};

    formChange({
      dwLevel: tabKey,
    }, true)
  }

  const formBusinessClassifyChange = (values: string[], selectedOptions: any[]) => {
    console.log('formBusinessClassifyChange', values, selectedOptions);
    setFormBusinessClassifyValue(values);
    // 如果是非数仓，有其它操作，赋值部门信息
    if(!values) {
      setFormBusinessDepart({});
    } else {
      const node = selectedOptions[selectedOptions.length - 1];
      setFormBusinessDepart({ name: node.businessDepartment, id: node.businessDepartmentId, userName: node.businessManager, userId: node.businessManagerId });
    }
  }

  const classifyChange = (e: any, other: any) => {
    const { target: { node = {}, value = '' } = {} } = e;
    setFormClassifyValue(value)
    // 分类改变时，根据分类id获取对应的部门数据
    setFormBusinessDepart({ name: node.bizDeptName, id: node.bizDeptId, userName: node.bizManagerName, userId: node.bizManagerId });
  }

  const formBusinessUserChange = (value: any) => {
    // 自身更改时，置空分类赋值数据
    setFormBusinessDepart(v => ({
      ...v,
      userName: '',
      userId: ''
    }))
    setFormBusinessUserId(value);
    console.log('user value change', value);
  }

  const formTechUserChange = (value: any) => {
    setFormTechUserId(value);
  }

  const rowSelectionChange = (_selectedRowKeys: any[], _selectedRows: any[]) => {
    console.log('row change', _selectedRowKeys);
    /* if(selectedRowKeys.length <= 0 && _selectedRowKeys.length > 0) {
      message.warning('批量操作，需选择同源表');
    } */
    setSelectedRowKeys(_selectedRowKeys);
  }

  const filterBusinessAndAnalysis = (_data: any[]) => {
    const data = [..._data];
    recursiveByCb(data, v => {
      if((v.children || []).length <= 0 && !v.businessDepartmentId) {
        v.disabled = true;
      }
    })
    return data;
  }

  const filterDw = useCallback((_data: any[]) => {
    const data = [..._data];
    const current = data.filter(v => v.objectId == currentSelect.id);
    recursiveByCb(current, v => {
      if((v.children || []).length <= 0 && !v.businessDepartmentId) {
        v.disabled = true;
      }
    })
    return current;
  }, [currentSelect.id])

  const refreshDetail = async () => {
    const res = !isBatch ? await readConfirmSignleDetail({ tableId: drawerActiveRecord.tableId || '' }) : await readConfirmBatchDetail((selectTableRows || []).map(v => v.tableId) );

    const { data = {}, code } = res;
    if(code !== 200) {
      message.warn(res.msg || '操作失败');
      return;
    }
    setDrawerActiveData({ ...data })
    // 刷新时，只能修改三个数据：分类信息、业务归属部门、业务负责人
    const { recommendClassList = [] } = data;
    if (recommendClassList.length > 0) {
      const first = recommendClassList[0] || {};
      // 默认选中第一个分类
      setFormClassifyValue(first.classId)
      // 默认选中第一个分类时，赋值业务归属部门信息; 对应的人员信息也放在这里
      setFormBusinessDepart({
        name: first.bizDeptName,
        id: first.bizDeptId,
        userName: first.bizManagerName,
        userId: first.bizManagerId
      })
    } else {
      // 没有推荐信息时的赋值
      setFormClassifyValue('custom');
      // 分类信息赋值
      setFormBusinessClassifyValue(data.classIdPath || [])
      // 业务归属赋值
      setFormBusinessDepart({
        name: data.bizDeptName,
        id: data.bizDeptId,
        userName: data.bizManagerName,
        userId: data.bizManagerId
      })
    }
  }

  const resetChange = () => {
    formChange({}, true);
  }

  const linkToClassify = (type: 'business' | 'dw' | 'analysis') => {
    const map = {
      business: '业务分类',
      dw: '数仓主题',
      analysis: '分析主题',
    }
    props.addTab(map[type], {}, true)
  }

  const odsIsNotComplete = (!formBusinessClassifyValue || !formBusinessDepart.id || !(formBusinessDepart.userId || formBusinessUserId));

  const odsLink = () => {
    const params = {
      tableName: drawerActiveData.sourceTableNameEn,
      tableBelongClassify: drawerActiveData.sourceSystemClassId,
      tableBelongSystemId: drawerActiveData.sourceSystemId,
      dwLevel: drawerActiveData.sourceDwLevel,
    }
    props.addTab('calssification', params, true);
  }

  const selectAll = async (changableRowKeys: any) => {
    const postData = {
      dwLevel: currentSelect.systemType == 2 ? tabValue : 'none',
      systemId: currentSelect.id,
      ...ref.current._searchOptions,
    }
    if(params.tableName && !ref.current.initKeyword) {
      postData.keyword = params.tableName;
      //postData.dwLevel = params.dwLevel;
      ref.current.initKeyword = true;
      ref.current._searchOptions = {
        keyword: params.tableName,
      }
    } 
    // 删除多余参数
    delete postData['0'];
    delete postData.businessBelong;
    delete postData.systemPath;
    delete postData.techBelong;
    delete postData.businessClassify;
    console.log('changableRowKeys', changableRowKeys);
    readAllConfirmation(postData).then(res => {
      if(res.code == 200) {
        console.log('res', res);
        const { data: { tableIdList = [] } = {} } = res;
        ref.current.selectController.updateSelectedKeys([...tableIdList]);
        //ref.current.selectedRows = [...tableIdList];
      }
    })
    
  }

  return (
    <SliderLayout
      className={style.layout}
      style={{ minHeight: '100%' }}
      renderSliderHeader={() => '系统目录'}
      renderSliderBody={() => {
        return ProjectUtil.renderSystemTree(treeData, selectChange, {
          fieldNames: { key: 'id', children: 'systemList', title: 'name' },
          defaultSelectedEqual: (node) => {
            if (params.tableBelongSystemId) {
              return  node.id.toString() === params.tableBelongSystemId
            }
            return Boolean(node.systemType)
          }
        })
      }}
      renderContentHeader={() => currentSelect.name || ''}
      renderContentBody={() => (
        <div className={style.detail} key={currentSelect.id}>
          <Section title="系统基本属性">
            <ListHorizontal labelWidth={140} style={{ marginBottom: 8 }} label="业务权威属主" value={systemDetail.mainDeptName || ''} />
            <ListHorizontal labelWidth={140} style={{ marginBottom: 0 }} label="其它业务使用方" value={systemDetail.otherDepts || ''} />
          </Section>
          <Section title="数据确权概览">
            <ListHorizontal.Wrap className={style.listWrap}>
              <ListHorizontal labelWidth={42} style={{ marginBottom: 0 }} label={<span style={{ color: '#2D3033' }}>表数量</span>} value={<span className={style.num}>{addDou(systemDetail.tableNum) || 0}</span>} />
              <Divider type="vertical" />
              <ListHorizontal labelWidth={70} style={{ marginBottom: 0, marginRight: 60 }} label="技术确权表" value={
                (() => {
                  return (
                    <span className={style.num}>
                      <span>{addDou(systemDetail.techConfirmNum) || 0}</span>
                      <Progress type="circle" width={16} percent={ systemDetail.tableNum ? systemDetail.techConfirmNum/systemDetail.tableNum : 0} showInfo={false} strokeWidth={15} />
                    </span>
                  )
                })()
              } />
              <ListHorizontal labelWidth={70} style={{ marginBottom: 0 }} label="业务确权表" value={
                (() => {
                  return (
                    <span className={style.num}>
                      <span>{addDou(systemDetail.bizConfirmNum) || 0}</span>
                      <Progress type="circle" width={16} percent={systemDetail.tableNum ? systemDetail.bizConfirmNum/systemDetail.tableNum : 0} showInfo={false} strokeWidth={15} />
                    </span>
                  )
                })()
              } />
            </ListHorizontal.Wrap>
          </Section>
          <Section title="系统详情" className={style.systemDetail}>
            {
              /* 非数仓显示 */
              !isCompleted && currentSelect.systemType !== 2 && show && <Alert onClose={(e) => delay(() => setShow(false))} showIcon message={<>业务分类配置不完整，可能会影响确权操作，建议完善业务分类配置，<a onClick={() => linkToClassify('business')}>去完善 <span className="iconfont icon-you" /></a> </>} closable />
            }
            {
              /* 数仓时显示tab栏 */
              currentSelect.systemType === 2 && (
                <Tabs className={style.tabs} onChange={tabsChange} activeKey={tabValue}>
                  <Tabs.TabPane tab="数据运营层" key="ods" />
                  <Tabs.TabPane tab="数据仓库层" key="dw" />
                  <Tabs.TabPane tab="数据应用层" key="app" />
                </Tabs>
              )
            }
            {
              /* 数仓显示 */
              !isCompleted && currentSelect.systemType == 2 && tabValue === 'ods' && showOds && <Alert onClose={(e) => delay(() => setShowOds(false))} showIcon message={<>业务分类配置不完整，可能会影响确权操作，建议完善业务分类配置，<a onClick={() => linkToClassify('business')}>去完善 <span className="iconfont icon-you" /></a> </>} closable />
            }
            {
              /* 数仓显示 */
              !isCompleted && currentSelect.systemType == 2 && tabValue === 'dw' && showDw && <Alert onClose={(e) => delay(() => setShowDw(false))} showIcon message={<>数仓主题配置不完整，可能会影响确权操作，建议完善数仓主题配置，<a onClick={() => linkToClassify('dw')}>去完善 <span className="iconfont icon-you" /></a> </>} closable />
            }
            {
              /* 数仓显示 */
              !isCompleted && currentSelect.systemType == 2 && tabValue === 'app' && showApp && <Alert onClose={(e) => delay(() => setShowApp(false))} showIcon message={<>分析主题配置不完整，可能会影响确权操作，建议完善分析主题配置，<a onClick={() => linkToClassify('analysis')}>去完善 <span className="iconfont icon-you" /></a> </>} closable />
            }
            <RichTableLayout
              disabledDefaultFooter
              tableProps={{
                columns: columns,
                key: 'tableId',
                selectedEnable: true,
                selections: [
                  {
                    key: 'customAll',
                    text: '全选所有',
                    onSelect: selectAll
                  },
                  /* 'SELECT_INVERT', */
                  'SELECT_NONE'
                ],
                /* rowSelection: {
                  selectedRowKeys,
                  onChange: onSelectChange,
                  selections: [
                    Table.SELECTION_ALL,
                    Table.SELECTION_INVERT,
                    Table.SELECTION_NONE,]
                } */
                rowSelectionChange: rowSelectionChange,
              }}
              editColumnProps={{
                width: 100,
                createEditColumnElements: (index, record: any) => {
                    return RichTableLayout.renderEditElements([
                        {
                            label: record.status === 3 ? '修改' : '确权',
                            onClick: () => { openDrawer(record, true) },
                            disabled: record.status !== 3,
                            funcCode: '/dt_calssification/mapping/manage/update'
                        },
                        {
                          label: record.status !== 3 ? '确权' : '修改',
                          onClick: () => { openDrawer(record, true) },
                          disabled: record.status === 3,
                          funcCode: '/dt_calssification/mapping/manage/confirm'
                       },
                    ])
                },
              }}
              renderSearch={(controller) => {
                ref.current.controller = controller;
                return (
                  <FormTool
                    bottom={0}
                    key={formToolKey}
                    onChange={formChange}
                    resetChange={resetChange}
                    dataSource={[
                      {
                        type: 'inputSearch',
                        name: 'keyword',
                        placeholder: '表名搜索',
                        defaultValue: params.tableName,
                      }, {
                        type: 'custom',
                        name: 'systemPath',
                        render: () => (
                          <Cascader
                            placeholder="系统路径"
                            options={tablePathData}
                            onChange={tablePathChange}
                            changeOnSelect
                            fieldNames={{
                              label: 'name',
                              value: 'id'
                            }}
                            getPopupContainer={node => node.parentElement}
                          />
                        )
                      }, {
                        type: 'custom',
                        name: 'businessClassify',
                        render: () => (
                          <Cascader
                            placeholder="业务分类"
                            changeOnSelect
                            options={businessClassifyData.children || []}
                            fieldNames={{
                              label: 'name',
                              value: 'id',
                            }}
                            onChange={businessClassifyChange}
                            getPopupContainer={node => node.parentElement}
                          />
                        )
                      }, {
                        type: 'select',
                        name: 'status',
                        placeholder: '状态',
                        selectOption: statusMap,
                        fieldNames: { label: 'text' },
                        getPopupContainer: node => node.parentElement
                      }, {
                        type: 'custom',
                        name: 'techBelong',
                        render: () => (
                          <Select.CascaderDepartUser
                            placeholder="技术归属信息"
                            onChange={techChange}
                            getPopupContainer={node => node.parentElement}
                          />
                        )
                      }, {
                        type: 'custom',
                        name: 'businessBelong',
                        render: () => (
                          <Select.CascaderDepartUser
                            placeholder="业务归属信息"
                            onChange={businessChange}
                            getPopupContainer={node => node.parentElement}
                          />
                        )
                      }
                    ]}
                  />
                )
              }}
              requestListFunction={(page, pageSize, filter, sorter) => {
                return getTableData(page, pageSize)
              }}
              renderFooter={(controller, defaultRender) => {
                const { selectedRows } = controller;
                console.log('renderFooter', selectedRows);
                ref.current.selectController = controller;
                //ref.current.selectedRows = selectedRows;
                return (
                  <div>
                    <PermissionWrap funcCode='/dt_calssification/mapping/manage/confirm'>
                      <Button style={{ marginRight: 8 }} type='primary' onClick={() => openDrawer({}, false, ref.current.selectController.selectedKeys || [])}>
                        批量确权
                      </Button>
                    </PermissionWrap>
                    {defaultRender()}
                  </div>
                )
              }}
              /* showFooterControl */
            />
          </Section>
          <DrawerLayout
            drawerProps={{
              title: '确权信息编辑',
              visible,
              onClose: closeDrawer,
              width: 640,
            }}
            renderFooter={() => (
              <>
                <Button type="primary" onClick={drawerConfirm}>确定</Button>
                <Button onClick={closeDrawer}>取消</Button>
              </>
            )}
          >
            <div className={style.drawer}>
              {
                /* 批量头部：这部分不论是否数据、层级都是这样显示 */
                isBatch && <div className={style.batchTitle}>当前共选择了<span> {selectTableRows.length} </span>张表</div>
              }
              {
                /* 非批量title: 这部分只要不是批量，都这样显示 */
                !isBatch && (
                  <>
                    <div className={style.header}>
                      <p className={style.title}>
                        <span>{drawerActiveData.tableNameEn || ''}</span>
                        {drawerActiveData.tableNameCn && <span>[{drawerActiveData.tableNameCn || ''}]</span>}
                        <IconLink className={style.iconLink} onClick={() => { linkToTableDetail(drawerActiveData.tableId) }} />
                      </p>
                      <p className={style.desc}><span className="iconfont icon-ku" />{drawerActiveData.tablePath}</p>
                    </div>
                    <Divider />
                  </>
                )
              }
              {
                /* 贴源来源/目标：这块内容也是不分层级，非批量有数据就显示 */
                !isBatch && (
                  <>
                    {
                      drawerActiveData.sourceTableId && (
                        <section className={style.source}>
                          <ModuleTitle className={ drawerActiveData.sourceType == 1 ? 'source' : 'target' } title={`贴源${drawerActiveData.sourceType == 1 ? '来源' : '目标'}表`} />
                          {
                            drawerActiveData.sourceType == 2 && <p>温馨提示：贴源目标表的分类及业务归属信息将默认<span style={{ fontWeight: 500 }}>继承来源表</span>的信息</p>
                          }
                          <ListHorizontal label="表名称" value={
                            <span>
                              {drawerActiveData.sourceTableNameEn || ''}
                              {drawerActiveData.sourceTableNameCn && `[${drawerActiveData.sourceTableNameCn}]`}
                              <IconLink style={{ marginLeft: 5, position: 'relative', top: 1 }} onClick={() => { linkToTableDetail(drawerActiveData.tableId) }} />
                            </span>
                          } />
                          <ListHorizontal label="技术路径" value={drawerActiveData.sourceTablePath || ''} />
                        </section>
                      )
                    }
                  </>
                )
              }
              {
                /* 分类信息：非数仓时显示-数仓ods层没有来源表 */
                (currentSelect.systemType !== 2 || (currentSelect.systemType == 2 && tabValue === 'ods' && drawerActiveData.sourceType != 1) ) && (
                  <section className={style.classify}>
                    <ModuleTitle title="分类信息" />
                    {
                      (drawerActiveData.recommendClassList || []).length > 0 && <p>根据系统归属部门开展的业务，为你推荐一下业务分类</p>
                    }

                    {
                      (drawerActiveData.recommendClassList || []).length > 0 && (
                        <Radio.Group onChange={classifyChange} value={formClassifyValue}>
                          <Space direction="vertical">
                            {
                              (drawerActiveData.recommendClassList || []).map((v: any) => (
                                <Radio node={v} value={v.classId}>{v.classPath || ''}</Radio>
                              ))
                            }
                            <Radio value={"custom"}>自定义</Radio>
                          </Space>
                        </Radio.Group>
                      )
                    }
                    
                    {
                      formClassifyValue === 'custom' && (
                        <Cascader
                          placeholder="请选择业务分类"
                          options={filterBusinessAndAnalysis(businessClassifyData.children || [])}
                          onChange={(a: any, b: any) => formBusinessClassifyChange(a, b)}
                          value={formBusinessClassifyValue}
                          fieldNames={{label: 'name',value: 'id'}}
                          getPopupContainer={node => node.parentElement}
                        />
                      )
                    }
                  </section>
                )
              }
              {
                /* 分类信息-数仓主题 */
                currentSelect.systemType === 2 && tabValue === 'dw' && (
                  <section className={style.dwClassify} style={{ marginBottom: 33 }}>
                    <ModuleTitle title="分类信息" />
                    <div className={style.formLabel}>
                      <span>数仓主题</span>
                    </div>
                    <div className={style.formValue}>
                      <Cascader
                        style={{ width: '100%' }}
                        placeholder="请选择业务分类"
                        options={filterDw(dwThemeData.children || [])}
                        onChange={(a: any, b: any) => formBusinessClassifyChange(a, b)}
                        value={formBusinessClassifyValue}
                        fieldNames={{label: 'name',value: 'id'}}
                        getPopupContainer={node => node.parentElement}
                      />
                    </div>
                  </section>  
                )
              }
              {
                /* 分类信息-分析主题 */
                currentSelect.systemType === 2 && tabValue === 'app' && (
                  <section className={style.dwClassify} style={{ marginBottom: 33 }}>
                    <ModuleTitle title="分类信息" />
                    <div className={style.formLabel}>
                      <span>分析主题</span>
                    </div>
                    <div className={style.formValue}>
                      <Cascader
                        style={{ width: '100%' }}
                        placeholder="请选择业务分类"
                        options={filterBusinessAndAnalysis(analizeThemeData.children || [])}
                        onChange={(a: any, b: any) => formBusinessClassifyChange(a, b)}
                        value={formBusinessClassifyValue}
                        fieldNames={{label: 'name',value: 'id'}}
                        getPopupContainer={node => node.parentElement}
                      />
                    </div>
                  </section>  
                )
              }
              {
                /* 业务归属：数仓非ods层 或者非数仓 或者 数仓ods层没有来源表 显示 */
                ((currentSelect.systemType !== 2) || (currentSelect.systemType == 2 && tabValue !== 'ods') || (currentSelect.systemType == 2 && tabValue === 'ods' && drawerActiveData.sourceType != 1) ) && (
                  <section className={style.business}>
                    <ModuleTitle title="业务归属" suffix={
                      <Tooltip title="与上方业务分类信息关联">
                        <span className="iconfont icon-jinggao warning"/>
                      </Tooltip>
                    } />
                    <div className={style.formLabel}>
                      <span>业务归属部门</span>
                      <span>业务负责人</span>
                    </div>
                    <div className={style.formValue}>
                      <Space>
                        <AntdSelect value={formBusinessDepart.id} disabled style={{ width: 292 }} placeholder="请先选择上方分类分类">
                          <AntdSelect.Option value={formBusinessDepart.id}>{formBusinessDepart.name}</AntdSelect.Option>
                        </AntdSelect>
                        <Select.UserSelect onChange={formBusinessUserChange} value={formBusinessDepart.userId || formBusinessUserId} departId={formBusinessDepart.id} width={292} placeholder="请先选择上方分类分类" />
                      </Space>
                    </div>
                  </section>   
                )
              }
              {/* 技术归属：信息一直有 */}
              <section className={style.tech}>
                <ModuleTitle title="技术归属" />
                <div className={style.formLabel}>
                  <span>技术归属部门<Tooltip title="技术归属部门默认继承数据源技术归属信息"><span className="iconfont icon-jinggao warning" /></Tooltip></span>
                  <span>技术负责人<Tooltip title="技术负责人默认继承数据源技术负责人信息"><span className="iconfont icon-jinggao warning" /></Tooltip></span>
                </div>
                <div className={style.formValue}>
                  <Space>
                    <AntdSelect style={{ width: 292 }} disabled defaultActiveFirstOption value={drawerActiveData.techDeptId}>
                      <AntdSelect.Option value={drawerActiveData.techDeptId}>{drawerActiveData.techDeptName}</AntdSelect.Option>
                    </AntdSelect>
                    <Select.UserSelect onChange={formTechUserChange} value={formTechUserId || drawerActiveData.techManagerId} departId={drawerActiveData.techDeptId} width={292} placeholder="请先选择上方分类分类" />
                  </Space>
                </div>
              </section>
              {
                /* 数仓ods层-且有来源表显示 或者 非数仓且有来源表显示 */
                ( false || ( ( (currentSelect.systemType == 2 && tabValue === 'ods') || currentSelect.systemType != 2) && drawerActiveData.sourceType == 1) )&& (
                  <div className={style.odsWrap}>
                    <span>默认继承来源表<span/></span>
                    <p>
                      {
                        odsIsNotComplete ? '来源表信息待完善，' : '信息不准确，前往来源表修改，'
                      }
                      
                      <Space split={<Divider type="vertical" />}>
                        <a onClick={refreshDetail}>刷新</a>
                        <a onClick={odsLink}>
                          {odsIsNotComplete ? '去完善' : '去修改'}
                          <span className="iconfont icon-you" />
                        </a>
                      </Space>
                    </p>
                    {/* 分类信息 */}
                    <section className={style.dwClassify} style={{ marginBottom: 33 }}>
                      <ModuleTitle title="分类信息" />
                      <div className={style.formLabel}>
                        <span>业务分类</span>
                      </div>
                      <div className={style.formValue}>
                        <Cascader
                          disabled
                          style={{ width: '100%' }}
                          placeholder="请选择业务分类"
                          options={filterBusinessAndAnalysis(businessClassifyData.children || [])}
                          onChange={(a: any, b: any) => formBusinessClassifyChange(a, b)}
                          value={formBusinessClassifyValue}
                          fieldNames={{label: 'name',value: 'id'}}
                          getPopupContainer={node => node.parentElement}
                        />
                      </div>
                    </section>   
                    {/* 业务归属信息 */}
                    <section className={style.business}>
                      <ModuleTitle title="业务归属" suffix={
                        <Tooltip title="与上方业务分类信息关联">
                          <span className="iconfont icon-jinggao warning"/>
                        </Tooltip>
                      } />
                      <div className={style.formLabel}>
                        <span>业务归属部门</span>
                        <span>业务负责人</span>
                      </div>
                      <div className={style.formValue}>
                        <Space>
                          <AntdSelect value={formBusinessDepart.id} disabled style={{ width: 276 }} placeholder="请先选择上方分类分类">
                            <AntdSelect.Option value={formBusinessDepart.id}>{formBusinessDepart.name}</AntdSelect.Option>
                          </AntdSelect>
                          <Select.UserSelect disabled onChange={formBusinessUserChange} value={formBusinessDepart.userId || formBusinessUserId} departId={formBusinessDepart.id} width={276} placeholder="请先选择上方分类分类" />
                        </Space>
                      </div>
                    </section>   
                  </div>
                )
              }
            </div>
          </DrawerLayout>
        </div>
      )}
    />
  )
}