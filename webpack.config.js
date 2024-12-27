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
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader, // Use 'style-loader' in dev and 'MiniCssExtractPlugin' in prod
            'css-loader', // Processes the CSS
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
