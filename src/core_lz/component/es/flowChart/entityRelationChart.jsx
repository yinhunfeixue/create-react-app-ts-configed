import React from 'react'
import G6 from '@antv/g6';
import {List, Modal} from 'antd';
import {JfCard} from 'app_common';
import _ from 'underscore';
import style from '../../../resources/dmp/css/component/entityRelationChart/index.css';

export default class EntityRelationChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title, //模块标题
            extreaOptions: this.props.extraOptions,
            modalVisible: false,
            title: null,
            updatefields: [],
            loading: false,
            hasMore: true,
            sourcedmpData: this.props.todmpdata
                ? this.props.todmpdata
                : {},
            lastFrom_id: null,
            lastTo_id: null,

            lastFrom_field: [],
            lastTo_field: [],
            loading:true,
            form_id: 0,
            to_id:0,
            formFiedId: 0,
            toFiedId: 0,
        };

        this.netObj = null;
        this.dmpNodeData = [];
        this.hightNodes = [];
        this.hightEdge = null;
        //this.show=this.show.bind(this);
        //this.hide=this.hide.bind(this);
    }
    /*
       //展示具体node的详情
      show(){
        let s=document.getElementById('fc');
        s.style.display = "block";
      }
      //详情关闭
      hide(){
      let o = document.getElementById('fc');
         o.style.display = "none";
     }*/

    //关闭modal
    handCancel = () => {
        this.setState({modalVisible: false})
    }

    //转换边关系数据格式
    setRelation(rela) {
        let relation = "";
        switch (rela) {
            case "1..1":
                relation = "1";
                break;
            case "1..n":
                relation = "2";
                break;
            case "n..1":
                relation = "3";
                break;
            case "无":
                relation = null;
                break;
        }
        return relation;
    }

    netRefresh() {
    //    console.log("刷新页面！")
        this.getNet().refresh();
    }

    getNet() {
        //第三步初始化图
        let net = new G6.Net({
            id: 'c1', // 容器ID
            height: 1100,
            fitView: 'autozoom'
        });
        return net;
    }

    resetOtherFields(hightFieldList,){

    }

    //清楚已经高亮节点的效果
    clearHightLight(){
        let _this = this;

        if (_this.hightEdge){
            _this.netObj.update(_this.hightEdge, {color: null});
        }

        _.map(_this.hightNodes, function(nodeId,i) {
            //console.log("nodeId");
        //    console.log(nodeId);
            let currentFields = _this.netObj.find(nodeId).get('model').fields; //获取关联表中的字段
            let restFields = [];
            _.map(currentFields, function(f, i) {
                //console.log(f);
                if( f.field != undefined &&  f.field != ''){
                    let str = f.field;
                    str = str.replace(/<[^>]+>/g, "");
                    restFields.push({
                        "field":str,
                        "name":f.name,
                        'id': f.id
                    });
                }
            });

            _this.netObj.update(nodeId, {fields: restFields});

        });
    }

    //节点字段 高亮效果
    hightNodeField(nodeId, hField,fieldList){
        //console.log("nodeId, hField,fieldList");
        //console.log(nodeId, hField);

        if( hField == undefined || hField =='' )
            return;

        let fields = [];
        let _this = this;
        let hightField = {
            "field":`<font style="color:red">${hField}</font>`,
            "name":hField,
        }
        // current_field.field = `<font style="color:red">${hField}</font>`;
        // current_field.name = hField;

        _.map(fieldList, function(f, i) {
            let current_field = {};
            if( f.field != undefined &&  f.field != ''){
                if (f.field != hField) {
                    let fieldStr = f.field;
                    fieldStr = fieldStr.replace(/<[^>]+>/g, "");
                    current_field.field = fieldStr;
                    current_field.name = f.name;
                    current_field.id = f.id;
                    fields.push(current_field);
                } else {
                    if( f.id && f.id !== undefined) {
                        if( _this.state.form_id === nodeId ){
                            _this.setState({
                                formFiedId: f.id
                            })
                        } else if( _this.state.to_id === nodeId ){
                            _this.setState({
                                toFiedId: f.id
                            })
                        }
                    }
                }
            }
        });
        fields.unshift(hightField);
        //console.log(fieldList);

        _this.netObj.update(nodeId, {fields: fields});

        _this.hightNodes.push(nodeId);
        // _this.hightNodes.push(to_id);
        //return fields;
    }

    //第四步数据映射
    refreshGraph(data) {
        let sourcedmpData = this.props.todmpdata;
        //console.log(sourcedmpData,"元数据");
        this.dmpNodeData = data.nodes;
        let _this = this;
        let Util = G6.Util;
        //自定义表格样式
        G6.registerNode('table', {
            cssSize: true,
            // getAnchorPoints: function() {
            //   return [
            //     [0, 0],
            //     [0, 0.25],
            //     [0, 0.5], // 右边边的中点
            //     [0, 0.75],
            //     [0, 1],
            //     [1, 0],
            //     [1, 0.25],
            //     [1, 0.5], // 右边边的中点
            //     [1, 0.75],
            //     [1, 1],
            //   ]
            // },
            getHtml: function getHtml(cfg) {
                let model = cfg.model;
                let fields = "";
                //console.log(cfg);
                Util.each(model.fields, function(f, i) {

                    fields += f.field + "<br>";
                });
                // let container = Util.createDOM('<div class="node-container"></div>');
                // let titledom = Util.createDom('<div class="node-title"><div class="node-title-icon"></div><div class="node-titlename"><span>' + model.name + '</span></div> <div class="node-title-icont"></div><div class="node-title-close"></div></div>');
                // let tabledom = Util.createDom('<div class="node-table">' + fields + '</div>');

                let cssStyle = "width:" + cfg.size + "px;";
                let container = Util.createDOM('<div class="node-container" ></div>');
                let titledom = Util.createDom('<div class="node-titlename" style="' + cssStyle + '"><span title="' + model.name + '">' + model.name + '</span></div>');
                let tabledom = Util.createDom('<div class="node-table" >' + fields + '</div>');

                container.appendChild(titledom);
                container.appendChild(tabledom);

                return container;
            }
        }, 'html');

        //第三步初始化图
        _this.netObj = new G6.Net({
            id: 'c1', // 容器ID
            height: 1100,
            fitView: 'tl',
            mode: 'edit'
        });

        //载入数据
        _this.netObj.source(data.nodes, data.edges);
        _this.netObj.node().shape('table').style({
            stroke: "#333" // 去除默认边框
        }).size(160);
        _this.netObj.edge().shape('smooth').style({arrow: true}).label('relation');
        _this.netObj.render(); //第一次装载数据渲染

        //1当点击选中某一个节点时对它做处理
        _this.netObj.on('itemclick', function(ev) {
            const item = ev.item;
            let modelId = ev.item.get('model').id;

            if (_this.netObj.isNode(item)) { //1.1当点击node时，弹出对话框显示当前的数据
                let current_tablename = _this.netObj.find(modelId).get('model').name;
                let current_fields = _this.netObj.find(modelId).get('model').fields; //获取关联表中的字段
                let this_fields = [];
                Util.each(current_fields, function(f, i) {
                    if( f.field != undefined &&  f.field != ''){
                        let str = f.field;
                        str = str.replace(/<[^>]+>/g, "");
                        this_fields.push(str);
                    }
                    //  fields+=str+"\n";
                });
                _this.setState({modalVisible: true, title: current_tablename, updatefields: this_fields});
                /*
          Util.each(current_fields,function(field, i){
           fields+=`<div>{field.field}</div>`+"\n";
       });*/
                //1.2当单击edge时高亮箭头及参数
                //填充对话框
                /*    let  t=document.getElementById('tabtitle');
		      t.innerText=current_tablename;

           let  f= document.getElementById('content_main');
	          f.innerText=fields;

           _this.show();*/
            } else if (_this.netObj.isEdge(item)) {
                //alert("高亮关联字段！");

                //清楚之前的高亮效果
                _this.clearHightLight();


                //当前箭头高亮
                _this.netObj.update(item, {color: 'red'});
                _this.hightEdge = item;

                let otherEdges_ids = [];
                //  let  nowEdges_id=ev.item.get('model').id;
                Util.each(sourcedmpData.edges, function(edge, i) {
                    if (edge.id != modelId) {
                        otherEdges_ids.push(edge.id);
                    }
                });


                //标红选中箭头两边的节点关联字段
                let fromField = ev.item.get('model').from_field;
                let from_id = ev.item.get('model').source;
                let from_fields = _this.netObj.find(ev.item.get('model').source).get('model').fields;

                let to_id = ev.item.get('model').target;
                let toField = ev.item.get('model').to_field;
                let to_fields = _this.netObj.find(ev.item.get('model').target).get('model').fields;

                _this.setState({
                    form_id: from_id,
                    to_id: to_id,
                }, () => {
                    _this.hightNodeField(from_id,fromField, from_fields);
                    _this.hightNodeField(to_id,toField, to_fields);
                })
                // Util.each(to_fields, function(field, i) {
                //     let current_field = {};
                //     if (field.field === toField) {
                //         current_field.field = `<font style="color:red">${toField}</font>`;
                //         current_field.name = toField;
                //     } else {
                //         current_field.field = field.field;
                //         current_field.name = field.name;
                //     }
                //     tofields.push(current_field);
                // });



                //
                // Util.each(otherEdges_ids, function(edge, i) {
                //     _this.netObj.update(edge, {color: null});
                // });
                //
                //
                //
                //
                //
                // let otherNodes_ids = [];
                // Util.each(sourcedmpData.nodes, function(node, i) {
                //     let now_id = null;
                //     let now_fields = [];
                //     if ((node.id != from_id) && (node.id != to_id)) {
                //         now_id = node.id;
                //         now_fields = node.fields;
                //     }
                //     console.log(now_id, 'id', now_fields, '其它', tofields);
                //     _this.netObj.update(now_id, {fields: now_fields});
                // });

            }
        });

        //双击事件
        _this.netObj.on('dblclick', function(ev) {
            const item = ev.item;

            if (_this.netObj.isEdge(item)) {
                let indata = {};
                let modalVisible = true;
                let tableSelectDisable = true;
                let isAdd = false;
                let isUpdate = true;

                //console.log(_this.netObj.find(ev.item.get('model').from_field))
                indata.from = _this.netObj.find(ev.item.get('model').source).get('model').id;
                indata.to = _this.netObj.find(ev.item.get('model').target).get('model').id;
                indata.id = ev.item.get('model').id;
                indata.relation = _this.setRelation(ev.item.get('model').relation);
                indata.from_field = _this.state.formFiedId;
                indata.to_field = _this.state.toFiedId;
                _this.props.handleVal(indata, modalVisible, tableSelectDisable, isAdd, isUpdate);
            }
        });

        //鼠标按下时触发事件
        _this.netObj.on('itemmousedown', function(ev) {
            var item = ev.item;
            if (_this.netObj.isNode(item)) {
                _this.netObj.refresh();
            }
        });

        //鼠标点击后
        _this.netObj.on('itemmouseup', function(ev) {
            var item = ev.item;
            if (_this.netObj.isNode(item)) {
                _this.netObj.update(item, {shape: 'table'});
                _this.netObj.refresh();
            }
        });
        //鼠标移入时箭头改变颜色及相关属性高亮
        /*net.on('itemmouseenter', function(ev) {
            var item = ev.item;
            net.update(item, {color: 'red'});
            net.refresh();
        });
        //鼠标离开时触发事件
        net.on('itemmouseleave', function(ev) {
            var item = ev.item;
            net.update(item, {color: null});
            net.refresh();
        });*/
        this.setState({loading:false});
    }

    render() {
        return (
            <JfCard title={this.state.title} loading={this.state.loading} >
                <div id="c1" className="c1"></div>
                <Modal title={this.state.title} visible={this.state.modalVisible} width={400} height={500} onCancel={this.handCancel} footer={null}>
                    <List dataSource={this.state.updatefields} renderItem={item => (<List.Item>{item}</List.Item>)} style={{
                            height: '300',
                            overflow: "auto"
                        }}/>
                </Modal>
                {/*<div id="fc" className="fc">
                  <div className="fc_bg_black"></div>
                   <div className="fc_content">
                     <div className="fc_bg">
                     <div id="close" className="close"><p id="tabtitle"></p><button onClick={this.hide}><span className="ant-modal-close-x"></span></button></div>
                     <div id="content_main" className="content">

                     </div>
                       </div>
                     </div>
                </div>*/
                }

            </JfCard> );
    }
}
