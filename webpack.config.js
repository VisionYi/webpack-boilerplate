/**
 * This webpack.config has below functions:
 * - minify `js` & `css`
 * - use preprocessor： `babel`, `scss/sass`, `postcss & autoprefixer`
 * - static files use `hash url` to avoid the cache
 * - use image base64
 * - use devServer - hot reload for `js`, `html`, `css/scss/sass`
 * - have many custom variables for CLI, using on the npm script
 * - auto clean the output folder
 */

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
  const projectPath = path.resolve(__dirname, name);
  const outputPath = path.resolve(__dirname, name, output);
  const htmlPath = path.resolve(__dirname, name, template);
  return {
    context: projectPath,
    entry: entry,
    output: {
      path: outputPath,
      filename: '[name].js',
      publicPath: devMode ? '/' : publicPath,
    },
    optimization: {
      minimizer: [
        new terserPlugin(),
        new optimizeCSSAssetsPlugin()
      ]
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
        template: template,
        hash: true,
      }),
      new miniCssExtractPlugin(),
      new webpack.HotModuleReplacementPlugin(), // hot reload plugin
      new cleanWebpackPlugin(devMode ? '' : outputPath),
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
          use: [
            'html-loader'
          ]
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 5*1024, // if the file is less 5k size, it will be transform into base64 URIs.
                outputPath: 'images',
                name: '[name].[ext]?[hash:10]'
              }
            }
          ]
        }
      ]
    }
  };
};
