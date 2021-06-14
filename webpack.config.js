const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
// const webpack = require('webpack');

const mode = (process.env.NODE_ENV === 'production')
    ? 'production'
    : 'development';

const config = {
  mode,
  // watch: mode ? false : true,
  cache: true,
  devServer: {
    contentBase: './src',
  },
  entry: {
    background: path.join(__dirname, './src/js/background.js'),
    index: [
      path.join(__dirname, './src/index.js'),
      path.join(__dirname, './src/index.scss'),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [{
      test: /\.js$/i,
      use: 'babel-loader',
      exclude: [/node_modules/],
    }, {
      test: /\.(sa|sc|c)ss$/i,
      use: [
        'extract-loader',
        'css-loader',
        'sass-loader'
      ],
    }, {
      test: /\.(sa|sc|c)ss$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
    }, {
      test: /\.(png|jpg|jpe?g|gif)$/i,
      type: 'asset/resource',
    }, {
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      type: 'asset/inline',
    }],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  output: {
    path: path.join(__dirname, './src'),
    publicPath: './src',
    filename: './[name].min.js',
    assetModuleFilename: 'images/[name][ext]',
  },
};

module.exports = config;
