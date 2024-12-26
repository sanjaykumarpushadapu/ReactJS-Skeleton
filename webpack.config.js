const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: isDevelopment ? '[id].js' : '[id].[contenthash].js',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              isDevelopment && require.resolve('react-refresh/babel'),
            ].filter(Boolean),
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[contenthash].css',
    }),
    isDevelopment && new ErrorOverlayPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    !isDevelopment && new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    new WebpackBar({
      name: 'Building...',
      color: '#3498db',
      basic: false,
      profile: true, // Adds timing information
    }),
  ].filter(Boolean),
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    client: {
      logging: 'warn',
      overlay: {
        warnings: false,
        errors: true,
      },
    },
    devMiddleware: {
      stats: 'errors-warnings',
    },
  },
  devtool: isDevelopment ? 'cheap-module-source-map' : false,
  stats: {
    preset: 'minimal', // Use 'minimal' preset for a clean output
    all: false, // Disable all default stats
    assets: true, // Show generated assets
    timings: true, // Show build timings
    errors: true, // Show errors
    warnings: true, // Show warnings
    colors: true, // Enable colored output
    version: false, // Hide Webpack version
    hash: false, // Hide build hash
    entrypoints: false, // Hide entrypoints
  },
};
