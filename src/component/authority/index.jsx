import React from 'react'

const authorityComponent = (WrappedComponent, data) => {
    return class extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                ifHave: true,
                replaceShowContext: this.props.replaceShowContext || null, // 没有权限情况下，可能要显示的文本内容
            }
        }
        render() {
            const { replaceShowContext } = this.state
            return <WrappedComponent {...data} />
        }
    }
}
export default authorityComponent
