var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const htmlPlugin = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true,
  },
  resolve: {
    extensions: [
	'.js',
	]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
	  options: {
               presets: [
		    [
			'@babel/preset-env',
			 {
				"targets": {
					"node": "current"
				},
				 "forceAllTransforms": true,
			}
	            ],
			"@babel/preset-react",
	       ],
		"plugins": ["@babel/plugin-proposal-class-properties"],
          }
        }
      },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      }
    ]
  },
  plugins: [htmlPlugin]
};
