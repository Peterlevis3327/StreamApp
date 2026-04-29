module.exports = {
  project: {
    android: {
      packageName: 'com.streamapp.mobile'
    }
  },
  dependencies: {
    // Expo is used for EAS/app config only; this RN 0.76 app does not use Expo native modules.
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
