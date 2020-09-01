import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Linking, TouchableOpacity, LayoutAnimation } from 'react-native';
import Text from 'components/Text';
import ContactName from 'components/ContactName';
import { relativeTimeFromEpoch } from 'util/time';
import colors from 'styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ResponseForm from './ResponseForm';
import Response from './Response';
import { RootState } from 'reducers/rootReducer';
import { useSelector } from 'react-redux';

interface RockDetails {
  id: string
  title: string
  url: string
  note: string
  timestamp: any
  fromUserId: string
  toUserId: string
  response?: {
    reaction: string
    note: string
    timestamp: any
  }
}

const springAnimConfig = {
  duration: 700,
  create: { type: 'spring', property: 'scaleXY', springDamping: 1.2, duration: 500 },
  update: { type: 'spring', springDamping: 1.2, duration: 500},
  delete: { type: 'spring', property: 'scaleXY', springDamping: 1.2, duration: 500  },
}

const RockDetails = ({id, title, url, note, timestamp, fromUserId, toUserId, response}) => {
  const uid = useSelector((state : RootState) => (state.firestore.data.userData.id));
  const [showResponse, setShowResponse] = useState(Boolean(response))
  useEffect(() => {
    setTimeout(() => {
      LayoutAnimation.configureNext(springAnimConfig)
      setShowResponse(Boolean(response))
    }, 200)
  },[response])

  return (
    <View style={{flexDirection: 'column'}}>
      <Text>From: <ContactName id={fromUserId}/></Text>
      <View style={styles.rockItem}>
        <Text style={styles.title}>{title || url}</Text>
        <Text style={styles.description}>{note}</Text>
        {Boolean(url) && (
          <TouchableOpacity
            style={styles.url}
            onPress={() => Linking.openURL(url)}
          >
            <Text style={styles.urlText}>{url}</Text>
            <Icon name={'open-in-new'} color={colors.blue} size={24} />
          </TouchableOpacity>
        )}
        {timestamp && <Text style={styles.timestamp}>{relativeTimeFromEpoch(timestamp.seconds)}</Text>}
      </View>

      {showResponse && response && (
        <Response {...response} fromUserId={toUserId} />
      )}
      {!showResponse && uid === toUserId && (
        <ResponseForm profileId={toUserId} rockId={id} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rockItem: {
    padding: 10,
    marginBottom: 6,
    borderRadius: 3,
    paddingBottom: 33,
  },
  title: {
    fontWeight: 'bold',
    color: colors.gray40,
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    marginBottom: 8,
    color: colors.gray40,
  },
  url: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  urlText: {
    marginRight: 10,
    maxWidth: '90%',
    color: colors.blue,
  },
  timestamp: {
    color: colors.gray70,
    position: 'absolute',
    fontSize: 11,
    right: 8,
    bottom: 8,
  },
});

export default RockDetails;
