import React, {Component} from "react"

export default (auth) => (WrappedComponent) => class Authorization extends Component {
        render() {
            const isLogin = localStorage.getItem("login")
            console.log(auth,isLogin)
            const limit = {
                add:false,
                modify:false,
                delete:false,
                detail:false
            }
            return <div>
                {
                    isLogin
                    ? <WrappedComponent {...this.props} limit={limit}/>
                    : <div>权限不足</div>
                }
            </div>
        }
}
