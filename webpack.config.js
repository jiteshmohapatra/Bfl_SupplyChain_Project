const path = require('path');

const ROOT = path.resolve(__dirname, 'src');
const SRC = path.resolve(ROOT, 'js');

// This value is tightly coupled with src/js/index.jsx::__webpack_public_path__
const WEBPACK_OUTPUT = path.resolve(ROOT, 'main/webapp/webpack');
const TEMPLATES = path.resolve(ROOT, 'assets');
const GRAILS_VIEWS = path.resolve(__dirname, 'grails-app/views');
const COMMON_VIEW = path.resolve(GRAILS_VIEWS, 'common');
const RECEIVING_VIEW = path.resolve(GRAILS_VIEWS, 'partialReceiving');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production' || process.argv.includes('--mode=production');

module.exports = {
  cache: true,
  entry: {
    app: `${SRC}/index.jsx`,
  },
  output: {
    path: WEBPACK_OUTPUT,
    filename: 'bundle.[hash].js',
    chunkFilename: 'bundle.[hash].[name].js',
  },
  stats: {
    colors: false,
  },
  devtool: 'source-map',
  plugins: [
    ...(isProd ? [] : [
      new ESLintPlugin({
        extensions: ['js', 'jsx'],
        emitWarning: true,
        failOnError: false
      }),
    ]),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: [WEBPACK_OUTPUT],
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.[hash].css',
      chunkFilename: 'bundle.[hash].[name].css',
    }),
    new HtmlWebpackPlugin({
      filename: `${COMMON_VIEW}/react.gsp`,
      template: `${TEMPLATES}/grails-template.html`,
      inject: false,
      templateParameters: (compilation) => ({
        contextPath: '\${util.ConfigHelper.contextPath}',
        jsSource: `\${resource(dir: '${path.basename(WEBPACK_OUTPUT)}', file: 'bundle.${compilation.hash}.js')}`,
        cssSource: `\${resource(dir: '${path.basename(WEBPACK_OUTPUT)}', file: 'bundle.${compilation.hash}.css')}`,
        receivingIfStatement: '',
      }),
    }),
    new HtmlWebpackPlugin({
      filename: `${RECEIVING_VIEW}/create.gsp`,
      template: `${TEMPLATES}/grails-template.html`,
      inject: false,
      templateParameters: (compilation) => ({
        contextPath: '\${util.ConfigHelper.contextPath}',
        jsSource: `\${resource(dir: '${path.basename(WEBPACK_OUTPUT)}', file: 'bundle.${compilation.hash}.js')}`,
        cssSource: `\${resource(dir: '${path.basename(WEBPACK_OUTPUT)}', file: 'bundle.${compilation.hash}.css')}`,
        receivingIfStatement:
            '<g:if test="${!params.id}">' +
            'You can access the Partial Receiving feature through the details page for an inbound shipment.' +
            '</g:if>',
      }),
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_WEB_SENTRY_DSN': JSON.stringify(process.env.REACT_APP_WEB_SENTRY_DSN),
      'process.env.REACT_APP_SENTRY_ENVIRONMENT': JSON.stringify(process.env.REACT_APP_SENTRY_ENVIRONMENT),
      'process.env.REACT_APP_WEB_SENTRY_TRACES_SAMPLE_RATE': JSON.stringify(process.env.REACT_APP_WEB_SENTRY_TRACES_SAMPLE_RATE),
      'process.env.REACT_APP_WEB_SENTRY_REPLAYS_SAMPLE_RATE': JSON.stringify(process.env.REACT_APP_WEB_SENTRY_REPLAYS_SAMPLE_RATE),
      'process.env.REACT_APP_WEB_SENTRY_REPLAYS_ERROR_SAMPLE_RATE': JSON.stringify(process.env.REACT_APP_WEB_SENTRY_REPLAYS_ERROR_SAMPLE_RATE),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/react'],
          },
        },
        include: SRC,
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|woff2?|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: './[hash].[ext]',
          postTransformPublicPath: (p) => `__webpack_public_path__ + ${p}`,
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: './[hash].[ext]',
        },
      },
    ],
  },
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()],
  },
  resolve: {
    alias: {
      root: ROOT,
      src: SRC,
      components: path.resolve(SRC, 'components'),
      hooks: path.resolve(SRC, 'hooks'),
      reducers: path.resolve(SRC, 'reducers'),
      actions: path.resolve(SRC, 'actions'),
      consts: path.resolve(SRC, 'consts'),
      tests: path.resolve(SRC, 'tests'),
      utils: path.resolve(SRC, 'utils'),
      templates: path.resolve(SRC, 'templates'),
      store: path.resolve(SRC, 'store'),
      css: path.resolve(ROOT, 'css'),
      api: path.resolve(SRC, 'api'),
      wrappers: path.resolve(SRC, 'wrappers'),
    },
    extensions: ['.js', '.jsx'],
  },
};
