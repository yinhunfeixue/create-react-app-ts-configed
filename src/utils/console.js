const Log1 = (data) => {
    try{
        console.log('%c ' + data, 'font-size:16px')
    } catch(err) {
        return
    }
}
const Log2 = (data) => {
    try{
        console.log('%c ' + data, 'color: red; font-size:16px')
    } catch(err){
        return
    }
}
const Log3 = (data) => {
    try{
        console.log('%c ' + data, 'color: blue; font-size:16px')
    } catch(err) {
        return
    }
}
const Log = (...data) => {
    try {
        console.log(...data)
    } catch(err) {
        return
    }
} 
const LogArr = (data) => {
    try {
        console.table(data)
    } catch(err) {
        return
    }
}

export const logNo1 = Log1
export const logNo2 = Log2
export const logNo3 = Log3
export const log = Log
export const logArr = LogArr