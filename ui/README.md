# React Project with Webpack, Yarn, ESLint, and Prettier

This is a React project configured with **Webpack** for module bundling and **Yarn** as the package manager. The project also integrates **ESLint** for linting and **Prettier** for code formatting, ensuring a clean and consistent codebase.

---

## 🚀 Features

- React 19
- Webpack 7
- Yarn for package management
- Babel for JavaScript transpilation
- ESLint for linting
- Prettier for code formatting
- Development and Production builds
- Hot Module Replacement (HMR)

---

## 🔠 Getting Started

### 1. Clone the Repository

```bash
git clone
cd your-repo-name
```

### 2. Install Dependencies

Then install project dependencies:

```bash
npm install
```

### 3. Run the Development Server

```bash
npm start
```

This will:

- Format your code with Prettier
- Fix linting issues with ESLint
- Start the Webpack development server with **Hot Module Replacement (HMR)** enabled
- Open the application in your default browser

---

## 🔧 Scripts

Here are the key scripts defined in `package.json`:

- **Start Development Server**:

  ```bash
  npm start
  ```

  Runs Prettier to format your code, ESLint to fix linting issues, and starts the development server.

- **Build for Production**:

  ```bash
  npm run build
  ```

  Formats the code, fixes linting issues, and builds the application for production.

## 🚩 ESLint and Prettier

This project uses **ESLint** and **Prettier** to maintain a clean and consistent codebase.

### Linting with ESLint

ESLint is configured to analyze your code and ensure it adheres to best practices. The configuration includes:

- Recommended rules for React and JavaScript
- Rules for consistent imports
- Integration with Prettier to avoid conflicts

To run ESLint manually:

```bash
yarn lint
```

### Code Formatting with Prettier

Prettier ensures consistent code formatting. It is integrated with ESLint, so formatting issues are automatically handled when running the `start` or `build` scripts.

To manually format your code:

```bash
yarn format
```

To check formatting without making changes:

```bash
yarn format:check
```

---

## ⚙️ Webpack Configuration

Key features of the `webpack.config.js`:

- **Entry**: Specifies the main entry point of the application.
- **Output**: Bundled files are generated in the `dist/` folder.
- **Loaders**:
  - Babel for JavaScript (transpiles modern JavaScript)
  - CSS/SCSS for styling
  - File loader for assets
- **Plugins**:
  - `HtmlWebpackPlugin` for generating the `index.html`
  - `WebpackDevServer` for development server

---

## 🪩 Dependencies

### Main Dependencies

- **React**: Library for building user interfaces
- **ReactDOM**: DOM bindings for React
- **Babel**: JavaScript compiler

### Dev Dependencies

- **Webpack**: Module bundler
- **WebpackDevServer**: Development server
- **ESLint**: JavaScript linter
- **Prettier**: Code formatter
- **eslint-config-prettier**: Disables ESLint rules that conflict with Prettier
- **eslint-plugin-react**: Linting rules for React
- **babel-loader**: Integrates Babel with Webpack
- **css-loader**: Processes CSS files
- **html-webpack-plugin**: Generates an HTML file

---

## 🛡️ Security

To check for vulnerabilities in your dependencies:

```bash
npm audit
```

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙌 Contributions

Contributions, issues, and feature requests are welcome! Feel free to fork this repository and submit pull requests.
