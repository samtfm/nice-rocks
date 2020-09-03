import React, {useState, ReactElement} from 'react';
import { StyleSheet, Pressable, View, ScrollView } from 'react-native';
import Text from 'components/Text';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'
import functions from '@react-native-firebase/functions';
import colors from 'styles/colors';
import { RootState } from 'reducers/rootReducer';
import ContactName from './ContactName';
import { Searchbar, ProgressBar } from 'react-native-paper';

const searchUser = functions().httpsCallable('searchUser')

interface Contacts {
  [userId: string]: {
    displayName: string,
    photo: string,  
  }
}

interface ContactSelector{
  route: any
}

const ContactSelector = ({ route }: ContactSelector): ReactElement => {
  const { targetScreen, outputIdParamName } = route.params

  const navigation = useNavigation();
  const [newRecipientId, setNewRecipientId] = useState<undefined | string>()
  const [searchVal, setSearchVal] = useState('')
  const [loading, setLoading] = useState(false);


  const contacts : Contacts = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data.userData && data.userData.contacts;
    }
  )

  let emailCheckTimeout : ReturnType<typeof setTimeout> | null = null;

  const onChangeEmailInput = (inputText: string) => {
    const email = inputText.toLowerCase()
    setSearchVal(email)
    //simple regex to test if a string might be a valid email address
    if (/\S+@\S+\.\S+/.test(email)){
      if (emailCheckTimeout) clearTimeout(emailCheckTimeout);
      setLoading(true)
      emailCheckTimeout = setTimeout(() => {
        searchUser({'email': email}).then(response => {
            setNewRecipientId(response.data.userId);
            setLoading(false)
        });
      }, 600);
    }
  }

  return (
    <View style={{backgroundColor: colors.beige}}>
      <View style={styles.searchBar}>

      <Searchbar
        placeholder="Search by email"
        onChangeText={onChangeEmailInput}
        autoCompleteType="off"
        value={searchVal}
        maxLength={254}
      />
      <ProgressBar visible={loading} color={colors.mint} indeterminate/>
      </View>
      <ScrollView style={styles.contactList}>
        {newRecipientId &&
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
              <Text style={styles.contact} ><ContactName id={newRecipientId}/></Text>
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
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
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
