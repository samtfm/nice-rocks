import React, { useState } from 'react';
import RockList from './RockList.component'
import { StyleSheet, Text, View, TextInput, Button} from 'react-native';
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";

const charLimits = {
  url: 500,
  note: 1000,
  title: 80,
}

const defaultForm = {
  title: '',
  note: '',
  url: '',
}

const NewRockForm = () => {
  // const [presentToDo, setPresentToDo] = useState("");
  const firestore = useFirestore();
  const uid = useSelector((state) => state.firebase.auth.uid);

  const [errorMessage, setErrorMessage] = useState('')
  const [disableSubmit, setDisableSubmit] = useState(false)
  const [form, setForm] = useState(defaultForm);


  const sendRock = (todo) => {
    setDisableSubmit(true);
    firestore
      .collection("profiles")
      .doc(uid)
      .collection("rocks")
      .add({
        title: todo,
        isDone: false,
      })
      .then((docRef) => {
        docRef.update({
          id: docRef.id,
        });
      })
      .then(() => {
        console.log("submitted successfully!")
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
  console.log(form)
  const formIsReady = Boolean(form.title.length && form.note.length)

  return (
    <View >
      <Text>Send rock</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
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
