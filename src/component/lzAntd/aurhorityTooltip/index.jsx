import WrapAuth from '../../authority'
import React, { Component } from 'react'
import { Tooltip } from 'antd'

// const Content = (props) => {
//     return(<Button />)
// }

const AuthTooltip = (props) => {
    const Auth = WrapAuth(Tooltip, props)
    return <Auth />
}
export default AuthTooltip
