import React from 'react'
import { Icon } from 'antd'
import DeleteViewIcon from 'app_images/kws/DeleteViewIcon.svg'
import SettingViewIcon from 'app_images/kws/SettingViewIcon.svg'
import SettingHover from 'app_images/kws/SettingHover.svg'
import TagSelectIcon from 'app_images/kws/TagSelectIcon.svg'
import HelpIcon from 'app_images/HelpIcon.svg'
import HelpHover from 'app_images/HelpHover.svg'
import SelectedIcon from 'app_images/kws/SelectedIcon.svg'
import TagSaveIcon from 'app_images/kws/TagSaveIcon.svg'
import CollapseIcon from 'app_images/kws/CollapseIcon.svg'
import CollapseHover from 'app_images/kws/CollapseHover.svg'
import ExpendIcon from 'app_images/kws/ExpendIcon.svg'
import ExpendHover from 'app_images/kws/ExpendHover.svg'

const SvgViewChart = {
    'DeleteViewIcon': {
        'name': '删除',
        'img': <img src={DeleteViewIcon} />,
    },
    'SettingViewIcon': {
        'name': '设置',
        'img': <img src={SettingViewIcon} />,
        'hover': <img src={SettingHover} />
    },
    'TagSelectIcon': {
        'name': '标签选中状态',
        'img': <img src={TagSelectIcon} />,
    },
    'HelpIcon': {
        'name': '帮助',
        'img': <img src={HelpIcon} />,
        'hover': <img src={HelpHover} />
    },
    'SelectedIcon': {
        'name': '选中',
        'img': <img src={SelectedIcon} />,
    },
    'TagSaveIcon': {
        'name': '视图保存',
        'img': <img src={TagSaveIcon} />,
    },
    'CollapseIcon': {
        'name': '收起',
        'img': <img src={CollapseIcon} />,
        'hover': <img src={CollapseHover} />
    },
    'ExpendIcon': {
        'name': '展开',
        'img': <img src={ExpendIcon} />,
        'hover': <img src={ExpendHover} />
    }
}

export default SvgViewChart
