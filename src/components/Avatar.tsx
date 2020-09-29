import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux'
import { RootState } from 'reducers/rootReducer';
import { Avatar as PaperAvatar, Modal, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Pressable, View } from 'react-native';
import Text from 'components/Text';
import ContactName from './ContactName';
import colors from 'styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AvatarProps {
  id: string,
  size: number,
  clickable?: boolean,
}

const Avatar = ({id, size, clickable=true}: AvatarProps): ReactElement => {
  const [ popupVisible, setPopupVisible ] = useState(false);
  const navigation = useNavigation();

  const contacts = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data.userData.contacts
    }
  ) || {}
  const AvatarBubble = () => (
    contacts[id] && contacts[id].photo ? (
      <PaperAvatar.Image 
        size={size}
        source={{uri: contacts[id].photo}}
      />
    ) : (
      <PaperAvatar.Icon 
        size={size}
        icon={'account'}
      />
    )
  )

  return (
    <>

    <Pressable
      onPress={() => {
        if (clickable) setPopupVisible(true)
      }}
    >
      <AvatarBubble />
    </Pressable>
    <Portal>

    <Modal contentContainerStyle={styles.popup} visible={popupVisible} onDismiss={() => setPopupVisible(false)}>
      <View style={styles.popupNameBubble}>
        <AvatarBubble />
        <ContactName style={styles.popupNameText} id={id}></ContactName>
      </View>
      <Pressable
      style={styles.popupActionBubble}
      onPress={() => {
        setPopupVisible(false)
        navigation.navigate('ComposeRock', {toUserId: id})
      }}
      >
        <Icon name='cube-send' size={24} color={colors.black} />
        <Text style={{marginLeft: 4, color: 'black'}}>Send rock</Text>
      </Pressable>
    </Modal>
    </Portal>
    </>
  );
}
const styles = StyleSheet.create({
  popup: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    alignSelf: 'center',
  },
  popupNameBubble: {
    backgroundColor: colors.gray90,
    borderRadius: 50,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popupNameText: {
    fontSize: 18,
    marginLeft: 6,
    marginRight: 10,
  },
  popupActionBubble: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: colors.blueLight,
    borderRadius: 50,
  }
})


export default Avatar;
