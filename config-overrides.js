let path = require('path');

const pageRootUrl = path.resolve(__dirname, 'src/pages');
const shaderRootUrl = path.resolve(__dirname, 'src/shaders');

module.exports = function override(config) {
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
                '@page': pageRootUrl,
                '@shader': shaderRootUrl
            }
        }
    }
    return overrideConf;
}
