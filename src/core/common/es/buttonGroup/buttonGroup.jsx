import React from 'react'
import {Tag} from 'antd';

const CheckableTag = Tag.CheckableTag;

/*
props:
    tags : list  ['a','b','c'];
    onClick : function  callback
 */

export default class ButtonGroup extends React.Component {

    constructor(props){
        super(props);

        this.state={
            selectedTags: [this.props.defaultTag]
        }

        this.prevSelectedTag = this.props.defaultTag;
    }

    handleChange(tag, checked) {
        if (this.prevSelectedTag != tag) {
            if(this.props.onClick){
                this.props.onClick(tag);
            }
            this.prevSelectedTag = tag;
            this.setState({ selectedTags: tag });
        }
    }

    render() {
        const { selectedTags } = this.state;
        const { tags,tip} = this.props;
        return (
            <div>
                <strong >{tip?tip:''}</strong>
                {tags.length>0?tags.map((tag,key) => (
                    (tag.disabled)?<Tag key={key}>{tag.label}</Tag>:<CheckableTag
                        key={key}
                        checked={selectedTags==tag.value}
                        onChange={checked => this.handleChange(tag.value, checked)}
                    >
                        {tag.label}
                    </CheckableTag>
                )):undefined}
            </div>
        );
    }
}
