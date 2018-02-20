const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const production = (process.env.NODE_ENV === 'production');

const config = {
  watch: production ? false : true,
  cache: true,
  devtool: 'inline-sourcemap',

  devServer: {
    contentBase: './src'
  },

  entry: {
    background: path.join(__dirname, './src/js/background.js'),
    index: [
      path.join(__dirname, './src/js/index.js'),
      path.join(__dirname, './src/sass/index.scss'),
    ],
  },

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
    filename: './[name].min.js',
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
      use: ExtractTextPlugin.extract({
        use: [(production) ? {
          loader: 'css-loader',
          options: {
            minimize: true
          }
        } : 'css-loader', 'sass-loader']
      }),
    }, {
      test: /\.css$/,
      use: ['style-loader', 'postcss-loader']
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000'
    }],
  },

  plugins: production ? [
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
        },
      },
    }),
    new ExtractTextPlugin({
      filename: './index.min.css',
      allChunks: true,
    }),
  ] : [
    new ExtractTextPlugin({
      filename: './index.min.css',
      allChunks: true,
    }),
  ],
};


module.exports = config;
