import React, {useState} from 'react';
import { StyleSheet, View, KeyboardAvoidingView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import colors from 'styles/colors';

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
  
  return (
    <KeyboardAvoidingView behavior={'position'}>
      <View style={styles.container}>
        {formVisible && (
          <View style={styles.responseForm}>
          <TextInput 
            style={styles.input}
            label="Note"
            onChangeText={text => setResponseText(text)}
            value={responseText}
            maxLength={1000}
            multiline={true}
            theme={{
              fonts: { regular: {
                fontFamily: 'Bitter-Regular',
                fontWeight: 'normal',
              }},
              colors: { primary: colors.blue },
            }}
            autoCompleteType={'off'}
            dense={true}
          />
          <View style={{flexDirection: 'row'}}>
            <Button 
              onPress={() => {
                // do any un-animated changes first:
                setTimeout(() => {
                  setButtonVisible(true);
                }, 400)
                // then:
                setTimeout(()=>{
                  LayoutAnimation.configureNext(springAnimConfig)
                  setFormVisible(false)
                },0);
              }}
            >CANCEL</Button>
            <Button 
              mode='contained'
              disabled={!Boolean(responseText)}
              onPress={() => {
                // do any un-animated changes first:
                setTimeout(() => {
                  setButtonVisible(true);
                }, 400)
                // then:
                setTimeout(()=>{
                  LayoutAnimation.configureNext(springAnimConfig)
                  setFormVisible(false)
                },0);
              }}
            >SEND</Button>
          </View>
          </View>
        )}
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
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  responseForm: {
    padding: 10,  
    backgroundColor: 'white',
    minHeight: 120,
    width: 200,
    justifyContent: 'space-around',
  },
  input: {
    // backgroundColor: 'transparent',
  }
})

export default ResponseForm;