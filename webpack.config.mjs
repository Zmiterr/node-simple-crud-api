import path from 'path';

export default [
  {
    mode: 'development',
    name: 'dev',
    target: 'node',
    entry: {
      server: './src/simple-crud-api.ts',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(process.cwd(), 'dist'),
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
  },
  {
    mode: 'production',
    name: 'prod',
    target: 'node',
    entry: {
      bundle: './src/simple-crud-api.ts',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(process.cwd(), 'dist'),
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
  }
];
