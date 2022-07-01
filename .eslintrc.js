module.exports = {
    extends: ['eslint:recommended'],
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
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2016,
        sourceType: 'module',
    },
    rules: {
        semi: ['error', 'never'],
        quotes: ['error', 'single'],
        indent: [2, 4],
    },
}
