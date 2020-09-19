import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef>();
export const isReadyRef: any = React.createRef();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const MAX_TRIES = 20
export function navigate(name: string, params: any, tries: number = 0): void {
  const retry = () => {
    setTimeout(() => {
      navigate(name, params, tries+1)
    }, 500);
  }
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    try {
      navigationRef.current.navigate(name, params);
    } catch (e) {
      if (tries < 3) {
        retry()
      }
    }
  } else {
    if (tries < MAX_TRIES) {
      retry()
    }
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function reset(state: any): void {
  navigationRef?.current?.reset(state);
}

