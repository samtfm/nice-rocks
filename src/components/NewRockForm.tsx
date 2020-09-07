import React, { useState, useEffect, ReactElement } from 'react';
import ContactName from './ContactName';
import { StyleSheet, View, Button, Pressable, Alert} from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import Text from 'components/Text';
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import colors from 'styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from 'reducers/rootReducer';

const charLimits = {
  url: 1000,
  note: 2000,
  title: 200,
}

const defaultForm = {
  title: '',
  note: '',
  url: '',
}
interface FormUpdate{
  title?: string,
  note?: string,
  url?: string,
}

const commonInputProps = {
  autoCompleteType: 'off' as const,
  dense: true,
}

interface NewRockForm{
  toUserId: string
  title?: string
  url?: string
}
const NewRockForm = ({toUserId, title, url}: NewRockForm): ReactElement => {
  const navigation = useNavigation();
  const firestore = useFirestore();

  const [firstOpen, setFirstOpen] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('')
  const [disableSubmit, setDisableSubmit] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    title: title ? title : '',
    url: url ? url : '',
    note: '',
  });

  const uid = useSelector((state : RootState) => (state.firestore.data.userData.id));

  // Add warning before discarding unsaved rock
  useEffect(() => (
    navigation.addListener('beforeRemove', (e) => {
      if (!hasUnsavedChanges) {
        return;
      }
      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Prompt the user before leaving the screen
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: "Stay", style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    })),
    [navigation, hasUnsavedChanges]
  );

  // Automatically open contact selector
  if (!toUserId && firstOpen) {
    setFirstOpen(false);
    setTimeout(() => {
      navigation.navigate(
        'SelectContact',
        { targetScreen: "ComposeRock", outputIdParamName: "toUserId" }
      )
    }, 400)
  } 

  const sendRock = () => {
    setDisableSubmit(true);
    const ref = { collection: `profiles/${toUserId}/rocks` }
    firestore.add(ref, {
        title: form.title,
        note: form.note,
        url: form.url,
        fromUserId: uid,
        toUserId: toUserId,
        timestamp: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        setSubmitted(true);
        setHasUnsavedChanges(false);
        setTimeout(() => {
          if (navigation.isFocused()){
            navigation.goBack();
          }
        }, 1400)
      }, () => {
        setErrorMessage("Whoops, something went wrong. Maybe try that again?");
        setDisableSubmit(false);
      });
  };


  const updateForm = (updates: FormUpdate) => {
    const updated = Object.assign({}, form, updates)
    if (updated.url || updated.title || updated.note) setHasUnsavedChanges(true);
    setForm(updated)
  }

  const formIsReady = Boolean(form.title.length && form.note.length && toUserId)
  return (
    <View style={{backgroundColor: 'transparent'}}>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <View style={styles.inputs}>
        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
        <Text style={{marginRight: 4, marginLeft: 5}}>To:</Text>
        <Pressable
          style={[styles.contactSelector]}
          onPress={() => navigation.navigate(
            'SelectContact',
            { targetScreen: "ComposeRock", outputIdParamName: "toUserId" }
          )}
        >
          {toUserId ? (
            <Text><ContactName id={toUserId} /></Text>
          ) : (
            <Text style={styles.selectContactText}>Select contact</Text>
          )}
        </Pressable>
        </View>
        <TextInput
          style={[styles.input, styles.urlInput]}
          label="URL (optional)"
          onChangeText={url => updateForm({ url: url.replace(/(\r\n|\n|\r)/gm, "") })}
          value={form.url}
          maxLength={charLimits.url}
          multiline
          {...commonInputProps}
        />
        <TextInput
          style={styles.input}
          label="Title"
          onChangeText={title => updateForm({ title: title.replace(/(\r\n|\n|\r)/gm, "") })}
          value={form.title}
          maxLength={charLimits.title}
          multiline={true}
          {...commonInputProps}
        />
        <HelperText style={{backgroundColor: colors.beige}} type="info">
          What are you sharing?
        </HelperText>

        <View style={styles.input}>
          <TextInput
            style={[styles.noteInput]}
            label="Note"
            onChangeText={note => updateForm({ note })}
            value={form.note}
            maxLength={charLimits.note}
            multiline
            {...commonInputProps}
          />
        </View>
        <HelperText type="info">
          Say something about your recommendation
        </HelperText>

        {submitted && (
          <View style={styles.successOverlay}>
            <Icon name={'check'} color={colors.primary} size={42} />
          </View>
        )}
      </View>
      <View style={styles.sendButton}>
        <Button
          onPress={sendRock}
          title={submitted ? "Sent!" : "Send!"}
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
  selectContactText: {
    color: colors.blue,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  contactSelector: {
    marginLeft: 3,
    height: 40,
    padding: 10,
    borderBottomWidth: 2,
    borderColor: 'hsl(0, 0%, 82%)',
    backgroundColor: 'hsl(36, 33%, 99%)',
    borderRadius: 4,
  },
  sendButton: {
    marginBottom: 30
  },
  input: {
    marginTop: 6,
    backgroundColor: 'hsl(36, 33%, 99%)',
    borderRadius: 4,
  },
  noteInput: {
    minHeight: 90,
    backgroundColor: 'hsl(36, 33%, 99%)',
  },
  urlInput: {
    maxHeight: 100,
  },
  inputs: {
    marginBottom: 20,
    backgroundColor: colors.beige,
    padding: 10,
    borderRadius: 4,

    //android
    elevation: 4,

    //ios
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,

  },
  successOverlay: {
    backgroundColor: 'hsla(0, 0%, 100%, 0.3)',
    position: 'absolute',
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default NewRockForm;
