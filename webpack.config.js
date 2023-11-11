path = require("path")

module.exports = {
    //entry: './src/app/app.ts',
    //entry: './src/app/index.ts',
    entry: {
      main: './src/app/app.ts',
      build: './src/app/index.ts',
    },
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
      // filename: 'bundle.js'
      filename: 'xFlow.js',
      library: 'xFlow',
      libraryTarget: 'umd'
    },
    devServer: {
        static:{
            directory: path.join(__dirname, '/')
        }
    }
  };
  