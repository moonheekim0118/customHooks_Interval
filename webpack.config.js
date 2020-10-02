const path = require('path');
const webpack = require("webpack");

module.exports={
    mode:"development",
    devtool:"eval",
    resolve:{
        extensions:['.js','.jsx']
    },
    entry:'./src/index.js',
    module:{
        rules:[
            {
                test:/\.(js|jsx)$/,
                exclude:/(node_modules|bower_components)/,
                loader:'babel-loader',
                options:{
                    presets:[
                    '@babel/preset-env'
                    ],
                    plugins:[
                    '@babel/plugin-proposal-class-properties',
                    'react-hot-loader/babel'
                    ]
                }
            },
            {
                test : /\.css$/,
                use:["style-loader","css-loader"]
            }
        ]
    },
    output:{
        path:path.join(__dirname,"dist/"),
        publicPath:"/dist/",
        filename:"bundle.js"
    },
    devServer:{
        contentBase: path.join(__dirname, "public/"),
        port:3000,
        publicPath:"http://localhost:3000/dist/",
        hotOnly:true
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
}