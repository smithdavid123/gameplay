const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

const CompressionPlugin = require('compression-webpack-plugin');
const UglifyPlugin = require('uglifyjs-webpack-plugin');

const name = '后台管理系统';

const isprod = process.env.NODE_ENV === 'production';
const isdev = process.env.NODE_ENV === 'development';

module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: isdev,
    productionSourceMap: false,
    configureWebpack: (config) => {
        config.name = name;
        // 生产环境
        if (isprod) {
            // 代码压缩
            config.plugins.push(
                new UglifyPlugin({
                    uglifyOptions: {
                        // 生产环境自动删除console
                        compress: {
                            'warnings': false,
                            'drop_debugger': true,
                            'drop_console': true,
                            'pure_funcs': ['console.log']
                        }
                    },
                    sourceMap: false,
                    parallel: true
                })
            );
        }
        // 开发环境
        if (isdev) {
            config.devServer = {
                disableHostCheck: true
            };
        }
    },
    chainWebpack: (config) => {
        config.plugins.delete('preload');
        config.plugins.delete('prefetch');
        config
            .entry('index')
            .add('babel-polyfill')
            .end();
        // svg loader
        const svgRule = config.module.rule('svg');
        svgRule.uses.clear();
        svgRule.exclude.add(/node_modules/);
        svgRule
            .test(/\.svg$/)
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            });
        // 压缩图片
        // config.module
        //   .rule('images')
        //   .use('image-webpack-loader')
        //   .loader('image-webpack-loader')
        //   .options({ bypassOnDebug: true })
        //   .end()
        config.module
            .rule('vue')
            .exclude
            .add(/node_modules/)
            .end()
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = false;
                return options;
            })
            .end();
        // 添加地址索引
        config.resolve.alias
            .set('@', resolve('src'));
        // 生产环境
        if (isprod) {
            // 启用GZip压缩
            config
                .plugin('compression')
                .use(CompressionPlugin, {
                    asset: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8,
                    cache: true,
                    deleteOriginalAssets: true // 删除原文件
                })
                .tap(args => {
                    // do nothing.
                });
            // 压缩代码
            config.optimization.minimize(true);
            config.optimization.runtimeChunk('single');
            // 公共代码抽离
            config
                .optimization.splitChunks({
                    chunks: 'all',
                    cacheGroups: {
                        vendor: {
                            name: 'chunk-vendor',
                            test: /[\\/]node_modules[\\/]/,
                            minChunks: 1,
                            maxInitialRequests: 5,
                            minSize: 0,
                            priority: 10,
                            chunks: 'initial'
                        },
                        elementUI: {
                            name: 'chunk-elementUI',
                            priority: 11,
                            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
                        },
                        vue: {
                            name: 'chunk-vue',
                            minSize: 30000,
                            priority: 12,
                            test: /[\\/]node_modules[\\/]_?vue(.*)/
                        },
                        commons: {
                            name: 'chunk-commons',
                            test: resolve('src/components'), // can customize your rules
                            minChunks: 3, //  minimum common number
                            priority: 5,
                            reuseExistingChunk: true
                        }
                    }
                });
        }
    },
    // 配置 webpack-dev-server
    devServer: {
        open: true,
        port: 9527,
        hotOnly: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                // target: 'http://d.xinyong002.com',
                target: 'http://203.86.235.58:8108',
                changeOrigin: true,
                ws: false,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        },
        before: app => {
            // do nothing
        }
    },
    parallel: require('os').cpus().length > 1,
    // 三方插件的选项
    pluginOptions: {},
    // CSS 相关选项
    css: {
        loaderOptions: {
            sass: {
                prependData: `
				@import '~@/style/global.scss';
				`
            }
        }
    }
};