const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const Crx = require("crx-webpack-plugin");

module.exports = {
  entry: {
    background: [path.join(__dirname, 'src/background/index')],
    options: [path.join(__dirname, 'src/options/index')],
    popup: [path.join(__dirname, 'src/popup/index')],
    inject: [path.join(__dirname, 'src/inject/index')],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [
          // "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.css$/, // 針對所有.css 的檔案作預處理，這邊是用 regular express 的格式
        use: [
          'style-loader',  // 這個會後執行 (順序很重要)
          'css-loader' // 這個會先執行
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new Crx({
      keyFile: 'key.pem',
      contentPath: 'dist',
      outputPath: 'ctx',
      name: 'copy-2-clipboard-with-easy'
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false
          },
          minify: {},
          compress: {
            booleans: true,
          }
        }
      })
    ]
  }
}
