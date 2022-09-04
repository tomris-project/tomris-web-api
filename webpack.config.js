const path = require("path");
module.exports = {
  entry: {
    component: "./src/component.tsx",
  },
  mode: "development", 
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js", 
    library: {
      name: "tomris-web-api",
      type: "umd",
    },
    globalObject: "this",
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      } 
    ],
  },
  externals: {
    react: "react",
    next: "next",
    "react-dom": "react-dom",
    "react-bootstrap": "react-bootstrap",
    "react-select": "react-select",
    "react-data-table-component": "react-data-table-component",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js","css","scss"], 
  },
};
