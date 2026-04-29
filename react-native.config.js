module.exports = {
  project: {
    android: {
      packageName: 'com.streamapp.mobile'
    }
  },
  dependencies: {
    // Keep Expo disabled for native autolinking; EAS Update uses app config/manifest values.
    expo: {
      platforms: {
        android: null,
        ios: null
      }
    },
    'react-native-video': {
      platforms: {
        ios: null
      }
    }
  }
}
