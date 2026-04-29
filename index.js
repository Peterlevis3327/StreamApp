import React from 'react'
import {AppRegistry, SafeAreaView, StyleSheet, Text} from 'react-native'
import App from './App'
import appConfig from './app.json'

const appName = appConfig.expo.name

class RootErrorBoundary extends React.Component {
  state = {
    error: undefined
  }

  static getDerivedStateFromError(error) {
    return {error}
  }

  componentDidCatch(error) {
    console.error(error)
  }

  render() {
    if (this.state.error) {
      return (
        <SafeAreaView style={styles.errorScreen}>
          <Text style={styles.errorTitle}>StreamApp could not start</Text>
          <Text style={styles.errorText}>
            {this.state.error instanceof Error ? this.state.error.message : 'An unexpected error occurred.'}
          </Text>
        </SafeAreaView>
      )
    }

    return this.props.children
  }
}

function Root() {
  return (
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  )
}

const styles = StyleSheet.create({
  errorScreen: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#101828'
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10
  },
  errorText: {
    color: '#D0D5DD',
    fontSize: 14
  }
})

AppRegistry.registerComponent(appName, () => Root)
