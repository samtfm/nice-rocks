import React, {useState, ReactElement, useEffect} from 'react';
import { StyleSheet, Pressable, View, ScrollView } from 'react-native';
import Text from 'components/Text';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'
import functions from '@react-native-firebase/functions';
import colors from 'styles/colors';
import { RootState } from 'reducers/rootReducer';
import ContactName from './ContactName';
import { Searchbar, ProgressBar, Surface } from 'react-native-paper';
import Avatar from './Avatar';

const searchUser = functions().httpsCallable('searchUser')

interface Contacts {
  [userId: string]: {
    displayName: string,
    photo: string, 
    email?: string,
  }
}
interface Contact {
  displayName: string,
  photo: string,  
  email?: string,
  id: string,
}

interface ContactSelector{
  route: any
}

const ContactItem = ({ id, onPress }: {id: string, onPress: () => void}): ReactElement  => (
  <Pressable
    onPress={onPress}
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
    <Surface style={styles.contact}>
      <Avatar 
        size={36}
        id={id}
        clickable={false}
      />
      <Text style={styles.contactText}><ContactName id={id}/></Text>
    </Surface>
  </Pressable>
)

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

  const [displayContacts, setDisplayContacts] = useState<Contact[]>([])

  useEffect(() => {
    const contactList = Object.entries(contacts)
    .map(([id, {displayName, photo, email}]) => (
      {displayName, photo, email, id}
    ))
    .filter(contact => (
      contact.displayName.toLowerCase().includes(searchVal) ||
      (contact.email && contact.email.startsWith(searchVal))
    ));
    setDisplayContacts(contactList)
  }, [contacts, searchVal])


  const onChangeEmailInput = (rawInputText: string) => {
    setSearchVal(rawInputText);
    const regSelect = rawInputText.toLowerCase().match(/\s*(\S*)\s*/)
    const inputText = regSelect && regSelect[1] || ''
    //simple regex to test if a string might be a valid email address
    if (/\S+@\S+\.\S+/.test(inputText)){
      if (emailCheckTimeout) clearTimeout(emailCheckTimeout);
      setLoading(true)
      emailCheckTimeout = setTimeout(() => {
        searchUser({'email': inputText}).then(response => {
          setNewRecipientId(response.data.userId);
          setLoading(false)
        }, () => {
          // error
          setLoading(false)
          setNewRecipientId(undefined)
        });
      }, 600);
    } else {
      setNewRecipientId(undefined)
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: colors.beige}}>
      <View style={styles.searchBar}>

      <Searchbar
        placeholder="Type a name or email"
        onChangeText={onChangeEmailInput}
        autoCompleteType="off"
        value={searchVal}
        autoCapitalize="none"
        maxLength={254}
      />
      <ProgressBar visible={loading} color={colors.primary} indeterminate/>
      </View>
      {newRecipientId ? (
        <ScrollView style={styles.contactList}>
          <ContactItem id={newRecipientId} onPress={() => {
            navigation.navigate(targetScreen, {[outputIdParamName]: newRecipientId})
          }}/>
        </ScrollView>
      ) : (
        <ScrollView>
          {displayContacts.map(({id}) => (
            <ContactItem key={id} id={id} onPress={() => {
              navigation.navigate(targetScreen, {[outputIdParamName]: id})
            }}/>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  contactList: {
    backgroundColor: 'transparent',
    display: 'flex',
  },
  contactText: {
    fontSize: 18,
    paddingHorizontal: 8,
  },
  contact: {
    elevation: 2,
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default ContactSelector;
