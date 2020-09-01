import React from 'react';
import { useSelector } from 'react-redux'
import { RootState } from 'reducers/rootReducer';
import { Avatar as PaperAvatar } from 'react-native-paper';
interface AvatarProps {
  id: string,
  size: number,
}

const Avatar = ({id, size}: AvatarProps) => {
  const contacts = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data.userData.contacts
    }
  )
  return (
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
  );
}

export default Avatar;
