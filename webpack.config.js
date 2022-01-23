const {ESBuildMinifyPlugin} = require('esbuild-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

const env = (process.env.NODE_ENV === 'production')
    ? 'production'
    : 'development';

const sassLoaderOptions = {
  loader: 'sass-loader',
  options: {
    implementation: require('sass'),
    sassOptions: {
      quietDeps: true,
    },
    // webpackImporter: false,
  },
};

module.exports = {
  mode: env,
  entry: {
    background: path.join(__dirname, './src/ts/background'),
    index: [
      path.join(__dirname, './src/index'),
      path.join(__dirname, './src/index.scss'),
    ],
  },
  devServer: {
    compress: true,
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{
      test: /\.(ts|tsx)?$/i,
      loader: 'esbuild-loader',
      options: {
        loader: 'ts',
        target: 'es2015'
      }
    }, {
      test: /\.(sa|sc|c)ss$/i,
      use: [
        'extract-loader',
        'css-loader',
        sassLoaderOptions,
      ],
      include: [
        path.resolve(__dirname, 'node_modules'),
      ],
    }, {
      test: /\.(sa|sc|c)ss$/i,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        sassLoaderOptions,
      ],
    }, {
      test: /\.(png|jpg|jpe?g|gif)$/i,
      type: 'asset/resource',
    }, {
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      type: 'asset/inline',
    }],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './[name].min.css',
    }),
    {
      apply: (compiler) => {
        if (env === 'production') {
          compiler.hooks.done.tap('DonePlugin', (stats) => {
            setTimeout(() => {
              process.exit(0);
            });
          });
        } else {
          return;
        }
      }
    }
  ],
  optimization: {
    minimize: true,
    minimizer: [new ESBuildMinifyPlugin({
      target: 'es2015',
      css: true
    })],
  },
  output: {
    path: path.join(__dirname, './src'),
    publicPath: './',
    filename: './[name].min.js',
    assetModuleFilename: 'images/[name][ext]',
  },
  // watch: env ? false : true,
  // cache: true,
};