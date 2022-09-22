const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // webpack compile-file이 empty file로 나오는 경우
  mode: "development",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  // entry -> webpack.config.js -> output || to change old code for every browser
  entry: "./src/client/js/main.js",
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "assets"),
  },
  // some kind of latest code need 호환성. for that kind of problem, we use [css or js ]-loader
  // 1) js, babel-loader
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.scss$/,
        // 여러가지 loader combine 할거면 array 사용. 1) scss -> css 2) css -> browser 3) beautiful font
        // 빡치는게 webpack은 오른쪽부터 읽어나간다.
        // style-loader 대신에 mini.loader로 변경 -> css file을 main.js 밖으로 분리해서 만들기 위함
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
