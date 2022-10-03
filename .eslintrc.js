module.exports = {
    root: true,
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ['plugin:vue/essential', 'prettier', 'eslint:recommended'],
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ['vue', 'prettier'],
    rules: {
        'prettier/prettier': [
            'error',
            {
                tabWidth: 4,
                singleQuote: true,
            },
        ],
        'arrow-body-style': 'off',
    },
};
