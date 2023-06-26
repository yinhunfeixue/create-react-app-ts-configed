import React, {Component} from 'react'
import {JfCard} from '../common';

const $ =  require('jquery');
const echarts = require('echarts');

export default class BaseComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:this.props.title
        };
        let _this = this;
        this.defaultOption = {};
    }

    resize(){
        console.log('21312');
        this.chart.resize();
    }
    render(){
        return (<JfCard title={this.state.title||''}>
            <div className="markets_exponent_chart">
                <div ref="chart" style={{width:'100%',height:'100%'}}></div>
            </div>
        </JfCard>);
    }
}
