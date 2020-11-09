import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

const config = (
  _env: unknown,
  args: {
    mode: 'development' | 'production'
  }
): webpack.Configuration => {
  const { mode } = args
  const isDevelopment = mode === 'development'

  const devtool = isDevelopment ? 'eval-source-map' : false

  const pluginsForDev = isDevelopment
    ? {
      babel: [
        require.resolve('react-refresh/babel')
      ],
      webpack: [
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
      ]
    }
    : { babel: [], webpack: [] }

  return {
    entry: path.resolve(__dirname, './src/index.tsx'),
    devServer: {
      open: true
    },
    devtool,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', 'json']
    },
    module: {
      rules: [
        {
          test: /\.tsx?/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: [
                ...pluginsForDev.babel
              ]
            }
          }
        }
      ]
    },
    plugins: [
      ...pluginsForDev.webpack,
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html.ejs'),
      }),
      new ForkTsCheckerWebpackPlugin()
    ],
  }
}

export default config
