const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/client/js/";

module.exports = {
  // entry -> webpack.config.js -> output || to change old code for every browser
  entry: {
    main: BASE_JS + "main.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    recorder: BASE_JS + "recorder.js",
    commentSection: BASE_JS + "commentSection.js",
  },
  // webpack compile-file이 empty file로 나오는 경우
  mode: "development",
  // node.js의 nodemon같은 것, server가 안꺼짐
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js", // webpack의 변수 [name]: entry의 main, videoPlayer를 의미함
    path: path.resolve(__dirname, "assets"),
    //assets file을 clean하고 새 파일로 저장해줌. 이것은 terminal을 재시작할 때만 작동
    clean: true,
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
            presets: [["@babel/preset-env", { targets: "defaults" }]],
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
