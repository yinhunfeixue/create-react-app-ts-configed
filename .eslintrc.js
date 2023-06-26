module.exports = {
  extends: ['react-app'],
  parser: '@typescript-eslint/parser',
  rules: {
    'jsx-a11y/anchor-is-valid': 0,
    'no-redeclare': 0,
    /*****************防止代码无效内容太多*****************/
    //使用console会有警告
    'no-console': 'warn',
    //禁止出现未使用的变量
    'no-unused-vars': 'off',
    //不允许重复import
    'no-duplicate-imports': 'error',
    //强制使用单引号
    quotes: ['off', 'single'],
    //双峰驼命名格式
    camelcase: 0,
    "jsx-a11y/alt-text":"off",
    //大括号风格
    // 'brace-style': ['error', 'stroustrup'],
    //禁止出现重复的 case 标签
    'no-duplicate-case': 'error',

        /********************空格规则***********************/
        //不能用多余的空格
        'no-extra-semi': 0,
        //缩进用2个空格
        indent: 0,
        //函数定义时,括号前面要不要有空格
        'space-before-function-paren': 0,
        //禁止使用多个空格
        'no-multi-spaces': 0,
        //es6 箭头符号前后都要有空格
        'arrow-spacing': 0,
        //操作符前后必须有空格
        'space-infix-ops': 0,
        //逗号前面不允许有空格，后面必须有空格
        'comma-spacing': 0,

        /************禁用旧写法*************/
        //不能使用var定义变量
        'no-var': 0,

        //块级内部前后不添加空行，例如
        //function aaa(){
        //这里不能有空行
        //    let a = 1;
        //这里不能有空行
        //}
        'padded-blocks': 'off',
        //a标签允许没有内容
        'jsx-a11y/anchor-has-content': 'off',
        'no-useless-concat': 'off',
        'react/jsx-key': 0,
        'react/jsx-no-undef': 0,
        'mport/first': 0,
        'no-unde': 0,
        'no-restricted-global': 0,
        'no-duplicate-imports': 0,
        eqeqeq: 0,
        'no-console': 0,
        'import/no-anonymous-default-export': 0,
        '@typescript-eslint/no-unused-vars': 0,
        'react-hooks/exhaustive-deps': 0,
        'array-callback-return': 0,
        'no-useless-escape': 0,
        'no-self-assign': 0,
        'no-mixed-operators': 0,
        'react-hooks/rules-of-hooks': 0,
        'react-hooks/rules-of-hooks': 0,
        'import/first': 0,
        'no-undef': 0,
        'no-restricted-globals': 0,
        'no-unused-expressions': 0,
        'no-dupe-keys': 0,
        'react/no-direct-mutation-state': 0,
        'default-case': 0,
        'no-dupe-class-members': 0,
        'no-useless-constructor': 0,
        'no-sequences': 0,
        'no-label-var': 0,
        'no-template-curly-in-string': 0,
        'no-unused-labels': 0,
        'no-labels': 0,
        'no-lone-blocks': 0,
        'no-unreachable': 0,
        'no-whitespace-before-property': 0,
        'react/jsx-no-duplicate-props': 0,
        'no-loop-func': 0,
        'rest-spread-spacing': 0,
        'react/jsx-no-target-blank': 0,
        'no-script-url': 0,
    },
}
