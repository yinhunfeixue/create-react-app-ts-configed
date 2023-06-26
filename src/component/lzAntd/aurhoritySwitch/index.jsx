import WrapAuth from '../../authority'
import React, { Component } from 'react'
import { Switch } from 'antd'

// const Content = (props) => {
//     return(<Button />)
// }

const AuthSwitch = (props) => {
    const Auth = WrapAuth(Switch, props)
    return <Auth />
}
export default AuthSwitch
