import React, {useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import Header from '../../../components/header';
import {colors} from '../../../constants';

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

const ChatList = ({navigation}) => {
  const [chatItems, setChatItems] = useState([]);
  const user = useSelector(state => state?.LoginSlice?.user);
  const currentUserId = useMemo(() => normalizeId(getUserId(user)), [user]);

  useEffect(() => {
    if (!currentUserId) return undefined;
    const chatsQuery = database()
      .ref('chats')
      .orderByChild('merchantId')
      .equalTo(String(currentUserId));

    const onChatsValue = chatsQuery.on('value', snapshot => {
      const chats = snapshot.val() || {};
      const nextItems = Object.entries(chats)
        .map(([chatNodeId, chat]) => {
          const updatedAt = Number(chat?.updatedAt || 0);
          return {
            id: chat?.chatId || chatNodeId,
            orderId: normalizeId(chat?.orderId) || null,
            customerId: normalizeId(chat?.customerId),
            merchantId: normalizeId(chat?.merchantId),
            participantName: chat?.customerName || 'Customer',
            lastMessage: chat?.lastMessage || 'Start conversation',
            updatedAt,
          };
        })
        .sort((a, b) => b.updatedAt - a.updatedAt);
      setChatItems(nextItems);
    });

    return () => chatsQuery.off('value', onChatsValue);
  }, [currentUserId]);

  return (
    <SafeAreaView style={styles.container}>
      <Header text="Chats" goBack />
      <FlatList
        data={chatItems}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate('ChatRoom', {
                orderId: item.orderId,
                customerId: item.customerId,
                merchantId: item.merchantId,
                participantName: item.participantName,
                senderType: 'merchant',
              })
            }>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(item.participantName || 'C').slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.name}>{item.participantName}</Text>
              <Text numberOfLines={1} style={styles.preview}>
                {item.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No chats yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    padding: 12,
    flexGrow: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.redish,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: '#111',
    fontSize: 15,
    fontWeight: '600',
  },
  preview: {
    color: '#666',
    marginTop: 3,
    fontSize: 13,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#444',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default ChatList;
