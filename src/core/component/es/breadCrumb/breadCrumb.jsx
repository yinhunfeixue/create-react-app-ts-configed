import React, {Component} from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Breadcrumb } from 'antd';
import {Link} from 'react-router-dom';

export default class BreadCrumb extends Component {

    render() {
        const {breadCrumbList} = this.props;

        return (
            <Breadcrumb>
                {
                    breadCrumbList.length > 0
                        ? breadCrumbList.map((breadCrumb, key) => (
                            breadCrumb.link
                            ? <Breadcrumb.Item key={key}>
                                <Link to={breadCrumb.link}><LegacyIcon type={breadCrumb.icon}/>
                                    <span>{breadCrumb.label}</span>
                                </Link>
                            </Breadcrumb.Item>
                            : <Breadcrumb.Item key={key}>
                                <LegacyIcon type={breadCrumb.icon}/>
                                <span>{breadCrumb.label}</span>
                            </Breadcrumb.Item>))
                        : undefined
                }
            </Breadcrumb>
        );
    }
}
