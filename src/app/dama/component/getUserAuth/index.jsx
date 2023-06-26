import Cache from 'app_utils/cache'
import _ from 'underscore'

const getUserAuth = () => {
    let flag = false
    const userinfo = Cache.get('userinfo')
    console.log(userinfo, '---userinfouserinfo--')
    if( userinfo.role ){ 
        const role = userinfo.role.split(',')
        for(let i=0; i<role.length; i++){
            if(role[i].indexOf('Admin')>-1){
                flag = true
                break
            }
        }
            
    }
    return flag
}

export default getUserAuth