let path = require('path');

const baseUrl = path.resolve(__dirname, 'src');

module.exports = function override(config, env) {
    const {module: {rules: rules}, resolve, resolve: {alias}} = config;
    const overrideConf = {
        ...config,
        module: {
            rules: [
                ...rules,
                {
                    test: /.glsl$/,
                    use: 'raw-loader',
                    type: 'javascript/auto'
                }
            ]
        },
        resolve: {
            ...resolve,
            alias: {
                ...alias,
                '@': baseUrl
            }
        }
    }
    return overrideConf;
}
