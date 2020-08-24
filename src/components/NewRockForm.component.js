import React, { useState } from 'react';
import RockList from './RockList.component'
import ContactName from './ContactName.component';
import { StyleSheet, Text, View, TextInput, Button, Pressable} from 'react-native';
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import { useFirestoreConnect } from 'react-redux-firebase'
import colors from 'styles/colors';

const charLimits = {
  url: 1000,
  note: 2000,
  title: 200,
}

const NewRockForm = ({toUserId}) => {
  const navigation = useNavigation();
  const firestore = useFirestore();
  const uid = useSelector(state => state.firebase.auth.uid);

  const defaultForm = {
    title: '',
    note: '',
    url: '',
  }

  const [errorMessage, setErrorMessage] = useState('')
  const [disableSubmit, setDisableSubmit] = useState(false)
  const [form, setForm] = useState(defaultForm);

  const sendRock = () => {
    setDisableSubmit(true);
    firestore.collection("profiles").doc(toUserId).collection("rocks").add({
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
      }).catch((e) => {
        setErrorMessage("Whoops, something went wrong. Maybe try that again?");
        setDisableSubmit(false);
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
  const formIsReady = Boolean(form.title.length && form.note.length && toUserId)
  return (
    <View style={{backgroundColor: 'transparent'}}>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <View style={styles.inputs}>
        <Pressable
          style={{...styles.contactSelector, ...styles.input}}
          onPress={() => navigation.navigate(
            'SelectContact',
            { targetScreen: "ComposeRock", outputIdParamName: "toUserId" }
          )}
        >
          {toUserId ? (
            <Text>To: <ContactName id={toUserId} /></Text>
          ) : (
            <Text>Select Contact</Text>
          )}
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder="URL (optional)"
          onChangeText={url => updateForm({ url })}
          defaultValue={form.url}
          autoCompleteType="off"
          maxLength={charLimits.url}
          multiline
        />
        <TextInput
          style={{...styles.titleInput, ...styles.input}}
          placeholder="Title"
          onChangeText={title => updateForm({ title })}
          defaultValue={form.title}
          autoCompleteType="off"
          maxLength={charLimits.title}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Say something about your rock..."
          onChangeText={note => updateForm({ note })}
          defaultValue={form.note}
          autoCompleteType="off"
          maxLength={charLimits.note}
          multiline
          stripPastedStyles={true}
        />
      </View>
      <View style={styles.sendButton}>
        <Button
          onPress={sendRock}
          title="Send!"
          color={colors.blue}
          accessibilityLabel="Send Rock"
          disabled={!formIsReady || disableSubmit}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  errorMessage: {
    color: "red",
  },
  contactSelector: {
    marginLeft: 3,
  },
  titleInput: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  sendButton: {
    marginBottom: 30
  },
  input: {
    marginBottom: 12,
  },
  inputs: {
    marginBottom: 20,
    backgroundColor: colors.beige,
    padding: 10,
    borderRadius: 3,

    //android
    elevation: 4,

    //ios
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,

  }
});

export default NewRockForm;
