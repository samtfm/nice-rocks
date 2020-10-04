import React, {useState, ReactElement} from 'react';
import { StyleSheet, Pressable, View, ScrollView } from 'react-native';
import Text from 'components/Text';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'
import functions from '@react-native-firebase/functions';
import colors from 'styles/colors';
import { RootState } from 'reducers/rootReducer';
import ContactName from './ContactName';
import { Searchbar, ProgressBar, Surface } from 'react-native-paper';

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
    setSearchVal(inputText)
    const email = inputText.toLowerCase()
    //simple regex to test if a string might be a valid email address
    if (/\S+@\S+\.\S+/.test(email)){
      if (emailCheckTimeout) clearTimeout(emailCheckTimeout);
      setLoading(true)
      emailCheckTimeout = setTimeout(() => {
        searchUser({'email': email}).then(response => {
          setNewRecipientId(response.data.userId);
          setLoading(false)
        }, () => {
          // error
          setLoading(false)
        });
      }, 600);
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: colors.beige}}>
      <View style={styles.searchBar}>

      <Searchbar
        placeholder="Search by email"
        onChangeText={onChangeEmailInput}
        autoCompleteType="off"
        value={searchVal}
        autoCapitalize="none"
        maxLength={254}
      />
      <ProgressBar visible={loading} color={colors.primary} indeterminate/>
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
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 4,
                  backgroundColor: pressed
                    ? 'lightGray'
                    : 'white'
                },
            ]}>
              <Surface style={{elevation: 8}}>
                <Text style={styles.contact}><ContactName id={newRecipientId}/></Text>
              </Surface>

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
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 4,
                  backgroundColor: pressed
                    ? 'lightGray'
                    : 'white'
                },
            ]}>
              <Surface style={{elevation: 2}}>
                <Text style={styles.contact}>{contact.displayName}</Text>
              </Surface>
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
    marginBottom: 8,
    marginTop: 8,
    borderRadius: 5,
  },
  contactList: {
    // padding: 10,
    backgroundColor: 'transparent',
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
