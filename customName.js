const path = require('path')
module.exports = function customName(name) {
    if (name === 'button') {
        return 'app_component_main/lzAntd/aurhorityButton/index.jsx'
    }
    if (name === 'tooltip') {
        return 'app_component_main/lzAntd/aurhorityTooltip/index.jsx'
    }
    if (name === 'switch') {
        return 'app_component_main/lzAntd/aurhoritySwitch/index.jsx'
    }
    return `antd/lib/${name}`
}   