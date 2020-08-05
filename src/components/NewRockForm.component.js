import React, { useState } from 'react';
import RockList from './RockList.component'
import ContactName from './ContactName.component';
import { StyleSheet, Text, View, TextInput, Button, Pressable} from 'react-native';
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import { useFirestoreConnect } from 'react-redux-firebase'

const charLimits = {
  url: 500,
  note: 1000,
  title: 80,
}

const NewRockForm = ({route}) => {
  const navigation = useNavigation();
  const firestore = useFirestore();
  const uid = useSelector(state => state.firebase.auth.uid);

  const toUserId = route && route.params && route.params.toUserId;
  useFirestoreConnect(() => [
    {
      collection: "profiles",
      doc: toUserId,
    }
  ])
  const toUserProfile = useSelector(
    ({ firestore: { data } }) => ( data.profiles && data.profiles[toUserId])
  )

  const defaultForm = {
    title: '',
    note: '',
    url: '',
    toUser: toUserId || null,
  }

  const [errorMessage, setErrorMessage] = useState('')
  const [disableSubmit, setDisableSubmit] = useState(false)
  const [form, setForm] = useState(defaultForm);

  const sendRock = () => {
    setDisableSubmit(true);
    firestore.collection("profiles").doc(form.toUser).collection("rocks").add({
        title: form.title,
        note: form.note,
        url: form.url,
        fromUserId: uid,
        toUserId: toUserId,
        timestamp: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        setDisableSubmit(false);
        setForm(defaultForm);
      });
  };

  // TODO: React-native TextInputs have built in maxLength fields, so this maybe isn't necessary?
  const validateCharLimits = (formData) => {
    for (const [field, limit] of Object.entries(charLimits)) {
      if (formData[field] && formData[field].length > limit){
        setErrorMessage(`exceeded ${limit} character limit for ${field}`)
        return false;
      }
    }
    setErrorMessage('')
    return true;
  }

  const updateForm = updates => {
    if (validateCharLimits(updates)){
      setForm(Object.assign({}, form, updates))
    }
  }
  const formIsReady = Boolean(form.title.length && form.note.length)

  return (
    <View >
      <Text>Send rock</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <Pressable
        onPress={() => navigation.navigate(
          'SelectContact',
          { onSelect: toUser => updateForm({ toUser }) }
        )}
      >
        {form.toUser ? (
          <ContactName id={form.toUser} />
        ) : (
          <Text>Select Contact</Text>
        )}
      </Pressable>
      <TextInput
        placeholder="URL (optional)"
        onChangeText={url => updateForm({ url })}
        defaultValue={form.url}
        autoCompleteType="off"
        maxLength={charLimits.url}
      />
      <TextInput
        placeholder="Title"
        onChangeText={title => updateForm({ title })}
        defaultValue={form.title}
        autoCompleteType="off"
        maxLength={charLimits.title}
      />
      <TextInput
        placeholder="Say something about your rock..."
        onChangeText={note => updateForm({ note })}
        defaultValue={form.note}
        autoCompleteType="off"
        maxLength={charLimits.note}
      />
      <Button
        onPress={sendRock}
        title="Send!"
        color="#841584"
        accessibilityLabel="Send Rock"
        disabled={!formIsReady || disableSubmit}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  errorMessage: {
    color: "red",
  },
});

export default NewRockForm;
