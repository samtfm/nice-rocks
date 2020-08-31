import React, {useState, useEffect, useRef} from 'react';
import Text from 'components/Text';
import { StyleSheet, View, KeyboardAvoidingView, Button, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { TextInput } from 'react-native-paper';
import colors from 'styles/colors';
import { white } from 'react-native-paper/lib/typescript/src/styles/colors';

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
  // const fadeAnim = useRef(new Animated.Value(0)).current 
  // useEffect(() => {
  //   if (isFocused){
  //     Animated.timing(
  //       fadeAnim,
  //       {
  //         toValue: 100,
  //         duration: 1000,
  //         useNativeDriver: true,
  //       }
  //     ).start()  
  //   } else {
  //     Animated.timing(
  //       fadeAnim,
  //       {
  //         toValue: 0,
  //         duration: 1000,
  //         useNativeDriver: true,
  //       }
  //     ).start()
  //   }
  //   }, [isFocused, fadeAnim])

  const [expanded, setExpanded] = useState(false);

  
  return (
    <KeyboardAvoidingView behavior={'position'}>
      <View style={styles.container}>
        {formVisible && (
          <View style={styles.responseForm}>
          <TextInput 
            style={styles.input}
            label="Title"
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
          <Button 
            title="Send"
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
          />

          </View>
        )}
      <View style={{position: 'relative', top: 0, zIndex: 0}}>

      {buttonVisible && <Button 
        title="Respond"
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
      />}
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