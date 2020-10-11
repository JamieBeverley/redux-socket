const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './examples/client.js',
  output: {
    filename: './client_build/index.js',
    path: path.resolve(__dirname, 'examples'),
  },
  devtool: "eval-cheap-source-map",
  plugins: [new HtmlWebpackPlugin()],
  devServer: {
    contentBase: path.join(__dirname, 'examples/'),
    compress: false,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};