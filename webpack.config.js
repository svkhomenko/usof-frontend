const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        // 'react-hot-loader/patch',
        path.resolve(__dirname, 'src', 'index.js')
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        // sourceMapFilename: "[name].js.map",
        // publicPath: '/images/'
        publicPath: '/'     ///
    },
    devServer: {
        historyApiFallback: true,
        open: true,         ///
        hot: true,
        compress: true,     ///
        static: {
            directory: path.join(__dirname, "./")
        }
    },
    devtool: "source-map",
    // devtool: 'eval-source-map',
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        alias: {
            react: path.join(__dirname, 'node_modules', 'react'),
            process: "process/browser"
        },
        fallback: {
            "fs": false,
            "path": false,
            // "path": require.resolve("path-browserify"),
            "buffer": require.resolve("buffer/"),
            "assert": false
        } 
    },
    module: {
        rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
            },
            // enforce: "pre",
            // use: [
            // {
            //     loader: "source-map-loader"
            // },
            // {
            //     loader: 'babel-loader',
            // },
            // ]
        },
        {
            test: /\.css$/,
            use: [
            {
                loader: 'style-loader',
            },
            {
                loader: 'css-loader',
            },
            ],
        },
        {
            test: /\.(gif|svg|jpg|png)$/,
            // use: {
            //     loader: "file-loader",
            // },
            loader: "file-loader",
            options: {
                name: '/src/images/[name].[ext]'
            }
        }
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],        
};

