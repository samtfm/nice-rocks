import React, {useState} from 'react';
import { StyleSheet, TextInput, Pressable, View, ScrollView } from 'react-native';
import Text from 'components/Text';
import { useNavigation } from '@react-navigation/native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import functions from '@react-native-firebase/functions';
import colors from 'styles/colors';
import { RootState } from 'reducers/rootReducer';

const searchUser = functions().httpsCallable('searchUser')

const ContactSelector = ({ route }) => {
  const { targetScreen, outputIdParamName } = route.params

  const navigation = useNavigation();
  const [newRecipientId, setNewRecipientId] = useState()

  useFirestoreConnect(() => [
    {
      collection: "profiles",
      doc: newRecipientId,
    }
  ])
  const newRecipient = useSelector(
    ({ firestore: { data } }: RootState) => ( data.profiles && data.profiles[newRecipientId])
  )


  const contacts = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data.userData && data.userData.contacts;
    }
  )

  let emailCheckTimeout : ReturnType<typeof setTimeout> | null = null;

  const onChangeEmailInput = inputText => {
    const email = inputText.toLowerCase()
    //simple regex to test if a string might be a valid email address
    if (/\S+@\S+\.\S+/.test(email)){
      if (emailCheckTimeout) clearTimeout(emailCheckTimeout);
      emailCheckTimeout = setTimeout(() => {
        searchUser({'email': email}).then(response => {
            setNewRecipientId(response.data.userId);
        });
      }, 800);
    }
  }

  return (
    <View style={{backgroundColor: colors.beige}}>
      <TextInput
        style={styles.searchBar}
        placeholder="example@bestmail.net"
        onChangeText={onChangeEmailInput}
        defaultValue={''}
        autoCompleteType="off"
        maxLength={254}
      />
      <ScrollView style={styles.contactList}>
        {newRecipient &&
          <View style={styles.newContact}>
            <Pressable
              onPress={() => {
                navigation.navigate(targetScreen, {[outputIdParamName]: newRecipientId})
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? 'lightGray'
                    : 'white'
                },
            ]}>
              <Text style={styles.contact} >{newRecipient.displayName}</Text>
            </Pressable>
          </View>
        }
        {contacts && Object.entries(contacts).map(([id, contact]) => (
            <Pressable
              key={id}
              onPress={() => {
                navigation.navigate(targetScreen, {[outputIdParamName]: id})
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? 'lightGray'
                    : 'white'
                },
            ]}>
              <Text style={styles.contact}>{contact.displayName}</Text>
            </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    paddingBottom: 8,
    margin: 16,
    marginTop: 20,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  newContact: {
    marginBottom: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    borderRadius: 5,
  },
  contactList: {
    padding: 10,
    display: 'flex',
  },
  contact: {
    borderRadius: 5,
    padding: 20,
    fontSize: 18,

    alignItems: 'center',
  },
});

export default ContactSelector;
