import React from 'react';
import { View } from 'react-native';
import Text from 'components/Text.component';
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
      return data.profiles && data.profiles[id];
    }
  )

  return (
    <Text>
    {(profile && profile.displayName) ? profile.displayName : ''}
    </Text>
  )
}

const ContactName = ({id}) => {
  const contacts = useSelector(
    ({ firestore: { data } }) => {
      return data.userData && data.userData.contacts;
    }
  )
  if (!contacts || !id) {return null;}
  return contacts[id] ? (
    <Text>{contacts[id].displayName}</Text>
  ) : (
    <ProfileName id={id} />
  )
}

export default ContactName;
