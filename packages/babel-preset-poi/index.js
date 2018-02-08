const path = require('path')

const env = process.env.BABEL_ENV || process.env.NODE_ENV

module.exports = (ctx, { jsx = 'vue' } = {}) => {
  const presets = [
    env === 'test'
      ? [
          require('@babel/preset-env').default,
          {
            targets: {
              node: 'current'
            }
          }
        ]
      : [
          require('@babel/preset-env').default,
          {
            // Disable polyfill transforms
            // Error: Cannot assign to read only property 'exports' of object '#<Object>'
            // happens out of nowhere when we set it to 'usage'
            useBuiltIns: false,
            modules: false,
            targets: {
              ie: 9
            }
          }
        ]
  ]

  const plugins = [
    require.resolve('babel-plugin-transform-decorators-legacy'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    // require.resolve('babel-macros'),
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        helpers: false,
        polyfill: false,
        regenerator: true,
        // Resolve the Babel runtime relative to the config.
        moduleName: path.dirname(require.resolve('@babel/runtime/package'))
      }
    ],
    [
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      {
        useBuiltIns: true
      }
    ],
    // For dynamic import that you will use a lot in code-split
    require.resolve('@babel/plugin-syntax-dynamic-import')
  ]

  if (jsx === 'vue') {
    presets.push(require.resolve('babel-preset-vue'))
  } else if (jsx === 'react') {
    plugins.push(require.resolve('@babel/plugin-transform-react-jsx'))
    plugins.push(require.resolve('babel-plugin-react-require'))
  } else {
    plugins.push([
      require.resolve('@babel/plugin-transform-react-jsx'),
      { pragma: jsx }
    ])
  }

  return {
    presets,
    plugins
  }
}
