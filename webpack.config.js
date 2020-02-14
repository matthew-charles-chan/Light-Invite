const path = require('path');

module.exports = {
mode:"production",
devtool:"source-map",
  entry: './public/scripts/date.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  devtool: 'sourcemap',
  module: { rules: [
    {
    test:/\.css$/, use:['style-loader', 'css-loader']
    } ]
  }
};
