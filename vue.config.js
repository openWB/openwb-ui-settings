const webpack = require("webpack");

module.exports = {
	publicPath: "/openWB/web/settings/",
	css: {
		sourceMap: true,
	},
	configureWebpack: {
		resolve: {
			fallback: {
				buffer: require.resolve("buffer/"),
				process: require.resolve("process/browser"),
			},
		},
		plugins: [
			new webpack.ProvidePlugin({
				Buffer: ["buffer", "Buffer"],
				process: "process/browser",
			}),
		],
	},
};
