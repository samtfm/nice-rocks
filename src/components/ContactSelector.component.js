import React, {useState} from 'react';
import { StyleSheet, Text, TextInput, Pressable, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import functions from '@react-native-firebase/functions';

const searchUser = functions().httpsCallable('searchUser')

const ContactSelector = ({ route }) => {
  const { targetScreen, outputIdParamName } = route.params

  const navigation = useNavigation();
  const {uid} = useSelector(state => state.firebase.auth)
  const [newRecipientId, setNewRecipientId] = useState()

  useFirestoreConnect(() => [
    {
      collection: "profiles",
      doc: newRecipientId,
    }
  ])
  const newRecipient = useSelector(
    ({ firestore: { data } }) => ( data.profiles && data.profiles[newRecipientId])
  )


  const contacts = useSelector(
    ({ firestore: { data } }) => {
      return data.userData && data.userData.contacts;
    }
  )

  let emailCheckTimeout = null;
  const onChangeEmailInput = inputText => {
    const email = inputText.toLowerCase()
    //simple regex to test if a string might be a valid email address
    if (/\S+@\S+\.\S+/.test(email)){
      clearTimeout(emailCheckTimeout)
      emailCheckTimeout = setTimeout(() => {
        searchUser({'email': email}).then(response => {
            setNewRecipientId(response.data.userId);
        });
      }, 800);
    }
  }

  return (
    <View>
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
