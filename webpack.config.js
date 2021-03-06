const path = require('path');
const webpack = require('webpack');
const chokidar = require('chokidar'); // hot reload for html, webpack-dev-server has include this plugin.
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const terserPlugin = require("terser-webpack-plugin"); // minify js
const optimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cleanWebpackPlugin = require('clean-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

/**
 * CLI can use below variables of `env` object params:
 * name       - project name
 * entry      - js entry
 * template   - html template
 * output     - path output
 * publicPath - prefix path for static file, used to on the production mode
 */
module.exports = ({
  name = 'app',
  entry = './index.js',
  template = './index.html',
  output = './dist',
  publicPath = '/',
} = {}) => {
  // it get the filename form whole file path without the extension
  const getFilename = (pathString) => path.parse(pathString).name;

  // All absolute path, here is about project root path, output, HTML actual path
  const projectPath = path.resolve(__dirname, name);
  const outputPath = path.resolve(__dirname, name, output);
  const htmlPath = path.resolve(__dirname, name, template);
  return {
    context: projectPath,
    entry: {
      [getFilename(entry)]: entry
    },
    output: {
      path: outputPath,
      filename: devMode ? '[name].js' : '[name].[contenthash:8].js',
      publicPath: devMode ? '/' : publicPath,
    },
    optimization: {
      minimizer: [
        new terserPlugin(),
        new optimizeCSSAssetsPlugin()
      ],
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    devServer: {
      before(app, server) {
        // hot reload for html
        chokidar.watch(htmlPath).on('all', function() {
          server.sockWrite(server.sockets, 'content-changed');
        })
      },
      port: 8000,
      hot: true,
      open: true
    },
    plugins: [
      new htmlWebpackPlugin({
        filename: getFilename(template) + '.html',
        template: template
      }),
      new miniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[contenthash:8].css',
      }),
      new cleanWebpackPlugin(devMode ? '' : outputPath),
      devMode ? new webpack.HotModuleReplacementPlugin() : new webpack.HashedModuleIdsPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.(js)$/,
          use: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            devMode ? 'style-loader' : miniCssExtractPlugin.loader, // when on the development mode, using 'style-loader' can hot reload for the related file of CSS type.
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ]
        },
        {
          test: /\.(html)$/,
          use: [{
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 5*1024, // if the file is less 5k size, it will be transform into base64 URIs.
                outputPath: 'images',
                name: devMode ? '[name].[ext]' : '[name].[contenthash:8].[ext]'
              }
            }
          ]
        }
      ]
    }
  };
};
