import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecord from 'react-native-audio-record';
import Sound from 'react-native-sound';
import axios from 'axios';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {colors} from '../../../constants';
const REALTIME_DB_URL = 'https://zanny-app-10dfa-default-rtdb.firebaseio.com/';
const getDbPathRef = path => database().refFromURL(`${REALTIME_DB_URL}${path}`);

const getDateKey = date => new Date(date).toISOString().split('T')[0];
const getUserId = user =>
  user?._id || user?.id || user?.customerId || user?.merchantId || '';

const normalizeId = value => {
  if (!value) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    return String(value?._id || value?.id || value?.customerId || value?.merchantId || '');
  }
  return '';
};

const formatDate = dateString => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

const formatDuration = seconds => {
  const mins = Math.floor(Number(seconds || 0) / 60)
    .toString()
    .padStart(2, '0');
  const secs = (Number(seconds || 0) % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const isValidAudioPath = path =>
  typeof path === 'string' && path.trim().length > 0;

const uploadVoiceNote = async audioUri => {
  const normalizedUri =
    Platform.OS === 'android' && !String(audioUri).startsWith('file://')
      ? `file://${audioUri}`
      : audioUri;
  const form = new FormData();
  form.append('file', {
    uri: normalizedUri,
    type: 'audio/wav',
    name: `voice_${Date.now()}.wav`,
  });
  form.append('upload_preset', 'znuys2j4');
  form.append('cloud_name', 'dcmawlfn2');

  const response = await axios.post(
    'https://api.cloudinary.com/v1_1/dcmawlfn2/auto/upload',
    form,
    {headers: {'Content-Type': 'multipart/form-data'}},
  );
  return response?.data?.secure_url || '';
};

const buildChatId = (orderId, customerId, merchantId) => {
  const normalizedOrderId = normalizeId(orderId);
  const normalizedCustomerId = normalizeId(customerId);
  const normalizedMerchantId = normalizeId(merchantId);
  if (normalizedOrderId) return `order_${normalizedOrderId}`;
  const sorted = [normalizedCustomerId, normalizedMerchantId].sort();
  return `dm_${sorted.join('_')}`;
};

const setPlaybackAudioSession = () => {
  try {
    // Keep playback audible on iOS (including silent mode) and stable on Android.
    Sound.setCategory('Playback');
  } catch (error) {
    console.log('[MerchantChatRTDB]', 'audioSession:playback:error', error);
  }
};

const setRecordingAudioSession = () => {
  try {
    // Use record-capable session only while recording to avoid low-volume earpiece routing.
    Sound.setCategory('PlayAndRecord');
  } catch (error) {
    console.log('[MerchantChatRTDB]', 'audioSession:record:error', error);
  }
};

const ChatScreen = ({navigation, route}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const flatListRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const recordingSecondsRef = useRef(0);
  const soundRef = useRef(null);
  const playbackTimeoutRef = useRef(null);
  const seenTimeoutRef = useRef(null);
  const user = useSelector(state => state?.LoginSlice?.user);

  const currentUserId = useMemo(() => normalizeId(getUserId(user)), [user]);
  const participantName = route?.params?.participantName || 'Customer';
  const orderId = normalizeId(route?.params?.orderId);
  const customerId = normalizeId(route?.params?.customerId);
  const merchantId = normalizeId(route?.params?.merchantId);
  const senderType = route?.params?.senderType || 'merchant';
  const senderName =
    user?.name ||
    user?.fullName ||
    user?.businessName ||
    user?.merchantName ||
    'Merchant';
  const senderImage =
    user?.profileImage || user?.merchantImage || user?.customerImage || '';

  const chatId = useMemo(
    () => buildChatId(orderId, customerId, merchantId),
    [orderId, customerId, merchantId],
  );
  const logPrefix = '[MerchantChatRTDB]';
  const logVoiceDebug = (event, extra = {}) => {
    console.log(logPrefix, `voice:${event}`, {
      platform: Platform.OS,
      chatId,
      currentUserId,
      orderId,
      customerId,
      merchantId,
      senderType,
      isRecording,
      ...extra,
    });
  };
  const clearPlaybackTimeout = () => {
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
  };
  const stopActivePlayback = (reason = 'manual-stop') => {
    clearPlaybackTimeout();
    if (soundRef.current) {
      try {
        soundRef.current.stop();
      } catch (error) {
        logVoiceDebug('playback:stop:error', {reason, errorMessage: error?.message});
      }
      soundRef.current.release();
      soundRef.current = null;
    }
    setPlayingMessageId(null);
    logVoiceDebug('playback:stopped', {reason});
  };
  const ensureChatMeta = async chatRef => {
    await chatRef.update({
      chatId,
      orderId: orderId || null,
      customerId: customerId || null,
      merchantId: merchantId || null,
      customerName:
        route?.params?.customerName || route?.params?.participantName || null,
      merchantName: route?.params?.merchantName || senderName,
      participants: [customerId, merchantId].filter(Boolean),
      updatedAt: database.ServerValue.TIMESTAMP,
    });
  };

  useEffect(() => {
    setPlaybackAudioSession();
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      clearPlaybackTimeout();
      stopActivePlayback('screen-unmount');
      if (seenTimeoutRef.current) clearTimeout(seenTimeoutRef.current);
      AudioRecord.stop().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (!chatId || !currentUserId) return;
    const chatRef = getDbPathRef(`chats/${chatId}`);
    const messagesRef = chatRef.child('messages');
    console.log(logPrefix, 'subscribe:start', {
      chatId,
      orderId,
      customerId,
      merchantId,
      currentUserId,
      senderType,
      dbUrl: REALTIME_DB_URL,
    });
    ensureChatMeta(chatRef)
      .then(() => console.log(logPrefix, 'chatMeta:update:success', {chatId}))
      .catch(error => console.log(logPrefix, 'chatMeta:update:error', error));
    const onMessagesValue = messagesRef.orderByChild('createdAt').on('value', snapshot => {
      const payload = snapshot.val() || {};
      const entries = Object.entries(payload).sort(
        (a, b) => Number(a?.[1]?.createdAt || 0) - Number(b?.[1]?.createdAt || 0),
      );
      console.log(logPrefix, 'messages:snapshot', {
        chatId,
        totalMessages: entries.length,
      });
      const updates = {};
      const seenUpdates = {};

      const next = entries.map(([messageId, data]) => {
        const createdAtDate = new Date(data?.createdAt || Date.now());
        const isSent = String(data?.senderId) === String(currentUserId);
        if (!isSent) {
          if (!data?.deliveredAt) {
            updates[`messages/${messageId}/deliveredAt`] = database.ServerValue.TIMESTAMP;
          }
          if (!data?.seenAt) {
            seenUpdates[`messages/${messageId}/seenAt`] = database.ServerValue.TIMESTAMP;
          }
        }

        return {
          id: messageId,
          messageType: data?.type || 'text',
          text: data?.text || '',
          audioUri: data?.audioUri || '',
          senderImage: data?.senderImage || '',
          durationSec: Number(data?.durationSec || 0),
          messageStatus: data?.seenAt ? 'seen' : data?.deliveredAt ? 'delivered' : 'sent',
          time: createdAtDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          date: getDateKey(createdAtDate),
          type: isSent ? 'sent' : 'received',
        };
      });
      setMessages(next);

      if (Object.keys(updates).length) {
        chatRef
          .update(updates)
          .catch(error => console.log(logPrefix, 'delivered:update:error', error));
      }

      if (Object.keys(seenUpdates).length) {
        if (seenTimeoutRef.current) clearTimeout(seenTimeoutRef.current);
        seenTimeoutRef.current = setTimeout(() => {
          chatRef
            .update(seenUpdates)
            .catch(error => console.log(logPrefix, 'seen:update:error', error));
        }, 700);
      }
    }, error => {
      console.log(logPrefix, 'messages:listen:error', error);
    });

    return () => {
      console.log(logPrefix, 'subscribe:stop', {chatId});
      messagesRef.off('value', onMessagesValue);
    };
  }, [
    chatId,
    currentUserId,
    orderId,
    customerId,
    merchantId,
    route?.params?.customerName,
    route?.params?.participantName,
    route?.params?.merchantName,
    senderName,
  ]);

  const sendTextMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || !chatId || !currentUserId) {
      console.log(logPrefix, 'sendText:blocked', {
        reason: 'missing-required-data',
        trimmedLength: trimmed.length,
        chatId,
        currentUserId,
      });
      return;
    }
    try {
      const chatRef = getDbPathRef(`chats/${chatId}`);
      await ensureChatMeta(chatRef);
      console.log(logPrefix, 'sendText:start', {
        chatId,
        senderId: currentUserId,
        senderType,
        text: trimmed,
      });
      const pushResult = await chatRef.child('messages').push({
        text: trimmed,
        type: 'text',
        senderId: String(currentUserId),
        senderType,
        senderName,
        senderImage,
        createdAt: database.ServerValue.TIMESTAMP,
      });
      await chatRef.update({
        lastMessage: trimmed,
        lastMessageSenderId: currentUserId,
        lastMessageSenderType: senderType,
        updatedAt: database.ServerValue.TIMESTAMP,
      });
      console.log(logPrefix, 'sendText:push:success', {
        chatId,
        messageId: pushResult?.key,
      });
      setMessage('');
    } catch (error) {
      console.log(logPrefix, 'sendText:error', error);
      Alert.alert(
        'Message error',
        error?.message || 'Text message send nahi ho saka.',
      );
    }
  };

  const requestAudioPermission = async () => {
    if (Platform.OS === 'android') {
      logVoiceDebug('permission:request:start:android');
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      logVoiceDebug('permission:request:result:android', {granted});
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    const micPermission = PERMISSIONS.IOS.MICROPHONE;
    logVoiceDebug('permission:check:start:ios', {micPermission});
    let status = await check(micPermission);
    logVoiceDebug('permission:check:result:ios', {status});

    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) return true;

    if (status === RESULTS.DENIED) {
      status = await request(micPermission);
      logVoiceDebug('permission:request:result:ios', {status});
      return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
    }

    if (status === RESULTS.BLOCKED) {
      logVoiceDebug('permission:blocked:ios');
      Alert.alert(
        'Microphone permission required',
        'Please allow microphone access from Settings to send voice notes.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Open Settings',
            onPress: () => {
              openSettings().catch(() => Linking.openSettings());
            },
          },
        ],
      );
      return false;
    }

    return false;
  };

  const startRecording = async () => {
    try {
      logVoiceDebug('start:tap', {
        hasChatId: Boolean(chatId),
        hasCurrentUserId: Boolean(currentUserId),
      });
      if (isRecording || !chatId || !currentUserId) {
        logVoiceDebug('start:blocked', {
          reason: isRecording
            ? 'already-recording'
            : !chatId
            ? 'missing-chat-id'
            : 'missing-current-user-id',
        });
        return;
      }
      const allowed = await requestAudioPermission();
      if (!allowed) {
        logVoiceDebug('start:blocked-permission-denied');
        Alert.alert('Permission required', 'Please allow microphone permission.');
        return;
      }
      const wavFile = `voice-${Date.now()}.wav`;
      stopActivePlayback('recording-started');
      setRecordingAudioSession();
      AudioRecord.init({
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        wavFile,
      });
      logVoiceDebug('start:init:success', {wavFile});
      recordingSecondsRef.current = 0;
      setRecordingSeconds(0);
      await AudioRecord.start();
      logVoiceDebug('start:native-start:success');
      setIsRecording(true);
      recordingIntervalRef.current = setInterval(() => {
        recordingSecondsRef.current += 1;
        setRecordingSeconds(recordingSecondsRef.current);
      }, 1000);
    } catch (error) {
      logVoiceDebug('start:error', {
        errorMessage: error?.message,
        errorCode: error?.code,
        nativeStackIOS: error?.nativeStackIOS,
        userInfo: error?.userInfo,
      });
      Alert.alert('Recording error', 'Voice note start nahi ho saka.');
      setIsRecording(false);
    }
  };

  const stopRecording = async shouldSend => {
    try {
      logVoiceDebug('stop:tap', {shouldSend});
      if (!isRecording) {
        logVoiceDebug('stop:blocked-not-recording');
        return;
      }
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      const audioUri = await AudioRecord.stop();
      logVoiceDebug('stop:native-stop:success', {audioUri});
      setIsRecording(false);
      setPlaybackAudioSession();

      if (!shouldSend || !isValidAudioPath(audioUri)) {
        logVoiceDebug('stop:skip-send', {
          shouldSend,
          hasValidAudioPath: isValidAudioPath(audioUri),
        });
        recordingSecondsRef.current = 0;
        setRecordingSeconds(0);
        return;
      }
      const uploadedUrl = await uploadVoiceNote(audioUri);
      logVoiceDebug('stop:upload:result', {uploadedUrl});
      if (!uploadedUrl) {
        Alert.alert('Upload error', 'Voice note upload nahi ho saka.');
        recordingSecondsRef.current = 0;
        setRecordingSeconds(0);
        return;
      }

      const durationSec = recordingSecondsRef.current || recordingSeconds;
      const chatRef = getDbPathRef(`chats/${chatId}`);
      await ensureChatMeta(chatRef);
      await chatRef.child('messages').push({
        type: 'voice',
        audioUri: uploadedUrl,
        durationSec,
        senderId: String(currentUserId),
        senderType,
        senderName,
        senderImage,
        createdAt: database.ServerValue.TIMESTAMP,
      });
      logVoiceDebug('stop:message-push:success', {durationSec});
      await chatRef.update({
        lastMessage: 'Voice note',
        lastMessageSenderId: currentUserId,
        lastMessageSenderType: senderType,
        updatedAt: database.ServerValue.TIMESTAMP,
      });
      logVoiceDebug('stop:chat-update:success');
      recordingSecondsRef.current = 0;
      setRecordingSeconds(0);
      setPlaybackAudioSession();
    } catch (error) {
      logVoiceDebug('stop:error', {
        errorMessage: error?.message,
        errorCode: error?.code,
        nativeStackIOS: error?.nativeStackIOS,
        userInfo: error?.userInfo,
      });
      Alert.alert('Voice note error', 'Voice note send nahi ho saka.');
      recordingSecondsRef.current = 0;
      setRecordingSeconds(0);
      setIsRecording(false);
      setPlaybackAudioSession();
    }
  };

  const playVoiceNote = item => {
    if (!item?.audioUri) return;
    if (isRecording) {
      logVoiceDebug('playback:blocked-recording-active', {messageId: item?.id});
      return;
    }

    if (playingMessageId === item.id && soundRef.current) {
      stopActivePlayback('toggle-same-message');
      return;
    }

    stopActivePlayback('start-new-message');
    setPlaybackAudioSession();
    const nextSound = new Sound(item.audioUri, null, error => {
      if (error) {
        logVoiceDebug('playback:load:error', {
          messageId: item.id,
          audioUri: item.audioUri,
          errorMessage: error?.message,
        });
        Alert.alert('Playback error', 'Voice note play nahi ho saka.');
        setPlayingMessageId(null);
        return;
      }
      setPlayingMessageId(item.id);
      nextSound.setVolume(1.0);
      nextSound.setNumberOfLoops(0);
      if (Platform.OS === 'android') {
        nextSound.setSpeakerphoneOn(true);
      }
      logVoiceDebug('playback:start', {
        messageId: item.id,
        durationSec: nextSound.getDuration(),
      });
      const durationMs = Math.max(Math.ceil(nextSound.getDuration() * 1000), 0);
      clearPlaybackTimeout();
      if (durationMs > 0) {
        playbackTimeoutRef.current = setTimeout(() => {
          stopActivePlayback('duration-timeout');
        }, durationMs + 700);
      }
      nextSound.play(() => {
        clearPlaybackTimeout();
        logVoiceDebug('playback:completed', {messageId: item.id});
        setPlayingMessageId(null);
        nextSound.release();
        soundRef.current = null;
      });
    });
    soundRef.current = nextSound;
  };

  const groupedMessages = useMemo(() => {
    const grouped = [];
    let currentDate = null;
    messages.forEach(msg => {
      if (msg.date !== currentDate) {
        grouped.push({
          id: `date-${msg.date}`,
          type: 'date',
          date: msg.date,
          formattedDate: formatDate(msg.date),
        });
        currentDate = msg.date;
      }
      grouped.push(msg);
    });
    return grouped;
  }, [messages]);

  const renderMessage = ({item}) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{item.formattedDate}</Text>
        </View>
      );
    }
    return (
      <View
        style={[
          styles.messageContainer,
          item.type === 'sent' ? styles.sentMessage : styles.receivedMessage,
        ]}>
        <View
          style={[
            styles.messageBubble,
            item.type === 'sent' ? styles.sentBubble : styles.receivedBubble,
          ]}>
          {item.messageType === 'voice' ? (
            <TouchableOpacity
              style={[
                styles.voiceContainer,
                item.type === 'sent'
                  ? styles.voiceContainerSent
                  : styles.voiceContainerReceived,
              ]}
              onPress={() => playVoiceNote(item)}>
              <View
                style={[
                  styles.voiceAvatar,
                  item.type === 'sent' && styles.voiceAvatarSent,
                ]}>
                {item?.senderImage ? (
                  <Image source={{uri: item.senderImage}} style={styles.voiceAvatarImage} />
                ) : (
                  <Icon name="person" size={15} color="#fff" />
                )}
              </View>
              <View style={styles.voiceMain}>
                <View style={styles.voiceTopRow}>
                  <View style={styles.voicePlayButton}>
                    <Icon
                      name={playingMessageId === item.id ? 'pause' : 'play-arrow'}
                      size={20}
                      color={item.type === 'sent' ? '#fff' : '#222'}
                    />
                  </View>
                  <View style={styles.waveWrap}>
                    {Array.from({length: 34}).map((_, index) => (
                      <View
                        key={`wave-${item.id}-${index}`}
                        style={[
                          styles.waveBar,
                          {
                            backgroundColor:
                              item.type === 'sent'
                                ? 'rgba(255,255,255,0.85)'
                                : 'rgba(0,0,0,0.5)',
                          },
                          {height: 6 + ((index * 5) % 16)},
                        ]}
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.voiceBottomRow}>
                  <Text style={styles.voiceDuration}>
                    {formatDuration(item.durationSec)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <Text style={styles.messageText}>{item.text}</Text>
          )}
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>{item.time}</Text>
            {item.type === 'sent' && (
              <Icon
                style={styles.tickIcon}
                name={item.messageStatus === 'sent' ? 'done' : 'done-all'}
                size={16}
                color={item.messageStatus === 'seen' ? '#34B7F1' : '#8696a0'}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerProfile}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>Message</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.participantName}>
              {participantName}
            </Text>
          </View>
        </View>
      </View>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <FlatList
          ref={flatListRef}
          data={groupedMessages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: true})
          }
        />
        <View style={styles.inputBar}>
          {!isRecording ? (
            <>
              <TouchableOpacity style={styles.attachButton} disabled>
                <Icon name="attach-file" size={24} color="#d0d0d0" />
              </TouchableOpacity>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Message"
                  placeholderTextColor="#8696a0"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                />
              </View>
            </>
          ) : (
            <View style={styles.recordingWrap}>
              <TouchableOpacity onPress={() => stopRecording(false)}>
                <Icon name="delete-outline" size={24} color="#ff3b30" />
              </TouchableOpacity>
              <View style={styles.recordingCenter}>
                <View style={styles.recordDot} />
                <Text style={styles.recordingText}>
                  Recording... {formatDuration(recordingSeconds)}
                </Text>
              </View>
            </View>
          )}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              if (message.trim()) {
                sendTextMessage();
                return;
              }
              if (isRecording) {
                stopRecording(true);
              } else {
                startRecording();
              }
            }}>
            <Icon
              name={message.trim() ? 'send' : isRecording ? 'check' : 'mic'}
              size={24}
              color={message.trim() || isRecording ? '#0084ff' : '#8696a0'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerButton: {padding: 8},
  headerProfile: {flex: 1, marginLeft: 6},
  headerInfo: {flex: 1},
  headerName: {color: '#000', fontSize: 16, fontWeight: '600'},
  participantName: {color: '#333', fontSize: 13},
  content: {flex: 1},
  messagesList: {paddingHorizontal: 10, paddingVertical: 15},
  dateContainer: {alignItems: 'center', marginVertical: 10},
  dateText: {
    backgroundColor: '#e1f5fe',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    color: '#000',
    overflow: 'hidden',
  },
  messageContainer: {flexDirection: 'row', marginBottom: 8, maxWidth: '80%'},
  sentMessage: {alignSelf: 'flex-end'},
  receivedMessage: {alignSelf: 'flex-start'},
  messageBubble: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '100%',
  },
  sentBubble: {backgroundColor: '#FDDDDD', borderBottomRightRadius: 4},
  receivedBubble: {backgroundColor: '#FCE4BE', borderBottomLeftRadius: 4},
  messageText: {fontSize: 14, lineHeight: 20, color: '#000'},
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {fontSize: 11, color: '#8696a0'},
  tickIcon: {marginLeft: 4},
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 13,
    backgroundColor: colors.white,
    elevation: 7,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  attachButton: {padding: 8},
  inputContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'lightgray',
    borderRadius: 24,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    minHeight: 46,
  },
  input: {color: '#000', fontSize: 16, paddingVertical: 12, maxHeight: 100},
  sendButton: {padding: 8},
  recordingWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 28,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    minHeight: 46,
  },
  recordingCenter: {flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 10},
  recordDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff3b30',
    marginRight: 8,
  },
  recordingText: {color: '#111', fontSize: 14, fontWeight: '500'},
  voiceContainer: {flexDirection: 'row', alignItems: 'center', minWidth: 240},
  voiceContainerSent: {flexDirection: 'row-reverse'},
  voiceContainerReceived: {flexDirection: 'row'},
  voiceAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  voiceAvatarSent: {
    marginRight: 0,
    marginLeft: 8,
  },
  voiceAvatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  voiceMain: {flex: 1},
  voiceTopRow: {flexDirection: 'row', alignItems: 'center'},
  voicePlayButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.32)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  waveWrap: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  waveBar: {
    width: 2,
    borderRadius: 2,
    marginRight: 2,
  },
  voiceBottomRow: {marginTop: 4, flexDirection: 'row', justifyContent: 'space-between'},
  voiceDuration: {fontSize: 12, color: '#222', fontWeight: '500'},
});

export default ChatScreen;
