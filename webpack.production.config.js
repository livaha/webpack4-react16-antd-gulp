const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
let GLOBALS = {
    DEFINE_OBJ: {
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: true,
    },
  
    folders: {
      SRC: path.resolve(__dirname, 'src'),
      COMPONENT: path.resolve(__dirname, 'src/components'),
      BUILD: path.resolve(__dirname, 'build'),
      BOWER: path.resolve(__dirname, 'bower_components'),
      NPM: path.resolve(__dirname, 'node_modules'),
    },
};
  
module.exports = {
    mode:'production',
    entry: {
        bundle: path.resolve(__dirname, './src/index_pub.js'),
        //添加要打包在vendor里面的库
        //vendors: ['react','react-dom','react-router'],
    },
    output: {
        path: GLOBALS.folders.BUILD,
        filename: 'scripts/[name].bundle.js',
        //filename: 'scripts/[name][hash].js'
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // 将 JS 字符串生成为 style 节点
                }, {
                    loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                }, {
                    loader: "sass-loader" // 将 Sass 编译成 CSS
                }]
            },
            {   //使用css配置
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            //{
            //    //使用less配置
            //    test: /\.less$/,
            //    loader: "style-loader!css-loader"
            //},
            {
              test: /\.less$/,
              exclude: /\.module\.less$/,     
              use: [
                'style-loader',
                { loader: 'css-loader', options: { importLoaders: 1 } },
                'less-loader'
              ]
            },
            // {
            //     test: /\.(png|jpg|gif)$/,
            //     use: [
            //       {
            //         loader: 'file-loader',
            //         options: {
            //             //编译出来是项目中对应图片文件夹的文件目录
            //             // name: 'images/[path][name].[ext]'  
            //             name: 'images/[hash].[ext]',//所有图片在一个目录
            //         }
            //       }
            //     ]
            //   }

           {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'images/[hash].[ext]',//所有图片在一个目录
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
      alias: {
        // 全局相对路径别名，处理相对路径过长和繁琐问题
        '@': GLOBALS.folders.SRC
      },
    },
    performance: {
        hints: false
    },
    optimization: {
        splitChunks: {
          cacheGroups: {
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all'
            }
          }
        }
    },
    // devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({//设置成production去除警告
            'process.env':{
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
          favicon: 'src/favicon.ico', //favicon存放路径
          filename: 'index.html', //生成的html存放路径，相对于 path
          template: 'src/index_pub.html', //html模板路径
          inject: true, //允许插件修改哪些内容，包括head与body
          hash: true, //为静态资源生成hash值
          //chunks: ['manifest', 'vendors', 'app'], //需要引入的chunk，不配置就会引入所有页面的资源.名字来源于你的入口文件
          minify: { //压缩HTML文件
            removeComments: false, //移除HTML中的注释
            collapseWhitespace: true //删除空白符与换行符
          }
        }),
        new CleanWebpackPlugin(['dist',
            'build'], {
            root:__dirname,
            verbose: true,
            dry: false,
            exclude: ['jslibs']
        })
    ]
};