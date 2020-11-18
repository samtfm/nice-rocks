import React, { useState, useEffect, ReactElement } from 'react';
import ContactName from './ContactName';
import { StyleSheet, View, Pressable, Alert, BackHandler} from 'react-native';
import { HelperText, TextInput, Button } from 'react-native-paper';
import Text from 'components/Text';
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import colors from 'styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from 'reducers/rootReducer';
import { OpenGraphParser } from 'react-native-opengraph-kit';

const charLimits = {
  url: 1000,
  note: 2000,
  title: 200,
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


  const discardAlert = (discardCallback: () => void) => {
    Alert.alert(
      'Discard changes?',
      'You have unsaved changes. Are you sure you want to discard them?',
      [
        { text: "Stay", style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: discardCallback,
        },
      ]
    );
  }

  const uid = useSelector((state : RootState) => (state.firestore.data.userData.id));
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!hasUnsavedChanges || navigation.canGoBack()) {
         return false; // regular back button behavior
      }
      // Prompt the user before leaving the screen
      discardAlert(BackHandler.exitApp)
      return true; // stop event from bubbling
    });
    return () => backHandler.remove();
  }, [navigation, hasUnsavedChanges])

  // Add warning before discarding unsaved rock
  useEffect(() => (
    navigation.addListener('beforeRemove', (e) => {
      if (!hasUnsavedChanges) {
        return;
      }
      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Prompt the user before leaving the screen
      discardAlert(() => navigation.dispatch(e.data.action))
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
            if (navigation.canGoBack()){
              navigation.goBack();
            } else {
              BackHandler.exitApp();
            }
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

  const trunc = (str: string, len: number): string => {
    if (str.length <= len) return str;
    return str.slice(0,len-3)+'...'
  }

  useEffect(() => {
    if (url && !title) { 
      updateUrl(url)
    }
  }, [url, title])

  const updateUrl = (text: string) => {
    const url = text.replace(/(\r\n|\n|\r)/gm, "")
    updateForm({url: url})
    OpenGraphParser.extractMeta(url)
    .then((data: any) => {
      if (!data[0]) return;
      if (data[0].title){
        updateForm({title: trunc(data[0].title, charLimits.title), url: url})
      }
    })
    .catch(() => {
      // ignore errors
    });
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
          onChangeText={updateUrl}
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
          mode={'contained'}
          color={colors.blue}
          accessibilityLabel="Send Rock"
          disabled={!formIsReady || disableSubmit}
        >{submitted ? "Sent!" : "Send!"}</Button>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  errorMessage: {
    color: "red",
  },
  selectContactText: {
    color: colors.primaryDark,
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
