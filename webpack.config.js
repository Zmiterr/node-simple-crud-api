const path = require('path');

module.exports = [{
  mode: 'development',
  name: 'dev',
  target: 'node',
  // watch: true,
  entry: {
    server: './src/simple-crud-api.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
},
{
  mode: 'production',
  name: 'prod',
  target: 'node',
  entry: {
    bundle: './src/simple-crud-api.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
}];
