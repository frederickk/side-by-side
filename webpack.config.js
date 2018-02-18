const path = require('path');
const webpack = require('webpack');
const extractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  watch: true,
  cache: true,
  devtool: 'inline-sourcemap',
  devServer: {
    contentBase: './src'
  },
  entry: [
    path.join(__dirname, './src/js/index.js'),
    path.join(__dirname, './src/sass/index.scss'),
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, './src/js'),
      path.resolve(__dirname, './src/sass'),
      'node_modules',
    ]
  },
  output: {
    path: path.join(__dirname, './src'),
    publicPath: './src',
    filename: './index.min.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {},
    }, {
      test: /\.(css|sass|scss)$/,
      exclude: /node_modules/,
      use: extractTextPlugin.extract({
        use: ['css-loader', 'sass-loader'],
      }),
    }, {
      test: /\.css$/,
      use: ['style-loader', 'postcss-loader']
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000'
    }],
  },
  plugins: [
    new extractTextPlugin({
      filename: './index.min.css',
      allChunks: true,
    }),
  ],
};


module.exports = config;
