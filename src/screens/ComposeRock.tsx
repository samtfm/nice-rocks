import React, { ReactElement, useEffect, useState } from 'react';
import NewRockForm from 'components/NewRockForm'
import { StyleSheet, ScrollView } from 'react-native';
import ShareExtension from 'react-native-share-extension'

interface SharedItem{
  type: string,
  value: string,
};

interface ComposeRock{
  route: any
}
const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/

const ComposeRock = ({route}: ComposeRock): ReactElement => {
  const toUserId = route && route.params && route.params.toUserId;
  const share = route && route.params && route.params.share;
  const [url, setUrl] = useState(route && route.params && route.params.url || '')
  const [title, setTitle] = useState(route && route.params && route.params.title || '')
  useEffect(() => {
    if (share) {
      ShareExtension.data().then(({type, value}: SharedItem) => {
        if (type === 'text/plain'){
          if (value && value.match(URL_REGEX)) {
            setUrl(value);
          } else {
            setTitle(value);
          }  
        } 
      })
    }
  }, []);

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.main}>
      <NewRockForm toUserId={toUserId} title={title} url={url}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex:1,
    padding: 10,
  },
});

export default ComposeRock;
