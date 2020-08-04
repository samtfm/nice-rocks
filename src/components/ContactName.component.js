import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from "react-redux";
import { useFirestoreConnect } from 'react-redux-firebase'


const ContactName = ({id}) => {
  const {uid} = useSelector(state => state.firebase.auth)
  useFirestoreConnect(() => [
    {
      collection: "users",
      doc: uid,
    }
  ])
  const contacts = useSelector(
    ({ firestore: { data } }) => {
      return data.users && data.users[uid] && data.users[uid].contacts;
    }
  )

  return (
    <Text>{contacts[id].displayName}</Text>
  )
}

export default ContactName;
