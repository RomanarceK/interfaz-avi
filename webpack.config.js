const path = require('path');

module.exports = {
  entry: './src/index.js', // Tu archivo de entrada
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      os: require.resolve('os-browserify/browser'),
      url: require.resolve('url/'),
      zlib: require.resolve('browserify-zlib'),
      querystring: require.resolve('querystring-es3'),
      assert: require.resolve('assert/')
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};