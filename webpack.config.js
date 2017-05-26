var path = require('path'),
    webpack = require('webpack'),
    ExtracTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin')

var isProduction = process.env.NODE_ENV === "production";
var isDev = process.env.NODE_ENV === "development";

var publicPath = "/dist/",
    filename = "build.js";
if (isProduction) {
    //这里得加上项目名称
    publicPath = "/cnode-vue/dist/";
    filename = "build-[hash:8].js";
}

module.exports = {
    debug: true,
    entry: {
        main: "./src/main.js",
        common: ["jquery", "vue", "vue-router", "vuex", "./src/assets/plugins/simplemde/simplemde.min.js"]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: publicPath,
        filename: filename,
        chunkFilename: "[id].build-[hash:8].js"
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                postcss: [
                  require('autoprefixer')({
                    browsers: ['last 3 versions']
                  })
                ]
            }
        }, {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: ExtracTextPlugin.extract({
                fallbackLoader: "style-loader",
                loader: "css-loader?sourceMap"
            })
        }, {
            test: /\.(sass|scss)$/,
            loader: ExtracTextPlugin.extract({
                fallbackLoader: "style-loader",
                loader: "css-loader?sourceMap!sass-loader"
            })
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file',
            query: {
                name: '[name].[ext]?[hash]'
            }
        }, {
            test: /\.(eot|ttf|woff)$/,
            loader: 'file'
        }, {
            test: /\.md$/,
            loader: 'file',
            query: {
                name: "[name].[ext]?[hash]"
            }
        }]
    },
    resolve: {
        extension: ["", ".js"]
    },
    plugins: [
        //提取公共代码，在有多个entry时，这些入口文件可能会有一些公共代码
        //将entry中common包含的文件提取到公共js中
        new webpack.optimize.CommonsChunkPlugin({
            name: ["common"],
            filename: isProduction && "common-[hash:8].js" || "common.js",
            minChunks: Infinity
        }),
        new ExtracTextPlugin({
            filename: isProduction && "style-[hash:8].css" || "style.css",
            allChunks: true,
            disable: false
        }),
        //设置全局变量$和jQuery
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })

    ],
    devServer: {
        publicPath: "/dist/",
        historyApiFallback: true,
        noInfo: true,
        proxy: {
            "/api/*": {
                target: 'https://cnodejs.org',
                host: "cnodejs.org"
            }
        }
    },
    devtool: '#eval-source-map'
}

if (isProduction) {
    module.exports.devtool = '#source-map'
        // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new CleanWebpackPlugin(["./dist"], {
            "verbose": true, //log到console
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        //JS压缩
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        //将上面生成的js和css的引用追加到./src/html-tpl/tpl.html中，并重新生成index.html
        new HtmlWebpackPlugin({
            filename: "../index.html",
            template: "./src/html-tpl/tpl.html"
        })
    ])
}
