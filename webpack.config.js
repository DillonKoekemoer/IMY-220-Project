const path = require('path');
module.exports = {
    entry: './frontend/src/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
                type: 'asset/resource',
            },
        ]
    },
   
    devServer: {
        historyApiFallback: true,
        port: 3000,
        host: '0.0.0.0',
        static: {
            directory: path.join(__dirname, 'public'),
        },
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};