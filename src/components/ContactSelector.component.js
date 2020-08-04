import React, {useState} from 'react';
import { StyleSheet, Text, TextInput, Pressable, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import functions from '@react-native-firebase/functions';

const searchUser = functions().httpsCallable('searchUser')

const ContactSelector = ({ route }) => {
  const { onSelect } = route.params

  const navigation = useNavigation();
  const {uid} = useSelector(state => state.firebase.auth)
  const [newRecipientId, setNewRecipientId] = useState()

  useFirestoreConnect(() => [
    {
      collection: "users",
      doc: uid,
    },
    {
      collection: "profiles",
      doc: newRecipientId,
    }
  ])
  const newRecipient = useSelector(
    ({ firestore: { data } }) => ( data.profiles[newRecipientId])
  )


  const contacts = useSelector(
    ({ firestore: { data } }) => {
      return data.users && data.users[uid] && data.users[uid].contacts
    }
  )

  let emailCheckTimeout = null;
  const onChangeEmailInput = inputText => {
    //simple regex to test if a string might be a valid email address
    if (/\S+@\S+\.\S+/.test(inputText)){
      clearTimeout(emailCheckTimeout)
      emailCheckTimeout = setTimeout(() => {
        searchUser({'email': inputText}).then(response => {
            setNewRecipientId(response.data.userId);
        });
      }, 800);
    }
  }

  return (
    <View>
      <TextInput
        placeholder="example@bestmail.net"
        onChangeText={onChangeEmailInput}
        defaultValue={''}
        autoCompleteType="off"
        maxLength={254}
      />
      {newRecipient &&
        <Pressable
          onPress={() => {
            onSelect(newRecipientId);
            navigation.goBack();
          }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? 'lightGray'
                : 'white'
            },
        ]}>
          <Text style={styles.contact}>{newRecipient.displayName}</Text>
        </Pressable>
      }
      <Text style={styles.test}>Select Contact!</Text>
      <ScrollView style={styles.contactList}>
        {contacts && Object.entries(contacts).map(([id, contact]) => (
            <Pressable
              key={id}
              onPress={() => {
                onSelect(id);
                navigation.goBack();
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
  test: {
    fontSize: 10,
  },
  contactList: {
    marginTop: 20,
    padding: 10,
    display: 'flex',
  },
  contact: {
    borderRadius: 5,
    padding: 20,
    fontSize: 20,

    alignItems: 'center',
  },
});

export default ContactSelector;
