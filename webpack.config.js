const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WebpackBar = require('webpackbar');
const CompressionPlugin = require('compression-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

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
      // Code splitting by route
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 3, // Reduce initial requests to 3
        minSize: 50000, // Split chunks earlier (down from 100KB)
        maxSize: 200000, // Reduce max size for chunks (down from 250KB)
        cacheGroups: {
          // Default group for common modules
          default: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true,
          },
          // Vendor chunk for node_modules
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: -20,
            reuseExistingChunk: true,
          },
          // Shared chunks for your components (you can adjust this further for specific modules)
          common: {
            test: /[\\/]src[\\/].+\.jsx?$/,
            name: 'common',
            chunks: 'all',
            minChunks: 2,
            enforce: true,
          },
        },
      },
      // Minification and removal of unused code
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true, // Remove console statements
              drop_debugger: true, // Remove debugger statements
              unused: true, // Remove unused code
            },
            output: {
              comments: false, // Remove comments
            },
          },
        }),
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
      // Webpack Progress bar for larger projects
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
      // Extract CSS in production for larger projects
      new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: isDevelopment ? '[id].css' : '[id].[contenthash].css',
      }),
      // Error overlay plugin for development
      isDevelopment && new ErrorOverlayPlugin(),
      // React Fast Refresh for development
      isDevelopment && new ReactRefreshWebpackPlugin(),
      // Brotli and Gzip compression for production to save bandwidth
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
      // Bundle Analyzer to visualize bundle sizes
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
      hints: 'warning', // Show warnings if assets exceed the size limit
      maxEntrypointSize: 1000000, // 1 MB (increase temporarily)
      maxAssetSize: 1000000, // 1 MB (increase temporarily)
    },
  };
};
