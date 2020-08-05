import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from "react-redux";
import { useFirestoreConnect } from 'react-redux-firebase'


// in case the user isn't in the contacts list, pull the data from profile
const ProfileName = ({id}) => {
  useFirestoreConnect(() => [
    {
      collection: "profiles",
      doc: id,
    }
  ])
  const profile = useSelector(
    ({ firestore: { data } }) => {
      return data.profiles[id];
    }
  )

  return (
    <Text>
    {profile.displayName}
    </Text>
  )
}

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
  if (!id) {return null;}
  return contacts[id] ? (
    <Text>{contacts[id].displayName}</Text>
  ) : (
    <ProfileName id={id} />
  )
}

export default ContactName;
