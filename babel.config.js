module.exports = {
    presets: ['react-app'],
    plugins: [
        [
            'import',
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: 'css',
            },
            'antd',
        ],
        [
            'import',
            {
                libraryName: 'antd-mobile',
                libraryDirectory: 'lib',
                style: 'css',
            },
            'antd-mobile',
        ],
        [
            'import',
            {
                libraryName: 'lz_antd',
                customName: require('path').resolve(__dirname, './customName.js'),
                style: require('path').resolve(__dirname, './styleName.js'),
            },
            'lz_antd',
        ],
        [
            'import',
            {
                libraryName: 'app_common',
                libraryDirectory: 'lib',
            },
            'app_common',
        ],
        [
            'import',
            {
                libraryName: 'app_component',
                libraryDirectory: 'lib',
            },
            'app_component',
        ],
        [
            '@babel/plugin-proposal-decorators',
            {
                legacy: true,
            },
        ],
        // "dynamic-import-split-require",
        // "dynamic-import-node"
    ],
}
