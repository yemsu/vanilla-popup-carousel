const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    app: "./src/main.js",
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "main.js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.js$/,
        use: ["babel-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        use: "file-loader",
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    modules: [path.join(__dirname, "src"), "node_modules"],
    extensions: [".js"],
  },
  // 번들링 후 결과물의 처리 방식 등 다양한 플러그인들을 설정
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: "./index.html"
    }),
    /* new HtmlWebpackPlugin({
      filename: 'about.html',
      template: "./src/page/about.html",
      chunks: ['app']
    }), */
    new CopyPlugin({
      patterns: [{from: "static"}],
    }),
  ],
  devServer: {
    host: "localhost"
  }
}