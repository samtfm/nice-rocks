import React, { ReactElement } from 'react';
import Text from 'components/Text';
import { useSelector } from "react-redux";
import { useFirestoreConnect } from 'react-redux-firebase'
import { RootState } from 'reducers/rootReducer';

interface ProfileName {
  style: any
  id: string
}
// in case the user isn't in the contacts list, pull the data from profile
const ProfileName = ({style, id}: ProfileName): ReactElement => {
  useFirestoreConnect(() => [
    {
      collection: "profiles",
      doc: id,
    }
  ])
  const profile = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data.profiles && data.profiles[id];
    }
  )

  return (
    <Text style={style}>
      {(profile && profile.displayName) ? profile.displayName : ''}
    </Text>
  )
}

interface ContactName {
  style?: any,
  id: string,
}

const ContactName = ({style, id}: ContactName) => {
  const contacts = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data.userData.contacts;
    }
  )
  if (!contacts || !id) {return null;}
  return contacts[id] ? (
    <Text style={style || {}}>{contacts[id].displayName}</Text>
  ) : (
    <ProfileName style={style || {}} id={id} />
  )
}

export default ContactName;
