import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
export default function CallScreen({ route, navigation }) {
  const { contact, type = 'outgoing', callType = 'audio' } = route.params;
  const [callState, setCallState] = useState(type === 'incoming' ? 'ringing' : 'calling');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callType === 'video');
  const [duration, setDuration] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));
  useEffect(() => {
    if (callState === 'calling' || callState === 'ringing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [callState]);
  useEffect(() => {
    let interval;
    if (callState === 'active') {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const handleAnswer = () => {
    setCallState('active');
  };
  const handleDecline = () => {
    navigation.goBack();
  };
  const handleEndCall = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.content}>
        <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
          <View style={[styles.avatar, { backgroundColor: contact.profileColor || '#FF3B30' }]}>
            {contact.photoUri ? (
              <Image source={{ uri: contact.photoUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{contact.name[0].toUpperCase()}</Text>
            )}
          </View>
        </Animated.View>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.status}>
          {callState === 'calling' && (callType === 'video' ? 'Видеозвонок...' : 'Звоним...')}
          {callState === 'ringing' && (callType === 'video' ? 'Входящий видеозвонок...' : 'Входящий звонок...')}
          {callState === 'active' && formatDuration(duration)}
        </Text>
      </View>
      {callState === 'ringing' && (
        <View style={styles.incomingActions}>
          <TouchableOpacity 
            style={styles.declineButton} 
            onPress={handleDecline}
          >
            <Ionicons name="close" size={32} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.answerButton} 
            onPress={handleAnswer}
          >
            <Ionicons name="call" size={32} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}
      {(callState === 'calling' || callState === 'active') && (
        <View style={styles.controls}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={() => setIsMuted(!isMuted)}
            >
              <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={24} color={colors.text} />
              <Text style={styles.controlLabel}>Микрофон</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, isSpeaker && styles.controlButtonActive]}
              onPress={() => setIsSpeaker(!isSpeaker)}
            >
              <Ionicons name="volume-high" size={24} color={colors.text} />
              <Text style={styles.controlLabel}>Динамик</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, isVideoOn && styles.controlButtonActive]}
              onPress={() => setIsVideoOn(!isVideoOn)}
            >
              <Ionicons name={isVideoOn ? 'videocam' : 'videocam-off'} size={24} color={colors.text} />
              <Text style={styles.controlLabel}>Видео</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.endCallButton} 
            onPress={handleEndCall}
          >
            <Ionicons name="call" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  avatarContainer: {
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 56,
    fontFamily: typography.medium,
    color: '#ffffff',
  },
  name: {
    fontSize: 28,
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  status: {
    fontSize: 16,
    fontFamily: typography.medium,
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  incomingActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  declineButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    paddingBottom: 80,
    paddingHorizontal: 24,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: colors.surfaceLight,
  },
  controlLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 6,
    fontFamily: typography.medium,
    letterSpacing: 0.3,
    position: 'absolute',
    bottom: -22,
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
