module.exports = function override(config, env) {
    const {module:{rules:rules}} = config;
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
        }
    }
    console.log('重构~', overrideConf);
    return overrideConf;
}
