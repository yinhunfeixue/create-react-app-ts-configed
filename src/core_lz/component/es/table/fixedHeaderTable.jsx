import React, {Component} from 'react'
import _ from 'underscore';
import $ from './js/jquery.reveal';

/*
props:{
    table:htmlTable,
    pagination:htmlPagination,
    onClickPagination:翻页事件,
    sortField:排序字段,
    sortRule:排序规则,
    onClickSort:排序事件
}
*/
export default class FixedHeaderTable extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        if(this.props.table){
            let {table,pagination} = this.props;
            this.renderTable(table,pagination);
        }
        else {
            $(this.refs.tableHeaderFixed).html('');
            $(this.refs.tableBody).html('');
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.table){
            let {table,pagination} = nextProps;
            this.renderTable(table,pagination);
        }
        else {
            $(this.refs.tableHeaderFixed).html('');
            $(this.refs.tableBody).html('');
        }

    }

    isScrollEnd(){
        let scrollTop = $(window).scrollTop();
        let scrollHeight = $(document).height();
        let windowHeight = $(window).height();
    　　if(scrollTop + windowHeight === scrollHeight){
            return true;
        }
        return false;
    }

    tableScoll(){
        this.mousePosition = '';
        this.refs.scrollHeader.scrollLeft = this.refs.scrollBody.scrollLeft;

        $(this.refs.scrollBody).scroll(()=>{
            if(this.mousePosition==='right'){
                // if(!this.isScrollEnd()){
                //     window.scrollTo(0,this.refs.scrollBody.scrollTop)
                // }
                this.refs.scrollHeader.scrollLeft = this.refs.scrollBody.scrollLeft;
                this.refs.scrollCol.scrollTop = this.refs.scrollBody.scrollTop;
                window.scrollTo(0,$(document).height())
            }
        });
        $(this.refs.scrollCol).scroll(()=>{
            if(this.mousePosition==='left'){
                this.refs.scrollBody.scrollTop = this.refs.scrollCol.scrollTop;
                window.scrollTo(0,$(document).height())
            }
        });
        $(this.refs.scrollCol).mouseover(()=>{
            this.mousePosition = 'left';
        });
        $(this.refs.scrollBody).mouseover(()=>{
            this.mousePosition = 'right';
        });
    }

    bindPageEvent(){
        let _this = this;
        if(this.props.onClickPagination){
            $(this.refs.pagination).find('li:not(.ant-pagination-disabled)').click(function() {
                let page = $(this).find('a').attr('page');
                if(page!=undefined){
                    _this.props.onClickPagination(page);
                }
            })
        }
    }

    addSort(column){
        let upOn = '<span class="ant-table-column-sorter-up on" title="↑"><i class="anticon anticon-caret-up"></i></span>';
        let upOff = '<span class="ant-table-column-sorter-up off" title="↑"><i class="anticon anticon-caret-up"></i></span>';
        let downOn = '<span class="ant-table-column-sorter-down on" title="↓"><i class="anticon anticon-caret-down"></i></span>';
        let downOff = '<span class="ant-table-column-sorter-down off" title="↓"><i class="anticon anticon-caret-down"></i></span>';
        if(column.id===this.props.sortField){
            if(this.props.sortRule==='asc'){
                $($(column).children()[0]).append('<div class="ant-table-column-sorter">'+upOn+downOff+'</div>');
            }
            else {
                $($(column).children()[0]).append('<div class="ant-table-column-sorter">'+upOff+downOn+'</div>');
            }
        }
        else {
            $($(column).children()[0]).append('<div class="ant-table-column-sorter">'+upOff+downOff+'</div>');
        }
    };

    bindSortEvent(){
        let _this = this;
        _.map($(this.refs.tableHeaderFixed).find("td[id^='sort_']"),this.addSort.bind(this));
        _.map($(this.refs.headLeft).find("td[id^='sort_']"),this.addSort.bind(this));
        $(this.refs.tableHeaderFixed).find("td[id^='sort_']").click(function() {
            _this.props.onClickSort(this.id);
        });
        $(this.refs.headLeft).find("td[id^='sort_']").click(function() {
            _this.props.onClickSort(this.id);
        });
    }

    bindHoverEvent(){
        _.map($(this.refs.tableBody).find('tr'),(row,index)=>{
            $(row).hover(()=>{
                $(row).addClass('ant-table-row-hover');
                $($(this.refs.bodyLeft).find('tr')[index-1]).addClass('ant-table-row-hover').find("td").addClass("td_bg").children().css({"color":"#29203d"});
            },()=>{
                $(row).removeClass('ant-table-row-hover');
                $($(this.refs.bodyLeft).find('tr')[index-1]).removeClass('ant-table-row-hover').find("td").removeClass("td_bg").children().css({"color":"#fff"});
            });
        })
        _.map($(this.refs.bodyLeft).find('tr'),(row,index)=>{
            $(row).hover(()=>{
                $(row).addClass('ant-table-row-hover');
                $($(this.refs.tableBody).find('tr')[index+1]).addClass('ant-table-row-hover');
            },()=>{
                $(row).removeClass('ant-table-row-hover');
                $($(this.refs.tableBody).find('tr')[index+1]).removeClass('ant-table-row-hover');
            });
        })
    }

    renderTable(table,pagination){
        let _this = this;
        let header = [];
        let headerFixedLeft = [];
        let bodyFixedLeft = [];
        let widthRow = $('<tr></tr>');
        let titleRow = $('<div></div>');
        _.map(table.find('tr'),(row,index)=>{
            if(index===0){
                widthRow = row.cloneNode(true);
                header.push(widthRow);
            }
            else if ($($(row).children()[0]).hasClass('report_title_fixed')) {
                titleRow = row;
            }
            else if($($(row).children()[0]).hasClass('report_header_fixed')||$($(row).children()[0]).hasClass('left_header_fixed')){
                header.push(row);
                let headerRow = row.cloneNode(true);
                let content = $(headerRow).find('td.left_header_fixed');
                if(content.length>0){
                    headerFixedLeft.push($('<tr></tr>').html(content));
                }
            }
            else {
                let cloneRow = row.cloneNode(true);
                let content = $(cloneRow).find('td.row_header_fixed');
                if(content.length>0){
                    bodyFixedLeft.push($('<tr></tr>').html(content));
                }
            }
        });
        $(this.refs.tableTitle).html($(titleRow).find('span').html());
        $(this.refs.tableHeaderFixed).html(header);
        $(this.refs.tableBody).html(table);
        $(this.refs.headLeft).html(headerFixedLeft);
        $(this.refs.bodyLeft).html(bodyFixedLeft);
        let length = $($(this.refs.bodyLeft).children()[0]).children().length;
        $(this.refs.bodyLeft).prepend($('<tr></tr>').html($(widthRow.cloneNode(true)).children().slice(0,length)));
        $(this.refs.headLeft).prepend($('<tr></tr>').html($(widthRow.cloneNode(true)).children().slice(0,length)));
        $(this.refs.pagination).html(pagination||'');

        if(header.length===2){
            let emptyIndex = [];
            let width = 0;
            _.map($(header[1]).children(),(td,index)=>{
                if($.trim(td.innerHTML)===''){
                    emptyIndex.push(index);
                }
                else {
                    width+=parseInt($(header[0]).children()[index].style.width);
                }
            });
            for(let i=emptyIndex.length-1;i>=0;i--){
                _.map(header,(tr)=>{
                    $(tr).children().eq(emptyIndex[i]).remove();
                });
                _.map($(table).find('tr'),(tr)=>{
                    $(tr).children().eq(emptyIndex[i]).remove();
                });
                _.map($(this.refs.headLeft).find('tr'),(tr)=>{
                    $(tr).children().eq(emptyIndex[i]).remove();
                });
                _.map($(this.refs.bodyLeft).find('tr'),(tr)=>{
                    $(tr).children().eq(emptyIndex[i]).remove();
                });
            }
            $('.jrPage').width(width);
        }
        $(this.refs.tableHeaderContainer).width($(this.refs.tableBodyContainer).width());

        //去除最后的空白行
        let leftLength = $(this.refs.bodyLeft).find('tr').length+1;
        //固定列的行数大于0（排除用于定宽的第一行）
        if((leftLength>2)&&($(this.refs.tableBody).find('tr').length>leftLength)){
            _.map($(this.refs.tableBody).find('tr'),function(item,index) {
                if(index>=leftLength){
                    $(_this.refs.tableBody).find('tbody')[0].removeChild(item);
                }
            });
        }

        _.map($(this.refs.tableHeaderFixed).children(),(row,index)=>{
            // console.log($(row).children().height);
            $($($(this.refs.headLeft).children()[index]).children()).height($(row).children().height());
        });
        //滚动条同步
        this.tableScoll();
        //翻页
        this.bindPageEvent();
        //排序
        this.bindSortEvent();
        //高亮同步
        this.bindHoverEvent();

        $(".jrPage tbody tr td a").attr("data-reveal-id","myModal_1");

        // 表格样式
        $(".transaction_fixed_table .jrPage tr td").css({"border":"none","border-bottom":"1px solid #48405b","border-left":"1px solid #48405b"});
          $(".transaction_fixed_table .ant-table-scroll .ant-table-fixed .ant-table-tbody .jrPage").css({"background":"transparent"});
        $(".transaction_fixed_table .jrPage tr td span").css({"color":"#d8d7dc","font-size":"12px"});
        $(".transaction_fixed_table .jrPage tr td a span").css({"color":"#fff"});
        $(".ant-table-fixed .ant-table-tbody tr:first ").css({"height":"0"});
        $(".transaction_fixed_table  tr .left_header_fixed span").css({"color":"#fff"});
        $(".transaction_fixed_table  .ant-table-fixed-left tr .left_header_fixed ").css({"border":"1px solid #48405b","border-bottom":"none","border-right":"none"});
        // $(".transaction_fixed_table  .ant-table-fixed-left tr .left_header_fixed:last ").css({"border":"1px solid #48405b","border-bottom":"none","border-left":"1px solid #48405b"});


        // 左宽度
        $(".row_header_fixed span").css({"font-size":"12px"});
        $(".report_title_fixed").parent("tr").css({"display":"none"})
        // $(".ant-table-fixed .ant-table-thead tr td.left_header_fixed:last").css({"border-right":"none"})
        // $(".ant-table-fixed-left .ant-table-body-outer table tr:odd td").css({"background-color":"#3c334a"});
        // $(".ant-table-fixed-left .ant-table-body-outer table tr:odd td.tb_bg").css({"background-color":"#cecee1"});
        $(".ant-table-fixed .ant-table-tbody tr td.row_header_fixed").css({"border-right":"none","border-bottom":"none","border-left":"none","border-top":"1px solid #48405b"});
        $(".ant-table-fixed .ant-table-thead tr td span").css({"font-size":"12px"});
        $(".ant-table-fixed-left .ant-table-body-outer table tr td span").css({"color":"#fff"});



        $(".transaction_fixed_table  tr .report_header_fixed span").css({"color":"#fff"});
        $(".transaction_fixed_table  tr .report_header_fixed ").css({"border":"none","border-left":"1px solid #48405b","border-top":"1px solid #48405b","border-bottom":"none"});
        $(".transaction_fixed_table .jrPage .total_header").parent("tr").children("td").find("span").css({"color":"#2e203d"});
        $(".transaction_fixed_table .jrPage .subtotal_header").parent("tr").children("td").find("span").css({"color":"#2e203d"});
        $(".transaction_fixed_table .ant-table-fixed .ant-table-tbody .jrPage tr td").css({"border":"1px solid #48405b","border-right":"none","border-left":"none","border-bottom":"none"});
        // $(".transaction_fixed_table .ant-table-fixed .ant-table-tbody .jrPage tr:first td").css({"border-bottom":"none","border-top":"none"});
        // $(".transaction_t_width .transaction_fixed_table .ant-table-fixed .ant-table-tbody .jrPage tr td").css({"border-left":"none"});
        $(".ant-table-column-sorter ").parent().parent().css({"cursor":"pointer"})
        // $(".ant-col-coop_tab_qh .ant-radio-group-large label:nth-child(1)").parent().parent().parent().parent().addClass("dddfffff");

        $(".transaction_fixed_table .ant-table-body table tbody tr").mouseover(function(){
         $(this).find("span").css("color","#29203d");
         $(this).find("a").find("span").css("color","#400fdf");
         $(this).find(".subtotal_header").parent("tr").find("span").css("color","#2e203d");
          $(this).find(".total_header").parent("tr").find("span").css("color","#2e203d");
       });
       $(".transaction_fixed_table .ant-table-body table tbody tr").mouseout(function(){
         $(this).find("span").css("color","#d8d7dc");
         $(this).find("a").find("span").css("color","#fff");
         $(this).find(".subtotal_header").parent("tr").find("span").css("color","#2e203d");
         $(this).find(".total_header").parent("tr").find("span").css("color","#2e203d");
       });

       $(".transaction_fixed_table .jrPage .total_header").parent("tr").children("td").css({"background":"#d7d1e2"});
        $(".transaction_fixed_table .jrPage .subtotal_header").parent("tr").children("td").css({"background":"#d7d1e2"});
        $(".dev_cooper .left_header_fixed").css({"height":"62px"});
        $(".transaction_leftfixed_height .transaction_fixed_table  .ant-table-fixed-left tr .left_header_fixed").css({"height":"40px"});
        $(".limithold_leftfixed_height .transaction_fixed_table  .ant-table-fixed-left tr .left_header_fixed").css({"height":"30px"});
        $(".jrPage tbody tr .drill_down_field a").click(function(e){
       e.preventDefault()
       var number = $(this).attr("href");
       $("#myModal_1 iframe").attr("src",number);

     })
        // 弹出框
       $('a[data-reveal-id]').on('click', function(e) {
       		e.preventDefault();
       		var modalLocation = $(this).attr('data-reveal-id');
       		$('#'+modalLocation).reveal($(this).data());
       	});
    }
    render(){
        return (<div className={this.props.className}>
          <div className="fixedheader_iframe">
            <div id="myModal_1" className="reveal-modal"><h1></h1><div>
            <iframe src="" width="100%" height="300"  ></iframe></div>
            <a className="close-reveal-modal">&#215;</a></div>
          </div>
          {/*<div className="ant-table-wrapper transaction_fixed_table">
            <div className="ant-spin-nested-loading">
                <div className="ant-spin-container">
                    <div className="ant-table ant-table-large ant-table-fixed-header ant-table-scroll-position-left">
                        <div className="ant-table-content">
                            <div className="ant-table-scroll">
                                <div className="ant-table-header" style={{marginBottom: '0px', paddingBottom: '0px'}}>
                                    <table>
                                        <thead className="ant-table-thead" ref="tableHeaderFixed"></thead>
                                    </table>
                                </div>
                                <div ref="tableBody" className="ant-table-body fixedheadertable_body" style={{maxHeight: '480px', overflowY: 'scroll'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>*/}
        <div className="ant-table-wrapper transaction_fixed_table">
                <div ref="tableTitle" className="top_header_text"></div>
                <div className="ant-spin-nested-loading">
                    <div className="ant-spin-container">
                        <div className="ant-table ant-table-middle ant-table-fixed-header ant-table-scroll-position-left">
                            <div className="ant-table-content">
                                <div className="ant-table-scroll">
                                    <div className="ant-table-header" ref="scrollHeader">
                                        <table className="ant-table-fixed" ref="tableHeaderContainer">
                                            <thead className="ant-table-thead" ref="tableHeaderFixed"></thead>
                                        </table>
                                    </div>


                                    <div className="ant-table-body" ref="scrollBody"
                                    style={{overflowX: 'auto', maxHeight: '447px', overflowY: 'scroll'}}>
                                        <table className="ant-table-fixed" ref="tableBodyContainer">
                                            <tbody className="ant-table-tbody" ref="tableBody">
                                            </tbody>
                                        </table>
                                    </div>


                                </div>
                                <div className="ant-table-fixed-left" >
                                    <div className="ant-table-header">
                                        <table className="ant-table-fixed">
                                            <thead className="ant-table-thead" ref="headLeft">
                                            </thead>
                                        </table>
                                    </div>
                                    <div className="ant-table-body-outer" style={{ paddingBottom: '0px'}}>
                                        <div className="ant-table-body-inner" style={{maxHeight: '429px',overflow: 'hidden',overflowY: 'scroll'}} ref="scrollCol">
                                            <table className="ant-table-fixed">
                                                <tbody className="ant-table-tbody" ref="bodyLeft">
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="ant-table-fixed-right">
                                    <div className="ant-table-header">
                                        <table className="ant-table-fixed">
                                        </table>
                                    </div>
                                    <div className="ant-table-body-outer" style={{marginBottom: '-17px', paddingBottom: '0px'}}>
                                        <div className="ant-table-body-inner" style={{maxHeight: '439px', overflowY: 'scroll'}}>
                                            <table className="ant-table-fixed">
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div ref="pagination"></div>
                    </div>
                </div>
            </div>
      </div>);
    }
}
