const webpack = require("webpack");
const path = require("path");

module.exports = function override (config) {
    let loaders = config.resolve
    loaders.fallback = {
        "path": false,
        "os": false,
        "fs": false,
        "util": false,
        "url": false,
        "assert": false,
        "stream": false,
        "zlib": false,
        "http": false,
        "crypto": false,
        "constants": false,
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer")
    };

    config.resolve.alias = { util$: path.resolve(__dirname, 'node_modules/util') };

    config.plugins.push(
        new webpack.DefinePlugin({
            process: {env: {}, browser: true}
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    )
    
    return config;
}
