/* module.exports = {
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        semi: "error",
        "array-callback-return": "warn",
        "default-case": [
            "warn",
            {
                commentPattern: "^no default$",
            },
        ],
        eqeqeq: ["warn", "smart"],
    },
    extends: [],
}; */

// extends 继承现有的规则
/* module.exports = {
    extends: ["react-app"],
    rules: {
        eqeqeq: ["warn", "smart"],
    },
}; */

module.exports = {
    // 继承 Eslint 规则
    extends: ["eslint:recommended"],
    parser: "@babel/eslint-parser", // 支持最新的最终 ECMAScript 标准
    env: {
        node: true, // 启用node中全局变量
        browser: true, // 启用浏览器中全局变量
    },
    plugins: ["import"], // 解决动态导入import语法报错问题
    parserOptions: {
        ecmaVersion: 6, // es6
        sourceType: "module", // es module
    },
    rules: {
        "no-var": 2, // 不能使用 var 定义变量
    },
};
