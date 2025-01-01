const path = require('path');
//const fs = require('fs');
const chalk = require('chalk'); // Importing chalk for styled console output
const HtmlWebpackPlugin = require('html-webpack-plugin'); // generate the index.html file
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //  CSS into separate files for production
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin'); // show error overlays in development mode
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin'); //React Fast Refresh (HMR) in development
const WebpackBar = require('webpackbar'); // show a progress bar during the build process
const CompressionPlugin = require('compression-webpack-plugin'); // Plugin for compressing assets using Brotli and Gzip
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // analyze the final bundle size
const TerserPlugin = require('terser-webpack-plugin'); // Plugin for JS minification in production
const CopyWebpackPlugin = require('copy-webpack-plugin'); // copy static files (e.g., configuration files)
const { DefinePlugin } = require('webpack'); // define global constants (like environment variables)
const HMRLoggingPlugin = require('./Plugin/HMRLoggingPlugin'); // define global constants (like environment variables)
module.exports = (env, argv) => {
  // Determine if the environment is 'development' or 'production'
  const isDevelopment = argv.mode === 'development';
  const envName = isDevelopment ? 'Development' : 'Production';
  try {
    // Load the app settings JSON file dynamically based on the environment
    // const appSettings = JSON.parse(
    //   fs.readFileSync(
    //     path.resolve(__dirname, `public/config/appSettings.${envName}.json`),
    //     'utf-8'
    //   )
    // );

    // // Extract SSL certificate paths from app settings
    // const sslCertPath = appSettings.ssl?.cert;
    // const sslKeyPath = appSettings.ssl?.key;

    // If SSL certificates are missing in production, log an error and exit the process
    // if (!isDevelopment && (!sslCertPath || !sslKeyPath)) {
    //   console.error(
    //     chalk.red(
    //       `ERROR: SSL certificate paths not found in ${chalk.yellow(
    //         path.resolve(__dirname, `public/config/appSettings.${envName}.json`)
    //       )}`
    //     )
    //   );
    //   console.error(
    //     chalk.yellow('Ensure SSL cert and key are correctly configured.')
    //   );
    //   process.exit(1);
    // }

    // Common file naming pattern for JS files, differing based on environment
    const fileNaming = isDevelopment
      ? '[name].js' // In development, we use simple names
      : '[name].[contenthash].js'; // In production, use content hashing for cache-busting

    return {
      entry: './src/index.jsx', // The entry point of the application
      output: {
        // Output configuration for compiled files
        path: path.resolve(__dirname, 'dist'), // Path to the output directory
        filename: fileNaming, // File name pattern for the main JS bundle
        chunkFilename: isDevelopment ? '[id].js' : '[id].[contenthash].js', // Chunk naming
        clean: true, // Automatically clean the output directory before every build
      },
      resolve: {
        // Resolve both .js and .jsx extensions in imports
        extensions: ['.js', '.jsx'],
      },
      infrastructureLogging: {
        level: 'warn', // Log only warnings and errors to reduce output noise
      },
      optimization: {
        // Optimize chunks and apply various build enhancements
        splitChunks: {
          chunks: 'all', // Split all chunks (including node_modules)
          maxInitialRequests: 5, // Allow up to 5 initial requests for parallel loading
          minSize: 30000, // Split chunks if they're greater than 30KB
          maxSize: 200000, // Split chunks if they're larger than 200KB
          cacheGroups: {
            vendor: {
              // Separate third-party libraries into a 'vendors' chunk
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: -20, // Give this group lower priority to favor other groups
            },
            common: {
              // Separate common modules used by multiple files into a 'common' chunk
              test: /[\\/]src[\\/].+\.jsx?$/,
              name: 'common',
              chunks: 'all',
              minChunks: 2, // Only include modules that appear at least twice
              enforce: true, // Always enforce this rule
            },
          },
        },
        minimizer: [
          // Minimize JavaScript files for production
          new TerserPlugin({
            parallel: true, // Enable parallel processing for faster builds
            terserOptions: {
              compress: {
                drop_console: true, // Remove console logs for production
                drop_debugger: true, // Remove debugger statements for production
                unused: true, // Remove unused code
              },
              output: {
                comments: false, // Remove comments from the output
              },
            },
          }),
        ],
      },
      module: {
        rules: [
          // JavaScript and JSX transpilation using Babel
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/, // Exclude node_modules to speed up the build
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: [
                  isDevelopment && require.resolve('react-refresh/babel'), // Add React Fast Refresh plugin in development mode
                ].filter(Boolean),
              },
            },
          },
          // SCSS module support
          {
            test: /\.scss$/,
            use: [
              isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader, // Use style-loader in development and MiniCssExtractPlugin in production
              {
                loader: 'css-loader',
                options: {
                  sourceMap: isDevelopment, // Enable source maps in development
                  modules: {
                    auto: /\.module\.scss$/, // Enable CSS modules for .module.scss files
                    localIdentName: isDevelopment
                      ? '[name]__[local]__[hash:base64:5]'
                      : '[hash:base64]', // Custom class name formatting for better obfuscation in production
                  },
                },
              },
              'sass-loader', // Convert SCSS to CSS
            ],
          },
          // Regular CSS support
          {
            test: /\.css$/,
            use: [
              isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader, // Use style-loader in development and MiniCssExtractPlugin in production
              'css-loader',
            ],
          },
          // Static asset support for images and fonts
          {
            test: /\.(png|jpg|jpeg|gif|svg)$/i,
            type: 'asset/resource', // Load image files as resources
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource', // Load font files as resources
          },
        ],
      },
      plugins: [
        // Display a progress bar during the build process (in production only)
        !isDevelopment &&
          new WebpackBar({
            name: 'Building',
            color: 'green',
            profile: false,
            clear: true,
          }),
        // HTML template generation
        new HtmlWebpackPlugin({
          template: './public/index.html',
          filename: 'index.html',
        }),
        // Extract CSS into separate files in production
        new MiniCssExtractPlugin({
          filename: fileNaming.replace('.js', '.css'),
          chunkFilename: fileNaming.replace('.js', '.css'),
        }),
        // Add error overlay plugin in development for better debugging experience
        isDevelopment && new ErrorOverlayPlugin(),
        // Add React Fast Refresh plugin in development for hot reloading
        isDevelopment && new ReactRefreshWebpackPlugin(),
        // Enable Brotli and Gzip compression for assets in production
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
        // Bundle analysis in production to optimize code splitting
        !isDevelopment &&
          new BundleAnalyzerPlugin({
            analyzerMode: 'static', // Generates a static HTML report
            reportFilename: 'report.html', // Path for the report
            statsFilename: 'stats.json', // Path for the stats file
            openAnalyzer: false, // Don't automatically open the analyzer in the browser
            generateStatsFile: true, // Generate stats.json file
            logLevel: 'silent', // Set the log level to silent to suppress all output
          }),

        // Copy configuration files to the dist folder
        new CopyWebpackPlugin({
          patterns: [{ from: 'public/config', to: 'config' }],
        }),
        // Define global variables for environment-specific logic
        new DefinePlugin({
          __ENV__: JSON.stringify(envName), // Inject dynamic environment value
        }),
        isDevelopment && new HMRLoggingPlugin(),
      ].filter(Boolean),
      devServer: {
        // Configuration for webpack-dev-server
        static: path.join(__dirname, 'dist'),
        port: 3000,
        host: 'localhost', // Explicitly set the host to 'localhost'
        // server: {
        //   type: 'https', // Serve the application over HTTPS
        //   options: {
        //     key: sslKeyPath,
        //     cert: sslCertPath, // Use the SSL certificates if available
        //   },
        // },
        compress: true, // Enable Gzip compression
        hot: true, // Enable Hot Module Replacement (HMR)
        open: true, // Open the browser automatically
        historyApiFallback: true, // Enable single-page application (SPA) routing support
        onListening: (devServer) => {
          const protocol =
            devServer.options.server.type === 'https' ? 'https' : 'http';
          const { host, port } = devServer.options;
          console.log(
            chalk.green(`Server is listening on ${protocol}://${host}:${port}`)
          );
        },
        client: {
          logging: 'warn', // Log warnings and errors in the client
          overlay: {
            warnings: true,
            errors: true, // Display errors in the overlay, but hide warnings
          },
        },
        devMiddleware: {
          stats: 'errors-warnings', // Display errors and warnings only in development mode
        },
      },
      devtool: isDevelopment ? 'cheap-module-source-map' : false, // Enable source maps only in development
      stats: {
        preset: 'minimal', // Use the 'minimal' preset for build stats
        assets: false, // Show asset details in the build output
        timings: true, // Show build timings for performance analysis
        errors: true, // Show build errors
        warnings: true, // Show build warnings
        colors: true, // Enable colored output for better readability
        modules: false, // Hide module details in the build output,
        performance: true, // Show performance hints in the build output
      },
      performance: {
        hints: 'warning',
        maxEntrypointSize: 5000000, // 5MB (5000000 bytes)
        maxAssetSize: 5000000, // 5MB (5000000 bytes)
      },
    };
  } catch (err) {
    console.error(chalk.red(`ERROR: ${err.message}`));
    if (err.details) {
      console.error(chalk.red(`Details: ${err.details}`));
    }
    if (err.stack) {
      console.error(chalk.red(`Stack: ${err.stack}`));
    }
  }
};
