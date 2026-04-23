const rules = require("./webpack.rules");

// Regla para CSS
rules.push({
  test: /\.css$/i,
  use: ["style-loader", "css-loader"],
});

// Regla para imágenes (jpg, png, gif, svg)
rules.push({
  test: /\.(png|jpe?g|gif|svg)$/i,
  use: [
    {
      loader: "file-loader",
      options: {
        name: "[name].[hash].[ext]",
        outputPath: "assets/images",
      },
    },
  ],
});

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  module: {
    rules,
  },
};
