import {notification} from 'antd'
// key是一个 防止页面打开多个
import './style.less'

// btn	自定义关闭按钮	
// className	自定义 CSS class	
// description	通知提醒内容，必选	
// duration	默认 4.5 秒后自动关闭，配置为 null 则不自动关闭	
// icon	自定义图标	
// key	当前通知唯一标志	
// message	通知提醒标题，必选	
// placement	弹出位置，可选 topLeft topRight bottomLeft bottomRight	
// style	自定义内联样式	
// onClose	点击默认关闭按钮时触发的回调函数	
// onClick	点击通知时触发的回调函数
// const NotificationWrap = (param) => {
//     console.log(param,'paramparam')
//     notification[param.type]({
//         key: param.key?param.key:uniqueKey,
//         message: param.message,
//         description: param.description,
//         duration: param.duration?param.duration:3,
//         icon: param.icon,
//         className: param.className?param.className:'notificationContainer',
//         style: {...param.style},
//         btn: param.btn,
//         placement: param.placement?param.placement:'topLeft',
//         onClose: param.onClose,
//         onClick: param.onClick
//     })
// }

// 如果要使改动较小，在后面直接罗列出来参数，而不是传对象进来
//类似于message.error('aaaa') 这里key 不传就表示页面中只能一个提示框

const uniqueKey = (new Date()).getTime()
const NotificationWrap = {
    success:  (message, description, key, duration, placement, className, style, icon, onClose, onClick, btn) => {
        if(!message){
            return false
        }else{
            notification.destroy()
            notification.success({
                key: key?key:uniqueKey,
                message: message,
                description: description?description: null,
                duration: duration?duration:3,
                icon: icon?icon:null,
                className: className?className:'notificationContainer',
                style: {...style},
                btn: btn?btn:null,
                placement: placement?placement:'topLeft',
                onClose: onClose?onClose:null,
                onClick: onClick?onClick:null
            })
        }
    },
    error:  (message, description, key, duration, placement, className, style, icon, onClose, onClick, btn) => {
        if(!message){
            return false
        }else{
            notification.destroy()
            notification.error({
                key: key?key:uniqueKey,
                message: message,
                description: description?description: null,
                duration: duration?duration:3,
                icon: icon?icon:null,
                className: className?className:'notificationContainer',
                style: {...style},
                btn: btn?btn:null,
                placement: placement?placement:'topLeft',
                onClose: onClose?onClose:null,
                onClick: onClick?onClick:null
            })
        }
    },
    warning:  (message, description, key, duration, placement, className, style, icon, onClose, onClick, btn) => {
        if(!message){
            return false
        }else{
            notification.destroy()
            notification.warning({
                key: key?key:uniqueKey,
                message: message,
                description: description?description: null,
                duration: duration?duration:3,
                icon: icon?icon:null,
                className: className?className:'notificationContainer',
                style: {...style},
                btn: btn?btn:null,
                placement: placement?placement:'topLeft',
                onClose: onClose?onClose:null,
                onClick: onClick?onClick:null
            })
        }
    },
    info:  (message, description, key, duration, placement, className, style, icon, onClose, onClick, btn) => {
        if(!message){
            return false
        }else{
            notification.destroy()
            notification.info({
                key: key?key:uniqueKey,
                message: message,
                description: description?description: null,
                duration: duration?duration:3,
                icon: icon?icon:null,
                className: className?className:'notificationContainer',
                style: {...style},
                btn: btn?btn:null,
                placement: placement?placement:'topLeft',
                onClose: onClose?onClose:null,
                onClick: onClick?onClick:null
            })
        }
    },
    open:  (message, description, key, duration, placement, className, style, icon, onClose, onClick, btn) => {
        if(!message){
            return false
        }else{
            notification.destroy()
            notification.open({
                key: key?key:uniqueKey,
                message: message,
                description: description?description: null,
                duration: duration?duration:3,
                icon: icon?icon:null,
                className: className?className:'notificationContainer',
                style: {...style},
                btn: btn?btn:null,
                placement: placement?placement:'topLeft',
                onClose: onClose?onClose:null,
                onClick: onClick?onClick:null
            })
        }
    },
    close:  (key) => {
        if(!key){
            return false
        }else{
            notification.close({
                key
            })
        }
    },
    destroy:  () => {
        notification.destroy()
    }
}

export default NotificationWrap;
