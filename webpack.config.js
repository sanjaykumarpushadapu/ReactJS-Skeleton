const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar'); // Import webpackbar

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: isDevelopment ? '[id].js' : '[id].[contenthash].js',
    clean: true, // Clean dist folder before each build
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // This will split all chunks (including node_modules) into separate files
      name: 'vendors',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Apply babel-loader to .js and .jsx files
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
        test: /\.scss$/, // Apply styles to .scss files
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader, // Use style-loader in dev and MiniCssExtractPlugin in prod
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource', // For image files
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource', // For font files
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[contenthash].css', // Output CSS file names
      chunkFilename: isDevelopment ? '[id].css' : '[id].[contenthash].css', // For dynamically imported chunks
    }),
    isDevelopment && new ErrorOverlayPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    !isDevelopment && new BundleAnalyzerPlugin({ analyzerMode: 'static' }),

    // Add the WebpackBar plugin here for both development and production modes
    new WebpackBar({
      name: 'Building...', // Set the name of the progress bar
      color: '#3498db', // Set the color of the progress bar
      basic: false, // Show detailed progress (percentage)
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
};
