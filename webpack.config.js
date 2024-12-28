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
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
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
    infrastructureLogging: {
      level: 'warn', // or 'warn', 'error', etc.
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 5, // Allow multiple initial requests to improve parallel loading
        minSize: 30000, // Split chunks at a smaller size (30KB)
        maxSize: 200000, // Split chunks larger than 200KB
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: -20,
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
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              unused: true,
            },
            output: {
              comments: false,
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
      !isDevelopment && new WebpackBar({ name: 'Building', color: 'green' }),
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
      new CopyWebpackPlugin({
        patterns: [
          { from: 'public/config', to: 'config' }, // Copy config files to dist folder
        ],
      }),
      new DefinePlugin({
        __ENV__: JSON.stringify(isDevelopment ? 'Development' : 'Production'), // Inject dynamic environment value
      }),
    ].filter(Boolean),
    devServer: {
      static: path.join(__dirname, 'dist'),
      port: 3000,
      host: 'localhost', // Explicitly set the host
      server: {
        type: 'https', // Specifies HTTPS protocol
        // options: {
        //   key: '/path/to/server.key',
        //   cert: '/path/to/server.crt',
        //   ca: '/path/to/ca.pem',
        // },
      },
      compress: true,
      hot: true,
      open: true,
      historyApiFallback: true,
      onListening: (devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }
        const protocol =
          devServer.options.server.type === 'https' ? 'https' : 'http';
        const host = devServer.options.host || 'localhost';
        const { port } = devServer.options;
        console.log(`Server is listening on ${protocol}://${host}:${port}`);
      },
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
      maxEntrypointSize: 5000000, // 5MB (5000000 bytes)
      maxAssetSize: 5000000, // 5MB (5000000 bytes)
    },
  };
};
