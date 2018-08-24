const path = require('path')
const webpack = require('webpack')

const entry = [
  `webpack-dev-server/client?https://localhost:3000`,
  'webpack/hot/only-dev-server',
];

module.exports = {
  entry: {
    background: [path.join(__dirname, 'src/background/index'), ...entry],
    options: [path.join(__dirname, 'src/options/index'), ...entry],
    popup: [path.join(__dirname, 'src/popup/index'), ...entry],
    inject: [path.join(__dirname, 'src/inject/index'), ...entry],
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
    publicPath: `https://localhost:3000/`,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 3000,
    https: true
  }
}
