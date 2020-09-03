import React, { useState, useRef, useEffect, ReactElement } from 'react';
import { StyleSheet, View, Pressable, Animated } from 'react-native';
import Text from 'components/Text';

const emojis = ['👍','😍','🤣','🤔','😑']
// const emojis = '12345'.split('');
const springVals = {
  stiffness: 150,
  damping: 6,
  mass: .3,
  useNativeDriver: true
}

interface ReactionOption {
  selected: boolean
  text: string
  fullSize: number
}

const ReactionOption = ({selected, text, fullSize}: ReactionOption): ReactElement=> {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const fadeIn = () => {
    Animated.spring(fadeAnim, {
      toValue: 1,
      ...springVals,
    }).start();
  };

  const fadeOut = () => {
    Animated.spring(fadeAnim, {
      toValue: 0,
      ...springVals,
    }).start();
  };

  useEffect(()=> {
    if (selected) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [selected])

  const opacityAnim = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [.7, 1]
  });
  const scaleAnim = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [.7, 1]
  });
  
  return (
    <Animated.Text style={{ opacity: opacityAnim, transform: [{scale: scaleAnim}]}}>
      <Text style={{fontSize: fullSize}}>{text}</Text>
    </Animated.Text>
  )
}

interface ReactionSelector {
  onSelect: (text: string) => void
}

const ReactionSelector = ({onSelect}: ReactionSelector): ReactElement => {
  const [selectedEmoji, setSelectedEmoji] = useState('');
  
  const select = (emoji: string) => {
    setSelectedEmoji(emoji);
    onSelect(emoji)
  }

  return (
    <View style={styles.main}>
    {emojis.map(emoji => (
      <Pressable
        key={emoji}
        onPress={() => {
          if (emoji == selectedEmoji) {
            select('')
          } else {
            select(emoji)
          }
        }}
        style={styles.pressable}
      >
        <ReactionOption 
          selected={emoji == selectedEmoji}
          text={emoji}
          fullSize={30}
        />
      </Pressable>
    ))}
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 45,
  },
  pressable: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
})

export default ReactionSelector;