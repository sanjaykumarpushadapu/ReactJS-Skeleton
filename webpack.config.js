const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WebpackBar = require('webpackbar');
module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  return {
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
      !isDevelopment &&
        new WebpackBar({
          name: 'Building', // Customize the name displayed on the progress bar
          color: 'green', // Customize the progress bar color (optional)
          profile: true, // Enable profiling only in production mode// Show profiling information during build (optional)
          clear: true, // clear the screen after each build (optional)
        }),
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
    ].filter(Boolean),
    devServer: {
      static: path.join(__dirname, 'dist'),
      compress: true,
      port: 3000,
      hot: true,
      open: true,
      historyApiFallback: true,
      client: {
        logging: 'warn', // Limit to warnings
        overlay: {
          warnings: false, // Suppress warnings in the browser overlay
          errors: true, // Show errors only
        },
      },
      devMiddleware: {
        stats: 'errors-warnings', // Display only errors and warnings
      },
    },
    devtool: isDevelopment ? 'cheap-module-source-map' : false,
    stats: {
      preset: 'minimal', // Minimal output
      all: false, // Disable all default stats
      assets: true, // Show generated assets
      timings: true, // Show build timings
      errors: true, // Show errors
      warnings: true, // Show warnings
      colors: true, // Enable colored output
      version: false, // Hide Webpack version
      hash: false, // Hide build hash
      entrypoints: false, // Hide entry points
      modules: false, // Hide module details
      chunkGroups: false, // Hide chunk group details
    },
  };
};
