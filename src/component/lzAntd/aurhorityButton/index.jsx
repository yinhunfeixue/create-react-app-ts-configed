import WrapAuth from '../../authority'
import React, { Component } from 'react'
import { Button } from 'antd'

// const Content = (props) => {
//     return(<Button />)
// }

const AuthButton = (props) => {
    const Auth = WrapAuth(Button, props)
    return <Auth />
}
export default AuthButton
