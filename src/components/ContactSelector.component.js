import React from 'react';
import { StyleSheet, Text, Pressable, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'


const ContactSelector = ({ route }) => {
  const { onSelect } = route.params

  const navigation = useNavigation();
  const {uid} = useSelector(state => state.firebase.auth)
  useFirestoreConnect(() => [
    {
      collection: "users",
      doc: uid,
    }
  ])
  const contacts = useSelector(
    ({ firestore: { data } }) => {
      return data.users && data.users[uid] && data.users[uid].contacts
    }
  )

  return (
    <View>
      <Text style={styles.test}>Select Contact!</Text>
      <ScrollView style={styles.contactList}>
        {contacts && Object.entries(contacts).map(([id, contact]) => (
            <Pressable
              key={id}
              onPress={() => {
                onSelect({displayName: contact.displayName, photo: contact.photo, id});
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
