const webpack = require("webpack");

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/main.js",
  target: "electron-main",
  resolve: {
    extensions: [".js", ".jsx", ".json"], // agrega .jsx aquí
  },
  entry: "./src/main.js",
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^aws-sdk$|^mock-aws-s3$|^nock$/,
    }),
  ],
};
