const {getDefaultConfig} = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

config.resolver.sourceExts = Array.from(new Set([...config.resolver.sourceExts, 'cjs']))

if (config.server) {
  delete config.server.tls
}

module.exports = config
