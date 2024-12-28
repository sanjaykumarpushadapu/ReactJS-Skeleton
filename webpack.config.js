const path = require('path');
const fs = require('fs');
const chalk = require('chalk'); // Importing chalk for styled console output
const HtmlWebpackPlugin = require('html-webpack-plugin'); // generate the index.html file
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //  CSS into separate files for production
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin'); // show error overlays in development mode
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin'); //React Fast Refresh (HMR) in development
const WebpackBar = require('webpackbar'); // show a progress bar during the build process
const CompressionPlugin = require('compression-webpack-plugin'); // Plugin for compressing assets using Brotli and Gzip
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin'); // Plugin for image optimization (compressing images)
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // analyze the final bundle size
const TerserPlugin = require('terser-webpack-plugin'); // Plugin for JS minification in production
const CopyWebpackPlugin = require('copy-webpack-plugin'); // copy static files (e.g., configuration files)
const { DefinePlugin } = require('webpack'); // define global constants (like environment variables)

//Wait for the stats file to be written
const waitForFile = (filePath, retries = 5, delay = 1000) => {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      if (fs.existsSync(filePath)) {
        const statsData = fs.readFileSync(filePath, 'utf-8');
        // Check if the file content is valid JSON and not empty
        try {
          JSON.parse(statsData);
          resolve();
        } catch {
          if (retries > 0) {
            // console.log(
            //   chalk.yellow(
            //     `Retrying to read stats.json... ${retries} retries left`
            //   )
            // );
            setTimeout(attempt, delay); // Retry after a delay
          } else {
            reject(new Error('stats.json is empty or invalid JSON.'));
          }
        }
      } else if (retries > 0) {
        console.log(chalk.yellow('Waiting for stats.json to be generated...'));
        setTimeout(attempt, delay); // Retry after a delay
      } else {
        reject(new Error('stats.json file does not exist.'));
      }
    };

    attempt();
  });
};

const displayBuildStats = () => {
  const statsPath = path.resolve(__dirname, 'dist', 'stats.json');

  waitForFile(statsPath)
    .then(() => {
      const statsData = fs.readFileSync(statsPath, 'utf-8');
      const stats = JSON.parse(statsData);
      const errors = stats.errors || [];
      const warnings = stats.warnings || [];

      const totalBuildSize = stats.assets
        ? stats.assets.reduce((acc, asset) => acc + (asset.size || 0), 0) / 1024 // Convert to KB
        : 0;

      console.log(chalk.green(`Build completed in ${stats.time} ms`));
      console.log(
        chalk.green(`Total Build Size: ${totalBuildSize.toFixed(2)} KB`)
      );
      console.log(chalk.red(`Errors: ${errors.length}`));
      console.log(chalk.yellow(`Warnings: ${warnings.length}`));

      // If errors or warnings, display them
      if (errors.length > 0) {
        console.error(chalk.red('Errors:'));
        errors.forEach((error) => {
          console.error(chalk.red(error.message || error));
        });
      }

      if (warnings.length > 0) {
        console.warn(chalk.yellow('Warnings:'));
        warnings.forEach((warning) => {
          console.warn(chalk.yellow(warning.message || warning));
        });
      }
    })
    .catch((err) => {
      console.error(chalk.red(`Error: ${err.message}`));
    });
};
module.exports = (env, argv) => {
  // Determine if the environment is 'development' or 'production'
  const isDevelopment = argv.mode === 'development';
  const envName = isDevelopment ? 'Development' : 'Production';
  try {
    // Load the app settings JSON file dynamically based on the environment
    const appSettings = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, `public/config/appSettings.${envName}.json`),
        'utf-8'
      )
    );

    // Extract SSL certificate paths from app settings
    const sslCertPath = appSettings.ssl?.cert;
    const sslKeyPath = appSettings.ssl?.key;

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
          // Minimize images (JPEG, PNG, GIF, SVG) for production
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
                              removeViewBox: false, // Keep the 'viewBox' in SVGs for compatibility
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
            analyzerMode: 'static',
            openAnalyzer: false,
            generateStatsFile: true, // Ensure stats.json is generated
            statsFilename: 'stats.json', // Path where the stats file will be saved
          }),

        // Copy configuration files to the dist folder
        new CopyWebpackPlugin({
          patterns: [{ from: 'public/config', to: 'config' }],
        }),
        // Define global variables for environment-specific logic
        new DefinePlugin({
          __ENV__: JSON.stringify(envName), // Inject dynamic environment value
        }),
        // After all other plugins, we add our custom plugin to display stats
        {
          // Hook into Webpack's done event to call the displayBuildStats function after the build is complete
          apply: (compiler) => {
            compiler.hooks.done.tap('DisplayBuildStats', () => {
              displayBuildStats(); // Call the function to display stats
            });
          },
        },
      ].filter(Boolean),
      devServer: {
        // Configuration for webpack-dev-server
        static: path.join(__dirname, 'dist'),
        port: 3000,
        host: 'localhost', // Explicitly set the host to 'localhost'
        server: {
          type: 'https', // Serve the application over HTTPS
          options: {
            key: sslKeyPath,
            cert: sslCertPath, // Use the SSL certificates if available
          },
        },
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
