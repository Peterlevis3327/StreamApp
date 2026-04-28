import React from 'react'
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import Video, {type OnLoadData} from 'react-native-video'

import type {Palette} from '../../theme/palette'
import type {StreamChannel} from '../../types'

interface PlayerSheetProps {
  channel?: StreamChannel
  visible: boolean
  colors: Palette
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export function PlayerSheet({
  channel,
  visible,
  colors,
  onClose,
  onNext,
  onPrevious
}: PlayerSheetProps): React.JSX.Element {
  const VideoPlayer = Video as unknown as React.ComponentType<Record<string, unknown>>
  const [playerKey, setPlayerKey] = React.useState(0)
  const [status, setStatus] = React.useState('Connecting...')
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    if (visible && channel) {
      setStatus('Connecting...')
      setHasError(false)
      setPlayerKey(key => key + 1)
    }
  }, [visible, channel?.id])

  const onLoad = React.useCallback((_event: OnLoadData) => {
    setHasError(false)
    setStatus('Live')
  }, [])

  const retryPlayback = React.useCallback(() => {
    setHasError(false)
    setStatus('Retrying...')
    setPlayerKey(key => key + 1)
  }, [])

  return (
    <Modal animationType="slide" presentationStyle="fullScreen" visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={[styles.screen, {backgroundColor: colors.background}]}> 
        <View style={styles.header}>
          <Text style={[styles.title, {color: colors.textPrimary}]} numberOfLines={1}>
            {channel?.name ?? 'No channel selected'}
          </Text>
          <Pressable onPress={onClose} style={[styles.close, {borderColor: colors.border}]}> 
            <Text style={[styles.closeText, {color: colors.textSecondary}]}>Close</Text>
          </Pressable>
        </View>

        <View style={[styles.videoWrap, {backgroundColor: '#000000'}]}>
          {channel ? (
            <React.Fragment key={playerKey}>
              <VideoPlayer
                source={{uri: channel.url}}
                style={styles.video}
                controls
                resizeMode="contain"
                bufferConfig={{
                  minBufferMs: 8000,
                  maxBufferMs: 30000,
                  bufferForPlaybackMs: 1200,
                  bufferForPlaybackAfterRebufferMs: 3000
                }}
                paused={!visible}
                playInBackground={false}
                playWhenInactive={false}
                onLoad={onLoad}
                onError={() => {
                  setHasError(true)
                  setStatus('Playback error. Try another feed or retry.')
                }}
              />
              {hasError ? (
                <View style={styles.errorOverlay}>
                  <Text style={[styles.errorText, {color: '#FFFFFF'}]}>{status}</Text>
                  <Pressable onPress={retryPlayback} style={[styles.retryButton, {backgroundColor: colors.accent}]}>
                    <Text style={styles.retryText}>Retry</Text>
                  </Pressable>
                </View>
              ) : null}
            </React.Fragment>
          ) : null}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.status, {color: colors.textSecondary}]}>Status: {status}</Text>
          <View style={styles.controls}>
            <Pressable onPress={onPrevious} style={[styles.button, {backgroundColor: colors.elevated}]}> 
              <Text style={[styles.buttonText, {color: colors.textPrimary}]}>Prev</Text>
            </Pressable>
            <Pressable onPress={onNext} style={[styles.button, {backgroundColor: colors.accent}]}> 
              <Text style={[styles.buttonText, {color: '#FFFFFF'}]}>Next</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1
  },
  close: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  closeText: {
    fontSize: 13,
    fontWeight: '600'
  },
  videoWrap: {
    width: '100%',
    aspectRatio: 16 / 9
  },
  video: {
    width: '100%',
    height: '100%'
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 16
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600'
  },
  retryButton: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12
  },
  status: {
    fontSize: 13
  },
  controls: {
    flexDirection: 'row',
    gap: 10
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center'
  },
  buttonText: {
    fontWeight: '700'
  }
})
