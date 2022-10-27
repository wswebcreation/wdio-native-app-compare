module.exports = {
    extends: ['eslint:recommended', 'prettier'],
    env: {
        node: true,
        es6: true,
    },
    globals: {
        $: true,
        $$: true,
        browser: true,
        driver: true,
    },
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 2016,
        requireConfigFile: false,
        sourceType: 'module',
    },
    rules: {
        semi: ['error', 'never'],
        quotes: ['error', 'single'],
        indent: [2, 4],
    },
}
