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
		output: {
			filename: process.env.VUE_CLI_MODERN_BUILD ? 'js/[name].[contenthash:8].js' : 'js/[name]-legacy.[contenthash:8].js',
			chunkFilename: process.env.VUE_CLI_MODERN_BUILD ? 'js/[name].[contenthash:8].js' : 'js/[name]-legacy.[contenthash:8].js',
		},
	},
};
