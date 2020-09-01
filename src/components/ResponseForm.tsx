import React, {useState} from 'react';
import { StyleSheet, View, KeyboardAvoidingView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import ReactSelector from './ReactSelector';
import { useFirebase } from 'react-redux-firebase';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const springAnimConfig = {
  duration: 700,
  create: { type: 'spring', property: 'scaleXY', springDamping: 1.2, duration: 500 },
  update: { type: 'spring', springDamping: 1.2, duration: 500},
  delete: { type: 'spring', property: 'scaleXY', springDamping: 1.2, duration: 500  },
}
const ResponseForm = () => {
  const [responseText, setResponseText] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [reaction, setReaction] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const firebase = useFirebase()


  const onPressCancel = () => {
    // do any un-animated changes first:
    setTimeout(() => {
      setButtonVisible(true);
    }, 400)
    // then:
    setTimeout(()=>{
      LayoutAnimation.configureNext(springAnimConfig)
      setFormVisible(false)
      setError('')
    },0);
  }
  const onPressSend = () => {
    setSending(true)
    setError('')
    new Promise(function(resolve) {
      setTimeout(resolve, 1000);
    }).then(() => {
    
    // const ref = `profiles/${}/rocks/${}`
    // firebase.update(ref,{
    //   response: {
    //     note: responseText,
    //     reaction: reaction,
    //   }
    // }).then(() => {
      LayoutAnimation.configureNext(springAnimConfig)
      setFormVisible(false)
      setSending(false)
    }).catch(() => {
      setError("Error sending response")
      setSending(false)
    });
  }
  
  return (
    <View >
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        {formVisible && (
          <View style={styles.responseForm}>
            <ReactSelector onSelect={setReaction}/>
            <TextInput 
              style={styles.input}
              label="Note"
              onChangeText={text => setResponseText(text)}
              value={responseText}
              maxLength={1000}
              autoCompleteType={'off'}
              multiline
              dense
            />
            <HelperText
              type="error"
              visible={Boolean(error)}
            >{error}</HelperText>
            <View style={styles.buttons}>
              <Button 
                onPress={onPressCancel}
              >CANCEL</Button>
              <Button 
                mode='contained'
                disabled={!(responseText || reaction) || sending}
                loading={sending}
                onPress={onPressSend}
              >SEND</Button>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>

        <View style={{position: 'relative', top: 0, zIndex: 0}}>
        {buttonVisible && <Button 
          disabled={formVisible}
          onPress={() => {
            // do any un-animated changes first:
            setButtonVisible(false);
            // then:
            setTimeout(()=>{
              LayoutAnimation.configureNext(springAnimConfig)
              setFormVisible(true)
            },100);
          }}
        >RESPOND</Button>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  responseForm: {
    padding: 10,
    backgroundColor: 'white',
    width: 300,
    borderRadius: 4,
    justifyContent: 'space-around',
    marginBottom: 10,

    //android
    elevation: 4,

    //ios
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  input: {
    backgroundColor: 'white',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
})

export default ResponseForm;