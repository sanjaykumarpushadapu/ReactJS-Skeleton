const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WebpackBar = require('webpackbar');
const CompressionPlugin = require('compression-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

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
        chunks: 'all', // Split chunks from node_modules and your code
        maxInitialRequests: 5,
        minSize: 200000, // Split chunks larger than 200KB
        cacheGroups: {
          agGrid: {
            test: /[\\/]node_modules[\\/](ag-grid-community|ag-grid-react|ag-grid-enterprise)[\\/]/, // Match all ag-grid-* packages
            name: 'ag-grid', // Bundle all ag-grid related packages into a single chunk
            chunks: 'all',
            enforce: true,
            priority: 20, // Ensure ag-Grid chunk is loaded before others
            reuseExistingChunk: true, // Reuse existing ag-Grid chunk
          },
          reactRedux: {
            test: /[\\/]node_modules[\\/](react|react-dom|redux)[\\/]/, // Match React, ReactDOM, and Redux
            name: 'react-redux', // Bundle React, ReactDOM, and Redux into a single chunk
            chunks: 'all',
            enforce: true,
            priority: 10, // Prioritize this chunk after ag-Grid
            reuseExistingChunk: true, // Reuse existing chunk for React/Redux
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
            priority: 5, // Prioritize vendor chunk over others
            reuseExistingChunk: true, // Reuse existing vendor chunk
          },
          common: {
            test: /[\\/]src[\\/].+\.jsx?$/,
            name: 'common',
            chunks: 'all',
            minChunks: 2,
            enforce: true,
          },
        },
      },
      minimizer: [
        new ImageMinimizerPlugin({
          test: /\.(jpe?g|png|gif|svg)$/i,
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                ['gifsicle', { interlaced: true }],
                ['jpegtran', { progressive: true }],
                ['optipng', { optimizationLevel: 5 }],
                [
                  'svgo',
                  {
                    plugins: [
                      {
                        name: 'preset-default',
                        params: {
                          overrides: {
                            removeViewBox: false,
                          },
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          },
        }),
      ],
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
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDevelopment,
                modules: {
                  auto: /\.module\.scss$/,
                  localIdentName: isDevelopment
                    ? '[name]__[local]__[hash:base64:5]'
                    : '[hash:base64]',
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.css$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
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
          name: 'Building',
          color: 'green',
          profile: true,
          clear: true,
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
      !isDevelopment &&
        new CompressionPlugin({
          test: /\.(js|css|html|svg)$/,
          algorithm: 'brotliCompress',
          filename: '[path][base].br',
        }),
      !isDevelopment &&
        new CompressionPlugin({
          test: /\.(js|css|html|svg)$/,
          algorithm: 'gzip',
          filename: '[path][base].gz',
        }),
      !isDevelopment && new BundleAnalyzerPlugin(),
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
      preset: 'minimal',
      all: false,
      assets: true,
      timings: true,
      errors: true,
      warnings: true,
      colors: true,
      version: false,
      hash: false,
      entrypoints: false,
      modules: false,
      chunkGroups: false,
    },
    performance: {
      hints: 'warning',
      maxEntrypointSize: 512000, // 500 KB
      maxAssetSize: 512000, // 500 KB
    },
  };
};
