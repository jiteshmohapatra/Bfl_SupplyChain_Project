module.exports = {
  components: 'src/js/components/**/*.jsx',
};
module.exports = {
  webpackConfig: {
    module: {
      rules: [
        // Use babel-loader for JavaScript/JSX files
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        // Use raw-loader for Markdown files (for examples)
        {
          test: /\.md$/,
          loader: 'raw-loader'
        },
        // (Optional) Add other rules as needed...
      ]
    }
  }
};
