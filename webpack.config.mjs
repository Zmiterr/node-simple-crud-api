import path from 'path';

export default [
  {
    mode: 'development',
    name: 'dev',
    target: 'node',
    entry: './src/simple-crud-api.mjs',
    output: {
      filename: 'server.js',
      path: path.resolve(process.cwd(), 'dist'),
      chunkFormat: 'module',
      library: {
        type: 'module',
      },
    },
    experiments: {
      outputModule: true,
    },
  }
];
